-- Shared, atomic counters for all Vercel instances. No prompts, JDs, raw IPs,
-- or credentials are stored here. Keys are server-side HMACs and request hashes.
create table if not exists public.portfolio_ai_usage (
  key text not null,
  at timestamptz not null default clock_timestamp()
);
create index if not exists portfolio_ai_usage_key_at on public.portfolio_ai_usage (key, at);
create index if not exists portfolio_ai_usage_at on public.portfolio_ai_usage (at);
create table if not exists public.portfolio_ai_duplicates (
  key text primary key,
  expires timestamptz not null
);
alter table public.portfolio_ai_usage enable row level security;
alter table public.portfolio_ai_duplicates enable row level security;
revoke all on public.portfolio_ai_usage, public.portfolio_ai_duplicates from public, anon, authenticated;

create or replace function public.portfolio_ai_reserve(p_rules jsonb, p_claims jsonb default '[]'::jsonb)
returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  r jsonb; c jsonb; n bigint; oldest timestamptz; expires_at timestamptz;
  t timestamptz; amount integer; cap integer; win integer;
  remaining jsonb := '{}'::jsonb; resets jsonb := '{}'::jsonb;
begin
  if jsonb_typeof(p_rules) <> 'array' or jsonb_typeof(p_claims) <> 'array'
    or jsonb_array_length(p_rules) > 8 or jsonb_array_length(p_claims) > 2 then
    raise exception 'Invalid guard request';
  end if;
  -- Low-volume portfolio traffic: one transaction lock keeps checks and reserves
  -- atomic, including the daily ceiling, without distributed read/write races.
  perform pg_advisory_xact_lock(1768540921);
  t := clock_timestamp();
  delete from public.portfolio_ai_usage where at <= t - interval '24 hours';
  delete from public.portfolio_ai_duplicates where expires <= t;
  for c in select value from jsonb_array_elements(p_claims) loop
    select expires into expires_at from public.portfolio_ai_duplicates where key = c->>'key';
    if found then return jsonb_build_object('allowed', false, 'reason', 'duplicate', 'retryAfter', greatest(1, ceil(extract(epoch from expires_at - t)))); end if;
  end loop;
  for r in select value from jsonb_array_elements(p_rules) loop
    amount := coalesce((r->>'amount')::integer, 1);
    cap := (r->>'limit')::integer; win := (r->>'window')::integer;
    if amount not in (0, 1) or cap < 0 or cap > 1000000 or win < 1 or win > 86400000 or length(r->>'key') > 250 then raise exception 'Invalid guard rule'; end if;
    select count(*), min(at) into n, oldest from public.portfolio_ai_usage
      where key = r->>'key' and at > t - win * interval '1 millisecond';
    if amount > 0 and n + amount > cap then
      return jsonb_build_object('allowed', false, 'reason', r->>'reason', 'retryAfter', greatest(1, ceil(extract(epoch from coalesce(oldest, t) + win * interval '1 millisecond' - t))));
    end if;
    remaining := remaining || jsonb_build_object(r->>'key', greatest(0, cap - n - amount));
    resets := resets || jsonb_build_object(r->>'key', floor(extract(epoch from coalesce(oldest, t) + win * interval '1 millisecond') * 1000));
  end loop;
  for r in select value from jsonb_array_elements(p_rules) loop
    if coalesce((r->>'amount')::integer, 1) > 0 then insert into public.portfolio_ai_usage(key, at) values (r->>'key', t); end if;
  end loop;
  for c in select value from jsonb_array_elements(p_claims) loop
    if (c->>'ttl')::integer < 25000 or (c->>'ttl')::integer > 300000 then raise exception 'Invalid duplicate window'; end if;
    insert into public.portfolio_ai_duplicates(key, expires) values(c->>'key', t + (c->>'ttl')::integer * interval '1 millisecond');
  end loop;
  return jsonb_build_object('allowed', true, 'remaining', remaining, 'resets', resets);
end;
$$;
revoke all on function public.portfolio_ai_reserve(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.portfolio_ai_reserve(jsonb, jsonb) to service_role;

-- Extend the existing analytics schema safely on both fresh and existing installs.
alter table public.portfolio_assistant_events add column if not exists request_type text not null default 'chat';
alter table public.portfolio_assistant_events drop constraint if exists portfolio_assistant_events_outcome_check;
alter table public.portfolio_assistant_events add constraint portfolio_assistant_events_outcome_check
  check (outcome in ('answered', 'off_topic', 'prompt_injection', 'rate_limited', 'browser_limited', 'global_limited', 'duplicate', 'invalid_input', 'insufficient_evidence', 'provider_failure', 'guard_unavailable', 'api_error'));

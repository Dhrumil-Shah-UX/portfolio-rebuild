create table if not exists public.portfolio_assistant_events (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  timestamp timestamptz not null default now(),
  question text,
  category text not null,
  retrieved_projects text[] not null default '{}',
  outcome text not null check (outcome in ('answered', 'insufficient_evidence', 'api_error')),
  jd_mode boolean not null default false,
  constraint jd_text_not_stored check (not jd_mode or question is null)
);
alter table public.portfolio_assistant_events enable row level security;
revoke all on public.portfolio_assistant_events from anon, authenticated;
-- No public policies. Inserts use the server-side service-role key only.
create index if not exists portfolio_assistant_events_timestamp_idx
  on public.portfolio_assistant_events (timestamp desc);

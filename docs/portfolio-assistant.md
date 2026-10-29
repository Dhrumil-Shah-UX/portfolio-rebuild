# Portfolio assistant

The existing UI calls two same-origin Vercel Node functions:

- POST /api/portfolio-chat: { question, history?, sessionId? }
- POST /api/portfolio-jd-match: { jobDescription, history?, sessionId? }

Text-only JSON; no attachments. Limits: question 1,500 characters, JD 12,000,
body 60KB (including Unicode and history). At most eight history entries are
accepted; only the last four, 500 characters each, reach Gemini. Errors return
safe messages without provider details (400/403/405/409/415/429/503).

## Setup

1. Use Node 22.16+ or Node 24. Copy .env.example to .env.local and set
   GEMINI_API_KEY. No public/browser prefix on secrets.
2. npm start serves the portfolio and API at localhost:3000. Plain static
   servers cannot execute these routes.
3. On Vercel use the Other framework preset and committed vercel.json. Add
   GEMINI_API_KEY in Environment Variables and redeploy. The build copies only
   public assets into dist/: no server source, SQL, tests, or dotenv files.
4. Optional GEMINI_MODEL overrides the centralized default in server/config.js:
   gemini-3.5-flash-lite. Google model/free-tier availability and quota vary by
   project; no paid fallback is enabled.
5. Before deploying the new protections to Vercel, run
   `supabase/portfolio-assistant.sql`, then `supabase/portfolio-assistant-protection.sql`
   in your Supabase SQL editor. Configure `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` in Vercel, server-side only, then redeploy.
   The second script migrates existing analytics installations as well.
   The guard RPC is callable only by the service role, with private tables and
   an atomic transaction lock covering all instances and both API routes.
   Without working shared storage, production AI calls pause with a friendly
   fallback; browsing still works. Local development uses in-memory counters
   unless Supabase is configured. Memory counters reset with the local process.

## Retrieval and grounding

### Curated common questions

`server/common-answers.js` is the single maintenance file for the 18 approved
answers, canonical questions, alternate complete phrases, evidence links, tags,
intent, and follow-up IDs. Edit that file to add a phrasing or update an answer.
Follow-up IDs resolve to the canonical questions in the same file.

Matching lowercases text, removes simple punctuation and apostrophes, collapses
whitespace, and compares the entire normalized question to the approved phrases.
There is no keyword, substring, fuzzy, or model-based classification. Additional
conditions, compound questions, negation, and contextual references do not match
unless explicitly curated; they continue through the existing scope, retrieval,
cache, and Gemini flow. Unrelated, unsafe, or unsupported requests still receive
the existing safe response instead of necessarily calling Gemini.

After input/origin validation and injection screening, chat matches return the
UI's normal answer/evidence/follow-up fields plus `source: "common-answer"` and
`usageConsumed: false`. They skip retrieval, browser allowance reservations,
duplicate reservations, and Gemini/global quota reservations. Raw attempt limits
still apply. The browser refunds its temporary reservation, and can submit common
questions even when its AI allowance is exhausted. Free-form questions still face
the server's existing allowance checks; JD matching keeps its separate flow.
Analytics records `source` in the handler event and persists
`category: "common-answer:<id>"` using the existing analytics schema, with outcome
`answered`; no schema migration is needed and no question text is stored.

Canonical IDs, in question order:

1. `designer-profile`
2. `strongest-projects`
3. `role-fit`
4. `designer-difference`
5. `project-ownership`
6. `design-process`
7. `research-experience`
8. `healthcare-experience`
9. `trialbridge`
10. `technical-skills`
11. `virtual-showroom`
12. `ai-workflow`
13. `ai-projects`
14. `ai-philosophy`
15. `accessibility`
16. `teamwork`
17. `tools`
18. `first-project`

Examples: “Can he code?” maps to `technical-skills`, “Tell me about his Mayo
work” to `healthcare-experience`, “How does he use AI?” to `ai-workflow`, and
“Show me his AI projects” to `ai-projects`. “Can he code in Rust?” does not
match the broad technical answer. “How did physician feedback change TrialBridge
onboarding?” continues through retrieval and Gemini.

The four visible assistant starter prompts are the designer overview, strongest
healthcare work, AI workflow, and technical work. The hero suggestions use those
same four questions with the existing button styling. Typing a JD request still opens the
existing separate JD form.

### Retrieved free-form answers

server/knowledge.js contains reviewed statements, source page paths, real internal
URLs, project IDs, and tags. Update it with portfolio changes. Ownership boundaries
and academic context are explicit. TODOs and unreviewed copy are excluded.

server/retrieval.js normalizes keywords, expands aliases, scores tags and text,
scopes named projects, and carries previously named projects into follow-ups.
It sends up to eight relevant facts to Gemini with per-project caps. No complete
portfolio, external search, or embeddings are sent.

Gemini interprets the question and selects/orders evidence using structured JSON.
The server validates every ID and resolves links locally. Answers and expandable
details use verified source text: unsupported paraphrases are replaced with cited
statements. This deliberately trades conversational prose for stricter grounding.
Deterministic scope rules reject unrelated and injection requests with a fixed
portfolio-only response before Gemini is called. Unsupported portfolio questions
return the canonical insufficient-evidence response.
A deterministic management guard prevents confusing project teams with management.

For JDs, Gemini extracts up to eight material requirements as exact JD substrings.
The server validates excerpts, fact IDs and common hard constraints; it also surfaces
omitted requirements such as years, tools and seniority. Strong means all extracted
requirements have evidence, Moderate means at least half, otherwise Partial. No
percentage is returned. This compares extracted requirements and is not a validated
hiring rubric. Gaps mean only not documented in retrieved evidence, never that the
person lacks the skill. Review the extracted requirements under Show more detail.

The UI retains bounded plain-text conversation context in page memory. Full JD text
is not persisted or resent during chat. JD follow-ups retain project references;
paste the JD again to rerun its full requirements comparison.

## Analytics and privacy

Without Supabase configuration, local analytics emits JSON events to server logs.
With Supabase, events use the existing table plus the protection migration. RLS
has no public policies; never expose the service-role key in the browser.

Events include anonymous session UUID, timestamp, request type, category, retrieved
project IDs, outcome, and JD mode. Outcomes distinguish answered, off-topic,
injection, rate-limited, browser-limited, global-limited, duplicate, invalid input,
insufficient evidence, provider failure, and guard failure. Question text is
always null. No JD, prompts, chat text, history, raw IP, secrets, or provider
response is persisted by this layer. `ANALYTICS_ENABLED=false` disables analytics
but does not disable abuse counters. Choose retention for your table/log provider.
Shared usage tables store only HMAC identifiers, counters' timestamps and duplicate
hashes; expired entries are pruned on each guard transaction.

Free-form input and JDs can be transmitted to Google Gemini. Curated common
questions are answered on the portfolio server without contacting Gemini.
Portfolio analytics settings do not control
Google processing/retention. The UI discloses JD transmission and advises against
confidential information.

## Reliability and tests

Provider timeout 18 seconds, client 30, Vercel maximum 30. Output is capped at
1,200 tokens. No retries, secondary moderation calls, external tools or model
fallback. Provider 429s, timeouts, invalid output and outages return a generic
friendly fallback, with direct Work/Resume and known project links in the UI.

## Configurable limits

All settings below are server-only and optional; defaults are shown in `.env.example`.

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORTFOLIO_AI_REQUESTS_PER_MINUTE` | 5 | Provider-bound requests per rolling minute, checked by both IP and session |
| `PORTFOLIO_AI_REQUESTS_PER_HOUR` | 30 | Provider-bound requests per rolling hour, both IP and session |
| `PORTFOLIO_AI_CHAT_DAILY_LIMIT` | 20 | Submitted chat questions per browser/session, rolling 24 hours |
| `PORTFOLIO_AI_JD_DAILY_LIMIT` | 3 | Submitted JD analyses per browser/session, rolling 24 hours |
| `PORTFOLIO_AI_DAILY_LIMIT` | 100 | Global provider reservations per UTC day; 0 pauses new provider calls |
| `PORTFOLIO_AI_WARNING_PERCENT` | 90 | Log one warning when daily reservations cross this percentage |
| `PORTFOLIO_AI_ATTEMPTS_PER_MINUTE` | 30 | All POST attempts per rolling minute, both IP and session |
| `PORTFOLIO_AI_ATTEMPTS_PER_HOUR` | 120 | All POST attempts per rolling hour, both IP and session |
| `PORTFOLIO_AI_DUPLICATE_WINDOW_SECONDS` | 30 | Same normalized body/history blocked per session or IP; minimum 25, maximum 300 |
| `PORTFOLIO_AI_CACHE_TTL_SECONDS` | 3600 | Safe common-answer cache lifetime; maximum 86400 |
| `PORTFOLIO_AI_IDENTITY_SECRET` | Supabase service key | Optional independent HMAC secret for pseudonymous IP/session keys |

No provider quota is hard-coded. Provider failures consume reservations
conservatively; no automatic retry can spend extra calls. Off-topic and injection
attempts count against raw attempt limits and browser allowances, but not provider
or global-call counters. Validation failures count against raw attempt limits.
Duplicates are blocked before a second allowance/provider reservation and return
409; rate/allowance/ceiling denials return 429 with Retry-After. Only the same
normalized question, mode and history is a duplicate; legitimate follow-ups keep
their context. Changes in IP cannot bypass a session limit; new session IDs cannot
bypass the IP limit. These are v1 anonymous controls, not proof of a unique person.

The browser stores only a stable UUID, rolling timestamps and allowance snapshots
in localStorage. It disables submit while pending and JD submit when exhausted,
keeps chat available for curated questions, shows helper text
only at three chat questions or one JD analysis remaining, and retains Work/Resume
links. JD and chat quotas are independent. Storage failures fall back to page
memory, while server checks still apply. Reloading does not reset localStorage.

If changing browser daily limits, the UI learns updated limits from server
responses. A previously exhausted browser may conservatively wait for its current
window to reset before learning a higher limit.

## Caching

Only explicit, context-free common question aliases are cached: healthcare,
AI projects/workflow, technical work, ownership, and accessibility. TrialBridge
ownership has a different key from generic ownership. Any conversation history,
personalized wording, or JD mode bypasses this cache. Only validated, grounded
answers (or canonical insufficient evidence) enter it. Keys include the knowledge
base content and current model; changing either invalidates old entries. Cache
hits still use browser allowances/abuse checks, but skip provider and global-call
counters. The cache is bounded to the small alias list, per warm instance; no
personalized JD or raw question text is cached. It is not a distributed cache.

npm run test:assistant runs contract/security, allowance, caching, concurrency and
HTTP tests, including the four portfolio questions and a Product Designer JD.
Shared RPC requests and fail-closed behavior are tested using mocked HTTP; running
the SQL migration in your actual Supabase project remains a deployment setup step.
npm run test:assistant:live runs actual Gemini checks after key setup, clearly
skips without a key, and never prints credentials. npm run build checks public
packaging.

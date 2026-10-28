# Portfolio assistant

The existing UI calls two same-origin Vercel Node functions:

- POST /api/portfolio-chat: { question, history?, sessionId? }
- POST /api/portfolio-jd-match: { jobDescription, history?, sessionId? }

Text-only JSON; no attachments. Limits: question 2,000 characters, JD 20,000,
body 40KB, history eight entries. Errors return safe messages without provider
error details, using appropriate 400/403/405/415/429/503 status codes.

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

## Retrieval and grounding

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
Unrelated/unsupported questions return the canonical insufficient-evidence response.
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

No existing Supabase setup was found. Without configuration, analytics emits JSON
events to server logs. For persistent storage, run supabase/portfolio-assistant.sql
and configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY server-side. RLS has no
public policies; never expose the service-role key in the browser.

Events include anonymous session UUID, timestamp, question/category, retrieved
project IDs, answered/insufficient/API-error outcome, and JD mode. JD question text
is always null. No full JD, history, raw IP, or provider response is persisted by
this layer. ANALYTICS_STORE_QUESTIONS=false omits chat text; ANALYTICS_ENABLED=false
disables events. Analytics errors do not break chat. Choose retention settings for
the Supabase table and log provider.

Input is transmitted to Google Gemini. Portfolio analytics settings do not control
Google processing/retention. The UI discloses JD transmission and advises against
confidential information.

## Reliability and tests

Provider timeout 18 seconds, client 25, Vercel maximum 30. Bounded output tokens,
low-temperature JSON, no retry loops, external tools or paid-model fallback.

Basic in-memory limits: 12 requests per IP per minute, 120 per warm instance. Only
ephemeral IP hashes are used. Limits reset on cold start and are not shared across
instances. Add Vercel Firewall or a shared limiter for significant traffic. Other
protections: same-origin checks, input bounds, escaped text, locally resolved links,
JSON-only POST and no-store responses.

npm run test:assistant runs mocked-provider contract/security and HTTP tests,
including the four requested questions and a Product Designer JD.
npm run test:assistant:live runs actual Gemini checks after key setup, clearly
skips without a key, and never prints credentials. npm run build checks public
packaging.

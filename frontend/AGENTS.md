# Next.js frontend and server

Read ../AGENTS.md, ../docs/PLAN.md and ../docs/DATABASE.md first. This is one Next.js App Router application. Preserve the source UI in ../docs/UI_DESIGN.jsx and the DB diagram; do not import the prototype or implement its excluded features.

## Current code

- app/layout.tsx and components/header.tsx: public header with session-aware Google login/sign-out actions. components/primary-nav.tsx highlights navigation.
- app/page.tsx and components/cab-estimator.tsx: supplied landing-page hero and interactive cab assumptions.
- app/learn/: domain/type hubs. components/learning-shell.tsx supplies desktop navigation and a native mobile menu, including category/guide links.
- app/blogs/[slug]/page.tsx: published Markdown guide, key points, sample PDF, table of contents and comments. Domain is navigation context; shared guides/comments retain one ID.
- app/auth/actions.ts and auth/callback/route.ts: Supabase Google OAuth with PKCE, verified identity and allowlisted return paths. OAuth start/callback must preserve the browser origin so PKCE cookies stay on the same host. proxy.ts refreshes cookies using getClaims. Email/password is deferred by the user's latest instruction.
- app/blogs/actions.ts: validates and posts comments using the verified session user. Next.js server actions provide origin checks. Database RLS remains authoritative.
- lib/supabase/server.ts: publishable-key SSR client only. Never use DATABASE_URL, database passwords or service-role credentials in normal app requests.
- lib/guides.ts: published guide/comment queries. Author data comes from the explicit public projection, not full profiles.
- lib/content.ts and content/guides/: allowlisted repository Markdown. Raw HTML is skipped in ReactMarkdown; use Markdown tables and lists.
- public/pdfs/: labelled static sample PDF, not the future editorial PDF pipeline.
- app/api/health/route.ts: app health only, not a database health probe.

## Commands from repository root

- npm ci; npm run dev: install and run locally. next.config.mjs loads root .env when present; deployment environment values take precedence.
- npm run typecheck; npm run build: check types and production compilation.
- npm test: pure validation, content-path, taxonomy and estimator tests.
- npm run test:integration: builds and runs the app on local test ports with controlled Supabase HTTP fixtures. Exercises actual Next actions/cookies/SSR, not live Google consent.
- npm run test:db: two clean migration and RLS test cycles in a disposable Docker database, independent of hosted Supabase.

Keep server components by default. Only navigation state, sliders and pending comment forms need client components. Preserve loading/pending, failure and empty states. Do not add a global streaming loading boundary that turns missing pages into HTTP 200 responses; test real status codes.

Hosted migrations, live Google callback verification, Vercel preview and visual/mobile QA are separate verification steps. Do not report them complete from fixture or SQL tests alone.

## Navigation performance

Use verified getClaims for read-only identity and React request-scoped caching, never an unverified getSession user object. Do not globally cache a user's session. Comment mutations retain getUser to verify the active session. Reader/sidebar queries run concurrently, followed by parallel content/identity/comment reads. Do not cache publication checks across requests without explicit invalidation: archived guides must remain inaccessible. Functions target syd1 to match the current Supabase region.

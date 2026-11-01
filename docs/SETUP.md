# Local setup

Use Node.js 24 LTS, npm and Docker (for database tests). From the repository root, run npm ci and npm run dev. Open http://localhost:3000. Stop with Ctrl+C.

Root .env contains NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and NEXT_PUBLIC_SITE_URL. The last defaults to http://localhost:3000. The frontend Next.js configuration loads that file; existing environment values take precedence. Keep credentials untracked. No service-role or database password is used by application requests.

Migrations must be applied to a development Supabase project before guides/comments work with real data. They preserve the original diagram's fields and include four placeholder guides whose Markdown lives under frontend/content/guides. The public sample PDF is deliberately static. Missing configuration or unavailable content produces a failure state, not a fake successful integration.

Google is the only current sign-in method. Enable the Google provider in Supabase and configure callback URLs as described in DEPLOYMENT.md. New Google users get a profile automatically, and existing auth identities are backfilled by the migration. Email/password confirmation/reset UI is deferred by the user's latest instruction.

## Checks

- npm run typecheck: strict TypeScript and generated route types.
- npm run build: production build with the current environment.
- npm test: five unit tests for safe OAuth return paths, comment validation, content paths, taxonomy and arithmetic.
- npm run test:integration: builds with controlled, non-secret test environment values and starts localhost fixture/app servers on ports 4410 and 3300. It exercises public navigation, shared guides, Markdown, escaped comments, PDF download, PKCE callback cookies, posting and sign-out. Servers stop afterward. The generated .next build uses test settings; run npm run dev or rebuild with npm run build before serving against your real project.
- npm run test:db: two clean PostgreSQL 17 migration/test cycles in an isolated Docker container. Never reads .env, exposes host ports or modifies hosted Supabase.

The HTTP fixture is a contract test double, not evidence that Google's consent screen or Supabase deployment settings work. SQL tests independently enforce publication rules, profile privacy, author projections, exclusive targets, identity and moderation. GitHub runs both suites.

## Content maintenance

Keep guides.content_path relative to frontend/content/guides. Commit Markdown changes with the app; the renderer supports lists, headings, callouts and tables and skips raw HTML. Preserve key_points and metadata in the database. Use draft/published/archived state rather than deleting referenced content. The reader displays at most the latest 50 visible top-level comments. The owner can hide a comment or set deleted_at through Supabase; no moderation/admin application is included.

GitHub origin is janvi-prepleet/prepleet. The user merges PRs into main. Use repository-local identity, credential-free remote URLs and GIT_KEY from the ignored .env for API/Git operations. Do not embed a token in a command argument or remote URL.

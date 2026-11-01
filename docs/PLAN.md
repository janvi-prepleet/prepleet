# Production MVP Plan

Build PrepLeet with Next.js (frontend and backend), Supabase (database and authentication), repository Markdown and temporary static PDFs, GitHub and Vercel. Check tasks only after implementation and verification. Record limitations and approvals here.

## Scope and decisions

- In scope: signup, login, logout, published guesstimate blogs, PDF downloads, viewing/posting comments, and Practice “Coming soon”.
- Out of scope: working practice, scoring, progress, bookmarks, reactions, payments, AI chat, Kanban, FastAPI, and an admin UI.
- Approved on 2026-11-01: public reading and PDF downloads; email/password authentication with email verification and password reset; posting-only comments with moderation through Supabase.
- User authorized development following this plan on 2026-11-01. The user answered Q1–Q10 and delegated Q11 technical defaults on 2026-11-01. Small PRs may resume; production/DNS changes still require release approval.
- Target GitHub account: `janvi-prepleet`. The supplied `GIT_KEY` authenticated successfully through the GitHub API; local `origin` is `https://github.com/janvi-prepleet/prepleet.git`. Repository-local commit identity uses janvi-prepleet and the verified account’s GitHub noreply address. PR #1 is merged; taxonomy implementation uses a new branch from updated origin/main.
- User instruction on 2026-11-01: strictly follow `docs/DB_DESIGN.png` and the current `docs/UI_DESIGN.jsx`. The earlier reduced database proposal is superseded. Preserve supplied tables, fields, relationships and UI layouts; record any newly discovered gaps in `docs/quries.doc` and pause dependent implementation until the user answers. The existing scaffold is provisional and does not establish the final design.
- Source references: `AGENTS.md`, `docs/UI_DESIGN.jsx`, `docs/DB_DESIGN.png`. The current UI reference is now complete (1,326 lines), superseding the earlier truncated version. Other design filenames shown in IDE tabs are not present on disk. Read the saved file as the current source of truth.
- Development workflow: one small, focused feature branch and PR at a time, with relevant verification and a clear description. The user merges into `main`; the agent does not push implementation directly to `main` or merge PRs. After a merge, base the next chunk on updated remote `main`.
- Domains are Consulting and Product Management (`consulting` / `product` in the UI). Case types and their domain membership come from `TRACK_TYPES`; Guesstimate belongs to both. Do not confuse the case industry labels with domains.

## Frontend and backend implementation tracks

Keep one plan for this Next.js application. Use separate checklists inside each PR chunk so UI and server/data work share the same contract and acceptance tests. Separate frontend/backend plan files are unnecessary at this size and would duplicate dependencies and progress.

| Chunk | Frontend | Next.js server / Supabase | Verification |
| --- | --- | --- | --- |
| Taxonomy (current PR) | Preserve UI names and order; no visual changes | Domains, case types, mappings and public read-only access | Seed membership, constraints and browser-role access tests |
| App foundation | Port the supplied shell and applicable navigation; Practice Coming soon | Next.js setup, environment config and health route | Type check, build and HTTP smoke checks |
| Authentication | Supplied signup/login UI, session-aware navigation and recovery forms | Diagram profile columns, Supabase session/callback/recovery and RLS | Valid/invalid auth, session refresh, logout and ownership checks |
| Guide reading | Domain/type/category hubs and reader matching the supplied UI | Four guide kinds, publication filtering, shared-domain queries and Git Markdown | Domain/category filtering, unpublished access, safe paths and rendering |
| PDF support | Download action in the reader | Map to the temporary static sample PDF | Valid PDF, working download and explicit sample behavior |
| Comments | Add list/form below the reader in the supplied style | Exactly one guide/case target, session identity, validation and moderation | Anonymous read/authenticated post, persistence, invalid input and impersonation denial |
| Preview/release | Responsive/accessibility QA on agreed screens | Vercel config, auth URLs and deployment/migration order | End-to-end journeys in preview before production approval |

### Current chunk: taxonomy foundation

- [x] Confirm PR #1 is merged and branch from updated origin/main.
- [x] Implement domains, case_types and case_domain_mapping without changing diagram names.
- [x] Seed two domains, nine case types and ten mappings from the UI; Guesstimate is shared.
- [x] Add explicit browser SELECT grants, RLS policies and deny browser writes.
- [x] Add a disposable database test runner and GitHub workflow.
- [x] Verify migrations, constraints and role permissions on two clean test databases (PostgreSQL 17 Docker).
- [ ] Publish the small PR and wait for the user's merge before the next chunk.

Frontend checklist for this chunk: no screen changes; keep the supplied UI file unchanged. Backend checklist: versioned schema/reference-data migrations and SELECT-only browser access. Success criteria: a clean database has the expected taxonomy, both domains share one Guesstimate identity, invalid/duplicate relations fail, and browser roles cannot mutate reference data.

## Part 1: Review and plan

- [x] Review repository instructions and supplied references.
- [x] Confirm development authorization and core access/auth/comment defaults.
- [x] Expand the plan with implementation steps, tests and success criteria.
- [x] Record missing credentials, repository details and design limitations.
- [x] Re-review the complete UI against the diagram and record schema gaps in `docs/quries.doc`.
- [x] Receive user answers to `docs/quries.doc` before further implementation; Q11 defaults delegated to the agent.
- [x] Record the approved translation and additions in `docs/DATABASE.md`; do not revive the reduced schema.

Tests and review:
- [x] Check planned features against the root AGENTS.md scope.
- [x] Verify no application or package setup existed before scaffolding.

Success criteria: scope and execution order are clear; product defaults are agreed; database changes do not precede sign-off.

## Part 2: Project foundation

Checked scaffold tasks below describe earlier local-only work, not code merged to main. The scaffold must be ported to the supplied design and delivered through the app-foundation PR; its earlier test results do not verify the new design.

- [x] Create a TypeScript Next.js App Router app in `frontend/`, with backend routes in the same app.
- [x] Add root npm workspace scripts, locked dependencies and Node.js version guidance.
- [x] Add root `.env` placeholders and `.env.example`; exclude credentials and generated output from Git.
- [x] Create the responsive app shell using the supplied design palette.
- [x] Add a starter blog library, readable guide routes, real missing-page response and Practice “Coming soon”.
- [x] Add `/api/health` to verify Next.js backend routing.
- [x] Initialize local Git on `main`.
- [x] Configure repository-local author identity and origin for janvi-prepleet; verify the supplied GitHub key.
- [x] Create `frontend/AGENTS.md` describing actual code and working commands.
- [x] Add GitHub CI for type checks, build and HTTP integration tests.
- [ ] Verify local build, route checks and desktop/mobile rendering; record evidence below.
- [ ] Connect GitHub and verify a Vercel preview after account access is available.

Tests:
- [x] `npm run typecheck` and `npm run build` pass.
- [x] `npm test` passes against the built server: home, library, every starter guide, Practice, missing guide and health API.
- [x] Verify `.env` is ignored by Git.
- [ ] Inspect desktop/mobile layout, navigation and keyboard focus.

Success criteria: a clean checkout installs, builds and runs; frontend and API respond locally; CI configuration is present; remote preview remains explicitly pending until connected.

## Part 3: Database and authentication

Depends on database sign-off and Supabase project access.

- [x] Document the original diagram and UI taxonomy in `docs/DATABASE.md`; withdraw the earlier simplified proposal.
- [x] Record shared-domain behavior, four guide kinds, repository Markdown, static PDFs, exclusive comment targets, one-to-many cardinality and delegated constraints in `docs/quries.doc`.
- [x] Receive answers to the design questions; future cases/company features remain deferred.
- [ ] Create small migration PRs preserving the original design, starting with domains, case types and their mapping; introduce other diagram tables in agreed chunks. Determine constraints and indexes from answered questions without renaming or dropping design fields.
- [ ] Add repeatable development seed data; Markdown and sample PDFs stay in Git for this release. No PDF Storage integration is required now.
- [ ] Add server/browser Supabase clients using the publishable key and request session.
- [ ] Implement signup, confirmation callback, login, logout and persistent sessions.
- [ ] Implement forgotten-password and password-reset flows; validate redirect destinations.
- [ ] Configure auth redirect URLs and email delivery for local, preview and production environments.
- [ ] Show validation, pending and failure states without exposing account data or credentials.

Tests:
- [ ] Apply migrations to an empty test database and verify repeatable reset/seed behavior.
- [ ] Test anonymous, user A and user B permissions directly through Supabase.
- [ ] Test valid/invalid signup and login, verification, session refresh, logout and expired sessions.
- [ ] Test recovery email and valid/expired recovery links; confirm passwords actually change.
- [ ] Verify protected mutations fail without a session and user identity cannot be forged.

Success criteria: real accounts work end to end; RLS enforces access independently of UI; authentication email is delivered; no privileged keys reach the browser.

## Part 4: Core application

Depends on Part 3. Foundation fixtures are temporary and do not count as persistent functionality.

- [ ] Replace static guide fixtures with published Supabase data and stable slug routes.
- [ ] Load guide Markdown from the agreed location referenced by `guides.content_path`; render lists/tables safely and disable raw HTML. Do not substitute a database body column without approval.
- [ ] Reproduce the supplied public page, navigation, domain/type hubs, guide sections and reader layouts for the agreed MVP screens; do not use the provisional scaffold as the visual reference.
- [ ] Add loading, empty, unavailable and error states for content and comments.
- [ ] Add static/hardcoded PDF download support with a clearly identified sample PDF. The user will provide a separate PDF content pipeline later; do not build it now.
- [ ] Show visible comments with safe public author names and login prompts for visitors.
- [ ] Post comments through validated server mutations using the session identity.
- [ ] Enforce comment length limits, prevent accidental duplicate submissions and refresh comments after posting.
- [x] Implement Practice as a Coming soon page without simulations or scoring.
- [ ] Complete responsive and accessible styling for auth, reading, download and comment flows.

Tests:
- [ ] Published guides load; draft/archived/unknown guides are inaccessible by direct slug or ID.
- [ ] PDF downloads open as valid PDFs; missing files and unauthorized object paths fail clearly.
- [ ] Anonymous users can read but cannot post comments; authenticated comments persist after reload.
- [ ] Empty/oversized comments fail; script-like text cannot execute; hidden comments stay hidden.
- [ ] Two users cannot impersonate one another or change moderation state.
- [ ] Browser journeys: signup/login/logout, browse/read/download, login/post/reload, and Practice.

Success criteria: every MVP journey uses real data and access controls; no fixture-only feature is presented as production functionality.

## Part 5: Required integrations and publishing

- [ ] Verify Supabase database and Auth connectivity in the deployed preview, plus repository Markdown and static PDF serving.
- [ ] Document the owner workflow for repository Markdown and guide metadata publishing/updating/archiving. Keep the temporary sample PDF mapping explicit.
- [ ] Prepare launch content and verify each blog/PDF pair.
- [ ] Verify confirmation and password-reset emails with the configured sender.
- [ ] Document owner comment moderation in Supabase; keep administrative controls outside the app.

Tests:
- [ ] Publish a draft and verify guide visibility; archive it and verify guide requests are denied. Document that the temporary sample PDF is a public static asset, not a protected draft document.
- [ ] Hide a comment and confirm it disappears from public reads.
- [ ] Simulate database/content-file/email failures and verify useful user-facing states.

Success criteria: the owner can maintain blogs, PDFs and comments without code changes or an admin UI; all integrations required by the MVP are verified. AI/OpenRouter is not required.

## Part 6: Production readiness

- [ ] Add focused unit tests for validation and authorization logic; extend integration and browser tests for the actual implementation.
- [ ] Review query limits, input sizes and practical comment abuse controls.
- [ ] Review RLS, session handling, redirect safety, rendered content and credential exposure.
- [ ] Check keyboard navigation, labels, visible focus, contrast and mobile layouts.
- [ ] Check loading/error behavior, broken links and page metadata.
- [ ] Measure representative page performance and address observed bottlenecks.
- [ ] Document available backups, a restore procedure, service logs and operational ownership.
- [ ] Resolve release-blocking failures and record accepted limitations.

Tests:
- [ ] All automated checks pass against the release candidate.
- [ ] Core journeys pass on desktop and mobile with a clean browser session.
- [ ] No serious accessibility failures or unauthorized data access remain.
- [ ] Exercise recovery using test data and verify application/database release compatibility.

Success criteria: no known blocker in an MVP journey; test evidence and operational recovery instructions are available for release review.

## Part 7: Deployment and domain

- [ ] Confirm repository, Vercel project, production Supabase project and domain ownership.
- [ ] Set environment-specific credentials, allowed auth URLs and email sender settings.
- [ ] Prepare migration order and rollback plan; verify the preview with representative content.
- [ ] Present the release candidate and verification results for production/DNS approval.
- [ ] Deploy the approved release and apply approved migrations.
- [ ] Configure the approved domain and HTTPS; update auth redirects to match.

Tests:
- [ ] On the actual domain, verify signup/confirmation/login/logout/recovery and every blog journey.
- [ ] Confirm production content and session data are isolated from preview/test environments.
- [ ] Confirm errors are observable and the documented rollback is executable.

Success criteria: approved production URL serves the verified MVP over HTTPS, and auth and PDF delivery work on that domain.

## Part 8: Post-launch and handover

- [ ] Monitor launch errors and resolve reproduced regressions at their root cause.
- [ ] Verify owner publishing and moderation using the documented workflow.
- [ ] Finalize setup, operating instructions and known limitations under `docs/`.
- [ ] Update frontend AGENTS.md and mark only verified plan tasks complete.

Tests: repeat production smoke checks after any launch fix and verify the affected journey.

Success criteria: the user can operate the MVP; ownership, pending items and verified release status are documented.

## Current progress

PR #1 merged on 2026-11-01. The current branch codex/taxonomy-foundation adds taxonomy migrations and tests. One master plan now tracks frontend, server/database and verification work for each chunk. The provisional foundation passed its earlier checks, but does not yet reproduce the full UI. No Supabase schema changes or remote deployments have been made.

Needed from the user:
1. Supabase URL now resolves and database credentials passed a read-only connection test. Resolve the REST API HTTP 401 before application integration.
2. Review and merge each small PR. Repository-local identity uses the verified janvi-prepleet GitHub noreply address.
3. Review and merge the taxonomy PR when available. Q1–Q10 are answered and Q11 choices were delegated; the original DB diagram remains authoritative.
4. Supply Vercel access and the production domain when deployment begins.

## Verification log

- 2026-11-01: confirmed `.env` is ignored; local Git repository initialized on `main`.
- Initial build compiled but failed when Next.js forwarded the Node `--env-file-if-exists` startup flag to build workers via NODE_OPTIONS. Root `.env` loading was moved to `frontend/next.config.mjs`; the subsequent production build and type check passed.
- All four HTTP integration tests passed against the production server (health API, library and all three guides, home/Practice, unknown guide 404). Localhost tests required sandbox network permission.
- Browser preview unavailable: in-app browser creation failed and browser inventory was empty. Visual/mobile/keyboard checks remain unverified. Remote CI and Vercel preview have not run.
- User asked whether the proposed schema matches `DB_DESIGN.png`. It is a reduced alternative, not an exact match. Added a field-by-field comparison to `docs/DATABASE.md`; schema approval remains pending.
- GitHub API authenticated `GIT_KEY` as `janvi-prepleet` and returned the owned `janvi-prepleet/prepleet` repository; configured its credential-free URL as local origin. No commit or push performed. Supabase Auth connectivity failed with DNS ENOTFOUND even outside the sandbox. No Vercel project link exists.
- After updated Supabase configuration: authenticated Postgres `SELECT 1` passed with read-only transactions and TLS; Auth settings returned HTTP 200. REST API returned HTTP 401, including a follow-up with key-type-appropriate headers. Database connectivity is verified, but application integration and REST authorization remain pending. No schema or data changes were made.

## Small PR sequence

Each PR must contain a single reviewable concern, tests appropriate to that change, and any affected documentation. Never mark a chunk merged until GitHub confirms it. Sequence and exact boundaries may change based on answers.

1. Completed: [design baseline PR #1](https://github.com/janvi-prepleet/prepleet/pull/1) merged. It preserves the source designs and resolved decisions. The provisional app scaffold remains local; each implementation PR starts from merged remote main.
2. Add domains, case types and the approved case-domain mapping with seed data from the UI. Test uniqueness, valid domain/type pairs and Guesstimate membership in both domains.
3. Add the Next.js application foundation in a small PR, porting the supplied shell and applicable navigation. Then add profiles and email/password authentication following the supplied account UI and approved fields in a separate PR. Test sessions, confirmation, recovery and per-user access.
4. Add guides, guide categories and content retrieval following the original content_path design and resolved domain rules. Test publication visibility and category/domain filtering.
5. Implement the public page and main navigation exactly for the agreed release screens. Compare desktop/mobile screenshots with the reference and verify keyboard navigation.
6. Implement domain/type hubs and the guide reader, retaining original content, tables, key points and reader tools. Test links, category counts and shared-domain navigation.
7. Add static sample PDF download support as answered in Q3; verify the asset is a valid downloadable PDF. Leave the real content pipeline to the user's later work.
8. Add comments using the diagram's approved target/parent constraints and UI placement; test persistence, identity isolation and moderation.
9. Add the remaining approved diagram tables in separate migrations and Practice Coming soon. Do not implement simulations, subscriptions or community features without an explicit scope decision.
10. Resolve remaining integration failures, create a Vercel preview, and complete release checks in small PRs. Production/DNS remains a separate release checkpoint.

2026-11-01 design review: current UI now includes complete taxonomy, four guide kinds, public/authenticated layouts, expanded profiles and prototype-only broader features. Recorded unresolved gaps in `docs/quries.doc`. Stopped implementation as requested; no PR or migration was created during this review.

2026-11-01 answers: Q1 shared Guesstimates; Q2 four guide kinds and backend-to-UI mapping; Q3 static PDFs pending a separate pipeline; Q4 Git-based Markdown with placeholder content; Q5 add guide comments with exactly one case/guide target; Q6 one-to-many type relationships; Q7 supplied UI with MVP backend only; Q8 diagram profile columns only; Q9/Q10 no dashboard, community or subscriptions. User delegated Q11 production implementation choices. Decisions are recorded in quries.doc and DATABASE.md.

2026-11-01 PR preparation: created codex/design-baseline from origin/main in an isolated worktree. This first PR contains the supplied references, project instructions, resolved design questions and plan only. The locally tested app scaffold, credentials and generated files are excluded. Runtime tests do not apply to this documentation/reference-only change.

2026-11-01: verified PR #1 MERGED (merge commit 34e58a8) and fetched origin/main. Created isolated codex/taxonomy-foundation branch from that merge. Added the frontend/server/test tracking matrix above. No application or shared Supabase schema changes are part of this taxonomy chunk.

2026-11-01 taxonomy verification: both clean PostgreSQL 17 migration/test cycles passed. Tests verified catalog membership/order, uniqueness and input checks, foreign keys, restrictive deletes, actual anon/authenticated read/write behavior, and policy denial after temporary broader grants. Hosted Supabase remained unchanged. Local initdb could not run because libpq lacks the postgres server binary; the test runner uses an isolated disposable Docker container instead. Shell syntax and whitespace checks passed; source UI/DB files are unchanged.

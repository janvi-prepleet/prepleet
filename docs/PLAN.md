# Production MVP Plan

## Current progress

| Area                       | Status                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| PRs #1–#4                  | Merged; latest main is 867210d                                                                          |
| Current IDE directory      | Next branch `codex/hosted-auth-verification`, based on merged main                                      |
| App implementation         | Google auth, guide reading, comments, Markdown and sample PDF implemented                               |
| Automated app checks       | Previous code passed 5 unit and 6 HTTP/action integration tests                                         |
| Hosted Supabase            | All four migrations applied; existing solutions preserved                                               |
| Vercel                     | GitHub main is now connected; current deployment READY in syd1                                          |
| Hosted login configuration | Repaired missing Production app variables and exact callback allowlist; live Google initiation verified |
| Google acceptance          | User confirmed local and Vercel Google login; persistence/logout/comments still pending                 |
| Design acceptance          | Desktop/mobile visual comparison remains pending; exact match not verified                              |
| Production domain          | Using existing prepleet.vercel.app; custom domain remains unconfirmed                                   |

**Run locally:** `npm run dev` in this directory, then open http://localhost:3000.

**Current hosted app:** https://prepleet.vercel.app. Use this stable URL for acceptance, rather than old protected preview URLs.

**Current PR:** [#5: hosted login smoke check and deployment progress](https://github.com/janvi-prepleet/prepleet/pull/5), awaiting review/merge. The remote configuration repair is already live.

**Latest deployment:** `dpl_74NErEu7f1XHjZyx6rMAUPmrYKHm`, source `867210d`, READY, region `syd1`. It redeploys the already-merged code with the corrected Production environment. No custom domain/DNS changes were made.

**Working rule:** all future implementation branches and progress edits stay in this directory. Update this status board during work and before raising a PR; the user merges PRs into main.

Build PrepLeet with Next.js (frontend and backend), Supabase (database and authentication), repository Markdown and temporary static PDFs, GitHub and Vercel. Check tasks only after implementation and verification. Record limitations and approvals here.

## Scope and decisions

- In scope: signup, login, logout, published guesstimate blogs, PDF downloads, viewing/posting comments, and Practice “Coming soon”.
- Out of scope: working practice, scoring, progress, bookmarks, reactions, payments, AI chat, Kanban, FastAPI, and an admin UI.
- Latest decisions on 2026-11-01: public reading/PDFs, Google-only sign-in for now, and posting-only comments with owner moderation. Google auth supersedes the earlier email/password decision; password verification/reset work is deferred. The user authorized combining the remaining MVP into one PR and creation of the Vercel project/preview.
- User authorized development following this plan on 2026-11-01. The user answered Q1–Q10 and delegated Q11 technical defaults on 2026-11-01. Small PRs may resume; production/DNS changes still require release approval.
- Target GitHub account: `janvi-prepleet`. The supplied `GIT_KEY` authenticated successfully through the GitHub API; local `origin` is `https://github.com/janvi-prepleet/prepleet.git`. Repository-local commit identity uses janvi-prepleet and the verified account’s GitHub noreply address. PRs #1 and #2 are merged; combined MVP integration starts from merge 6cf4146 on codex/mvp-integration.
- User instruction on 2026-11-01: strictly follow `docs/DB_DESIGN.png` and the current `docs/UI_DESIGN.jsx`. The earlier reduced database proposal is superseded. Preserve supplied tables, fields, relationships and UI layouts; record any newly discovered gaps in `docs/quries.doc` and pause dependent implementation until the user answers. The existing scaffold is provisional and does not establish the final design.
- Source references: `AGENTS.md`, `docs/UI_DESIGN.jsx`, `docs/DB_DESIGN.png`. The current UI reference is now complete (1,326 lines), superseding the earlier truncated version. Other design filenames shown in IDE tabs are not present on disk. Read the saved file as the current source of truth.
- Development workflow: feature branches and user-merged PRs. Latest user instruction combines the remaining UI/auth/guides/PDF/comments work into one MVP integration PR, with relevant verification and a clear description. The user merges into `main`; the agent does not push implementation directly to `main` or merge PRs. After a merge, base the next chunk on updated remote `main`.
- Domains are Consulting and Product Management (`consulting` / `product` in the UI). Case types and their domain membership come from `TRACK_TYPES`; Guesstimate belongs to both. Do not confuse the case industry labels with domains.

## Frontend and backend implementation tracks

Keep one plan for this Next.js application. Use separate checklists inside each PR chunk so UI and server/data work share the same contract and acceptance tests. Separate frontend/backend plan files are unnecessary at this size and would duplicate dependencies and progress.

| Chunk                   | Frontend                                                                | Next.js server / Supabase                                                       | Verification                                                                           |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Taxonomy (merged PR #2) | Preserve UI names and order; no visual changes                          | Domains, case types, mappings and public read-only access                       | Seed membership, constraints and browser-role access tests                             |
| App foundation          | Port the supplied shell and applicable navigation; Practice Coming soon | Next.js setup, environment config and health route                              | Type check, build and HTTP smoke checks                                                |
| Authentication          | Supplied Google sign-in UI and session-aware navigation                 | Diagram profiles, Supabase PKCE/callback/cookies and RLS                        | OAuth initiation/callback, logout and ownership checks                                 |
| Guide reading           | Domain/type/category hubs and reader matching the supplied UI           | Four guide kinds, publication filtering, shared-domain queries and Git Markdown | Domain/category filtering, unpublished access, safe paths and rendering                |
| PDF support             | Download action in the reader                                           | Map to the temporary static sample PDF                                          | Valid PDF, working download and explicit sample behavior                               |
| Comments                | Add list/form below the reader in the supplied style                    | Exactly one guide/case target, session identity, validation and moderation      | Anonymous read/authenticated post, persistence, invalid input and impersonation denial |
| Preview/release         | Responsive/accessibility QA on agreed screens                           | Vercel config, auth URLs and deployment/migration order                         | End-to-end journeys in preview before production approval                              |

### Current chunk: combined MVP integration

- [x] Confirm PR #2 is merged and branch from updated main (6cf4146).
- [x] Add Next.js workspace, environment setup, CI and health API.
- [x] Port the supplied palette, logo, hero/interactive estimate, navigation, domain/type/category hubs, reader and tools; exclude dashboard/community/subscriptions and show Practice Coming soon.
- [x] Implement Google-only OAuth start/callback, session cookies, verified user reads, logout, profile trigger and backfill.
- [x] Add diagram-aligned profiles/guides/comments and required case/company dependencies, preserving publication and exclusive-target constraints with RLS.
- [x] Add four shared-domain placeholder guides and repository Markdown; label non-MVP case-type content Coming soon.
- [x] Add a rendered/verified static sample PDF and its reader download action.
- [x] Add comment list/form, authenticated posting, bounded input, safe author projection, error/pending states and refresh after successful posting.
- [x] Pass TypeScript, production build, five unit tests, five app integration tests and two clean PostgreSQL migration/test cycles.
- [x] Create the prepleet Vercel project (frontend root, preview application variables only).
- [x] [Combined PR #3](https://github.com/janvi-prepleet/prepleet/pull/3) merged; both CI jobs passed.
- [x] Vercel preview deployment is READY; all four hosted Supabase migrations applied in one transaction, with existing solutions preserved. Anonymous preview HTTP checks redirect to Vercel protection.
- [ ] Verify live Google consent/callback, session persistence, commenting and desktop/mobile visuals in a browser. Browser inventory currently has no available browser.

Test boundaries: HTTP integration uses controlled Supabase fixtures but actual Next.js routing/actions/cookies/rendering. Database tests independently exercise policies as real PostgreSQL browser roles and test existing-user backfill. Neither replaces the live provider/deployment checks. Keep runtime/hosting credentials out of source and never use database passwords in application request handling.

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

The earlier provisional scaffold is superseded by the combined MVP implementation. Its old test evidence is historical; the current branch has separate unit, integration and database checks.

- [x] Create a TypeScript Next.js App Router app in `frontend/`, with backend routes in the same app.
- [x] Add root npm workspace scripts, locked dependencies and Node.js version guidance.
- [x] Add root `.env` placeholders and `.env.example`; exclude credentials and generated output from Git.
- [x] Create the responsive app shell using the supplied design palette.
- [x] Add domain/type/category hubs, database-backed guide routes, real missing-page responses and Practice Coming soon.
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
- [x] Add a server-side Supabase client and cookie refresh proxy using only the publishable key and verified user session. No browser Supabase client is needed for the server-action flow.
- [x] Implement Google signup/login, PKCE callback, logout and session-cookie persistence (fixture-tested; user confirmed live Google login, persistence/logout acceptance pending).
- Deferred by the user: email/password and password recovery. Google account recovery remains with Google.
- [x] Validate OAuth return destinations against allowed app routes.
- [ ] Configure exact Google/Supabase callback allowlists for local/preview/production; email delivery is outside the Google-only MVP.
- [x] Show validation, pending and failure states without exposing account data or credentials.

Tests:

- [ ] Apply migrations to an empty test database and verify repeatable reset/seed behavior.
- [ ] Test anonymous, user A and user B permissions directly through Supabase.
- [x] Test Google initiation/callback cookies and logout through actual Next actions with controlled HTTP fixtures.
- [ ] Test live Google consent, refresh persistence and expired sessions in a deployed browser.
- Not applicable now: password-recovery email tests (Google-only auth).
- [ ] Verify protected mutations fail without a session and user identity cannot be forged.

Success criteria: real accounts work end to end; RLS enforces access independently of UI; authentication email is delivered; no privileged keys reach the browser.

## Part 4: Core application

Depends on Part 3. Foundation fixtures are temporary and do not count as persistent functionality.

- [x] Read published guides from Supabase by stable slug; temporary editorial content is seeded through migrations, not a successful-runtime data fallback.
- [x] Load allowlisted repository Markdown through guides.content_path, render lists/tables and skip raw HTML.
- [ ] Reproduce the supplied public page, navigation, domain/type hubs, guide sections and reader layouts for the agreed MVP screens; do not use the provisional scaffold as the visual reference.
- [x] Add pending comment submission, empty/unavailable content/comments, login failures and page-error states. Await route validation before streaming to retain true missing-page HTTP statuses.
- [x] Add a clearly identified static sample PDF. The user will provide the later PDF content pipeline.
- [x] Show visible comments with safe public author names and visitor login prompts.
- [x] Post comments through validated server actions using verified session identity and authoritative RLS.
- [x] Bound comments to 2,000 characters, disable pending submission and revalidate the reader after posting.
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
- Not applicable now: Google-only authentication does not use application password/confirmation emails.
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

## Remaining acceptance work

1. Google login is confirmed on https://prepleet.vercel.app; verify the returned session survives reload and logout clears it.
2. Post/reload a comment and verify public reading and the sample PDF on the hosted app.
3. Compare desktop/mobile layouts against the supplied UI and check keyboard navigation.
4. Finish owner publishing/moderation and backup/restore documentation before release approval.

Historical entries below record earlier states; the status board at the top is authoritative.

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

2026-11-01 combined MVP: user authorized combining the remaining phases, switched current auth to Google and authorized new Vercel project creation. Implemented and locally tested UI/navigation, SSR auth/callback/logout, published Markdown guides, sample PDF and comments. Five unit tests, five Next HTTP/action integration tests and two database cycles passed. Sample PDF rendered and visually checked; blog file tracing includes all four Markdown files. Google is enabled on hosted Supabase; normal table requests return PGRST205 because migrations are not deployed, while the schema-discovery root requires a secret key by design. The hosted public schema currently contains solutions only; it has not been modified. Vercel prepleet project created with frontend root and preview-only public app variables.

2026-11-01 deployment verification: PR #3 merged as 84d1f0d; both GitHub CI checks succeeded. Vercel project prepleet deployed source commit 7ab8381 to prepleet-8gzlhr3ip-prepleet.vercel.app; deployment state READY. Four migrations committed atomically to the supplied Supabase project with migration history; catalog counts 2 domains, 9 case types, 4 guides. Existing solutions is preserved. Preview unauthenticated HTTP redirects to Vercel sign-in protection. Live Google consent and visual QA remain pending.

2026-11-01 workspace correction: at the user's request, synced merged main into /Users/Janvi.Chokshi/prepleet, preserved .env, and installed the locked app dependencies. Prior provisional files were backed up to /private/tmp/prepleet-before-sync-20261101-234655. Current working branch codex/deployment-handoff is in the IDE directory; future branches/plan updates will stay here rather than a separate temporary checkout.

Current follow-up: user reported Google signup failure on both local and preview plus slow route transitions. Investigating provider/callback evidence and timing actual production routes before making changes. Work remains in the active IDE directory.

## Google sign-in and navigation follow-up

- [x] Reproduce cross-host callback mismatch in an integration test before fixing it (configured 127.0.0.1 versus browser localhost).
- [x] Confirm Supabase uri_allow_list was empty. Add exact local/preview callback entries through the Management API while preserving other configuration.
- [x] Keep sign-in redirect and callback on the initiating browser host. Log only error code/status on failed exchanges, never OAuth codes or tokens.
- [x] Replace repeated read-only getUser calls with verified getClaims and React request-scoped memoization; comment writes retain live getUser verification.
- [x] Fetch guide/sidebar together and fetch content/identity/comments concurrently after validating the guide.
- [x] Confirm live project exposes ES256 keys. Regression test uses a real ES256 test signature/JWKS and confirms zero auth-user requests during signed-in reads, while posts still verify the user.
- [x] Identify hosting mismatch: Supabase ap-southeast-2 (Sydney), initial Vercel iad1 (Virginia). Add frontend/vercel.json selecting syd1; verify deployment region after rollout.
- [x] Production compilation and all 6 integration tests pass after the fixes. Five unit checks also passed.
- [x] PR #4 merged as 867210d; optimized preview READY and live deployment now serves merged code. Exact callback URLs configured.
- [x] User confirmed real local Google sign-in works.
- [x] User confirmed Google sign-in on the stable Vercel app URL after the configuration repair.

Baseline warm response samples from the local production server were ~12 ms for Learn, 823 ms for the guide list and 1,071 ms for the reader. After parallelization, list samples were 346/499 ms and reader 1,562/675 ms; live network variability is substantial, so these samples do not establish a guaranteed speedup. The deterministic improvements are fewer dependent query phases and zero remote auth-user calls for asymmetric-JWT reads. Browser rendering metrics and post-region-change production timings remain unmeasured.

User acceptance update: Google signup/login is working locally after the redirect/origin fixes. Vercel acceptance remains pending the replacement preview deployment.

## Hosted auth configuration follow-up — 2026-11-02

- [x] Confirm PR #4 is merged and the current deployment runs its code in syd1.
- [x] Find missing callback entries: Supabase still allowed only the initial preview; add exact current deployment and stable alias callbacks, preserving existing settings.
- [x] Reproduce the live login action returning `/login?error=unavailable` before reaching Google.
- [x] Confirm all three application variables existed only for Preview, while GitHub main deployed to Production.
- [x] Add encrypted Production values for the public Supabase URL/key and `NEXT_PUBLIC_SITE_URL=https://prepleet.vercel.app`; redeploy the identical merged commit.
- [x] Verify live OAuth initiation returns 303, sets a PKCE verifier cookie, selects the stable callback and reaches accounts.google.com (302).
- [x] Add a reusable hosted smoke check: `npm run test:deployment -- https://prepleet.vercel.app`.
- [x] User confirms hosted Google consent/login works.
- [ ] Verify hosted session persistence and logout.

No schema or application auth-code change was necessary for this configuration failure. The smoke check does not complete Google consent or prove Supabase callback allowlist acceptance. Management API readback independently verified the exact callback entries. Preview and Production currently share the supplied Supabase project; environment/data isolation remains a release decision.

Verification: `npm run test:deployment -- https://prepleet.vercel.app` passed. A disposable local HTTP fixture reproduced `/login?error=unavailable` and the smoke check correctly failed with the configuration diagnostic. All 5 unit tests passed; `node --check` and `git diff --check` passed. Live HTTP checks also passed for Learn, both domain Guesstimate libraries, the guide reader, Practice, PDF signature and unknown-guide 404. These are HTTP checks, not visual or authenticated browser acceptance.

2026-11-02 user acceptance: Google sign-in at https://prepleet.vercel.app/login succeeded. This confirms the hosted login repair; session persistence, logout, commenting and visual QA remain separate acceptance checks.

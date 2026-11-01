# Standalone admin application plan

Status: separate private repository created at https://github.com/janvi-prepleet/prepleet-admin. Checkout: /Users/Janvi.Chokshi/prepleet/admin. Implementation and local verification are complete; preview is READY and admin CI passed. Q12 approved on 2026-11-02; implementation resumed.

## Agreed behavior

- Separate app, repository and deployment. No admin link or generation interface in the public app.
- Google login through the existing Supabase project. Only verified server-returned email janvi.chokshi@prepleet.ai is initially allowlisted. Every solution/generation/prompt API enforces admin access, independently of UI visibility. No admin rights from editable user metadata.
- Reuse the existing Python pipeline, its prompts and saved-stage/version/revision contract. The more recent Prepleet-react sibling already supplies React UI, Supabase sessions and PostgreSQL storage and is the integration baseline; the requested original guesstima source supplies the reference flow.
- Preserve question → master solution → DAG → deterministic questions → content enrichment. Save successful stages to existing public.solutions. Keep manual edits, invalidation of dependent stages, history/search, feedback revisions and stale-version conflicts.
- Match the public app's theme: pine #0b2b26, saffron #ffb020, background #f3f5f2, ink #14201c, muted #5e6d67 and line #dce3df. Responsive admin workspace, saved solutions and prompt lab; exclude consumer quiz/practice and OTP login.
- Use existing Supabase PostgreSQL for persistence. Reuse existing private session/budget tables, with admin-specific cookies and a separate session encryption key. Add private prompt/feedback persistence only after Q12 is answered.
- Existing Vercel account is Pro. Prepare a separate FastAPI deployment with the built React UI; verify per-stage execution within the documented function limit. Avoid runtime reliance on writable repository files. No new paid service/account is assumed.
- Public display of solutions, publication workflow and case/guide mapping remain undecided and are not implemented in this chunk.

## Implementation checklist

- [x] Inspect source pipeline, newer React/Supabase version and hosted solutions schema without reading solution content or changing schema.
- [x] Confirm initial admin email and separate-repository decision.
- [x] Create private prepleet-admin repository and implementation branch in the visible IDE directory.
- [x] Record PostgreSQL persistence gap as Q12; pause dependent implementation.
- [x] Receive Q12 answer.
- [x] Finish strict admin access on login, HTML routes and all generation/data/prompt endpoints; deny non-admins before model calls or writes.
- [x] Complete Google-only admin login and apply shared brand tokens/navigation.
- [x] Integrate every generation stage with PostgreSQL, preserving revisions and optimistic version checks.
- [x] Implement approved durable prompt/feedback storage with migration and concurrency tests.
- [x] Configure ignored local environment from existing supplied service settings; keep keys, source credentials and runtime data out of Git.
- [x] Pass frontend typecheck/build/unit tests, backend offline tests and disposable PostgreSQL integration tests.
- [x] Raise [admin PR #1](https://github.com/janvi-prepleet/prepleet-admin/pull/1) for review/merge, with source provenance and test boundaries.
- [x] Create an independent Vercel preview and configure its exact Supabase callback.
- [x] User confirms real admin Google login and workspace access on the preview.
- [ ] Verify hosted generation, session persistence and non-admin denial.

## Tests and success criteria

- Anonymous requests cannot read saved solutions or start paid work. A signed-in non-admin is denied even when calling the API directly. Missing allowlist, unverified email, metadata spoofing, CSRF failure, expired/revoked sessions and allowlist removal fail closed. Mock mode never skips authentication.
- Each successful stage survives reload/restart in the configured PostgreSQL repository. Revisions preserve originals; stale writes return 409; failed model calls leave saved state intact. Ownership is derived from the verified session.
- Prompt history/rollback and feedback survive independent processes when approved; concurrent updates cannot overwrite a newer prompt. Browser roles cannot query private tables.
- UI exposes loading/error/conflict states, keyboard labels/focus and usable narrow layouts. Exact visual/browser QA is a separate acceptance step.
- Deployment uses the same Supabase project and public.solutions table, keeps secrets server-side and respects Vercel request duration. Live LLM behavior is reported separately from offline fixtures.

## Current verification

- All 46 backend tests passed in GitHub CI, including disposable PostgreSQL; 11 focused
  model-settings/admin checks passed locally after isolating offline test configuration.
- Seven frontend tests, TypeScript and production build passed. Two clean shared-schema
  migration/test cycles passed, including both new private tables.
- Supplied local configuration smoke check passed: health, login, anonymous denial and
  real Google PKCE initiation, without paid calls or solution writes.
- Approved hosted migration 20261102010000 applied/recorded; both new tables have RLS
  and no anon/authenticated SELECT privilege. Existing solutions remains unchanged.
- Separate Vercel project created (backend root, syd1 config, Node 24); GitHub repository
  connection succeeded after user granted access. User explicitly approved encrypted runtime credentials on 2026-11-02; preview is READY.
- Automatic approval review initially rejected credential upload; explicit user approval
  was subsequently received for encrypted backend-only settings in the separate admin project.
- User confirmed hosted Google login/workspace access. Model timings and desktop/mobile visual QA remain pending.
  Browser inventory exposes no controlled browser, so no browser test run is claimed.

## Preview and review

- [Admin preview login](https://prepleet-admin-git-codex-admin-generation-prepleet.vercel.app/login).
  Vercel sign-in protection is preserved. Then use janvi.chokshi@prepleet.ai in Google.
- [Admin implementation PR #1](https://github.com/janvi-prepleet/prepleet-admin/pull/1).
  CI passed, including all 46 backend tests with PostgreSQL and 7 frontend tests/build.
- [Shared migration/plan PR #6](https://github.com/janvi-prepleet/prepleet/pull/6).
  Application and Database CI passed. User merges both PRs.
- Vercel GitHub connection is configured: branch changes deploy separate previews; main
  deploys the admin project's production URL after the user merges. The public app is separate.
- Runtime configuration was uploaded only after explicit user approval. A read-only connection
  confirmed required PostgreSQL tables, and one live 2+2 model request returned 4.
  This does not establish full-pipeline generation timing or hosted browser acceptance.

2026-11-02 UI correction: the user rejected the inherited Guesstima visual style. Replaced
it with the public PrepLeet app's exact logo, system font stack, design tokens, 62px white
header, mint navigation, pine buttons and white bordered cards. Removed the old serif
headings, marketing illustration and sidebar. Added an admin-specific question/pipeline
layout using those components. Frontend tests/typecheck/build/lint passed; visual acceptance
is pending user review. The corrected preview is READY at commit d096141; admin CI passed. Admin access checks and generation APIs are unchanged.

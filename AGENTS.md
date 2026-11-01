# The Poduction MVP web app

## Project context

- **Stack:** Next.js for frontend and backend, Supabase for database and auth, GitHub for source control, Vercel for deployment.
- **Available inputs:** Existing UI design, database design, and service accounts.
- **Product scope:** Login/signup and guesstimate blogs with PDF downloads and comments. Practice is coming soon.
- **Design and repository references:** To be filled.
- **Production domain:** To be confirmed.

## MVP scope

### In scope

- **Authentication:** Sign up, log in, and log out.
- **Guesstimate blogs:** Browse published blogs and open an individual blog to read it.
- **Blog comments:** View comments on a blog and post comments as a logged-in user.
- **PDF downloads:** Download a PDF version of a guesstimate blog.
- **Practice:** Display a “Coming soon” section; no working practice experience in this release.

### Core journeys

- Visitor → sign up or log in → authenticated session → log out.
- Browse guesstimate blogs → read a blog → download its PDF.
- Read a blog → view comments → log in if needed → post a comment.
- Open Practice → see “Coming soon.”

### To confirm during planning

- Whether reading blogs or downloading PDFs requires login.
- Authentication method and required account recovery flows.
- Comment editing, deletion, and moderation requirements.
- How blogs and their PDFs will be published and maintained; no admin interface is assumed.

### Outside this MVP

- Practice simulations and their scoring or progress tracking.
- Other product features unless explicitly added to the approved scope.

## Color Scheme

- its in docs/UI_DESIGN.jsx file

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever
4. When hitting issues, always identify root cause before trying a fix. Do not guess. Prove with evidence, then fix the root cause.

## Working documentation

All documents for planning and executing this project will be in the docs/ directory.
Please review the docs/PLAN.md document before proceeding.

## Working directory and progress

- Keep implementation and feature branches in `/Users/Janvi.Chokshi/prepleet`, the user's active IDE directory. Do not hide ongoing work in a separate worktree unless explicitly requested.
- Keep the current status board at the top of `docs/PLAN.md` updated during work and before raising each PR. Distinguish implementation, local/fixture tests, hosted deployment and live browser verification.
- The user reviews and merges PRs into main. Current auth is Google-only through Supabase; dashboard, community and subscriptions remain excluded.

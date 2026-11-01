# Preview deployment and outstanding live checks

Status: PRs #1–#4 are merged. The existing GitHub-connected main deployment is live at https://prepleet.vercel.app. Its missing Production app variables and Supabase callbacks were repaired on 2026-11-02. Hosted Google consent/session acceptance remains pending; no custom domain/DNS changes were made.

## Supabase

1. Review and merge the PR. Use a development/preview Supabase project before production.
2. Authenticate the official Supabase CLI, initialize/link this checkout to the intended project and review the migration diff/history. Set database credentials through the CLI's supported environment/login flow rather than embedding passwords in scripts.
3. Apply the four ordered files in supabase/migrations through the migration workflow, retaining its history. All four versions are already recorded on the supplied hosted project. Do not rerun already-recorded migrations or paste ad hoc schema into the dashboard. Existing conflicting tables require a baseline review rather than dropping data.
4. Verify that profiles, guides, comments and comment_authors exist, taxonomy/placeholder guides are present and browser-role policies match the tests.
5. Google provider is already enabled in the supplied project. Keep the Google client secret in Supabase's provider settings. Google's authorized redirect URI is the project's Supabase /auth/v1/callback URL, not the app's callback URL.
6. In Supabase Auth URL Configuration, allow the app callback: http://localhost:3000/auth/callback** for local development and the exact preview/production origin followed by /auth/callback**. Keep wildcard use limited to the callback suffix; do not allow arbitrary third-party hosts.

The ** suffix accommodates the validated next query parameter. Account creation is Google-only. Sign-in initiates PKCE; /auth/callback exchanges the code and sets session cookies, then returns to an allowlisted in-app page. Never use the Supabase secret key or database password as NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.

## Vercel

The user authorized creation of a new prepleet project, which has been created with frontend as its root. The supplied VERCEL_TOKEN is used only in process memory; the token is deployment-only and must not be sent to the browser. Set the Vercel project Root Directory to frontend, retain access to the workspace root for package-lock.json/npm workspaces, and use the Next.js framework preset. Verify installation/build settings in preview before production.

Add only these application variables to each deployed environment (Preview and Production have separate settings):

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SITE_URL (the final production URL for production)

OAuth uses the initiating browser origin (validated by Next Server Actions), preserving PKCE cookies across local addresses and preview aliases. The configured site URL is only a fallback when Origin is absent. Add that exact callback origin to Supabase's allowed redirects. GitHub main is now connected and deploys to Production; branch deployments use Preview. Further release/domain changes require the agreed review workflow. Environment changes require a new deployment; promoting or revisiting an old deployment does not inject missing values. [Vercel environment-variable guidance](https://vercel.com/docs/environment-variables/managing-environment-variables). Markdown files are included in the blog route's server bundle via outputFileTracingIncludes.

## Live acceptance checklist

- [x] Apply/review all four migrations on the supplied Supabase project; migration history retained.
- [ ] Verify public listing, both domain contexts, guide Markdown and sample PDF using actual Supabase reads.
- [ ] Complete Google consent in a browser; verify signup/profile creation, return path, refresh persistence and logout.
- [ ] Post a comment, reload, and view it from another account or logged-out session.
- [ ] Verify draft/archived guide denial and hidden/deleted comment denial on hosted PostgREST, independently of UI.
- [ ] Check desktop and mobile screenshots, native learning menus, slider interactions, keyboard focus and form errors against the supplied design.
- [ ] Verify the actual deployed callback URL, HTTPS and environment isolation.

Local fixture tests and SQL tests do not mark these live checks complete. Browser QA is currently unavailable through the provided browser inventory. Retain the previous Vercel deployment for rollback; schema changes are additive, and referenced content should be archived rather than deleted. A production backup/restore exercise remains a release task.

## References

- [Supabase server-side cookie clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)
- [Supabase migrations](https://supabase.com/docs/guides/deployment/database-migrations)

## Current deployment record

- Stable app URL: https://prepleet.vercel.app.
- Deployment: dpl_74NErEu7f1XHjZyx6rMAUPmrYKHm, source 867210d, READY, Production, syd1. Generated URL: https://prepleet-lsb4tkjmm-prepleet.vercel.app; protected generated URLs are not the acceptance entry point.
- GitHub main auto-deployment is connected. Production settings now contain the three public application variables; database credentials and account tokens are not deployed.
- Supabase callbacks include localhost and 127.0.0.1, the original and optimized previews, the prior main deployment URL and exact stable aliases: prepleet.vercel.app, prepleet-prepleet.vercel.app and prepleet-git-main-prepleet.vercel.app, each followed by /auth/callback**. Use the stable app URL for sign-in. New generated URLs require their own explicit entry if they will be used for OAuth.
- Hosted migration history contains all four versions: 2 domains, 9 case types, 4 guides. Existing solutions was preserved.
- Preview and Production currently share the supplied Supabase project. This is not isolated production data; decide isolation before opening the service broadly.
- All implementation/progress edits stay in the active IDE directory.

## Hosted smoke check

Run `npm run test:deployment -- https://prepleet.vercel.app` after deployment. No credentials are needed. It checks health, the actual login server action, PKCE cookie/challenge, same-origin callback and Supabase's Google handoff, without completing consent or printing OAuth URLs/cookies. Protected previews fail clearly and retain their Vercel protection.

A passing smoke check does not prove callback allowlist acceptance or a completed account/session. Verify the exact callback entry in Supabase and complete Google consent, refresh persistence, commenting and logout in a browser.

Root cause on 2026-11-02: the GitHub main deployment used Production while application variables existed only for Preview; its login action returned error=unavailable. The replacement deployment has encrypted Production variables and now initiates Google correctly. The Supabase allowlist also lacked the latest host/aliases and was corrected independently. Site URL/provider settings were preserved.

## OAuth and region correction

Supabase Auth's callback allowlist was empty, causing preview sign-in to fall back to the localhost Site URL. It now includes localhost:3000, 127.0.0.1:3000 and the initial preview's /auth/callback**. Existing Site URL/provider settings were preserved. Add each new exact preview callback when deploying; do not use a wildcard for arbitrary preview hosts.

The app now preserves the browser Host through OAuth start and callback, rather than forcing the configured URL. A regression test covers localhost versus 127.0.0.1. Error logging contains only safe code/status fields.

The database is in AWS ap-southeast-2; the original functions were in iad1. frontend/vercel.json now requests syd1, colocating server functions with the database. The replacement deployment confirms regions=["syd1"]. Read-only session display uses cryptographically verified claims and request-scoped caching; mutations still verify the live auth user.

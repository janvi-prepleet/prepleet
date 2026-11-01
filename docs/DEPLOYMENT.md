# Preview deployment and outstanding live checks

Status: code and migrations prepared in the combined MVP PR. No hosted migration or deployment has been performed by this PR.

## Supabase

1. Review and merge the PR. Use a development/preview Supabase project before production.
2. Authenticate the official Supabase CLI, initialize/link this checkout to the intended project and review the migration diff/history. Set database credentials through the CLI's supported environment/login flow rather than embedding passwords in scripts.
3. Apply the four ordered files in supabase/migrations through the migration workflow, retaining its history. The first two were introduced by PR #2 but have not been deployed remotely. Do not rerun already-recorded migrations or paste ad hoc schema into the dashboard. Existing conflicting tables require a baseline review rather than dropping data.
4. Verify that profiles, guides, comments and comment_authors exist, taxonomy/placeholder guides are present and browser-role policies match the tests.
5. Google provider is already enabled in the supplied project. Keep the Google client secret in Supabase's provider settings. Google's authorized redirect URI is the project's Supabase /auth/v1/callback URL, not the app's callback URL.
6. In Supabase Auth URL Configuration, allow the app callback: http://localhost:3000/auth/callback** for local development and the exact preview/production origin followed by /auth/callback**. Keep wildcard use limited to the callback suffix; do not allow arbitrary third-party hosts.

The ** suffix accommodates the validated next query parameter. Account creation is Google-only. Sign-in initiates PKCE; /auth/callback exchanges the code and sets session cookies, then returns to an allowlisted in-app page. Never use the Supabase secret key or database password as NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.

## Vercel

The user authorized creation of a new prepleet project, which has been created with frontend as its root. The supplied VERCEL_TOKEN is used only in process memory; the token is deployment-only and must not be sent to the browser. Set the Vercel project Root Directory to frontend, retain access to the workspace root for package-lock.json/npm workspaces, and use the Next.js framework preset. Verify installation/build settings in preview before production.

Add only the application variables to the deployed environment:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SITE_URL (the final production URL for production)

Preview OAuth uses the platform's VERCEL_URL origin. Add that exact callback origin to Supabase's allowed redirects. Git-based deployments should track the PR branch for preview and main for production; production/domain changes still need release approval. Markdown files are included in the blog route's server bundle via outputFileTracingIncludes.

## Live acceptance checklist

- [ ] Apply/review migrations on the intended preview Supabase project.
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

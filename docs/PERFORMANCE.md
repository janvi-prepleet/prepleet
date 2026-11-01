# Navigation performance investigation

The user reported slow local and preview page transitions. Measurements below are full HTTP response times on a local production build, not browser paint/navigation metrics. Requests were anonymous, read complete response bodies and used the live Supabase project. The sample size is small and the network is variable; do not treat the fastest sample as a guaranteed improvement.

| Route      | Before (first / warm) | After (first / warm / warm) |
| ---------- | --------------------- | --------------------------- |
| Learn      | 32 / 12 ms            | 155 / 22 / 8 ms             |
| Guide list | 1533 / 823 ms         | 1674 / 346 / 499 ms         |
| Reader     | 1993 / 1071 ms        | 2111 / 1562 / 675 ms        |

## Confirmed costs and changes

- The reader previously awaited the guide, then its sidebar/content/identity, then comments and authors. Independent guide/sidebar calls now run together; content, read identity and comments run together after publication validation. No stale cross-request publication cache was introduced.
- Proxy, header and reader previously called getUser separately. Read-only identity now uses cryptographically verified getClaims, memoized within the React request. The live project exposes ES256 keys; the integration fixture signs a real ES256 JWT and serves its JWKS. The regression asserts no remote /auth/v1/user calls on signed-in reads. Posts still call getUser and rely on RLS.
- Supabase is in ap-southeast-2 (Sydney); the first Vercel deployment used iad1 (Virginia). The app now declares syd1. Deployment region must be confirmed after rollout; the local timing table does not measure this regional change.
- next dev compiles routes on first use. Use npm run build and npm start to assess the production app locally.

## Remaining verification

- Confirm the replacement deployment reports syd1.
- Measure browser navigation and rendering on the deployed app after Google sign-in works. Native computer-use permission is unavailable, so exact visual/performance QA remains open.
- Check warm and cold navigation under representative load before setting a response-time target. No unsupported performance guarantee is recorded.

[Supabase verified claims](https://supabase.com/docs/guides/auth/server-side/creating-a-client) and [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region) describe the mechanisms used here.

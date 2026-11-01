import assert from "node:assert/strict";

// No account credentials needed. This starts OAuth but does not complete consent.
const base = new URL(process.argv[2]).origin;
const health = await fetch(`${base}/api/health`, { redirect: "manual" });
assert.equal(
  health.status,
  200,
  "Health endpoint unavailable or deployment protected",
);
assert.equal((await health.json()).status, "ok");

const login = await fetch(`${base}/login`, { redirect: "manual" });
assert.equal(login.status, 200, "Login unavailable or deployment protected");
const html = await login.text();
const form = new FormData();
for (const input of html.matchAll(/<input\b[^>]*>/g)) {
  const name = input[0].match(/\bname="([^"]+)"/)?.[1];
  const value = input[0].match(/\bvalue="([^"]*)"/)?.[1] || "";
  if (name) form.append(name, value.replaceAll("&amp;", "&"));
}
assert.ok(
  [...form.keys()].some((name) => name.startsWith("$ACTION_")),
  "Missing login action",
);
const start = await fetch(`${base}/login`, {
  method: "POST",
  headers: { Origin: base },
  body: form,
  redirect: "manual",
});
assert.equal(start.status, 303, "Login action did not redirect");
const authorize = new URL(start.headers.get("location"), base);
assert.equal(
  authorize.pathname,
  "/auth/v1/authorize",
  "OAuth unavailable: check deployed Supabase environment variables",
);
assert.equal(authorize.searchParams.get("provider"), "google");
assert.ok(
  authorize.searchParams.get("code_challenge"),
  "Missing PKCE challenge",
);
const callback = new URL(authorize.searchParams.get("redirect_to"));
assert.equal(callback.origin, base, "OAuth callback changes browser origin");
assert.equal(callback.pathname, "/auth/callback");
assert.ok(
  start.headers
    .getSetCookie()
    .some((cookie) => cookie.includes("code-verifier=")),
  "Missing PKCE verifier cookie",
);

const provider = await fetch(authorize, { redirect: "manual" });
assert.equal(provider.status, 302, "Supabase did not redirect to Google");
assert.equal(
  new URL(provider.headers.get("location")).hostname,
  "accounts.google.com",
);
console.log(
  `PASS ${base}: health, login action, PKCE cookie, same-origin callback and Google handoff`,
);
console.log(
  "Google consent, callback allowlist and session persistence require separate verification.",
);

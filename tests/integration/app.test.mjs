import assert from "node:assert/strict";
import { test } from "node:test";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3300";
const decode = (value) =>
  value
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
function fields(html) {
  const data = new FormData();
  for (const match of html.matchAll(/<input\b[^>]*>/g)) {
    const name = match[0].match(/\bname="([^"]+)"/)?.[1];
    const value = match[0].match(/\bvalue="([^"]*)"/)?.[1] || "";
    if (name) data.append(decode(name), decode(value));
  }
  return data;
}
const cookieHeader = (response) =>
  response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");

test("public pages and Next API serve without a session", async () => {
  const health = await fetch(base + "/api/health");
  assert.deepEqual(await health.json(), { status: "ok", service: "prepleet" });
  for (const [path, text] of [
    ["/", "Crack guesstimates before you crack cases."],
    ["/learn", "Product Management"],
    ["/practice", "Coming soon"],
    ["/login", "Continue with Google"],
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(text));
  }
});
test("both domains show four guide kinds and route to one shared guide", async () => {
  for (const domain of ["consulting", "product"]) {
    const response = await fetch(`${base}/learn/${domain}/guesstimate`);
    const html = await response.text();
    assert.equal(response.status, 200);
    for (const text of [
      "In a hurry",
      "Core Concepts",
      "Solved Cases",
      "Patterns &amp; Trends",
      "cabs-in-mumbai",
    ])
      assert.ok(html.includes(text), text);
  }
  const missing = await fetch(base + "/learn/product/profitability");
  assert.equal(missing.status, 404);
});
test("Markdown tables, escaped comments and a real PDF are readable publicly", async () => {
  const response = await fetch(base + "/blogs/cabs-in-mumbai?domain=product");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<table>/);
  assert.ok(html.includes("100,000 active cabs"));
  assert.ok(html.includes("Comments"));
  assert.ok(html.includes("&lt;img src=x"));
  assert.ok(!html.includes('<img src="x"'));
  assert.ok(html.includes('id="section-0"'));
  const pdf = await fetch(base + "/pdfs/guesstimate-sample.pdf");
  assert.equal(pdf.status, 200);
  assert.match(pdf.headers.get("content-type"), /application\/pdf/);
  assert.equal(
    Buffer.from(await pdf.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  const missing = await fetch(base + "/blogs/not-published");
  assert.equal(missing.status, 404);
});
test("Google PKCE start, callback, comment posting and signout use real Next actions", async () => {
  const login = await fetch(base + "/login?next=https://evil.example");
  const loginHtml = await login.text();
  const form = fields(loginHtml);
  form.set("next", "https://evil.example");
  const start = await fetch(base + "/login", {
    method: "POST",
    body: form,
    headers: { Origin: base },
    redirect: "manual",
  });
  assert.equal(start.status, 303);
  const authorize = new URL(start.headers.get("location"));
  assert.equal(authorize.searchParams.get("provider"), "google");
  assert.ok(authorize.searchParams.get("code_challenge"));
  assert.equal(
    new URL(authorize.searchParams.get("redirect_to")).searchParams.get("next"),
    "/guesstimates",
  );
  const callback = await fetch(
    base + "/auth/callback?code=valid-code&next=/blogs/cabs-in-mumbai",
    { headers: { Cookie: cookieHeader(start) }, redirect: "manual" },
  );
  assert.equal(callback.status, 307);
  assert.equal(
    callback.headers.get("location"),
    base + "/blogs/cabs-in-mumbai",
  );
  const cookie = cookieHeader(callback);
  assert.ok(cookie.includes("auth-token"));
  await fetch("http://127.0.0.1:4410/test/metrics?reset=true");
  const reader = await fetch(base + "/blogs/cabs-in-mumbai", {
    headers: { Cookie: cookie },
  });
  const html = await reader.text();
  assert.ok(html.includes("Sign out"));
  const metrics = await fetch("http://127.0.0.1:4410/test/metrics").then(
    (response) => response.json(),
  );
  assert.equal(
    metrics.authUserRequests,
    0,
    "Read-only navigation should verify asymmetric JWTs locally",
  );
  const commentHtml = html.match(
    /<form[^>]*class="comment-form"[\s\S]*?<\/form>/,
  )?.[0];
  assert.ok(commentHtml, "Comment form missing");
  const comment = fields(commentHtml);
  comment.set("body", "An alternative assumption from integration testing.");
  comment.set("user_id", "10000000-0000-4000-8000-000000000002");
  const posted = await fetch(base + "/blogs/cabs-in-mumbai", {
    method: "POST",
    body: comment,
    headers: { Origin: base, Cookie: cookie },
  });
  assert.equal(posted.status, 200);
  assert.match(await posted.text(), /Comment posted/);
  const writeMetrics = await fetch("http://127.0.0.1:4410/test/metrics").then(
    (response) => response.json(),
  );
  assert.ok(
    writeMetrics.authUserRequests > 0,
    "Posting must still verify the live auth user",
  );
  const reloaded = await fetch(base + "/blogs/cabs-in-mumbai");
  assert.match(
    await reloaded.text(),
    /An alternative assumption from integration testing/,
  );
  const signoutHtml = html.match(
    /<form[^>]*>[\s\S]*?Sign out[\s\S]*?<\/form>/,
  )?.[0];
  assert.ok(signoutHtml);
  const logout = await fetch(base + "/blogs/cabs-in-mumbai", {
    method: "POST",
    body: fields(signoutHtml),
    headers: { Origin: base, Cookie: cookie },
    redirect: "manual",
  });
  assert.equal(logout.status, 303);
  assert.ok(cookieHeader(logout).includes("auth-token="));
});
test("failed OAuth callbacks and backend outages have safe user-facing states", async () => {
  const failed = await fetch(base + "/auth/callback?next=//evil.example", {
    redirect: "manual",
  });
  assert.equal(failed.headers.get("location"), base + "/login?error=callback");
  await fetch("http://127.0.0.1:4410/test/failure?enabled=true");
  try {
    const response = await fetch(base + "/learn/consulting/guesstimate");
    assert.match(await response.text(), /Guides are temporarily unavailable/);
  } finally {
    await fetch("http://127.0.0.1:4410/test/failure?enabled=false");
  }
});

test("OAuth cookies stay on the browser origin when configured URL differs", async () => {
  const browserOrigin = base.replace("127.0.0.1", "localhost");
  const response = await fetch(browserOrigin + "/login");
  const started = await fetch(browserOrigin + "/login", {
    method: "POST",
    body: fields(await response.text()),
    headers: { Origin: browserOrigin },
    redirect: "manual",
  });
  assert.equal(started.status, 303);
  const authorize = new URL(started.headers.get("location"));
  assert.equal(
    new URL(authorize.searchParams.get("redirect_to")).origin,
    browserOrigin,
  );
  const callback = await fetch(
    browserOrigin + "/auth/callback?code=valid-code&next=/learn",
    {
      headers: { Cookie: cookieHeader(started) },
      redirect: "manual",
    },
  );
  assert.equal(callback.headers.get("location"), browserOrigin + "/learn");
});

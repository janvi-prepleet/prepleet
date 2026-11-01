import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
export const fixtureUser = {
  id: "10000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "reader@example.test",
  app_metadata: { provider: "google", providers: ["google"] },
  user_metadata: { full_name: "Test Reader" },
  created_at: "2026-01-01T00:00:00Z",
};
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
export const fixtureToken =
  encode({ alg: "HS256", typ: "JWT" }) +
  "." +
  encode({
    sub: fixtureUser.id,
    aud: "authenticated",
    role: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }) +
  "." +
  randomBytes(32).toString("base64url");
const base = {
  domain_id: null,
  level: "Easy",
  read_minutes: 9,
  updated_at: "2026-01-01T00:00:00Z",
  key_points: ["Clarify scope", "Use round numbers"],
  case_type_id: "00000000-0000-4000-8000-000000000101",
  status: "published",
};
export const fixtureGuides = [
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000201",
    slug: "guesstimates-in-five-minutes",
    title: "Guesstimates in 5 minutes",
    guide_type: "hurry",
    content_path: "guesstimates-in-five-minutes.md",
  },
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000202",
    slug: "the-five-step-approach",
    title: "The 5-step approach to any guesstimate",
    guide_type: "concepts",
    content_path: "the-five-step-approach.md",
  },
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000203",
    slug: "cabs-in-mumbai",
    title: "Worked example: cabs in Mumbai",
    guide_type: "solved",
    content_path: "cabs-in-mumbai.md",
  },
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000204",
    slug: "guesstimate-interview-patterns",
    title: "Guesstimate patterns in interviews",
    guide_type: "patterns",
    content_path: "guesstimate-interview-patterns.md",
  },
];
export function createFixtureServer() {
  const comments = [
    {
      id: "20000000-0000-4000-8000-000000000001",
      user_id: fixtureUser.id,
      body: '<img src=x onerror="alert(1)">',
      created_at: "2026-01-01T00:00:00Z",
      guide_id: fixtureGuides[2].id,
    },
  ];
  let failure = false;
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1:4410");
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(body === undefined ? undefined : JSON.stringify(body));
    };
    const authenticated =
      req.headers.authorization === `Bearer ${fixtureToken}`;
    if (url.pathname === "/test/failure") {
      failure = url.searchParams.get("enabled") === "true";
      return send(200, { ok: true });
    }
    if (url.pathname === "/auth/v1/token") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks));
      if (body.auth_code !== "valid-code" || !body.code_verifier)
        return send(400, {
          error: "invalid_grant",
          error_description: "Bad code",
        });
      return send(200, {
        access_token: fixtureToken,
        refresh_token: "fixture-refresh",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: fixtureUser,
      });
    }
    if (url.pathname === "/auth/v1/user")
      return authenticated
        ? send(200, fixtureUser)
        : send(401, { message: "Unauthorized" });
    if (url.pathname === "/auth/v1/logout") return send(204);
    if (failure && url.pathname.startsWith("/rest/"))
      return send(503, { message: "Test service unavailable" });
    if (url.pathname === "/rest/v1/guides") {
      if (url.searchParams.get("status") !== "eq.published")
        return send(400, { message: "Missing publication guard" });
      let guides = fixtureGuides;
      const slug = url.searchParams.get("slug");
      if (slug) guides = guides.filter((g) => `eq.${g.slug}` === slug);
      const id = url.searchParams.get("id");
      if (id) guides = guides.filter((g) => `eq.${g.id}` === id);
      return send(200, guides);
    }
    if (url.pathname === "/rest/v1/comments") {
      if (req.method === "POST") {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks));
        if (
          !authenticated ||
          body.user_id !== fixtureUser.id ||
          !fixtureGuides.some((g) => g.id === body.guide_id) ||
          !body.body?.trim() ||
          body.body.length > 2000
        )
          return send(403, { message: "Not permitted", code: "42501" });
        comments.unshift({
          ...body,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        });
        return send(201);
      }
      return send(
        200,
        comments.filter(
          (c) => `eq.${c.guide_id}` === url.searchParams.get("guide_id"),
        ),
      );
    }
    if (url.pathname === "/rest/v1/comment_authors")
      return send(200, [{ id: fixtureUser.id, name: "Test Reader" }]);
    return send(404, { message: "Unknown fixture endpoint" });
  });
  return server;
}

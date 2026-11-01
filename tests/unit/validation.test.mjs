import assert from "node:assert/strict";
import { test } from "node:test";
import {
  safeReturnPath,
  validateComment,
} from "../../frontend/lib/validation.ts";
import { guideFile, headings } from "../../frontend/lib/content.ts";
import { estimateCabs, formatEstimate } from "../../frontend/lib/estimation.ts";
import {
  domains,
  isDomain,
  isDomainType,
  guideKinds,
} from "../../frontend/lib/catalog.ts";

test("OAuth returns stay on allowed pages", () => {
  for (const path of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/login",
    "/auth/callback",
    "/learn\u0000x",
    null,
  ])
    assert.equal(safeReturnPath(path), "/guesstimates");
  assert.equal(
    safeReturnPath("/blogs/cabs-in-mumbai?domain=product"),
    "/blogs/cabs-in-mumbai?domain=product",
  );
});
test("comments require a valid identity target and bounded nonempty text", () => {
  const id = "00000000-0000-4000-8000-000000000203";
  assert.deepEqual(validateComment(id, "  Clear reasoning.  "), {
    guideId: id,
    body: "Clear reasoning.",
  });
  for (const value of ["", "   ", "x".repeat(2001), null])
    assert.ok(validateComment(id, value).error);
  assert.ok(validateComment("not-a-uuid", "hello").error);
  assert.equal(validateComment(id, "x".repeat(2000)).body.length, 2000);
});
test("guide paths cannot escape the content directory", () => {
  assert.equal(
    guideFile("/repo/content", "cabs-in-mumbai.md"),
    "/repo/content/cabs-in-mumbai.md",
  );
  for (const path of [
    "../secrets.md",
    "/etc/passwd",
    "notes.txt",
    "nested/../../secret.md",
    "%2e%2e/secret.md",
  ])
    assert.throws(() => guideFile("/repo/content", path));
  assert.deepEqual(headings("## Clarify\ntext\n## Calculate"), [
    { title: "Clarify", id: "section-0" },
    { title: "Calculate", id: "section-1" },
  ]);
});
test("cab estimate responds consistently to assumptions", () => {
  assert.deepEqual(estimateCabs(4, 1.5, 12), {
    riders: 800000,
    trips: 1200000,
    cabs: 100000,
  });
  assert.equal(estimateCabs(8, 1.5, 12).cabs, 200000);
  assert.equal(estimateCabs(4, 3, 12).cabs, 200000);
  assert.equal(estimateCabs(4, 1.5, 20).cabs, 60000);
  assert.equal(formatEstimate(100000), "1.0 lakh");
});
test("UI taxonomy has shared Guesstimates and all four guide kinds", () => {
  assert.ok(domains.consulting.types.includes("guesstimate"));
  assert.ok(domains.product.types.includes("guesstimate"));
  assert.ok(isDomain("product"));
  assert.ok(!isDomain("__proto__"));
  assert.ok(!isDomainType("product", "profitability"));
  assert.equal(Object.keys(guideKinds).length, 4);
});

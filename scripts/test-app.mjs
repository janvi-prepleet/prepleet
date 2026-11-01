import { spawn } from "node:child_process";
import { once } from "node:events";
import { createFixtureServer } from "../tests/integration/fixture-server.mjs";
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:4410",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_integration_fixture",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3300",
  VERCEL_ENV: "",
  TEST_BASE_URL: "http://127.0.0.1:3300",
};
const fixture = createFixtureServer();
let app;
async function command(cmd, args) {
  const child = spawn(cmd, args, { env, stdio: "inherit" });
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error(`${cmd} failed (${code})`);
}
try {
  fixture.listen(4410, "127.0.0.1");
  await once(fixture, "listening");
  await command("npm", ["run", "build"]);
  app = spawn(
    process.execPath,
    [
      "../node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3300",
    ],
    { env, stdio: "inherit", cwd: "frontend" },
  );
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const r = await fetch(`${env.TEST_BASE_URL}/api/health`);
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error("App did not become ready");
  await command(process.execPath, ["--test", "tests/integration/app.test.mjs"]);
} finally {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await once(app, "exit");
  }
  await new Promise((resolve) => fixture.close(resolve));
}

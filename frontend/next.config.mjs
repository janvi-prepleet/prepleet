import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

// Keep local credentials at the repository root without passing Node CLI flags
// to Next.js build workers. Hosting environment variables retain precedence.
const environmentFile = resolve(import.meta.dirname, "../.env");
if (existsSync(environmentFile)) loadEnvFile(environmentFile);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: { "/blogs/*": ["./content/guides/**/*.md"] },
};
export default nextConfig;

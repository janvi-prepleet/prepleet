import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
export function guideFile(root: string, contentPath: string) {
  const file = resolve(root, contentPath);
  if (
    !/^[a-z0-9][a-z0-9/-]*\.md$/.test(contentPath) ||
    !file.startsWith(resolve(root) + sep)
  )
    throw new Error("Invalid guide content path");
  return file;
}
export async function readGuideContent(contentPath: string) {
  return readFile(
    guideFile(resolve(process.cwd(), "content/guides"), contentPath),
    "utf8",
  );
}
export function headings(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((match, index) => ({
    title: match[1],
    id: `section-${index}`,
  }));
}

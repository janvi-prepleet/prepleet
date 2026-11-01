"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/validation";
import { siteUrl } from "@/lib/site-url";

export async function signInGoogle(formData: FormData) {
  const next = safeReturnPath(formData.get("next"));
  if (!hasSupabaseConfig())
    redirect(`/login?error=unavailable&next=${encodeURIComponent(next)}`);
  const db = await createSupabase();
  // Next.js validates a Server Action's Origin against the request host.
  // Keep PKCE on that origin: verifier cookies cannot cross preview aliases.
  const origin = (await headers()).get("origin");
  const callbackOrigin = new URL(origin || siteUrl()).origin;
  const { data, error } = await db.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${callbackOrigin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error || !data.url)
    redirect(`/login?error=unavailable&next=${encodeURIComponent(next)}`);
  redirect(data.url);
}
export async function signOut() {
  const db = await createSupabase();
  const { error } = await db.auth.signOut();
  if (error) redirect("/login?error=signout");
  revalidatePath("/", "layout");
  redirect("/");
}

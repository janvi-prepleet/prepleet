import { NextResponse, type NextRequest } from "next/server";
import { createSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/validation";
import { siteUrl } from "@/lib/site-url";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && hasSupabaseConfig()) {
    const db = await createSupabase();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(
          safeReturnPath(request.nextUrl.searchParams.get("next")),
          siteUrl(),
        ),
      );
  }
  return NextResponse.redirect(new URL("/login?error=callback", siteUrl()));
}

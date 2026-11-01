import { NextResponse, type NextRequest } from "next/server";
import { createSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { safeReturnPath } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const callbackOrigin = new URL(request.url);
  // Preserve the browser host; Next can normalize local IPs internally.
  const host = request.headers.get("host");
  if (host) callbackOrigin.host = host;
  const code = request.nextUrl.searchParams.get("code");
  if (code && hasSupabaseConfig()) {
    const db = await createSupabase();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(
          safeReturnPath(request.nextUrl.searchParams.get("next")),
          callbackOrigin,
        ),
      );
    console.error("OAuth callback exchange failed", {
      code: error.code || error.name,
      status: error.status,
    });
  }
  return NextResponse.redirect(
    new URL("/login?error=callback", callbackOrigin),
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { signInGoogle } from "@/app/auth/actions";
import { safeReturnPath } from "@/lib/validation";
export const metadata: Metadata = { title: "Sign in" };
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; mode?: string }>;
}) {
  const { next, error, mode } = await searchParams;
  const returnTo = safeReturnPath(next);
  return (
    <main id="main" className="scroll">
      <section className="login-card card">
        <h1 className="h1">
          {mode === "signup" ? "Create your free account" : "Welcome back"}
        </h1>
        <p className="page-intro">
          Sign in with Google to join the conversation. Your guides are always
          free to read.
        </p>
        {error && (
          <p className="error-box" role="alert">
            {error === "signout"
              ? "Could not sign out. Please try again."
              : "We couldn’t complete sign-in. Please try again."}
          </p>
        )}
        <form action={signInGoogle}>
          <input type="hidden" name="next" value={returnTo} />
          <button className="btn full lg google-button">
            <span aria-hidden="true" className="google-g">
              G
            </span>
            Continue with Google
          </button>
        </form>
        <p className="muted login-note">
          A new account is created automatically on your first sign-in.
        </p>
        <Link className="text-link" href={returnTo}>
          Continue reading without signing in
        </Link>
      </section>
    </main>
  );
}

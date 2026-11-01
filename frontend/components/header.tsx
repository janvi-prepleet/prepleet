import Link from "next/link";
import { Logo } from "./logo";
import { currentUser } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { PrimaryNav } from "./primary-nav";
export async function Header() {
  const user = await currentUser();
  return (
    <header className="pub-top">
      <Logo />
      <PrimaryNav />
      <div className="account-actions">
        {user ? (
          <>
            <span className="account-name">Signed in</span>
            <form action={signOut}>
              <button className="btn">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link className="btn ghost" href="/login">
              Log in
            </Link>
            <Link className="btn pri" href="/login?mode=signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

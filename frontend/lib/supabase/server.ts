import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
export async function createSupabase() {
  if (!hasSupabaseConfig()) throw new Error("Supabase is not configured");
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (values) => {
          // Server Components cannot set cookies; proxy handles token refresh.
          try {
            values.forEach(({ name, value, options }) =>
              store.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
export async function currentUser() {
  if (!hasSupabaseConfig()) return null;
  const supabase = await createSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

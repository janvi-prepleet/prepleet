"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function PrimaryNav() {
  const path = usePathname();
  return (
    <nav className="pub-nav" aria-label="Primary">
      {[
        ["/guesstimates", "Guesstimates"],
        ["/learn", "Learn"],
        ["/practice", "Practice"],
      ].map(([href, label]) => {
        const active =
          href === "/guesstimates"
            ? path.startsWith("/blogs/") || path.endsWith("/guesstimate")
            : path.startsWith(href) && !path.endsWith("/guesstimate");
        return (
          <Link
            key={href}
            className={active ? "on" : undefined}
            aria-current={active ? "page" : undefined}
            href={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

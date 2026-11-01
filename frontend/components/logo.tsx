import Link from "next/link";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="PrepLeet home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="#0B2B26" />
        <path
          d="M9 21V7h6.2a4.2 4.2 0 010 8.4H9"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20.5" cy="20.5" r="2" fill="#FFB020" />
      </svg>
      <span>PrepLeet</span>
    </Link>
  );
}

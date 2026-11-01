import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="scroll">
      <div className="wrap empty">
        <h1 className="title">Page not found</h1>
        <p className="page-intro">
          This page may have moved, or the link may be incorrect.
        </p>
        <Link className="btn pri" href="/learn">
          Back to Learn
        </Link>
      </div>
    </main>
  );
}

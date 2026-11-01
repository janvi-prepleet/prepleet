"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="mid">
      <section className="pad empty" role="alert">
        <h1 className="h1">Something went wrong</h1>
        <p className="page-intro">Please try loading this page again.</p>
        <button className="btn pri" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}

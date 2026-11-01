import type { Metadata } from "next";
import Link from "next/link";
import { LearningShell } from "@/components/learning-shell";
export const metadata: Metadata = { title: "Practice — Coming soon" };
export default function Practice() {
  return (
    <LearningShell>
      <main id="main" className="mid">
        <div className="pad">
          <h1 className="h1">Practice</h1>
          <section className="card empty">
            <span className="chip">Coming soon</span>
            <h2 className="title">Put your thinking into practice.</h2>
            <p className="page-intro">
              We’re building a space to practise guesstimates. Until then, build
              your foundation with the guides.
            </p>
            <Link className="btn pri" href="/guesstimates">
              Explore Guesstimates
            </Link>
          </section>
        </div>
      </main>
    </LearningShell>
  );
}

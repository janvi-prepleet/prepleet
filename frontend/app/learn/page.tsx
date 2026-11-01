import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Target, ChevronRight } from "lucide-react";
import { domains, caseTypes } from "@/lib/catalog";
import { LearningShell } from "@/components/learning-shell";
export const metadata: Metadata = { title: "Learn" };
export default function Learn() {
  return (
    <LearningShell>
      <main id="main" className="mid">
        <div className="pad">
          <h1 className="h1">Learn</h1>
          <p className="page-intro">
            Pick a track, then a case type. Each case type has revision sheets,
            core concepts, solved cases and interview patterns.
          </p>
          <div className="grid2">
            {Object.entries(domains).map(([key, domain]) => (
              <section className="card" key={key}>
                <div className="kind-heading">
                  <span className="ficon">
                    {key === "consulting" ? (
                      <Briefcase size={20} />
                    ) : (
                      <Target size={20} />
                    )}
                  </span>
                  <h2 className="h2">{domain.name}</h2>
                </div>
                {domain.types.map((type) => (
                  <Link
                    key={type}
                    className="rowi"
                    href={`/learn/${key}/${type}`}
                  >
                    <span>
                      <b>{caseTypes[type].label}</b>
                      {type !== "guesstimate" && (
                        <span className="coming-label">Coming soon</span>
                      )}
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                ))}
                <Link className="btn" href="/practice">
                  Practice · Coming soon
                </Link>
              </section>
            ))}
          </div>
        </div>
      </main>
    </LearningShell>
  );
}

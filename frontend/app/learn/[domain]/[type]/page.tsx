import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { domains, caseTypes, isDomain, isDomainType } from "@/lib/catalog";
import { getGuides } from "@/lib/guides";
import { LearningShell } from "@/components/learning-shell";
import { GuideCards } from "@/components/guide-cards";
type Props = { params: Promise<{ domain: string; type: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  return { title: caseTypes[p.type]?.label || "Learn" };
}
export default async function TypePage({ params }: Props) {
  const { domain, type } = await params;
  if (!isDomain(domain) || !isDomainType(domain, type)) notFound();
  let guides;
  let unavailable = false;
  if (type === "guesstimate")
    try {
      guides = await getGuides(domain);
    } catch {
      unavailable = true;
    }
  return (
    <LearningShell domain={domain} type={type} guides={guides || []}>
      <main id="main" className="mid">
        <div className="pad">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/learn">Learn</Link>
            <span>/</span>
            <span>{domains[domain].name}</span>
          </nav>
          <h1 className="h1">{caseTypes[type].label}</h1>
          <p className="page-intro">{caseTypes[type].description}</p>
          {type !== "guesstimate" ? (
            <section className="card empty">
              <h2 className="h2">Coming soon</h2>
              <p>
                These guides are on their way. Explore guesstimates in the
                meantime.
              </p>
              <Link className="btn pri" href={`/learn/${domain}/guesstimate`}>
                Open Guesstimates
              </Link>
            </section>
          ) : unavailable ? (
            <section className="card empty" role="status">
              <h2 className="h2">Guides are temporarily unavailable</h2>
              <p>Please try again shortly.</p>
              <Link className="btn" href={`/learn/${domain}/guesstimate`}>
                Try again
              </Link>
            </section>
          ) : (
            <GuideCards guides={guides || []} domain={domain} />
          )}
          <section className="card nextcard">
            <div>
              <h2 className="h2">Put it into practice</h2>
              <p className="muted">Practice is coming soon.</p>
            </div>
            <Link className="btn" href="/practice">
              Explore Practice
            </Link>
          </section>
        </div>
      </main>
    </LearningShell>
  );
}

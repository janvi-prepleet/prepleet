import Link from "next/link";
import { notFound } from "next/navigation";
import { domains, caseTypes, isDomain } from "@/lib/catalog";
import { LearningShell } from "@/components/learning-shell";
export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  if (!isDomain(domain)) notFound();
  return (
    <LearningShell domain={domain}>
      <main id="main" className="mid">
        <div className="pad">
          <h1 className="h1">{domains[domain].name}</h1>
          <p className="page-intro">Pick a case type to begin.</p>
          <div className="card">
            {domains[domain].types.map((type) => (
              <Link
                key={type}
                className="rowi"
                href={`/learn/${domain}/${type}`}
              >
                {caseTypes[type].label}
                <span>
                  {type === "guesstimate" ? "Read guides" : "Coming soon"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </LearningShell>
  );
}

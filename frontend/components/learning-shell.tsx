import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Target,
  Zap,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { domains, caseTypes, guideKinds, type DomainKey } from "@/lib/catalog";
import type { Guide } from "@/lib/guides";
const kindIcons = {
  hurry: Zap,
  concepts: BookOpen,
  solved: CheckCircle2,
  patterns: TrendingUp,
};
export function LearningShell({
  children,
  domain,
  type,
  guides = [],
  selectedSlug,
}: {
  children: React.ReactNode;
  domain?: DomainKey;
  type?: string;
  guides?: Guide[];
  selectedSlug?: string;
}) {
  const links = (
    <>
      <Link className="back" href="/learn">
        <ArrowLeft size={16} />
        {type ? "Back to Learn" : "Learning home"}
      </Link>
      <div className="lhead">{type ? caseTypes[type].label : "Learn"}</div>
      {type && domain ? (
        <>
          <Link className="ni" href={`/learn/${domain}/${type}`}>
            Overview
          </Link>
          {Object.entries(guideKinds).map(([kind, label]) => {
            const Icon = kindIcons[kind as keyof typeof kindIcons];
            return (
              <details className="track-nav" key={kind} open>
                <summary className="ni">
                  <Icon size={17} />
                  {label}
                  <small>
                    {guides.filter((guide) => guide.guide_type === kind).length}
                  </small>
                </summary>
                <div className="indent">
                  {guides
                    .filter((guide) => guide.guide_type === kind)
                    .map((guide) => (
                      <Link
                        key={guide.id}
                        className={`ni sub${guide.slug === selectedSlug ? " on" : ""}`}
                        aria-current={
                          guide.slug === selectedSlug ? "page" : undefined
                        }
                        href={`/blogs/${guide.slug}?domain=${domain}`}
                      >
                        {guide.title}
                      </Link>
                    ))}
                </div>
              </details>
            );
          })}
        </>
      ) : (
        Object.entries(domains).map(([key, item]) => (
          <details className="track-nav" key={key} open>
            <summary className="ni">
              {key === "consulting" ? (
                <Briefcase size={18} />
              ) : (
                <Target size={18} />
              )}
              {item.name}
            </summary>
            <div className="indent">
              {item.types.map((slug) => (
                <Link
                  key={slug}
                  className="ni sub"
                  href={`/learn/${key}/${slug}`}
                >
                  {caseTypes[slug].label}
                  <ChevronRight size={14} />
                </Link>
              ))}
            </div>
          </details>
        ))
      )}
      <div className="lsub">Practice</div>
      <Link className="ni" href="/practice">
        Coming soon
      </Link>
    </>
  );
  return (
    <div className="learning-body">
      <aside className="left">
        <nav aria-label="Learning navigation">{links}</nav>
      </aside>
      <details className="mobile-learning">
        <summary>Learning menu</summary>
        <nav aria-label="Mobile learning navigation">{links}</nav>
      </details>
      {children}
    </div>
  );
}

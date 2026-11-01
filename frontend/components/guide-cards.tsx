import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { guideKinds, type DomainKey } from "@/lib/catalog";
import type { Guide } from "@/lib/guides";
const icons = {
  hurry: Zap,
  concepts: BookOpen,
  solved: CheckCircle2,
  patterns: TrendingUp,
};
const descriptions = {
  hurry: "5-minute revision sheets",
  concepts: "Frameworks and theory",
  solved: "Worked cases with one-pagers",
  patterns: "What keeps getting asked",
};
export function GuideCards({
  guides,
  domain,
}: {
  guides: Guide[];
  domain: DomainKey;
}) {
  return (
    <div className="grid2">
      {(Object.keys(guideKinds) as (keyof typeof guideKinds)[]).map((kind) => {
        const Icon = icons[kind];
        const items = guides.filter((g) => g.guide_type === kind);
        return (
          <section className="card" id={kind} key={kind}>
            <div className="kind-heading">
              <span className="ficon">
                <Icon size={20} />
              </span>
              <div>
                <h2 className="h2">{guideKinds[kind]}</h2>
                <p className="muted">{descriptions[kind]}</p>
              </div>
            </div>
            {items.map((guide) => (
              <Link
                className="rowi"
                href={`/blogs/${guide.slug}?domain=${domain}`}
                key={guide.id}
              >
                <span>
                  <b>{guide.title}</b>
                  <br />
                  <span className="muted">{guide.read_minutes} min read</span>
                </span>
                <ChevronRight size={16} />
              </Link>
            ))}
            {!items.length && (
              <p className="empty-note">
                No published guides in this section yet.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

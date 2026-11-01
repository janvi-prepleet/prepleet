import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, Download } from "lucide-react";
import { isDomain, domains, guideKinds } from "@/lib/catalog";
import { getGuide, getGuides, getComments } from "@/lib/guides";
import { readGuideContent, headings } from "@/lib/content";
import { currentUser } from "@/lib/supabase/server";
import { LearningShell } from "@/components/learning-shell";
import { CommentForm } from "@/components/comment-form";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ domain?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await params).slug.replaceAll("-", " ") };
}
export default async function Reader({ params, searchParams }: Props) {
  const { slug } = await params;
  const requested = (await searchParams).domain;
  const domain = requested && isDomain(requested) ? requested : "consulting";
  const guide = await getGuide(slug, domain);
  if (!guide) notFound();
  const [markdown, user, guides] = await Promise.all([
    readGuideContent(guide.content_path),
    currentUser(),
    getGuides(domain),
  ]);
  let comments: Awaited<ReturnType<typeof getComments>> = [];
  let commentError = false;
  try {
    comments = await getComments(guide.id);
  } catch {
    commentError = true;
  }
  const sections = headings(markdown);
  let sectionIndex = 0;
  const tools = (
    <div className="one">
      <h2 className="h2">One-pager: the no-faff summary</h2>
      <ol>
        {guide.key_points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ol>
      <a className="btn saf full" href="/pdfs/guesstimate-sample.pdf" download>
        <Download size={16} />
        Download sample PDF
      </a>
      <p className="assumption-note">
        A sample PDF while guide-specific downloads are prepared.
      </p>
    </div>
  );
  return (
    <LearningShell
      domain={domain}
      type="guesstimate"
      guides={guides}
      selectedSlug={guide.slug}
    >
      <div className="read-layout">
        <main id="main" className="mid">
          <div className="pad">
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/learn">Learn</Link>
              <span>/</span>
              <Link href={`/learn/${domain}`}>{domains[domain].name}</Link>
              <span>/</span>
              <Link href={`/learn/${domain}/guesstimate`}>Guesstimates</Link>
              <span>/</span>
              <span>{guideKinds[guide.guide_type]}</span>
            </nav>
            <h1 className="title">{guide.title}</h1>
            <div className="meta reader-meta">
              <span className={`chip d-${guide.level}`}>{guide.level}</span>
              <span>
                <Clock size={14} />
                {guide.read_minutes} min read
              </span>
              <span>
                Updated{" "}
                {new Date(guide.updated_at).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            </div>
            <article className="art article-content">
              <ReactMarkdown
                skipHtml
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 id={`section-${sectionIndex++}`}>{children}</h2>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
            <section
              className={
                guide.guide_type === "solved"
                  ? "download-card reader-tools-mobile"
                  : "download-card"
              }
            >
              {tools}
            </section>
            <section className="comments" aria-labelledby="comments-title">
              <h2 className="h2" id="comments-title">
                Comments
              </h2>
              {user ? (
                <CommentForm guideId={guide.id} />
              ) : (
                <p className="comment-login">
                  <Link
                    href={`/login?next=${encodeURIComponent(`/blogs/${slug}?domain=${domain}`)}`}
                  >
                    Sign in with Google
                  </Link>{" "}
                  to post a comment.
                </p>
              )}
              {commentError ? (
                <p role="status">
                  Comments are temporarily unavailable. Please try again
                  shortly.
                </p>
              ) : comments?.length ? (
                <>
                  <p className="muted">Latest comments</p>
                  {comments.map((comment) => (
                    <article className="comment" key={comment.id}>
                      <header>
                        <b>{comment.name}</b>
                        <time dateTime={comment.created_at}>
                          {new Date(comment.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            },
                          )}
                        </time>
                      </header>
                      <p className="comment-body">{comment.body}</p>
                    </article>
                  ))}
                </>
              ) : (
                <p className="muted">
                  No comments yet. Share the first question or approach.
                </p>
              )}
            </section>
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
        {guide.guide_type === "solved" && (
          <aside className="right" aria-label="Page tools">
            {tools}
            <div>
              <h2 className="h2">On this page</h2>
              <nav className="toc" aria-label="On this page">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </LearningShell>
  );
}

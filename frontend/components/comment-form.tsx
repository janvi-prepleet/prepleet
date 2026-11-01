"use client";
import { useActionState, useEffect, useRef } from "react";
import { postComment, type CommentState } from "@/app/blogs/actions";
export function CommentForm({ guideId }: { guideId: string }) {
  const [state, action, pending] = useActionState<CommentState, FormData>(
    postComment,
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="comment-form">
      <input type="hidden" name="guide_id" value={guideId} />
      <label htmlFor="comment-body">Your comment</label>
      <textarea
        id="comment-body"
        name="body"
        required
        maxLength={2000}
        rows={4}
        placeholder="Share an assumption, a question or a different approach."
        disabled={pending}
        aria-describedby="comment-help"
      />
      <p id="comment-help" className="muted">
        Up to 2,000 characters.
      </p>
      <div role="status" aria-live="polite">
        {state.error && <p className="error-text">{state.error}</p>}
        {state.success && <p className="success-text">Comment posted.</p>}
      </div>
      <button className="btn pri" disabled={pending}>
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}

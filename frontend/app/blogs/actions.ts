"use server";
import { revalidatePath } from "next/cache";
import { createSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { validateComment } from "@/lib/validation";
export type CommentState = { error?: string; success?: boolean };
export async function postComment(
  _previous: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const input = validateComment(formData.get("guide_id"), formData.get("body"));
  if ("error" in input) return { error: input.error };
  if (!hasSupabaseConfig())
    return { error: "Comments are temporarily unavailable." };
  const db = await createSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { error: "Please sign in to post a comment." };
  const { data: guide, error: guideError } = await db
    .from("guides")
    .select("slug")
    .eq("id", input.guideId)
    .eq("status", "published")
    .maybeSingle();
  if (guideError || !guide)
    return { error: "This guide is no longer available." };
  const { error } = await db
    .from("comments")
    .insert({ guide_id: input.guideId, user_id: user.id, body: input.body });
  if (error) return { error: "Could not post your comment. Please try again." };
  revalidatePath(`/blogs/${guide.slug}`);
  return { success: true };
}

import { createSupabase } from "./supabase/server";
import {
  domains,
  guesstimateId,
  type DomainKey,
  type GuideKind,
} from "./catalog";
export type Guide = {
  id: string;
  slug: string;
  domain_id: string | null;
  guide_type: GuideKind;
  title: string;
  level: string;
  read_minutes: number;
  key_points: string[];
  content_path: string;
  updated_at: string;
};
const fields =
  "id,slug,domain_id,guide_type,title,level,read_minutes,key_points,content_path,updated_at";
export async function getGuides(domain: DomainKey) {
  const db = await createSupabase();
  const { data, error } = await db
    .from("guides")
    .select(fields)
    .eq("case_type_id", guesstimateId)
    .eq("status", "published")
    .or(`domain_id.is.null,domain_id.eq.${domains[domain].id}`)
    .order("sort_order")
    .order("id")
    .limit(100);
  if (error) throw new Error("Unable to load guides");
  return data as Guide[];
}
export async function getGuide(slug: string, domain: DomainKey) {
  const db = await createSupabase();
  const { data, error } = await db
    .from("guides")
    .select(fields)
    .eq("slug", slug)
    .eq("case_type_id", guesstimateId)
    .eq("status", "published")
    .or(`domain_id.is.null,domain_id.eq.${domains[domain].id}`)
    .maybeSingle();
  if (error) throw new Error("Unable to load guide");
  return data as Guide | null;
}
export type Comment = {
  id: string;
  body: string;
  created_at: string;
  name: string;
};
export async function getComments(guideId: string): Promise<Comment[]> {
  const db = await createSupabase();
  const { data, error } = await db
    .from("comments")
    .select("id,user_id,body,created_at")
    .eq("guide_id", guideId)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(50);
  if (error) throw new Error("Unable to load comments");
  if (!data.length) return [];
  const { data: authors, error: authorError } = await db
    .from("comment_authors")
    .select("id,name")
    .in("id", [...new Set(data.map((c) => c.user_id))]);
  if (authorError) throw new Error("Unable to load authors");
  return data.map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    name: authors.find((a) => a.id === c.user_id)?.name || "Member",
  }));
}

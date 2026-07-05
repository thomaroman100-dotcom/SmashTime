import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { type NewsRow, updateNewsAction } from "@/lib/admin/actions/news";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Beitrag bearbeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminNewsEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsEditPage({ params }: AdminNewsEditPageProps) {
  const { id } = await params;
  const newsId = Number.parseInt(id, 10);

  if (!Number.isFinite(newsId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("news_posts")
    .select("id, slug, title, category, excerpt, body, image_path, hero_image_path, status, published_at, updated_at")
    .eq("id", newsId)
    .maybeSingle();

  const post = data as NewsRow | null;

  if (!post) {
    notFound();
  }

  return (
    <NewsForm
      action={updateNewsAction.bind(null, post.id)}
      initial={post}
      heading="Neuigkeit bearbeiten"
      subheading={`Bearbeite „${post.title}“ und veröffentliche nur geprüfte Inhalte.`}
    />
  );
}

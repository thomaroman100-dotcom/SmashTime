import { notFound } from "next/navigation";
import { ChampionForm } from "@/components/admin/ChampionForm";
import { type ChampionRow, updateChampionAction } from "@/lib/admin/actions/champions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Champion bearbeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminChampionEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminChampionEditPage({ params }: AdminChampionEditPageProps) {
  const { id } = await params;
  const championId = Number.parseInt(id, 10);

  if (!Number.isFinite(championId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("champions")
    .select(
      "id, slug, name, age, weight, weight_class, record, origin, image_path, stance, bio, quote, title, sort_order, is_active, updated_at"
    )
    .eq("id", championId)
    .maybeSingle();

  const champion = data as ChampionRow | null;

  if (!champion) {
    notFound();
  }

  return (
    <ChampionForm
      action={updateChampionAction.bind(null, champion.id)}
      initial={champion}
      heading="Champion bearbeiten"
      subheading={`Bearbeite Daten, Titel und Profil von ${champion.name}.`}
    />
  );
}

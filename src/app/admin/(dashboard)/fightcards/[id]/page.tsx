import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Kampf bearbeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminFightEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminFightEditPage({ params }: AdminFightEditPageProps) {
  const { id } = await params;
  const fightId = Number.parseInt(id, 10);

  if (!Number.isFinite(fightId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("fight_cards")
    .select("id, event_id")
    .eq("id", fightId)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const fight = data as { id: number; event_id: number };
  redirect(`/admin/fightcards?event=${fight.event_id}&tab=add&edit=${fight.id}`);
}

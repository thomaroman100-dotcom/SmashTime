import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FightForm, type FightFormEventOption } from "@/components/admin/FightForm";
import type { FighterProfileOption } from "@/components/admin/FighterProfilePicker";
import { type FightRow, updateFightAction } from "@/lib/admin/actions/fightcards";
import { loadVerifiedFighterOptions } from "@/lib/admin/fighters";
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

  const [{ data: fightData }, { data: eventData }, fighterOptionsResult] = await Promise.all([
    supabase
      .from("fight_cards")
      .select("id, event_id, sort_order, matchup_type, label, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, is_main_event, is_visible, status, notes, fight_card_participants(id, fight_card_id, corner, slot, fighter_user_id, display_name, image_path, is_tba)")
      .eq("id", fightId)
      .maybeSingle(),
    supabase.from("events").select("id, name").order("event_date", { ascending: false, nullsFirst: false }),
    loadVerifiedFighterOptions(supabase)
  ]);

  const fight = fightData as FightRow | null;
  const events = (eventData ?? []) as FightFormEventOption[];
  const fighterOptions: FighterProfileOption[] = fighterOptionsResult.options;

  if (!fight) {
    notFound();
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Kampf bearbeiten</h1>
          <p>
            {fight.corner_a_label ?? fight.fighter_a ?? "Wird bekanntgegeben"} vs.{" "}
            {fight.corner_b_label ?? fight.fighter_b ?? "Wird bekanntgegeben"}
          </p>
        </div>
        <Link className="admin-outline-button" href={`/admin/fightcards?event=${fight.event_id}`}>
          <ArrowLeft aria-hidden="true" size={16} /> Zurück zur Fightcard
        </Link>
      </div>
      <FightForm action={updateFightAction.bind(null, fight.id)} events={events} fighterOptions={fighterOptions} initial={fight} />
    </div>
  );
}

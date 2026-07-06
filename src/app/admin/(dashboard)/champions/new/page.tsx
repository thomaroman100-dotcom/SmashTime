import { ChampionForm } from "@/components/admin/ChampionForm";
import { createChampionAction } from "@/lib/admin/actions/champions";
import { loadVerifiedFighterOptions } from "@/lib/admin/fighters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Champion anlegen | SmashTime Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminChampionCreatePage() {
  const supabase = await createSupabaseServerClient();
  const { options } = supabase ? await loadVerifiedFighterOptions(supabase) : { options: [] };

  return (
    <ChampionForm
      action={createChampionAction}
      heading="Champion anlegen"
      subheading="Neuen bestätigten Titelträger erfassen."
      fighterOptions={options}
    />
  );
}

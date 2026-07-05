import { ChampionForm } from "@/components/admin/ChampionForm";
import { createChampionAction } from "@/lib/admin/actions/champions";

export const metadata = {
  title: "Champion anlegen | SmashTime Admin"
};

export default function AdminChampionCreatePage() {
  return (
    <ChampionForm
      action={createChampionAction}
      heading="Champion anlegen"
      subheading="Neuen bestätigten Titelträger erfassen."
    />
  );
}

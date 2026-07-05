import { SponsorForm } from "@/components/admin/SponsorForm";
import { createSponsorAction } from "@/lib/admin/actions/sponsors";

export const metadata = {
  title: "Sponsor anlegen | SmashTime Admin"
};

export default function AdminSponsorCreatePage() {
  return (
    <SponsorForm
      action={createSponsorAction}
      heading="Sponsor hinzufügen"
      subheading="Erfasse einen echten Sponsor mit Logo, Paket, Website und Sichtbarkeit."
    />
  );
}

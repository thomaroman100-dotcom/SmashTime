import { NewsForm } from "@/components/admin/NewsForm";
import { createNewsAction } from "@/lib/admin/actions/news";

export const metadata = {
  title: "Beitrag erstellen | SmashTime Admin"
};

export default function AdminNewsCreatePage() {
  return (
    <NewsForm
      action={createNewsAction}
      heading="Neuigkeit erstellen"
      subheading="Lege einen echten Beitrag mit Teaser, Inhalt, Bild und Veröffentlichungsstatus an."
    />
  );
}

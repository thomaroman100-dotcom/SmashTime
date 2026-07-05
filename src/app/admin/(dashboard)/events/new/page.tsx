import { EventForm } from "@/components/admin/EventForm";
import { createEventAction } from "@/lib/admin/actions/events";

export const metadata = {
  title: "Veranstaltung anlegen | SmashTime Admin"
};

export default function AdminEventCreatePage() {
  return (
    <EventForm
      action={createEventAction}
      heading="Veranstaltung anlegen"
      subheading="Erstelle eine neue Veranstaltung oder bearbeite bestehende Event-Details."
    />
  );
}

import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { type EventGalleryRow, type EventRow, updateEventAction } from "@/lib/admin/actions/events";
import { eventSelectColumns } from "@/lib/admin/resource-shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Veranstaltung bearbeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminEventEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventEditPage({ params }: AdminEventEditPageProps) {
  const { id } = await params;
  const eventId = Number.parseInt(id, 10);

  if (!Number.isFinite(eventId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const [{ data }, { data: galleryData }] = await Promise.all([
    supabase.from("events").select(eventSelectColumns).eq("id", eventId).maybeSingle(),
    supabase
      .from("event_gallery")
      .select("id, event_id, media_asset_id, image_path, alt_text, sort_order, is_published")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true })
  ]);

  const event = data as unknown as EventRow | null;
  const gallery = (galleryData ?? []) as EventGalleryRow[];

  if (!event) {
    notFound();
  }

  return (
    <EventForm
      action={updateEventAction.bind(null, event.id)}
      initial={event}
      gallery={gallery}
      heading="Veranstaltung bearbeiten"
      subheading={`Bearbeite die Event-Details von ${event.name}.`}
    />
  );
}

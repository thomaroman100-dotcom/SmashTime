"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type AdminClientResult,
  type ActionResult,
  fieldBool,
  fieldText,
  fieldTextOrNull,
  formFile,
  formFiles,
  getAdminClient,
  slugify,
  supabaseErrorMessage,
  uploadAdminMediaAsset
} from "@/lib/admin/action-helpers";
import { EVENT_DISCIPLINES } from "@/lib/admin/resource-shared";

type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type EventStatus = "draft" | "published" | "archived";

export type EventRow = {
  id: number;
  slug: string;
  name: string;
  short_name: string;
  subtitle: string | null;
  event_date: string | null;
  date_label: string | null;
  location: string | null;
  address: string | null;
  admission: string | null;
  starts_at: string | null;
  disciplines: string[];
  gastro: string | null;
  image_path: string | null;
  ticket_url: string | null;
  status: EventStatus;
  updated_at: string;
};

export type EventGalleryRow = {
  id: number;
  event_id: number;
  media_asset_id: number | null;
  image_path: string | null;
  alt_text: string | null;
  sort_order: number;
  is_published: boolean;
};

function eventPayload(formData: FormData) {
  const name = fieldText(formData, "name");
  const shortName = fieldText(formData, "short_name");

  if (!name || !shortName) {
    return { error: "Name und Kurzname sind Pflichtfelder." } as const;
  }

  const slug = slugify(fieldText(formData, "slug") || name);
  if (!slug) {
    return { error: "Aus dem Namen konnte kein gültiger Slug erzeugt werden." } as const;
  }

  const status = fieldText(formData, "status");
  if (!["draft", "published", "archived"].includes(status)) {
    return { error: "Ungültiger Status." } as const;
  }

  const disciplines = EVENT_DISCIPLINES.filter(
    (discipline) => formData.get(`discipline:${discipline}`) === "on"
  );

  const eventDateRaw = fieldText(formData, "event_date");
  let eventDate: string | null = null;
  if (eventDateRaw) {
    const parsed = new Date(eventDateRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "Das Datum konnte nicht gelesen werden." } as const;
    }
    eventDate = parsed.toISOString();
  }

  return {
    payload: {
      slug,
      name,
      short_name: shortName,
      subtitle: fieldTextOrNull(formData, "subtitle"),
      event_date: eventDate,
      date_label: fieldTextOrNull(formData, "date_label"),
      location: fieldTextOrNull(formData, "location"),
      address: fieldTextOrNull(formData, "address"),
      admission: fieldTextOrNull(formData, "admission"),
      starts_at: fieldTextOrNull(formData, "starts_at"),
      disciplines,
      gastro: fieldTextOrNull(formData, "gastro"),
      image_path: fieldBool(formData, "clear_image_path") ? null : fieldTextOrNull(formData, "image_path"),
      ticket_url: fieldTextOrNull(formData, "ticket_url"),
      status: status as EventStatus
    }
  };
}

type EventPayload = Extract<ReturnType<typeof eventPayload>, { payload: unknown }>["payload"];

function revalidateEvents(id?: number) {
  revalidatePath("/admin/events");
  if (id) {
    revalidatePath(`/admin/events/${id}`);
  }
  revalidatePath("/admin/fightcards");
  revalidatePath("/veranstaltungen");
  revalidatePath("/fight-night");
  revalidatePath("/tickets");
  revalidatePath("/");
}

async function applyEventPosterUpload({
  supabase,
  payload,
  formData
}: {
  supabase: AdminSupabaseClient;
  payload: EventPayload;
  formData: FormData;
}) {
  const posterFile = formFile(formData, "event_image_file");
  if (!posterFile) {
    return { ok: true as const };
  }

  const uploaded = await uploadAdminMediaAsset({
    supabase,
    file: posterFile,
    folder: `events/${payload.slug}/poster`,
    assetType: "Veranstaltung",
    altText: `${payload.name} Eventbild`,
    usageNote: `Event-Poster: ${payload.name}`,
    isPublic: true,
    isChecked: true
  });

  if (!uploaded.ok) {
    return uploaded;
  }

  payload.image_path = uploaded.publicUrl;
  return { ok: true as const };
}

async function applyEventGalleryChanges({
  supabase,
  eventId,
  eventSlug,
  eventName,
  formData
}: {
  supabase: AdminSupabaseClient;
  eventId: number;
  eventSlug: string;
  eventName: string;
  formData: FormData;
}) {
  const removeIds = formData
    .getAll("remove_gallery_ids")
    .map((value) => Number.parseInt(String(value), 10))
    .filter(Number.isFinite);

  if (removeIds.length > 0) {
    const { error } = await supabase.from("event_gallery").delete().eq("event_id", eventId).in("id", removeIds);
    if (error) {
      return { ok: false as const, error: supabaseErrorMessage(error) };
    }
  }

  const galleryFiles = formFiles(formData, "gallery_files");
  for (const [index, file] of galleryFiles.entries()) {
    const uploaded = await uploadAdminMediaAsset({
      supabase,
      file,
      folder: `events/${eventSlug}/gallery`,
      assetType: "Veranstaltung",
      altText: `${eventName} Galerie ${index + 1}`,
      usageNote: `Event-Galerie: ${eventName}`,
      isPublic: true,
      isChecked: true
    });

    if (!uploaded.ok) {
      return uploaded;
    }

    const { error } = await supabase.from("event_gallery").insert({
      event_id: eventId,
      media_asset_id: uploaded.mediaAssetId,
      image_path: uploaded.publicUrl,
      alt_text: `${eventName} Galerie ${index + 1}`,
      sort_order: Date.now() + index,
      is_published: true
    });

    if (error) {
      return { ok: false as const, error: supabaseErrorMessage(error) };
    }
  }

  return { ok: true as const };
}

export async function createEventAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("events.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = eventPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Veranstaltungsdaten sind unvollständig." };
  }

  const posterUpload = await applyEventPosterUpload({
    supabase: admin.supabase,
    payload: result.payload,
    formData
  });
  if (!posterUpload.ok) {
    return { ok: false, error: posterUpload.error };
  }

  const { data, error } = await admin.supabase.from("events").insert(result.payload).select("id").maybeSingle();
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const eventId = (data as { id: number } | null)?.id;
  if (eventId) {
    const gallery = await applyEventGalleryChanges({
      supabase: admin.supabase,
      eventId,
      eventSlug: result.payload.slug,
      eventName: result.payload.name,
      formData
    });
    if (!gallery.ok) {
      return { ok: false, error: gallery.error };
    }
  }

  revalidateEvents(eventId);
  redirect("/admin/events");
}

export async function updateEventAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("events.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = eventPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Veranstaltungsdaten sind unvollständig." };
  }

  const posterUpload = await applyEventPosterUpload({
    supabase: admin.supabase,
    payload: result.payload,
    formData
  });
  if (!posterUpload.ok) {
    return { ok: false, error: posterUpload.error };
  }

  const { error } = await admin.supabase.from("events").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const gallery = await applyEventGalleryChanges({
    supabase: admin.supabase,
    eventId: id,
    eventSlug: result.payload.slug,
    eventName: result.payload.name,
    formData
  });
  if (!gallery.ok) {
    return { ok: false, error: gallery.error };
  }

  revalidateEvents(id);
  return { ok: true, message: "Veranstaltung gespeichert." };
}

export async function setEventStatusAction(id: number, status: EventStatus): Promise<ActionResult> {
  const admin = await getAdminClient("events.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("events").update({ status }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateEvents(id);
  const labels: Record<EventStatus, string> = {
    draft: "Als Entwurf gespeichert.",
    published: "Veranstaltung veröffentlicht.",
    archived: "Veranstaltung archiviert."
  };
  return { ok: true, message: labels[status] };
}

export async function deleteEventAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("events.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("events").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateEvents(id);
  return { ok: true, message: "Veranstaltung gelöscht." };
}

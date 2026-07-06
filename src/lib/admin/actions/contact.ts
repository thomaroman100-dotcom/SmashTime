"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResult,
  fieldText,
  getAdminClient,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";
import { CONTACT_STATUSES } from "@/lib/admin/resource-shared";

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export type ContactRow = {
  id: number;
  category: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  internal_notes: string | null;
  created_at: string;
};

function revalidateContact() {
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

export async function setContactStatusAction(id: number, status: ContactStatus): Promise<ActionResult> {
  if (!CONTACT_STATUSES.includes(status)) {
    return { ok: false, error: "Ungültiger Status." };
  }

  const admin = await getAdminClient("contact.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("contact_requests").update({ status }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateContact();
  return { ok: true, message: `Status auf „${status}“ gesetzt.` };
}

export async function saveContactNotesAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("contact.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const notes = fieldText(formData, "internal_notes");
  const status = fieldText(formData, "status");

  if (!CONTACT_STATUSES.includes(status as ContactStatus)) {
    return { ok: false, error: "Ungültiger Status." };
  }

  const { error } = await admin.supabase
    .from("contact_requests")
    .update({ internal_notes: notes.length > 0 ? notes : null, status })
    .eq("id", id);

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateContact();
  return { ok: true, message: "Anfrage aktualisiert." };
}

export async function deleteContactRequestAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("contact.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("contact_requests").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateContact();
  return { ok: true, message: "Anfrage gelöscht." };
}

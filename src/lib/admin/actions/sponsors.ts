"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type AdminClientResult,
  type ActionResult,
  fieldBool,
  fieldInt,
  fieldText,
  fieldTextOrNull,
  formFile,
  getAdminClient,
  slugify,
  supabaseErrorMessage,
  uploadAdminMediaAsset
} from "@/lib/admin/action-helpers";

type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type SponsorRow = {
  id: number;
  name: string;
  logo_path: string | null;
  website_url: string | null;
  package_name: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

function sponsorPayload(formData: FormData) {
  const name = fieldText(formData, "name");
  if (!name) {
    return { error: "Name ist ein Pflichtfeld." } as const;
  }

  return {
    payload: {
      name,
      logo_path: fieldTextOrNull(formData, "logo_path"),
      website_url: fieldTextOrNull(formData, "website_url"),
      package_name: fieldTextOrNull(formData, "package_name"),
      sort_order: fieldInt(formData, "sort_order", 0),
      is_active: fieldBool(formData, "is_active")
    }
  };
}

type SponsorPayload = Extract<ReturnType<typeof sponsorPayload>, { payload: unknown }>["payload"];

function revalidateSponsors() {
  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsoren");
  revalidatePath("/");
}

async function applySponsorLogoUpload({
  supabase,
  payload,
  formData
}: {
  supabase: AdminSupabaseClient;
  payload: SponsorPayload;
  formData: FormData;
}) {
  const logoFile = formFile(formData, "sponsor_logo_file");
  if (!logoFile) {
    return { ok: true as const };
  }

  const uploaded = await uploadAdminMediaAsset({
    supabase,
    file: logoFile,
    folder: `sponsors/${slugify(payload.name) || "sponsor"}`,
    assetType: "Sponsor",
    altText: `${payload.name} Logo`,
    usageNote: `Sponsor-Logo: ${payload.name}`,
    isPublic: true,
    isChecked: true
  });

  if (!uploaded.ok) {
    return uploaded;
  }

  payload.logo_path = uploaded.publicUrl;
  return { ok: true as const };
}

export async function createSponsorAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = sponsorPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Sponsorendaten sind unvollständig." };
  }

  const uploadResult = await applySponsorLogoUpload({ supabase: admin.supabase, payload: result.payload, formData });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { error } = await admin.supabase.from("sponsors").insert(result.payload);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateSponsors();
  redirect("/admin/sponsors");
}

export async function updateSponsorAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = sponsorPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Sponsorendaten sind unvollständig." };
  }

  const uploadResult = await applySponsorLogoUpload({ supabase: admin.supabase, payload: result.payload, formData });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { error } = await admin.supabase.from("sponsors").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateSponsors();
  return { ok: true, message: "Sponsor gespeichert." };
}

export async function setSponsorActiveAction(id: number, isActive: boolean): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("sponsors").update({ is_active: isActive }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateSponsors();
  return { ok: true, message: isActive ? "Sponsor aktiviert." : "Sponsor deaktiviert." };
}

export async function deleteSponsorAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("sponsors").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateSponsors();
  return { ok: true, message: "Sponsor gelöscht." };
}

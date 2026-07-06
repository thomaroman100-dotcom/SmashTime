"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { fieldHrefOrNull, fieldText, fieldTextOrNull, supabaseErrorMessage } from "@/lib/admin/action-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function cleanLimitedText(value: string | null, limit: number) {
  if (!value) {
    return null;
  }

  return value.slice(0, limit);
}

export async function updateMyProfileSettingsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { ok: false, error: "Supabase ist noch nicht konfiguriert." };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Bitte melde dich neu an." };
  }

  const displayName = fieldText(formData, "display_name");
  if (displayName.length < 2 || displayName.length > 80) {
    return { ok: false, error: "Der Anzeigename muss zwischen 2 und 80 Zeichen lang sein." };
  }

  const avatarInput = fieldText(formData, "avatar_url");
  const avatarUrl = fieldHrefOrNull(formData, "avatar_url", { allowRelative: false });
  if (avatarInput && !avatarUrl) {
    return { ok: false, error: "Bitte eine gültige HTTPS-URL für das Profilbild eingeben." };
  }
  const nickname = cleanLimitedText(fieldTextOrNull(formData, "nickname"), 80);
  const origin = cleanLimitedText(fieldTextOrNull(formData, "origin"), 120);
  const publicBio = cleanLimitedText(fieldTextOrNull(formData, "public_bio"), 500);

  const { error } = await supabase.rpc("update_my_profile_settings", {
    p_display_name: displayName,
    p_avatar_url: avatarUrl,
    p_nickname: nickname,
    p_origin: origin,
    p_public_bio: publicBio
  });

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  revalidatePath("/account");
  revalidatePath("/admin/account");

  return { ok: true, message: "Profil gespeichert." };
}

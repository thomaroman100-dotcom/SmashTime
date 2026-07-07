"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import {
  ADMIN_PERMISSIONS,
  type AdminPermission,
  getAdminSession
} from "@/lib/admin/auth";
import { type MemberProfileType, type MemberStatus } from "@/lib/admin/members";
import {
  type ActionResult,
  fieldBool,
  fieldText,
  fieldTextOrNull,
  getAdminClient,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

function validStatus(value: string): value is MemberStatus {
  return ["pending", "active", "suspended"].includes(value);
}

function validProfileType(value: string): value is MemberProfileType {
  return ["fighter", "staff"].includes(value);
}

function selectedPermissions(formData: FormData) {
  const allowed = new Set<string>(ADMIN_PERMISSIONS);
  return formData
    .getAll("permissions")
    .filter((value): value is AdminPermission => typeof value === "string" && allowed.has(value));
}

function revalidateMemberSurfaces(userId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/members");
  revalidatePath("/admin/members/roles");
  revalidatePath("/admin/members/verifications");
  if (userId) {
    revalidatePath(`/admin/members/${userId}`);
  }
}

function redirectUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    return undefined;
  }
  return `${raw.replace(/\/+$/g, "")}/login`;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function temporaryPassword() {
  return `${randomBytes(24).toString("base64url")}Aa1!`;
}

async function assignPermissionsIfAllowed(userId: string | null | undefined, formData: FormData, profileType: MemberProfileType) {
  if (!userId || !formData.has("permissions_form")) {
    return { ok: true as const };
  }

  const session = await getAdminSession("admin");
  if (session.status !== "authenticated") {
    return { ok: false as const, error: "Nur Administratoren dürfen Mitarbeiterrechte vergeben." };
  }

  const permissions = profileType === "staff" ? selectedPermissions(formData) : [];
  const admin = await getAdminClient("users.manage");
  if (!admin.ok) {
    return { ok: false as const, error: admin.error };
  }

  const { error: deleteError } = await admin.supabase.from("staff_permissions").delete().eq("user_id", userId);
  if (deleteError) {
    return { ok: false as const, error: supabaseErrorMessage(deleteError) };
  }

  if (permissions.length > 0) {
    const { error: insertError } = await admin.supabase.from("staff_permissions").insert(
      permissions.map((permission) => ({
        user_id: userId,
        permission
      }))
    );

    if (insertError) {
      return { ok: false as const, error: supabaseErrorMessage(insertError) };
    }
  }

  return { ok: true as const };
}

export async function createMemberInviteAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("users.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase ist nicht konfiguriert. Einladungen sind gesperrt." };
  }

  const email = fieldText(formData, "email").toLowerCase();
  const displayName = fieldText(formData, "display_name");
  const profileTypeInput = fieldText(formData, "profile_type");
  const statusInput = fieldText(formData, "status");

  if (!isEmail(email)) {
    return { ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." };
  }

  if (!displayName) {
    return { ok: false, error: "Anzeigename ist ein Pflichtfeld." };
  }

  if (!validProfileType(profileTypeInput)) {
    return { ok: false, error: "Ungültiger Mitgliedstyp." };
  }

  if (!validStatus(statusInput)) {
    return { ok: false, error: "Ungültiger Profilstatus." };
  }

  const inviteClient = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await inviteClient.auth.signUp({
    email,
    password: temporaryPassword(),
    options: {
      emailRedirectTo: redirectUrl(),
      data: {
        display_name: displayName,
        profile_type: profileTypeInput
      }
    }
  });

  if (error) {
    return { ok: false, error: `Einladung konnte nicht gesendet werden: ${error.message}` };
  }

  const invitedUserId = data.user?.id ?? null;
  if (invitedUserId) {
    const { error: profileError } = await admin.supabase
      .from("profiles")
      .upsert(
        {
          user_id: invitedUserId,
          email,
          display_name: displayName,
          profile_type: profileTypeInput,
          status: statusInput,
          avatar_url: fieldTextOrNull(formData, "avatar_url")
        },
        { onConflict: "user_id" }
      );

    if (profileError) {
      return { ok: false, error: supabaseErrorMessage(profileError) };
    }

    if (profileTypeInput === "fighter") {
      const { error: fighterError } = await admin.supabase.from("fighter_profiles").upsert(
        {
          user_id: invitedUserId,
          nickname: fieldTextOrNull(formData, "nickname"),
          weight_class: fieldTextOrNull(formData, "weight_class"),
          record: fieldTextOrNull(formData, "record"),
          origin: fieldTextOrNull(formData, "origin"),
          image_path: fieldTextOrNull(formData, "image_path"),
          public_bio: fieldTextOrNull(formData, "public_bio"),
          is_verified: statusInput === "active" && fieldBool(formData, "is_verified")
        },
        { onConflict: "user_id" }
      );

      if (fighterError) {
        return { ok: false, error: supabaseErrorMessage(fighterError) };
      }
    }

    const permissions = await assignPermissionsIfAllowed(invitedUserId, formData, profileTypeInput);
    if (!permissions.ok) {
      return { ok: false, error: permissions.error };
    }
  }

  const { error: otpError } = await inviteClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: redirectUrl()
    }
  });

  if (otpError) {
    return { ok: false, error: `Profil wurde angelegt, aber der Login-Link konnte nicht gesendet werden: ${otpError.message}` };
  }

  revalidateMemberSurfaces(invitedUserId ?? undefined);
  return { ok: true, message: "Einladung wurde gesendet. Das Profil erscheint nach Erstellung/Freigabe in der Benutzerverwaltung." };
}

export async function updateMemberAction(
  userId: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("users.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const displayName = fieldText(formData, "display_name");
  if (!displayName) {
    return { ok: false, error: "Anzeigename ist ein Pflichtfeld." };
  }

  const profileTypeInput = fieldText(formData, "profile_type");
  if (!validProfileType(profileTypeInput)) {
    return { ok: false, error: "Ungültiger Mitgliedstyp." };
  }

  const statusInput = fieldText(formData, "status");
  if (!validStatus(statusInput)) {
    return { ok: false, error: "Ungültiger Profilstatus." };
  }

  const { error: profileError } = await admin.supabase
    .from("profiles")
    .update({
      display_name: displayName,
      profile_type: profileTypeInput,
      status: statusInput,
      avatar_url: fieldTextOrNull(formData, "avatar_url")
    })
    .eq("user_id", userId);

  if (profileError) {
    return { ok: false, error: supabaseErrorMessage(profileError) };
  }

  if (profileTypeInput === "fighter") {
    const { error: fighterError } = await admin.supabase.from("fighter_profiles").upsert(
      {
        user_id: userId,
        nickname: fieldTextOrNull(formData, "nickname"),
        weight_class: fieldTextOrNull(formData, "weight_class"),
        record: fieldTextOrNull(formData, "record"),
        origin: fieldTextOrNull(formData, "origin"),
        image_path: fieldTextOrNull(formData, "image_path"),
        public_bio: fieldTextOrNull(formData, "public_bio"),
        is_verified: statusInput === "active" && fieldBool(formData, "is_verified")
      },
      { onConflict: "user_id" }
    );

    if (fighterError) {
      return { ok: false, error: supabaseErrorMessage(fighterError) };
    }
  }

  if (formData.has("permissions_form")) {
    const permissions = await assignPermissionsIfAllowed(userId, formData, profileTypeInput);
    if (!permissions.ok) {
      return { ok: false, error: permissions.error };
    }
  }

  revalidateMemberSurfaces(userId);

  return { ok: true, message: "Mitglied gespeichert." };
}

export async function setMemberStatusAction(userId: string, status: MemberStatus): Promise<ActionResult> {
  const admin = await getAdminClient("users.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("profiles").update({ status }).eq("user_id", userId);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateMemberSurfaces(userId);
  return { ok: true, message: status === "active" ? "Mitglied freigegeben." : status === "suspended" ? "Mitglied gesperrt." : "Mitglied wartet wieder auf Freigabe." };
}

export async function setFighterVerifiedAction(userId: string, isVerified: boolean): Promise<ActionResult> {
  const admin = await getAdminClient("users.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("fighter_profiles").upsert(
    {
      user_id: userId,
      is_verified: isVerified
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateMemberSurfaces(userId);
  return { ok: true, message: isVerified ? "Kämpferprofil verifiziert." : "Kämpferverifizierung entfernt." };
}

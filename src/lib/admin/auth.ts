import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ADMIN_PERMISSIONS,
  type AdminAccessRequirement,
  type AdminPermission,
  hasAdminPermission,
  permissionLabels
} from "@/lib/admin/permissions";

export { ADMIN_PERMISSIONS, type AdminAccessRequirement, type AdminPermission, hasAdminPermission, permissionLabels };

export type AdminUser = {
  userId: string;
  email: string;
  displayName: string;
  role: "admin" | "staff";
  profileType: "staff";
  status: "active";
  permissions: AdminPermission[];
};

export type SessionProfile = {
  userId: string;
  email: string;
  displayName: string;
  profileType: "fighter" | "staff";
  status: string;
  avatarUrl: string | null;
  roleLabel: string;
  canAccessAdmin: boolean;
};

type AdminProfileRow = {
  display_name: string | null;
  role: string | null;
  is_active: boolean | null;
};

type ProfileRow = {
  display_name: string | null;
  profile_type: string | null;
  status: string | null;
};

type PermissionRow = {
  permission: string | null;
};

export type AdminSessionState =
  | { status: "authenticated"; user: AdminUser }
  | { status: "missing-config" | "unauthenticated" | "forbidden" };

function normalizePermissions(rows: PermissionRow[] | null | undefined) {
  const allowed = new Set<string>(ADMIN_PERMISSIONS);
  return (rows ?? [])
    .map((row) => row.permission)
    .filter((permission): permission is AdminPermission => Boolean(permission && allowed.has(permission)));
}

function allPermissions() {
  return [...ADMIN_PERMISSIONS];
}

export async function getAdminSession(requirement: AdminAccessRequirement = "admin.access"): Promise<AdminSessionState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "missing-config" };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const [{ data: legacyProfile, error: legacyError }, { data: memberProfile, error: memberError }, { data: permissionRows }] =
    await Promise.all([
      supabase
        .from("admin_profiles")
        .select("display_name, role, is_active")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("display_name, profile_type, status")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("staff_permissions")
        .select("permission")
        .eq("user_id", user.id)
    ]);

  const adminProfile = legacyProfile as AdminProfileRow | null;
  const profile = memberProfile as ProfileRow | null;
  const permissions = normalizePermissions(permissionRows as PermissionRow[] | null);

  if (adminProfile?.is_active && adminProfile.role === "admin") {
    const adminUser: AdminUser = {
      userId: user.id,
      email: user.email ?? "admin@smashtime.local",
      displayName: profile?.display_name ?? adminProfile.display_name ?? "Admin",
      role: "admin",
      profileType: "staff",
      status: "active",
      permissions: allPermissions()
    };

    return hasAdminPermission(adminUser, requirement)
      ? { status: "authenticated", user: adminUser }
      : { status: "forbidden" };
  }

  if (!memberError && profile?.profile_type === "staff" && profile.status === "active") {
    const staffUser: AdminUser = {
      userId: user.id,
      email: user.email ?? "mitglied@smashtime.local",
      displayName: profile.display_name ?? adminProfile?.display_name ?? "Mitarbeiter",
      role: "staff",
      profileType: "staff",
      status: "active",
      permissions
    };

    return hasAdminPermission(staffUser, requirement)
      ? { status: "authenticated", user: staffUser }
      : { status: "forbidden" };
  }

  if (legacyError || !adminProfile?.is_active) {
    return { status: "forbidden" };
  }

  const fallbackUser: AdminUser = {
    userId: user.id,
    email: user.email ?? "admin@smashtime.local",
    displayName: adminProfile.display_name ?? "Redaktion",
    role: adminProfile.role === "admin" ? "admin" : "staff",
    profileType: "staff",
    status: "active",
    permissions: allPermissions()
  };

  return hasAdminPermission(fallbackUser, requirement)
    ? { status: "authenticated", user: fallbackUser }
    : { status: "forbidden" };
}

export async function requireAdminSession(requirement: AdminAccessRequirement = "admin.access") {
  const session = await getAdminSession(requirement);

  if (session.status !== "authenticated") {
    return null;
  }

  return session.user;
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const [{ data: profileData }, { data: adminData }, { data: permissionsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, profile_type, status, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("admin_profiles")
      .select("display_name, role, is_active")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("staff_permissions")
      .select("permission")
      .eq("user_id", user.id)
  ]);

  const profile = profileData as (ProfileRow & { avatar_url: string | null }) | null;
  const admin = adminData as AdminProfileRow | null;
  const permissions = normalizePermissions(permissionsData as PermissionRow[] | null);
  const isAdmin = Boolean(admin?.is_active && admin.role === "admin");
  const isActiveStaff = profile?.profile_type === "staff" && profile.status === "active" && permissions.length > 0;

  return {
    userId: user.id,
    email: user.email ?? "",
    displayName: profile?.display_name ?? admin?.display_name ?? user.email ?? "Mitglied",
    profileType: profile?.profile_type === "staff" ? "staff" : "fighter",
    status: profile?.status ?? (admin?.is_active ? "active" : "pending"),
    avatarUrl: profile?.avatar_url ?? null,
    roleLabel: isAdmin ? "Administrator" : profile?.profile_type === "staff" ? "Mitarbeiter" : "Kämpfer",
    canAccessAdmin: isAdmin || isActiveStaff
  };
}

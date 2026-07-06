import type { createSupabaseServerClient } from "@/lib/supabase/server";
import { type AdminPermission, ADMIN_PERMISSIONS, permissionLabels } from "@/lib/admin/permissions";

export type MemberStatus = "pending" | "active" | "suspended";
export type MemberProfileType = "fighter" | "staff";

export type MemberAdminRow = {
  userId: string;
  email: string | null;
  displayName: string;
  slug: string | null;
  profileType: MemberProfileType;
  status: MemberStatus;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  roleLabel: string;
  isAdmin: boolean;
  isStaff: boolean;
  isFighter: boolean;
  linkedLabel: string;
  fighter: {
    nickname: string | null;
    weightClass: string | null;
    record: string | null;
    origin: string | null;
    imagePath: string | null;
    publicBio: string | null;
    isVerified: boolean;
  } | null;
  champion: {
    id: number;
    name: string;
    title: string | null;
  } | null;
  permissions: AdminPermission[];
};

export type MembersAdminData = {
  members: MemberAdminRow[];
  stats: {
    total: number;
    fighters: number;
    verifiedFighters: number;
    staff: number;
    admins: number;
    pending: number;
    suspended: number;
    withoutPermissions: number;
  };
  permissionsByKey: Record<AdminPermission, MemberAdminRow[]>;
  recentMembers: MemberAdminRow[];
  pendingMembers: MemberAdminRow[];
};

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

type ProfileRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  slug: string | null;
  profile_type: string | null;
  status: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type FighterRow = {
  user_id: string;
  nickname: string | null;
  weight_class: string | null;
  record: string | null;
  origin: string | null;
  image_path: string | null;
  public_bio: string | null;
  is_verified: boolean | null;
};

type PermissionRow = {
  user_id: string;
  permission: string | null;
};

type AdminProfileRow = {
  user_id: string;
  display_name: string | null;
  role: string | null;
  is_active: boolean | null;
};

type ChampionLinkRow = {
  id: number;
  fighter_user_id: string | null;
  name: string;
  title: string | null;
};

export const memberStatusLabels: Record<MemberStatus, string> = {
  pending: "Wartet auf Freigabe",
  active: "Aktiv",
  suspended: "Gesperrt"
};

export const memberTypeLabels: Record<MemberProfileType, string> = {
  fighter: "Mitglied (Kämpfer)",
  staff: "Mitglied (Mitarbeiter)"
};

export { ADMIN_PERMISSIONS, permissionLabels };

export function emptyMembersAdminData(): MembersAdminData {
  const permissionsByKey = ADMIN_PERMISSIONS.reduce<Record<AdminPermission, MemberAdminRow[]>>(
    (accumulator, permission) => {
      accumulator[permission] = [];
      return accumulator;
    },
    {} as Record<AdminPermission, MemberAdminRow[]>
  );

  return {
    members: [],
    stats: {
      total: 0,
      fighters: 0,
      verifiedFighters: 0,
      staff: 0,
      admins: 0,
      pending: 0,
      suspended: 0,
      withoutPermissions: 0
    },
    permissionsByKey,
    recentMembers: [],
    pendingMembers: []
  };
}

export function normalizeMemberStatus(value: string | null | undefined): MemberStatus {
  return value === "active" || value === "suspended" || value === "pending" ? value : "pending";
}

export function normalizeMemberType(value: string | null | undefined): MemberProfileType {
  return value === "staff" ? "staff" : "fighter";
}

function normalizePermissions(rows: PermissionRow[]) {
  const allowed = new Set<string>(ADMIN_PERMISSIONS);
  const permissions = new Map<string, AdminPermission[]>();

  for (const row of rows) {
    if (!row.permission || !allowed.has(row.permission)) {
      continue;
    }

    const current = permissions.get(row.user_id) ?? [];
    current.push(row.permission as AdminPermission);
    permissions.set(row.user_id, current);
  }

  return permissions;
}

export async function loadMembersAdminData(supabase: ServerClient): Promise<MembersAdminData> {
  const [
    { data: profileData, error: profileError },
    { data: fighterData, error: fighterError },
    { data: permissionData, error: permissionError },
    { data: adminData, error: adminError },
    { data: championData, error: championError }
  ] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, email, display_name, slug, profile_type, status, avatar_url, created_at, updated_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("fighter_profiles")
        .select("user_id, nickname, weight_class, record, origin, image_path, public_bio, is_verified"),
      supabase.from("staff_permissions").select("user_id, permission"),
      supabase.from("admin_profiles").select("user_id, display_name, role, is_active"),
      supabase.from("champions").select("id, fighter_user_id, name, title")
    ]);

  const loadError = profileError ?? fighterError ?? permissionError ?? adminError ?? championError;
  if (loadError) {
    throw new Error(loadError.message);
  }

  const fighters = new Map<string, FighterRow>();
  for (const fighter of (fighterData ?? []) as FighterRow[]) {
    fighters.set(fighter.user_id, fighter);
  }

  const permissions = normalizePermissions((permissionData ?? []) as PermissionRow[]);

  const admins = new Map<string, AdminProfileRow>();
  for (const admin of (adminData ?? []) as AdminProfileRow[]) {
    admins.set(admin.user_id, admin);
  }

  const champions = new Map<string, ChampionLinkRow>();
  for (const champion of (championData ?? []) as ChampionLinkRow[]) {
    if (champion.fighter_user_id) {
      champions.set(champion.fighter_user_id, champion);
    }
  }

  const members: MemberAdminRow[] = ((profileData ?? []) as ProfileRow[]).map((profile) => {
    const profileType = normalizeMemberType(profile.profile_type);
    const status = normalizeMemberStatus(profile.status);
    const fighter = fighters.get(profile.user_id);
    const champion = champions.get(profile.user_id) ?? null;
    const admin = admins.get(profile.user_id);
    const memberPermissions = permissions.get(profile.user_id) ?? [];
    const isAdmin = Boolean(admin?.is_active && admin.role === "admin");
    const displayName = profile.display_name ?? admin?.display_name ?? profile.email ?? "Mitglied";
    const isStaff = profileType === "staff";
    const isFighter = profileType === "fighter";

    return {
      userId: profile.user_id,
      email: profile.email,
      displayName,
      slug: profile.slug,
      profileType,
      status,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      roleLabel: isAdmin
        ? "Administrator"
        : isStaff
          ? memberPermissions.length > 0
            ? "Mitarbeiter"
            : "Mitarbeiter ohne Rechte"
          : "Kämpfer",
      isAdmin,
      isStaff,
      isFighter,
      linkedLabel: champion
        ? `Champion: ${champion.name}`
        : fighter
          ? fighter.is_verified
            ? "Kämpferprofil verifiziert"
            : "Kämpferprofil vorhanden"
          : "Nicht verknüpft",
      fighter: fighter
        ? {
            nickname: fighter.nickname,
            weightClass: fighter.weight_class,
            record: fighter.record,
            origin: fighter.origin,
            imagePath: fighter.image_path,
            publicBio: fighter.public_bio,
            isVerified: Boolean(fighter.is_verified)
          }
        : null,
      champion: champion
        ? {
            id: champion.id,
            name: champion.name,
            title: champion.title
          }
        : null,
      permissions: isAdmin ? [...ADMIN_PERMISSIONS] : memberPermissions
    };
  });

  const permissionsByKey = ADMIN_PERMISSIONS.reduce<Record<AdminPermission, MemberAdminRow[]>>(
    (accumulator, permission) => {
      accumulator[permission] = members.filter((member) => member.isAdmin || member.permissions.includes(permission));
      return accumulator;
    },
    {} as Record<AdminPermission, MemberAdminRow[]>
  );

  return {
    members,
    stats: {
      total: members.length,
      fighters: members.filter((member) => member.isFighter).length,
      verifiedFighters: members.filter((member) => member.fighter?.isVerified).length,
      staff: members.filter((member) => member.isStaff).length,
      admins: members.filter((member) => member.isAdmin).length,
      pending: members.filter((member) => member.status === "pending").length,
      suspended: members.filter((member) => member.status === "suspended").length,
      withoutPermissions: members.filter((member) => member.isStaff && !member.isAdmin && member.permissions.length === 0).length
    },
    permissionsByKey,
    recentMembers: members.slice(0, 5),
    pendingMembers: members.filter((member) => member.status === "pending" || (member.isFighter && !member.fighter?.isVerified))
  };
}

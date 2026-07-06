export const ADMIN_PERMISSIONS = [
  "users.manage",
  "fighters.manage",
  "champions.manage",
  "events.manage",
  "fightcards.manage",
  "news.manage",
  "sponsors.manage",
  "contact.manage",
  "media.manage",
  "settings.manage"
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];
export type AdminAccessRequirement = AdminPermission | "admin.access" | "admin";

export type PermissionUser = {
  role: "admin" | "staff";
  permissions: AdminPermission[];
};

export const permissionLabels: Record<AdminPermission, string> = {
  "users.manage": "Benutzer verwalten",
  "fighters.manage": "Kämpfer verwalten",
  "champions.manage": "Champions verwalten",
  "events.manage": "Veranstaltungen verwalten",
  "fightcards.manage": "Fightcards verwalten",
  "news.manage": "Neuigkeiten verwalten",
  "sponsors.manage": "Partner verwalten",
  "contact.manage": "Kontaktanfragen verwalten",
  "media.manage": "Medien verwalten",
  "settings.manage": "Einstellungen verwalten"
};

export function hasAdminPermission(user: PermissionUser, requirement: AdminAccessRequirement = "admin.access") {
  if (user.role === "admin") {
    return true;
  }

  if (requirement === "admin") {
    return false;
  }

  if (requirement === "admin.access") {
    return user.permissions.length > 0;
  }

  return user.permissions.includes(requirement);
}

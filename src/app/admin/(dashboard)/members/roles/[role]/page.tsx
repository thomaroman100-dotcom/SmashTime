import Link from "next/link";
import { ArrowLeft, Crown, ShieldCheck, UserCog, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Badge, EmptyState, InitialsAvatar, Panel, StatCard } from "@/components/admin/ui/primitives";
import { ADMIN_PERMISSIONS, getAdminSession, permissionLabels, type AdminPermission } from "@/lib/admin/auth";
import { formatRelative } from "@/lib/admin/format";
import { emptyMembersAdminData, loadMembersAdminData, type MemberAdminRow } from "@/lib/admin/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RoleSlug = "admin" | "staff" | "fighter";

type PageProps = {
  params: Promise<{ role: string }>;
};

const roleMeta: Record<RoleSlug, { title: string; description: string; icon: typeof Crown }> = {
  admin: {
    title: "Administrator",
    description: "Vollzugriff auf alle Adminmodule, Sicherheitseinstellungen und Benutzerrechte.",
    icon: Crown
  },
  staff: {
    title: "Mitglied (Mitarbeiter)",
    description: "Mitarbeiter erhalten konkrete Modulrechte pro Benutzer.",
    icon: UserCog
  },
  fighter: {
    title: "Mitglied (Kämpfer)",
    description: "Kämpfer haben keinen Adminzugriff und verwalten nur ihr eigenes Profil.",
    icon: UserRound
  }
};

function isRoleSlug(value: string): value is RoleSlug {
  return value === "admin" || value === "staff" || value === "fighter";
}

function assignedMembers(role: RoleSlug, members: MemberAdminRow[]) {
  if (role === "admin") return members.filter((member) => member.isAdmin);
  if (role === "staff") return members.filter((member) => member.isStaff && !member.isAdmin);
  return members.filter((member) => member.isFighter);
}

export async function generateMetadata({ params }: PageProps) {
  const { role } = await params;
  return {
    title: `${isRoleSlug(role) ? roleMeta[role].title : "Rolle"} | SmashTime Admin`
  };
}

export default async function AdminMemberRoleDetailPage({ params }: PageProps) {
  const { role } = await params;
  if (!isRoleSlug(role)) {
    notFound();
  }

  const session = await getAdminSession("users.manage");
  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?status=missing-config");
  }

  let data = emptyMembersAdminData();
  let loadError: string | null = null;

  try {
    data = await loadMembersAdminData(supabase);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Rolle konnte nicht geladen werden.";
  }

  const meta = roleMeta[role];
  const Icon = meta.icon;
  const members = assignedMembers(role, data.members);
  const affectedPermissions: AdminPermission[] =
    role === "admin" ? [...ADMIN_PERMISSIONS] : role === "staff" ? [...ADMIN_PERMISSIONS] : [];

  return (
    <div>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/members/roles">
            <ArrowLeft aria-hidden="true" size={15} /> Zurück zu Rollen & Rechte
          </Link>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
      </div>

      <section className="adm-stats" aria-label="Rollen-Details">
        <StatCard icon={Icon} tone={role === "admin" ? "red" : role === "staff" ? "purple" : "orange"} label="Zugewiesen" value={members.length} detail="Benutzer in dieser Rolle" />
        <StatCard icon={ShieldCheck} tone="red" label="Betroffene Module" value={affectedPermissions.length} detail={role === "fighter" ? "Kein Adminzugriff" : "Adminmodule"} />
        <StatCard icon={UserCog} tone="blue" label="Aktive Nutzer" value={members.filter((member) => member.status === "active").length} detail="Freigegeben" />
        <StatCard icon={UserRound} tone="orange" label="Offen" value={members.filter((member) => member.status === "pending").length} detail="Warten auf Freigabe" />
      </section>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>Rolle konnte nicht geladen werden: {loadError}</strong>
        </div>
      ) : null}

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <div className="adm-panel__head">
            <Icon aria-hidden="true" size={17} />
            <div className="adm-panel__head-text">
              <h2>Zugewiesene Benutzer</h2>
              <p>Änderungen an Rechten erfolgen im jeweiligen Benutzerprofil.</p>
            </div>
          </div>
          {members.length === 0 ? (
            <EmptyState title="Keine Zuweisungen" description="Diese Rolle ist aktuell keinem Benutzer zugewiesen." />
          ) : (
            <div className="adm-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: "minmax(240px, 1fr) 150px minmax(180px, 1fr) 150px 120px" }}>
                <span>Benutzer</span>
                <span>Status</span>
                <span>Rechte / Verknüpfung</span>
                <span>Letzte Änderung</span>
                <span>Aktion</span>
              </div>
              {members.map((member) => (
                <div className="adm-table__row" key={member.userId} style={{ gridTemplateColumns: "minmax(240px, 1fr) 150px minmax(180px, 1fr) 150px 120px" }}>
                  <div className="adm-user-cell">
                    <InitialsAvatar name={member.displayName} size="sm" />
                    <span>
                      <strong>{member.displayName}</strong>
                      <small>{member.email ?? "Keine E-Mail"}</small>
                    </span>
                  </div>
                  <Badge tone={member.status === "active" ? "green" : member.status === "suspended" ? "red" : "orange"}>{member.status === "active" ? "Aktiv" : member.status === "suspended" ? "Gesperrt" : "Pending"}</Badge>
                  <span className="adm-cell-muted">
                    {role === "staff" ? `${member.permissions.length} Rechte` : member.linkedLabel}
                  </span>
                  <span className="adm-cell-muted">{formatRelative(member.updatedAt)}</span>
                  <Link className="adm-btn adm-btn--sm" href={`/admin/members/${member.userId}`}>
                    Bearbeiten
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="adm-rail">
          <Panel icon={ShieldCheck} title="Zugriffsumfang">
            {role === "fighter" ? (
              <div className="adm-detail-list">
                <span>
                  <strong>Adminzugriff</strong>
                  <small>Kein Zugriff</small>
                </span>
                <span>
                  <strong>Profil</strong>
                  <small>Eigenes Profil und öffentliche Website</small>
                </span>
              </div>
            ) : (
              <div className="adm-detail-list">
                {affectedPermissions.map((permission) => (
                  <span key={permission}>
                    <strong>{permissionLabels[permission]}</strong>
                    <small>{role === "admin" ? "Immer erlaubt" : "Pro Mitarbeiter wählbar"}</small>
                  </span>
                ))}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Crown, Download, ShieldCheck, SlidersHorizontal, UserCog, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { MemberTabs } from "@/components/admin/MemberTabs";
import { Badge, EmptyState, InitialsAvatar, Panel, StatCard } from "@/components/admin/ui/primitives";
import { ADMIN_PERMISSIONS, getAdminSession, permissionLabels, type AdminPermission } from "@/lib/admin/auth";
import { formatRelative } from "@/lib/admin/format";
import { emptyMembersAdminData, loadMembersAdminData } from "@/lib/admin/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Rollen & Rechte | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const modules: Array<{ label: string; permission: AdminPermission }> = [
  { label: "Benutzer", permission: "users.manage" },
  { label: "Kämpfer", permission: "fighters.manage" },
  { label: "Champions", permission: "champions.manage" },
  { label: "Veranstaltungen", permission: "events.manage" },
  { label: "Fightcard", permission: "fightcards.manage" },
  { label: "Neuigkeiten", permission: "news.manage" },
  { label: "Sponsoren", permission: "sponsors.manage" },
  { label: "Kontaktanfragen", permission: "contact.manage" },
  { label: "Medien", permission: "media.manage" },
  { label: "Einstellungen", permission: "settings.manage" }
];

export default async function AdminMemberRolesPage() {
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
    loadError = error instanceof Error ? error.message : "Rollen konnten nicht geladen werden.";
  }

  const admins = data.members.filter((member) => member.isAdmin);
  const staff = data.members.filter((member) => member.isStaff && !member.isAdmin);
  const fighters = data.members.filter((member) => member.isFighter);
  const activeRoles = [admins.length > 0, staff.length > 0, fighters.length > 0].filter(Boolean).length;

  return (
    <div>
      <div className="adm-head adm-head--with-tabs">
        <div>
          <h1>Rollen & Rechte</h1>
          <p>Verwalte Benutzerrollen, Zugriffsmodell und modulbezogene Berechtigungen.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/admin/members/export" download>
            <Download aria-hidden="true" size={16} /> Export
          </a>
        </div>
      </div>

      <MemberTabs active="roles" />

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>Rollen konnten nicht geladen werden: {loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Rollen-Kennzahlen">
        <StatCard icon={UsersRound} tone="red" label="Gesamt Rollen" value={3} detail="Admin, Mitarbeiter, Kämpfer" />
        <StatCard icon={ShieldCheck} tone="purple" label="Aktive Rollen" value={activeRoles} detail="Mit zugewiesenen Nutzern" />
        <StatCard icon={SlidersHorizontal} tone="orange" label="Modulrechte" value={ADMIN_PERMISSIONS.length} detail="Granulare Berechtigungen" />
        <StatCard icon={UserCog} tone="blue" label="Ohne Rechte" value={data.stats.withoutPermissions} detail="Mitarbeiter prüfen" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <div className="adm-stack">
          <section className="adm-panel">
            <div className="adm-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: "190px minmax(260px, 1fr) 160px 170px 120px" }}>
                <span>Rolle</span>
                <span>Beschreibung</span>
                <span>Zugewiesene Nutzer</span>
                <span>Standardzugriff</span>
                <span>Details</span>
              </div>
              {[
                {
                  label: "Administrator",
                  href: "/admin/members/roles/admin",
                  description: "Vollzugriff auf alle Module, Einstellungen und Benutzerrechte.",
                  count: admins.length,
                  badge: <Badge tone="red">Vollzugriff</Badge>
                },
                {
                  label: "Mitglied (Mitarbeiter)",
                  href: "/admin/members/roles/staff",
                  description: "Erhält konkrete Rechte pro Nutzer, z. B. News, Champions oder Fightcards.",
                  count: staff.length,
                  badge: <Badge tone="purple">Modulrechte</Badge>
                },
                {
                  label: "Mitglied (Kämpfer)",
                  href: "/admin/members/roles/fighter",
                  description: "Kein Adminzugriff. Zugriff nur auf das eigene Profil und öffentliche Bereiche.",
                  count: fighters.length,
                  badge: <Badge tone="gray">Profilzugriff</Badge>
                }
              ].map((role) => (
                <div className="adm-table__row" key={role.href} style={{ gridTemplateColumns: "190px minmax(260px, 1fr) 160px 170px 120px" }}>
                  <strong>{role.label}</strong>
                  <span className="adm-cell-muted">{role.description}</span>
                  <span>{role.count} Nutzer</span>
                  <span>{role.badge}</span>
                  <Link className="adm-btn adm-btn--sm" href={role.href}>
                    Öffnen
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <Panel icon={ShieldCheck} title="Berechtigungsmatrix">
            <div className="adm-permission-matrix" role="table" aria-label="Berechtigungsmatrix">
              <div className="adm-permission-matrix__head" role="row">
                <span>Modul</span>
                <span>Administrator</span>
                <span>Mitarbeiter</span>
                <span>Kämpfer</span>
              </div>
              {modules.map((module) => (
                <div className="adm-permission-matrix__row" role="row" key={module.permission}>
                  <strong>{module.label}</strong>
                  <span className="adm-access-dot adm-access-dot--full" title="Vollzugriff" />
                  <span className={data.permissionsByKey[module.permission].length > admins.length ? "adm-access-dot adm-access-dot--partial" : "adm-access-dot"} title={permissionLabels[module.permission]} />
                  <span className="adm-access-dot" title="Kein Adminzugriff" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="adm-rail">
          <Panel icon={Crown} title="Rollenübersicht">
            <div className="adm-mini-bars">
              <div className="adm-mini-bar">
                <span><i className="adm-dot adm-dot--red" /> Administrator</span>
                <strong>{admins.length}</strong>
              </div>
              <div className="adm-mini-bar">
                <span><i className="adm-dot adm-dot--purple" /> Mitarbeiter</span>
                <strong>{staff.length}</strong>
              </div>
              <div className="adm-mini-bar">
                <span><i className="adm-dot adm-dot--gold" /> Kämpfer</span>
                <strong>{fighters.length}</strong>
              </div>
            </div>
          </Panel>

          <Panel icon={ShieldCheck} title="Modulzugriffe">
            <div className="adm-detail-list">
              {ADMIN_PERMISSIONS.slice(0, 6).map((permission) => (
                <span key={permission}>
                  <strong>{permissionLabels[permission]}</strong>
                  <small>{data.permissionsByKey[permission].length} Nutzer</small>
                </span>
              ))}
            </div>
          </Panel>

          <Panel icon={UserCog} title="Aktuelle Zuweisungen">
            {staff.length === 0 ? (
              <EmptyState title="Keine Mitarbeiter" description="Mitarbeiter werden in der Benutzerübersicht angelegt." />
            ) : (
              <div className="adm-activity-list">
                {staff.slice(0, 5).map((member) => (
                  <Link className="adm-activity" href={`/admin/members/${member.userId}`} key={member.userId}>
                    <InitialsAvatar name={member.displayName} src={member.avatarUrl} size="sm" />
                    <span>
                      <strong>{member.displayName}</strong>
                      <small>{member.permissions.length} Rechte</small>
                    </span>
                    <time>{formatRelative(member.updatedAt)}</time>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound
} from "lucide-react";
import {
  ADMIN_PERMISSIONS,
  permissionLabels,
  getAdminSession,
  hasAdminPermission,
  type AdminPermission
} from "@/lib/admin/auth";
import { Badge, InitialsAvatar } from "@/components/admin/ui/primitives";

export const metadata = {
  title: "Konto & Profil | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AccountDetail = {
  label: string;
  value: string;
  help?: string;
};

function DetailList({ items }: { items: AccountDetail[] }) {
  return (
    <div className="adm-account-fields">
      {items.map((item) => (
        <span key={item.label}>
          <small>{item.label}</small>
          <strong>{item.value}</strong>
          {item.help ? <em>{item.help}</em> : null}
        </span>
      ))}
    </div>
  );
}

function PermissionCard({ permission }: { permission: AdminPermission }) {
  return (
    <span className="adm-checkbox-card adm-checkbox-card--readonly">
      <ShieldCheck aria-hidden="true" size={18} />
      <span>
        <strong>{permissionLabels[permission]}</strong>
        <small>{permission}</small>
      </span>
    </span>
  );
}

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

  const { user } = session;
  const roleLabel = user.role === "admin" ? "Administrator" : "Mitarbeiter";
  const roleTone = user.role === "admin" ? "red" : "purple";
  const activePermissions = user.role === "admin" ? ADMIN_PERMISSIONS : user.permissions;
  const permissionSummary = user.role === "admin" ? "Alle Module" : `${activePermissions.length} aktive Rechte`;
  const canManageUsers = hasAdminPermission(user, "users.manage");
  const canManageSettings = hasAdminPermission(user, "settings.manage");

  const profileDetails: AccountDetail[] = [
    { label: "Anzeigename", value: user.displayName },
    { label: "E-Mail", value: user.email },
    { label: "Kontotyp", value: "Mitglied (Mitarbeiter)" },
    { label: "Status", value: "Aktiv", help: "Adminzugriff freigeschaltet" }
  ];

  const securityDetails: AccountDetail[] = [
    { label: "Authentifizierung", value: "Supabase Auth", help: "Session wird serverseitig geprüft" },
    { label: "Rollenquelle", value: "Datenbank", help: "Keine Rechte aus User-Metadata" },
    { label: "Sitzung", value: "Aktiv", help: "Logout im Profilmenü oben rechts" },
    { label: "Zugriff", value: permissionSummary, help: user.role === "admin" ? "Admin überschreibt Einzelrechte" : "Mitarbeiterrechte pro Nutzer" }
  ];

  const quickActions = [
    { href: "/admin", label: "Admin-Übersicht", description: "Dashboard öffnen", icon: LayoutDashboard, show: true },
    {
      href: `/admin/members/${user.userId}`,
      label: "Profil bearbeiten",
      description: "Rolle, Status und Verknüpfungen",
      icon: UserCog,
      show: canManageUsers
    },
    {
      href: "/admin/settings",
      label: "Einstellungen",
      description: "System, Marke und Sicherheit",
      icon: Settings,
      show: canManageSettings
    },
    { href: "/", label: "Website öffnen", description: "Öffentliche Seite ansehen", icon: ExternalLink, show: true }
  ].filter((action) => action.show);

  return (
    <div className="admin-page admin-account-page">
      <div className="admin-page__head adm-account-head">
        <div>
          <h1>Konto & Profil</h1>
          <p>Deine Admin-Identität, aktive Sitzung, Sicherheit und Modulrechte an einem Ort.</p>
        </div>
        <div className="adm-account-head__actions">
          <Link className="adm-account-button adm-account-button--ghost" href="/admin">
            <LayoutDashboard aria-hidden="true" size={16} />
            Übersicht
          </Link>
          {canManageUsers ? (
            <Link className="adm-account-button adm-account-button--primary" href={`/admin/members/${user.userId}`}>
              <UserCog aria-hidden="true" size={16} />
              Profil bearbeiten
            </Link>
          ) : null}
        </div>
      </div>

      <section className="adm-account-hero" id="profil">
        <div className="adm-account-hero__identity">
          <InitialsAvatar name={user.displayName} online />
          <div>
            <span className="adm-account-kicker">Aktives Admin-Konto</span>
            <h2>{user.displayName}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="adm-account-hero__badges">
          <Badge tone={roleTone}>{roleLabel}</Badge>
          <Badge tone="green">
            <CheckCircle2 aria-hidden="true" size={13} />
            Aktiv
          </Badge>
          <Badge tone="gold">{permissionSummary}</Badge>
        </div>
        <div className="adm-account-hero__stats" aria-label="Kontoübersicht">
          <span>
            <strong>{activePermissions.length}</strong>
            <small>Rechte</small>
          </span>
          <span>
            <strong>{canManageUsers ? "Ja" : "Nein"}</strong>
            <small>Benutzerverwaltung</small>
          </span>
          <span>
            <strong>{canManageSettings ? "Ja" : "Nein"}</strong>
            <small>Einstellungen</small>
          </span>
        </div>
      </section>

      <div className="adm-account-layout">
        <main className="adm-account-stack">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <UserRound aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Profilinformationen</h2>
                <p>Identität und Account-Zuordnung für den Adminbereich.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <DetailList items={profileDetails} />
            </div>
          </section>

          <section className="adm-panel" id="sicherheit">
            <div className="adm-panel__head">
              <KeyRound aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Sicherheit & Sitzung</h2>
                <p>Der Adminzugriff wird über die aktive Supabase-Session und Datenbankrechte gesteuert.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <DetailList items={securityDetails} />
            </div>
          </section>

          <section className="adm-panel" id="rechte">
            <div className="adm-panel__head">
              <ShieldCheck aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Aktive Rechte</h2>
                <p>{user.role === "admin" ? "Administratoren haben Vollzugriff auf alle Adminmodule." : "Mitarbeiter sehen nur freigegebene Module."}</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-permission-grid">
                {activePermissions.map((permission) => (
                  <PermissionCard key={permission} permission={permission} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="adm-account-rail">
          <section className="adm-panel">
            <div className="adm-panel__head">
              <BadgeCheck aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Konto-Setup</h2>
                <p>Aktueller Zustand deines Adminzugangs.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-check-list">
                <span>
                  <CheckCircle2 aria-hidden="true" size={16} />
                  <span>
                    <strong>Profil verknüpft</strong>
                    <small>{user.displayName}</small>
                  </span>
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={16} />
                  <span>
                    <strong>Rolle aktiv</strong>
                    <small>{roleLabel}</small>
                  </span>
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={16} />
                  <span>
                    <strong>Rechte geladen</strong>
                    <small>{permissionSummary}</small>
                  </span>
                </span>
              </div>
            </div>
          </section>

          <section className="adm-panel">
            <div className="adm-panel__head">
              <LayoutDashboard aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Schnellzugriff</h2>
                <p>Direkte Ziele ohne leere Buttons.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-account-quick">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link href={action.href} key={action.href}>
                      <Icon aria-hidden="true" size={17} />
                      <span>
                        <strong>{action.label}</strong>
                        <small>{action.description}</small>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="adm-panel">
            <div className="adm-panel__head">
              <Mail aria-hidden="true" size={17} />
              <div className="adm-panel__head-text">
                <h2>Kontakt</h2>
                <p>Accountbezogene Kommunikation läuft über die verknüpfte E-Mail.</p>
              </div>
            </div>
            <div className="adm-panel__body">
              <div className="adm-detail-list">
                <span>
                  <small>E-Mail</small>
                  <strong>{user.email}</strong>
                </span>
                <span>
                  <small>Status</small>
                  <strong>Erreichbar</strong>
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

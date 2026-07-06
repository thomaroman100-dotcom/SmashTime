import Link from "next/link";
import {
  CheckCircle2,
  Crown,
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCog,
  UserRound,
  UsersRound
} from "lucide-react";
import { MemberTabs } from "@/components/admin/MemberTabs";
import { Badge, EmptyState, InitialsAvatar, Pagination, Panel, StatCard, type BadgeTone } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";
import { setFighterVerifiedAction, setMemberStatusAction } from "@/lib/admin/actions/members";
import { formatRelative } from "@/lib/admin/format";
import { loadMembersAdminData, memberStatusLabels, memberTypeLabels, type MemberAdminRow, type MemberStatus } from "@/lib/admin/members";
import { getAdminSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Benutzer | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    rolle?: string;
    typ?: string;
    status?: string;
    verifizierung?: string;
    seite?: string;
  }>;
};

function statusTone(status: MemberStatus): BadgeTone {
  if (status === "active") return "green";
  if (status === "suspended") return "red";
  return "orange";
}

function roleTone(member: MemberAdminRow): BadgeTone {
  if (member.isAdmin) return "red";
  if (member.isStaff) return "purple";
  return "gold";
}

function verificationLabel(member: MemberAdminRow) {
  if (member.isFighter) {
    return member.fighter?.isVerified ? "Verifiziert" : "Offen";
  }
  return member.permissions.length > 0 || member.isAdmin ? "Rechte gesetzt" : "Ohne Rechte";
}

export default async function AdminMembersPage({ searchParams }: PageProps) {
  const { q, rolle, typ, status, verifizierung, seite } = await searchParams;
  const session = await getAdminSession("users.manage");
  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?status=missing-config");
  }

  let members: MemberAdminRow[] = [];
  let loadError: string | null = null;
  let stats = {
    total: 0,
    fighters: 0,
    verifiedFighters: 0,
    staff: 0,
    admins: 0,
    pending: 0,
    suspended: 0,
    withoutPermissions: 0
  };
  let recentMembers: MemberAdminRow[] = [];

  try {
    const data = await loadMembersAdminData(supabase);
    members = data.members;
    stats = data.stats;
    recentMembers = data.recentMembers;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Benutzer konnten nicht geladen werden.";
  }

  const query = (q ?? "").trim().toLowerCase();
  const filtered = members.filter((member) => {
    if (query) {
      const haystack = `${member.displayName} ${member.email ?? ""} ${member.roleLabel} ${member.linkedLabel}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (rolle === "admin" && !member.isAdmin) return false;
    if (rolle === "staff" && (!member.isStaff || member.isAdmin)) return false;
    if (rolle === "fighter" && !member.isFighter) return false;
    if (typ && member.profileType !== typ) return false;
    if (status && member.status !== status) return false;
    if (verifizierung === "verified" && !member.fighter?.isVerified) return false;
    if (verifizierung === "open" && !(member.status === "pending" || (member.isFighter && !member.fighter?.isVerified))) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tableColumns = "minmax(220px, 1.25fr) 124px 138px minmax(160px, 0.9fr) 118px 128px 126px";
  const canManagePermissions = session.user.role === "admin";

  return (
    <div>
      <div className="adm-head adm-head--with-tabs">
        <div>
          <h1>Benutzer</h1>
          <p>Verwalte registrierte Mitglieder, Rollen, Verknüpfungen und Zugriffsrechte zentral an einem Ort.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/admin/members/export" download>
            <Download aria-hidden="true" size={16} /> Export
          </a>
          <Link className="adm-btn adm-btn--primary" href="/admin/members/new">
            <Plus aria-hidden="true" size={16} /> Benutzer hinzufügen
          </Link>
        </div>
      </div>

      <MemberTabs active="users" />

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>Benutzer konnten nicht geladen werden: {loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Benutzer-Kennzahlen">
        <StatCard icon={UsersRound} tone="red" label="Gesamt Nutzer" value={stats.total} detail="Registrierte Profile" />
        <StatCard icon={UserRound} tone="purple" label="Kämpfer" value={stats.fighters} detail={`${stats.verifiedFighters} verifiziert`} />
        <StatCard icon={Crown} tone="orange" label="Champions" value={members.filter((member) => member.champion).length} detail="Verknüpfte Titelprofile" />
        <StatCard icon={ShieldCheck} tone="blue" label="Administratoren" value={stats.admins} detail="Vollzugriff" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <form className="adm-toolbar" method="get" action="/admin/members">
            <div className="adm-search">
              <Search aria-hidden="true" size={16} />
              <input type="search" name="q" defaultValue={q ?? ""} placeholder="Benutzer suchen..." aria-label="Benutzer suchen" />
            </div>
            <div className="adm-filter">
              <span>Rolle</span>
              <select name="rolle" defaultValue={rolle ?? ""}>
                <option value="">Alle Rollen</option>
                <option value="admin">Administrator</option>
                <option value="staff">Mitarbeiter</option>
                <option value="fighter">Kämpfer</option>
              </select>
            </div>
            <div className="adm-filter">
              <span>Typ</span>
              <select name="typ" defaultValue={typ ?? ""}>
                <option value="">Alle Typen</option>
                {Object.entries(memberTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-filter">
              <span>Status</span>
              <select name="status" defaultValue={status ?? ""}>
                <option value="">Alle Status</option>
                {Object.entries(memberStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-filter">
              <span>Verifizierung</span>
              <select name="verifizierung" defaultValue={verifizierung ?? ""}>
                <option value="">Alle</option>
                <option value="verified">Verifiziert</option>
                <option value="open">Offen</option>
              </select>
            </div>
            <button className="adm-btn" type="submit">
              Filtern
            </button>
            <Link className="adm-btn adm-btn--ghost" href="/admin/members">
              <RotateCcw aria-hidden="true" size={14} /> Filter zurücksetzen
            </Link>
          </form>

          {pageRows.length === 0 ? (
            <EmptyState
              icon={UsersRound}
              title={filtered.length === 0 && members.length > 0 ? "Keine Treffer" : "Noch keine Benutzer"}
              description={
                filtered.length === 0 && members.length > 0
                  ? "Für die aktuelle Suche/Filter gibt es keine Benutzer."
                  : "Neue Registrierungen und Einladungen erscheinen hier."
              }
            />
          ) : (
            <div className="adm-table adm-member-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
                <span>Benutzer</span>
                <span>Rolle</span>
                <span>Typ</span>
                <span>Verknüpfung</span>
                <span>Status</span>
                <span>Letzte Aktivität</span>
                <span style={{ textAlign: "right" }}>Aktionen</span>
              </div>
              {pageRows.map((member) => (
                <div className="adm-table__row" key={member.userId} style={{ gridTemplateColumns: tableColumns }}>
                  <div className="adm-user-cell">
                    <InitialsAvatar name={member.displayName} size="sm" online={member.status === "active"} />
                    <div>
                      <strong>{member.displayName}</strong>
                      <span className="adm-cell-sub">{member.email ?? "E-Mail nicht verfügbar"}</span>
                    </div>
                  </div>
                  <span>
                    <Badge tone={roleTone(member)}>{member.roleLabel}</Badge>
                  </span>
                  <span>
                    <Badge tone={member.isFighter ? "purple" : "gray"}>{memberTypeLabels[member.profileType]}</Badge>
                  </span>
                  <span className={member.champion ? "adm-cell-sub--red" : "adm-cell-muted"}>{member.linkedLabel}</span>
                  <span>
                    <Badge tone={statusTone(member.status)}>{memberStatusLabels[member.status]}</Badge>
                    <span className="adm-cell-sub">{verificationLabel(member)}</span>
                  </span>
                  <span className="adm-cell-muted">{formatRelative(member.updatedAt)}</span>
                  <div className="adm-row-actions">
                    <Link className="adm-icon-btn" href={`/admin/members/${member.userId}`} aria-label={`${member.displayName} bearbeiten`}>
                      <Pencil aria-hidden="true" size={15} />
                    </Link>
                    <Link className="adm-icon-btn" href={`/admin/members/${member.userId}`} aria-label={`${member.displayName} öffnen`}>
                      <Eye aria-hidden="true" size={15} />
                    </Link>
                    <RowMenu
                      label={`Weitere Aktionen für ${member.displayName}`}
                      items={[
                        member.status !== "active"
                          ? {
                              type: "action",
                              label: "Freigeben",
                              action: setMemberStatusAction.bind(null, member.userId, "active")
                            }
                          : {
                              type: "action",
                              label: "Sperren",
                              danger: true,
                              action: setMemberStatusAction.bind(null, member.userId, "suspended"),
                              confirm: {
                                title: "Benutzer sperren?",
                                message: "Der Account verliert Zugriff auf geschützte Bereiche.",
                                itemLabel: member.displayName,
                                itemMeta: member.email ?? undefined
                              }
                            },
                        ...(member.isFighter
                          ? [
                              {
                                type: "action" as const,
                                label: member.fighter?.isVerified ? "Verifizierung entfernen" : "Kämpfer verifizieren",
                                action: setFighterVerifiedAction.bind(null, member.userId, !member.fighter?.isVerified)
                              }
                            ]
                          : []),
                        ...(canManagePermissions
                          ? [
                              {
                                type: "link" as const,
                                label: "Rollen & Rechte prüfen",
                                href: "/admin/members/roles"
                              }
                            ]
                          : [])
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="adm-panel__body" style={{ borderTop: "1px solid var(--adm-border-soft)" }}>
            <Pagination
              basePath="/admin/members"
              page={page}
              pageCount={pageCount}
              totalLabel={
                filtered.length === 0
                  ? "0 Benutzer"
                  : `Zeige ${(page - 1) * PAGE_SIZE + 1} bis ${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Benutzern`
              }
              searchParams={{ q, rolle, typ, status, verifizierung }}
            />
          </div>
        </section>

        <aside className="adm-rail">
          <Panel icon={Crown} title="Rollenverteilung">
            <div className="adm-mini-bars">
              {[
                ["Administrator", stats.admins, "red"],
                ["Mitarbeiter", stats.staff, "purple"],
                ["Kämpfer", stats.fighters, "gold"]
              ].map(([label, value, tone]) => (
                <div className="adm-mini-bar" key={String(label)}>
                  <span>
                    <i className={`adm-dot adm-dot--${tone}`} />
                    {label}
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className="adm-mini-total">
                <span>Gesamt</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
          </Panel>

          <Panel icon={MoreHorizontal} title="Offene Freigaben">
            <div className="adm-verification-summary">
              <span>
                <UserRound aria-hidden="true" size={16} />
                Pending-Profile <strong>{stats.pending}</strong>
              </span>
              <span>
                <ShieldCheck aria-hidden="true" size={16} />
                Kämpfer offen <strong>{members.filter((member) => member.isFighter && !member.fighter?.isVerified).length}</strong>
              </span>
              <span>
                <UserCog aria-hidden="true" size={16} />
                Mitarbeiter ohne Rechte <strong>{stats.withoutPermissions}</strong>
              </span>
            </div>
            <Link className="adm-panel-link" href="/admin/members/verifications">
              Verifizierungen öffnen
            </Link>
          </Panel>

          <Panel icon={CheckCircle2} title="Letzte Registrierungen">
            {recentMembers.length === 0 ? (
              <EmptyState title="Keine Registrierungen" description="Neue Profile erscheinen automatisch hier." />
            ) : (
              <div className="adm-activity-list">
                {recentMembers.map((member) => (
                  <Link className="adm-activity" href={`/admin/members/${member.userId}`} key={member.userId}>
                    <InitialsAvatar name={member.displayName} size="sm" />
                    <span>
                      <strong>{member.displayName}</strong>
                      <small>{member.email ?? member.roleLabel}</small>
                    </span>
                    <time>{formatRelative(member.createdAt)}</time>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel icon={ShieldCheck} title="Schnellzugriff">
            <div className="adm-quick-stack">
              <Link className="adm-quick-link" href="/admin/members/new">
                <span className="adm-quick-link__icon">
                  <Plus aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>Benutzer hinzufügen</strong>
                  <small>Magic-Link-Einladung senden</small>
                </span>
              </Link>
              <Link className="adm-quick-link" href="/admin/members/roles">
                <span className="adm-quick-link__icon">
                  <UserCog aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>Rollen & Rechte</strong>
                  <small>Matrix und Mitarbeiterrechte prüfen</small>
                </span>
              </Link>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

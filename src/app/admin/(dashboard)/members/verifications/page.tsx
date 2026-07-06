import Link from "next/link";
import { Check, Download, FileCheck2, Lock, MoreHorizontal, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { redirect } from "next/navigation";
import { MemberTabs } from "@/components/admin/MemberTabs";
import { ActionButton } from "@/components/admin/ui/ActionButton";
import { Badge, EmptyState, InitialsAvatar, Panel, StatCard } from "@/components/admin/ui/primitives";
import { setFighterVerifiedAction, setMemberStatusAction } from "@/lib/admin/actions/members";
import { getAdminSession } from "@/lib/admin/auth";
import { formatRelative } from "@/lib/admin/format";
import { emptyMembersAdminData, loadMembersAdminData, memberStatusLabels } from "@/lib/admin/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Verifizierungen & Freigaben | SmashTime Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminMemberVerificationsPage() {
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
    loadError = error instanceof Error ? error.message : "Verifizierungen konnten nicht geladen werden.";
  }

  const openFighterLinks = data.members.filter((member) => member.isFighter && !member.fighter?.isVerified);
  const suspended = data.members.filter((member) => member.status === "suspended");
  const queue = data.pendingMembers;
  const selected = queue[0] ?? null;

  return (
    <div>
      <div className="adm-head adm-head--with-tabs">
        <div>
          <h1>Verifizierungen & Freigaben</h1>
          <p>Prüfe neue Registrierungen, Kämpfer-Zuordnungen und sensible Freigaben.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/admin/members/export" download>
            <Download aria-hidden="true" size={16} /> Export
          </a>
        </div>
      </div>

      <MemberTabs active="verifications" />

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>Verifizierungen konnten nicht geladen werden: {loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Verifizierungs-Kennzahlen">
        <StatCard icon={FileCheck2} tone="red" label="Offene Prüfungen" value={queue.length} detail="Freigaben und Verknüpfungen" />
        <StatCard icon={UserRound} tone="purple" label="Kämpfer-Zuordnungen" value={openFighterLinks.length} detail="Noch nicht verifiziert" />
        <StatCard icon={ShieldCheck} tone="orange" label="Pending-Profile" value={data.stats.pending} detail="Warten auf Freigabe" />
        <StatCard icon={Lock} tone="red" label="Gesperrte Konten" value={suspended.length} detail="Manuell blockiert" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <div className="adm-panel__head">
            <FileCheck2 aria-hidden="true" size={17} />
            <div className="adm-panel__head-text">
              <h2>Verifizierungs-Queue</h2>
              <p>Alle offenen Profile und Kämpferfreigaben in einer priorisierten Liste.</p>
            </div>
          </div>

          {queue.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="Keine offenen Prüfungen" description="Alle registrierten Profile sind aktuell sauber freigegeben oder bearbeitet." />
          ) : (
            <div className="adm-table adm-verification-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: "minmax(240px, 1.2fr) 180px 180px 130px 150px 170px" }}>
                <span>Benutzer</span>
                <span>Anfrage-Typ</span>
                <span>Verknüpfung</span>
                <span>Status</span>
                <span>Eingang</span>
                <span style={{ textAlign: "right" }}>Aktionen</span>
              </div>
              {queue.map((member) => (
                <div className="adm-table__row" key={member.userId} style={{ gridTemplateColumns: "minmax(240px, 1.2fr) 180px 180px 130px 150px 170px" }}>
                  <div className="adm-user-cell">
                    <InitialsAvatar name={member.displayName} size="sm" />
                    <span>
                      <strong>{member.displayName}</strong>
                      <small>{member.email ?? "Keine E-Mail"}</small>
                    </span>
                  </div>
                  <span className="adm-cell-muted">{member.isFighter ? "Kämpfer-Verifizierung" : "Profil-Freigabe"}</span>
                  <span className="adm-cell-muted">{member.linkedLabel}</span>
                  <Badge tone={member.status === "pending" ? "orange" : member.status === "suspended" ? "red" : "gray"}>
                    {memberStatusLabels[member.status]}
                  </Badge>
                  <span className="adm-cell-muted">{formatRelative(member.createdAt)}</span>
                  <div className="adm-row-actions">
                    <ActionButton
                      label={`${member.displayName} freigeben`}
                      className="adm-icon-btn adm-icon-btn--success"
                      action={setMemberStatusAction.bind(null, member.userId, "active")}
                      refreshAfter
                    >
                      <Check aria-hidden="true" size={15} />
                    </ActionButton>
                    {member.isFighter ? (
                      <ActionButton
                        label={`${member.displayName} als Kämpfer verifizieren`}
                        className="adm-icon-btn"
                        action={setFighterVerifiedAction.bind(null, member.userId, true)}
                        refreshAfter
                      >
                        <ShieldCheck aria-hidden="true" size={15} />
                      </ActionButton>
                    ) : null}
                    <ActionButton
                      label={`${member.displayName} ablehnen`}
                      className="adm-icon-btn adm-icon-btn--danger"
                      action={setMemberStatusAction.bind(null, member.userId, "suspended")}
                      confirm={{
                        title: "Freigabe ablehnen?",
                        message: "Der Benutzer wird gesperrt und verliert Zugriff auf geschützte Bereiche.",
                        itemLabel: member.displayName,
                        itemMeta: member.email ?? undefined
                      }}
                      refreshAfter
                    >
                      <X aria-hidden="true" size={15} />
                    </ActionButton>
                    <Link className="adm-icon-btn" href={`/admin/members/${member.userId}`} aria-label={`${member.displayName} öffnen`}>
                      <MoreHorizontal aria-hidden="true" size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="adm-rail">
          <Panel icon={Search} title="Prüfungsdetails">
            {selected ? (
              <div className="adm-verification-detail">
                <div className="adm-profile-summary">
                  <InitialsAvatar name={selected.displayName} online={selected.status === "active"} />
                  <div>
                    <strong>{selected.displayName}</strong>
                    <span>{selected.email ?? "Keine E-Mail"}</span>
                  </div>
                </div>
                <Badge tone={selected.isFighter ? "purple" : "gray"}>{selected.isFighter ? "Kämpfer-Verifizierung" : "Profil-Freigabe"}</Badge>
                <p>{selected.linkedLabel}</p>
                <Link className="adm-btn adm-btn--sm" href={`/admin/members/${selected.userId}`}>
                  Profil bearbeiten
                </Link>
              </div>
            ) : (
              <EmptyState title="Keine Auswahl" description="Sobald Prüfungen offen sind, erscheint hier die erste Prüfung." />
            )}
          </Panel>

          <Panel icon={FileCheck2} title="Dokumenten-Checkliste">
            <div className="adm-check-list">
              <span>
                <Check aria-hidden="true" size={16} />
                Profil vorhanden <small>Automatisch geprüft</small>
              </span>
              <span>
                <Check aria-hidden="true" size={16} />
                Rolle korrekt <small>Admin prüft vor Freigabe</small>
              </span>
              <span>
                <Check aria-hidden="true" size={16} />
                E-Mail vorhanden <small>Basis für Login-Link</small>
              </span>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

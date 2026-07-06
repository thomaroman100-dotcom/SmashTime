import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { MemberAccessForm } from "@/components/admin/MemberAccessForm";
import { Badge, InitialsAvatar, Panel } from "@/components/admin/ui/primitives";
import { updateMemberAction } from "@/lib/admin/actions/members";
import { getAdminSession } from "@/lib/admin/auth";
import { formatRelative } from "@/lib/admin/format";
import { emptyMembersAdminData, loadMembersAdminData, memberStatusLabels, memberTypeLabels, type MemberStatus } from "@/lib/admin/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ userId: string }>;
};

function statusTone(status: MemberStatus) {
  if (status === "active") return "green" as const;
  if (status === "suspended") return "red" as const;
  return "orange" as const;
}

export async function generateMetadata({ params }: PageProps) {
  const { userId } = await params;
  return {
    title: `Benutzer bearbeiten | ${userId} | SmashTime Admin`
  };
}

export default async function AdminMemberEditPage({ params }: PageProps) {
  const { userId } = await params;
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
    loadError = error instanceof Error ? error.message : "Benutzer konnte nicht geladen werden.";
  }

  const member = data.members.find((item) => item.userId === userId);
  if (loadError) {
    return (
      <div>
        <div className="adm-head">
          <div>
            <Link className="adm-head__back" href="/admin/members">
              <ArrowLeft aria-hidden="true" size={15} /> Zurück zur Übersicht
            </Link>
            <h1>Benutzer bearbeiten</h1>
            <p>Das Profil konnte noch nicht geladen werden.</p>
          </div>
        </div>
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>Benutzer konnte nicht geladen werden: {loadError}</strong>
        </div>
      </div>
    );
  }

  if (!member) {
    notFound();
  }

  const canManagePermissions = session.user.role === "admin";

  return (
    <div>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/members">
            <ArrowLeft aria-hidden="true" size={15} /> Zurück zur Übersicht
          </Link>
          <h1>Benutzer bearbeiten</h1>
          <p>Stammdaten, Typ, Verknüpfungen und Zugriffsrechte dieses Mitglieds verwalten.</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn" href="/admin/members/roles">
            <ShieldCheck aria-hidden="true" size={16} /> Rechte prüfen
          </Link>
        </div>
      </div>

      <div className="adm-member-edit-layout">
        <div>
          <MemberAccessForm
            member={member}
            canManagePermissions={canManagePermissions}
            action={updateMemberAction.bind(null, member.userId)}
          />
        </div>

        <aside className="adm-rail">
          <Panel icon={UserRound} title="Profilzusammenfassung">
            <div className="adm-profile-summary">
              <InitialsAvatar name={member.displayName} online={member.status === "active"} />
              <div>
                <strong>{member.displayName}</strong>
                <span>{member.email ?? "Keine E-Mail hinterlegt"}</span>
              </div>
            </div>
            <div className="adm-chip-row">
              <Badge tone={statusTone(member.status)}>{memberStatusLabels[member.status]}</Badge>
              <Badge tone={member.isAdmin ? "red" : member.isStaff ? "purple" : "gold"}>{member.roleLabel}</Badge>
              <Badge tone={member.isFighter ? "purple" : "gray"}>{memberTypeLabels[member.profileType]}</Badge>
            </div>
          </Panel>

          <Panel icon={CheckCircle2} title="Zuweisungs-Checkliste">
            <div className="adm-check-list">
              <span>
                <CheckCircle2 aria-hidden="true" size={16} />
                Profil angelegt <small>{formatRelative(member.createdAt)}</small>
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={16} />
                Status gesetzt <small>{memberStatusLabels[member.status]}</small>
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={16} />
                Verknüpfung <small>{member.linkedLabel}</small>
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={16} />
                Rechte <small>{member.isAdmin ? "Vollzugriff" : `${member.permissions.length} Rechte`}</small>
              </span>
            </div>
          </Panel>

          <Panel icon={Mail} title="Kontakt">
            <div className="adm-detail-list">
              <span>
                <strong>E-Mail</strong>
                <small>{member.email ?? "Nicht verfügbar"}</small>
              </span>
              <span>
                <strong>Letzte Änderung</strong>
                <small>{formatRelative(member.updatedAt)}</small>
              </span>
              <span>
                <strong>Benutzer-ID</strong>
                <small>{member.userId}</small>
              </span>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

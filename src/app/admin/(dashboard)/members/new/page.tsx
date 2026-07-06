import Link from "next/link";
import { ArrowLeft, CheckCircle2, MailPlus, Send, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { MemberInviteForm } from "@/components/admin/MemberInviteForm";
import { Badge, Panel } from "@/components/admin/ui/primitives";
import { createMemberInviteAction } from "@/lib/admin/actions/members";
import { getAdminSession } from "@/lib/admin/auth";

export const metadata = {
  title: "Benutzer hinzufügen | SmashTime Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminMemberNewPage() {
  const session = await getAdminSession("users.manage");
  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

  const canManagePermissions = session.user.role === "admin";

  return (
    <div>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/members">
            <ArrowLeft aria-hidden="true" size={15} /> Zurück zur Übersicht
          </Link>
          <h1>Benutzer hinzufügen</h1>
          <p>Lege einen neuen Benutzer an oder sende eine Einladung mit vordefiniertem Typ und Zuordnung.</p>
        </div>
      </div>

      <div className="adm-member-new-layout">
        <MemberInviteForm action={createMemberInviteAction} canManagePermissions={canManagePermissions} />

        <aside className="adm-rail">
          <Panel icon={MailPlus} title="Einladungs-Vorschau">
            <div className="adm-mail-preview">
              <strong>SmashTime Einladung</strong>
              <p>
                Das neue Mitglied erhält eine E-Mail mit einem sicheren Login-Link. Nach dem ersten Login greifen Status,
                Typ und Mitarbeiterrechte aus dieser Verwaltung.
              </p>
              <span className="adm-mail-preview__cta">
                <Send aria-hidden="true" size={14} /> Einladung annehmen
              </span>
            </div>
          </Panel>

          <Panel icon={UserRound} title="Wird erstellt als">
            <div className="adm-detail-list">
              <span>
                <strong>Rolle</strong>
                <small>Auswahl im Formular</small>
              </span>
              <span>
                <strong>Typ</strong>
                <small>Mitglied (Kämpfer) oder Mitglied (Mitarbeiter)</small>
              </span>
              <span>
                <strong>Status</strong>
                <Badge tone="orange">Wartet auf Freigabe</Badge>
              </span>
            </div>
          </Panel>

          <Panel icon={CheckCircle2} title="Onboarding-Check">
            <div className="adm-step-list">
              <span>
                <i>1</i>
                <strong>Einladung senden</strong>
                <small>Benutzer erhält Zugangsinformationen.</small>
              </span>
              <span>
                <i>2</i>
                <strong>E-Mail bestätigen</strong>
                <small>Login-Link öffnet das Konto.</small>
              </span>
              <span>
                <i>3</i>
                <strong>Profil verknüpfen</strong>
                <small>Kämpferprofil oder Mitarbeiterrechte prüfen.</small>
              </span>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useActionState, useEffect } from "react";
import { Loader2, MailPlus, Send, ShieldCheck, UserRound } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { ADMIN_PERMISSIONS, permissionLabels } from "@/lib/admin/permissions";
import { memberStatusLabels, memberTypeLabels } from "@/lib/admin/members";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";

type MemberInviteFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  canManagePermissions: boolean;
};

export function MemberInviteForm({ action, canManagePermissions }: MemberInviteFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Einladung gesendet", state.message);
    } else {
      ui.toast("error", "Einladung fehlgeschlagen", state.error);
    }
  }, [state, ui]);

  return (
    <form action={formAction} className="adm-member-editor">
      {canManagePermissions ? <input type="hidden" name="permissions_form" value="1" /> : null}

      <section className="adm-fsection">
        <div className="adm-fsection__head">
          <span className="adm-num">1</span>
          <div>
            <h2>Basisdaten</h2>
            <p>Name, E-Mail und öffentlicher Anzeigename des neuen Mitglieds.</p>
          </div>
        </div>
        <div className="adm-fsection__body adm-grid-2">
          <div className="adm-field">
            <label htmlFor="invite-display-name">Anzeigename</label>
            <input id="invite-display-name" name="display_name" placeholder="z. B. Max Kurz" required />
          </div>
          <div className="adm-field">
            <label htmlFor="invite-email">E-Mail</label>
            <input id="invite-email" type="email" name="email" placeholder="name@example.com" required />
          </div>
          <div className="adm-field">
            <label htmlFor="invite-avatar">Avatar-URL</label>
            <input id="invite-avatar" name="avatar_url" placeholder="/images/..." />
          </div>
        </div>
      </section>

      <section className="adm-fsection">
        <div className="adm-fsection__head">
          <span className="adm-num">2</span>
          <div>
            <h2>Rolle & Freigabe</h2>
            <p>Registrierungen bleiben standardmäßig kontrolliert, können aber direkt aktiv angelegt werden.</p>
          </div>
        </div>
        <div className="adm-fsection__body adm-grid-3">
          <div className="adm-field">
            <label htmlFor="invite-type">Mitgliedstyp</label>
            <select id="invite-type" name="profile_type" defaultValue="fighter">
              {Object.entries(memberTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="invite-status">Status nach Erstellung</label>
            <select id="invite-status" name="status" defaultValue="pending">
              {Object.entries(memberStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <label className="adm-switch-row" htmlFor="invite-verified">
            <span>
              <strong>
                <ShieldCheck aria-hidden="true" size={15} /> Kämpfer verifiziert
              </strong>
              <p>Nur bei aktiven Kämpfern für Auswahlfelder relevant.</p>
            </span>
            <span className="adm-switch">
              <input id="invite-verified" type="checkbox" name="is_verified" />
              <i />
            </span>
          </label>
        </div>
      </section>

      <section className="adm-fsection">
        <div className="adm-fsection__head">
          <span className="adm-num">3</span>
          <div>
            <h2>Kämpferprofil</h2>
            <p>Optional, aber sofort nutzbar für Fightcards und Champion-Verknüpfungen.</p>
          </div>
        </div>
        <div className="adm-fsection__body">
          <div className="adm-grid-3">
            <div className="adm-field">
              <label htmlFor="invite-nickname">Kampfname</label>
              <input id="invite-nickname" name="nickname" />
            </div>
            <div className="adm-field">
              <label htmlFor="invite-weight">Gewichtsklasse</label>
              <input id="invite-weight" name="weight_class" />
            </div>
            <div className="adm-field">
              <label htmlFor="invite-record">Bilanz</label>
              <input id="invite-record" name="record" />
            </div>
            <div className="adm-field">
              <label htmlFor="invite-origin">Herkunft</label>
              <input id="invite-origin" name="origin" />
            </div>
            <div className="adm-field">
              <label htmlFor="invite-image">Bildpfad</label>
              <input id="invite-image" name="image_path" />
            </div>
          </div>
          <div className="adm-field">
            <label htmlFor="invite-bio">Kurzprofil</label>
            <textarea id="invite-bio" name="public_bio" rows={3} />
          </div>
        </div>
      </section>

      {canManagePermissions ? (
        <section className="adm-fsection">
          <div className="adm-fsection__head">
            <span className="adm-num">4</span>
            <div>
              <h2>Mitarbeiterrechte</h2>
              <p>Wird nur angewendet, wenn der neue Account als Mitarbeiter angelegt wird.</p>
            </div>
          </div>
          <div className="adm-fsection__body">
            <div className="adm-permission-grid">
              {ADMIN_PERMISSIONS.map((permission) => (
                <label className="adm-checkbox-card" key={permission}>
                  <input type="checkbox" name="permissions" value={permission} />
                  <span>
                    <strong>{permissionLabels[permission]}</strong>
                    <small>{permission}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {state && !state.ok ? (
        <p className="admin-form__message admin-form__message--error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="adm-form-actions">
        <span>
          <MailPlus aria-hidden="true" size={16} /> Magic-Link-Einladung per E-Mail
        </span>
        <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
          {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Send aria-hidden="true" size={16} />}
          Speichern & Einladung senden
        </button>
      </div>

      <aside className="adm-invite-note">
        <UserRound aria-hidden="true" size={19} />
        <div>
          <strong>Hinweis zum Ablauf</strong>
          <p>
            Supabase sendet einen Login-Link an die angegebene E-Mail. Neue Profile bleiben je nach Status kontrolliert
            freigebbar und erscheinen danach in der Benutzerverwaltung.
          </p>
        </div>
      </aside>
    </form>
  );
}

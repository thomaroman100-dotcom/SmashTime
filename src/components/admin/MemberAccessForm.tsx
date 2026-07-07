"use client";

import { useActionState, useEffect } from "react";
import { Loader2, Save, ShieldCheck, UserRound } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import { ADMIN_PERMISSIONS, permissionLabels } from "@/lib/admin/permissions";
import { memberStatusLabels, memberTypeLabels, type MemberAdminRow, type MemberStatus } from "@/lib/admin/members";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";
import { Badge } from "@/components/admin/ui/primitives";

type MemberAccessFormProps = {
  member: MemberAdminRow;
  canManagePermissions: boolean;
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
};

function statusTone(status: MemberStatus) {
  if (status === "active") {
    return "green" as const;
  }
  if (status === "suspended") {
    return "red" as const;
  }
  return "orange" as const;
}

export function MemberAccessForm({ member, canManagePermissions, action }: MemberAccessFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Erfolg", state.message);
    } else {
      ui.toast("error", "Fehler", state.error);
    }
  }, [state, ui]);

  return (
    <form action={formAction} className="adm-member-card">
      {canManagePermissions ? <input type="hidden" name="permissions_form" value="1" /> : null}
      <div className="adm-member-card__head">
        <span className="adm-member-card__avatar">
          <UserRound aria-hidden="true" size={22} />
        </span>
        <div>
          <h2>{member.displayName}</h2>
          <p>{member.email ?? "E-Mail nicht verfügbar"}</p>
        </div>
        <Badge tone={statusTone(member.status)} uppercase>
          {memberStatusLabels[member.status]}
        </Badge>
      </div>

      <div className="adm-grid-3">
        <div className="adm-field">
          <label htmlFor={`display-name-${member.userId}`}>Anzeigename</label>
          <input id={`display-name-${member.userId}`} name="display_name" defaultValue={member.displayName} required />
        </div>
        <div className="adm-field">
          <label htmlFor={`profile-type-${member.userId}`}>Mitgliedstyp</label>
          <select id={`profile-type-${member.userId}`} name="profile_type" defaultValue={member.profileType}>
            {Object.entries(memberTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor={`profile-status-${member.userId}`}>Status</label>
          <select id={`profile-status-${member.userId}`} name="status" defaultValue={member.status}>
            {Object.entries(memberStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <details className="adm-member-card__details" open={member.profileType === "fighter"}>
        <summary>Kämpferprofil</summary>
        <div className="adm-grid-3">
          <div className="adm-field">
            <label htmlFor={`nickname-${member.userId}`}>Kampfname</label>
            <input id={`nickname-${member.userId}`} name="nickname" defaultValue={member.fighter?.nickname ?? ""} />
          </div>
          <div className="adm-field">
            <label htmlFor={`weight-${member.userId}`}>Gewichtsklasse</label>
            <input id={`weight-${member.userId}`} name="weight_class" defaultValue={member.fighter?.weightClass ?? ""} />
          </div>
          <div className="adm-field">
            <label htmlFor={`record-${member.userId}`}>Bilanz</label>
            <input id={`record-${member.userId}`} name="record" defaultValue={member.fighter?.record ?? ""} />
          </div>
          <div className="adm-field">
            <label htmlFor={`origin-${member.userId}`}>Herkunft</label>
            <input id={`origin-${member.userId}`} name="origin" defaultValue={member.fighter?.origin ?? ""} />
          </div>
          <div className="adm-field">
            <label htmlFor={`image-${member.userId}`}>Bildpfad</label>
            <input id={`image-${member.userId}`} name="image_path" defaultValue={member.fighter?.imagePath ?? ""} />
          </div>
          <label className="adm-switch-row" htmlFor={`verified-${member.userId}`}>
            <span>
              <strong>
                <ShieldCheck aria-hidden="true" size={15} /> Verifizierter Kämpfer
              </strong>
              <p>Erscheint in Fightcard- und Champion-Auswahlfeldern.</p>
            </span>
            <span className="adm-switch">
              <input id={`verified-${member.userId}`} type="checkbox" name="is_verified" defaultChecked={member.fighter?.isVerified ?? false} />
              <i />
            </span>
          </label>
        </div>
        <div className="adm-field">
          <label htmlFor={`bio-${member.userId}`}>Kurzprofil</label>
          <textarea id={`bio-${member.userId}`} name="public_bio" rows={3} defaultValue={member.fighter?.publicBio ?? ""} />
        </div>
      </details>

      {canManagePermissions ? (
        <details className="adm-member-card__details" open={member.profileType === "staff"}>
          <summary>Mitarbeiterrechte</summary>
          <div className="adm-permission-grid">
            {ADMIN_PERMISSIONS.map((permission) => (
              <label className="adm-checkbox-card" key={permission}>
                <input type="checkbox" name="permissions" value={permission} defaultChecked={member.permissions.includes(permission)} />
                <span>
                  <strong>{permissionLabels[permission]}</strong>
                  <small>{permission}</small>
                </span>
              </label>
            ))}
          </div>
        </details>
      ) : null}

      {state && !state.ok ? (
        <p className="admin-form__message admin-form__message--error" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="adm-member-card__foot">
        <span>{memberTypeLabels[member.profileType]}</span>
        <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
          {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
          Speichern
        </button>
      </div>
    </form>
  );
}

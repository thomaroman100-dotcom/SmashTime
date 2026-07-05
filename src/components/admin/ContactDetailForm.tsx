"use client";

import { useActionState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { ContactRow } from "@/lib/admin/actions/contact";
import { CONTACT_STATUSES } from "@/lib/admin/resource-shared";
import { useAdminUi } from "@/components/admin/ui/AdminUiProvider";

type ContactDetailFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  request: ContactRow;
};

export function ContactDetailForm({ action, request }: ContactDetailFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const ui = useAdminUi();

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.ok) {
      ui.toast("success", "Erfolg", state.message);
    } else {
      ui.toast("error", "Fehler beim Speichern", state.error);
    }
  }, [state, ui]);

  return (
    <form className="adm-panel" action={formAction}>
      <div className="adm-panel__head">
        <div className="adm-panel__head-text">
          <h2>Bearbeitung</h2>
          <p>Status und interne Notizen verwalten.</p>
        </div>
      </div>
      <div className="adm-panel__body">
        <div className="adm-field">
          <label htmlFor="contact-status">Status</label>
          <select id="contact-status" name="status" defaultValue={request.status}>
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "neu" ? "Neu" : status === "gelesen" ? "Gelesen" : "Erledigt"}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor="contact-notes">Interne Notizen</label>
          <textarea
            id="contact-notes"
            name="internal_notes"
            rows={8}
            defaultValue={request.internal_notes ?? ""}
            placeholder="Nur intern sichtbar - z. B. Rückruf vereinbart, Angebot verschickt..."
          />
        </div>
        {state && !state.ok ? (
          <div className="adm-alert adm-alert--error" role="alert">
            <strong>{state.error}</strong>
          </div>
        ) : null}
      </div>
      <div className="adm-panel__footer">
        <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
          {pending ? <Loader2 aria-hidden="true" size={16} className="adm-spin" /> : <Save aria-hidden="true" size={16} />}
          Anfrage speichern
        </button>
      </div>
    </form>
  );
}

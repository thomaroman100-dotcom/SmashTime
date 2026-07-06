"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/admin/action-helpers";
import type { FightRow } from "@/lib/admin/actions/fightcards";
import { EVENT_DISCIPLINES, FIGHT_STATUSES, FIGHT_STATUS_LABELS } from "@/lib/admin/resource-shared";
import { AdminFormMessage, AdminSubmitButton } from "@/components/admin/AdminFormControls";
import { FighterProfilePicker, type FighterProfileOption } from "@/components/admin/FighterProfilePicker";

export type FightFormEventOption = {
  id: number;
  name: string;
};

type FightFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  events: FightFormEventOption[];
  fighterOptions: FighterProfileOption[];
  initial?: FightRow | null;
  defaultEventId?: number;
};

export function FightForm({ action, events, fighterOptions, initial, defaultEventId }: FightFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form className="admin-panel admin-form" action={formAction}>
      <h2>{initial ? "Kampf bearbeiten" : "Kampfdetails"}</h2>
      <label>
        Veranstaltung *
        <select name="event_id" required defaultValue={initial?.event_id ?? defaultEventId ?? ""}>
          <option value="" disabled>
            Veranstaltung wählen
          </option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </label>
      <div className="admin-form__grid">
        <label>
          Reihenfolge
          <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 1} min={0} />
        </label>
        <label>
          Label
          <input name="label" defaultValue={initial?.label ?? ""} placeholder="Hauptkampf / Co-Hauptkampf / Vorkampf" />
        </label>
      </div>
      <div className="admin-form__grid">
        <div>
          <FighterProfilePicker
            name="fighter_a_user_id"
            label="Rote Ecke"
            options={fighterOptions}
            initialUserId={initial?.fighter_a_user_id}
            legacyName={initial?.fighter_a}
            legacyFieldName="fighter_a"
            corner="red"
          />
        </div>
        <div>
          <FighterProfilePicker
            name="fighter_b_user_id"
            label="Blaue Ecke"
            options={fighterOptions}
            initialUserId={initial?.fighter_b_user_id}
            legacyName={initial?.fighter_b}
            legacyFieldName="fighter_b"
            corner="blue"
          />
        </div>
      </div>
      <div className="admin-form__grid">
        <label>
          Gewichtsklasse
          <input name="weight_class" defaultValue={initial?.weight_class ?? ""} placeholder="Wird nachgetragen" />
        </label>
        <label>
          Disziplin
          <select name="discipline" defaultValue={initial?.discipline ?? "K1"}>
            {EVENT_DISCIPLINES.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-form__grid">
        <label>
          Status
          <select name="status" defaultValue={initial?.status ?? "planned"}>
            {FIGHT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {FIGHT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Interne Notiz
          <input name="notes" defaultValue={initial?.notes ?? ""} placeholder="Nur intern sichtbar" />
        </label>
      </div>
      <div className="admin-form__checkrow">
        <label className="admin-checkbox">
          <input name="is_main_event" type="checkbox" defaultChecked={initial?.is_main_event ?? false} /> Main Event
        </label>
        <label className="admin-checkbox">
          <input name="is_visible" type="checkbox" defaultChecked={initial?.is_visible ?? false} /> Sichtbar veröffentlichen
        </label>
      </div>
      <p className="admin-form__hint">
        Paarungen bleiben verborgen, bis sie offiziell bestätigt sind. Keine erfundenen Kämpfer eintragen.
      </p>
      <AdminFormMessage state={state} />
      <AdminSubmitButton>{initial ? "Änderungen speichern" : "Kampf speichern"}</AdminSubmitButton>
    </form>
  );
}

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
  const initialParticipant = (corner: "red" | "blue", slot: number) =>
    initial?.fight_card_participants?.find((participant) => participant.corner === corner && participant.slot === slot);
  const hiddenTeamParticipants = [
    ["participant_red_1", initialParticipant("red", 1)],
    ["participant_red_2", initialParticipant("red", 2)],
    ["participant_blue_1", initialParticipant("blue", 1)],
    ["participant_blue_2", initialParticipant("blue", 2)]
  ] as const;

  return (
    <form className="admin-panel admin-form" action={formAction}>
      <h2>{initial ? "Kampf bearbeiten" : "Kampfdetails"}</h2>
      <input type="hidden" name="matchup_type" value={initial?.matchup_type ?? "single"} />
      {initial?.matchup_type === "team_2v2" ? (
        <>
          <input type="hidden" name="corner_a_label" value={initial.corner_a_label ?? ""} />
          <input type="hidden" name="corner_b_label" value={initial.corner_b_label ?? ""} />
          <input type="hidden" name="corner_a_country_code" value={initial.corner_a_country_code ?? ""} />
          <input type="hidden" name="corner_b_country_code" value={initial.corner_b_country_code ?? ""} />
          {hiddenTeamParticipants.map(([prefix, participant]) => (
            <span hidden key={prefix}>
              <input type="hidden" name={`${prefix}_user_id`} value={participant?.fighter_user_id ?? ""} />
              <input type="hidden" name={prefix} value={participant?.display_name ?? ""} />
              <input type="hidden" name={`${prefix}_image_path`} value={participant?.image_path ?? ""} />
            </span>
          ))}
        </>
      ) : null}
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
          <input type="hidden" name="fighter_a_image_path" value={initial?.fighter_a_image_path ?? ""} />
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
          <input type="hidden" name="fighter_b_image_path" value={initial?.fighter_b_image_path ?? ""} />
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

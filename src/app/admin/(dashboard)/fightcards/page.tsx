import { Plus, Save } from "lucide-react";
import { adminFightcards } from "@/data/admin";
import { upcomingEvent } from "@/data/events";

export const metadata = {
  title: "Fightcard | SmashTime Admin"
};

export default function AdminFightcardsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Fightcard</h1>
          <p>Kämpfe pro Veranstaltung pflegen. Paarungen bleiben verborgen, bis sie offiziell bestätigt sind.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Plus aria-hidden="true" size={18} /> Kampf hinzufügen
        </button>
      </div>

      <section className="admin-split">
        <form className="admin-panel admin-form">
          <h2>Kampfdetails</h2>
          <label>
            Veranstaltung
            <input readOnly value={upcomingEvent.name} />
          </label>
          <div className="admin-form__grid">
            <label>
              Reihenfolge
              <input min="1" type="number" defaultValue="1" />
            </label>
            <label>
              Label
              <input placeholder="Hauptkampf / Vorkampf" />
            </label>
          </div>
          <div className="admin-form__grid">
            <label>
              Rote Ecke
              <input placeholder="Kämpfer wird bekanntgegeben" />
            </label>
            <label>
              Blaue Ecke
              <input placeholder="Kämpfer wird bekanntgegeben" />
            </label>
          </div>
          <div className="admin-form__grid">
            <label>
              Gewichtsklasse
              <input placeholder="Wird nachgetragen" />
            </label>
            <label>
              Disziplin
              <select defaultValue="K1">
                {upcomingEvent.disciplines.map((discipline) => (
                  <option key={discipline}>{discipline}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="admin-checkbox">
            <input type="checkbox" /> Sichtbar veröffentlichen
          </label>
          <button className="admin-red-button" type="button">
            <Save aria-hidden="true" size={18} /> Kampf speichern
          </button>
        </form>

        <article className="admin-panel">
          <h2>Aktuelle Fightcard</h2>
          {adminFightcards.length === 0 ? (
            <p className="admin-empty">Fightcard wird bald veröffentlicht.</p>
          ) : (
            <div className="admin-list">
              {adminFightcards.map((fight) => (
                <div className="admin-list__row" key={fight.id}>
                  <strong>{fight.fighterA} vs. {fight.fighterB}</strong>
                  <span>{fight.weightClass} · {fight.discipline}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

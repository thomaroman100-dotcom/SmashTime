import { Copy, Edit3, Plus, Trash2 } from "lucide-react";
import { adminEvents } from "@/data/admin";

export const metadata = {
  title: "Veranstaltungen | SmashTime Admin"
};

export default function AdminEventsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Veranstaltungen</h1>
          <p>Termine, Orte, Zeiten, Disziplinen und Ticketlinks verwalten.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Plus aria-hidden="true" size={18} /> Veranstaltung hinzufügen
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-table">
          <div className="admin-table__head admin-table__row--events">
            <span>Veranstaltung</span>
            <span>Datum</span>
            <span>Ort</span>
            <span>Status</span>
            <span>Aktionen</span>
          </div>
          {adminEvents.map((event) => (
            <article className="admin-table__row admin-table__row--events" key={event.id}>
              <div>
                <strong>{event.name}</strong>
                <small>{event.disciplines.join(" · ")}</small>
              </div>
              <span>{event.dateLabel}</span>
              <span>{event.location}</span>
              <span className={event.status === "upcoming" ? "admin-status admin-status--green" : "admin-status"}>
                {event.status === "upcoming" ? "Veröffentlicht" : "Platzhalter"}
              </span>
              <div className="admin-row-actions">
                <button type="button" aria-label={`${event.name} bearbeiten`}>
                  <Edit3 aria-hidden="true" size={17} />
                </button>
                <button type="button" aria-label={`${event.name} duplizieren`}>
                  <Copy aria-hidden="true" size={17} />
                </button>
                <button type="button" aria-label={`${event.name} archivieren`}>
                  <Trash2 aria-hidden="true" size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import { CheckCircle2, Inbox } from "lucide-react";
import { adminContactRequests } from "@/data/admin";

export const metadata = {
  title: "Kontaktanfragen | SmashTime Admin"
};

export default function AdminContactPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Kontaktanfragen</h1>
          <p>Anfragen aus Sponsoring, Presse, Kämpfer und Allgemein prüfen und intern markieren.</p>
        </div>
      </div>

      <section className="admin-panel">
        {adminContactRequests.length === 0 ? (
          <div className="admin-empty-state">
            <Inbox aria-hidden="true" size={40} />
            <h2>Noch keine echten Kontaktanfragen</h2>
            <p>Sobald das Formular mit Supabase verbunden ist, erscheinen neue Anfragen hier.</p>
          </div>
        ) : (
          <div className="admin-list">
            {adminContactRequests.map((request) => (
              <article className="admin-list__row admin-list__row--actions" key={request.id}>
                <div>
                  <strong>{request.subject}</strong>
                  <span>{request.category} · {request.sender} · {request.status}</span>
                </div>
                <button className="admin-outline-button" type="button">
                  <CheckCircle2 aria-hidden="true" size={16} /> Erledigt
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

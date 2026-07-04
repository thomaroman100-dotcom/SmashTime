import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { adminContactRequests, adminStats } from "@/data/admin";
import { upcomingEvent } from "@/data/events";

export const metadata = {
  title: "Übersicht | SmashTime Admin"
};

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Übersicht</h1>
          <p>Verwaltung für SmashTime Inhalte, Veranstaltungen und Medien.</p>
        </div>
      </div>

      <section className="admin-stat-grid" aria-label="Admin Kennzahlen">
        {adminStats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.detail}</small>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-event-panel">
          <h2>Nächste Veranstaltung</h2>
          <div className="admin-event-panel__body">
            <div className="admin-event-panel__poster">
              <Image src={upcomingEvent.image} alt="" fill sizes="280px" />
            </div>
            <div>
              <h3>{upcomingEvent.name}</h3>
              <p>
                <CalendarDays aria-hidden="true" size={18} /> {upcomingEvent.dateLabel}
              </p>
              <p>
                <MapPin aria-hidden="true" size={18} /> {upcomingEvent.location}
              </p>
              <p>
                <Clock3 aria-hidden="true" size={18} /> Einlass {upcomingEvent.admission} · Beginn {upcomingEvent.start}
              </p>
              <Link className="admin-outline-button" href="/admin/events">
                Veranstaltung bearbeiten <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel__title-row">
            <h2>Neue Kontaktanfragen</h2>
            <Link href="/admin/contact">Alle anzeigen</Link>
          </div>
          {adminContactRequests.length === 0 ? (
            <p className="admin-empty">Noch keine echten Kontaktanfragen vorhanden.</p>
          ) : (
            <div className="admin-list">
              {adminContactRequests.map((request) => (
                <div className="admin-list__row" key={request.id}>
                  <strong>{request.subject}</strong>
                  <span>{request.category} · {request.sender}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

import { Edit3, Plus, Trash2 } from "lucide-react";
import { newsItems } from "@/data/news";

export const metadata = {
  title: "Neuigkeiten | SmashTime Admin"
};

export default function AdminNewsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Neuigkeiten</h1>
          <p>Beiträge, Teaser, Kategorien, Bilder und Veröffentlichungsstatus verwalten.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Plus aria-hidden="true" size={18} /> Beitrag erstellen
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-table">
          <div className="admin-table__head admin-table__row--news">
            <span>Titel</span>
            <span>Kategorie</span>
            <span>Datum</span>
            <span>Status</span>
            <span>Aktionen</span>
          </div>
          {newsItems.map((item) => (
            <article className="admin-table__row admin-table__row--news" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <small>{item.slug}</small>
              </div>
              <span>{item.category}</span>
              <span>{item.date}</span>
              <span className="admin-status admin-status--green">Veröffentlicht</span>
              <div className="admin-row-actions">
                <button type="button" aria-label={`${item.title} bearbeiten`}>
                  <Edit3 aria-hidden="true" size={17} />
                </button>
                <button type="button" aria-label={`${item.title} deaktivieren`}>
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

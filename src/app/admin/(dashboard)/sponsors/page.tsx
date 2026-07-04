import { Edit3, Plus, Trash2 } from "lucide-react";
import { adminSponsorRows } from "@/data/admin";
import { sponsorPackages } from "@/data/sponsors";

export const metadata = {
  title: "Sponsoren | SmashTime Admin"
};

export default function AdminSponsorsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Sponsoren</h1>
          <p>Logo-Plätze, Pakete, Sichtbarkeit und Sponsorstatus verwalten.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Plus aria-hidden="true" size={18} /> Sponsor hinzufügen
        </button>
      </div>

      <section className="admin-split">
        <article className="admin-panel">
          <h2>Sponsorplätze</h2>
          <div className="admin-list">
            {adminSponsorRows.map((sponsor) => (
              <div className="admin-list__row admin-list__row--actions" key={sponsor.id}>
                <div>
                  <strong>{sponsor.name}</strong>
                  <span>{sponsor.label} · {sponsor.packageName}</span>
                </div>
                <div className="admin-row-actions">
                  <button type="button" aria-label={`${sponsor.name} bearbeiten`}>
                    <Edit3 aria-hidden="true" size={17} />
                  </button>
                  <button type="button" aria-label={`${sponsor.name} deaktivieren`}>
                    <Trash2 aria-hidden="true" size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <h2>Sponsorenpakete</h2>
          <div className="admin-list">
            {sponsorPackages.map((item) => (
              <div className="admin-list__row" key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.price} · {item.benefits.length} Leistungen</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

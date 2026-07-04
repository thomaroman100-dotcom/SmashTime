import Image from "next/image";
import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { champions } from "@/data/champions";

export const metadata = {
  title: "Champions | SmashTime Admin"
};

export default function AdminChampionsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Champions</h1>
          <p>Bestätigte Titelträger verwalten. Keine Fake-Fighter, keine unsicheren Bildzuordnungen.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Plus aria-hidden="true" size={18} /> Champion hinzufügen
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-table">
          <div className="admin-table__head admin-table__row--champions">
            <span>Champion</span>
            <span>Klasse</span>
            <span>Bilanz</span>
            <span>Status</span>
            <span>Aktionen</span>
          </div>
          {champions.map((champion) => (
            <article className="admin-table__row admin-table__row--champions" key={champion.slug}>
              <div className="admin-person-cell">
                <Image src={champion.image} alt="" width={54} height={54} />
                <div>
                  <strong>{champion.name}</strong>
                  <small>{champion.age} · {champion.weight}</small>
                </div>
              </div>
              <span>{champion.weightClass}</span>
              <span>{champion.record}</span>
              <span className="admin-status admin-status--green">Aktiv</span>
              <div className="admin-row-actions">
                <a href={`/champions/${champion.slug}`} aria-label={`${champion.name} ansehen`}>
                  <Eye aria-hidden="true" size={17} />
                </a>
                <button type="button" aria-label={`${champion.name} bearbeiten`}>
                  <Edit3 aria-hidden="true" size={17} />
                </button>
                <button type="button" aria-label={`${champion.name} deaktivieren`}>
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

import Image from "next/image";
import { Upload } from "lucide-react";
import { adminMediaAssets } from "@/data/admin";

export const metadata = {
  title: "Medien | SmashTime Admin"
};

export default function AdminMediaPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Medien</h1>
          <p>Bildmaterial prüfen, Alt-Texte pflegen und spätere Uploads verwalten.</p>
        </div>
        <button className="admin-red-button" type="button">
          <Upload aria-hidden="true" size={18} /> Datei hochladen
        </button>
      </div>

      <section className="admin-media-grid">
        {adminMediaAssets.map((asset) => (
          <article className="admin-media-card" key={asset.path}>
            <div className="admin-media-card__image">
              <Image src={asset.path} alt="" fill sizes="(max-width: 720px) 100vw, 260px" />
            </div>
            <div>
              <strong>{asset.name}</strong>
              <span>{asset.type}</span>
              <small>{asset.usage}</small>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | SmashTime",
  description: "Impressum und Anbieterkennzeichnung der SmashTime-Website."
};

export default function ImpressumPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <h1>Impressum</h1>
        <p className="legal-page__lead">
          Angaben gemäß Offenlegungs- und Informationspflicht. Fehlende Daten werden nachgetragen,
          sobald sie offiziell bestätigt sind.
        </p>

        <section>
          <h2>Medieninhaber</h2>
          <p>SmashTime – Kampfsport- und Eventveranstalter aus St. Pölten, Österreich.</p>
          <p>
            Vollständiger Firmenwortlaut, Rechtsform und Firmensitz: werden nachgetragen.
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>E-Mail: wird nachgetragen</p>
          <p>Anschrift: wird nachgetragen</p>
        </section>

        <section>
          <h2>Haftungshinweis</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
            externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber
            verantwortlich.
          </p>
        </section>

        <section>
          <h2>Urheberrecht</h2>
          <p>
            Alle Inhalte dieser Website (Texte, Bilder, Grafiken, Logos) sind urheberrechtlich
            geschützt. Jede Verwendung außerhalb dieser Website bedarf der vorherigen Zustimmung.
          </p>
        </section>
      </div>
    </div>
  );
}

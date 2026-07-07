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
          Angaben gemäß den österreichischen Offenlegungs- und Informationspflichten.
        </p>

        <section>
          <h2>Medieninhaber und Diensteanbieter</h2>
          <p>Michele Ott e.U.</p>
          <p>Willi Gruber Straße 19</p>
          <p>3100 St. Pölten</p>
          <p>Österreich</p>
        </section>

        <section>
          <h2>Unternehmensangaben</h2>
          <p>Firmenbuchgericht: Magistrat der Stadt St. Pölten</p>
          <p>Firmensitz: 3100 St. Pölten</p>
          <p>Unternehmensgegenstand: Werbeagentur</p>
          <p>GISA (Gewerbeinformationssystem Austria): 37416874</p>
          <p>Berufsbezeichnung: Werbeagentur</p>
          <p>Verleihungsstaat: Österreich</p>
        </section>

        <section>
          <h2>Aufsichtsbehörde und Gewerbebehörde</h2>
          <p>Bezirkshauptmannschaft St. Pölten</p>
          <p>Magistrat St. Pölten</p>
          <p>Rathausplatz 1, 3100 St. Pölten</p>
          <p>Österreich</p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            Kontaktaufnahme über das{" "}
            <a href="/kontakt">Kontaktformular</a>
          </p>
          <p>
            Instagram:{" "}
            <a href="https://www.instagram.com/smash_time_st/" target="_blank" rel="noreferrer">
              @smash_time_st
            </a>
          </p>
          <p>
            YouTube:{" "}
            <a href="https://www.youtube.com/@Smashtimestp" target="_blank" rel="noreferrer">
              @Smashtimestp
            </a>
          </p>
        </section>

        <section>
          <h2>Unternehmensgegenstand und Blattlinie</h2>
          <p>
            SmashTime informiert über Kampfsportveranstaltungen, Athleten, Tickets,
            Sponsoring, Neuigkeiten und Kontaktmöglichkeiten rund um die Marke SmashTime.
            Unternehmensgegenstand des Medieninhabers ist Werbeagentur.
          </p>
          <p>
            Die grundlegende Richtung dieser Website ist die Darstellung und Bewerbung von
            SmashTime-Veranstaltungen sowie die Information von Fans, Athleten, Partnern und
            Medien.
          </p>
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

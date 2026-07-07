import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz | SmashTime",
  description: "Datenschutzerklärung der SmashTime-Website."
};

export default function DatenschutzPage() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <h1>Datenschutz</h1>
        <p className="legal-page__lead">
          Diese Datenschutzerklärung informiert darüber, wie personenbezogene Daten auf dieser
          Website verarbeitet werden.
        </p>

        <section>
          <h2>Verantwortlicher</h2>
          <p>Michele Ott e.U.</p>
          <p>Willi Gruber Straße 19</p>
          <p>3100 St. Pölten</p>
          <p>Österreich</p>
          <p>Vertretungsberechtigter für Datenschutzanliegen: Willi Ott</p>
          <p>
            Kontaktaufnahme ist über das <a href="/kontakt">Kontaktformular</a> möglich.
          </p>
        </section>

        <section>
          <h2>Allgemeines</h2>
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb der Website,
            die Bearbeitung von Anfragen, die Verwaltung von Nutzerkonten oder die Kommunikation
            rund um SmashTime erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1
            lit. b DSGVO (Vertrag oder vorvertragliche Maßnahmen), Art. 6 Abs. 1 lit. c DSGVO
            (rechtliche Verpflichtungen), Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            einem sicheren und funktionierenden Webangebot) sowie, falls erforderlich, Art. 6 Abs.
            1 lit. a DSGVO (Einwilligung).
          </p>
        </section>

        <section>
          <h2>Kontaktformular</h2>
          <p>
            Wenn du uns über das Kontaktformular eine Anfrage sendest, werden die angegebenen Daten
            wie Name, E-Mail-Adresse, Betreff, Anfrageart und Nachricht zur Bearbeitung deiner
            Anfrage verarbeitet. Die Verarbeitung erfolgt zur Beantwortung deiner Anfrage und zur
            Durchführung vorvertraglicher Maßnahmen. Die Daten werden nicht für Werbung an Dritte
            verkauft.
          </p>
        </section>

        <section>
          <h2>Login, Registrierung und Admin-Bereich</h2>
          <p>
            Für Login, Registrierung, Profilverwaltung und den Admin-Bereich können E-Mail-Adresse,
            technische Sitzungsdaten, Rollen, Berechtigungen und Profildaten verarbeitet werden.
            Diese Daten werden benötigt, um Nutzerkonten bereitzustellen, Zugriffe zu schützen und
            administrative Funktionen sicher zu betreiben.
          </p>
        </section>

        <section>
          <h2>Newsletter</h2>
          <p>
            Das Newsletter-Formular prüft aktuell nur die eingegebene E-Mail-Adresse im Browser und
            zeigt eine Rückmeldung an. Ein Versand oder eine dauerhafte Speicherung für einen
            Newsletter findet erst statt, wenn ein entsprechender Versanddienst und ein
            Einwilligungsprozess angebunden werden. Vor einer aktiven Newsletter-Nutzung wird diese
            Datenschutzerklärung entsprechend ergänzt.
          </p>
        </section>

        <section>
          <h2>Hosting und Server-Logs</h2>
          <p>
            Beim Aufruf der Website werden technisch notwendige Zugriffsdaten verarbeitet, zum
            Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite,
            Browserinformationen und technische Statuscodes. Diese Daten dienen der Auslieferung,
            Sicherheit, Fehleranalyse und Stabilität der Website.
          </p>
        </section>

        <section>
          <h2>Supabase</h2>
          <p>
            Für Datenbank-, Authentifizierungs- und Speicherfunktionen kann Supabase eingesetzt
            werden. Dabei können insbesondere Kontaktanfragen, Nutzer- und Sitzungsdaten,
            Admin-Daten, Mediendateien und technische Protokolldaten verarbeitet werden. Die
            Verarbeitung erfolgt, um die Website, geschützte Bereiche und Verwaltungsfunktionen
            bereitzustellen.
          </p>
        </section>

        <section>
          <h2>Cookies und lokale Speicherung</h2>
          <p>
            Die Website verwendet derzeit keine identifizierten Marketing- oder Analyse-Cookies.
            Für Login- und Sitzungsfunktionen können technisch notwendige Cookies oder vergleichbare
            Speichermechanismen gesetzt werden. Diese sind erforderlich, um angemeldete Bereiche
            sicher bereitzustellen.
          </p>
        </section>

        <section>
          <h2>Social-Media-Links</h2>
          <p>
            Auf dieser Website befinden sich Links zu Instagram und YouTube. Wenn du diese Links
            anklickst, verlässt du unsere Website. Für die Datenverarbeitung auf den jeweiligen
            Plattformen sind die Betreiber der externen Dienste verantwortlich.
          </p>
        </section>

        <section>
          <h2>Speicherdauer</h2>
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck
            erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Kontaktanfragen
            werden gelöscht oder anonymisiert, sobald sie nicht mehr benötigt werden und keine
            rechtlichen Gründe für eine weitere Speicherung bestehen.
          </p>
        </section>

        <section>
          <h2>Deine Rechte</h2>
          <p>
            Dir stehen nach der DSGVO insbesondere die Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch zu. Wenn eine
            Verarbeitung auf Einwilligung beruht, kannst du diese Einwilligung jederzeit mit Wirkung
            für die Zukunft widerrufen. Du kannst dich außerdem bei der österreichischen
            Datenschutzbehörde beschweren:{" "}
            <a href="https://www.dsb.gv.at/" target="_blank" rel="noreferrer">
              www.dsb.gv.at
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

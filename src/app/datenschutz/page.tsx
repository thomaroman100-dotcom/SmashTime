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
          Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten auf
          dieser Website. Verantwortlichen-Angaben werden ergänzt, sobald sie offiziell bestätigt sind.
        </p>

        <section>
          <h2>Verantwortlicher</h2>
          <p>SmashTime, St. Pölten, Österreich. Vollständige Angaben: werden nachgetragen.</p>
        </section>

        <section>
          <h2>Kontaktformular</h2>
          <p>
            Wenn du uns über das Kontaktformular eine Anfrage sendest, werden die angegebenen Daten
            (Name, E-Mail-Adresse, Nachricht, Kategorie) zur Bearbeitung der Anfrage gespeichert.
            Die Daten werden nicht ohne deine Einwilligung weitergegeben.
          </p>
        </section>

        <section>
          <h2>Newsletter</h2>
          <p>
            Bei der Anmeldung zum Newsletter wird deine E-Mail-Adresse ausschließlich für den Versand
            von SmashTime-Informationen verwendet. Eine Abmeldung ist jederzeit möglich.
          </p>
        </section>

        <section>
          <h2>Hosting und Server-Logs</h2>
          <p>
            Beim Aufruf der Website werden durch den Hosting-Anbieter technisch notwendige Daten
            (z. B. IP-Adresse, Zeitpunkt des Zugriffs) in Server-Logs verarbeitet. Diese Daten dienen
            der Sicherheit und Stabilität des Betriebs.
          </p>
        </section>

        <section>
          <h2>Deine Rechte</h2>
          <p>
            Dir stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung,
            Datenübertragbarkeit und Widerspruch zu. Wende dich dazu an die oben genannte
            Kontaktadresse. Außerdem besteht ein Beschwerderecht bei der österreichischen
            Datenschutzbehörde.
          </p>
        </section>
      </div>
    </div>
  );
}

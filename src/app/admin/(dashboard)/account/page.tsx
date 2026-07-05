export const metadata = {
  title: "Konto | SmashTime Admin"
};

export default function AdminAccountPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Konto</h1>
          <p>Profil, Rolle und Sitzungseinstellungen deines Admin-Zugangs.</p>
        </div>
      </div>

      <section className="admin-panel">
        <h2>Konto-Einstellungen</h2>
        <p className="admin-empty-state__text">
          Die Konto-Verwaltung ist vorbereitet. Rollen und Sicherheitsdaten werden serverseitig über Supabase Auth geführt.
        </p>
      </section>
    </div>
  );
}

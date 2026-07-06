import { redirect } from "next/navigation";
import { permissionLabels, getAdminSession } from "@/lib/admin/auth";

export const metadata = {
  title: "Konto | SmashTime Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

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
        <div className="admin-account-grid">
          <div>
            <span className="adm-cell-sub">Name</span>
            <strong>{session.user.displayName}</strong>
          </div>
          <div>
            <span className="adm-cell-sub">E-Mail</span>
            <strong>{session.user.email}</strong>
          </div>
          <div>
            <span className="adm-cell-sub">Rolle</span>
            <strong>{session.user.role === "admin" ? "Administrator" : "Mitarbeiter"}</strong>
          </div>
        </div>
        <h3>Aktive Rechte</h3>
        <div className="adm-permission-grid">
          {session.user.permissions.map((permission) => (
            <span className="adm-checkbox-card" key={permission}>
              <span>
                <strong>{permissionLabels[permission]}</strong>
                <small>{permission}</small>
              </span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

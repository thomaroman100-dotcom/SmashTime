import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, UserCircle } from "lucide-react";
import { getSessionProfile } from "@/lib/admin/auth";

export const metadata = {
  title: "Mein Profil | SmashTime"
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect("/login");
  }

  return (
    <section className="account-page">
      <div className="account-page__panel">
        <span className="account-page__icon">
          <UserCircle aria-hidden="true" size={34} />
        </span>
        <div>
          <span className="account-page__kicker">SmashTime Profil</span>
          <h1>{profile.displayName}</h1>
          <p>{profile.email}</p>
        </div>
        <dl className="account-page__facts">
          <div>
            <dt>Rolle</dt>
            <dd>{profile.roleLabel}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{profile.status === "active" ? "Aktiv" : profile.status === "pending" ? "Wartet auf Freigabe" : "Gesperrt"}</dd>
          </div>
        </dl>
        {profile.canAccessAdmin ? (
          <Link className="account-page__admin" href="/admin">
            <Shield aria-hidden="true" size={17} /> Adminbereich öffnen
          </Link>
        ) : (
          <p className="account-page__note">
            Dein Profil ist angelegt. Admin-Funktionen werden erst nach Freigabe und Rechtevergabe sichtbar.
          </p>
        )}
      </div>
    </section>
  );
}

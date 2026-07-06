import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
  KeyRound,
  Shield,
  ShieldCheck,
  UserCircle,
  UserCog
} from "lucide-react";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { getSessionProfile } from "@/lib/admin/auth";
import { updateMyProfileSettingsAction } from "@/lib/profile/actions";

export const metadata = {
  title: "Profil bearbeiten | SmashTime"
};

export const dynamic = "force-dynamic";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ST"
  );
}

function safeAvatarStyle(avatarUrl: string | null) {
  if (!avatarUrl) {
    return undefined;
  }

  try {
    const url = new URL(avatarUrl);
    if (url.protocol !== "https:") {
      return undefined;
    }

    return { backgroundImage: `url("${url.href.replace(/"/g, "%22")}")` };
  } catch {
    return undefined;
  }
}

export default async function EditProfilePage() {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect("/login");
  }

  const isFighter = profile.profileType === "fighter";
  const publicRole = isFighter ? "Kämpfer" : "Mitglied";
  const avatarStyle = safeAvatarStyle(profile.avatarUrl);

  return (
    <section className="account-page account-page--dashboard profile-edit-page">
      <div className="account-shell account-shell--wide">
        <section className="account-edit-hero">
          <div>
            <Link className="account-back-link" href="/account">
              <ArrowLeft aria-hidden="true" size={18} /> Zurück zur Profilübersicht
            </Link>
            <h1>Profil bearbeiten</h1>
            <p>Aktualisiere deine öffentlichen Basisdaten und Kämpferinformationen.</p>
          </div>
          <Link className="account-page__link-button" href="/account">
            Übersicht öffnen
          </Link>
        </section>

        <div className="account-edit-layout">
          <main className="account-card account-card--form">
            <div className="account-card__head">
              <UserCog aria-hidden="true" size={20} />
              <div>
                <h2>Persönliche Profildaten</h2>
                <p>Diese Angaben steuern, wie dein Profil im öffentlichen SmashTime-Bereich erscheint.</p>
              </div>
            </div>
            <ProfileSettingsForm profile={profile} action={updateMyProfileSettingsAction} />
          </main>

          <aside className="account-edit-rail">
            <section className="account-card account-profile-preview">
              <div className="account-card__head">
                <UserCircle aria-hidden="true" size={20} />
                <div>
                  <h2>Profilvorschau</h2>
                  <p>So wirkt dein Profil in Kurzansichten.</p>
                </div>
              </div>
              <div className="account-profile-preview__body">
                <span
                  className={
                    avatarStyle
                      ? "account-avatar account-avatar--preview account-avatar--image"
                      : "account-avatar account-avatar--preview"
                  }
                  style={avatarStyle}
                  aria-hidden="true"
                >
                  {avatarStyle ? null : initials(profile.displayName)}
                </span>
                <div>
                  <strong>{profile.displayName}</strong>
                  <small>{publicRole}</small>
                </div>
              </div>
              <div className="account-profile-preview__status">
                <span>
                  <BadgeCheck aria-hidden="true" size={16} />
                  {profile.emailVerified ? "E-Mail verifiziert" : "E-Mail offen"}
                </span>
                <span>
                  <ShieldCheck aria-hidden="true" size={16} />
                  {profile.status === "active" ? "Profil aktiv" : "Freigabe offen"}
                </span>
              </div>
            </section>

            <section className="account-card">
              <div className="account-card__head">
                <KeyRound aria-hidden="true" size={20} />
                <div>
                  <h2>Sicherheit</h2>
                  <p>Passwort, E-Mail und Sitzungen bleiben geschützt.</p>
                </div>
              </div>
              <div className="account-security-list">
                <span>
                  <strong>E-Mail</strong>
                  <small>{profile.email}</small>
                </span>
                <span>
                  <strong>Kontostatus</strong>
                  <small>{profile.status === "active" ? "Aktiv" : "Wartet auf Freigabe"}</small>
                </span>
                <span>
                  <strong>Passwort</strong>
                  <small>Über Auth-Anmeldung verwaltet</small>
                </span>
              </div>
            </section>

            {profile.canAccessAdmin ? (
              <section className="account-card account-admin-mini">
                <div className="account-card__head">
                  <Shield aria-hidden="true" size={20} />
                  <div>
                    <h2>Adminfunktionen</h2>
                    <p>Dein öffentlicher Account bleibt getrennt vom Adminbereich.</p>
                  </div>
                </div>
                <div className="account-card__action-list">
                  <Link href="/admin">
                    Adminbereich öffnen <ExternalLink aria-hidden="true" size={15} />
                  </Link>
                  <Link href="/admin/account">
                    Adminprofil öffnen <ExternalLink aria-hidden="true" size={15} />
                  </Link>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

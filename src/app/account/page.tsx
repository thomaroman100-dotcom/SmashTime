import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  ExternalLink,
  Heart,
  KeyRound,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Star,
  Ticket,
  Trophy,
  UserCircle,
  UserCog,
  Video,
  Swords
} from "lucide-react";
import { getSessionProfile } from "@/lib/admin/auth";

export const metadata = {
  title: "Mein Profil | SmashTime"
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

function formatDate(value: string | null) {
  if (!value) {
    return "Noch offen";
  }

  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function statusLabel(status: string) {
  if (status === "active") return "Aktiv";
  if (status === "suspended") return "Gesperrt";
  return "Wartet auf Freigabe";
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

export default async function AccountPage() {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect("/login");
  }

  const isFighter = profile.profileType === "fighter";
  const isActive = profile.status === "active";
  const isSuspended = profile.status === "suspended";
  const isVerifiedFighter = Boolean(profile.fighter?.isVerified);
  const avatarStyle = safeAvatarStyle(profile.avatarUrl);
  const publicRole = isFighter ? "Kämpfer" : "Mitglied";
  const location = profile.fighter?.origin || "Standort noch offen";
  const description =
    profile.fighter?.publicBio ||
    "Dein SmashTime Account bündelt Profil, Events, Tickets und Sicherheitseinstellungen an einem Ort.";
  const memberSince = formatDate(profile.createdAt);

  return (
    <section className="account-page account-page--dashboard account-page--public-profile">
      <div className="account-shell account-shell--wide">
        <section className="account-hero account-hero--profile">
          <div className="account-hero__identity account-hero__identity--profile">
            <span
              className={avatarStyle ? "account-avatar account-avatar--profile account-avatar--image" : "account-avatar account-avatar--profile"}
              style={avatarStyle}
              aria-hidden="true"
            >
              {avatarStyle ? null : initials(profile.displayName)}
            </span>
            <div className="account-hero__copy">
              <div className="account-hero__title-row">
                <h1>{profile.displayName}</h1>
                {profile.emailVerified ? <BadgeCheck aria-hidden="true" size={24} /> : null}
              </div>
              <div className="account-hero__badges account-hero__badges--inline">
                <span className="account-badge account-badge--red">{publicRole}</span>
                <span className="account-hero__country">
                  <MapPin aria-hidden="true" size={15} />
                  {location}
                </span>
              </div>
              <p className="account-hero__description">{description}</p>
              <div className="account-hero__meta" aria-label="Profilmetadaten">
                <span>
                  <CalendarDays aria-hidden="true" size={18} />
                  <small>Mitglied seit</small>
                  <strong>{memberSince}</strong>
                </span>
                <span>
                  <Star aria-hidden="true" size={18} />
                  <small>Lieblingssport</small>
                  <strong>MMA</strong>
                </span>
                <span>
                  <ShieldCheck aria-hidden="true" size={18} />
                  <small>Verifizierung</small>
                  <strong>{profile.emailVerified ? "E-Mail verifiziert" : "E-Mail offen"}</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="account-hero__actions account-hero__actions--profile">
            <Link className="account-page__admin" href="/profil/bearbeiten">
              <UserCog aria-hidden="true" size={18} /> Profil bearbeiten
            </Link>
          </div>
        </section>

        <nav className="account-tabs account-tabs--profile" aria-label="Profilbereiche">
          <a href="#uebersicht" aria-current="page">
            <UserCircle aria-hidden="true" size={18} /> Übersicht
          </a>
          <a href="#persoenliche-daten">
            <UserCog aria-hidden="true" size={18} /> Persönliche Daten
          </a>
          <a href="#meine-events">
            <Ticket aria-hidden="true" size={18} /> Meine Events
          </a>
          <a href="#benachrichtigungen">
            <Bell aria-hidden="true" size={18} /> Benachrichtigungen
          </a>
          <a href="#sicherheit">
            <ShieldCheck aria-hidden="true" size={18} /> Sicherheit
          </a>
        </nav>

        <div className="account-content-grid" id="uebersicht">
          <section className="account-card">
            <div className="account-card__head">
              <UserCircle aria-hidden="true" size={20} />
              <div>
                <h2>Kontoübersicht</h2>
                <p>Deine wichtigsten Accountdaten auf einen Blick.</p>
              </div>
            </div>
            <dl className="account-info-list" id="persoenliche-daten">
              <div>
                <dt>Anzeigename</dt>
                <dd>{profile.displayName}</dd>
              </div>
              <div>
                <dt>Profiltyp</dt>
                <dd>{publicRole}</dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{statusLabel(profile.status)}</dd>
              </div>
              <div>
                <dt>Sprache</dt>
                <dd>Deutsch</dd>
              </div>
              <div>
                <dt>Zeitzone</dt>
                <dd>Europe/Vienna</dd>
              </div>
            </dl>
            <Link className="account-section-link" href="/profil/bearbeiten">
              Alle persönlichen Daten anzeigen <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </section>

          <section className="account-card" id="meine-events">
            <div className="account-card__head account-card__head--action">
              <Ticket aria-hidden="true" size={20} />
              <div>
                <h2>Meine Events / Tickets</h2>
                <p>Verknüpfte Tickets und bevorstehende SmashTime-Events.</p>
              </div>
              <Link href="/veranstaltungen">Alle ansehen</Link>
            </div>
            <div className="account-empty-state">
              <Ticket aria-hidden="true" size={26} />
              <strong>Noch keine Tickets verknüpft</strong>
              <span>Sobald Tickets deinem Konto zugeordnet sind, erscheinen sie hier.</span>
              <Link href="/tickets">Tickets sichern</Link>
            </div>
          </section>

          <section className="account-card">
            <div className="account-card__head">
              <Mail aria-hidden="true" size={20} />
              <div>
                <h2>Kontaktinformationen</h2>
                <p>So erreicht dich SmashTime zu Konto, Tickets und Profil.</p>
              </div>
            </div>
            <div className="account-contact-list">
              <span>
                <Mail aria-hidden="true" size={18} />
                <strong>{profile.email}</strong>
                <small>{profile.emailVerified ? "Verifiziert" : "Bestätigung offen"}</small>
              </span>
              <span>
                <MapPin aria-hidden="true" size={18} />
                <strong>{location}</strong>
                <small>{profile.fighter?.origin ? "Hinterlegt" : "Noch nicht hinterlegt"}</small>
              </span>
              <span>
                <UserCircle aria-hidden="true" size={18} />
                <strong>{publicRole}</strong>
                <small>Profiltyp</small>
              </span>
            </div>
          </section>

          <section className="account-card" id="benachrichtigungen">
            <div className="account-card__head">
              <Activity aria-hidden="true" size={20} />
              <div>
                <h2>Aktivitätsübersicht</h2>
                <p>Deine aktuellen Plattformaktivitäten.</p>
              </div>
            </div>
            <div className="account-mini-stat-grid">
              <span>
                <Ticket aria-hidden="true" size={19} />
                <strong>0</strong>
                <small>Events besucht</small>
              </span>
              <span>
                <Star aria-hidden="true" size={19} />
                <strong>0</strong>
                <small>Favoriten</small>
              </span>
              <span>
                <Bell aria-hidden="true" size={19} />
                <strong>{profile.status === "active" ? 0 : 1}</strong>
                <small>Hinweise</small>
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" size={19} />
                <strong>{isActive ? "Aktiv" : "Offen"}</strong>
                <small>Konto</small>
              </span>
            </div>
            <Link className="account-section-link" href="/profil/bearbeiten">
              Benachrichtigungseinstellungen ändern <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </section>

          <section className="account-card">
            <div className="account-card__head">
              <Heart aria-hidden="true" size={20} />
              <div>
                <h2>Lieblingskategorien</h2>
                <p>Diese Themen sollen deinen SmashTime-Feed prägen.</p>
              </div>
            </div>
            <div className="account-chip-list">
              <span className="account-chip account-chip--active">MMA</span>
              <span className="account-chip">Kickboxen</span>
              <span className="account-chip">Boxen</span>
              <span className="account-chip">Grappling</span>
            </div>
            <Link className="account-section-link" href="/profil/bearbeiten">
              Einstellungen ändern <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </section>

          <section className="account-card" id="sicherheit">
            <div className="account-card__head">
              <KeyRound aria-hidden="true" size={20} />
              <div>
                <h2>Sicherheit & Status</h2>
                <p>Anmeldung, Verifizierung und Kontostatus.</p>
              </div>
            </div>
            <div className="account-security-list">
              <span>
                <strong>Passwort</strong>
                <small>••••••••••</small>
                <Link href="/profil/bearbeiten">Ändern</Link>
              </span>
              <span>
                <strong>E-Mail-Verifizierung</strong>
                <small>{profile.emailVerified ? "Aktiv" : "Offen"}</small>
              </span>
              <span>
                <strong>Kontostatus</strong>
                <small>{statusLabel(profile.status)}</small>
              </span>
              <span>
                <strong>Aktive Sitzung</strong>
                <small>Dieses Gerät</small>
              </span>
            </div>
          </section>

          {isFighter ? (
            <>
              <section className="account-card">
                <div className="account-card__head">
                  <Swords aria-hidden="true" size={20} />
                  <div>
                    <h2>Kampfstatistik</h2>
                    <p>Offizielle Fight-Daten aus dem SmashTime-System.</p>
                  </div>
                </div>
                <div className="account-empty-state account-empty-state--compact">
                  <strong>Noch keine offiziellen Kämpfe hinterlegt</strong>
                  <span>Nach bestätigten Fightcards werden Statistiken hier angezeigt.</span>
                </div>
              </section>

              <section className="account-card">
                <div className="account-card__head">
                  <Trophy aria-hidden="true" size={20} />
                  <div>
                    <h2>Gewichtsklasse</h2>
                    <p>Division und Verifizierungsstatus.</p>
                  </div>
                </div>
                <dl className="account-info-list">
                  <div>
                    <dt>Division</dt>
                    <dd>Wird bekanntgegeben</dd>
                  </div>
                  <div>
                    <dt>Verifizierung</dt>
                    <dd>{isVerifiedFighter ? "Verifiziert" : "In Prüfung"}</dd>
                  </div>
                </dl>
              </section>

              <section className="account-card">
                <div className="account-card__head">
                  <Dumbbell aria-hidden="true" size={20} />
                  <div>
                    <h2>Team / Gym</h2>
                    <p>Öffentliche Kämpferzuordnung.</p>
                  </div>
                </div>
                <dl className="account-info-list">
                  <div>
                    <dt>Herkunft / Gym</dt>
                    <dd>{profile.fighter?.origin || "Noch nicht hinterlegt"}</dd>
                  </div>
                  <div>
                    <dt>Kampfname</dt>
                    <dd>{profile.fighter?.nickname || "Noch nicht hinterlegt"}</dd>
                  </div>
                </dl>
              </section>

              <section className="account-card account-card--span-2">
                <div className="account-card__head account-card__head--action">
                  <CalendarDays aria-hidden="true" size={20} />
                  <div>
                    <h2>Nächster Kampf</h2>
                    <p>Der nächste bestätigte Auftritt deines Profils.</p>
                  </div>
                  <Link href="/veranstaltungen">Events</Link>
                </div>
                <div className="account-empty-state account-empty-state--horizontal">
                  <strong>Wird bekanntgegeben</strong>
                  <span>Sobald du auf einer veröffentlichten Fightcard stehst, erscheint der Kampf hier.</span>
                </div>
              </section>

              <section className="account-card">
                <div className="account-card__head">
                  <Video aria-hidden="true" size={20} />
                  <div>
                    <h2>Medien / Highlights</h2>
                    <p>Fotos, Videos und Pressebezug.</p>
                  </div>
                </div>
                <Link className="account-section-link" href="/media">
                  Medienbereich öffnen <ChevronRight aria-hidden="true" size={16} />
                </Link>
              </section>
            </>
          ) : null}

          {profile.canAccessAdmin ? (
            <section className="account-card account-admin-mini">
              <div className="account-card__head">
                <Shield aria-hidden="true" size={20} />
                <div>
                  <h2>Adminzugriff</h2>
                  <p>Zusatzfunktionen für deinen geschützten Arbeitsbereich.</p>
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

          {isSuspended ? (
            <section className="account-card account-card--accent">
              <h2>Konto eingeschränkt</h2>
              <p>Dein Profil ist aktuell gesperrt. Kläre den Status direkt mit dem SmashTime-Team.</p>
              <Link href="/kontakt">Kontakt aufnehmen</Link>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

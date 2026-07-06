# ROADMAP.md - SmashTime Ist-Stand und Backlog

Diese Datei verfolgt den Stand nach dem finalen Designbrief `smashtime_claude_design_brief_final.md`. Der Brief ist fuer das oeffentliche Frontend die oberste Designquelle; `AGENTS.md` ist die verbindliche Arbeits- und Sicherheitsregel.

Status: erledigt / teilweise / offen

---

## 0. Sicherheit, Git, Setup

- erledigt: Next.js App Router, TypeScript, Tailwind, Supabase-Grundstruktur vorhanden.
- erledigt: `.gitignore` schliesst `.env*` grundsaetzlich aus.
- teilweise: Supabase Auth/RLS/Migrationen sind vorhanden; Admin-CRUD ist noch nicht voll angebunden.
- offen: Repository-Sichtbarkeit pruefen/auf privat stellen.
- offen: Paketmanager klaeren (`npm` aktuell verbindlich, `pnpm-lock.yaml` liegt ebenfalls vor).
- offen: Dependency-Versionen vor Launch pinnen.
- teilweise: lose Root-Risiken bereinigt; alte Phase-/Codex-Archivdateien und `supabase-temp.js` entfernt, `env supabase.txt` bleibt als lokales Credential-Risiko offen.
- offen: Logo-Asset konsolidieren; kanonischer Pfad ist `public/images/logo/smashtime-logo.png`.

## 1. Finales Public Frontend

Ziel: komplette Website im Stil des finalen Fight-Poster-Designs.

- offen: Header auf neue Struktur bringen: `Startseite`, `Champions`, `Neuigkeiten`, `Über uns`, `Mehr`, rechts `Login`, `Tickets`.
- offen: `Mehr`-Dropdown und Mobile-Accordion umsetzen: Ranglisten, Events, Kämpfer, Partner, Merch, Karriere, FAQ, Kontakt.
- offen: Startseite nach Pflichtfolge umbauen: Hero, Countdown, Main-Fight, Champions, Über SmashTime, Events, Ranking, News, Ticket-CTA, Footer.
- offen: alte Seiten/Komponenten, die noch wie die vorige Referenzgeneration wirken, an den finalen Poster-Look anpassen.
- offen: Footer auf neuen Look mit Newsletter, Socials, Service/Rechtliches bringen.

## 2. Routing-Migration

Finale Zielstruktur:

```text
/
/events
/events/[slug]
/fighters
/fighters/[slug]
/champions
/rankings
/news
/news/[slug]
/about
/contact
/tickets
/login
/register
/media
/shop
/partners
/career
/faq
/legal/impressum
/legal/datenschutz
/legal/agb
```

- offen: neue englische Zielrouten anlegen oder sauber auf vorhandene Inhalte mappen.
- offen: deutsche Alt-Routen als Redirects/Aliases erhalten, solange sie gebraucht werden: `/neuigkeiten`, `/veranstaltungen`, `/sponsoren`, `/kontakt`, `/ueber-uns`, `/fight-night`.
- offen: Navigation und CTAs so pruefen, dass keine 404 entsteht.
- offen: `/admin/login` bleibt Admin-Einstieg; oeffentliches `/login` separat behandeln oder sauber weiterleiten.

## 3. Inhalte und Daten

- erledigt: zentrale `src/data/*`-Struktur vorhanden.
- erledigt: echte Champions sind definiert; keine zusaetzlichen echten Champions erfinden.
- offen: Fighter, Champions und Rankings als saubere Datenmodelle trennen.
- teilweise: Fighter-Profile werden aus bestaetigten Champion-/Projekt-Daten abgeleitet, bis ein eigenes Fighter-Datenmodell/Supabase-Daten vorliegen.
- offen: Doppeltes Fightcard-Modell (`fights.ts` vs. `fightcards.ts`) konsolidieren.
- offen: finale Event-/Ticketdaten nur verwenden, wenn offiziell; sonst ehrlich "wird bald bekanntgegeben".
- offen: sichtbare UI auf Deutsch halten, auch bei englischen URLs.

## 4. Bilder und Assets

- teilweise: Referenzbilder und Assets wurden bereits sortiert.
- offen: neu hinzugekommene Bilder weiter konsequent sprechend benennen und einsortieren.
- offen: `ChatGPT Image...`-Namen aus final genutzten Asset-Pfaden entfernen.
- offen: Logo-Dateien konsolidieren; keine `Kopie`-Dateinamen als Codepfad.
- offen: Hero-/Atmosphaerebilder fuer finalen Look gezielt auswaehlen, croppen und optimieren.
- offen: `next/image`-Remote-Patterns fuer Supabase Storage definieren.

## 5. Admin und Supabase

- erledigt: Admin-Routen-Geruest vorhanden.
- erledigt: Supabase Login und Kontaktformular-Grundlage vorhanden.
- teilweise: Admin sieht dunkel/markenkonform aus, ist aber funktional noch nicht fertig.
- offen: CRUD fuer Champions/Fighter, Events, Fightcards, News, Partner/Sponsoren, Kontakt, Medien, Settings.
- offen: Upload-Flow zu Supabase Storage.
- offen: serverseitige Validierung/Rate-Limiting fuer Kontaktformular.
- offen: Admin-Aktionen ueber session-gebundenen Supabase-Serverclient, RLS aktiv lassen.

## 6. QA und Launch

- offen: `npm run lint` und `npm run build` nach relevanten Codeaenderungen.
- offen: visuelle QA bei 390, 430, 768, 1280, 1440 px.
- offen: Header, Dropdown, Burger, CTAs, Footer-Links auf 404 pruefen.
- offen: SEO: Metadata, OpenGraph, Sitemap, Robots, 404.
- offen: Rechtliches: Impressum, Datenschutz, AGB, Kontaktformular-Datenschutztext.
- offen: Performance: Bildgroessen, Font-Loading, Bundle, Dependency-Pinning.

## Leitlinie

Alles Neue zahlt auf den finalen Designbrief ein. Alte Plaene und alte Referenzbilder duerfen nicht mehr verhindern, dass die Website den neuen SmashTime-Poster-Look bekommt.

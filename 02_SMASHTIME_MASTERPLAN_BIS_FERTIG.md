# SmashTime – Masterplan bis zur vollständigen Website

## Zielbild

Am Ende soll SmashTime eine vollständige Webplattform haben:

1. Öffentliches Frontend
2. Event- und Ticketseiten
3. Champions und Profile
4. News und Detailseiten
5. Sponsorenbereich
6. Fight Night / Fightcard
7. Admin-Dashboard
8. Supabase-Datenbank
9. Medienverwaltung
10. Kontaktanfragen
11. sichere Deployment-Struktur
12. saubere Wartung und Content-Pflege

## Phase 0 – Repository und Projektregeln

Ziel:
Sichere Grundlage schaffen.

Aufgaben:
- Repository auf Private stellen
- README.md ergänzen
- AGENTS.md aktualisieren
- CODEX_PHASE2_EXAKT.md ins Repo legen
- `latest` Dependencies später pinnen
- `.env` Sicherheit prüfen
- Vercel-Projekt und GitHub sauber verbinden

Fertig, wenn:
- keine Secrets im Repo sind
- Repo privat ist
- Projektregeln eindeutig sind
- README vorhanden ist

## Phase 1 – Öffentliches Hauptfrontend

Status:
Größtenteils umgesetzt.

Enthält:
- Startseite
- Champions
- Champion-Profile
- Neuigkeiten
- Veranstaltungen
- Sponsoren
- Kontakt

Noch prüfen:
- Hero/Hintergrund Startseite
- Mobile
- Bildlogik
- Referenzgenauigkeit
- keine fremden Fighter

Fertig, wenn:
- alle Hauptseiten live sauber aussehen
- Desktop und Mobile stimmen
- alle Links funktionieren
- alle Inhalte deutsch sind

## Phase 2 – Öffentliche Detailseiten

Status:
Teilweise umgesetzt.

Enthält:
- Tickets
- News-Detail
- Über uns
- Fight Night
- Eventdetail

Noch prüfen:
- exakte Referenztreue
- Mobile
- Ticketpreise als Platzhalter kennzeichnen
- Bildmaterial auf fremde Fighter prüfen
- Eventdetail/Archivlogik erweitern

Fertig, wenn:
- alle Detailseiten live erreichbar sind
- Startseite, Navigation und Footer sauber verlinken
- Inhalte datengetrieben sind
- keine Fake-Daten übernommen wurden

## Phase 3 – Supabase und Admin Dashboard

Ziel:
Inhalte nicht mehr im Code pflegen müssen.

Admin-Routen:
- `/admin/login`
- `/admin`
- `/admin/champions`
- `/admin/events`
- `/admin/fightcards`
- `/admin/news`
- `/admin/sponsors`
- `/admin/contact`
- `/admin/media`
- `/admin/settings`

Supabase-Tabellen:
- `admin_profiles`
- `champions`
- `events`
- `fight_cards`
- `news_posts`
- `sponsors`
- `contact_requests`
- `media_assets`
- `site_settings`
- `event_results`
- `event_gallery`

Fertig, wenn:
- Admin-Login sicher funktioniert
- RLS aktiv ist
- CRUD für alle Hauptinhalte funktioniert
- öffentliche Seite Daten aus Supabase liest

## Phase 4 – Qualität, Mobile, SEO und Launch

Ziel:
Website produktionsreif machen.

Aufgaben:
- kompletter Desktop-Test
- kompletter Mobile-Test
- Lighthouse-Basisprüfung
- SEO-Metadaten
- OpenGraph Bilder
- Sitemap
- Robots.txt
- 404-Seite
- Datenschutz/Impressum prüfen
- Performance-Bilder optimieren
- Vercel-Deployment finalisieren

Fertig, wenn:
- Build sauber
- Lint sauber
- Mobile sauber
- keine kaputten Links
- keine falschen Inhalte
- keine fremden Fighter
- gute Ladezeit

## Phase 5 – Betrieb und Content-Pflege

Ziel:
Website dauerhaft wartbar machen.

Aufgaben:
- Admin-Dokumentation
- Content-Workflow
- Bildgrößen-Regeln
- Backup-Konzept
- Rollen/Rechte
- Kontaktanfragen-Prozess
- Event-Nachbereitung
- neue Events klonen können
- Fightcard pro Event pflegen können

Fertig, wenn:
- jemand ohne Codex Inhalte bearbeiten kann
- neue Events ohne Code entstehen können
- News ohne Code entstehen können
- Sponsoren ohne Code gepflegt werden können

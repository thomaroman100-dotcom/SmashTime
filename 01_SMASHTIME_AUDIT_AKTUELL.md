# SmashTime – Aktueller GitHub-Audit

Stand: 04. Juli 2026

## Kurzfazit

Das Projekt ist aktuell deutlich weiter als reine Phase 1. Phase 2 ist im Code bereits teilweise umgesetzt:
- Navigation wurde um Tickets, Fight Night und Über uns erweitert.
- Neue Seiten `/tickets`, `/ueber-uns`, `/fight-night`, `/neuigkeiten/[slug]` und `/veranstaltungen/[slug]` sind vorhanden.
- Die Datenstruktur ist besser als am Anfang.
- Die Fightcard bleibt datengetrieben und leer, statt als Fake-Bild umgesetzt zu sein.

Das Projekt ist aber noch nicht fertig. Der wichtigste technische und visuelle Risikopunkt ist weiterhin die Startseiten-Hintergrundlogik. Die Startseite nutzt ein großes Body-Hintergrundbild, wodurch Header/Hero und Mobile-Cropping schwer exakt kontrollierbar sind.

## Aktueller technischer Stand

### Projektbasis

Vorhanden:
- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- App Router
- zentrale `src/data` Dateien
- Komponentenstruktur unter `src/components`
- öffentliche Routen in `src/app`

Risiko:
- `package.json` verwendet mehrere `latest` Versionen. Das kann später bei Neuinstallation zu unterschiedlichen Ergebnissen führen.
- Es fehlt eine `README.md`.

### Sicherheit

Gut:
- `.gitignore` ignoriert `.env`, `.env.local`, `.env.*.local`, `.env*` und `env supabase.txt`.

Kritisch:
- Repository ist öffentlich. Für Admin/Supabase/Backend sollte es privat sein.

### AGENTS.md

Kritisch:
- Die aktuelle `AGENTS.md` im Repo ist noch Phase-1-lastig.
- Sie verbietet noch Seiten wie Tickets, Fight Night und Über uns für Phase 1.
- Für den aktuellen Projektstand muss die neue Master-AGENTS.md ins Repo.

### Phase 1

Vorhanden:
- Startseite
- Champions
- Champion-Profile
- Neuigkeiten
- Veranstaltungen
- Sponsoren
- Kontakt

Gut:
- Eventdaten sind korrekt.
- 4 Champions sind vorhanden.
- Fightcard ist nicht als Bild umgesetzt.
- Kontaktformular ist als UI vorhanden.
- Navigation ist zentral in `src/data/site.ts`.

Offen:
- Visueller Pixelvergleich gegen Referenzen fehlt.
- Mobile muss live geprüft werden.
- Startseiten-Hero/Hintergrund muss überarbeitet werden.

### Phase 2

Vorhanden:
- Tickets
- Über uns
- Fight Night
- News-Detail
- Eventdetail

Gut:
- News haben Slugs und Detailseiten.
- Eventdetail ist datengetrieben vorbereitet.
- Fight Night nutzt Datenstruktur und zeigt keine Fake-Paarungen.
- Tickets sind als Datenstruktur vorbereitet.

Kritisch:
- Ticketpreise wirken real, sind aber offenbar Platzhalter. Das muss sichtbar als Platzhalter oder vorläufig gekennzeichnet werden, wenn noch nicht offiziell.
- Event-Archivkarten verlinken teilweise auf denselben Eventdetail-Slug. Für echte Archivseiten braucht jedes Event später eigenen Slug.
- Einige Bilder müssen visuell kontrolliert werden, ob dort fremde Fighter sichtbar sind.

## Design-Audit

### Gut

- Farbwelt passt grundsätzlich.
- Dunkler Grunge-/Cage-Look ist vorhanden.
- Rote Rahmen, Brush-Labels und Kartenlogik sind vorbereitet.
- Header, Footer und CTA-Bänder sind zentral gebaut.

### Kritisch

#### 1. Startseitenhintergrund

Aktuell nutzt `body.is-home-page` ein großes Bild `smashtime-home-background.png` über die gesamte Seite. Das macht exakte Kontrolle schwer.

Soll:
- Hero-Hintergrund direkt in `.page-hero--home::before`
- Startseite nicht von einem riesigen Body-Bild abhängig machen
- Sections eigene Hintergründe/Overlays geben
- Mobile mit eigenen Cropping-Regeln bauen

#### 2. Referenzgenauigkeit

Es gibt keine harte technische Prüfung, ob jede Seite den Referenzen wirklich millimetergenau entspricht.

Soll:
- Screenshotvergleich Desktop 1448 × 1086
- Screenshotvergleich Mobile 390 / 430 / 768
- Seite für Seite nachkorrigieren

#### 3. Mobile

Mobile-Regeln existieren im CSS, aber Live-Prüfung fehlt.

Pflicht:
- kein horizontaler Scroll
- Hero lesbar
- Header nicht zu eng
- Ticket-CTA und Burger sauber
- Karten nicht gequetscht
- Fightcard/Tabellen mobil als Cards

## Logik-Audit

### Positiv

- Inhalte sind größtenteils datengetrieben.
- News-Detailseiten funktionieren über Slugs.
- Eventdetail funktioniert über Slug.
- Ticketdaten sind zentral.
- Über-uns-Inhalte sind zentral.
- Fight Night ist zentral.
- Fightcard bleibt leer, bis echte Daten da sind.

### Noch nicht fertig

- Admin/CMS fehlt komplett.
- Supabase fehlt.
- Kontaktformular speichert nichts.
- Medienverwaltung fehlt.
- Ticketshop fehlt.
- Sponsorlogos sind Platzhalter.
- Echte Eventarchivdaten fehlen.
- Ergebnisse fehlen.
- Galerie ist nur vorbereitet.
- Social Links sind Platzhalter.
- echte E-Mail/Instagram sind Platzhalter.

## Prioritäten

1. Repo privat stellen.
2. AGENTS.md aktualisieren.
3. CODEX_PHASE2_EXAKT.md ins Repo legen.
4. Startseiten-Hero/Hintergrund sauber umbauen.
5. Phase 2 live visuell gegen Referenzen prüfen.
6. Mobile vollständig prüfen.
7. README ergänzen.
8. Danach Phase 3 Admin/Supabase planen und bauen.

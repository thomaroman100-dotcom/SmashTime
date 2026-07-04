# CODEX PROMPT – SmashTime Website Phase 1 exakt umsetzen

Du arbeitest im Projektordner:

```text
C:\Users\PC\Documents\SmashTime v1
```

Lies zuerst zwingend die Datei `AGENTS.md` und halte dich daran.

Danach lies diese Datei vollständig und setze Phase 1 exakt nach diesen Regeln um.

---

# Ziel

Baue die öffentliche SmashTime-Website exakt nach den vorhandenen Referenzbildern nach.

Wichtig:

- Nicht „ähnlich“.
- Nicht „inspiriert von“.
- Nicht „frei interpretiert“.
- Sondern so genau wie technisch möglich nachbauen.

Die Referenzbilder sind die verbindliche visuelle Vorlage für:

- Layout
- Seitenaufbau
- Abstände
- Typografie
- Farbgebung
- Header
- Navigation
- Karten
- Rahmen
- Buttons
- Footer
- Mobile-Ansicht
- Grunge-/Brush-Optik
- Arena-/Cage-Hintergründe
- rote Akzente
- dunkle Premium-Atmosphäre

Das Ergebnis soll aussehen, als wären die Referenzbilder in echten Code umgesetzt worden.

---

# Wichtigste Regel

Die Referenzbilder geben das Design exakt vor, aber nicht alle Inhalte aus den Bildern sind automatisch korrekt.

Du musst unterscheiden zwischen:

## 1. Design übernehmen

Ja, so exakt wie möglich übernehmen:

- Look
- Aufbau
- Proportionen
- Positionen
- Farben
- Typografie
- rote Linien
- rote Buttons
- schwarze Karten
- grungige Kanten
- Smoke/Arena/Cage-Stimmung
- Footer-Struktur
- Mobile-Reihenfolge

## 2. Falsche Inhalte nicht übernehmen

Nicht übernehmen:

- falsche Eventdaten
- falsche Orte
- falsche Jahreszahlen
- fremde Fighter
- erfundene Champions
- Beispielnamen
- Beispielkämpfer
- KI-Fighter aus Referenzbildern
- eingebrannte Fightcard-Texte als echte Daten
- falsch generierte Sponsor- oder Eventangaben

Wenn ein Referenzbild im Konflikt mit dieser Datei oder `AGENTS.md` steht, gelten immer diese schriftlichen Regeln.

---

# Absolute Verbote

Diese Dinge dürfen im fertigen Projekt nicht vorkommen.

## Sprache

Verboten:

- englische UI-Texte
- `Home`
- `News`
- `Events`
- `Contact`
- `Sponsors`
- `Fighters`
- `Read more`
- `Learn more`
- Lorem Ipsum
- gemischte Sprache

Alles Sichtbare muss Deutsch sein.

Erlaubte Navigation:

```text
Startseite
Champions
Neuigkeiten
Veranstaltungen
Sponsoren
Kontakt
```

Erlaubte CTA-/Button-Texte:

```text
Tickets sichern
Mehr erfahren
Details ansehen
Profil ansehen
Nachricht senden
Sponsor werden
Kontakt aufnehmen
Mehr lesen
Paket anfragen
Jetzt kontaktieren
```

---

# Fighter / Personen

Es dürfen ausschließlich die 4 vorhandenen Champions aus dem Ordner `Champions Bilder` verwendet werden.

Verboten:

- keine fremden Fighter
- keine KI-Fighter
- keine Stock-Fighter
- keine Beispielkämpfer
- keine erfundenen Champions
- keine erfundenen Gegnerbilder
- keine fremden Personen in News-Bildern
- keine fremden Personen in Fightcards
- keine fremden Personen im Hero
- keine fremden Personen auf Kontakt, Sponsoren, News oder Veranstaltungen

Wenn irgendwo im Referenzbild fremde Fighter zu sehen sind, darfst du diese nicht übernehmen.

Stattdessen auf allgemeinen Seiten neutrale Bilder verwenden:

- Arena
- Cage
- Oktagon
- Backstage
- Rauch
- Licht
- Gürtel
- Eventgrafik
- Fightcard-Board ohne Personen
- Sponsor-/Business-Visuals ohne erkennbare fremde Fighter

Champions dürfen nur sichtbar sein auf:

- Champions-Seite
- Champion-Profilseiten
- optional dynamische Champion-Karten, wenn ausdrücklich logisch als Champion-Bereich erkennbar

Champions dürfen nicht als allgemeine Deko verwendet werden.

---

# Fightcard

Die Fightcard darf nicht als starres Bild umgesetzt werden.

Verboten:

- Fightcard als Bild mit eingebrannten Namen
- Fightcard als PNG mit festem Text
- Fightcard mit fremden Beispiel-Fightern
- Fightcard mit nicht editierbaren Daten

Pflicht:

Die Fightcard muss als echte UI-Komponente gebaut werden:

- HTML/CSS/React-Komponente
- Daten aus strukturierter Datei
- später leicht mit Supabase/Admin ersetzbar
- Kämpfe später hinzufügbar, löschbar, sortierbar
- keine fremden Personenbilder erforderlich

Falls keine echten Gegnerbilder vorhanden sind:

- neutrale Platzhalter verwenden
- Initialen verwenden
- dunkle Silhouette ohne erkennbare Person verwenden
- oder reine Text-Fightcard bauen

---

# Bilder mit Text

Bilder dürfen nicht die eigentlichen Website-Daten tragen.

Verboten:

- Eventdatum nur als Teil eines Bildes
- Ort nur als Teil eines Bildes
- Countdown nur als Teil eines Bildes
- News-Titel nur als Teil eines Bildes
- Fightcard-Daten nur als Teil eines Bildes
- Sponsorpreise nur als Teil eines Bildes

Pflicht:

Alle wichtigen Inhalte müssen echte Website-Texte sein:

- lesbar
- responsiv
- editierbar
- später aus Datenbank ersetzbar

Bilder dienen nur als:

- Hintergrund
- Stimmung
- Thumbnail
- visuelles Asset
- Logo
- Championbild
- Gürtelbild

---

# Verbindliche Eventdaten

Für die nächste Veranstaltung müssen diese Daten verwendet werden:

```text
Name: SmashTime 3 / Cagetime
Datum: 17. Oktober 2026
Ort: Jahnturnhalle St. Pölten
Adresse: Jahnstraße 15, 3100 St. Pölten
Einlass: 18:00 Uhr
Beginn: 19:00 Uhr
Disziplinen: Xtreme Boxen · K1 · MMA · Boxen
Gastro: Figl Ratzersdorf
```

Nicht verwenden:

```text
SmashTime 05
Break the Limits
24. August 2025
Hanse Messe Bremen
Berlin
Max-Schmeling-Halle
Hamburg
Oberhausen
Sparkassen Arena
Kickboxen statt K1, außer als Zusatztext
Grappling, wenn es nicht ausdrücklich als Eventdisziplin vorgegeben ist
```

Die Referenzbilder zeigen teilweise falsche Eventdaten. Diese dürfen nicht übernommen werden.

---

# Seiten

Baue nur diese öffentlichen Seiten:

```text
Startseite
Champions
Champion-Profilseiten
Neuigkeiten
Veranstaltungen
Sponsoren
Kontakt
```

Keine weiteren öffentlichen Seiten ohne Freigabe.

---

# Design muss exakt so wirken

Das fertige Ergebnis muss visuell zu den Referenzbildern passen.

## Muss sein

- schwarzer Hintergrund
- dunkle Arena-/Cage-Stimmung
- roter SmashTime-Akzent
- weiße große harte Überschriften
- rote Zweitzeilen in Headlines
- distressed/grunge Sporttypografie
- rote Brush-/Scratch-Elemente
- dünne rote Rahmen um Karten
- große Eventkarten
- starke CTA-Banner
- Partnerleiste
- dunkler Footer
- Social Icons im Footer
- rote Buttons mit klarer Kante
- klare Abstände
- hochwertige Karten
- Desktop und Mobile als eigene hochwertige Ansicht

## Darf nicht sein

- helle Website
- weiße Kartenflächen
- blaue Standardlinks
- Bootstrap-Standardlook
- Tailwind-Standardkarten ohne Design
- runde bunte SaaS-Buttons
- verspielte Animationen
- billige Neon-Glows
- Comic-Optik
- Standard-Webflow-/Template-Look
- zu viel Border Radius
- zu kleine Schriften
- ungleichmäßige Abstände
- abgeschnittene Inhalte
- kaputte Mobile-Ansicht
- horizontales Scrollen auf Mobile
- leere Platzhalter
- tote Buttons ohne Ziel oder klare Funktion

---

# Seitenaufbau nach Referenz

## Startseite

Muss exakt den Aufbau der Startseiten-Referenz übernehmen:

- Header mit Logo links
- Navigation oben
- roter Button `Tickets sichern`
- Hero mit Arena-/Cage-Hintergrund
- große Headline:
  - `SMASH TIME.`
  - `ECHTE ACTION.`
- kurzer deutscher Beschreibungstext
- Button `Mehr erfahren`
- große Box `Nächste Veranstaltung`
- Eventdaten mit Icon-Logik
- Countdown-Boxen
- Disziplinen-Liste
- Button `Tickets sichern`
- Bereich `Was dich erwartet`
- Feature-Icons
- News-Vorschau
- Partnerleiste
- CTA-Banner `Bereit für SmashTime?`
- Footer

Wichtig:

- Keine Fighter auf der Startseite.
- Keine Champions im Hero.
- Keine fremden Personen.

---

## Champions

Muss exakt den Aufbau der Champions-Referenz übernehmen:

- Hero mit Headline:
  - `CHAMPIONS.`
  - `UNSERE TITELTRÄGER.`
- Introtext
- Gewichtsklassen-Filter
- Champion-Karten
- Karten mit rotem Rahmen
- große Fighterbilder
- Name
- Gewichtsklasse
- Champion-Label
- Rekord
- Button `Profil ansehen`
- CTA-Banner
- Footer

Wichtig:

- Nur die 4 echten vorhandenen Champions verwenden.
- Keine erfundenen Namen aus den Referenzbildern übernehmen.
- Keine Beispiel-Champions wie Adrian Khalid, Lukas Reinhardt, Emre Yilmaz, Martin Kowalski, Maximilian Köhler übernehmen, außer diese existieren tatsächlich in den bereitgestellten Champion-Daten.

---

## Champion-Profil

Muss den Aufbau der Profil-Referenz übernehmen:

- Header
- Hero mit `CHAMPION PROFIL`
- echtes Championbild
- Champion-Badge
- Name
- Slogan/Unterzeile
- Datenblock:
  - Gewichtsklasse
  - Rekord
  - Alter
  - Gewicht
  - Kampfstil
- Bereich `Über den Kämpfer`
- Statistikleiste
- Titel/Gürtel-Bereich
- Letzte Kämpfe
- Footer

Wichtig:

- Nur echte Championdaten verwenden.
- Keine fremden Gegnerbilder.
- Wenn Gegnerdaten fehlen, nur Text oder neutrale Silhouetten verwenden.
- Nächster Kampf darf als Komponente vorbereitet werden, aber keine falschen Bilder oder Daten einbauen.

---

## Neuigkeiten

Muss exakt den Aufbau der News-Referenz übernehmen:

- Header
- Hero mit `AKTUELLE NEWS.`
- Introtext
- Featured News
- News-Karten
- rote Labels
- rote Rahmen
- Button/Link `Mehr lesen`
- Partnerleiste
- CTA
- Footer

Wichtig:

- Keine fremden Fighterbilder.
- Keine KI-Fighter.
- News-Thumbnails nur mit neutralen Assets:
  - Arena
  - Fightcard-Board
  - Handschlag
  - Backstage
  - Trainingsequipment ohne erkennbare Person
  - Merch
  - Event-Rückblick ohne fremde Personen
- Falls eine News einen Champion betrifft, darf nur das echte Bild dieses Champions verwendet werden.

---

## Veranstaltungen

Muss exakt den Aufbau der Veranstaltungs-Referenz übernehmen:

- Hero mit `VERANSTALTUNGEN.`
- Introtext
- große Karte `Nächste Veranstaltung`
- SmashTime 3 / Cagetime
- Countdown
- Disziplinen
- Button `Tickets sichern`
- weitere Veranstaltungen
- Details ansehen Buttons
- Partnerleiste
- CTA
- Footer

Wichtig:

- Eventdaten müssen korrekt sein.
- Keine falschen Referenzdaten übernehmen.
- Keine Fighterbilder.
- Fightcard oder Eventdetails als echte Komponenten bauen.

---

## Sponsoren

Muss exakt den Aufbau der Sponsoren-Referenz übernehmen:

- Hero mit `PARTNER & SPONSOREN.`
- Introtext
- Partnerlogo-Leiste
- Bereich `Warum Sponsor werden?`
- Benefit-Karten
- Sponsoring-Pakete
- CTA `Sponsor werden` oder `Kontakt aufnehmen`
- Footer

Wichtig:

- Keine Fighter.
- Keine fremden Personen.
- Keine erfundenen Sponsorlogos, außer als eindeutig temporäre Platzhalter.
- Falls keine echten Logos vorhanden sind, neutrale Platzhalter oder Textlogos verwenden.

---

## Kontakt

Muss exakt den Aufbau der Kontakt-Referenz übernehmen:

- Hero mit `KONTAKT.`
- Introtext
- Backstage-/Arena-Korridor Bild
- Kontaktformular
- Veranstaltungsort
- Einlass/Beginn
- Instagram
- E-Mail
- Anfragearten:
  - Sponsoring
  - Presse
  - Kämpfer
  - Allgemein
- Partnerleiste
- CTA
- Footer

Wichtig:

- Keine Fighter.
- Keine Championbilder.
- Keine fremden Personen.
- Formular als echtes Formular bauen.

---

# Mobile

Die Mobile-Referenzbilder sind verbindlich.

Mobile darf nicht einfach Desktop zusammendrücken.

## Mobile muss

- eigenen Header haben
- Logo links
- Burger-Menü rechts
- CTA sauber erreichbar
- Hero lesbar
- große Headlines sauber umbrechen
- Eventkarte vertikal sauber darstellen
- Countdown mobil sauber anordnen
- Karten stapeln
- Filter horizontal scrollbar oder sauber umbrechen
- Buttons groß genug machen
- Footer mobil sauber stapeln

## Mobile darf nicht

- horizontal scrollen
- Text abschneiden
- Karten quetschen
- Desktopnavigation anzeigen
- winzige Buttons haben
- überlappende Inhalte haben
- abgeschnittene Championbilder haben
- unlesbare Countdownboxen haben

---

# Technische Umsetzung

Nutze:

- Next.js
- TypeScript
- Tailwind CSS
- komponentenbasierte Architektur

Falls Projekt bereits anders initialisiert ist, passe dich sinnvoll an, aber halte Code professionell.

---

# Daten zunächst lokal

In Phase 1 noch keine echte Supabase-Anbindung bauen.

Nutze lokale strukturierte Daten:

```text
src/data/champions.ts
src/data/events.ts
src/data/news.ts
src/data/sponsors.ts
src/data/fightcards.ts
```

Die Datenstruktur muss später leicht durch Supabase ersetzt werden können.

---

# Supabase / ENV

Es gibt eventuell eine `env supabase.txt` oder `.env.local`.

Wichtig:

- sensible Daten niemals ausgeben
- keine Keys in Code schreiben
- `.env.local` nicht committen
- `.gitignore` prüfen/erstellen
- Supabase in Phase 1 nicht aktiv verwenden
- nur Architektur so vorbereiten, dass Supabase später angeschlossen werden kann

Pflicht in `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
env supabase.txt
```

---

# Bilder und Assets

Nutze die vorhandenen Bilder logisch.

## Pflicht

- Logo aus dem Projekt verwenden
- Referenzbilder nur als Designvorlage verwenden
- Website-Assets für Arena, Cage, Backstage, News, Gürtel usw. verwenden
- Championbilder nur aus `Champions Bilder`

## Nicht

- Referenzbilder nicht einfach als fertige Website-Hintergründe überall einbauen
- keine Screenshots als UI verwenden
- keine eingebrannten Textdaten als echte Inhalte nutzen
- keine fremden Fighter ausschneiden oder übernehmen

---

# Qualitätsprüfung

Vor Abschluss musst du selbst prüfen.

## Inhalt

- Alles Deutsch?
- Korrekte Eventdaten?
- Keine falschen Ortsnamen?
- Keine falschen Jahreszahlen?
- Keine fremden Fighter?
- Nur 4 echte Champions?
- Keine Beispielnamen aus Referenzbildern?
- Keine Lorem-Ipsum-Texte?

## Design

- Entspricht jede Seite exakt der jeweiligen Desktop-Referenz?
- Entspricht jede Mobile-Seite exakt der jeweiligen Mobile-Referenz?
- Stimmen Farben, Abstände, Karten, Buttons, Footer?
- Ist das Design konsistent?
- Sieht es nicht nach Template aus?

## Technik

- Build läuft ohne Fehler
- keine Console Errors
- keine kaputten Links
- keine fehlenden Bilder
- keine TypeScript-Fehler
- keine Lint-Fehler
- responsive sauber
- keine horizontalen Scrollbars
- keine Layout-Überlappungen
- Bilder optimiert eingebunden
- Komponenten sauber strukturiert

---

# Wichtiger Abschluss

Du bist erst fertig, wenn:

- alle 7 öffentlichen Seiten existieren
- Desktop umgesetzt ist
- Mobile umgesetzt ist
- alle sichtbaren Texte Deutsch sind
- keine fremden Fighter sichtbar sind
- nur die 4 echten Champions verwendet werden
- Fightcard/Eventbereiche als echte Komponenten gebaut sind
- das Design exakt den Referenzbildern entspricht
- Build/Lint erfolgreich sind
- du die geänderten Dateien zusammenfasst
- du bekannte Abweichungen offen nennst, falls etwas technisch nicht 1:1 möglich war

Arbeite sehr genau.

Keine freie Interpretation.  
Keine zusätzlichen Designs erfinden.  
Keine optischen Experimente.  
Referenzbilder exakt in Code übersetzen.

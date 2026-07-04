# SmashTime Phase 2 – Exakte Umsetzung weiterer öffentlicher Unterseiten

## Ziel von Phase 2
Phase 2 erweitert das bereits umgesetzte öffentliche Frontend aus Phase 1 um zusätzliche öffentliche Unterseiten, die aus der Startseite heraus erreichbar sein müssen.

Diese Seiten sind verbindlich anhand der gelieferten Referenzbilder umzusetzen – ohne gestalterische Abweichungen.

Wichtig:
- Die Seiten müssen optisch exakt zum bestehenden SmashTime-Design passen.
- Die Umsetzung muss so präzise sein, dass Layout, Größenverhältnisse, Abstände, Kartenstruktur, Hero-Bereiche, Rahmen, Typografie-Hierarchie, CTA-Bereiche und Footer optisch praktisch identisch mit den Referenzbildern wirken.
- Codex darf nicht „frei interpretieren“.
- Jede Seite muss wiederholt geprüft und bei Abweichungen nachkorrigiert werden, bis sie dem Referenzbild maximal nahekommt.
- Inhalte müssen strukturiert und später austauschbar bleiben. Nichts darf so gebaut werden, dass Text, Eventdaten, Preise, Karten, News oder Sektionen nur mit hohem Aufwand änderbar wären.

---

## Verbindliche Referenzregel
Die in Phase 2 gelieferten Referenzbilder sind **verbindliche Layoutvorlagen**.

Das bedeutet:
- Struktur, Anordnung und visuelle Gewichtung müssen exakt übernommen werden.
- Keine kreativen Eigenlösungen.
- Keine anderen Blockreihenfolgen.
- Keine neuen Farben.
- Keine veränderten Kartenformen.
- Keine andere Typografie-Hierarchie.
- Keine weichere, rundere oder modernere SaaS-Optik.
- Keine zusätzlichen Abschnitte, falls diese nicht im Referenzbild vorkommen.
- Keine Abschnitte weglassen.

Codex muss jede einzelne Seite visuell gegen das Referenzbild prüfen:
- Header
- Hero-Bereich
- CTA-Buttons
- Kartenabstände
- Rahmen
- Linien
- Grunge-/Red-Akzentbereiche
- Footer
- Partnerstreifen
- Textblöcke
- Iconzeilen
- responsive Verhalten

Wenn etwas sichtbar abweicht, muss es korrigiert werden.

---

## Wichtigster Umsetzungsgrundsatz
Diese Seiten dürfen optisch exakt wie die Referenzen aussehen, aber technisch nicht starr gebaut werden.

Das heißt:
- Inhalte müssen datengetrieben sein.
- Eventdaten müssen aus Datenobjekten kommen.
- Ticketpreise müssen aus Datenobjekten kommen.
- News-Inhalte müssen aus Datenobjekten kommen.
- Fight Night Inhalte müssen aus Datenobjekten kommen.
- Event-Rückblicke / Ergebnisse / Statistiken / Galerieinhalte müssen aus Datenobjekten kommen.
- „Über uns“-Blöcke müssen aus sauber strukturierten Content-Feldern kommen.

Kein hart verdrahteter JSX-Wildwuchs.

---

## Neue Seiten aus Phase 2

Folgende zusätzliche öffentliche Seiten müssen umgesetzt werden:

1. `/tickets`
2. `/neuigkeiten/[slug]`
3. `/ueber-uns`
4. `/fight-night`
5. `/veranstaltungen/[slug]`  (Event-Detail / Event-Rückblick)

Diese Seiten sind anhand der Referenzbilder exakt aufzubauen.

---

## Einbindung in die bestehende Startseite
Die neuen Phase-2-Seiten müssen logisch aus der Startseite erreichbar sein.

### Verbindliche Verlinkungslogik:
- Der Button **„Mehr erfahren“** auf der Startseite führt zur inhaltlich passenden Detailseite.
- Der Button **„Tickets sichern“** führt zur Tickets-Seite `/tickets`.
- News-Karten auf der Startseite führen auf die jeweilige News-Detailseite `/neuigkeiten/[slug]`.
- Event-/Veranstaltungs-CTA führt zur Event-Detailseite `/veranstaltungen/[slug]`.
- Fight-Night-bezogene CTA oder Startseitenmodule führen auf `/fight-night`.
- „Über uns“ in Navigation und Footer führt auf `/ueber-uns`.

Wenn auf der Startseite mehrere CTA-Bereiche existieren, müssen diese sauber und logisch mit den neuen Unterseiten verdrahtet werden.

---

## Designsystem bleibt identisch zu Phase 1
Das bestehende SmashTime-Designsystem bleibt bindend:

- Dunkle Flächen: `#050505`, `#0B0B0D`, `#111113`
- Rotakzente: `#D71920`, `#B80012`
- Weiß / Hellgrau für Headlines und Fließtexte
- Gold nur dort, wo es logisch im bestehenden Designsystem vorkommt (z. B. Gürtel / Premium-Kontext)
- Keine zusätzlichen Akzentfarben
- Keine weich gerundeten SaaS-Komponenten
- Keine Glassmorphism-Spielereien
- Keine bunten Badges
- Keine hellen Flächen
- Keine modernen Dashboard-Stile im öffentlichen Frontend

Typografie:
- Headline-Look weiterhin stark, condensed, plakativ
- Body lesbar, sauber, sachlich
- klare visuelle Hierarchie

---

## Asset-Regeln
Referenzbilder dienen als visuelle Vorlage.

Wichtig:
- Referenzbilder dürfen nicht einfach als komplette Seite eingebaut werden.
- Bilder mit fest eingebranntem Text dürfen nicht als „Datenersatz“ missbraucht werden.
- Wo möglich, werden neutrale Hero-/Arena-/Cage-/Backstage-Bilder verwendet.
- Text, Preise, Eventdaten, News, Fightcard-Listen und Ergebnisse müssen als echte HTML-/React-UI umgesetzt werden.

### Erlaubte Asset-Logik
- Hero-Bilder / Hintergrundbilder dürfen verwendet werden, wenn sie als echte saubere Assets vorliegen.
- Content-Blöcke, Preise, Eventinfos, Karten, Resultate, FAQ usw. werden als echte UI gerendert.
- Keine Screenshot-Webseite als Fake-Seite einbetten.

---

## Neue Datenstrukturen
Zusätzlich zu Phase 1 sollen folgende Datenstrukturen ergänzt oder erweitert werden:

- `src/data/tickets.ts`
- `src/data/news.ts` (mit Detaildaten / Slugs / Featured / Related)
- `src/data/about.ts`
- `src/data/fightNight.ts`
- `src/data/eventRecaps.ts`

Bestehende Dateien wie `events.ts`, `site.ts`, `sponsors.ts` dürfen erweitert werden.

---

## Seite 1 – Tickets `/tickets`
Die Tickets-Seite muss exakt dem Referenzbild entsprechen.

### Verbindliche Sektionen:
- Hero mit Headline „Tickets“
- kurze Subheadline / Beschreibung
- großes Event-/Highlight-Modul oben
- Ticketpakete / Preisboxen
- Infobereich „Was ist inklusive?“
- FAQ / Wichtige Infos
- Event & Venue Info
- Partnerstreifen
- CTA-Banner
- Footer

### Technische Regeln:
- Ticketarten müssen aus Datenstruktur gerendert werden.
- Preise, Titel, Features, Labels wie „Beliebteste Wahl“ müssen konfigurierbar sein.
- FAQ-Einträge müssen aus Daten kommen.
- Event-/Venue-Infos ebenfalls datengetrieben.
- Buttons sollen später leicht an Ticketshop-Links gebunden werden können.

### Nicht erlaubt:
- Ticketpreise hart im JSX verteilen
- statische Screenshot-Tickets
- schlecht lesbare Preisboxen
- ungleichmäßige Kartenhöhen oder kaputte Spalten

---

## Seite 2 – News-Detail `/neuigkeiten/[slug]`
Die News-Detailseite muss exakt dem Referenzbild entsprechen.

### Verbindliche Sektionen:
- Rücklink zur News-Übersicht
- Kategorie/Datum
- große Headline
- Intro-Text
- Haupttextbereich links
- Hero-/Featurebild rechts bzw. oberer Medienbereich
- Zitat-/Statement-Box
- Event-Info-Box
- Bereich „Weitere News“
- Partnerstreifen
- CTA-Banner
- Footer

### Technische Regeln:
- Newsdaten kommen aus `news.ts`
- Jede News braucht:
  - `slug`
  - `title`
  - `date`
  - `category`
  - `excerpt`
  - `body`
  - `heroImage`
  - optionale Quote
  - optionales Eventinfo-Modul
  - related news
- Die Detailseite darf nicht hart nur für einen einzigen Beitrag gebaut werden.

### Wichtig:
- Das Layout muss exakt wie Referenz wirken.
- Später müssen andere Beiträge denselben Seitentyp nutzen können.

---

## Seite 3 – Über uns `/ueber-uns`
Die Über-uns-Seite muss exakt dem Referenzbild entsprechen.

### Verbindliche Sektionen:
- Hero mit großer Headline
- Einleitung / Brand-Statement
- Mission / Wofür wir stehen / Warum SmashTime
- Werte-Karten
- Story-Block mit Bild und Text
- Kennzahlen / Stats
- CTA-/Einladungsbereich
- Partnerstreifen
- CTA-Banner
- Footer

### Technische Regeln:
- Alle Blöcke aus `about.ts`
- Werte, Mission, Kennzahlen und CTA-Blöcke als wiederverwendbare Datenstruktur
- Keine fest verdrahteten Blindtexte im JSX

---

## Seite 4 – Fight Night `/fight-night`
Die Fight-Night-Seite muss exakt dem Referenzbild entsprechen.

### Verbindliche Sektionen:
- Hero / Headline
- Main Event Bereich
- visuelles Kämpferduell
- Gürtel / Championship-Kontext
- Fightcard-Tabelle / Fightcard-Block
- Regelwerk & Disziplinen
- Erwartungs-/Highlight-Bereich
- Countdown
- CTA
- Partnerstreifen
- CTA-Banner
- Footer

### Extrem wichtig:
Diese Seite muss technisch so gebaut werden, dass sie später dynamisch gepflegt werden kann.

### Regeln:
- Fightcard als echte UI-Komponente
- keine Fightcard als Bild
- keine eingebrannten Fighter-Namen in einem Screenshot
- Main Event, Co-Main, Undercard etc. aus Daten
- Regelwerk / Disziplinen ebenfalls aus Daten
- Countdown auf Eventdatum basierend

### Nicht erlaubt:
- fremde Beispiel-Fighter verwenden, wenn sie nicht bewusst als temporäre Platzhalter im Datensystem markiert sind
- Fightcard-Bild mit festem Text
- starre Struktur, die später nicht änderbar ist

---

## Seite 5 – Event-Detail / Rückblick `/veranstaltungen/[slug]`
Diese Seite basiert auf dem Referenzbild des Event-Rückblicks.

### Verbindliche Sektionen:
- Hero / Eventtitel / Rückblick
- Eventinfos links
- Eventbild / Arena-Hero rechts
- Statistik-Boxen
- Eventbeschreibung
- Ergebnisse / Resultate
- Highlight-/Zitat-Bereich
- Bildergalerie
- Partnerstreifen
- CTA-Banner
- Footer

### Technische Regeln:
- Eventdetaildaten aus `eventRecaps.ts`
- Ergebnisse als echte strukturierte Daten
- Galerie als echte Datenliste
- Stats als echte Datenfelder
- Diese Seite muss später pro Event wiederverwendbar sein

### Nicht erlaubt:
- komplette Eventdetails als reines statisches Mockup
- Resultate als eingefrorener Textblock im Bild
- Galerie als einziges großes statisches Bild

---

## Navigation / Footer / Verlinkung
Phase 2 muss in die bestehende Navigation integriert werden.

Navigation:
- Veranstaltungen
- Neuigkeiten
- Tickets
- Fight Night
- Über uns
- Partner
- Kontakt

Footer:
- gleiche Linklogik
- gleiche Markenoptik
- gleiche Social-Sektion

### Konsistenzregeln:
- Header und Footer müssen exakt dem etablierten Stil folgen
- keine neuen Header-Layouts erfinden
- keine Seiten mit „ähnlichem“ aber anderem Hero-Aufbau

---

## Responsive Umsetzung
Wie in Phase 1 muss sauber responsive gearbeitet werden.

### Pflicht:
- Desktop exakt an Referenz
- Tablet sauber
- Mobile logisch heruntergebrochen
- keine überlaufenden Karten
- keine zerstörten Tabellen
- keine versetzten CTA-Bereiche
- keine kaputten Grid-Umbrüche
- keine horizontalen Scrollfehler

Falls für einzelne neue Seiten noch keine Mobile-Referenzen vorhanden sind:
- Mobile strikt aus dem bestehenden Phase-1-Mobile-System ableiten
- gleiche Header-Logik
- gleiche Card-Logik
- gleiche Abstände
- gleiche CTA-Hierarchie
- gleiche Footer-Logik

---

## Qualitätskontrolle – Pflicht
Codex muss nach Umsetzung jede Seite mehrfach prüfen.

### Verbindliche Prüfpunkte:
1. Stimmt der Header pixelnah?
2. Stimmt der Hero-Bereich in Höhe und Breite?
3. Sind Headline-Größen und Umbrüche nahe an der Referenz?
4. Stimmen Kartenabstände, Rahmen und Linien?
5. Stimmt der Partnerstreifen?
6. Stimmt das CTA-Banner?
7. Stimmt der Footer?
8. Sind die Inhalte datengetrieben?
9. Gibt es harte, schwer austauschbare Inhalte?
10. Gibt es optische Abweichungen, die korrigiert werden müssen?

Codex soll nicht nach dem ersten Ergebnis stoppen, sondern solange nacharbeiten, bis die Umsetzung möglichst exakt ist.

---

## Was nicht passieren darf
- keine grobe Annäherung statt exakter Umsetzung
- keine freien Neuinterpretationen
- keine falschen Abstände
- keine falschen Proportionen
- keine falschen Hero-Höhen
- keine anderen Kartentypen
- keine UI im „nur ungefähr“-Stil
- keine fest eingebrannten Datenbilder als Ersatz für echte UI
- keine unstrukturierte JSX-Hardcodierung
- keine Inhalte, die später nur schwer bearbeitet werden können
- keine Fightcard als reines Bild
- keine Eventdetails als reines Bild
- keine News-Detailseite nur für 1 Beispiel hart codiert

---

## Was zwingend sein muss
- maximale optische Übereinstimmung
- klare Datenstrukturen
- wiederverwendbare Komponenten
- professionelle, saubere Codebasis
- perfekte Integration in Phase 1
- konsistente Navigation
- konsistente Buttons
- konsistente Karten
- konsistente Header/Footer
- robuste Grundlage für spätere Admin-/CMS-/Backend-Anbindung

---

## Abschluss
Nach Phase 2 muss ein stimmiges öffentliches Frontend vorliegen, bei dem:
- die neuen Unterseiten exakt wie die gelieferten Referenzen wirken,
- alle wichtigen CTA-Wege der Startseite sauber funktionieren,
- Inhalte professionell austauschbar bleiben,
- und keine optischen oder strukturellen Schwächen mehr sichtbar sind.
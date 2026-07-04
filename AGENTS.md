# AGENTS.md – SmashTime Codex-Arbeitsplan

Diese Datei ist die verbindliche Arbeitsanweisung für Codex im Repository **SmashTime**.

Codex muss diese Datei vor jeder Aufgabe vollständig lesen. Wenn eine Nutzeranweisung, ein Referenzbild, vorhandener Code oder eine ältere Markdown-Datei dieser Datei widerspricht, gilt diese Datei.

Stand: 04. Juli 2026  
Aktive Phase: **Phase 1 – öffentliches Frontend bereinigen, stabilisieren und fertigstellen**

---

## 1. Grundsatz

Arbeite professionell, sauber und kontrolliert.

Nicht jedes Problem mit neuen Seiten, neuen Dateien, neuen Ports oder schnellen Workarounds lösen. Jede Änderung muss einem klaren Ziel dienen:

1. öffentliche Website stabilisieren
2. visuelle Qualität erhöhen
3. Datenstruktur für spätere Verwaltung vorbereiten
4. technische Schulden vermeiden
5. vorhandene Widersprüche bereinigen

Wenn etwas unklar ist, wähle die kleinste saubere Lösung, die zur bestehenden Struktur passt.

---

## 2. Projektziel

SmashTime ist eine Kampfsport- und Event-Website aus St. Pölten.

Die Website soll wirken wie eine hochwertige Agenturarbeit:

- dunkel
- aggressiv
- sportlich
- hochwertig
- grungy
- klar strukturiert
- schnell erfassbar
- nicht billig
- nicht verspielt
- nicht wie ein Baukasten

Die Seite soll nach einer echten Kampfsportorganisation aussehen, nicht nach einer Testseite.

---

## 3. Aktueller technischer Stand

Das Projekt ist ein Next.js-Projekt mit TypeScript und Tailwind CSS.

Bekannter Stand:

- App Router wird verwendet
- zentrale Daten liegen unter `src/data/`
- wiederkehrende UI liegt unter `src/components/`
- öffentliche Seiten liegen unter `src/app/`
- `package.json` enthält Scripts für `dev`, `build`, `start`, `lint`

Wichtig: Der aktuelle Code und ältere Planungsdateien enthalten Widersprüche. Diese Datei löst diese Widersprüche auf.

---

## 4. Phasenmodell

Codex darf Phasen nicht eigenmächtig überspringen.

### Phase 0 – Arbeitsumgebung und Sicherheit

Ziel:

- Projekt prüfen
- Git-Status prüfen
- Port-Situation prüfen
- Abhängigkeiten prüfen
- keine Zugangsdaten ausgeben
- keine unnötigen Prozesse starten

Pflicht:

- zuerst `git status` prüfen
- vorhandene Änderungen respektieren
- keine fremden Änderungen überschreiben
- nur einen lokalen Entwicklungsserver verwenden
- festen Port verwenden

### Phase 1 – Öffentliches Frontend bereinigen und fertigstellen

Diese Phase ist aktuell aktiv.

Ziel:

- öffentliche Seiten professionell fertigstellen
- Navigation korrigieren
- falsche oder überflüssige Routen bereinigen
- Eventdaten konsistent halten
- Desktop und Mobile hochwertig machen
- Daten lokal strukturiert vorbereiten

Erlaubt:

- Next.js Frontend
- lokale TypeScript-Daten
- Komponentenstruktur verbessern
- CSS/Tailwind verbessern
- öffentliche Seiten reparieren
- Bilder aus `public/images/` korrekt verwenden
- falsche Links korrigieren
- vorhandene falsche Routen entfernen, umleiten oder in erlaubte Seiten integrieren

Nicht erlaubt:

- kein Admin-Dashboard
- kein Login
- keine Supabase-Anbindung
- keine echte Datenbank
- keine Upload-Funktion
- keine echte Ticketshop-Integration
- keine neuen öffentlichen Seiten ohne klare Freigabe

### Phase 2 – Inhalte und Eventlogik erweitern

Erst nach ausdrücklicher Freigabe.

Ziel:

- echte Fightcard-Daten ergänzen
- Ticketinformationen besser strukturieren
- Eventdetailseiten ausbauen
- Newsdetailseiten redaktionell erweitern
- Sponsorenpakete realistischer ausbauen

Auch Phase 2 bleibt zunächst lokal und datenbasiert. Supabase oder Admin kommen nicht automatisch dazu.

### Phase 3 – Admin, Supabase und Verwaltung

Erst nach ausdrücklicher Freigabe.

Ziel:

- Admin-Dashboard
- Login und Rollen
- Supabase-Datenbank
- Uploads
- Fighter-Verwaltung
- Events-Verwaltung
- Fightcard-Verwaltung
- News-Verwaltung
- Sponsoren-Verwaltung

Vor Phase 3 muss Codex zuerst ein Datenmodell vorschlagen und darf nicht direkt Tabellen oder Backend-Logik bauen.

### Phase 4 – Deployment, Performance und Qualitätsfinalisierung

Erst nach ausdrücklicher Freigabe oder wenn Phase 1 vollständig fertig ist.

Ziel:

- stabiler Build
- stabiler Lint
- Vercel sauber
- Performance optimieren
- SEO/Metadata verbessern
- Bildgrößen prüfen
- responsive Feinschliff

---

## 5. Strikte Port-Regel

Es darf nicht jedes Mal ein neuer localhost-Port geöffnet werden.

### Fester Projekt-Port

Für lokale Entwicklung gilt verbindlich:

```text
Port: 3000
URL:  http://localhost:3000
```

Codex darf nicht automatisch auf `3001`, `3002`, `3003`, `5173`, `8080` oder andere Ports ausweichen.

Wenn Port 3000 belegt ist:

1. prüfen, welcher Prozess Port 3000 belegt
2. prüfen, ob es ein alter Node/Next-Dev-Prozess aus diesem Projekt ist
3. nur diesen alten Projektprozess sauber beenden
4. danach wieder Port 3000 verwenden

Nicht erlaubt:

- parallel mehrere Dev-Server starten
- bei belegtem Port einfach neuen Port nehmen
- zufällig Ports offen lassen
- fremde/System-Prozesse beenden

### package.json-Regel

`package.json` muss so eingestellt sein, dass Next.js immer Port 3000 verwendet:

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "eslint ."
  }
}
```

Nicht erlaubt:

```json
"dev": "next dev"
```

weil Next.js sonst bei belegtem Port auf weitere Ports ausweichen kann.

### Dev-Server-Regel

- maximal ein Dev-Server gleichzeitig
- immer `npm run dev`
- keine parallelen Terminals mit mehreren `next dev`
- wenn Server schon läuft, nicht erneut starten
- wenn Port 3000 blockiert ist, Ursache beheben, nicht Port wechseln

---

## 6. Git- und Arbeitsregeln

Vor jeder Änderung:

```bash
git status
```

Regeln:

- keine fremden Änderungen überschreiben
- keine Assets löschen, außer sie sind eindeutig falsch oder doppelt und die Aufgabe verlangt Cleanup
- keine Zugangsdaten anzeigen
- keine `.env`-Dateien committen
- keine großen Refactorings ohne konkreten Nutzen
- kleine, nachvollziehbare Änderungen
- nach größeren Änderungen Build/Lint prüfen

Wenn ein Fehler gefunden wird, zuerst Ursache suchen, nicht Symptome übermalen.

---

## 7. Sichtbare Sprache

Die gesamte sichtbare Website muss Deutsch sein.

Nicht erlaubt als sichtbare UI-Texte:

- Home
- Events
- News
- Sponsors
- Contact
- Fighters
- Fight Night als Navigationspunkt
- Learn more
- Read more
- Buy tickets
- Lorem Ipsum
- gemischte Sprache

Erlaubt als Marke oder Fachbegriff:

- SmashTime
- Cagetime
- MMA
- K1
- Fightcard

Empfohlene deutsche Begriffe:

```text
Startseite
Champions
Neuigkeiten
Veranstaltungen
Sponsoren
Kontakt
Tickets sichern
Mehr erfahren
Details ansehen
Profil ansehen
Nachricht senden
Sponsor werden
Kontakt aufnehmen
Mehr lesen
Paket anfragen
Kampfabend
```

---

## 8. Erlaubte öffentliche Routen in Phase 1

In Phase 1 sind nur diese öffentlichen Routen erlaubt:

```text
/
/champions
/champions/[slug]
/neuigkeiten
/neuigkeiten/[slug]
/veranstaltungen
/veranstaltungen/[slug]
/sponsoren
/kontakt
```

### Nicht als eigene öffentliche Hauptseiten erlaubt

```text
/tickets
/fight-night
/ueber-uns
```

Falls diese Routen im Projekt vorhanden sind, werden sie nicht weiter als Hauptseiten ausgebaut.

Korrekte Behandlung:

- Inhalte aus `/tickets` gehören in `/veranstaltungen` oder in einen Abschnitt `#tickets` auf der Veranstaltungsseite.
- Inhalte aus `/fight-night` gehören in `/veranstaltungen` oder in die Eventdetailseite.
- Inhalte aus `/ueber-uns` werden in Phase 1 nicht als eigene Hauptseite geführt.
- Navigation darf nicht auf diese Routen zeigen.
- CTA `Tickets sichern` soll auf `/veranstaltungen` oder `/veranstaltungen#tickets` zeigen.
- Wenn Routen bestehen bleiben müssen, dann nur als Weiterleitung auf die erlaubte Zielseite.

---

## 9. Navigation

Die Hauptnavigation muss genau diese Punkte enthalten:

```text
Startseite
Champions
Neuigkeiten
Veranstaltungen
Sponsoren
Kontakt
```

Zusätzlich als CTA:

```text
Tickets sichern
```

Nicht in die Navigation:

```text
Tickets
Fight Night
Über uns
Partner
Events
News
Home
```

`Partner` wird sichtbar durch `Sponsoren` ersetzt.

Aktive Links müssen korrekt sein. Keine Navigation darf auf eine 404-Seite zeigen.

---

## 10. Verbindliche Eventdaten

Für die nächste Veranstaltung gelten verbindlich:

```text
Name: SmashTime 3 / Cagetime
Kurzname: SmashTime 3
Untertitel: Cagetime
Datum: 17. Oktober 2026
Ort: Jahnturnhalle St. Pölten
Adresse: Jahnstraße 15, 3100 St. Pölten
Einlass: 18:00 Uhr
Beginn: 19:00 Uhr
Disziplinen: Xtreme Boxen · K1 · MMA · Boxen
Gastro: Figl Ratzersdorf
```

Nicht übernehmen, auch wenn es in Referenzen oder alten Dateien auftaucht:

```text
SmashTime 05
Break the Limits
24. August 2025
21. Juni 2025
Hanse Messe Bremen
Berlin
Hamburg
Oberhausen
Sparkassen Arena
Max-Schmeling-Halle
Grappling als Pflichtdisziplin
Kickboxen statt K1, außer als erklärender Zusatz
```

Alle Eventdaten müssen aus `src/data/events.ts` oder einer klaren lokalen Datenquelle kommen. Nicht dieselben Daten hart in mehreren Komponenten duplizieren.

---

## 11. Datenstruktur-Regel

Wiederkehrende Inhalte müssen aus lokalen Datenstrukturen kommen, nicht verteilt im JSX.

Empfohlene Datenquellen:

```text
src/data/site.ts
src/data/events.ts
src/data/champions.ts
src/data/news.ts
src/data/sponsors.ts
src/data/fights.ts
src/data/fightcards.ts
src/data/heroes.ts
```

Regeln:

- zentrale Daten einmal definieren
- Komponenten erhalten Daten als Props
- keine sichtbaren Fake-Namen verwenden, wenn echte Daten vorhanden sind
- fehlende Daten ehrlich als „Wird nachgetragen“ oder „wird bald veröffentlicht“ markieren
- keine Lorem-Ipsum-Texte

---

## 12. Champions-Regel

Aktuelle echte Champions aus den Projektdaten:

```text
Tanyo Tanev
Alter: 26 Jahre
Gewicht: 80 kg
Klasse: Light Heavyweight
Bilanz: 10 Siege / 5 Niederlagen / 2 Unentschieden

Mike Capellan Rodriguez
Alter: 19 Jahre
Gewicht: 71 kg
Klasse: Middleweight
Bilanz: 15 / 3 / 1 / 0
Herkunft: Dominikanische Republik

Liam Stancel
Alter: 18 Jahre
Gewicht: 70 kg
Klasse: Middleweight
Bilanz: 7 / 1 / 0 / 0
Herkunft: England / Österreich

Denis Berisha
Alter: 23 Jahre
Bilanz: 25 / 1 / 1
Gewicht/Klasse: wird nachgetragen, falls nicht offiziell bestätigt
```

Regeln:

- keine erfundenen Champions
- keine fremden Fighter
- keine KI-Fighter als echte Personen
- keine Stock-Fighter als Champion
- Championbilder nur für Champion-Seite und Champion-Profilseiten
- Championbilder nicht als allgemeine Deko auf Startseite, Sponsoren, Kontakt oder News verwenden

Wenn Bildzuordnung unsicher ist, nicht raten. Lieber neutral darstellen oder im Code klar kommentieren.

---

## 13. Fightcard-Regel

Eine Fightcard darf niemals als starres Bild mit eingebrannten Namen umgesetzt werden.

Verboten:

- Fightcard als PNG/JPG mit fixem Text
- Fighter-Namen nur im Bild
- fremde Beispielkämpfer
- `FIGHTER NAME` Platzhalter sichtbar
- nicht editierbare Kampfpaare

Pflicht:

- Fightcard als React/HTML/CSS-Komponente
- Daten aus `src/data/fights.ts` oder `src/data/fightcards.ts`
- später leicht durch Supabase ersetzbar
- wenn keine echten Daten vorhanden sind, anzeigen:

```text
Fightcard wird bald veröffentlicht.
```

Keine Kämpfe erfinden.

---

## 14. Bild- und Asset-Regeln

### Logo

Das Logo soll über einen sauberen Public-Pfad eingebunden werden:

```text
public/images/logo/smashtime-logo.png
```

Header und Footer verwenden dasselbe Logo.

### Referenzbilder

Referenzbilder sind visuelle Vorgaben, aber keine fertigen Website-Screenshots.

Codex darf sie verwenden für:

- Layoutverständnis
- Bildsprache
- Grunge-Stil
- Header-Stimmung
- Kartenoptik
- rote Akzente
- Footer-Anmutung

Codex darf sie nicht verwenden, um falsche Inhalte zu übernehmen.

### Bilder mit Text

Wichtige Website-Daten dürfen nicht nur Teil eines Bildes sein.

Pflicht als echter Text:

- Datum
- Ort
- Einlass
- Beginn
- Fightcard-Daten
- News-Titel
- Ticketinformationen
- Sponsorenpakete

Bilder dienen als Hintergrund, Stimmung, Thumbnail, Logo, Championbild oder visuelles Asset.

---

## 15. Design-System

Verbindlicher Stil:

- schwarzer/dunkelgrauer Hintergrund
- rote Akzente
- harte Karten
- grungy Scratch-/Brush-Details
- hochwertige Arena-/Cage-Stimmung
- klare Typografie
- große Headlines
- starke CTA-Flächen
- wenig Ablenkung
- professioneller Premium-Look

Nicht verwenden:

- bunte Zusatzfarben
- billige Neon-Glow-Effekte
- zufällige Animationen
- zu starke Blur-Effekte auf Text
- glatte Standard-Baukasten-Karten
- uneinheitliche Border-Systeme
- unscharfe Bilder
- überladene Layouts

Empfohlene Farben:

```text
Schwarz:        #050505
Dunkelgrau:    #0B0B0D
Card-Grau:     #111113
SmashTime-Rot: #D71920
Dunkelrot:     #B80012
Gold-Akzent:   #C9A24A
Weiß:          #FFFFFF
Hellgrau:      #D8D8D8
Mittelgrau:    #8A8A8A
```

Gold nur sparsam für Champion-, Titel- und Premium-Elemente verwenden.

---

## 16. Karten- und Grunge-Regel

Cards sollen nicht wie normale glatte Rechtecke wirken.

Für Event-, Champion-, News- und Sponsor-Cards bevorzugt:

- dünne rote Basis-Border
- dezente Scratch-/Grunge-Overlays
- dunkle Vignette für Lesbarkeit
- angerissene rote Ecklinien
- subtile diagonale Linien
- Content immer über Overlays mit sauberem `z-index`
- responsive saubere Abstände

Overlay-Effekte dürfen niemals Text unlesbar oder unscharf machen.

---

## 17. Seitenanforderungen Phase 1

### Startseite `/`

Muss enthalten:

- Header mit Logo
- korrekte deutsche Navigation
- Hero im SmashTime-Stil
- starke Headline
- CTA `Mehr erfahren` darf nicht auf `/ueber-uns` zeigen, sondern auf einen vorhandenen Abschnitt oder `/veranstaltungen`
- nächstes Event prominent
- Countdown
- Eventdaten korrekt
- Bereich `Was dich erwartet`
- News-Vorschau
- Sponsoren-/Partnerstreifen
- CTA-Band
- Footer

Keine Championbilder als allgemeine Startseiten-Deko.

### Champions `/champions`

Muss enthalten:

- Hero
- Filter/Gewichtsklassen
- 4 echte Champion-Karten aus `src/data/champions.ts`
- Button `Profil ansehen`
- keine Fake-Champions

### Champion-Profil `/champions/[slug]`

Muss enthalten:

- echte Daten aus `src/data/champions.ts`
- Bild passend zur Person, falls sicher zugeordnet
- Stats
- Kurzbiografie
- Titel-/Gürtelbereich
- Backlink zur Champions-Seite

### Neuigkeiten `/neuigkeiten`

Muss enthalten:

- Hero
- Featured-News oder klare News-Übersicht
- News-Grid
- deutsche Titel
- keine Lorem-Ipsum-Texte
- keine fremden Fighter als echte News-Personen

### Neuigkeiten Detail `/neuigkeiten/[slug]`

Erlaubt, wenn bereits vorhanden oder für News notwendig.

Muss enthalten:

- echte lokale News-Daten
- Backlink
- saubere Metadaten
- keine erfundenen Tatsachen als offiziell darstellen

### Veranstaltungen `/veranstaltungen`

Muss enthalten:

- Hero
- großes Event-Modul für SmashTime 3 / Cagetime
- korrekte Eventdaten
- Countdown
- Disziplinen korrekt
- Fightcard-Bereich als dynamische Komponente oder Hinweis
- Ticketbereich/CTA integriert, nicht als separate Route notwendig
- vergangene Events nur als klar markierte Platzhalter, wenn echte Daten fehlen

### Veranstaltungsdetail `/veranstaltungen/[slug]`

Erlaubt.

Muss enthalten:

- Eventdaten aus lokaler Datenquelle
- keine falschen Ergebnisse vor dem Event
- Ergebnisse erst nach Event oder als `werden veröffentlicht` markieren
- CTA zurück zur Veranstaltungsseite oder Ticketabschnitt

### Sponsoren `/sponsoren`

Muss enthalten:

- Hero
- Sponsoren-/Logo-Bereich
- Vorteile für Sponsoren
- Sponsorenpakete als lokale Daten
- CTA `Sponsor werden`

### Kontakt `/kontakt`

Muss enthalten:

- Hero
- Kontaktformular mit deutschen Labels
- Anfragearten: Sponsoring, Presse, Kämpfer, Allgemein
- Eventinfos korrekt
- keine erfundene echte E-Mail, wenn nicht bestätigt

---

## 18. Mobile-Regeln

Mobile muss genauso ernst genommen werden wie Desktop.

Pflicht:

- Burger-Menü
- Logo gut sichtbar
- keine horizontale Scrollbar
- Hero lesbar
- Cards sauber gestapelt
- Buttons groß genug
- Formulare gut bedienbar
- Bilder nicht unkontrolliert abgeschnitten
- Footer sauber
- kein Text läuft aus Karten heraus

Mindestens prüfen:

```text
390 px
430 px
768 px
1280 px
1440 px
```

Wenn ein Design auf Mobile nicht funktioniert, nicht verstecken, sondern responsive sauber lösen.

---

## 19. Technische Struktur

Bevorzugte Struktur:

```text
src/app/
src/components/layout/
src/components/sections/
src/components/ui/
src/data/
src/lib/
public/images/
```

Regeln:

- keine riesigen unübersichtlichen Komponenten
- wiederkehrende Elemente auslagern
- Daten nicht quer in JSX verteilen
- Props sauber typisieren
- keine toten Imports
- keine ungenutzten Dateien endlos liegen lassen
- keine neue Library installieren, wenn CSS/React reicht

---

## 20. Sicherheit

Wenn Supabase-Keys, `.env`, Tokens oder andere Zugangsdaten vorhanden sind:

- niemals anzeigen
- niemals in Logs schreiben
- niemals committen
- niemals in Code hardcoden

`.gitignore` muss Zugangsdaten ausschließen.

Phase 1 verwendet keine Supabase-Verbindung.

---

## 21. Qualitätskontrolle vor Abschluss

Codex muss nach relevanten Änderungen prüfen:

```bash
npm run lint
npm run build
```

Wenn ein Befehl fehlschlägt:

- Fehlerursache nennen
- keine Fehler verschweigen
- keine Fake-Erfolgsmeldung
- wenn möglich sauber beheben

Zusätzlich prüfen:

- alle erlaubten Seiten erreichbar
- Navigation funktioniert
- CTA-Links führen nicht auf verbotene oder fehlende Routen
- keine englischen UI-Texte außer erlaubte Fachbegriffe
- keine Lorem-Ipsum-Texte
- Eventdaten stimmen überall überein
- keine erfundenen Fighter
- Fightcard nicht als statisches Bild
- keine Championbilder auf falschen Seiten
- Mobile ohne horizontales Scrollen
- Port 3000 bleibt einziger Dev-Port

---

## 22. Fertig ist Phase 1 erst, wenn

- Hauptnavigation korrekt ist
- `/tickets`, `/fight-night`, `/ueber-uns` nicht mehr als Hauptseiten wirken
- CTA `Tickets sichern` auf erlaubten Veranstaltungs-/Ticketabschnitt zeigt
- alle erlaubten öffentlichen Seiten fertig sind
- Desktop hochwertig wirkt
- Mobile hochwertig wirkt
- Build läuft
- Lint läuft oder Ausnahmen klar dokumentiert sind
- Daten zentral strukturiert sind
- Eventdaten überall korrekt sind
- keine neuen Ports geöffnet wurden
- Codex am Ende alle Änderungen zusammenfasst

---

## 23. Abschlussbericht von Codex

Am Ende jeder Aufgabe muss Codex kurz berichten:

```text
Geändert:
- ...

Geprüft:
- npm run lint
- npm run build
- Port 3000 geprüft
- Navigation geprüft

Offen:
- ...
```

Keine langen Ausreden. Keine allgemeinen Floskeln. Nur konkrete Ergebnisse.

---

## 24. Harte Stop-Regeln

Codex muss stoppen und nicht weiterbauen, wenn:

- Zugangsdaten sichtbar würden
- ein fremder Prozess betroffen wäre, der nicht eindeutig zum Projekt gehört
- eine Aufgabe Supabase/Admin verlangt, aber Phase 3 nicht freigegeben ist
- eine Änderung Daten löschen würde, die nicht gesichert sind
- ein Referenzbild falsche reale Daten vorgibt

Dann kurz erklären, was blockiert und welche sichere Lösung möglich ist.

---

## 25. Leitlinie

Optik wie hochwertige Kampfsport-Referenz.

Technisch aber sauber als echte Website:

- echte Komponenten
- echte Texte
- echte Datenstruktur
- feste Routen
- fester Port
- keine wilden Abkürzungen

Lieber weniger Features, aber stabil, hochwertig und später erweiterbar.

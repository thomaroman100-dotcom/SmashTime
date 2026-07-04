# SmashTime Projektregeln für Codex

Diese Datei ist die verbindliche Arbeitsanweisung für Codex im Projekt **SmashTime v1**.  
Codex muss diese Datei vor jeder Aufgabe lesen und die Regeln strikt einhalten.

---

## 1. Projektziel

Baue eine professionelle, moderne Kampfsport-Website für **SmashTime** aus St. Pölten.

Die Seite soll wirken wie eine hochwertige Agenturarbeit:
- dunkel
- aggressiv
- sportlich
- klar
- hochwertig
- schnell erfassbar
- nicht verspielt
- nicht überladen
- nicht billig

Die Website soll wie eine echte Kampfsportorganisation wirken, nicht wie eine private Hobby- oder Vereinsbaukasten-Seite.

---

## 2. Aktuelle Phase

### Phase 1: Öffentliches Frontend

In Phase 1 wird ausschließlich das öffentliche Frontend gebaut.

Nicht bauen:
- kein Admin-Dashboard
- kein Login
- keine Supabase-Anbindung
- keine echte Datenbank
- keine Upload-Funktionen
- keine echte Ticketverkaufsintegration

Stattdessen:
- lokale Dummy-Daten verwenden
- saubere Datenstruktur vorbereiten
- responsive Desktop- und Mobile-Ansicht bauen
- Bilder aus dem Projektordner sinnvoll einbinden
- die spätere Supabase/Admin-Anbindung vorbereiten, aber noch nicht umsetzen

### Spätere Phase

Admin-Dashboard, Supabase, Datenbank, Uploads und echte Verwaltung kommen erst später nach ausdrücklicher Freigabe.

---

## 3. Sprache und sichtbare Texte

Die gesamte sichtbare Website muss auf **Deutsch** sein.

Nicht erlaubt:
- englische Navigation wie `Events`, `News`, `Partner`, `Fight Night`
- englische Buttons
- englische Formulartexte
- Lorem Ipsum
- Fake-Orte
- Fake-Eventdaten
- Fake-Kämpfernamen, wenn echte Daten vorhanden sind

Technische Dateinamen, Komponenten, Variablen und interne Code-Strukturen dürfen Englisch sein. Alles, was Besucher sehen, muss Deutsch sein.

---

## 4. Öffentliche Seiten

Es dürfen in Phase 1 nur diese öffentlichen Seiten erstellt werden:

1. Startseite `/`
2. Champions `/champions`
3. Champion-Profilseiten `/champions/[slug]`
4. Neuigkeiten `/neuigkeiten`
5. Veranstaltungen `/veranstaltungen`
6. Sponsoren `/sponsoren`
7. Kontakt `/kontakt`

Keine zusätzlichen öffentlichen Seiten ohne Freigabe.  
Keine Seite „Über uns“, keine Seite „Fight Night“, keine Seite „Tickets“ als eigene Route in Phase 1.

Eine Schaltfläche **„Tickets sichern“** darf sichtbar sein. Sie soll in Phase 1 auf die Veranstaltungen-Seite oder auf den Eventbereich verlinken.

---

## 5. Navigation

Die Hauptnavigation muss deutsch sein:

```text
Startseite
Champions
Neuigkeiten
Veranstaltungen
Sponsoren
Kontakt
```

Zusätzlich rechts als CTA:

```text
Tickets sichern
```

Die Referenzbilder zeigen teilweise englische Begriffe. Diese dürfen nur als visuelle Vorlage verwendet werden. Die finale Website muss deutsch bleiben.

---

## 6. Verbindliche Eventdaten

Für die nächste Veranstaltung gelten diese Daten verbindlich:

```text
Name: SmashTime 3 / Cagetime
Datum: 17. Oktober 2026
Ort: Jahnturnhalle St. Pölten
Einlass: 18:00 Uhr
Beginn: 19:00 Uhr
Disziplinen: MMA · K1 · Xtreme Boxen · Boxen
```

Nicht übernehmen, auch wenn es in Referenzbildern steht:
- SmashTime 05
- Break the Limits
- 24. August 2025
- 21. Juni 2025
- Hanse Messe Bremen
- Sparkassen Arena
- Hamburg
- Oberhausen
- Grappling als Pflichtdisziplin
- falsche Straßennummern oder erfundene Adressen

Wenn eine genaue Adresse nicht eindeutig in den Projektdaten vorhanden ist, nur **Jahnturnhalle St. Pölten** anzeigen und keine Adresse erfinden.

---

## 7. Design-System

Die Desktop-Referenzen im Ordner `Referenzbilder/Desktop/` sind die wichtigsten visuellen Vorgaben.

Verbindliche Referenzseiten:

```text
Referenzbilder/Desktop/Startseite.png
Referenzbilder/Desktop/Champs.png
Referenzbilder/Desktop/Champ Profil.png
Referenzbilder/Desktop/News.png
Referenzbilder/Desktop/Veranstaltungen.png
Referenzbilder/Desktop/PartnerSponsoren.png
Referenzbilder/Desktop/Kontakt.png
```

Diese Bilder definieren:
- Layout-Richtung
- Bildsprache
- Header-Stil
- rote Akzente
- grungy Fight-Night-Look
- Kartenstil
- Typografie-Wirkung
- CTA-Banner
- Footer-Stil

Die Referenzbilder sind aber nicht 1:1 als statische Screenshots einzubauen. Sie sind visuelle Vorgaben für HTML/CSS-Komponenten.

---

## 8. Visueller Stil

Die Website soll diesen Stil konsequent verwenden:

- schwarzer/dunkelgrauer Hintergrund
- starke rote Akzentflächen
- weißer, rauer, sportlicher Headline-Look
- grungy Brush-/Scratch-Elemente
- dunkle Arena-/Cage-Bilder
- harte, klare Karten
- dünne rote Rahmen
- starke CTA-Banner
- klare Abstände
- hochwertige Desktop- und Mobile-Darstellung

Nicht verwenden:
- bunte Zusatzfarben
- billige Neon-Glow-Effekte
- verspielte Rundungen
- zufällige Animationen
- uneinheitliche Karten
- überladene Layouts
- unscharfe Bilder

---

## 9. Farben

Empfohlene Farbwerte:

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

Gold nur für Champion-/Titel-/Premium-Elemente einsetzen. Nicht überall verwenden.

---

## 10. Typografie

Überschriften:
- groß
- rau/sportlich
- uppercase
- condensed
- stark und aggressiv

Geeignete Fonts:
- Oswald
- Bebas Neue
- Anton
- Teko
- ähnliche sportliche Condensed-Schriften

Fließtext:
- klar lesbar
- modern
- ruhig

Geeignete Fonts:
- Inter
- Manrope
- Satoshi
- ähnliche Sans-Serif-Schriften

Wenn externe Fonts eingebunden werden, muss die Seite stabil laden und fallback-sicher sein.

---

## 11. Bildlogik

### Logo

Das Logo liegt im Hauptordner als:

```text
Logo.png
```

Es soll für Header und Footer verwendet werden.  
Beim Umsetzen kann Codex es in einen sauberen Public-Pfad kopieren, z. B.:

```text
public/images/logo/smashtime-logo.png
```

### Champions Bilder

Finale Champion-Bilder liegen in:

```text
Champions Bilder/
```

Diese Bilder dürfen nur verwendet werden für:
- Champions-Seite
- Champion-Profilseiten
- echte dynamische Champion-Karten

Diese Bilder dürfen nicht verwendet werden für:
- Startseiten-Hero
- Kontakt-Hero
- Sponsoren-Hero
- Neuigkeiten-Hero
- Veranstaltungen-Hero
- Footer
- statische Dekoration

Grund: Champions können wechseln. Die Seite darf nicht statisch von bestimmten Champions abhängig sein.

### Champions Daten

Die Champion-Daten liegen in:

```text
Champions Daten/Kämpferliste 4 Fighetr.pdf
```

Codex soll diese Daten für initiale Dummy-Daten verwenden.  
Bilder innerhalb der PDF oder im Datenordner dienen nur zur Zuordnung, nicht als finale Website-Bilder.

Bekannte Champion-Daten aus dem PDF:

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
```

Wenn Bild-zu-Person-Zuordnung nicht eindeutig möglich ist, nicht raten. In diesem Fall sichtbar dokumentieren, welche Zuordnung unsicher ist.

### Referenzbilder und Assets

Der Ordner `Referenzbilder/Desktop/` enthält die verbindlichen Seitenreferenzen.  
Andere Bilder im Ordner `Referenzbilder/` können als unterstützende Bildassets oder alte Varianten dienen.

Codex soll diese unterstützenden Bilder nicht blind als Seitenreferenzen behandeln.  
Er soll sie sinnvoll kategorisieren und bei Bedarf in saubere Public-Pfade kopieren, z. B.:

```text
public/images/backgrounds/
public/images/news/
public/images/champions/
public/images/ui/
```

---

## 12. Dynamische Inhalte: Wichtig

Die Website soll mit lokalen Dummy-Daten gebaut werden, aber so, dass später Supabase/Admin leicht angeschlossen werden kann.

Empfohlene Dateien:

```text
src/data/champions.ts
src/data/events.ts
src/data/news.ts
src/data/sponsors.ts
src/data/fights.ts
src/data/site.ts
```

Alle wiederkehrenden Inhalte müssen aus Datenstrukturen kommen, nicht hart im JSX verteilt werden.

---

## 13. Fightcard-Regel

Eine Fightcard darf niemals als starres Bild umgesetzt werden.

Das Fightcard-Bild in den Referenzen oder Assets ist nur:
- visuelle Inspiration
- Thumbnail für News möglich
- Stilvorgabe

Die echte Fightcard muss später dynamisch aus Daten gerendert werden.

In Phase 1 darf eine Fightcard-Komponente vorbereitet werden, aber sie muss aus lokalen Daten kommen, z. B. `src/data/fights.ts`.

Jeder Kampf soll als Datenobjekt existieren:

```ts
{
  id: "kampf-1",
  eventId: "smashtime-3-cagetime",
  reihenfolge: 1,
  fighterA: "Name A",
  fighterB: "Name B",
  gewichtsklasse: "Middleweight",
  kampfart: "K1",
  label: "Main Event",
  sichtbar: true
}
```

Keine `FIGHTER NAME` Platzhalter sichtbar auf der finalen Website.  
Wenn echte Fightcard-Daten fehlen, soll die Website zeigen:

```text
Fightcard wird bald veröffentlicht.
```

---

## 14. Seitenvorgaben

### Startseite

Muss enthalten:
- Header mit Logo
- deutsche Navigation
- Hero im Stil der Referenz
- Headline: `SMASH TIME. ECHTE ACTION.` oder ähnlich
- Button `Mehr erfahren`
- nächstes Event prominent
- Countdown-Komponente
- Eventdaten korrekt
- Disziplinen: MMA, K1, Xtreme Boxen, Boxen
- Bereich `Was dich erwartet`
- News-Vorschau
- Partner-/Sponsorenstreifen
- CTA `Bereit für SmashTime?`
- Footer

Keine Champion-Portraits auf der Startseite, außer später ausdrücklich dynamisch freigegeben. In Phase 1 keine Championbilder auf der Startseite.

### Champions

Muss enthalten:
- Hero nach Referenz
- Filter-/Gewichtsklassen-Leiste
- 4 Champion-Karten aus lokalen Daten
- finale Champion-Bilder aus `Champions Bilder/`
- Button `Profil ansehen`

Keine Fake-Champion-Namen aus Referenzbildern übernehmen.

### Champion-Profil

Muss enthalten:
- Profil-Template im Stil der Referenz
- echte Daten aus `src/data/champions.ts`
- ein Champion-Bild passend zur Person
- Stats
- Kurzbiografie
- Titel-/Gürtelbereich
- keine fake Namen wie `Maximilian Köhler`, wenn echte Daten vorhanden sind

Wenn Daten fehlen, kurze deutsche Platzhaltertexte verwenden, aber keine Lorem-Ipsum-Texte.

### Neuigkeiten

Muss enthalten:
- Hero nach Referenz
- Featured-News-Karte
- News-Grid
- Bilder aus passenden Assets
- deutsche News-Titel
- keine englischen Platzhalter

### Veranstaltungen

Muss enthalten:
- Hero nach Referenz
- großes Event-Modul für SmashTime 3 / Cagetime
- korrekte Eventdaten
- Countdown
- Disziplinen korrekt
- Karten für vergangene/weitere Events dürfen Dummy-Daten haben, aber keine falschen real wirkenden Orte übernehmen

### Sponsoren

Muss enthalten:
- Hero nach Referenz
- Partner-/Logo-Bereich
- Vorteile für Sponsoren
- Sponsorenpakete als Dummy-Daten
- CTA `Sponsor werden`

Sponsorlogos in Referenzen können in Phase 1 als Dummy-/Platzhalterlogos umgesetzt werden. Später müssen echte Sponsorlogos verwaltbar sein.

### Kontakt

Muss enthalten:
- Hero mit Backstage-/Arena-Hintergrund
- Kontaktformular mit deutschen Labels
- Anfragearten: Sponsoring, Presse, Kämpfer, Allgemein
- Eventinfos korrekt
- keine erfundene E-Mail, wenn keine echte E-Mail angegeben ist; dann `kontakt@smashtime.at` nur als Platzhalter markieren oder neutral halten

---

## 15. Mobile-Regeln

Auch wenn aktuell keine fertigen Mobile-Referenzbilder vorhanden sind, muss Mobile professionell umgesetzt werden.

Mobile Pflicht:
- Burger-Menü
- Logo gut sichtbar
- keine horizontale Scrollbar
- Hero lesbar
- Eventkarte untereinander gestapelt
- Countdown kompakt
- Karten sauber gestapelt
- Buttons groß genug
- Formulare gut bedienbar
- Bilder nicht unkontrolliert abgeschnitten
- Footer sauber

Mindestens testen:
- 390 px Breite
- 430 px Breite
- 768 px Breite
- Desktop ab 1280 px

---

## 16. Technische Umsetzung

Empfohlen:
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Komponentenstruktur in `src/components/`
- Daten in `src/data/`
- Bilder in `public/images/`

Die Umsetzung soll klar, wartbar und später backendfähig sein.

Keine riesigen unübersichtlichen Einzeldateien.  
Wiederkehrende UI-Elemente müssen Komponenten sein.

Empfohlene Komponenten:

```text
Header
Footer
PageHero
SectionTitle
CTAButton
EventHighlight
Countdown
NewsCard
ChampionCard
ChampionProfile
SponsorStrip
SponsorPackageCard
ContactForm
FightCardList
```

---

## 17. Sicherheit und Umgebungsvariablen

Im Projekt kann eine Datei mit Supabase-Zugangsdaten vorhanden sein.

Wichtig:
- Geheimnisse niemals ausgeben
- keine Keys in Code einbauen
- keine Keys in Screenshots/Logs ausgeben
- `.env`, `.env.local`, `.env.*.local` in `.gitignore` aufnehmen
- `env supabase.txt` nicht committen
- Supabase in Phase 1 nicht verwenden

Wenn eine `env supabase.txt` vorhanden ist, darf Codex sie in `.env.local` umbenennen oder eine `.env.local` daraus erstellen, aber niemals den Inhalt anzeigen. Für Phase 1 ist Supabase nicht nötig.

---

## 18. Qualitätskontrolle

Codex muss nach der Umsetzung prüfen:

- Build läuft ohne Fehler
- Lint läuft ohne Fehler oder mit dokumentierten Ausnahmen
- alle Seiten erreichbar
- Navigation funktioniert
- keine englischen sichtbaren Texte außer Markenbegriffe wie `SmashTime`
- keine Lorem-Ipsum-Texte
- keine falschen Eventdaten
- keine Fake-Kämpfernamen auf Champion-Seiten
- keine statische Fightcard als Bild
- keine Championbilder außerhalb Champions/Profil
- keine fehlenden Bilder
- keine kaputten Links
- keine horizontale Scrollbar auf Mobile
- Desktop sieht wie Referenz aus
- Mobile sieht eigenständig sauber aus

---

## 19. Fertig ist Phase 1 erst, wenn

- alle 7 öffentlichen Seiten existieren
- alle Seiten deutsch sind
- Desktop und Mobile professionell umgesetzt sind
- die Desktop-Referenzen visuell klar erkennbar nachgebaut wurden
- alle Bildassets sinnvoll kopiert und verwendet werden
- Championbilder korrekt und nur an erlaubten Stellen verwendet werden
- die Fightcard nicht als statisches Bild umgesetzt wurde
- Eventdaten korrekt sind
- lokale Datenstrukturen sauber vorbereitet sind
- Build/Lint geprüft wurden
- Codex am Ende die geänderten Dateien zusammenfasst

---

## 20. Grundregel

Optik wie Referenz, aber technisch sauber als echte Website.  
Keine statischen Screenshots.  
Keine harten Fake-Daten.  
Keine Abkürzungen, die später das Admin-Dashboard erschweren.

Lieber weniger Funktionen, aber dafür sauber, hochwertig und stabil.

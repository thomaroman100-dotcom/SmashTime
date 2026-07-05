# SmashTime Website – Finales Design-Briefing für Claude Code

## Ziel

Setze die öffentliche SmashTime-Website vollständig im Stil des gewählten Referenzbildes um.

Die Website soll aussehen wie eine echte Kampfsport-Promotion, die Events verkauft, Champions präsentiert, Fighter aufbaut und eine starke Marke transportiert.

Die visuelle Richtung ist:

```text
KEINE REGELN.
NUR RESPEKT.
SMASHTIME.
```

Die Seite soll nicht wie ein normales Webtemplate wirken, sondern wie eine Mischung aus:

- Fight-Night-Poster
- MMA Event-Plattform
- Underground-Kampfsport-Magazin
- Premium-Ticketseite
- dunklem Sport-Branding
- rauem Event-Flyer
- moderner Web-App mit klarer Bedienbarkeit

Wichtig:

Die Optik darf rau, wild, laut und grungy sein.  
Die Umsetzung muss aber sauber, responsive, logisch, performant und professionell sein.

---

# 1. Absolute Designrichtung

Das komplette öffentliche Frontend muss sich optisch am Referenzbild orientieren.

## Wirkung

Die Website soll sofort vermitteln:

- Kampf
- Respekt
- Bühne
- Spannung
- Event-Nacht
- Underground-Atmosphäre
- Premium-Kampfsport
- Ticket-Verkauf
- echte Fighter
- starke Marke

## Was vermieden werden muss

Nicht verwenden:

- helles Standard-Webdesign
- SaaS-Optik
- Bootstrap-Look
- runde, weiche Business-Cards
- zu glatte Flächen
- freundliche Fitnessstudio-Optik
- generische Stock-Website-Optik
- linkes Seitenmenü
- vertikale Desktop-Navigation
- zufällige Farben
- blaue Akzente
- grüne Akzente
- zu viel Weißfläche
- langweilige Standard-Sektionen

## Was zwingend rein muss

Verwenden:

- schwarzer Grunge-Hintergrund
- große raue Typografie
- rote Brush-Schrift-Akzente
- Goldlinien und Gold-Borders
- harte Section-Trenner
- Fight-Poster-Optik
- angerissene Papierkanten
- dunkle Vignetten
- rote Kratzer und Scratch-Linien
- schmutziges Off-White bei großen Headlines
- Event-Poster-Elemente
- Champion-Cards mit Goldrahmen
- klare Ticket-CTAs
- sticky Top-Navigation
- funktionierendes Dropdown-Menü

---

# 2. Globale Farben

Verwende die vorhandene SmashTime-Farbwelt verbindlich.

```css
:root {
  --black: #050505;
  --dark-gray: #0B0B0D;
  --card-gray: #111113;
  --red: #D71920;
  --dark-red: #B80012;
  --gold: #C9A24A;

  --white: #FFFFFF;
  --light-gray: #D8D8D8;
  --medium-gray: #8A8A8A;

  --dirty-white: #E6DDCC;
  --paper-beige: #B99A61;

  --border-dark: rgba(255,255,255,0.08);
  --border-red: rgba(215,25,32,0.45);
  --border-gold: rgba(201,162,74,0.65);

  --panel-black: rgba(5,5,5,0.88);
  --panel-gray: rgba(17,17,19,0.92);
}
```

## Einsatz der Farben

Schwarz:

- Seitenhintergrund
- Header
- Footer
- dunkle Cards
- Overlay-Flächen

Rot:

- CTA Buttons
- aktive Navigation
- Brush-Schrift
- Scratch-Elemente
- Ticket-Links
- Hover-Zustände
- wichtige Labels

Gold:

- Champion-Cards
- Premium-Borders
- Ticket-Akzente
- Eventdaten
- kleine Icons
- Auszeichnungen
- Ranking-Highlights

Dirty White / Beige:

- große Poster-Headlines
- Papierkanten
- rauer Plakat-Look
- sekundäre CTA-Flächen

Grau:

- Fließtext
- Meta-Informationen
- Datum
- kleine Labels
- Footer-Links

---

# 3. Globale Typografie

Die Typografie ist ein Hauptbestandteil des Designs.

## Haupt-Headlines

Große Headlines sollen wirken wie gedruckte Fight-Poster.

Eigenschaften:

- uppercase
- extrem fett
- condensed
- rau oder distressed
- große Zeilenhöhe knapp gesetzt
- gebrochenes Weiß
- teilweise rote Brush-Wörter

Geeignete Fonts:

- Anton
- Bebas Neue
- Oswald
- Teko
- League Gothic
- Staatliches
- alternativ vorhandene Projektfonts, wenn sie ähnlich wirken

Beispiel:

```text
KEINE REGELN.
NUR RESPEKT.
SMASHTIME.
```

Dabei können die ersten zwei Zeilen in Off-White / Dirty White stehen und „SMASHTIME“ als roter Brush-Schriftzug oder roter aggressiver Display-Text erscheinen.

## Sekundäre Headlines

Für Sektionen:

```text
UNSERE CHAMPIONS
KOMMENDE EVENTS
TOP FIGHTER RANGLISTE
NEUIGKEITEN
ÜBER SMASHTIME
```

Eigenschaften:

- uppercase
- condensed
- klar lesbar
- weiß oder dirty-white
- kleine rote oder goldene Akzentlinie daneben

## Fließtext

- sauber lesbare Sans-Serif
- Farbe: `#D8D8D8` oder `#8A8A8A`
- genügend Zeilenhöhe
- nicht zu klein
- keine zu dünne Schrift

---

# 4. Globales Layout-System

## Container

Desktop:

```css
max-width: 1440px;
margin: 0 auto;
padding-left/right: 48px;
```

Tablet:

```css
padding-left/right: 32px;
```

Mobile:

```css
padding-left/right: 18px;
```

## Seitenhintergrund

Der Body bekommt:

- Basisfarbe `#050505`
- dezente Körnung
- rote Scratch-Texturen
- dunkle Vignette
- optional sehr dezente diagonale Linien

Der Hintergrund darf niemals flach wirken.

## Section-System

Alle Sektionen sollen wie Poster-Module wirken:

- harte horizontale Blöcke
- dünne Borders
- Grunge-Kanten
- rote oder goldene Akzentlinien
- dunkle Bild-Overlays
- klare Einteilung trotz rauem Look

---

# 5. Header / Navigation

## Desktop-Aufbau

Der Header ist oben horizontal.

Links:

- SmashTime Logo

Mitte:

- Startseite
- Champions
- Neuigkeiten
- Über uns
- Mehr ▼

Rechts:

- Login
- Tickets

## Wichtige Regeln

- Kein linkes Seitenmenü
- Keine Sidebar
- Keine vertikale Desktop-Navigation
- Der Header bleibt horizontal oben
- Header darf die Hero-Optik nicht zerstören
- Header soll sticky sein
- Header bekommt dunklen Hintergrund
- Header bekommt unten eine dezente Border
- Aktiver Menüpunkt bekommt eine rote Unterlinie
- Hover-Zustand: rote Unterlinie oder rote Schrift

## Desktop Header Style

```css
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(5,5,5,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
```

## Navigationseinträge

Aktiv:

- rote Unterlinie
- weißer Text
- leichte rote Glow-Kante, aber nicht übertrieben

Hover:

- Text rot
- Unterlinie animiert von links nach rechts

## Dropdown-Menü „Mehr“

Der Punkt „Mehr ▼“ öffnet ein Dropdown.

Dropdown-Inhalt:

- Ranglisten
- Events
- Kämpfer
- Partner
- Merch
- Karriere
- FAQ
- Kontakt

Falls einzelne Seiten im Projekt bereits existieren, alle vorhandenen öffentlichen Seiten hier sauber aufnehmen.

### Dropdown-Design

Das Dropdown soll wirken wie ein roter Fight-Poster-Fetzen.

Eigenschaften:

- Hintergrund dunkles Rot oder SmashTime-Rot
- kantige Form
- keine runden Ecken
- leichte Grunge-Textur
- weiße Schrift
- kleine Icons optional
- Hover dunkler oder schwarzer Streifen
- sitzt direkt unter „Mehr“
- dezenter Schatten
- klare Klickflächen

Beispiel CSS-Idee:

```css
.dropdown {
  background: linear-gradient(180deg, #D71920, #8f000c);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 18px 45px rgba(0,0,0,0.55);
  clip-path: polygon(0 0, 100% 0, 96% 100%, 4% 100%);
}
```

## Login

Login ist ein schlichter Textlink oder kleiner Outline-Button.

- Nicht so dominant wie Tickets
- weiß / hellgrau
- Hover rot
- führt zu `/login`

## Tickets Button

Der Tickets Button ist der wichtigste Header-CTA.

Eigenschaften:

- roter Hintergrund
- kantig
- Grunge-Kante
- weiße Schrift
- uppercase
- Hover dunkler Rotton
- optional kleiner Pfeil oder Ticket-Icon

---

# 6. Mobile Navigation

Auf Mobile:

- Logo links
- Burger rechts
- kein permanentes Seitenmenü
- kein linkes Desktop-Menü
- Navigation öffnet als Fullscreen-Menü oder Slide-Down von oben

## Mobile Reihenfolge

1. Startseite
2. Champions
3. Neuigkeiten
4. Über uns
5. Events
6. Kämpfer
7. Ranglisten
8. Partner
9. Merch
10. Karriere
11. FAQ
12. Kontakt
13. Login
14. Tickets sichern

## Mobile Dropdown

„Mehr“ wird auf Mobile zu einem aufklappbaren Bereich.

- Klick auf „Mehr“ zeigt Unterpunkte
- Unterpunkte eingerückt
- klare Touch-Flächen
- Tickets Button am Ende groß und rot
- keine abgeschnittenen Menüpunkte

---

# 7. Startseite – kompletter Aufbau

Die Startseite ist das Herz der Website.

## Reihenfolge

1. Header
2. Hero
3. Countdown
4. Main-Fight-Banner
5. Champions
6. Über SmashTime
7. Kommende Events
8. Top Fighter Rangliste
9. Neuigkeiten
10. Ticket CTA
11. Footer

---

# 8. Hero der Startseite

## Hauptoptik

Der Hero soll fast wie ein großes Eventposter wirken.

Links:

```text
KEINE REGELN.
NUR RESPEKT.
SMASHTIME.
```

Darunter:

```text
KÄMPFE. EHRE. VERMÄCHTNIS.
```

Rechts:

```text
19 REBELLION
22. JUNI 2025
O₂ ARENA BERLIN
```

Im Hintergrund:

- Schwarzweiß-Kampfaufnahme
- ein Fighter im Schlagmoment
- dunkle Arena
- rote Kratzer
- rote Farbspritzer
- Vignette
- leichte Körnung
- Poster-Textur

## Hero-Funktionen

Buttons:

- Tickets sichern
- Event Details

Der Haupt-CTA führt zur Ticketseite.  
Der zweite CTA führt zur Event-Detailseite des nächsten Events.

## Hero-Qualität

- Text muss immer lesbar bleiben
- Hintergrund darf nie zu hell sein
- keine Gesichter direkt hinter Text ohne Overlay
- bei Mobile wird Hero gestapelt
- Eventposter rechts wird auf Mobile unter der Headline angezeigt

---

# 9. Countdown-Modul

Das Countdown-Modul sitzt direkt unter dem Hero.

Inhalt:

```text
NÄCHSTES EVENT IN
24 TAGE | 08 STUNDEN | 45 MINUTEN | 12 SEKUNDEN
TICKETS SICHERN
```

## Funktionen

- Countdown läuft live herunter
- Daten kommen aus dem nächsten Event
- Wenn Event vorbei ist, automatisch nächstes Event laden
- Wenn kein Event vorhanden ist, fallback anzeigen:

```text
NÄCHSTES EVENT WIRD BALD BEKANNTGEGEBEN
```

## Design

- dunkler Balken
- harte Kanten
- rote Trennlinien
- Zahlen groß
- Labels klein
- CTA rechts
- auf Mobile 2x2 Grid für Zahlen

---

# 10. Main-Fight-Banner

Der Main-Fight-Banner ist ein breiter horizontaler Block.

## Inhalt

```text
WELTERWEIGHT TITLE FIGHT
KHALIDOV VS MARTINEZ
22. JUNI 2025 | O₂ ARENA, BERLIN
```

Links und rechts jeweils Fighter-Portraits.  
Die Fighter schauen einander an.

## Button

```text
EVENT DETAILS
```

## Funktion

- Banner klickbar
- Button klickbar
- führt zur Event-Detailseite
- später dynamisch aus Event/Fightcard-Daten

## Design

- goldene Border
- dunkle Textur
- rotes „VS“
- starke Vignette
- Fighter schwarzweiß oder sehr dunkel
- keine hellen Bildflächen

---

# 11. Champions-Bereich

## Inhalt

Titel:

```text
UNSERE CHAMPIONS
```

Button:

```text
ALLE ANSEHEN
```

Champion Cards:

- Fighter Bild
- kleines Kronen-Icon
- Name
- Gewichtsklasse
- optional Record
- optional Land/Flagge
- Gold-Border
- dunkler Hintergrund

## Beispiel

```text
ADRIAN KHALIDOV
WELTERWEIGHT
```

## Funktion

- jede Card führt zum Fighter-Profil
- Button führt zu `/champions`
- Cards können dynamisch aus Datenquelle geladen werden

## Hover

- Card hebt sich minimal
- Gold-Border wird stärker
- Bild zoomt minimal
- roter Akzent erscheint unten

---

# 12. Über-SmashTime-Bereich

## Inhalt

```text
ÜBER SMASHTIME
SmashTime ist mehr als ein Kampf.
Wir sind eine Bewegung. Eine globale Bühne für die besten Kämpfer der Welt.
Echte Duelle. Echte Emotionen. Echte Legenden.
```

Zusätzlich als visueller Brush-Spruch:

```text
BORN TO FIGHT.
BUILT TO LAST.
```

## Layout

- links Cage/Arena-Bild
- rechts Text
- weiterer rechter Akzent mit Brush-Spruch
- dunkler Block mit roten Scratch-Details

## Funktion

- Button „Mehr erfahren“
- Link zu `/about`

---

# 13. Kommende Events

## Inhalt

```text
KOMMENDE EVENTS
```

Event-Liste:

```text
22 JUN
SMASHTIME 19: REBELLION
O₂ ARENA, BERLIN
Tickets >
```

```text
16 AUG
SMASHTIME 20: UPRISING
HAMBURG, BARCLAYS ARENA
Tickets >
```

```text
27 SEP
SMASHTIME 21: DOMINION
KÖLN, LANXESS ARENA
Tickets >
```

## Funktion

- jeder Event klickbar
- Ticket-Link führt zu Ticketseite
- „Alle Events ansehen“ führt zu `/events`
- nur kommende Events anzeigen
- chronologisch sortieren

## Design

- rotes Datumsfeld
- dunkle Listenzeile
- Eventname weiß
- Location gold
- Ticket-Link rot
- dünne Borders

---

# 14. Top Fighter Rangliste

## Inhalt

```text
TOP FIGHTER RANGLISTE
```

Darstellung:

- Platz 01 bis 05
- Fighter Bild
- Name
- Gewichtsklasse
- optional Record

## Funktion

- jeder Fighter klickbar
- Link zu Fighter-Profil
- Button „Gesamte Rangliste ansehen“
- Link zu `/rankings`

## Design

- kompakte Champion-/Ranking-Karten
- Gold für Platznummern oder Namen
- rote Akzentlinie
- dunkler Hintergrund
- wirkt wie ein Fightcard-Ranking-Board

---

# 15. Neuigkeiten

## Inhalt

```text
NEUIGKEITEN
```

News-Liste:

- Kategorie
- Thumbnail
- Titel
- Datum
- Link

Beispiele:

```text
INTERVIEW
KHALIDOV: „ICH BIN NOCH NICHT FERTIG.“
```

```text
EVENT
SMASHTIME 19: REBELLION ALLE INFOS ZUM EVENT
```

```text
HINTERGRUND
DIE EVOLUTION DES MODERNEN FIGHTINGS
```

## Funktion

- News klickbar
- Link zur News-Detailseite
- Button „Alle News ansehen“
- Link zu `/news`

## Design

- kompakt
- Magazin-Stil
- kleine Thumbnails
- rote Kategorie
- Titel weiß
- Datum grau

---

# 16. Großer Ticket-CTA

Vor dem Footer ein breiter CTA-Banner.

## Inhalt

```text
SEI DABEI. ERLEBE GESCHICHTE.
SICHERE DIR JETZT DEIN TICKET FÜR DAS NÄCHSTE EVENT.
```

Button:

```text
TICKETS SICHERN
```

## Design

- roter Grunge-Balken
- dunkle Publikumssilhouetten
- Kratzer
- Text groß und dominant
- Button beige/gold oder rot
- sehr verkaufsstark

## Funktion

- Link zur Ticketseite
- auf Mobile kompakter Text

---

# 17. Footer

## Aufbau

Links:

- SmashTime Logo
- kurzer Claim

Spalten:

```text
SMASHTIME
Über uns
Karriere
Partner
Kontakt
```

```text
SERVICE
FAQ
Tickets
Ranglisten
Athleten
```

```text
RECHTLICHES
AGB
Datenschutz
Impressum
```

```text
FOLGE UNS
Instagram
YouTube
TikTok
X
Facebook
```

Newsletter:

- E-Mail-Feld
- Senden-Button

## Funktion

- Newsletter Validierung
- Erfolgsmeldung
- Fehlermeldung
- alle Links korrekt verdrahten
- Social Icons klickbar machen

---

# 18. Alle öffentlichen Seiten im selben Design anpassen

Nicht nur die Startseite umsetzen.  
Alle vorhandenen öffentlichen Seiten und Unterseiten müssen im selben SmashTime-Design überarbeitet werden.

Das bedeutet:

- Header überall identisch
- Footer überall identisch
- Farben überall identisch
- Buttons überall identisch
- Cards überall identisch
- Grunge-/Poster-Stil überall konsistent
- keine Seite darf wie ein altes Template aussehen
- keine Unterseite darf optisch aus der Marke fallen

---

# 19. Öffentliche Seitenstruktur

Passe mindestens diese öffentlichen Seiten an, sofern sie im Projekt existieren oder geplant sind:

```text
/
Startseite

/events
Eventübersicht

/events/[slug]
Event-Detailseite

/fighters
Kämpferübersicht

/fighters/[slug]
Fighter-Profil

/champions
Champions

/rankings
Ranglisten

/news
Neuigkeiten

/news/[slug]
News-Detailseite

/about
Über uns

/contact
Kontakt

/tickets
Tickets

/login
Login

/register
Registrierung, falls vorhanden

/media
Medien / Galerie, falls vorhanden

/shop
Merch / Shop, falls vorhanden

/partners
Partner, falls vorhanden

/career
Karriere, falls vorhanden

/faq
FAQ

/legal/impressum
Impressum

/legal/datenschutz
Datenschutz

/legal/agb
AGB, falls vorhanden
```

---

# 20. Eventübersicht `/events`

## Ziel

Die Eventübersicht soll wie ein Fight-Night-Archiv wirken.

## Aufbau

- Page-Hero mit Titel „EVENTS“
- kurzer Untertitel
- Tabs:
  - Kommende Events
  - Vergangene Events
- Event-Cards im Poster-Stil
- Filter nach Jahr, Ort, Status
- Ticket-CTA
- Event-Archiv

## Card-Inhalt

- Eventnummer
- Eventname
- Datum
- Location
- Main Event
- Status:
  - Tickets verfügbar
  - Ausverkauft
  - Vergangen
- Button:
  - Tickets
  - Details

## Design

- Event-Poster-Cards
- rote und goldene Akzente
- dunkle Bilder
- Grunge-Ränder
- kein normales Kartenraster

---

# 21. Event-Detailseite `/events/[slug]`

## Ziel

Jedes Event soll wie eine eigene Fight-Night-Landingpage wirken.

## Aufbau

- großer Event-Hero
- Eventname
- Datum
- Location
- Countdown
- Ticket-CTA
- Main Event
- Co-Main Event
- Fightcard
- Zeitplan
- Venue-Informationen
- Anfahrt
- FAQ
- ähnliche Events

## Fightcard

Darstellung:

- Main Event groß
- Co-Main Event mittel
- Undercard als Liste
- Fighter gegenüberstellen
- Gewichtsklasse
- Records
- Status des Kampfes

## Funktionen

- Ticket-Link
- Eventdetails
- Social Share
- ggf. „Zum Kalender hinzufügen“
- dynamische Daten aus Admin/CMS vorbereiten

---

# 22. Kämpferübersicht `/fighters`

## Ziel

Die Kämpferseite soll wie ein Roster einer echten Liga wirken.

## Aufbau

- Page-Hero „KÄMPFER“
- Suche
- Filter:
  - Gewichtsklasse
  - Land
  - Status
  - Champion
- Fighter-Grid
- Featured Fighter
- Pagination oder Load More

## Fighter-Card

- Bild
- Name
- Gewichtsklasse
- Record
- Land/Flagge
- Champion-Badge, falls Champion
- Klick zum Profil

## Design

- dunkle Fighter-Cards
- Goldrahmen bei Champions
- rote Akzente
- Bild stark und kontrastreich
- keine hellen Profilkarten

---

# 23. Fighter-Profil `/fighters/[slug]`

## Ziel

Ein Fighter-Profil muss wie eine Premium-Athletenseite wirken.

## Aufbau

- Fighter-Hero
- großes Fighter-Bild
- Name
- Nickname
- Gewichtsklasse
- Record
- Land
- Champion-Status
- Statistiken:
  - Wins
  - Losses
  - Draws
  - KOs
  - Submissions
  - Alter
  - Größe
  - Gewicht
  - Reichweite
- Bio
- letzte Kämpfe
- kommende Kämpfe
- News zum Fighter
- Social Links

## Design

- Hero mit dunkler Arena
- Fighter prominent
- Gold bei Champion
- rote Akzente bei Rekord und Kämpfen
- Statistik-Cards im Poster-Stil

---

# 24. Champions-Seite `/champions`

## Ziel

Champions müssen maximal hochwertig wirken.

## Aufbau

- Page-Hero „CHAMPIONS“
- alle aktuellen Champions
- Gewichtsklassen
- Champion-Cards groß
- Titelhistorie optional
- ehemalige Champions optional

## Design

- Gold stärker einsetzen
- Champion-Gürtel-Optik
- dunkle Premium-Bühne
- roter SmashTime-Akzent
- Cards dürfen edler wirken als normale Fighter-Cards

---

# 25. Ranglisten `/rankings`

## Ziel

Ranglisten sollen wie professionelle Fight-League-Rankings wirken.

## Aufbau

- Page-Hero „RANGLISTEN“
- Tabs nach Gewichtsklassen
- Champion oben hervorgehoben
- Ranking 1 bis 15
- Fighter klickbar
- Veränderung:
  - aufgestiegen
  - gefallen
  - unverändert

## Design

- Tabelle nicht wie Standard-Tabelle
- dunkle Ranking-Zeilen
- rote Linien
- Gold für Champion und Platz 1
- Mobile als Cards darstellen

---

# 26. Neuigkeiten `/news`

## Ziel

News-Seite soll wie ein Kampfsport-Magazin wirken.

## Aufbau

- Page-Hero „NEUIGKEITEN“
- Featured Article groß
- Kategorien:
  - Events
  - Interviews
  - Fighter
  - Behind the Scenes
  - Rankings
- News Grid
- Suche
- Pagination

## Design

- Magazin-Look
- dunkle Artikelkarten
- rote Kategorie-Badges
- große kontrastreiche Bilder
- keine Standard-Blogoptik

---

# 27. News-Detailseite `/news/[slug]`

## Ziel

Einzelne News müssen lesbar, aber markengerecht sein.

## Aufbau

- Artikel-Hero
- Kategorie
- Datum
- Titel
- Autor optional
- großes Titelbild
- Artikelinhalt
- Zitate / Highlights
- verwandte Artikel
- Share Buttons

## Design

- starke Headline
- Textbereich ruhig und lesbar
- dunkler Hintergrund
- rote Zwischenüberschriften
- goldene Zitatlinie
- kein weißer Blogartikel

---

# 28. Über uns `/about`

## Ziel

Die Marke SmashTime erklären.

## Aufbau

- Page-Hero „ÜBER SMASHTIME“
- Mission
- Vision
- Werte
- Geschichte
- Community
- Warum SmashTime anders ist
- CTA zu Events oder Tickets

## Texte sollen transportieren

- Respekt
- Disziplin
- Kampfgeist
- echte Geschichten
- Bühne für Fighter
- Verbindung zwischen Athleten und Fans

## Design

- Arena-Bilder
- Fighter-Backstage-Bilder
- dunkle Textblöcke
- rote Brush-Sprüche
- Gold-Icons für Werte

---

# 29. Kontakt `/contact`

## Ziel

Kontaktseite im selben Stil, aber übersichtlich.

## Aufbau

- Page-Hero „KONTAKT“
- Kontaktformular
- E-Mail
- Social Links
- Adresse optional
- Anfrage-Kategorien:
  - Allgemein
  - Fighter-Bewerbung
  - Sponsoring
  - Presse
  - Tickets
- FAQ Teaser

## Design

- dunkle Formularfelder
- rote Focus-States
- Gold-Akzente
- keine weißen Inputs
- klare Fehlermeldungen

---

# 30. Tickets `/tickets`

## Ziel

Ticketseite als Conversion-Seite.

## Aufbau

- Page-Hero „TICKETS“
- nächstes Event prominent
- Ticketkategorien:
  - Standard
  - Ringside
  - VIP
  - Backstage / Meet & Greet, falls geplant
- Preisfelder
- Vorteile
- FAQ
- CTA
- Hinweis zur Verfügbarkeit

## Design

- Ticketkarten wie echte Eventtickets
- rote CTA-Buttons
- Gold für VIP
- Countdown
- Eventbild
- klare Kaufentscheidung

---

# 31. Login `/login`

## Ziel

Login soll ins Design passen und nicht wie ein Standardformular aussehen.

## Aufbau

- dunkle Login-Card
- SmashTime Logo
- E-Mail
- Passwort
- Login Button
- Passwort vergessen
- Registrierung, falls vorhanden

## Design

- keine weiße Login-Seite
- dunkle Card
- rote Buttons
- goldene kleine Akzente
- klare Fehlermeldungen

---

# 32. Rechtliche Seiten

## Seiten

- Impressum
- Datenschutz
- AGB, falls vorhanden

## Ziel

Rechtliche Seiten müssen ruhiger sein, aber trotzdem zur Marke passen.

## Design

- dunkler Hintergrund
- lesbarer Text
- klare Abschnitte
- keine übermäßigen Grunge-Elemente im Textbereich
- Header und Footer identisch
- ausreichend Kontrast

---

# 33. Globale Komponenten

Erstelle oder überarbeite globale Komponenten:

## Header

- Desktop Navigation
- Dropdown
- Mobile Burger
- Login
- Tickets

## Footer

- Links
- Newsletter
- Socials
- rechtliche Links

## Buttons

Varianten:

### Primary

- rot
- weißer Text
- kantig
- grungy

### Secondary

- transparent
- rote Border
- weißer Text

### Premium

- gold/beige
- schwarzer Text
- für VIP, Champion, Tickets

### Text Link

- rot oder gold
- kleiner Pfeil

## Cards

Varianten:

- EventCard
- FighterCard
- ChampionCard
- NewsCard
- RankingCard
- StatCard
- TicketCard

## Badges

- Champion
- Main Event
- Co-Main Event
- Sold Out
- Tickets Available
- New
- Interview
- Event
- Behind the Scenes

---

# 34. Bildsprache

## Erlaubte Bildstile

- Cage / Arena
- Fighter in Schwarzweiß
- Fighter im Schlagmoment
- Rückenansicht vor Käfig
- Publikum im dunklen Licht
- rote Arena-Lichter
- Champion-Gürtel
- Backstage
- Training
- Faceoff

## Nicht verwenden

- helle Fitnessstudio-Bilder
- Lifestyle-Sportfotos
- freundliche Wellnessbilder
- zu saubere Stockfotos
- bunte Hintergründe
- helle Hallenbilder ohne Atmosphäre

## Bildbehandlung

Alle Bilder bekommen:

- dunkles Overlay
- Vignette
- leichte Körnung
- rote Akzente
- manchmal Schwarzweiß-Look
- keine Überbelichtung
- Texte dürfen nie auf unruhigem Bild ohne Overlay liegen

---

# 35. Animationen und Interaktionen

Animationen sollen hochwertig, aber nicht verspielt sein.

## Erlaubt

- dezente Hover-Zooms auf Cards
- rote Linien animieren
- Dropdown smooth öffnen
- Countdown live aktualisieren
- Button Hover mit dunklem Rot
- Card-Hover mit Gold-Border
- kleine Reveal-Animationen beim Scrollen

## Nicht erlaubt

- bunte Animationen
- verspielt springende Elemente
- zu starke Glows
- billige Neon-Effekte
- zu langsame Animationen
- Layout-Shifts

---

# 36. Technische Anforderungen

## Allgemein

- bestehende Projektstruktur respektieren
- keine unnötigen Komplett-Neuschreibungen, wenn Komponenten existieren
- wiederverwendbare Komponenten erstellen
- CSS sauber strukturieren
- keine Inline-Stil-Orgie
- keine toten Links
- keine Console Errors
- keine TypeScript Errors
- keine Build-Fehler
- keine horizontalen Scrollfehler

## Performance

- Bilder optimieren
- Lazy Loading für Bilder unterhalb des Folds
- Hero-Bild priorisieren
- keine riesigen unnötigen Assets
- Animationen performant halten
- Layout Shift vermeiden

## Accessibility

- Buttons als echte Buttons oder Links
- Fokus-Stil sichtbar
- ausreichender Kontrast
- Formularlabels vorhanden
- Dropdown per Tastatur bedienbar
- Mobile Menü per ESC oder Close-Button schließbar
- Alt-Texte für Bilder

---

# 37. Datenmodell-Vorbereitung

Falls noch keine echte Datenbank angebunden ist, mit klaren Mock-Daten arbeiten, aber so strukturieren, dass spätere Admin-Daten leicht einsetzbar sind.

## Events

```ts
type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  number?: number;
  date: string;
  location: string;
  venue: string;
  city: string;
  country?: string;
  posterImage: string;
  heroImage: string;
  status: "upcoming" | "past" | "sold-out";
  ticketUrl?: string;
  mainFight?: Fight;
  fights?: Fight[];
};
```

## Fighter

```ts
type Fighter = {
  id: string;
  slug: string;
  name: string;
  nickname?: string;
  image: string;
  weightClass: string;
  record: string;
  country?: string;
  flag?: string;
  isChampion?: boolean;
  championTitle?: string;
  stats?: FighterStats;
};
```

## News

```ts
type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  category: "Event" | "Interview" | "Fighter" | "Behind the Scenes" | "Ranking";
  date: string;
  excerpt: string;
  image: string;
  content?: string;
};
```

---

# 38. Responsive Breakpoints

Nutze saubere Breakpoints.

```css
mobile: 0 - 767px
tablet: 768px - 1023px
desktop: 1024px - 1439px
wide: 1440px+
```

## Desktop

- breite Poster-Optik
- Header vollständig
- Hero zweispaltig
- Champions horizontal
- untere Module dreispaltig

## Tablet

- Header kompakter
- Cards 2-spaltig
- untere Module 2-spaltig
- Hero weiterhin stark, aber weniger hoch

## Mobile

- Burger-Menü
- Hero gestapelt
- Countdown 2x2
- Main-Fight als vertikale Card
- Champions horizontal scrollend oder 1-Spalte
- Events, Ranking, News untereinander
- CTA kompakt
- Footer gestapelt

---

# 39. Mobile Qualitätsregeln

Mobile ist nicht einfach eine gequetschte Desktop-Version.

## Mobile Hero

Reihenfolge:

1. Headline
2. Untertitel
3. Eventposter
4. Countdown
5. Tickets Button
6. Event Details Button

## Mobile Cards

- Mindesthöhe sinnvoll
- Text nicht abschneiden
- Bilder nicht verzerren
- Buttons groß genug
- horizontaler Scroll nur dort, wo bewusst gewollt

## Mobile Menü

- kein permanentes Seitenmenü
- Fullscreen oder Slide-Down
- klare Touch-Flächen
- Dropdown als Accordion
- Login und Tickets sichtbar

---

# 40. Akzeptanzkriterien

Am Ende muss geprüft werden:

## Design

- Startseite entspricht der Referenzrichtung
- alle öffentlichen Seiten sehen konsistent aus
- keine alte Template-Optik mehr sichtbar
- keine Sidebar auf Desktop
- keine hellen Standardbereiche
- keine zufälligen Farben
- Grunge-Look ist vorhanden, aber kontrolliert

## Navigation

- Header oben horizontal
- Dropdown funktioniert
- Login vorhanden
- Tickets vorhanden
- Mobile Burger funktioniert
- alle Links führen korrekt

## Funktion

- Countdown funktioniert
- Eventlinks funktionieren
- Fighterlinks funktionieren
- Newslinks funktionieren
- Newsletter validiert
- Ticket-CTAs führen zur richtigen Seite

## Responsive

- Desktop sauber
- Tablet sauber
- Mobile sauber
- keine horizontalen Scrollfehler
- keine überlappenden Elemente
- keine abgeschnittenen Texte

## Technik

- Build läuft
- keine TypeScript-Fehler
- keine Console Errors
- keine kaputten Imports
- keine toten Komponenten
- Performance bleibt gut

---

# 41. Arbeitsweise für Claude Code

Bitte arbeite in klaren Schritten.

## Schritt 1

Projektstruktur prüfen:

- Framework erkennen
- vorhandene Seiten erkennen
- vorhandene Komponenten erkennen
- vorhandenes Styling erkennen
- Routing prüfen
- Assets prüfen

## Schritt 2

Globale Designbasis setzen:

- Farben
- Fonts
- Layoutsystem
- Body-Hintergrund
- Texturen
- Buttons
- Cards
- Header
- Footer

## Schritt 3

Startseite umsetzen:

- Hero
- Countdown
- Main Fight
- Champions
- About
- Events
- Ranking
- News
- CTA

## Schritt 4

Alle öffentlichen Seiten anpassen:

- Events
- Event Detail
- Fighters
- Fighter Detail
- Champions
- Rankings
- News
- News Detail
- About
- Contact
- Tickets
- Login
- Legal Pages

## Schritt 5

Mobile/Responsive prüfen:

- Desktop
- Tablet
- Mobile
- Burger Menü
- Dropdown
- Cards
- Tabellen
- CTA

## Schritt 6

Qualitätsprüfung:

- Build
- Links
- Console
- Layout
- Responsiveness
- Design-Konsistenz

---

# 42. Finaler Auftrag

Setze nicht nur eine hübsche Startseite um.  
Setze eine komplette, konsistente öffentliche SmashTime-Website im Stil des Referenzbildes um.

Die Website soll wirken wie:

```text
Ein echtes Fight-Night-Poster,
das als professionelle Website lebendig geworden ist.
```

Zielqualität:

```text
10.000 € bis 20.000 € Website-Look
```

Die wichtigsten Punkte:

- oben horizontales Menü
- Dropdown-Menü „Mehr“
- Login sichtbar
- Tickets sichtbar
- keine Sidebar
- Startseite exakt Richtung Referenzbild
- alle öffentlichen Seiten im selben Design
- alle Unterseiten passend anpassen
- responsive sauber
- technisch stabil
- verkaufsstark
- markant
- professionell
- aggressiv
- kampfsportwürdig

Wenn eine bestehende Seite oder Komponente nicht zum neuen Design passt, überarbeite sie konsequent.  
Wenn eine Unterseite noch fehlt, lege sie als saubere, passende Seite an oder bereite sie strukturell vor.

Das Endergebnis muss so wirken, als wäre SmashTime eine reale Kampfsport-Organisation mit professioneller Eventproduktion, starken Champions, echter Fanbase und verkaufsfähigem Ticket-System.

# AGENTS.md - SmashTime Projektsteuerung

Diese Datei ist die verbindliche Arbeitsanweisung fuer Codex, Claude und jede KI-Unterstuetzung im Repository **SmashTime**.

Stand: 05. Juli 2026  
Geltungsbereich: gesamter Weg bis zur fertigen Website.

---

## 0. Source of Truth

Ab sofort gilt diese Reihenfolge:

1. `smashtime_claude_design_brief_final.md` - **finale Designrichtung und Zielzustand fuer das oeffentliche Frontend**.
2. `AGENTS.md` - verbindliche Arbeitsregeln, Sicherheitsregeln, Daten-/Inhaltsgrenzen und technische Leitplanken.
3. `ROADMAP.md` - laufender Ist-Stand und Backlog; muss dem neuen Designplan folgen.
4. `REFERENCE_IMAGES.md` - Bild-/Referenz-Zuordnung; alte Referenzscreens sind sekundär, wenn sie dem finalen Designbrief widersprechen.
5. `SECURITY_NOTES.md` - Supabase-/Secret-/Zugangsdaten-Regeln.
6. `CLAUDE.md` - Kurzfassung fuer KI-Werkzeuge.

Wenn alte Referenzbilder, alte Routenplaene oder Chat-Verlaeufe widersprechen, gilt der finale Designbrief plus diese Datei.

Alte Root-Archivdateien (`01_...`, `02_...`, `CODEX_PHASE...`, `CODEX_NAVIGATION...`) sind geloescht und duerfen nicht neu als Projektsteuerung angelegt werden. Historie gehoert in Git, nicht in neue widerspruechliche Markdown-Quellen im Root.

---

## 1. Projektziel

SmashTime soll wie eine echte Kampfsport-Promotion wirken:

```text
KEINE REGELN.
NUR RESPEKT.
SMASHTIME.
```

Die Website soll aussehen wie ein professionelles Fight-Night-Poster, das als Website lebendig geworden ist:

- MMA/Event-Plattform
- Underground-Kampfsport-Magazin
- Premium-Ticketseite
- dunkles Sport-Branding
- rauer Event-Flyer
- moderne, klare Web-App

Zielqualitaet: ein markanter, verkaufsstarker, professioneller Website-Look im Bereich einer hochwertigen Agenturarbeit.

---

## 2. Arbeitsgrundsatz

Arbeite sauber, kontrolliert und zielgerichtet.

- Vor jeder Aenderung `git status` pruefen.
- Bestehende Nutzer-/Agentenaenderungen respektieren, nichts Fremdes zuruecksetzen.
- Keine schnellen Workarounds, wenn eine saubere kleine Loesung moeglich ist.
- Keine neuen Libraries ohne klaren Nutzen.
- Keine sichtbaren Fake-Daten als echte Inhalte.
- Kein Code/Asset loeschen, wenn nicht eindeutig falsch, doppelt oder vom Nutzer gewuenscht.
- Bei widerspruechlichen alten Plaenen gilt der finale Designbrief.
- Root sauber halten: keine neuen Phase-/Codex-Archivdateien, temporären Screenshots, lokalen Logs, Buildinfos oder einmaligen Hilfsskripte einchecken.
- Jede Aenderung muss auf konkret gelesenen Projektdateien basieren, nicht auf Erinnerung oder Vermutung.

### 2.1 Arbeitsablauf pro Aufgabe

1. `git status --short --branch` ausfuehren und fremde Aenderungen respektieren.
2. Betroffene Quellen lesen: mindestens aktuelle Datenquelle, Route, Komponente und relevante Regeln aus `AGENTS.md`/`ROADMAP.md`.
3. Scope klein halten und nur Dateien aendern, die fuer die Aufgabe noetig sind.
4. Daten vor UI: vorhandene `src/data/*`-Quellen nutzen oder erweitern, keine verstreuten JSX-Fakten.
5. Nach neuen Links/Routen pruefen: keine Navigation, CTA oder Card darf auf 404 zeigen.
6. Nach relevanten Codeaenderungen `npm run lint` und `npm run build` ausfuehren.
7. Abschlussbericht immer mit `Geändert`, `Geprüft`, `Offen`.

---

## 3. Finaler Designauftrag

Das komplette oeffentliche Frontend muss in Richtung des finalen Designbriefs gebracht werden.

Pflichtwirkung:

- Kampf
- Respekt
- Event-Nacht
- Underground-Atmosphaere
- Premium-Kampfsport
- Ticket-Verkauf
- starke Marke
- echte Organisation statt Demo-Seite

Verboten:

- helles Standard-Webdesign
- SaaS-/Bootstrap-/Baukasten-Look
- runde, weiche Business-Cards
- linkes Desktop-Seitenmenue
- vertikale Desktop-Navigation
- zufaellige Farben
- blaue oder gruene Akzente
- zu viel Weissflaeche
- langweilige Standard-Sektionen

Pflicht:

- schwarzer Grunge-Hintergrund
- grosse raue Poster-Typografie
- rote Brush-Akzente
- Goldlinien und Gold-Borders
- harte Section-Trenner
- Fight-Poster-Optik
- angerissene Kanten / Scratch-Linien
- dunkle Vignetten
- klare Ticket-CTAs
- sticky horizontale Top-Navigation
- funktionierendes Dropdown "Mehr"

---

## 4. Farb- und Typografie-System

Verbindliche Farbwelt:

```css
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
```

Rot ist fuer CTAs, aktive Navigation, Brush-Schrift, Ticket-Links und wichtige Labels.  
Gold ist fuer Champion-Cards, Premium-Borders, Eventdaten, Ranking-Highlights und VIP-/Ticket-Akzente.  
Dirty White / Beige ist fuer grosse Poster-Headlines und Papier-/Plakatwirkung.

Typografie:

- grosse Headlines uppercase, condensed, extrem fett, knapp gesetzt
- Hauptlook: Fight-Poster, distressed/rough wenn moeglich
- geeignete Fonts: Anton, Bebas Neue, Oswald, Teko, League Gothic, Staatliches oder vorhandene aehnliche Projektfonts
- Fliesstext sauber lesbar, nie zu duenn, nie zu klein

---

## 5. Globale Layout-Regeln

Container:

```text
Desktop: max-width 1440px, padding 48px
Tablet: padding 32px
Mobile: padding 18px
```

Body:

- `#050505` als Basis
- Koernung, rote Scratch-Texturen, Vignette
- keine flachen schwarzen Flaechen ohne Tiefe

Sektionen:

- harte horizontale Poster-Module
- duenne Borders
- rote/goldene Akzentlinien
- dunkle Bild-Overlays
- keine dekorativen Karten-in-Karten-Konstruktionen

---

## 6. Header und Navigation

Der Header ist oben horizontal und sticky.

Desktop-Struktur:

```text
Logo links

Startseite
Champions
Neuigkeiten
Über uns
Mehr ▼

Login
Tickets
```

Regeln:

- Keine Sidebar auf Desktop.
- Kein linkes Seitenmenue.
- Aktiver Menuepunkt: rote Unterlinie.
- Hover: rote Schrift oder rote Unterlinie.
- Login ist dezent.
- Tickets ist der dominante rote CTA.
- Header nutzt dunklen Hintergrund, leichte Transparenz/Blur, duenne untere Border.

Dropdown "Mehr":

```text
Ranglisten
Events
Kämpfer
Partner
Merch
Karriere
FAQ
Kontakt
```

Nicht vorhandene Zielseiten duerfen sauber angelegt, vorbereitet oder voruebergehend auf sinnvolle vorhandene Seiten umgeleitet werden, solange keine 404 entsteht.

Mobile:

- Logo links, Burger rechts
- Fullscreen- oder Slide-Down-Menue
- "Mehr" als Accordion
- Tickets sichern am Ende gross und rot
- Touch-Ziele ausreichend gross

---

## 7. Oeffentliche Zielseiten und Routen

Der finale Designbrief definiert diese Zielstruktur:

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

Bestehende deutsche Legacy-Routen duerfen waehrend der Migration bestehen bleiben:

```text
/neuigkeiten
/neuigkeiten/[slug]
/veranstaltungen
/veranstaltungen/[slug]
/sponsoren
/kontakt
/ueber-uns
/fight-night
/admin/login
```

Migrationsregel:

- Neue Arbeit soll auf die finale Zielstruktur einzahlen.
- Alte deutsche Routen nicht blind loeschen; sie koennen als Redirects/Aliases bleiben.
- Sichtbare Labels bleiben Deutsch, auch wenn die URL englisch ist.
- Keine Navigation darf auf eine 404 zeigen.

---

## 8. Startseite - Pflichtaufbau

Die Startseite ist das Herz der Website und folgt dem finalen Designbrief.

Reihenfolge:

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

Hero:

```text
KEINE REGELN.
NUR RESPEKT.
SMASHTIME.

KÄMPFE. EHRE. VERMÄCHTNIS.
```

Rechts/Eventposter:

```text
19 REBELLION
22. JUNI 2025
O2 ARENA BERLIN
```

Wichtig: Diese Beispielinhalte aus dem Designbrief sind Design-/Strukturvorgaben. Reale Projektdaten kommen aus Datenquellen und duerfen nicht unkritisch erfunden werden.

---

## 9. Oeffentliche Seiten - Designpflicht

Alle oeffentlichen Seiten muessen denselben Poster-/Fight-Night-Stil tragen.

Pflichtseiten, sofern vorhanden oder im Scope:

- Events/Eventdetail
- Fighters/Fighterprofil
- Champions
- Rankings
- News/Newsdetail
- About
- Contact
- Tickets
- Login
- Legal-Seiten

Keine Unterseite darf wie ein altes Template aussehen. Header, Footer, Buttons, Cards, Badges, Bilder, Overlays und Typografie muessen konsistent sein.

---

## 10. Komponenten-Pflichten

Globale Komponenten sollen wiederverwendbar und markenkonform sein:

- Header mit Dropdown und Mobile-Menue
- Footer mit Links, Socials, Newsletter
- Button-Varianten: Primary rot, Secondary Outline, Premium Gold/Beige, Textlink
- Cards: EventCard, FighterCard, ChampionCard, NewsCard, RankingCard, StatCard, TicketCard
- Badges: Champion, Main Event, Co-Main Event, Sold Out, Tickets verfügbar, Neu, Interview, Event, Behind the Scenes

Buttons und Links muessen echte interaktive Elemente sein, keine toten UI-Attrappen.

---

## 11. Inhalte, Sprache und Daten

Sichtbare Sprache: Deutsch.

Erlaubte Fach-/Markenbegriffe:

```text
SmashTime, MMA, K1, Fightcard, Main Event, Co-Main Event
```

Nicht sichtbar verwenden:

```text
Home, Events, News, Sponsors, Contact, Fighters, Learn more, Read more,
Buy tickets, Lorem Ipsum
```

Empfohlene Labels:

```text
Startseite, Champions, Neuigkeiten, Über uns, Mehr, Ranglisten,
Events, Kämpfer, Partner, Kontakt, Tickets sichern, Mehr erfahren
```

Wiederkehrende Inhalte kommen aus `src/data/*` oder spaeter aus Supabase. Keine verteilten harten Daten im JSX, wenn eine Datenquelle existiert.

---

## 12. Champions, Fighter und Fightcards

Aktuell echte Champions aus den Projektdaten:

```text
Tanyo Tanev
Mike Capellan Rodriguez
Liam Stancel
Denis Berisha
```

Regeln:

- Keine erfundenen Champions als echte Personen.
- Generierte Fighter-/Atmosphaerebilder duerfen nicht als echte Champions ausgegeben werden.
- Championbilder nur in Champion-/Fighter-Kontexten.
- Referenznamen wie "Adrian Khalidov", "Khalidov", "Martinez" usw. sind Designbeispiele, keine echten Projektdaten.
- Fightcards niemals als starres Bild mit eingebrannten Namen umsetzen.
- Fightcards als datengetriebene HTML/React-Komponenten aufbauen.

Perspektive:

- Das finale Datenmodell soll Fighter, Champions, Rankings, Events, News und Fightcards sauber trennen.
- Bis ein eigenes Fighter-Modell oder Supabase-Daten existieren, duerfen oeffentliche Fighter-/Profilseiten nur aus bestaetigten Champion-/Projekt-Daten abgeleitet werden.
- `/fighters` und `/fighters/[slug]` zeigen bestaetigte Profile; fehlende Fakten werden sichtbar als "wird nachgetragen" oder "wird bald bekanntgegeben" markiert.
- Profilseiten duerfen starke Inszenierung haben, aber keine fiktiven Kampfstile, Herkunftsorte, Records, Last-Fight-Ergebnisse oder Biografien als echt ausgeben.
- Wenn Daten noch fehlen: ehrlich "wird bald bekanntgegeben" anzeigen, nicht erfinden.

---

## 13. Bild- und Asset-Regeln

Logo:

```text
public/images/logo/smashtime-logo.png
```

Header, Footer, Login und Admin nutzen denselben Logo-Pfad. Dateien wie `logo-vertikal - Kopie.png` sind umzubenennen, nicht als dauerhafter Codepfad zu verwenden.

Bildsprache:

- Cage / Arena
- Fighter in Schwarzweiss oder dunkel
- Schlagmoment
- Backstage
- Training
- Faceoff
- Publikum im dunklen Licht
- Champion-Gurtel

Nicht verwenden:

- helle Fitnessstudio-Bilder
- Wellness-/Lifestyle-Bilder
- bunte Hintergruende
- zu saubere Stock-Optik

Alle Bilder brauchen bewusste Crops, `object-fit`, `object-position`, Alt-Texte und dunkle Overlays, wenn Text darueber liegt.

---

## 14. Admin-Dashboard

Admin bleibt funktional wichtig, aber oeffentliches Frontend-Redesign darf Admin nicht blockieren.

Admin-Routen:

```text
/admin/login
/admin
/admin/champions
/admin/events
/admin/fightcards
/admin/news
/admin/sponsors
/admin/contact
/admin/media
/admin/settings
```

Admin-Regeln:

- dunkel, kantig, markenkonform
- keine generische SaaS-Optik
- CRUD-Buttons duerfen nicht tot bleiben
- Supabase Auth/RLS respektieren
- kein hartcodiertes Admin-Passwort

---

## 15. Supabase und Sicherheit

Immer:

- Keine `.env`-Inhalte anzeigen, loggen oder committen.
- Keine Tokens, Passwoerter oder Supabase-Keys in Code hartcodieren.
- Kein Service-Role-Key im Client.
- RLS bleibt aktiv.
- Admin-Schreibzugriffe ueber session-gebundenen serverseitigen Supabase-Client.
- Lose Credential-/Debug-Dateien im Root sind Sicherheitsrisiken und muessen adressiert werden.

`SECURITY_NOTES.md` bleibt fuer Details verbindlich.

---

## 16. Port- und Dev-Regel

Fester Projekt-Port:

```text
http://localhost:3000
```

Keine automatische Ausweichports. Wenn Port 3000 belegt ist, nur pruefen und nur dann beenden, wenn der Prozess eindeutig ein alter Node/Next-Prozess dieses Projekts ist.

Bis zur Paketmanager-Klaerung:

```bash
npm run lint
npm run build
```

Nicht eigenmaechtig auf pnpm/yarn wechseln.

---

## 17. Responsive und Accessibility

Breakpoints:

```text
Mobile: 0-767px
Tablet: 768-1023px
Desktop: 1024-1439px
Wide: 1440px+
```

Pflicht:

- Mobile ist eigenstaendig gestaltet, nicht gequetschter Desktop.
- Keine horizontale Scrollbar.
- Keine abgeschnittenen Texte.
- Buttons mindestens ca. 44px Touch-Flaeche.
- Dropdown/Mobile-Menue per Tastatur nutzbar, Fokus sichtbar.
- Formularlabels und Fehlermeldungen vorhanden.
- Keine Layout-Shifts durch Bilder, Hover oder dynamische Inhalte.

---

## 18. Qualitaetskontrolle

Nach relevanten Aenderungen:

```bash
npm run lint
npm run build
```

Zusatzchecks:

- wichtige Seiten erreichbar
- Header/Dropdown/Burger funktionieren
- CTAs fuehren zu echten Zielen
- keine 404 durch Navigation
- keine Console Errors
- keine TypeScript-Fehler
- keine englischen UI-Labels ausser erlaubte Begriffe
- keine Lorem-Ipsum-Texte
- keine erfundenen echten Fighter
- Fightcard nicht statisch
- keine wieder eingefuehrten Root-Altplaene (`CODEX_PHASE...`, `CODEX_NAVIGATION...`, `01_...`)
- Mobile/Desktop pruefen, besonders 390, 430, 768, 1280, 1440

Wenn ein Check fehlschlaegt, Ursache konkret nennen.

---

## 19. Abschlussbericht

Am Ende jeder Aufgabe:

```text
Geändert:
- ...

Geprüft:
- ...

Offen:
- ...
```

Kurz, konkret, keine Fake-Erfolgsmeldungen.

---

## 20. Harte Stop-Regeln

Stoppen und melden, wenn:

- Zugangsdaten sichtbar wuerden.
- Eine lose Credential-Datei mit privilegiertem Key gefunden wird und nicht sicher adressiert werden kann.
- Eine Aenderung ungesicherte Daten loeschen wuerde.
- Ein fremder Prozess betroffen waere.
- Ein Referenzbild falsche reale Daten vorgibt und diese als echt uebernommen werden sollen.

---

## 21. Leitlinie

Der neue Plan ist kein kleines Restyling.

Das Ziel ist eine komplette, konsistente SmashTime-Website im Stil des finalen Designbriefs:

```text
Ein echtes Fight-Night-Poster,
das als professionelle Website lebendig geworden ist.
```

Alles, was dem neuen Plan widerspricht, wird als Altlast behandelt und kontrolliert migriert.

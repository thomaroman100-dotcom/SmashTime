# Codex Briefing: Navigation und Startseiten-Aufbau neu ordnen

Diese Datei ist eine konkrete Umsetzungsanweisung für den nächsten Codex-Lauf.

Wichtig: Vor der Umsetzung immer zuerst `AGENTS.md` lesen. Diese Datei ergänzt die bestehenden Projektregeln für den konkreten Navigations-Umbau. Wenn alte Navigationsregeln in `AGENTS.md` und diese Datei sich widersprechen, gilt für diesen Task diese Datei als genehmigte Ergänzung, ohne die allgemeinen Qualitäts-, Sprach-, Design- und Datenregeln aus `AGENTS.md` aufzuheben.

---

## 1. Ziel des Umbaus

Die öffentliche SmashTime-Seite soll professioneller wirken, indem das Hauptmenü reduziert und logisch gruppiert wird.

Aktuell ist das Menü zu lang und wirkt wie eine flache Linkliste:

```text
Veranstaltungen
Champions
Neuigkeiten
Tickets
Fight Night
Über uns
Partner
Kontakt
```

Ziel ist ein ruhigeres, hochwertigeres Navigationssystem mit wenigen Hauptpunkten, Dropdowns am Desktop und Accordions auf Mobile.

Tickets sollen nicht mehr als eigener Hauptmenüpunkt erscheinen. Ticket-/Event-Hinweise sollen stattdessen über Startseite, Veranstaltungsseite, Kampfabend-Bereich und CTAs geführt werden.

---

## 2. Sehr wichtige Sprachregel

Alle sichtbaren Website-Texte bleiben Deutsch.

Nicht als sichtbare Navigationslabels verwenden:

```text
Events
News
Fight Night
Tickets
Partner
```

Erlaubte deutsche Labels:

```text
Veranstaltungen
Kämpfer
Neuigkeiten
Über uns
Sponsoren
Kontakt
Kampfabend
Nächste Veranstaltung
Fightcard
Vergangene Veranstaltungen
```

Hinweis: Technische Routen und Dateinamen dürfen weiterhin Englisch sein, wenn sie bereits existieren. Sichtbare Besuchertexte müssen Deutsch sein.

---

## 3. Bestehende Struktur im Repo

Aktuelle relevante Dateien:

```text
src/data/site.ts
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/app/globals.css
src/app/page.tsx
src/app/veranstaltungen/page.tsx
src/app/veranstaltungen/[slug]/page.tsx
src/app/champions/page.tsx
src/app/champions/[slug]/page.tsx
src/app/neuigkeiten/page.tsx
src/app/neuigkeiten/[slug]/page.tsx
src/app/tickets/page.tsx
src/app/fight-night/page.tsx
src/app/ueber-uns/page.tsx
src/app/sponsoren/page.tsx
src/app/kontakt/page.tsx
```

Aktuell wird die Navigation zentral aus `src/data/site.ts` über `site.navigation` gelesen.

Der Header rendert diese Navigation flach in `src/components/layout/Header.tsx`.

Der Footer verwendet aktuell ebenfalls `site.navigation`. Das soll getrennt werden, damit Header und Footer unterschiedliche Strukturen haben können.

---

## 4. Neuer Menü-Aufbau Desktop

Desktop-Hauptnavigation:

```text
Veranstaltungen ▾
Kämpfer ▾
Neuigkeiten
Über uns ▾
[ Nächste Veranstaltung ]
```

Der Button rechts im Header soll nicht mehr `Tickets sichern` heißen.

Neuer Header-CTA:

```text
Nächste Veranstaltung
```

Ziel des Header-CTA:

```text
/veranstaltungen/smashtime-3-cagetime
```

Alternative, falls der Detail-Slug nicht vorhanden ist:

```text
/veranstaltungen
```

---

## 5. Dropdown-Struktur Desktop

### Veranstaltungen

```text
Veranstaltungen
├─ Nächste Veranstaltung
├─ Kampfabend
├─ Fightcard
└─ Vergangene Veranstaltungen
```

Ziele:

```text
Nächste Veranstaltung       -> /veranstaltungen/smashtime-3-cagetime
Kampfabend                  -> /fight-night
Fightcard                   -> /fight-night#fightcard
Vergangene Veranstaltungen  -> /veranstaltungen#archiv
```

Wichtig:

- `/fight-night` darf technisch bestehen bleiben, aber sichtbar als `Kampfabend` labeln.
- Die Fightcard-Sektion in `src/app/fight-night/page.tsx` braucht eine stabile `id="fightcard"`.
- Der Archivbereich in `src/app/veranstaltungen/page.tsx` braucht eine stabile `id="archiv"`.

### Kämpfer

```text
Kämpfer
├─ Champions
└─ Gewichtsklassen
```

Ziele:

```text
Champions       -> /champions
Gewichtsklassen -> /champions#gewichtsklassen
```

Wichtig:

- Keine neue Kämpfer-Route erfinden, solange keine echte allgemeine Kämpferseite existiert.
- Keine leeren Versprechen wie `Kämpferprofile`, wenn aktuell nur Champion-Profile existieren.
- Falls sinnvoll, auf der Champions-Seite eine sichtbare Anker-ID `gewichtsklassen` beim Filter-/Gewichtsklassenbereich ergänzen.

### Neuigkeiten

```text
Neuigkeiten -> /neuigkeiten
```

Kein Dropdown nötig.

### Über uns

```text
Über uns
├─ SmashTime
├─ Sponsoren
└─ Kontakt
```

Ziele:

```text
SmashTime  -> /ueber-uns
Sponsoren  -> /sponsoren
Kontakt    -> /kontakt
```

Wichtig:

- `Sponsoren` und `Kontakt` nicht mehr als eigene Hauptmenüpunkte im Header anzeigen.
- Sie bleiben über Dropdown und Footer erreichbar.

---

## 6. Mobile Navigation

Mobile darf kein Hover-Dropdown verwenden.

Mobile soll als Burger-Menü mit Accordion-Gruppen umgesetzt werden:

```text
Menü

Veranstaltungen +
  Nächste Veranstaltung
  Kampfabend
  Fightcard
  Vergangene Veranstaltungen

Kämpfer +
  Champions
  Gewichtsklassen

Neuigkeiten

Über uns +
  SmashTime
  Sponsoren
  Kontakt

[ Nächste Veranstaltung ]
```

Regeln:

- Ein Tap auf eine Hauptgruppe öffnet/schließt die Unterpunkte.
- Ein Tap auf einen normalen Link schließt das mobile Menü.
- Ein Tap auf einen Unterpunkt schließt das mobile Menü.
- Der Header-CTA bleibt auch mobil sichtbar oder innerhalb des Panels prominent am Ende.
- Keine horizontale Scrollbar.
- Bei 390 px, 430 px und 768 px testen.

---

## 7. Datenstruktur in `src/data/site.ts`

`site.navigation` soll von einer flachen Liste auf eine strukturierte Navigation erweitert werden.

Empfohlene Struktur:

```ts
export type NavigationItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};
```

Beispiel:

```ts
navigation: [
  {
    label: "Veranstaltungen",
    href: "/veranstaltungen",
    children: [
      { label: "Nächste Veranstaltung", href: "/veranstaltungen/smashtime-3-cagetime" },
      { label: "Kampfabend", href: "/fight-night" },
      { label: "Fightcard", href: "/fight-night#fightcard" },
      { label: "Vergangene Veranstaltungen", href: "/veranstaltungen#archiv" }
    ]
  },
  {
    label: "Kämpfer",
    href: "/champions",
    children: [
      { label: "Champions", href: "/champions" },
      { label: "Gewichtsklassen", href: "/champions#gewichtsklassen" }
    ]
  },
  { label: "Neuigkeiten", href: "/neuigkeiten" },
  {
    label: "Über uns",
    href: "/ueber-uns",
    children: [
      { label: "SmashTime", href: "/ueber-uns" },
      { label: "Sponsoren", href: "/sponsoren" },
      { label: "Kontakt", href: "/kontakt" }
    ]
  }
]
```

Zusätzliche Empfehlung:

```ts
headerCta: {
  label: "Nächste Veranstaltung",
  href: "/veranstaltungen/smashtime-3-cagetime"
},
footerNavigation: [
  { label: "Veranstaltungen", href: "/veranstaltungen" },
  { label: "Champions", href: "/champions" },
  { label: "Neuigkeiten", href: "/neuigkeiten" },
  { label: "Sponsoren", href: "/sponsoren" },
  { label: "Kontakt", href: "/kontakt" }
]
```

`ticketHref` kann bleiben, soll aber nicht mehr der Standard-Header-CTA sein.

---

## 8. Header-Komponente umbauen

Datei:

```text
src/components/layout/Header.tsx
```

Aufgaben:

1. Navigation mit optionalen `children` unterstützen.
2. Desktop-Dropdowns bauen.
3. Aktive Zustände für Parent-Items beachten.
4. Mobile Panel zu Accordion umbauen.
5. Header-CTA von `Tickets sichern` auf `Nächste Veranstaltung` ändern.
6. CTA-Ziel aus `site.headerCta.href` verwenden.
7. Beim Klick auf Mobile-Link `setOpen(false)` ausführen.
8. Keine neue externe Library verwenden.

Desktop-Verhalten:

- Parent mit Children zeigt kleinen Pfeil/Chevron.
- Dropdown öffnet per Hover und per Focus innerhalb der Gruppe.
- Dropdown bleibt optisch dunkel, kantig, grungy, hochwertig.
- Unterpunkte sind klar klickbar.

Mobile-Verhalten:

- Accordion-State getrennt vom Panel-State verwalten.
- Buttons für Accordion müssen `aria-expanded` setzen.
- Mehrere offene Gruppen sind erlaubt, wenn UX sauber bleibt.

---

## 9. Footer entkoppeln

Datei:

```text
src/components/layout/Footer.tsx
```

Aktuell rendert der Footer `site.navigation`.

Ändern auf:

```text
site.footerNavigation
```

Footer darf mehr Links enthalten als der Header, aber nicht chaotisch wirken.

Empfohlen:

```text
Veranstaltungen
Champions
Neuigkeiten
Sponsoren
Kontakt
```

Optional zusätzlich klein:

```text
Impressum
Datenschutz
```

Nur ergänzen, wenn Routen dafür existieren oder ausdrücklich als Platzhalter gewünscht sind. Keine kaputten Links erzeugen.

---

## 10. Startseite stärker als zentrale Landingpage nutzen

Datei:

```text
src/app/page.tsx
```

Ziel: Weil weniger Menüpunkte sichtbar sind, muss die Startseite mehr Orientierung geben.

Die Startseite soll mindestens diese Logik haben:

```text
Hero
Nächste Veranstaltung
Kampfabend-/Fightcard-Preview
Was dich erwartet
Aktuelle Neuigkeiten
Sponsorenstreifen
Kontakt-/Mitmachen-CTA
Footer
```

Schon vorhanden:

```text
Hero
Nächste Veranstaltung
Was dich erwartet
Aktuelle Neuigkeiten
SponsorStrip
CallToActionBand
```

Ergänzen oder verbessern:

1. Kampfabend-/Fightcard-Preview mit Link auf `/fight-night`.
2. Optional kleine Champion-Vorschau ohne Champion-Portraits, wenn `AGENTS.md` das weiterhin verbietet.
3. CTA-Texte weniger ticketlastig formulieren, solange kein echter Ticketshop existiert.

Gute CTA-Texte:

```text
Nächste Veranstaltung ansehen
Zum Kampfabend
Fightcard ansehen
Kontakt aufnehmen
Sponsor werden
```

Nicht überall verwenden:

```text
Tickets sichern
Ticket kaufen
```

Der echte Ticketshop ist in Phase 1 nicht angebunden.

---

## 11. Ticket-Seite behandeln

Die Route `/tickets` existiert aktuell.

Nicht löschen, außer ausdrücklich beauftragt.

Aber:

- nicht mehr im Header-Hauptmenü anzeigen
- nicht als primärer Header-CTA verwenden
- interne CTA-Texte entschärfen, solange kein echter Ticketshop existiert
- bei Buttons eher auf Kontakt oder Veranstaltung führen

Empfohlene sichtbare Texte:

```text
Ticketinfos anfragen
Platz vormerken
Kontakt aufnehmen
Event ansehen
```

---

## 12. Bestehende Routen nicht unnötig zerstören

Auch wenn `AGENTS.md` ursprünglich nur 7 öffentliche Seiten vorsieht, existieren im aktuellen Projekt bereits weitere Routen:

```text
/tickets
/fight-night
/ueber-uns
```

Für diesen Task gilt:

- diese Routen nicht löschen
- keine neue Route erfinden
- Navigationslogik sauber um vorhandene Routen herum bauen
- sichtbare Labels deutsch halten
- Tickets aus dem Hauptmenü entfernen

---

## 13. CSS-Anforderungen

Datei:

```text
src/app/globals.css
```

Ergänzen oder anpassen:

```text
.site-header__nav-item
.site-header__dropdown-trigger
.site-header__dropdown
.site-header__dropdown-link
.mobile-panel__group
.mobile-panel__group-trigger
.mobile-panel__submenu
```

Design:

- dunkel
- kantig
- rote Akzentlinie
- leichte Grunge-/Scratch-Anmutung passend zum Rest
- keine billigen Neon-Glows
- keine runden weichen App-Menüs
- Dropdown darf nicht über Hero unlesbar werden
- z-index sauber
- Focus-Zustände sichtbar

Mobile:

- groß genug klickbar
- Unterpunkte optisch eingerückt
- klare Trennung zwischen Hauptpunkt und Unterpunkten
- CTA am Ende stark sichtbar

---

## 14. Anker-IDs ergänzen

Bitte ergänzen:

```text
src/app/fight-night/page.tsx
Fightcard-Bereich: id="fightcard"
```

```text
src/app/veranstaltungen/page.tsx
Archiv-Bereich: id="archiv"
```

Falls Gewichtsklassenbereich vorhanden:

```text
src/app/champions/page.tsx oder ChampionGrid-Komponente
id="gewichtsklassen"
```

Wenn kein echter Gewichtsklassenbereich existiert, den Link entweder nicht anzeigen oder eine sinnvolle kleine Filter-/Info-Leiste ergänzen.

---

## 15. Qualitätsregeln nach Umsetzung

Nach Änderung prüfen:

```text
npm run lint
npm run build
```

Zusätzlich manuell prüfen:

```text
/
/veranstaltungen
/veranstaltungen/smashtime-3-cagetime
/champions
/neuigkeiten
/fight-night
/ueber-uns
/sponsoren
/kontakt
```

Mobile prüfen:

```text
390 px
430 px
768 px
1280 px
```

Check:

- Header ist nicht überladen.
- Dropdown öffnet am Desktop sauber.
- Mobile Accordion funktioniert.
- Keine kaputten Links.
- Keine sichtbaren englischen Navigationslabels.
- Tickets ist nicht mehr im Hauptmenü.
- CTA führt zur nächsten Veranstaltung oder zum Eventbereich.
- Footer ist sauber und nicht überladen.
- Keine horizontale Scrollbar.
- Build läuft.
- Lint läuft oder Ausnahmen werden dokumentiert.

---

## 16. Erwartetes Ergebnis

Nach dem Umbau soll der Header ungefähr so wirken:

```text
Logo | Veranstaltungen ▾ | Kämpfer ▾ | Neuigkeiten | Über uns ▾ | [ Nächste Veranstaltung ]
```

Mobile:

```text
Logo | Menübutton

Panel:
Veranstaltungen +
Kämpfer +
Neuigkeiten
Über uns +
[ Nächste Veranstaltung ]
```

Das Ziel ist nicht mehr Menü, sondern bessere Führung.

Die Startseite übernimmt mehr Inhalt. Das Menü bleibt kurz, stark und professionell.

# Codex Checkliste: Navigation Rework SmashTime

Diese Checkliste gehört zu `CODEX_NAVIGATION_REWORK.md`.

Codex soll nach der Umsetzung jeden Punkt prüfen und im Abschlussbericht kurz bestätigen oder begründen, wenn etwas bewusst nicht umgesetzt wurde.

---

## 1. Vorher lesen

- [ ] `AGENTS.md` gelesen.
- [ ] `CODEX_NAVIGATION_REWORK.md` gelesen.
- [ ] Keine neuen öffentlichen Routen ohne ausdrückliche Freigabe erstellt.
- [ ] Keine bestehenden Routen gelöscht.
- [ ] Keine sichtbaren englischen Navigationslabels verwendet.

---

## 2. Dateien prüfen

Diese Dateien müssen geprüft und bei Bedarf angepasst werden:

- [ ] `src/data/site.ts`
- [ ] `src/components/layout/Header.tsx`
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/app/globals.css`
- [ ] `src/app/page.tsx`
- [ ] `src/app/veranstaltungen/page.tsx`
- [ ] `src/app/fight-night/page.tsx`
- [ ] `src/app/champions/page.tsx`

Optional prüfen:

- [ ] `src/app/tickets/page.tsx`
- [ ] `src/components/sections/CallToActionBand.tsx`
- [ ] `src/components/sections/ChampionGrid.tsx`
- [ ] `src/components/sections/FightCardList.tsx`

---

## 3. Navigation Datenstruktur

- [ ] `site.navigation` unterstützt `children`.
- [ ] `site.headerCta` existiert.
- [ ] `site.footerNavigation` existiert.
- [ ] `Tickets` ist nicht mehr Teil der Hauptnavigation.
- [ ] `Partner` heißt sichtbar nicht mehr `Partner`, sondern `Sponsoren`, falls als Link sichtbar.
- [ ] `/fight-night` wird sichtbar als `Kampfabend` geführt.
- [ ] Header-CTA heißt `Nächste Veranstaltung`.
- [ ] Header-CTA führt auf `/veranstaltungen/smashtime-3-cagetime` oder fallback auf `/veranstaltungen`.

---

## 4. Desktop Header

- [ ] Hauptpunkte: `Veranstaltungen`, `Kämpfer`, `Neuigkeiten`, `Über uns`.
- [ ] `Veranstaltungen` hat Dropdown.
- [ ] `Kämpfer` hat Dropdown.
- [ ] `Über uns` hat Dropdown.
- [ ] `Neuigkeiten` ist direkter Link.
- [ ] Dropdowns öffnen sauber per Hover.
- [ ] Dropdowns sind per Keyboard/Focus erreichbar.
- [ ] Parent-Items zeigen aktiven Zustand, wenn Unterroute aktiv ist.
- [ ] Dropdown liegt über Hero und ist lesbar.
- [ ] Keine Layoutsprünge im Header.
- [ ] Header bleibt optisch hochwertig, dunkel, kantig, SmashTime-Stil.

---

## 5. Mobile Navigation

- [ ] Burger-Menü funktioniert.
- [ ] Mobile Panel öffnet und schließt sauber.
- [ ] Dropdowns sind mobil Accordions, kein Hover.
- [ ] `Veranstaltungen` lässt sich aufklappen.
- [ ] `Kämpfer` lässt sich aufklappen.
- [ ] `Über uns` lässt sich aufklappen.
- [ ] Unterpunkte sind groß genug klickbar.
- [ ] Klick auf Link schließt Panel.
- [ ] CTA ist im Mobile-Menü sichtbar.
- [ ] Keine horizontale Scrollbar bei 390 px.
- [ ] Keine horizontale Scrollbar bei 430 px.
- [ ] Tablet bei 768 px sauber.

---

## 6. Dropdown-Ziele

Veranstaltungen:

- [ ] `Nächste Veranstaltung` -> `/veranstaltungen/smashtime-3-cagetime`
- [ ] `Kampfabend` -> `/fight-night`
- [ ] `Fightcard` -> `/fight-night#fightcard`
- [ ] `Vergangene Veranstaltungen` -> `/veranstaltungen#archiv`

Kämpfer:

- [ ] `Champions` -> `/champions`
- [ ] `Gewichtsklassen` -> `/champions#gewichtsklassen` oder Link entfernen, wenn keine sinnvolle Sektion existiert.

Über uns:

- [ ] `SmashTime` -> `/ueber-uns`
- [ ] `Sponsoren` -> `/sponsoren`
- [ ] `Kontakt` -> `/kontakt`

---

## 7. Anker-IDs

- [ ] Fightcard-Bereich hat `id="fightcard"`.
- [ ] Archivbereich auf Veranstaltungen hat `id="archiv"`.
- [ ] Gewichtsklassenbereich hat `id="gewichtsklassen"` oder der Link wurde entfernt.

---

## 8. Startseite

- [ ] Startseite bleibt übersichtlich.
- [ ] Nächste Veranstaltung ist prominent.
- [ ] Kampfabend-/Fightcard-Hinweis ist sichtbar oder sinnvoll eingebunden.
- [ ] News-Vorschau bleibt vorhanden.
- [ ] Sponsorenstreifen bleibt vorhanden.
- [ ] CTA ist nicht unnötig ticketlastig.
- [ ] Keine Champion-Portraits auf Startseite verwenden, solange `AGENTS.md` dies nicht freigibt.
- [ ] Keine falschen Eventdaten.

---

## 9. Tickets

- [ ] `/tickets` wurde nicht gelöscht.
- [ ] `Tickets` ist nicht mehr im Header.
- [ ] `Tickets sichern` ist nicht mehr primärer Header-CTA.
- [ ] Ticket-Texte sind entschärft, solange kein echter Ticketshop existiert.
- [ ] Keine kaputten Ticket-Links.

---

## 10. Footer

- [ ] Footer nutzt `site.footerNavigation`.
- [ ] Footer rendert nicht blind die Header-Dropdown-Struktur.
- [ ] Footer enthält sinnvolle Links.
- [ ] Footer ist auf Mobile sauber.
- [ ] Keine kaputten Links.

---

## 11. Sprache

Nicht erlaubt als sichtbare Navigation:

- [ ] `Events`
- [ ] `News`
- [ ] `Fight Night`
- [ ] `Partner`
- [ ] `Tickets`

Erlaubt:

- [ ] `Veranstaltungen`
- [ ] `Neuigkeiten`
- [ ] `Kampfabend`
- [ ] `Sponsoren`
- [ ] `Nächste Veranstaltung`

---

## 12. Tests

- [ ] `npm run lint`
- [ ] `npm run build`

Manuelle Seitenprüfung:

- [ ] `/`
- [ ] `/veranstaltungen`
- [ ] `/veranstaltungen/smashtime-3-cagetime`
- [ ] `/champions`
- [ ] `/neuigkeiten`
- [ ] `/fight-night`
- [ ] `/ueber-uns`
- [ ] `/sponsoren`
- [ ] `/kontakt`

Responsive Prüfung:

- [ ] 390 px
- [ ] 430 px
- [ ] 768 px
- [ ] 1280 px
- [ ] Große Desktop-Breite

---

## 13. Abschlussbericht von Codex

Codex soll am Ende berichten:

```text
Geändert:
- Datei 1
- Datei 2
- Datei 3

Geprüft:
- npm run lint
- npm run build
- Desktop Navigation
- Mobile Navigation

Nicht umgesetzt / bewusst ausgelassen:
- Punkt X, weil ...
```

Keine vagen Aussagen wie `sollte funktionieren`.

Jeder wichtige Punkt muss konkret bestätigt werden.

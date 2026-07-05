---
name: navigation-and-link-audit
description: Use when auditing SmashTime public pages for broken links, wrong targets, old route assumptions, header/dropdown issues, mobile menu issues, or 404 risks after the final design brief.
---

# Navigation & Link Audit

Prueft Navigation und Links gegen `smashtime_claude_design_brief_final.md` und `AGENTS.md`.

## Finale Zielrouten

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

## Legacy-Routen

Diese duerfen waehrend der Migration als Aliases/Redirects bestehen bleiben und duerfen nicht blind geloescht werden:

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

## Header-Soll

Desktop:

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

Dropdown `Mehr`:

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

Mobile: Logo links, Burger rechts, `Mehr` als Accordion, grosser roter `Tickets sichern`-CTA. Keine Hover-only-Funktion.

## Vorgehen

1. `src/data/site.ts`, `src/components/layout/Header.tsx`, Footer und relevante `Link`/`href`-Stellen lesen.
2. Jeden Link gegen vorhandene Routen, Slug-Daten und Anker pruefen.
3. Sichtbare Labels bleiben Deutsch, auch wenn Ziel-URLs englisch sind.
4. Keine Navigation darf auf 404 zeigen; fehlende Zielseiten vorbereiten oder sauber redirecten.
5. Funde konkret mit Datei, Zeile, Ist-Ziel und Soll-Ziel melden oder direkt reparieren, wenn die Aufgabe das verlangt.

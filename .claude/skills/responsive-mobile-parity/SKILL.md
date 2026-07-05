---
name: responsive-mobile-parity
description: Use when checking or fixing that SmashTime mobile/tablet/desktop layouts match the final design in content, impact, usability, menu behavior, image cropping, and no-horizontal-scroll safety.
---

# Responsive & Mobile Parity

Mobile ist keine gequetschte Desktop-Version. Der Fight-Poster-Look muss auf kleinen Screens genauso bewusst wirken.

## Breakpoints

Mindestens pruefen:

```text
390px
430px
768px
1280px
1440px
```

## Pflicht-Checks

- Kein horizontales Scrollen, keine auslaufenden Headlines, keine abgeschnittenen Buttons.
- Header mobil: Logo links, Burger rechts, Touch-Ziele ca. 44px, `Tickets sichern` prominent.
- `Mehr` mobil als Accordion; keine Hover-only-Interaktion.
- Hero mobil: Headline zuerst, dann Event-/Countdown-/CTA-Information sauber gestapelt.
- Countdown mobil sinnvoll umbrechen, z. B. 2x2 statt gequetschte Zeile.
- Main-Fight/Event-Banner mobil vertikal stapeln, Namen und Datum lesbar.
- Bilder: `object-fit` und `object-position` bewusst; Gesichter/Logo/Text nicht zufaellig abschneiden.
- Inhaltliche Paritaet: Mobile darf Inhalte einklappen, aber nicht verschwinden lassen.
- Admin nur im Scope pruefen, wenn Admin betroffen ist; oeffentliches Frontend hat Vorrang.

## Vorgehen

1. Breakpoint-Klassen in betroffenen Komponenten wirklich nachvollziehen.
2. Wenn moeglich Dev-Server auf Port 3000 nutzen und die Breakpoints visuell pruefen.
3. Responsive Loesungen bauen, keine wichtigen Inhalte per `hidden` verstecken.
4. Nach Mobile-Fix Desktop gegenkontrollieren.

---
name: image-asset-integration
description: Use when adding, renaming, sorting, or reviewing SmashTime images: hero assets, reference images, champion photos, logo paths, cropping, object-fit/object-position, overlays, alt text, and next/image setup.
---

# Image & Asset Integration

Bilder muessen den finalen SmashTime-Look tragen: Cage, Arena, Fighter, Backstage, Faceoff, Training, dunkles Licht und rote/goldene Akzente.

## Pflichten

- Logo-Pfad ist kanonisch: `public/images/logo/smashtime-logo.png`.
- Dateien wie `logo-vertikal - Kopie.png` umbenennen oder einsortieren, nicht dauerhaft als Codepfad verwenden.
- Keine lokalen absoluten Pfade (`C:\...`) im Code.
- `next/image` verwenden, wenn sinnvoll; `alt`, `sizes`, `priority` und Cropping bewusst setzen.
- Text ueber Bildern braucht dunkle Vignette/Overlay, aber keine Unlesbarkeit.
- Referenzbilder sind Designquelle, keine Inhaltsquelle.
- Generierte Fighter-/Atmosphaerebilder duerfen nicht als echte Personen ausgegeben werden.
- Championbilder nur fuer Champion-/Fighter-Kontexte, nicht als allgemeine Deko.

## Bildsprache

Geeignet: dunkle Cage-/Arena-Szenen, Schwarzweiss-Fighter, Schlagmoment, Faceoff, Backstage, Handwraps, Champion-Gurtel, roter Staub/Brush, goldene Premium-Linien.

Ungeeignet: helle Fitnessstudio-Bilder, Wellness/Lifestyle, bunte Hintergruende, saubere Stock-Optik, Bilder mit eingebrannten falschen Eventdaten als echte Website-Information.

## Vorgehen

1. Bildrolle bestimmen: Logo, Hero, Atmosphaere, Champion, Event, UI-Brush, Sponsor.
2. In `REFERENCE_IMAGES.md` und finalem Brief pruefen, welche visuelle Aufgabe das Bild erfuellt.
3. Datei ordentlich benennen: kleingeschrieben, sprechend, Bindestriche, keine `ChatGPT Image...`-Namen.
4. Nach Einbindung Pfad, Cropping, Alt-Text und Mobile/Desktop-Ausschnitt pruefen.

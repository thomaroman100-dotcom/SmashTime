---
name: frontend-quality-gate
description: Use before concluding any non-trivial SmashTime change; checks lint/build, route/navigation safety, final design brief compliance, content rules, port 3000, and reports changed/checked/open items.
---

# Frontend Quality Gate

Letzte Pruefstufe nach groesseren Aenderungen. Bei reinen Doku-/Skill-Aenderungen reicht ein gezielter Text-/Regelcheck; bei Code/UI-Aenderungen sind Lint und Build Pflicht.

## Standardbefehle

```bash
npm run lint
npm run build
```

Bis zur Paketmanager-Klaerung gilt `npm`, nicht eigenmaechtig `pnpm`/`yarn`.

## Zusaetzlich pruefen

- Finaler Designbrief wird nicht durch alte Regeln blockiert.
- Header, Dropdown `Mehr`, Mobile-Menue und CTAs fuehren nicht auf 404.
- Neue Zielrouten und Legacy-Aliases sind bewusst behandelt.
- Sichtbare Sprache Deutsch; erlaubte Fachbegriffe: SmashTime, MMA, K1, Fightcard, Main Event, Co-Main Event.
- Keine Lorem-Ipsum-Texte, keine Fake-Fighter als echte Daten.
- Fightcard bleibt HTML/React und datengetrieben, nicht statisches Bild.
- Bilder haben korrekte Pfade, Alt-Texte und keine lokalen absoluten Pfade.
- Port bleibt `http://localhost:3000`.
- Secrets/Env-Dateien nicht anzeigen; bekannte Root-Risiken (`env supabase.txt`, `supabase-temp.js`) konkret als offen melden, falls sie noch existieren.

## Wenn ein Check fehlschlaegt

Fehler konkret benennen. Keine Fake-Erfolgsmeldung. Wenn es ein bekannter Sicherheits-/Root-Skript-Fund ist, nicht verstecken.

## Abschlussformat

```text
Geändert:
- ...

Geprüft:
- ...

Offen:
- ...
```

# SmashTime Webplattform

Professionelle Webplattform für SmashTime: öffentliche Website, Kämpferprofile, Champions, Events, News, Sponsoren, Tickets, Fight Night, Kontakt und Admin-Dashboard mit Supabase.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel Deployment

## Wichtige Regeln

- Alles Sichtbare auf Deutsch
- Keine erfundenen Fighter
- Nur die 4 echten Champions in Champion-Kontexten
- Kämpferprofile nur aus bestätigten Projekt-/Championdaten ableiten, bis eigene Fighter-Daten vorliegen
- Fightcard niemals als statisches Bild
- Eventdaten zentral pflegen
- Keine Secrets ins Repository

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Prüfung

```bash
npm run lint
npm run build
```

## Sicherheitsregel

Diese Dateien dürfen niemals committed werden:

```text
.env
.env.local
.env.*.local
.env*
env supabase.txt
```

## Projektsteuerung

Verbindlich sind `smashtime_claude_design_brief_final.md`, `AGENTS.md`, `ROADMAP.md`, `REFERENCE_IMAGES.md` und `SECURITY_NOTES.md`. Alte Phase-/Codex-Archivdateien werden nicht mehr im Root geführt.

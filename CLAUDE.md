# CLAUDE.md - Kurzanleitung fuer KI-Werkzeuge

Dieses Repository ist **SmashTime**, eine Kampfsport-/Event-Website mit Next.js App Router, TypeScript, Tailwind CSS und Supabase.

## Verbindliche Reihenfolge

Vor jeder Aufgabe lesen:

1. `smashtime_claude_design_brief_final.md` - finale Designrichtung fuer das oeffentliche Frontend.
2. `AGENTS.md` - verbindliche Arbeits-, Sicherheits-, Daten- und Routing-Regeln.
3. `ROADMAP.md` - aktueller Ist-Stand und Backlog.
4. `REFERENCE_IMAGES.md` - Referenzbild-/Asset-Zuordnung; alte Screens sind sekundär.
5. `SECURITY_NOTES.md` - Supabase-/Secret-Regeln.

Alte Dateien wie `CODEX_PHASE...` oder `CODEX_NAVIGATION_REWORK...` sind Archiv. Wenn sie dem finalen Brief oder `AGENTS.md` widersprechen, gelten sie nicht.

## Neuer Designkern

SmashTime soll wirken wie ein professionelles Fight-Night-Poster als Website:

- schwarz, rot, gold, dirty-white
- Grunge, Scratch, harte Borders, dunkle Vignetten
- grosse uppercase Poster-Typografie
- horizontaler sticky Header
- starker roter Tickets-CTA
- keine Desktop-Sidebar, kein SaaS-/Baukasten-Look

## Finale Navigation

Desktop:

```text
Startseite
Champions
Neuigkeiten
Über uns
Mehr ▼
Login
Tickets
```

`Mehr`: Ranglisten, Events, Kämpfer, Partner, Merch, Karriere, FAQ, Kontakt.

Neue Zielrouten nutzen englische URLs (`/events`, `/news`, `/about`, `/contact`, `/fighters`, `/rankings`, `/partners`, `/legal/...`). Deutsche Alt-Routen duerfen als Redirects/Aliases bleiben.

## Nicht vergessen

- Sichtbare UI deutsch.
- Nur echte Champions: Tanyo Tanev, Mike Capellan Rodriguez, Liam Stancel, Denis Berisha.
- Referenznamen und Beispiel-Events nie als echte Daten uebernehmen.
- Fightcards als HTML/React, nie als starres Bild.
- Logo kanonisch: `public/images/logo/smashtime-logo.png`.
- Keine Secrets zeigen, loggen oder committen.
- Fester Port: `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Bis zur Klaerung gilt `npm`, nicht eigenmaechtig auf `pnpm` wechseln.

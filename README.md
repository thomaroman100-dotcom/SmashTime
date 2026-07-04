# SmashTime Webplattform

Professionelle Webplattform für SmashTime: öffentliche Website, Champions, Events, News, Sponsoren, Tickets, Fight Night, Kontakt und späteres Admin-Dashboard mit Supabase.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase geplant
- Vercel Deployment

## Wichtige Regeln

- Alles Sichtbare auf Deutsch
- Keine fremden Fighter
- Nur die 4 echten Champions in Champion-Kontexten
- Fightcard niemals als statisches Bild
- Eventdaten zentral pflegen
- Keine Secrets ins Repository

## Lokale Entwicklung

```bash
pnpm install
pnpm dev
```

## Prüfung

```bash
pnpm lint
pnpm build
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

## Projektphasen

- Phase 1: Öffentliches Hauptfrontend
- Phase 2: Detailseiten und öffentliche Zusatzseiten
- Phase 3: Admin Dashboard und Supabase
- Phase 4: QA, SEO, Mobile und Launch
- Phase 5: Betrieb und Content-Pflege

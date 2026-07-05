---
name: vercel-deploy-check
description: Use before deploying SmashTime or assessing launch readiness: local build, final route structure, env/secrets, Vercel image config, SEO/legal basics, hardcoded paths/test data, and public repository risks.
---

# Vercel Deploy Check

Deployment-Reife nach finalem Designplan, `AGENTS.md` und `SECURITY_NOTES.md`.

## Pflichtpruefungen

- `npm run build` muss lokal ohne relevante Fehler durchlaufen.
- Header/Footer/Navigation duerfen keine 404-Ziele haben.
- Finale Zielrouten und Legacy-Redirects bewusst behandeln.
- Keine lokalen absoluten Pfade (`C:\Users\...`, `/home/...`) im Code.
- Keine hartcodierten Admin-Testdaten, Fake-Logins oder sichtbaren Secrets.
- `.env*` bleibt ignoriert; keine Credential-Dateien committen.
- Supabase-Keys nur ueber Env, Service-Role-Key niemals im Client.
- RLS bleibt aktiv.
- `next/image` remotePatterns fuer Supabase Storage explizit, kein Wildcard-Proxy.
- SEO/Launch-Basics: Title/Description, OpenGraph, Sitemap/Robots/404, Legal-Seiten.
- Repository-Sichtbarkeit oeffentlich/privat als Risiko benennen, nicht selbst extern aendern.

## Harte Stopps

Stoppen und melden, wenn Zugangsdaten sichtbar wuerden, eine privilegierte Credential-Datei im Root gefunden wird, oder eine Aenderung ungesicherte Daten loeschen wuerde.

## Vorgehen

1. `git status` lesen und untracked/dirty Dateien respektieren.
2. Build ausfuehren und Output wirklich lesen.
3. Root und `src/**` nach Secrets, absoluten Pfaden, Testdaten und 404-Routen durchsuchen.
4. Ergebnis kurz als deploybar/nicht deploybar begruenden.

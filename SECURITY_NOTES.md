# SECURITY_NOTES.md – Sicherheitsstatus SmashTime

Diese Datei bündelt sicherheitsrelevante Regeln und den geprüften Ist-Stand rund um Supabase/Zugangsdaten. **Es werden hier keine tatsächlichen Secret-Werte genannt** – nur Fundort, Art des Risikos und empfohlene Maßnahme. Teil der Source of Truth zusammen mit `AGENTS.md` und `ROADMAP.md`.

Stand: 04. Juli 2026, basierend auf einem vollständigen Code-/Security-Audit.

---

## Grundregeln (siehe auch `AGENTS.md` Abschnitt 21)

- Supabase-Keys, `.env`-Inhalte, Tokens, Passwörter: niemals anzeigen, niemals loggen, niemals committen, niemals im Code hartcodieren.
- `.gitignore` muss Zugangsdaten ausschließen.
- Kein Service-Role-Key im Client-/Browser-Code.
- Keine losen Credential-Dateien oder Admin-Skripte im Projekt-Root.
- RLS bleibt für alle Tabellen aktiv.

---

## Offene kritische Punkte

### 1. `env supabase.txt` (Projekt-Root)

Enthält im Klartext einen Supabase Management/Personal Access Token, den anon key, einen als "secret anono" bezeichneten JWT (Payload trägt tatsächlich `role=service_role`) sowie ein DB-Passwort.

- Datei ist korrekt in `.gitignore` gelistet und war laut `git log -S`-Prüfung nie Teil eines Commits.
- Risiko: liegt unverschlüsselt im Arbeitsverzeichnis (Cloud-Sync, andere lokale Tools, KI-Workflows könnten sie lesen).
- **Empfohlene Maßnahme (Nutzer-Aktion):** Access Token, anon key, service_role key und DB-Passwort im Supabase-Dashboard rotieren, die Datei danach aus dem Projektordner entfernen bzw. in einen Passwort-Manager verschieben. Wurde dem Nutzer bereits im Chat mitgeteilt, Ausführung steht noch aus.

### 2. `supabase-temp.js` (Projekt-Root, bereinigt)

Node-Skript, das `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` aus `process.env` liest und `auth.admin.listUsers()` aufruft.

- Kein Secret war hartcodiert.
- **Status 05. Juli 2026:** Datei aus dem Projekt-Root entfernt und zusätzlich in `.gitignore` abgesichert.

### 3. Repository-Sichtbarkeit

Repository ist aktuell öffentlich, enthält aber produktiven Admin-/Supabase-bezogenen Code (Auth-Flows, Schema-Struktur). Empfehlung: auf privat stellen. Externe GitHub-Einstellung, nicht durch Code-Änderung lösbar.

---

## Bereits sauberer Ist-Stand (nicht mehr offen)

- `src/lib/supabase/config.ts`, `browser.ts`, `server.ts`: saubere Trennung Client/Server, ausschließlich `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`, kein privilegierter Key im Client-Pfad.
- `src/lib/admin/auth.ts`: echte serverseitige Prüfung (`auth.getUser()` + `admin_profiles.is_active`-Lookup), kein Stub, keine reine Client-Rollenprüfung.
- `src/app/admin/(dashboard)/layout.tsx`: serverseitiger Redirect-Gate, kein reiner Client-Schutz.
- `middleware.ts`: refresht die Session und leitet zusätzlich unautorisierte Zugriffe auf `/admin/*` (außer `/admin/login` selbst) direkt auf den Login um – zwei unabhängige Kontrollpunkte statt nur Layout-Redirect (Defense-in-Depth, seit 04. Juli 2026 umgesetzt). Die feingranulare Prüfung auf `admin_profiles.is_active` bleibt weiterhin Aufgabe des Layouts (`getAdminSession()`).
- `supabase/migrations/20260704125105_smashtime_admin_schema.sql`: RLS für alle 11 Tabellen aktiv, granulare Policies (öffentlich liest nur veröffentlichte/aktive Datensätze, Admin-Schreibzugriff über `private.is_active_admin()`), Storage-Bucket `smashtime-media` mit granularen Policies.
- `.env.local`: korrekt gitignored, nicht getrackt, enthält nur `NEXT_PUBLIC_*`-Werte + `VERCEL_OIDC_TOKEN`.
- Keine hartcodierten Keys (`eyJ`-Präfix, `service_role`, `sb-`) als String-Literal irgendwo in `src/` gefunden.
- Keine Treffer für Secret-Muster in der bisherigen Git-Historie (`git log --all -S`, grobe Heuristik).

---

## Erster Admin-Account (Erst-Admin-Prozess)

Es gibt bewusst keinen automatisierten Weg, einen Admin anzulegen (kein Seed-Skript mit privilegiertem Key im Code). Der erste Admin-Account wird manuell über das Supabase-Dashboard angelegt:

1. Supabase-Dashboard → **Authentication → Users → Add user** → E-Mail und Passwort setzen, "Auto Confirm User" aktivieren (kein Mail-Versand nötig).
2. Supabase-Dashboard → **SQL Editor** → folgendes Statement ausführen (ersetzt die E-Mail durch die des neuen Admins):

   ```sql
   insert into public.admin_profiles (user_id, role, display_name, is_active)
   select id, 'admin', 'Anzeigename', true
   from auth.users
   where email = 'admin@example.com'
   on conflict (user_id) do update set role = excluded.role, is_active = true;
   ```

3. Login unter `/admin/login` testen.

Dieser Weg braucht keinen Service-Role-Key und kein Secret-Handling im Code – nur den eigenen Dashboard-Zugang. Hinweis: kurze/einfache Passwörter (z. B. rein alphanumerisch, 8 Zeichen) sind für einen produktiven Admin-Zugang zu einer echten Datenbank riskant; vor dem Launch ein stärkeres Passwort setzen (siehe `ROADMAP.md` Phase 6).

## Punkte für Phase 5 (Supabase-Anbindung), sicherheitsrelevant

- Admin-CRUD-Server-Actions sollten den serverseitigen, session-gebundenen Supabase-Client nutzen (RLS greift über die eingeloggte Admin-Session) – **kein** Service-Role-Key für normale CRUD-Fälle.
- `next.config.ts` braucht `remotePatterns` für die Supabase-Storage-Domain, sobald Bilder von dort geladen werden – kein Wildcard, sonst wird `next/image` zum offenen Bild-Proxy.
- Kontaktformular (`ContactForm.tsx`): aktuell Client-Insert ohne serverseitige Validierung/Längenbegrenzung/Rate-Limit – vor produktivem Go-Live über eine Server Action/Route Handler absichern.
- `PageHero.tsx`/`EventHighlight.tsx` interpolieren Bild-URLs ungefiltert in `backgroundImage: url(...)`. Aktuell nur mit statischen Daten befüllt, unkritisch – sobald Admin/Supabase beliebige Bild-URLs liefert, URL validieren/whitelisten statt roh zu interpolieren.
- Es fehlt ein dokumentierter, sicherer Weg, den ersten `admin_profiles`-Eintrag anzulegen.
- Kein automatisierter Secret-Scan (z. B. Pre-Commit-Hook) vorhanden, der lose Dateien wie `env supabase.txt` künftig verhindern würde.

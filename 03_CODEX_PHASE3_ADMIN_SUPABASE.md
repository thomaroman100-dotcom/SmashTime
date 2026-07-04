# CODEX PHASE 3 – Admin Dashboard und Supabase

## Ziel

Baue das Admin-Dashboard und verbinde die Website mit Supabase.

Wichtig:
Vor Umsetzung zuerst planen lassen. Keine Secrets ausgeben. Keine Service Role Keys im Frontend.

## Regeln

- Supabase Auth verwenden.
- Admin-Routen schützen.
- Row Level Security aktivieren.
- Kein hart codiertes Admin-Passwort.
- Keine Secrets im Code.
- Alles sichtbar auf Deutsch.
- Admin-Design muss zum SmashTime-Stil passen.
- Öffentliche Website darf weiterhin ohne Admin-Login erreichbar sein.

## Admin-Routen

```text
/admin/login
/admin
/admin/champions
/admin/events
/admin/fightcards
/admin/news
/admin/sponsors
/admin/contact
/admin/media
/admin/settings
```

## Tabellen

```text
admin_profiles
champions
events
fight_cards
news_posts
sponsors
contact_requests
media_assets
site_settings
event_results
event_gallery
```

## Hauptfunktionen

### Champions
- anlegen
- bearbeiten
- deaktivieren
- Bild zuweisen
- Reihenfolge
- Championstatus

### Events
- anlegen
- bearbeiten
- veröffentlichen
- archivieren
- Datum, Ort, Einlass, Beginn
- Disziplinen
- Ticketlink

### Fightcards
- Event auswählen
- Kampf hinzufügen
- Reihenfolge ändern
- Main Event / Co-Main / Undercard
- sichtbar/unsichtbar
- freie Gegnernamen möglich
- keine Fake-Fighterbilder

### News
- Beitrag anlegen
- Slug
- Kategorie
- Teaser
- Inhalt
- Bild
- veröffentlichen/entwerfen
- related News

### Sponsoren
- Sponsor anlegen
- Logo
- Website
- Paket
- Reihenfolge
- aktiv/inaktiv

### Kontakt
- Kontaktanfragen lesen
- Status: neu, gelesen, erledigt
- Kategorie
- Notizen intern

### Medien
- Upload
- Asset-Typ
- Alt-Text
- Verwendung
- keine fremden Fighter ohne Prüfung

### Einstellungen
- Social Links
- E-Mail
- Ticketlink
- Startseiten-CTA
- Footer-Texte

## Fertig, wenn

- Login funktioniert
- Admin-Routen geschützt sind
- RLS aktiv ist
- CRUD funktioniert
- öffentliche Seiten Daten aus Supabase lesen
- Build/Lint sauber

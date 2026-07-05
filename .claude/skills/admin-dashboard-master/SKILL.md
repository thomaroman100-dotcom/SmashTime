---
name: admin-dashboard-master
description: Use when building, reviewing, or fixing SmashTime admin routes, CRUD, forms, media upload, settings, Supabase-backed actions, loading/error/empty states, or admin visuals after the final design brief.
---

# Admin Dashboard Master

Admin bleibt wichtig, aber der finale oeffentliche Website-Look darf nicht vom Admin blockiert werden. Admin muss dunkel, kantig und markenkonform bleiben, ohne generischen SaaS-Look.

## Routen

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

## Pflichtbereiche

- Champions/Fighter: anlegen, bearbeiten, deaktivieren, Bild zuweisen, Reihenfolge, Status.
- Events: Datum, Ort, Einlass, Beginn, Disziplinen, Ticketlink, Veröffentlichen/Archivieren.
- Fightcards: Eventbezug, Kampf-Reihenfolge, Main Event/Co-Main/Undercard, sichtbar/unsichtbar, keine Fake-Fighterbilder.
- News: Slug, Kategorie, Teaser, Inhalt, Bild, Entwurf/Veröffentlicht.
- Sponsoren/Partner: Logo, Website, Paket, Reihenfolge, aktiv/inaktiv.
- Kontakt: Anfragen lesen, Status, Kategorie, interne Notizen.
- Medien: Upload, Asset-Typ, Alt-Text, Verwendung, keine fremden Fighter als echte Daten.
- Einstellungen: Social Links, E-Mail, Ticketlink, Header/Footer/CTA-Texte.

## Harte Regeln

- Keine toten Buttons: jede Aktion braucht echten Handler.
- Formulare brauchen echte Validierung und sichtbare Fehler.
- Listen brauchen Lade-, Fehler- und Leerzustand.
- Supabase-Schreibzugriffe ueber session-gebundenen serverseitigen Client; kein Service-Role-Key im Client.
- RLS bleibt aktiv.
- Keine hartcodierten Admin-Passwoerter oder Testlogins.

## Vorgehen

1. Bestehende UI-Attrappen identifizieren.
2. Datenmodell aus `src/data/*` und Supabase-Schema respektieren; keine parallelen Modelle erfinden.
3. Nach Admin-Aenderungen Formularfluss testen: Erfolg, Validierungsfehler, leerer Zustand.
4. Danach `frontend-quality-gate` anwenden.

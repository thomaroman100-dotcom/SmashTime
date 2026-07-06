# REFERENCE_IMAGES.md - Referenzen und Assets

Der finale Designbrief `smashtime_claude_design_brief_final.md` ist fuer das oeffentliche Frontend die primaere Referenz. Die Bilder in `Referenzbilder/` bleiben wichtig fuer Details, Crops, Grunge-Stimmung, Admin-Ansichten und alte Seitenzustaende, sind aber sekundär, wenn sie dem finalen Brief widersprechen.

## Grundregel

Design ja, Inhalt nein.

Nicht aus Referenzbildern uebernehmen:

- falsche Events, Orte, Daten oder Jahreszahlen
- Beispielnamen wie Khalidov, Martinez, Adrian, Lucas, Emilia usw.
- englische UI-Begriffe, wenn deutsche Labels vorgesehen sind
- eingebrannte Fightcard-Texte als echte Daten
- KI-Fighter als echte Champions oder reale Teilnehmer

## Finale Public-Referenz

Der finale Mockup-/Briefzustand beschreibt die neue Startseite:

```text
Header
Hero: KEINE REGELN. NUR RESPEKT. SMASHTIME.
Countdown
Main-Fight-Banner
Unsere Champions
Über SmashTime
Kommende Events
Top Fighter Rangliste
Neuigkeiten
Ticket CTA
Footer
```

Diese Struktur hat Vorrang vor aelteren Startseiten-Screens.

## Ordnerstruktur

```text
Referenzbilder/
├── Assets/
├── Public/
│   ├── Desktop/
│   └── Mobile/
└── Admin/
    ├── Desktop/
    └── Mobile/
```

Weitere Quellordner:

```text
Champions Bilder/   - echte Champion-Fotos, nur Champion-/Fighter-Kontexte
Website Assets/     - sortierte Quellassets
public/images/      - von der Website verwendete Assets
```

## Public-Bilder

Die bisherigen Public-Bilder bleiben fuer Layoutdetails nutzbar, besonders fuer Unterseiten:

```text
Referenzbilder/Public/Desktop/startseite.png
Referenzbilder/Public/Desktop/champions-uebersicht.png
Referenzbilder/Public/Desktop/champion-profil.png
Referenzbilder/Public/Desktop/neuigkeiten-uebersicht.png
Referenzbilder/Public/Desktop/neuigkeiten-detail.png
Referenzbilder/Public/Desktop/veranstaltungen.png
Referenzbilder/Public/Desktop/veranstaltung-rueckblick.png
Referenzbilder/Public/Desktop/kampfabend.png
Referenzbilder/Public/Desktop/tickets.png
Referenzbilder/Public/Desktop/ueber-uns.png
Referenzbilder/Public/Desktop/sponsoren.png
Referenzbilder/Public/Desktop/kontakt.png
Referenzbilder/Public/Mobile/*.png
```

## Public Profil- und Konto-Referenzen

Neue Referenzen vom 06.07.2026 fuer den oeffentlichen Profilbereich liegen sortiert unter:

```text
Referenzbilder/Public/Profile/01-mitglied-profil-uebersicht.png           -> /account Uebersicht fuer normales Mitglied
Referenzbilder/Public/Profile/02-kaempfer-profil-uebersicht.png           -> /account Uebersicht fuer Kaempfer mit Fighter-Daten
Referenzbilder/Public/Profile/03-admin-profil-uebersicht.png              -> /account Uebersicht fuer Admin/Mitarbeiter mit Adminzugriff
Referenzbilder/Public/Profile/04-mitglied-profil-bearbeiten.png           -> /account#profil-bearbeiten Basis-Bearbeitung fuer Mitglied
Referenzbilder/Public/Profile/05-admin-profil-bearbeiten.png              -> /account#profil-bearbeiten Admin-/Mitarbeiter-Variante
Referenzbilder/Public/Profile/06-kaempfer-profil-bearbeiten-erweitert.png -> spaetere erweiterte Kaempfer-Bearbeitung
```

Alle sechs Profil-Referenzen sind Desktop-Screens mit `1672x941px`.

Umsetzungsentscheidung:

- Verbindlich fuer v1: gemeinsamer Topbar-Aufbau rechts mit Profil-Trigger, Rollenlabel, Dropdown, Status und echten Zielen.
- Verbindlich fuer v1: Profil-Hero mit Avatar/Initialen, Name, Rolle, Status, Bearbeiten-CTA und realen Sessiondaten.
- Verbindlich fuer v1: Uebersichtskarten fuer Konto, Rolle, Kontakt/Sicherheit und naechste sinnvolle Aktion.
- Verbindlich fuer v1: Profilbearbeitung als echtes Formular fuer eigene harmlose Profildaten.
- Sekundaer/future: Fake-Eventlisten, Aktivitaetszahlen, Sponsoren, Video-Highlights, vollstaendige Kampfstatistiken und Social-Media-Listen, solange keine echten Datenquellen existieren.
- Nicht uebernehmen: Beispielpersonen, Beispielorte, Eventnummern, Tickets, Statistiken, Sponsorlogos und eingebrannte Bildinhalte.

Mapping zur neuen Route-Struktur:

```text
/neuigkeiten      -> /news
/veranstaltungen  -> /events
/sponsoren        -> /partners
/kontakt          -> /contact
/ueber-uns        -> /about
/fight-night      -> /events oder eigener Event-/Kampfabend-Bereich
```

Alte deutsche Routen duerfen als Redirects/Aliases bestehen bleiben.

## Admin-Bilder

`Referenzbilder/Admin/Desktop/` und `Referenzbilder/Admin/Mobile/` bleiben Referenz fuer Admin-Ansichten. Admin muss dunkel und kantig bleiben, aber nicht die oeffentliche Startseite kopieren.

Finale Admin-Referenz (Stand 05.07.2026, verbindlich fuer den Admin-Neuaufbau):

```text
Referenzbilder/Admin/Desktop/uebersicht-dashboard.png            -> /admin (Übersicht)
Referenzbilder/Admin/Desktop/champions-uebersicht.png            -> /admin/champions
Referenzbilder/Admin/Desktop/veranstaltungen-liste.png           -> /admin/events
Referenzbilder/Admin/Desktop/veranstaltung-anlegen.png           -> /admin/events/new + /admin/events/[id]
Referenzbilder/Admin/Desktop/fightcard-uebersicht.png            -> /admin/fightcards
Referenzbilder/Admin/Desktop/fightcard-kampf-hinzufuegen-modal.png -> Modal "Kampf hinzufügen"
Referenzbilder/Admin/Desktop/fightcard-kampf-bearbeiten-modal.png  -> Modal "Kampf bearbeiten"
Referenzbilder/Admin/Desktop/neuigkeiten-liste.png               -> /admin/news
Referenzbilder/Admin/Desktop/neuigkeit-erstellen.png             -> /admin/news/new
Referenzbilder/Admin/Desktop/neuigkeit-bearbeiten.png            -> /admin/news/[id]
Referenzbilder/Admin/Desktop/sponsoren-liste.png                 -> /admin/sponsors (Gesamtliste)
Referenzbilder/Admin/Desktop/sponsoren-pakete-ansicht.png        -> /admin/sponsors (Ansicht "Nach Paketen")
Referenzbilder/Admin/Desktop/sponsor-hinzufuegen.png             -> /admin/sponsors/new
Referenzbilder/Admin/Desktop/sponsor-bearbeiten.png              -> /admin/sponsors/[id]
Referenzbilder/Admin/Desktop/kontaktanfragen-liste.png           -> /admin/contact
Referenzbilder/Admin/Desktop/kontaktanfrage-antwort-verfassen.png -> /admin/contact (Antwort-Panel)
Referenzbilder/Admin/Desktop/kontaktanfragen-inbox-tabs.png      -> aeltere Variante mit Tabs (sekundaer)
Referenzbilder/Admin/Desktop/medien-bibliothek.png               -> /admin/media
Referenzbilder/Admin/Desktop/medien-datei-hochladen-modal.png    -> Modal "Datei hochladen"
Referenzbilder/Admin/Desktop/medien-kategorie-modal.png          -> Modal "Kategorie hinzufügen"
Referenzbilder/Admin/Desktop/globale-zustaende.png               -> /admin/global-states (Modals, Toasts, Alerts)
Referenzbilder/Admin/Desktop/benutzer-uebersicht.png             -> /admin/members (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/benutzer-rollen-berechtigungen.png  -> /admin/members/roles (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/benutzer-bearbeiten.png             -> /admin/members/[userId] (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/benutzer-hinzufuegen.png            -> /admin/members/new (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/benutzer-verifizierungen-freigaben.png -> /admin/members/verifications (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/benutzer-rolle-bearbeiten.png       -> /admin/members/roles/[role] (lokale Quelldatei fehlt aktuell, Chat-Screen als Referenz genutzt)
Referenzbilder/Admin/Desktop/einstellungen-uebersicht.png        -> /admin/settings
Referenzbilder/Admin/Desktop/einstellungen-allgemein.png         -> /admin/settings Bereich "Allgemein"
Referenzbilder/Admin/Desktop/einstellungen-design-branding.png   -> /admin/settings Bereich "Design & Branding"
Referenzbilder/Admin/Desktop/einstellungen-benachrichtigungen-email.png -> /admin/settings Bereich "Benachrichtigungen & E-Mail"
Referenzbilder/Admin/Desktop/einstellungen-konto-sicherheit.png  -> /admin/settings Bereich "Konto & Sicherheit"
Referenzbilder/Admin/Desktop/einstellungen-integrationen-api.png -> /admin/settings Bereich "Integrationen & API"
Referenzbilder/Admin/Desktop/einstellungen-system-backups.png    -> /admin/settings Bereich "System & Backups"
```

Beispiel-Daten in diesen Screens (Maximilian Kurz, Darius Johnson, MusclePharm, Kruger Sports, SmashTime 32-39, Wiener Stadthalle usw.) sind reine Platzhalter und werden nie als echte Inhalte uebernommen.

## Asset-Regeln

- Finale Website-Pfade sollen sprechend sein: kleingeschrieben, Bindestriche, keine `ChatGPT Image...`-Namen.
- Logo kanonisch: `public/images/logo/smashtime-logo.png`.
- Dateien mit `Kopie` im Namen sind Aufraeumkandidaten, nicht dauerhafte Codepfade.
- Bilder mit sichtbarem Text duerfen diesen Text nicht als einzige Informationsquelle tragen.
- Championbilder nur fuer echte Champion-/Fighter-Kontexte.

# Claude instructions – Bernds Body App / Beta

## Wichtigster Grundsatz

`Beta/` ist die aktuelle Version der App. Arbeite ausschließlich dort, wenn der Auftrag die aktuelle App betrifft.

Die App ist bewusst einfach aufgebaut: Die fast gesamte Anwendung befindet sich in `Beta/app.js`.

**Ziel dieser Datei:** Token sparen. Nicht bei jeder Änderung die komplette `app.js` lesen.

## Vorgehen bei jeder Änderung

1. `PROJECT_MAP.md` lesen.
2. Aufgabe einem Bereich zuordnen.
3. Nach dem genannten stabilen Suchbegriff suchen.
4. Nur die relevante Funktion/Komponente plus direkte Abhängigkeiten lesen.
5. Kleinste sinnvolle Änderung durchführen.
6. Bestehende Logik wiederverwenden.
7. Keine unnötige Umstrukturierung der großen `app.js`.

## Stabiler Code-Navigator

| Aufgabe | Suchanker |
|---|---|
| Geräte | `EQUIPMENT` |
| Gerätekategorien | `EQUIPMENT_CATEGORY_ORDER` |
| Übungen | `EXERCISE_LIBRARY` |
| Speicherung | `loadKey`, `saveKey` |
| Backup | `collectBackup`, `backup` |
| CSV | `CSV`, `csv` |
| 1RM | `1RM`, `Epley` |
| Rekorde | `PR`, `Rekord`, `NEUER REKORD` |
| Geräte-UI | `EquipmentView` |
| Plan-Editor | `PlanEditor` |
| Übersicht | `Dashboard` |
| Tagebuch | `Tagebuch` |
| Körperverlauf | `Körperverlauf` |
| Muskelgruppen-Balance | `Balance`, `Muskelgruppe` |
| Design | `GlobalStyles` |
| Hauptlogik | `App` |
| Offline/Cache | `service-worker.js` |
| HTML-Einstieg | `index.html` |

## IDs und gespeicherte Daten

**Niemals bestehende Geräte- oder Übungs-IDs ändern**, sofern keine bewusste Datenmigration beauftragt wurde.

Gespeicherte Trainingspläne und Tagebucheinträge können auf diese IDs verweisen.

Auch Speicher-Schlüssel nicht einfach umbenennen. Vor Änderungen an Datenstrukturen Backup-/Restore-Logik prüfen.

## Was nicht nötig ist

- Für eine reine Textänderung nicht die ganze `app.js` lesen.
- Für eine CSS-Änderung nicht die Datenlogik analysieren.
- Für eine Übungsergänzung nicht das Dashboard analysieren.
- Für eine kleine UI-Änderung nicht `App` komplett untersuchen.
- Den Service Worker nicht ändern, wenn die Aufgabe nichts mit Cache/Offline/Update zu tun hat.

## `index.html`

Enthält:
- Root-Element
- `window.storage` als `localStorage`-Wrapper mit Präfix `bba:`
- Laden von `app.js`
- Service-Worker-Registrierung

## `app.js`

Enthält:
- Stammdaten
- Speicherfunktionen
- Hilfsfunktionen/Berechnungen
- CSS über `GlobalStyles`
- React-Komponenten
- `App`

Bei kleinen Änderungen gezielt suchen statt die gesamte Datei zu analysieren.

## `service-worker.js`

Nur bei Cache-/Offline-/Update-Themen anfassen.

Der aktuelle Cache-Name ist `bernds-body-app-v15`.

## Nach Änderungen

Prüfe mindestens den direkt betroffenen Bereich und offensichtliche Syntax-/Referenzfehler.

Wenn eine Änderung an `app.js` trotz erfolgreichem Deployment scheinbar nicht sichtbar wird, an den Service Worker bzw. Cache denken.

## Grundregel

**Erst navigieren, dann lesen, dann ändern.**

# Claude instructions – Bernds Body App / Beta

## Wichtigster Grundsatz

`Beta/` ist die aktuelle Version der App. Arbeite ausschließlich dort, wenn der Auftrag die aktuelle App betrifft.

Die App ist seit der Modul-Aufteilung in mehrere logisch getrennte Dateien aufgeteilt (siehe `PROJECT_MAP.md`). `app.js` ist nur noch der schlanke Einstiegspunkt (Importe + Hauptkomponente `App` + React-Start).

**Ziel dieser Datei:** Token sparen. Bei jeder Änderung nur die tatsächlich betroffene(n) Datei(en) lesen — nicht mehr die komplette App.

## Vorgehen bei jeder Änderung

1. `PROJECT_MAP.md` lesen.
2. Aufgabe einem Bereich zuordnen.
3. In der Karte die zuständige Datei nachschlagen.
4. Nur diese Datei (plus, falls nötig, ihre direkten Importe am Dateianfang) öffnen.
5. Kleinste sinnvolle Änderung durchführen.
6. Bestehende Logik wiederverwenden (aus `utils/`, `storage/`, `components/shared.js`).
7. Keine unnötige Umstrukturierung der Modul-Aufteilung.

## Stabiler Code-Navigator

| Aufgabe | Datei | Suchanker |
|---|---|---|
| Geräte | `data/equipment.js` | `EQUIPMENT` |
| Gerätekategorien | `data/equipment.js` | `EQUIPMENT_CATEGORY_ORDER` |
| Übungen | `data/exercises.js` | `EXERCISE_LIBRARY` |
| Planvorlagen | `data/plans.js` | `PLAN_TEMPLATES` |
| Storage-Keys/Defaults/Nav-Tabs | `data/constants.js` | `STORAGE_KEYS` |
| Icons | `data/icons.js` | — |
| Speicherung | `storage/storage.js` | `loadKey`, `saveKey` |
| Backup | `storage/storage.js` | `collectBackup`, `restoreBackup` |
| CSV | `storage/export.js` | `CSV`, `csv` |
| Berechnungen/1RM/PR | `utils/calculations.js` | `1RM`, `Epley`, `detectPRs` |
| Datumsfunktionen | `utils/dates.js` | `formatDate`, `startOfWeek` |
| Design | `styles/GlobalStyles.js` | `GlobalStyles` |
| Kleine UI-Bausteine | `components/shared.js` | `StatCard`, `GlitchTitle` |
| Geräte-UI | `components/EquipmentView.js` | `EquipmentView` |
| Übungen-UI | `components/Exercises.js` | `ExercisesView` |
| Plan-Editor | `components/PlanEditor.js` | `PlanEditor` |
| Laufendes Training | `components/ActiveWorkout.js` | `ActiveWorkoutView` |
| Übersicht | `components/Dashboard.js` | `Dashboard` |
| Tagebuch/Körperverlauf | `components/Journal.js` | `DiaryView` |
| Setup | `components/Setup.js` | `SettingsView` |
| Hauptlogik/Navigation | `app.js` | `App` |
| Offline/Cache | `service-worker.js` | — |
| HTML-Einstieg | `index.html` | — |

## IDs und gespeicherte Daten

**Niemals bestehende Geräte- oder Übungs-IDs ändern** (`data/equipment.js`, `data/exercises.js`), sofern keine bewusste Datenmigration beauftragt wurde.

Gespeicherte Trainingspläne und Tagebucheinträge können auf diese IDs verweisen.

Auch Speicher-Schlüssel (`data/constants.js`, `STORAGE_KEYS`) nicht einfach umbenennen. Vor Änderungen an Datenstrukturen `storage/storage.js` (Backup-/Restore-Logik) prüfen.

## Was nicht nötig ist

- Für eine reine Textänderung in einer Komponente nicht die ganze Datei-Historie/Importe analysieren.
- Für eine CSS-Änderung nicht die Datenlogik analysieren — nur `styles/GlobalStyles.js` öffnen.
- Für eine Übungsergänzung (`data/exercises.js`) nicht `components/Dashboard.js` analysieren.
- Für eine kleine UI-Änderung in einer einzelnen Komponente nicht `app.js` komplett untersuchen.
- Den Service Worker nicht ändern, wenn die Aufgabe nichts mit Cache/Offline/Update oder neuen/entfernten Dateien zu tun hat.
- Bei einer Änderung in EINER Komponente nicht automatisch alle anderen Komponenten-Dateien mitlesen — die Karte in `PROJECT_MAP.md` zeigt, welche Datei tatsächlich zuständig ist.

## `index.html`

Enthält (unverändert seit der Modul-Aufteilung):
- Root-Element
- `window.storage` als `localStorage`-Wrapper mit Präfix `bba:`
- Laden von `app.js` als ES-Modul (der Browser lädt die weiteren Module automatisch über die `import`-Anweisungen in `app.js` und den Unterdateien nach)
- Service-Worker-Registrierung

## `app.js`

Enthält nur noch:
- Importe aller benötigten Module (`data/`, `storage/`, `utils/`, `styles/`, `components/`)
- Die Hauptkomponente `App` (Navigation, globaler State, Zusammenspiel der Bereiche, Laden/Speichern beim Start)
- Den React-Start (`ReactDOM.createRoot(...).render(...)`)

Die eigentlichen Daten, Berechnungen, Styles und einzelnen Bildschirm-Komponenten liegen in den jeweiligen Unterordnern — siehe `PROJECT_MAP.md`.

## `service-worker.js`

Nur bei Cache-/Offline-/Update-Themen anfassen — oder wenn eine Datei hinzugefügt/entfernt/umbenannt wird (dann muss sie im `APP_SHELL`-Array ergänzt bzw. entfernt werden).

Der aktuelle Cache-Name ist `bernds-body-app-v16`.

**Wichtig:** Alle `.js`-Module der App sind „Network First" gelistet (nicht mehr nur `app.js`). Wird eine neue Modul-Datei angelegt, deren Dateiname in `NETWORK_FIRST` ergänzen, damit Änderungen daran sofort sichtbar werden — und in `APP_SHELL`, damit sie offline verfügbar ist.

## Neue Datei anlegen

Wird für eine Aufgabe eine neue Datei sinnvoll (z. B. eine neue Komponente):
1. In den passenden Unterordner legen (`components/`, `utils/`, `data/`, `storage/` oder `styles/`).
2. Mit `export` exportieren, wo gebraucht mit `import` einbinden.
3. In `service-worker.js` zu `APP_SHELL` und `NETWORK_FIRST` hinzufügen.
4. In `PROJECT_MAP.md` eintragen (Abschnitt „Projektstruktur" und „Schnellnavigation").

Nicht für jede kleine Funktion eine eigene Datei anlegen — nur wenn ein eigenständiger, klar abgrenzbarer Bereich entsteht.

## Nach Änderungen

Prüfe mindestens den direkt betroffenen Bereich (die geänderte Datei) und offensichtliche Syntax-/Referenzfehler (fehlende `import`/`export`, falsche Pfade).

Wenn eine Änderung trotz erfolgreichem Deployment scheinbar nicht sichtbar wird, an den Service Worker bzw. Cache denken.

## Grundregel

**Erst navigieren (PROJECT_MAP.md), dann die eine zuständige Datei lesen, dann ändern.**

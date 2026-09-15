# Bernds Body App – PROJECT_MAP

## Zweck

Diese Datei ist ein Navigationsindex für Claude. Sie soll verhindern, dass bei kleinen Änderungen mehr Dateien als nötig gelesen werden müssen.

**Arbeitsregel:** Erst den passenden Bereich über diese Karte bestimmen, dann NUR die betreffende Datei (plus ihre direkten Importe, falls nötig) öffnen.

**Wichtig seit der Modul-Aufteilung:** Die App besteht nicht mehr aus einer einzigen riesigen `app.js`, sondern aus vielen kleinen, über ES-Module (`import`/`export`) verbundenen Dateien. Für die meisten Änderungen reicht es, genau EINE Datei zu öffnen.

---

## 1. Projektstruktur

```text
Beta/
├── index.html
├── app.js                       Einstiegspunkt: bindet alles zusammen, startet React
├── data/
│   ├── icons.js                 Zentrale Icon-Importe (lucide-react)
│   ├── constants.js             Storage-Keys, Standardwerte, Auswahllisten, Nav-Tabs
│   ├── equipment.js             EQUIPMENT, EQUIPMENT_CATEGORY_ORDER, MUSCLE_GROUPS
│   ├── exercises.js             EXERCISE_LIBRARY
│   └── plans.js                 PLAN_TEMPLATES
├── storage/
│   ├── storage.js                loadKey, saveKey, collectBackup, restoreBackup
│   └── export.js                 CSV-Export + downloadTextFile
├── utils/
│   ├── calculations.js           BMI, Kalorien, 1RM, PR-Erkennung, uid, ...
│   └── dates.js                  Datumsformatierung, Wochenstart, Datums-Parsing
├── styles/
│   └── GlobalStyles.js           Komplettes CSS (Dark/Light Mode)
├── components/
│   ├── shared.js                 Kleine wiederverwendete UI-Bausteine
│   ├── Dashboard.js               Übersicht/Dashboard
│   ├── EquipmentView.js           Geräte-Tab
│   ├── Exercises.js               Übungen-Tab (inkl. Historie, Muskeldiagramm)
│   ├── PlanEditor.js              Plan-Editor, Pläne-Tab, Vorlagen-Auswahl
│   ├── ActiveWorkout.js           Laufendes Training + Pausen-Timer
│   ├── Journal.js                 Tagebuch-Tab + Körperverlauf
│   └── Setup.js                   Setup-Tab (Profile, Backup, CSV)
├── service-worker.js
├── manifest.json
├── README.md
└── Icons / weitere statische Dateien
```

### `index.html`

Unverändert gegenüber der alten Struktur. Zuständig für:
- HTML-Grundgerüst
- `<div id="root">` als React-Mountpoint
- `window.storage` als Wrapper um `localStorage`
- Laden von `app.js` als ES-Modul (`<script type="module" src="./app.js">`) — der Browser lädt daraufhin automatisch alle von `app.js` importierten Module nach
- Registrierung und Update des Service Workers

### `app.js`

**Neuer, schlanker Einstiegspunkt.** Enthält nur noch:
1. Die Importe aller benötigten Module (Daten, Storage, Utils, Styles, Komponenten)
2. Die Hauptkomponente `App` (Navigation, globaler State, Zusammenspiel der Bereiche)
3. Den React-Start (`ReactDOM.createRoot(...).render(...)`) ganz unten

Die früheren Hauptbereiche (Stammdaten, Speicherfunktionen, Hilfsfunktionen, Styles, einzelne Komponenten) liegen jetzt in eigenen Dateien — siehe Tabelle unten.

### `service-worker.js`

Offline- und Cache-Logik. Der aktuelle Cache-Name ist `bernds-body-app-v16` (erhöht wegen der Modul-Aufteilung). Alle `.js`-Module der App werden „Network First" behandelt (nicht mehr nur `app.js` allein), damit Änderungen an JEDER Datei sofort sichtbar werden.

---

## 2. Architektur

```text
index.html
   │
   ├── window.storage
   │      └── localStorage mit Präfix "bba:"
   │
   └── app.js  (Einstiegspunkt, importiert:)
          ├── data/icons.js            (lucide-react Icons)
          ├── data/constants.js        (Storage-Keys, Defaults, Nav-Items)
          ├── data/equipment.js        (EQUIPMENT, Kategorien, Muskelgruppen)
          ├── data/exercises.js        (EXERCISE_LIBRARY)
          ├── storage/storage.js       (loadKey/saveKey/Backup)
          ├── storage/export.js        (CSV-Export)
          ├── utils/dates.js
          ├── utils/calculations.js
          ├── styles/GlobalStyles.js
          └── components/*             (Dashboard, EquipmentView, Exercises,
                                          PlanEditor, ActiveWorkout, Journal, Setup;
                                          shared.js wird von mehreren Komponenten
                                          importiert, nicht direkt von app.js)

service-worker.js
   └── Cache / Offline / Update (kennt alle Modul-Dateien im APP_SHELL)
```

React 18.3.1, recharts und lucide-react werden weiterhin direkt über `https://esm.sh/...` importiert — keine Build-Tools, keine Bundler. Der Browser lädt jedes importierte Modul einzeln per HTTP nach (funktioniert auf GitHub Pages ohne weiteres Setup).

**Abhängigkeitsrichtung:** `data/` und `utils/` und `storage/` haben (fast) keine Abhängigkeiten untereinander außer zu `data/constants.js` bzw. `data/equipment.js`. `components/` dürfen von `data/`, `utils/`, `storage/`, `styles/` und `components/shared.js` importieren — sowie in Einzelfällen von anderen `components/`-Dateien (siehe Abschnitt 21). `app.js` importiert von allem. Es gibt keine zirkulären Importe.

---

## 3. Stammdaten – hier zuerst suchen

### `EQUIPMENT` → Datei: `data/equipment.js`

Enthält die fest eingebauten Geräte inklusive stabiler IDs, Namen und Kategorien.

Typische Änderungen:
- Gerät hinzufügen
- Gerätenamen ändern
- Gerätekategorie ändern

**Wichtig:** Bestehende Geräte-IDs nicht ändern. Gespeicherte Pläne und Trainingseinträge können darauf verweisen.

### `EQUIPMENT_CATEGORY_ORDER` → Datei: `data/equipment.js`

Legt die Reihenfolge der Gerätekategorien fest.

Aktuelle Kategorien:
- Freie Gewichte
- Bank
- Rack
- Kabel
- Maschinen
- Cardio
- Funktional
- Zubehör

### `MUSCLE_GROUPS` → Datei: `data/equipment.js`

Zentrale Liste der Muskelgruppen. Wird unter anderem für Filter und Tags verwendet.

### `EXERCISE_LIBRARY` → Datei: `data/exercises.js`

Zentrale Bibliothek der vordefinierten Übungen.

Ein Übungseintrag kann unter anderem enthalten:
- `id`
- `name`
- `equipment`
- `muscles`
- `description`
- `executionSteps`
- `commonMistakes`
- `bodyweightFactor`
- `trackingType`
- Werte für Kalorienberechnung

**Wichtig:** Bestehende Übungs-IDs nicht ändern.

### Wenn eine neue feste Übung benötigt wird

1. `data/exercises.js` öffnen.
2. Neue eindeutige `id` vergeben.
3. Nur benötigte Eigenschaften ergänzen.
4. Prüfen, ob referenzierte Geräte-IDs in `data/equipment.js` existieren.

---

## 4. Speicherung

`index.html` definiert `window.storage` als dünnen Async-Wrapper um `localStorage`.

Speicherpräfix:

```text
bba:
```

Verfügbare Operationen:
- `get`
- `set`
- `delete`
- `list`

Darüber liegen die eigentlichen App-Speicherfunktionen in **`storage/storage.js`** (`loadKey`, `saveKey`, `collectBackup`, `restoreBackup`). Die Storage-Keys selbst (`STORAGE_KEYS`) stehen in **`data/constants.js`**.

**Bei Änderungen an gespeicherten Daten zuerst `storage/storage.js` und `data/constants.js` (STORAGE_KEYS) öffnen.**

Nicht parallel ein zweites Speichersystem einführen, wenn die bestehende Abstraktion verwendet werden kann.

---

## 5. Backup / Import / Export

Die App besitzt Backup-Funktionen und zusätzlich CSV-Export.

| Funktion | Datei |
|---|---|
| `collectBackup`, `restoreBackup` | `storage/storage.js` |
| `csvEscape`, `csvRow`, `buildWorkoutsCSV`, `buildBodyLogCSV`, `downloadTextFile` | `storage/export.js` |

CSV-Export betrifft insbesondere:
- Tagebuch
- Körperverlauf

CSV ist Export, nicht der normale Wiederherstellungsmechanismus des Backups.

Bei Änderungen am Datenformat immer prüfen, ob `storage/storage.js` (Backup/Restore) und `storage/export.js` (CSV) davon betroffen sind.

---

## 6. Berechnungen / Hilfsfunktionen

Datei: **`utils/calculations.js`** — u. a.:
- `calcAge`, `calcBMI`
- `formatDurationMMSS`, `formatSetLabel`
- `estimateMet`, `calcSetKcal`, `computeLogKcal` (Kalorien)
- `recalcBodyweightExercisesInPlans`
- `computeLogVolume`, `calcEstimated1RM`, `bestValueForSet`, `detectPRs` (1RM/PR)
- `equipmentNames`, `newProfile`, `uid`, `filterByRange`

Datei: **`utils/dates.js`** — u. a.:
- `parseLocalDateInput`, `formatDateShort`, `formatDateLong`, `startOfWeek`

Bei einer Rechenänderung zuerst die betreffende Hilfsfunktion in einer dieser beiden Dateien suchen und nicht direkt die UI ändern.

---

## 7. 1RM

Die Übungshistorie kann ein geschätztes 1RM anzeigen.

Die Schätzung verwendet die Epley-Formel: `calcEstimated1RM` in `utils/calculations.js`.

**Bei Änderungen:** `utils/calculations.js` öffnen, nach `1RM` bzw. `calcEstimated1RM` suchen. Danach prüfen, wo der Wert angezeigt wird (`components/Exercises.js`, `ExerciseHistoryModal`).

---

## 8. Persönliche Rekorde (PR)

Beim Abschluss eines Trainings können neue Bestwerte erkannt werden (`detectPRs` in `utils/calculations.js`, aufgerufen in `app.js`).

Die aktuelle Version unterstützt Rekorde unter anderem für:
- höheres Gewicht
- längere Strecke
- längere Zeit

Im Tagebuch (`components/Journal.js`, `DiaryEntry`) wird ein neuer Rekord dauerhaft gekennzeichnet (`NEUER REKORD`).

**Bei Änderungen:** zuerst `utils/calculations.js` (`detectPRs`), danach ggf. `components/Journal.js` für die Anzeige.

---

## 9. Trainingspläne

Es gibt Planvorlagen in **`data/plans.js`** (`PLAN_TEMPLATES`) für:
- Ganzkörper (Einsteiger)
- Push
- Pull
- Legs
- Ganzkörper (Fortgeschritten)

Der Plan-Editor sowie die Pläne-Übersicht liegen in **`components/PlanEditor.js`** (`PlanEditor`, `PlansView`, `PlanExerciseRow`, `TemplatePickerModal`).

### Änderung am Plan-Editor

→ `components/PlanEditor.js` öffnen, nach `PlanEditor` suchen.

### Änderung einer Vorlage

→ `data/plans.js` öffnen, den jeweiligen Vorlagen-Namen suchen.

### Achtung

Planobjekte können auf Übungs-IDs verweisen. Deshalb bestehende Übungs-IDs (`data/exercises.js`) nicht ändern.

---

## 10. Gerätebereich

Die Komponente `EquipmentView` (Datei **`components/EquipmentView.js`**) ist der zentrale UI-Bereich für Geräte, inkl. `AddEquipmentModal`.

Bei Änderungen an der Geräteanzeige:
1. `components/EquipmentView.js` öffnen.
2. Falls Daten geändert werden sollen, zusätzlich `data/equipment.js` (`EQUIPMENT`) prüfen.
3. Falls Filter/Reihenfolge geändert werden soll, `EQUIPMENT_CATEGORY_ORDER` in `data/equipment.js` prüfen.

---

## 11. Dashboard / Übersicht

Datei: **`components/Dashboard.js`** (`Dashboard`).

Die App besitzt eine Übersicht mit verschiedenen Auswertungs- und Fortschrittskarten, u. a. Muskelgruppen-Balance und weitere Trainings-/Körperauswertungen. Nutzt kleine Bausteine aus `components/shared.js` (`StatCard`, `SwipeStatCard`, `GlitchTitle`, `DevCredit`).

**Bei UI-Änderungen zuerst `components/Dashboard.js` öffnen, nach dem sichtbaren Kartentitel suchen.**

---

## 12. Muskelgruppen-Balance

Teil von `components/Dashboard.js`. Die Übersicht kann eine Karte anzeigen, die die Anzahl abgehakter Sätze nach Muskelgruppe darstellt (nutzt `MUSCLE_GROUPS` aus `data/equipment.js`).

Die Karte kann im Setup (`components/Setup.js`) ein-/ausgeblendet werden.

**Bei Änderungen:** `components/Dashboard.js` öffnen, nach `Balance`/`Muskelgruppe` bzw. dem sichtbaren Kartentitel suchen.

---

## 13. Tagebuch

Datei: **`components/Journal.js`** (`DiaryView`, `DiaryEntry`).

Das Tagebuch enthält abgeschlossene Trainingseinträge und deren Auswertungen, u. a. persönliche Rekorde.

**Bei Änderungen:** zuerst `components/Journal.js` öffnen. Bei PR-Änderungen zusätzlich Abschnitt 8 beachten.

---

## 14. Körperverlauf

Ebenfalls Teil von **`components/Journal.js`** (`BodyLogModal`, `BodyLogEntry`). Speichert und visualisiert Körperdaten über die Zeit. Ist außerdem Bestandteil des CSV-Exports (`storage/export.js`, `buildBodyLogCSV`).

**Bei Änderungen:** `components/Journal.js` und ggf. `storage/export.js` öffnen.

---

## 15. Übungen / Übungshistorie

Datei: **`components/Exercises.js`** (`ExercisesView`, `ExerciseDetailModal`, `ExerciseHistoryModal`, `AddExerciseModal`, `ExercisePickerModal`, `BodyDiagram`).

Die Übungsdaten stammen aus `data/exercises.js` (`EXERCISE_LIBRARY`) plus benutzerdefinierten Daten. Die Übungshistorie enthält unter anderem die 1RM-Schätzung (`utils/calculations.js`).

**Bei Änderung einer Übung selbst:** `data/exercises.js`.

**Bei Änderung der Historienanzeige:** `components/Exercises.js`, Suche nach `Historie` bzw. `ExerciseHistoryModal`.

---

## 16. Setup / Einstellungen

Datei: **`components/Setup.js`** (`SettingsView`, `ProfileRow`).

Der Setup-Bereich enthält unter anderem:
- Anzeigeoptionen
- Dark/Light Mode
- Muskelgruppen-Balance ein/aus
- Backup (`storage/storage.js`)
- CSV-Export (`storage/export.js`)

**Bei Setup-Änderungen:** zuerst `components/Setup.js` öffnen, nach dem sichtbaren Menütext suchen.

---

## 17. Dark / Light Mode

Die App besitzt Dark Mode und Light Mode. Die Auswahl wird gerätebezogen gespeichert und gilt für die Profile auf diesem Gerät.

### Nur Farben/Layout ändern
→ `styles/GlobalStyles.js` öffnen.

### Umschaltlogik ändern
→ `app.js` öffnen, nach Theme-/Mode-State und dem Sonne/Mond-Button suchen (Icons `Sun`/`Moon` aus `data/icons.js`).

---

## 18. `GlobalStyles`

Datei: **`styles/GlobalStyles.js`**. Enthält das zentrale CSS der React-App.

Dort zuerst suchen bei Änderungen an:
- Farben
- Schrift
- Karten
- Buttons
- Abständen
- globalem Layout
- Dark/Light-Design

**Bei rein optischen Änderungen möglichst nicht die Komponentenlogik verändern.**

---

## 19. Hauptkomponente `App`

Datei: **`app.js`**. `App` verbindet die einzelnen Bereiche und hält die zentrale Navigations-/App-Logik zusammen (Profile, aktives Training, globaler State, Laden/Speichern beim Start).

**Nur `app.js` untersuchen, wenn die Änderung wirklich Navigation, globale Zustände oder das Zusammenspiel mehrerer Bereiche betrifft.**

Für eine kleine UI- oder Funktionsänderung in einem einzelnen Bereich nicht `app.js` analysieren, sondern direkt die zuständige Datei aus `components/` öffnen.

---

## 20. Service Worker

Datei: `service-worker.js`

Aktueller Cache:

```text
bernds-body-app-v16
```

App-Shell enthält jetzt zusätzlich alle Modul-Dateien unter `data/`, `storage/`, `utils/`, `styles/` und `components/` (siehe Datei selbst für die vollständige Liste).

Alle `.js`-Dateien werden Network-First behandelt (nicht mehr nur `app.js`), damit Änderungen an jedem einzelnen Modul sofort sichtbar werden. `index.html` bleibt ebenfalls Network-First. Icons und `manifest.json` können weiterhin aus dem Cache geliefert werden.

Bei Offline-/Cache-/Update-Problemen zuerst `service-worker.js` prüfen.

### Wichtig bei Änderungen an einer Modul-Datei

Wenn eine neue Version trotz GitHub-Änderung nicht sofort sichtbar wird, Service Worker und Cache berücksichtigen. Bei größeren Struktur-Änderungen (neue/entfernte Dateien) die `CACHE_NAME`-Version erhöhen.

---

# 21. Schnellnavigation

| Wunsch | Datei |
|---|---|
| Neues Gerät | `data/equipment.js` |
| Gerät umbenennen | `data/equipment.js` |
| Gerätekategorien/Reihenfolge | `data/equipment.js` (`EQUIPMENT_CATEGORY_ORDER`) |
| Neue Übung | `data/exercises.js` |
| Übung umbenennen | `data/exercises.js` |
| Übungstext ändern | `data/exercises.js` |
| Übungshistorie | `components/Exercises.js` (`ExerciseHistoryModal`) |
| 1RM | `utils/calculations.js` (`calcEstimated1RM`) |
| Persönlicher Rekord | `utils/calculations.js` (`detectPRs`) / `components/Journal.js` (Anzeige) |
| Trainingsplan-Vorlage | `data/plans.js` |
| Plan-Editor | `components/PlanEditor.js` |
| Geräte-Bildschirm | `components/EquipmentView.js` |
| Dashboard | `components/Dashboard.js` |
| Tagebuch | `components/Journal.js` |
| Körperverlauf | `components/Journal.js` |
| Muskelgruppen-Balance | `components/Dashboard.js` (nutzt `data/equipment.js`) |
| Daten speichern / Backup | `storage/storage.js` |
| CSV | `storage/export.js` |
| Farben / Design | `styles/GlobalStyles.js` |
| Dark/Light Mode Umschaltlogik | `app.js` |
| Navigation / globaler Zustand | `app.js` |
| Icons | `data/icons.js` |
| Storage-Keys / Defaults / Nav-Tabs | `data/constants.js` |
| Offline / Cache / Update | `service-worker.js` |
| Startseite / Mountpoint / Storage-Wrapper | `index.html` |

**Kleine, wiederverwendete UI-Bausteine** (Buttons, Karten-Überschriften, Statistik-Kacheln) liegen in `components/shared.js` — dort suchen, wenn eine Änderung mehrere Bereiche gleichzeitig betrifft (z. B. `StatCard`, `ConfirmDelete`, `FavoriteButton`, `GlitchTitle`).

**Bekannte datei-übergreifende Importe zwischen Komponenten** (bewusst so gehalten, um Code nicht doppelt zu pflegen):
- `components/PlanEditor.js` importiert `ExercisePickerModal` aus `components/Exercises.js`
- `components/Setup.js` importiert `Dashboard`, `EquipmentView` und `ExercisesView` (für Vorschauen/Verlinkung) aus den jeweiligen Dateien

---

# 22. Änderungsstrategie für Claude

Bei jeder Aufgabe:

1. Aufgabe in einen Funktionsbereich einordnen.
2. Diese Map benutzen, um die zuständige Datei zu bestimmen.
3. NUR diese Datei öffnen — plus, falls für das Verständnis nötig, ihre direkten Importe (am Dateianfang sichtbar).
4. Nicht mehr Dateien lesen, als für die Aufgabe nötig.
5. Bei Datenänderungen IDs und bestehende Speicherstrukturen beachten (`data/equipment.js`, `data/exercises.js`, `storage/storage.js`).
6. Bei Designänderungen zuerst `styles/GlobalStyles.js` prüfen.
7. Bei Speicheränderungen zuerst `storage/storage.js` und `data/constants.js` (STORAGE_KEYS) prüfen.
8. Bei Cache-/Update-Problemen `service-worker.js` prüfen.
9. Bestehende Funktionen wiederverwenden (aus `utils/`, `storage/`), statt parallele Versionen derselben Logik zu erzeugen.
10. Nur den für die Aufgabe notwendigen Code ändern.
11. Wird eine neue Datei benötigt (z. B. eine neue Komponente), in den passenden Unterordner legen und in `app.js` bzw. der aufrufenden Datei importieren — sowie in `service-worker.js` (APP_SHELL) und dieser Karte ergänzen.

---

# 23. Sicherheitsgeländer

- Bestehende Geräte-IDs (`data/equipment.js`) nicht ändern.
- Bestehende Übungs-IDs (`data/exercises.js`) nicht ändern.
- Speicher-Schlüssel (`data/constants.js`, `STORAGE_KEYS`) nicht ohne Migrationsüberlegung umbenennen.
- Backup- (`storage/storage.js`) und CSV-Logik (`storage/export.js`) bei Änderungen am Datenmodell mitprüfen.
- Keine unnötigen Änderungen am Service Worker bei normalen UI-/Logikänderungen — nur bei Cache-/Offline-/Update-Themen, oder wenn Dateien hinzugefügt/entfernt werden.
- Keine großflächige Umstrukturierung der Modul-Aufteilung bei einer kleinen Feature-Änderung.
- Bei Unsicherheit zuerst diese Karte und den lokalen Zusammenhang lesen, statt die Architektur zu erraten.
- Keine neuen Build-Tools oder Bundler einführen — die App funktioniert bewusst ohne, direkt über ES-Module im Browser.

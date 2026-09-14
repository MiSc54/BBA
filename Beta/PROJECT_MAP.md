# Bernds Body App – PROJECT_MAP

## Zweck

Diese Datei ist ein Navigationsindex für Claude. Sie soll verhindern, dass bei kleinen Änderungen die komplette `app.js` analysiert werden muss.

**Arbeitsregel:** Erst den passenden Bereich über diese Karte bestimmen, dann nur die betreffende Komponente/Funktion und ihre direkten Abhängigkeiten lesen.

---

## 1. Projektstruktur

```text
Beta/
├── index.html
├── app.js
├── service-worker.js
├── manifest.json
├── README.md
└── Icons / weitere statische Dateien
```

### `index.html`

Sehr kleiner Einstiegspunkt. Zuständig für:
- HTML-Grundgerüst
- `<div id="root">` als React-Mountpoint
- `window.storage` als Wrapper um `localStorage`
- Laden von `app.js`
- Registrierung und Update des Service Workers

Die eigentliche Benutzeroberfläche und fast die gesamte Programmlogik befinden sich in `app.js`.

### `app.js`

**Zentrale Datei der Anwendung.** Die komplette React-App befindet sich derzeit in dieser einen Datei.

Bekannte Hauptbereiche, in der Reihenfolge der Datei:
1. React-Import / Grundkonstanten / Logo
2. feste Datenlisten
3. Geräte-Daten
4. Übungsbibliothek
5. Speicherfunktionen
6. Hilfs- und Berechnungsfunktionen
7. globale Styles
8. React-Komponenten für die einzelnen App-Bereiche
9. Hauptkomponente `App`

### `service-worker.js`

Offline- und Cache-Logik. Der aktuelle Cache-Name ist `bernds-body-app-v15`.

---

## 2. Architektur

```text
index.html
   │
   ├── window.storage
   │      └── localStorage mit Präfix "bba:"
   │
   └── app.js
          ├── feste Stammdaten
          ├── Speicherung
          ├── Berechnungen / Hilfsfunktionen
          ├── GlobalStyles
          ├── React-Komponenten
          └── App

service-worker.js
   └── Cache / Offline / Update
```

React 18.3.1 wird direkt über `https://esm.sh/react@18.3.1` importiert.

---

## 3. Stammdaten – hier zuerst suchen

### `EQUIPMENT`

Enthält die fest eingebauten Geräte inklusive stabiler IDs, Namen und Kategorien.

Typische Änderungen:
- Gerät hinzufügen
- Gerätenamen ändern
- Gerätekategorie ändern

**Wichtig:** Bestehende Geräte-IDs nicht ändern. Gespeicherte Pläne und Trainingseinträge können darauf verweisen.

### `EQUIPMENT_CATEGORY_ORDER`

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

### `MUSCLE_GROUPS`

Zentrale Liste der Muskelgruppen. Wird unter anderem für Filter und Tags verwendet.

### `EXERCISE_LIBRARY`

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

1. `EXERCISE_LIBRARY` suchen.
2. Neue eindeutige `id` vergeben.
3. Nur benötigte Eigenschaften ergänzen.
4. Prüfen, ob referenzierte Geräte-IDs in `EQUIPMENT` existieren.

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

In `app.js` liegen darüber die eigentlichen App-Speicherfunktionen.

**Bei Änderungen an gespeicherten Daten zuerst nach `loadKey`, `saveKey` und den vorhandenen Backup-/Storage-Funktionen suchen.**

Nicht parallel ein zweites Speichersystem einführen, wenn die bestehende Abstraktion verwendet werden kann.

---

## 5. Backup / Import / Export

Die App besitzt Backup-Funktionen und zusätzlich CSV-Export.

Bekannte wichtige Suchbegriffe:
- `collectBackup`
- `backup`
- `CSV`
- `csv`

CSV-Export betrifft insbesondere:
- Tagebuch
- Körperverlauf

CSV ist Export, nicht der normale Wiederherstellungsmechanismus des Backups.

Bei Änderungen am Datenformat immer prüfen, ob Backup/Restore und CSV davon betroffen sind.

---

## 6. Berechnungen / Hilfsfunktionen

`app.js` enthält einen eigenen Bereich mit allgemeinen Funktionen, unter anderem für:
- BMI
- Kalorien
- Datumsformatierung
- Datenaufbereitung
- Trainingsauswertungen

Bei einer Rechenänderung zuerst die betreffende Hilfsfunktion suchen und nicht direkt die UI ändern.

---

## 7. 1RM

Die Übungshistorie kann ein geschätztes 1RM anzeigen.

Die Schätzung verwendet die Epley-Formel.

**Bei Änderungen:** zuerst nach `1RM` oder `Epley` suchen. Danach prüfen, wo der berechnete Wert angezeigt wird.

---

## 8. Persönliche Rekorde (PR)

Beim Abschluss eines Trainings können neue Bestwerte erkannt werden.

Die aktuelle Version unterstützt Rekorde unter anderem für:
- höheres Gewicht
- längere Strecke
- längere Zeit

Im Tagebuch wird ein neuer Rekord dauerhaft gekennzeichnet.

**Bei Änderungen:** zuerst nach `PR`, `Rekord`, `record` oder dem sichtbaren Text `NEUER REKORD` suchen.

---

## 9. Trainingspläne

Es gibt Planvorlagen für:
- Ganzkörper (Einsteiger)
- Push
- Pull
- Legs
- Ganzkörper (Fortgeschritten)

Der Plan-Editor heißt laut Quellcode `PlanEditor`.

### Änderung am Plan-Editor

→ `PlanEditor` suchen.

### Änderung einer Vorlage

→ zuerst nach dem jeweiligen Vorlagen-Namen bzw. den Planvorlagen-Daten suchen.

### Achtung

Planobjekte können auf Übungs-IDs verweisen. Deshalb bestehende Übungs-IDs nicht ändern.

---

## 10. Gerätebereich

Die Komponente `EquipmentView` ist der zentrale UI-Bereich für Geräte.

Bei Änderungen an der Geräteanzeige:
1. `EquipmentView` suchen.
2. Falls Daten geändert werden sollen, zusätzlich `EQUIPMENT` prüfen.
3. Falls Filter/Reihenfolge geändert werden soll, `EQUIPMENT_CATEGORY_ORDER` prüfen.

---

## 11. Dashboard / Übersicht

Die App besitzt eine Übersicht mit verschiedenen Auswertungs- und Fortschrittskarten.

Aktuell gehören dazu unter anderem die Muskelgruppen-Balance und weitere Trainings-/Körperauswertungen.

**Bei UI-Änderungen zuerst nach `Dashboard` bzw. dem sichtbaren Kartentitel suchen.**

---

## 12. Muskelgruppen-Balance

Die Übersicht kann eine Karte anzeigen, die die Anzahl abgehakter Sätze nach Muskelgruppe darstellt.

Die Karte kann im Setup ein-/ausgeblendet werden.

**Bei Änderungen:** nach `Balance`, `Muskelgruppe` oder dem sichtbaren Kartentitel suchen.

---

## 13. Tagebuch

Das Tagebuch enthält abgeschlossene Trainingseinträge und deren Auswertungen.

Dazu gehören unter anderem persönliche Rekorde.

**Bei Änderungen:** zuerst nach `Tagebuch` bzw. dem zugehörigen Tab-/Komponentennamen suchen. Bei PR-Änderungen zusätzlich Abschnitt 8 beachten.

---

## 14. Körperverlauf

Der Körperverlauf speichert und visualisiert Körperdaten über die Zeit.

Er ist außerdem Bestandteil des CSV-Exports.

**Bei Änderungen:** nach `Körperverlauf` und den zugehörigen Speicher-/Exportfunktionen suchen.

---

## 15. Übungen / Übungshistorie

Die Übungsdaten stammen aus `EXERCISE_LIBRARY` plus benutzerdefinierten Daten, soweit die App diese unterstützt.

Die Übungshistorie enthält unter anderem die 1RM-Schätzung.

**Bei Änderung einer Übung selbst:** `EXERCISE_LIBRARY`.

**Bei Änderung der Historienanzeige:** betreffende React-Komponente / Suche nach `Historie` bzw. sichtbarem Text.

---

## 16. Setup / Einstellungen

Der Setup-Bereich enthält unter anderem:
- Anzeigeoptionen
- Dark/Light Mode
- Muskelgruppen-Balance ein/aus
- Backup
- CSV-Export

**Bei Setup-Änderungen:** zuerst nach dem sichtbaren Menütext suchen, dann nur die zugehörige Komponente untersuchen.

---

## 17. Dark / Light Mode

Die App besitzt Dark Mode und Light Mode.

Die Auswahl wird gerätebezogen gespeichert und gilt für die Profile auf diesem Gerät.

### Nur Farben/Layout ändern
→ `GlobalStyles` suchen.

### Umschaltlogik ändern
→ nach Theme-/Mode-State und dem Sonne/Mond-Button suchen.

---

## 18. `GlobalStyles`

`GlobalStyles` enthält das zentrale CSS der React-App.

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

`App` verbindet die einzelnen Bereiche und hält die zentrale Navigations-/App-Logik zusammen.

**Nur `App` untersuchen, wenn die Änderung wirklich Navigation, globale Zustände oder das Zusammenspiel mehrerer Bereiche betrifft.**

Für eine kleine UI- oder Funktionsänderung nicht automatisch die komplette `App` analysieren.

---

## 20. Service Worker

Datei: `service-worker.js`

Aktueller Cache:

```text
bernds-body-app-v15
```

App-Shell enthält unter anderem:
- `./`
- `./index.html`
- `./app.js`
- `./manifest.json`
- Icons

`index.html` und `app.js` werden Network-First behandelt.

Andere App-Shell-Dateien können aus dem Cache geliefert werden.

Bei Offline-/Cache-/Update-Problemen zuerst `service-worker.js` prüfen.

### Wichtig bei Änderungen an `app.js`

Wenn eine neue Version trotz GitHub-Änderung nicht sofort sichtbar wird, Service Worker und Cache berücksichtigen.

---

# 21. Schnellnavigation

| Wunsch | Zuerst suchen |
|---|---|
| Neues Gerät | `EQUIPMENT` |
| Gerät umbenennen | `EQUIPMENT` |
| Gerätekategorien/Reihenfolge | `EQUIPMENT_CATEGORY_ORDER` |
| Neue Übung | `EXERCISE_LIBRARY` |
| Übung umbenennen | `EXERCISE_LIBRARY` |
| Übungstext ändern | `EXERCISE_LIBRARY` |
| Übungshistorie | `Historie` / betreffende Komponente |
| 1RM | `1RM` / `Epley` |
| Persönlicher Rekord | `PR` / `Rekord` / `NEUER REKORD` |
| Trainingsplan | `PlanEditor` / Planvorlagen |
| Geräte-Bildschirm | `EquipmentView` |
| Dashboard | `Dashboard` / sichtbarer Kartentitel |
| Tagebuch | `Tagebuch` |
| Körperverlauf | `Körperverlauf` |
| Muskelgruppen-Balance | `Balance` / `Muskelgruppe` |
| Daten speichern | `loadKey` / `saveKey` |
| Backup | `collectBackup` / `backup` |
| CSV | `CSV` / `csv` |
| Farben / Design | `GlobalStyles` |
| Dark/Light Mode | Theme/Mode-Code |
| Navigation / globaler Zustand | `App` |
| Offline / Cache / Update | `service-worker.js` |
| Startseite / Mountpoint / Storage-Wrapper | `index.html` |

---

# 22. Änderungsstrategie für Claude

Bei jeder Aufgabe:

1. Aufgabe in einen Funktionsbereich einordnen.
2. Diese Map benutzen, um die wahrscheinlich relevante Stelle zu bestimmen.
3. Nur die betreffende Komponente/Funktion und direkte Abhängigkeiten lesen.
4. Nicht die komplette `app.js` lesen, wenn das nicht nötig ist.
5. Bei Datenänderungen IDs und bestehende Speicherstrukturen beachten.
6. Bei Designänderungen zuerst `GlobalStyles` prüfen.
7. Bei Speicheränderungen zuerst `loadKey`/`saveKey` und vorhandene Storage-Funktionen prüfen.
8. Bei Cache-/Update-Problemen `service-worker.js` prüfen.
9. Bestehende Funktionen wiederverwenden, statt parallele Versionen derselben Logik zu erzeugen.
10. Nur den für die Aufgabe notwendigen Code ändern.

---

# 23. Sicherheitsgeländer

- Bestehende Geräte-IDs nicht ändern.
- Bestehende Übungs-IDs nicht ändern.
- Speicher-Schlüssel nicht ohne Migrationsüberlegung umbenennen.
- Backup- und CSV-Logik bei Änderungen am Datenmodell mitprüfen.
- Keine unnötigen Änderungen am Service Worker bei normalen UI-/Logikänderungen.
- Keine großflächige Umstrukturierung der `app.js` bei einer kleinen Feature-Änderung.
- Bei Unsicherheit zuerst suchen und den lokalen Zusammenhang lesen, statt die Architektur zu erraten.

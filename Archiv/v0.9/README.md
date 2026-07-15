# Bernds Body App – Update: Pausen-Timer

## Update einspielen

1. Backup exportieren (Setup-Tab), falls noch nicht geschehen
2. In deinem GitHub-Repository: "Add file" → "Upload files"
3. Alle 8 Dateien aus diesem ZIP hochladen (überschreiben die alten)
4. "Commit changes" klicken, ca. 1 Minute warten
5. App auf dem Handy schließen und neu öffnen (wichtig, damit der neue
   Service Worker greift – notfalls Browser-Cache der Seite leeren)

## Was ist neu

Wenn du beim aktiven Training einen Satz abhakst, startet automatisch ein
Pausen-Countdown mit der in deinem Plan hinterlegten Pausenzeit. Er läuft
unten am Bildschirm als Leiste mit:

- Countdown in mm:ss mit ablaufendem Fortschrittsbalken
- "Überspringen"-Button, um die Pause sofort zu beenden
- sanftes grünes Aufleuchten des Displays, sobald die Pause abgelaufen ist

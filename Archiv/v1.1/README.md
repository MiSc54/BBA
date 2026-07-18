# Bernds Body App – Bugfix: Pausen-Timer

## Update einspielen

1. GitHub-Repository → "Add file" → "Upload files"
2. Alle 8 Dateien aus diesem ZIP hochladen (überschreiben die alten)
3. "Commit changes", ca. 1 Minute warten
4. App auf dem Handy schließen und neu öffnen (Service-Worker-Cache wurde
   erneut erhöht, damit garantiert die neue Version geladen wird)

## Was wurde behoben

**1. Grüner Bildschirm blieb hängen**
Ursache war ein React-Timing-Fehler: Der Timer, der das grüne Aufleuchten
nach dem Countdown wieder ausblendet, wurde durch eine interne
Aufräum-Funktion versehentlich abgebrochen, bevor er feuern konnte – dazu kam
ein CSS-Fehler, der die Deckkraft nach Ende der Animation wieder auf voll
zurücksetzte. Beides ist jetzt behoben: Das Aufleuchten verschwindet
zuverlässig nach ca. 1 Sekunde von selbst, und du kannst zusätzlich jederzeit
per Antippen des grünen Bildschirms sofort zum aktiven Training zurück.

**2. Pausen-Leiste weit unten / Scrollen nötig**
Das war ein bekanntes Mobile-Browser-Problem: "fixed" positionierte Elemente
werden auf manchen Handys relativ zum größeren Layout-Viewport statt zum
tatsächlich sichtbaren Bildschirmausschnitt platziert, solange die
Browser-Adressleiste eingeblendet ist. Die Pausen-Leiste richtet sich jetzt
aktiv an der tatsächlich sichtbaren Bildschirmkante aus (über die
Visual-Viewport-API) und bleibt dadurch immer ohne Scrollen sichtbar.

/* =========================================================================
   Datumsbezogene Hilfsfunktionen (Formatierung, Wochenstart, Eingabe-Parsing).
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

// Wandelt den Wert eines <input type="date"> (immer "YYYY-MM-DD") in ein Date-Objekt in der
// LOKALEN Zeitzone um. new Date("YYYY-MM-DD") würde stattdessen UTC-Mitternacht liefern, was je
// nach Zeitzone/Uhrzeit zu einer Verschiebung um einen Tag führen und Zeitraum-Filter verfälschen kann.
// Wandelt den Text eines <input type="date"> (immer "JJJJ-MM-TT") in ein
// Date-Objekt in DEINER Zeitzone um. Wichtig, weil das normale new
// Date("2026-07-17") sonst UTC-Mitternacht annimmt, was je nach Zeitzone
// zu einer Verschiebung um einen Tag führen kann.
export function parseLocalDateInput(dateStr, fallbackTime) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const base = fallbackTime ? new Date(fallbackTime) : new Date();
    return new Date(y, (m || 1) - 1, d || 1, base.getHours(), base.getMinutes(), base.getSeconds());
}
// Lädt einen zuvor gespeicherten Wert. Falls noch nichts gespeichert wurde
// (oder ein Fehler auftritt), wird stattdessen "fallback" zurückgegeben.

export function formatDateShort(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}
// Formatiert ein Datum lang, z.B. "17. Juli 2026" (für Tagebuch-Einträge).

export function formatDateLong(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}
// Liefert den Montag der aktuellen Woche (für "Diese Woche"-Berechnungen).

export function startOfWeek(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // Monday = 0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}
/* =========================================================================
   GLOBAL STYLES
   ========================================================================= */
/* =========================================================================
   GLOBALE DESIGN-EINSTELLUNGEN — HIER kannst du das Aussehen der App ändern!
   =========================================================================
   Dieser riesige Block ist reines CSS (Design-Sprache für's Web), das für
   die komplette App gilt. Die wichtigsten Stellen für Anpassungen:
   - Farben: ganz oben unter ".ff-root {" — z.B. "--accent: #d4ff00;" ist
     das Neongrün, das überall als Akzentfarbe verwendet wird. Einfach den
     Hex-Farbcode (#d4ff00) durch einen anderen ersetzen.
   - Schriftarten: Suche nach "font-family" — "Anton" ist die fette
     Überschriften-Schrift, "JetBrains Mono" die schmale Label-Schrift,
     "Inter" die normale Lesetext-Schrift.
   - Abstände/Größen: einzelne CSS-Klassen wie ".ff-card" (Kartenrahmen),
     ".ff-btn" (Buttons) usw. — jede Klasse steuert das Aussehen EINES
     wiederkehrenden Bauteils. Der Klassenname wird im Rest des Codes über
     className="..." an den jeweiligen HTML-Elementen verwendet.
   Änderungen hier wirken sich SOFORT auf die ganze App aus, nicht nur auf
   eine einzelne Ansicht.
   ========================================================================= */

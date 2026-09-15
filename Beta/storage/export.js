/* =========================================================================
   CSV-Export für Tagebuch und Körperverlauf sowie der allgemeine Datei-Download-Helfer.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import { MEASUREMENT_FIELDS } from "../data/constants.js";
import { formatDateLong } from "../utils/dates.js";
import { calcBMI } from "../utils/calculations.js";

export function csvEscape(value) {
    const s = String(value ?? "");
    if (/[",\n;]/.test(s))
        return `"${s.replace(/"/g, '""')}"`;
    return s;
}

export function csvRow(values) {
    return values.map(csvEscape).join(";") + "\r\n";
}
// Baut eine CSV-Datei aus allen Tagebuch-Einträgen - eine Zeile pro Satz.

export function buildWorkoutsCSV(logs) {
    let csv = csvRow(["Datum", "Plan", "Übung", "Satz", "Wiederholungen", "Gewicht (kg)", "Strecke (km)", "Dauer (Sek.)", "Erledigt", "Notiz"]);
    [...logs].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((log) => {
        log.exercises.forEach((ex) => {
            ex.sets.forEach((s, i) => {
                csv += csvRow([
                    formatDateLong(log.date), log.planName, ex.exerciseName, i + 1,
                    s.reps ?? "", s.weight ?? "", s.distanceKm ?? "", s.durationSec ?? "",
                    s.done ? "Ja" : "Nein", log.note || "",
                ]);
            });
        });
    });
    return csv;
}
// Baut eine CSV-Datei aus dem Körperverlauf - Gewicht, BMI, alle Umfangsmaße.

export function buildBodyLogCSV(bodyLog, heightCm) {
    const header = ["Datum", "Gewicht (kg)", "BMI", ...MEASUREMENT_FIELDS.map((m) => m.label + " (cm)")];
    let csv = csvRow(header);
    [...bodyLog].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((entry) => {
        const bmi = calcBMI(entry.weightKg, heightCm);
        csv += csvRow([
            formatDateLong(entry.date), entry.weightKg ?? "", bmi ? bmi.toFixed(1) : "",
            ...MEASUREMENT_FIELDS.map((m) => entry.measurements?.[m.id] ?? ""),
        ]);
    });
    return csv;
}
// Löst im Browser einen Datei-Download aus. "\uFEFF" (BOM) sorgt dafür, dass
// Excel Umlaute (ä/ö/ü) korrekt anzeigt.

export function downloadTextFile(filename, content, mimeType = "text/csv;charset=utf-8;") {
    const blob = new Blob(["\uFEFF" + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
// Rechnet das "Volumen" (Gewicht x Wiederholungen, aufsummiert über alle
// abgehakten Sätze) eines Trainings aus. Wird u.a. im Tagebuch angezeigt.

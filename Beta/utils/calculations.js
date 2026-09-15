/* =========================================================================
   Allgemeine Berechnungen: BMI, Kalorien, 1RM, persönliche Rekorde, Trainingsauswertungen.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import { EQUIPMENT } from "../data/equipment.js";

/* =========================================================================
   HELPERS
   ========================================================================= */
// Erzeugt eine kurze, zufällige ID (wird für neue Einträge aller Art
// gebraucht, z.B. neue Übungen, Pläne, Tagebuch-Einträge).
export function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export function equipmentNames(ids, list = EQUIPMENT) {
    return ids.map((id) => list.find((e) => e.id === id)?.name || id);
}
// Erstellt ein neues, leeres Profil-Objekt mit zufälliger ID.

export function newProfile(name) {
    return { id: "profile-" + uid(), name };
}
// Berechnet das aktuelle Alter aus einem Geburtsdatum.

export function calcAge(birthDateISO) {
    if (!birthDateISO)
        return null;
    const b = new Date(birthDateISO);
    if (isNaN(b.getTime()))
        return null;
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate()))
        age--;
    return age;
}
// Berechnet den Body-Mass-Index (BMI) aus Gewicht (kg) und Größe (cm).

export function calcBMI(weightKg, heightCm) {
    const w = Number(weightKg);
    const h = Number(heightCm);
    if (!w || !h)
        return null;
    const hm = h / 100;
    return w / (hm * hm);
}
// Wandelt eine Anzahl Sekunden in "mm:ss" um, z.B. 95 -> "1:35".

export function formatDurationMMSS(totalSeconds) {
    const s = Math.max(0, Math.round(Number(totalSeconds) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
// Formatiert einen Satz passend zum Werttyp der Übung, z.B. "5 km",
// "1:30 min" oder "10x50kg" — wird u.a. im Tagebuch verwendet.

export function formatSetLabel(set, trackingType) {
    if (trackingType === "distance")
        return `${set.distanceKm ?? 0} km`;
    if (trackingType === "duration")
        return `${formatDurationMMSS(set.durationSec)} min`;
    return `${set.reps}×${set.weight}kg`;
}
// Liefert einen sinnvollen MET-Schätzwert (Metabolisches Äquivalent), falls die Übung keinen
// eigenen hinterlegt hat - grobe, aber nachvollziehbare Kategorisierung nach Trainingsart.
// Liefert einen MET-Wert (Maß für die Trainingsintensität) für eine Übung,
// falls sie keinen eigenen fest hinterlegten Wert hat. Wird für die
// Kalorienschätzung gebraucht (siehe calcSetKcal).

export function estimateMet(exercise) {
    if (exercise.met)
        return exercise.met;
    if (exercise.trackingType === "distance")
        return 9;
    if (exercise.trackingType === "duration")
        return exercise.muscles?.includes("Core") ? 3.5 : 6;
    if (exercise.bodyweightFactor)
        return 6;
    return 4.5;
}
// Schätzt den kcal-Verbrauch eines einzelnen Satzes. Berücksichtigt je nach Werttyp Strecke,
// Zeit oder Wiederholungen/Gewicht - und immer das aktuelle Körpergewicht, da dieses den
// tatsächlichen Energieverbrauch maßgeblich beeinflusst. Alles nur eine Näherung, keine
// medizinisch exakte Messung.
// Schätzt den Kalorienverbrauch EINES Satzes einer Übung. Je nach Werttyp
// unterschiedlich berechnet: Strecke x Körpergewicht x Faktor (Laufen),
// MET-Wert x Körpergewicht x Zeit (Zeit-Übungen) oder eine grobe Schätzung
// aus Wiederholungen/Gewicht (Kraftübungen). Alles nur eine Annäherung,
// keine medizinisch exakte Messung — siehe auch estimateMet() darüber.

export function calcSetKcal(set, exercise, bodyweightKg) {
    if (!bodyweightKg || !set?.done)
        return 0;
    const met = estimateMet(exercise);
    if (exercise.trackingType === "distance") {
        const factor = exercise.kcalPerKgKm ?? 1.0;
        return (Number(set.distanceKm) || 0) * bodyweightKg * factor;
    }
    if (exercise.trackingType === "duration") {
        const hours = (Number(set.durationSec) || 0) / 3600;
        return met * bodyweightKg * hours;
    }
    const reps = Number(set.reps) || 0;
    const weight = Number(set.weight) || 0;
    const hours = (reps * 3) / 3600; // grobe Annahme: ~3 Sekunden pro Wiederholung
    const intensityBoost = weight > 0 ? 1 + Math.min(1, weight / bodyweightKg) * 0.5 : 1;
    return met * intensityBoost * bodyweightKg * hours;
}
// Addiert den geschätzten Kalorienverbrauch aller Übungen eines einzelnen
// abgeschlossenen Trainings zusammen.

export function computeLogKcal(log, allExercises, bodyweightKg) {
    if (!bodyweightKg)
        return 0;
    return log.exercises.reduce((sum, ex) => {
        const meta = allExercises.find((e) => e.id === ex.exerciseId);
        if (!meta)
            return sum;
        return sum + ex.sets.reduce((s, set) => s + calcSetKcal(set, meta, bodyweightKg), 0);
    }, 0);
}
// Errechnet für körpergewichtsbasierte Übungen (z.B. Liegestütze, Klimmzüge) den anteiligen
// Gewichtswert aus dem aktuellen Körpergewicht und trägt ihn in alle betroffenen, noch nicht
// gestarteten Trainingspläne ein. Vergangene Tagebucheinträge bleiben davon unberührt.
// Wenn sich das Körpergewicht ändert (neuer Körperverlauf-Eintrag), werden
// hier automatisch die Gewichtswerte aller körpergewichtsbasierten Übungen
// (z.B. Liegestütze) in ALLEN Trainingsplänen neu berechnet. Bereits
// absolvierte Trainings im Tagebuch bleiben dabei unverändert.

export function recalcBodyweightExercisesInPlans(plans, allExercises, currentWeightKg) {
    if (!currentWeightKg)
        return plans;
    return plans.map((plan) => ({
        ...plan,
        exercises: plan.exercises.map((row) => {
            const ex = allExercises.find((e) => e.id === row.exerciseId);
            if (!ex?.bodyweightFactor)
                return row;
            return { ...row, weight: Math.round(currentWeightKg * ex.bodyweightFactor * 10) / 10 };
        }),
    }));
}
// Sammelt den gesamten App-Zustand (global + alle Profile) für den Backup-Export.
// Sammelt ALLE Daten der App (Geräte, Übungen, Favoriten, sowie pro Profil:
// Pläne, Tagebuch, Körperverlauf, Einstellungen) in einem einzigen Objekt.
// Wird beim "Backup exportieren"-Button im Setup aufgerufen und als
// JSON-Datei zum Download angeboten.

export function computeLogVolume(log) {
    return log.exercises.reduce((sum, ex) => {
        return sum + ex.sets.filter((s) => s.done).reduce((s2, s) => s2 + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0);
    }, 0);
}
// Schätzt das "1RM" (One-Rep-Max) aus einem Satz. Gängige Epley-Formel:
// 1RM = Gewicht x (1 + Wiederholungen/30).

export function calcEstimated1RM(weight, reps) {
    const w = Number(weight) || 0;
    const r = Number(reps) || 0;
    if (!w || !r)
        return 0;
    return w * (1 + r / 30);
}
// Bestwert eines Satzes, je nach Werttyp der Übung (für PR-Vergleich).

export function bestValueForSet(set, trackingType) {
    if (trackingType === "distance")
        return Number(set.distanceKm) || 0;
    if (trackingType === "duration")
        return Number(set.durationSec) || 0;
    return Number(set.weight) || 0;
}
// Vergleicht ein GERADE abgeschlossenes Training mit allen bisherigen und
// ermittelt neue persönliche Rekorde (PRs) je Übung.

export function detectPRs(newExercises, previousLogs, allExercises) {
    const prs = [];
    newExercises.forEach((ex) => {
        const meta = allExercises.find((e) => e.id === ex.exerciseId);
        const trackingType = ex.trackingType || meta?.trackingType || "strength";
        const newBest = ex.sets.filter((s) => s.done).reduce((m, s) => Math.max(m, bestValueForSet(s, trackingType)), 0);
        if (newBest <= 0)
            return;
        let previousBest = 0;
        previousLogs.forEach((log) => {
            const match = log.exercises.find((e) => e.exerciseId === ex.exerciseId);
            if (!match)
                return;
            match.sets.filter((s) => s.done).forEach((s) => {
                previousBest = Math.max(previousBest, bestValueForSet(s, trackingType));
            });
        });
        if (previousBest > 0 && newBest > previousBest) {
            prs.push({ exerciseName: ex.exerciseName, value: newBest, trackingType, previousBest });
        }
    });
    return prs;
}
// Formatiert ein Datum kurz, z.B. "17.07." (für die X-Achse der Diagramme).

// Filtert eine Liste (Trainings oder Körperverlauf-Einträge) danach, ob ihr
// Datum innerhalb des gewählten Zeitraums liegt (z.B. "nicht älter als 7
// Tage" bei "Woche"). "all"/"Gesamt" gibt einfach alles zurück.
export function filterByRange(items, range, getDate) {
    if (!range || range === "all")
        return items;
    const now = new Date();
    const cutoff = new Date(now);
    if (range === "week")
        cutoff.setDate(now.getDate() - 7);
    else if (range === "month")
        cutoff.setMonth(now.getMonth() - 1);
    else if (range === "3months")
        cutoff.setMonth(now.getMonth() - 3);
    else if (range === "6months")
        cutoff.setMonth(now.getMonth() - 6);
    else if (range === "year")
        cutoff.setFullYear(now.getFullYear() - 1);
    else
        return items;
    return items.filter((it) => new Date(getDate(it)) >= cutoff);
}

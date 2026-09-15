/* =========================================================================
   Ansicht für ein laufendes Training inkl. Pausen-Timer.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Check, Play, Clock, CircleCheck } from "../data/icons.js";
import { uid, formatDurationMMSS } from "../utils/calculations.js";
import { GlitchTitle } from "./shared.js";

export function DurationTimerCell({ value, onRecord }) {
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        if (!running)
            return;
        const t = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(t);
    }, [running]);
    const start = () => { setElapsed(0); setRunning(true); };
    const stop = () => { setRunning(false); onRecord(elapsed); };
    return (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        React.createElement("span", { className: "ff-mono", style: { fontSize: 15, color: running ? "var(--accent)" : "var(--text)", minWidth: 44 } }, formatDurationMMSS(running ? elapsed : (value || 0))),
        !running ? (React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: start },
            React.createElement(Play, { size: 12 }),
            " Start")) : (React.createElement("button", { className: "ff-btn ff-btn-sm ff-btn-primary", onClick: stop },
            React.createElement(CircleCheck, { size: 12 }),
            " Stop"))));
}
/* =========================================================================
   AKTIVES TRAINING — läuft, während der Nutzer gerade trainiert
   =========================================================================
   Zeigt alle Übungen des gestarteten Plans mit ihren Sätzen. Je nach
   Übungs-Art (trackingType) werden unterschiedliche Eingabefelder gezeigt:
   - "strength" (Standard): Wiederholungen + Gewicht
   - "distance": Strecke in km (z.B. Laufen)
   - "duration": Stoppuhr (z.B. Plank) — siehe DurationTimerCell unten
   Hakt man einen Satz ab, startet automatisch der Pausen-Timer (unten als
   grüner Balken) mit einem grünen "Aufleuchten", wenn die Pause vorbei ist.
   Oben lässt sich außerdem das Datum ändern, falls man ein Training
   rückwirkend (für einen vergangenen Tag) eintragen möchte.
   ========================================================================= */
// WICHTIG: Diese Komponente speichert Sätze/Notiz/Datum NICHT mehr selbst
// (kein eigenes useState mehr dafür) - sie bekommt den aktuellen Stand über
// die "workout"-Prop von außen (vom App-Root) und meldet JEDE Änderung
// sofort über "onUpdate(neuerWorkoutStand)" zurück. Der App-Root speichert
// das dann dauerhaft (siehe persistActiveWorkout weiter unten in der
// Datei). Dadurch geht beim Wechsel des Reiters oder sogar beim Schließen
// der App nichts verloren - man kann später einfach weitermachen.

export function ActiveWorkoutView({ workout, allExercises, onUpdate, onFinish, onCancel }) {
    const exercises = workout.exercises;
    const note = workout.note || "";
    const logDate = workout.logDate;
    const [rest, setRest] = useState(null); // { total, secondsLeft, key }
    const [flash, setFlash] = useState(false);
    const [barBottom, setBarBottom] = useState(0);
    // Countdown: läuft unabhängig vom Flash-Timeout, damit dessen Cleanup
    // (bei Wechsel von rest -> null) nicht versehentlich den Flash-Timer mit-abbricht.
    useEffect(() => {
        if (!rest)
            return;
        if (rest.secondsLeft <= 0) {
            setFlash(true);
            setRest(null);
            return;
        }
        const t = setTimeout(() => setRest((r) => (r ? { ...r, secondsLeft: r.secondsLeft - 1 } : r)), 1000);
        return () => clearTimeout(t);
    }, [rest]);
    // Eigener, entkoppelter Effekt für das grüne Aufleuchten: verschwindet zuverlässig
    // nach ca. 1 Sekunde, unabhängig vom Countdown-Effekt.
    useEffect(() => {
        if (!flash)
            return;
        const t = setTimeout(() => setFlash(false), 1000);
        return () => clearTimeout(t);
    }, [flash]);
    // Pausenbalken an der tatsächlich sichtbaren Bildschirmkante ausrichten (visualViewport),
    // damit er auf Mobilgeräten nicht hinter der Browser-Leiste verschwindet / Scrollen erfordert.
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv)
            return;
        const update = () => {
            const offset = window.innerHeight - (vv.height + vv.offsetTop);
            setBarBottom(Math.max(0, Math.round(offset)));
        };
        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);
    const startRest = (seconds) => {
        if (!seconds || seconds <= 0)
            return;
        setRest({ total: seconds, secondsLeft: seconds, key: uid() });
    };
    const skipRest = () => setRest(null);
    const dismissFlash = () => setFlash(false);
    // Hilfsfunktion: baut aus den aktuellen "exercises" + einer Änderung einen neuen
    // Workout-Stand und meldet ihn sofort nach oben (App-Root) zum Zwischenspeichern.
    const updateExercises = (nextExercises) => onUpdate({ ...workout, exercises: nextExercises });
    const updateSet = (exIdx, setIdx, field, value) => {
        updateExercises(exercises.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s));
            return { ...ex, sets };
        }));
    };
    // Satz abhaken/entmarkieren. Wird ein Satz NEU abgehakt, startet automatisch
    // die Pause UND der aktuelle Fortschritt wird zwischengespeichert (das
    // "nach jedem Satz speichern" aus der Anforderung passiert hier: updateExercises
    // ruft onUpdate auf, und der App-Root schreibt das sofort in den Speicher).
    const toggleDone = (exIdx, setIdx) => {
        const willBeDone = !exercises[exIdx].sets[setIdx].done;
        updateExercises(exercises.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, done: !s.done } : s));
            return { ...ex, sets };
        }));
        if (willBeDone)
            startRest(exercises[exIdx].pause);
    };
    // Für Zeit-Übungen: Stoppuhr-Ergebnis übernehmen, Satz direkt als erledigt markieren und Pause starten.
    const completeDurationSet = (exIdx, setIdx, elapsedSeconds) => {
        updateExercises(exercises.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, durationSec: elapsedSeconds, done: true } : s));
            return { ...ex, sets };
        }));
        startRest(exercises[exIdx].pause);
    };
    const totalDoneSets = exercises.reduce((s, ex) => s + ex.sets.filter((st) => st.done).length, 0);
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const restProgress = rest ? Math.max(0, (rest.secondsLeft / rest.total) * 100) : 0;
    return (React.createElement("div", { style: { paddingBottom: rest ? 88 : 0 } },
        flash && React.createElement("div", { className: "ff-flash-overlay", onClick: dismissFlash }),
        React.createElement("p", { className: "ff-eyebrow" }, "Training l\u00E4uft"),
        React.createElement(GlitchTitle, { text: workout.planName, size: 34 }),
        React.createElement("p", { className: "ff-tag-note", style: { marginTop: 6 } }, "L\u00E4uft im Hintergrund weiter, auch wenn du den Reiter wechselst \u2014 komm \u00FCber den gr\u00FCnen \"\u25CF Training\"-Button oben oder das Tagebuch jederzeit hierher zur\u00FCck."),
        React.createElement("div", { style: { marginTop: 16, maxWidth: 220 } },
            React.createElement("label", { className: "ff-field-label" }, "Datum (f\u00FCr nachtr\u00E4gliche Eintr\u00E4ge anpassbar)"),
            React.createElement("input", { type: "date", className: "ff-input", max: new Date().toISOString().slice(0, 10), value: logDate, onChange: (e) => onUpdate({ ...workout, logDate: e.target.value }) })),
        React.createElement("div", { style: { marginTop: 22, display: "flex", flexDirection: "column", gap: 14 } }, exercises.map((ex, exIdx) => {
            const meta = allExercises.find((e) => e.id === ex.exerciseId);
            const trackingType = ex.trackingType || meta?.trackingType || "strength";
            return (React.createElement("div", { key: ex.exerciseId + exIdx, className: "ff-card" },
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 17 } }, ex.exerciseName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } },
                    (meta?.muscles || []).join(" · "),
                    " \u00B7 Pause ",
                    ex.pause,
                    "s"),
                React.createElement("div", { style: { marginTop: 14, display: "flex", flexDirection: "column", gap: 8 } }, trackingType === "distance" ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Einheit"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Strecke (km)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement("input", { className: "ff-numinput", type: "number", step: "0.1", value: s.distanceKm ?? "", onChange: (e) => updateSet(exIdx, setIdx, "distanceKm", e.target.value) })))))) : trackingType === "duration" ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1.4fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Satz"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Zeit (Stoppuhr)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1.4fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement(DurationTimerCell, { value: s.durationSec, onRecord: (secs) => completeDurationSet(exIdx, setIdx, secs) })))))) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Satz"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Wdh."),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Gewicht (kg)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement("input", { className: "ff-numinput", type: "number", value: s.reps, onChange: (e) => updateSet(exIdx, setIdx, "reps", e.target.value) }),
                        React.createElement("input", { className: "ff-numinput", type: "number", value: s.weight, onChange: (e) => updateSet(exIdx, setIdx, "weight", e.target.value) })))))))));
        })),
        React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("label", { className: "ff-field-label" }, "Notiz zum Training (optional)"),
            React.createElement("textarea", { className: "ff-textarea", placeholder: "z.B. F\u00FChlte sich stark an, n\u00E4chstes Mal mehr Gewicht...", value: note, onChange: (e) => onUpdate({ ...workout, note: e.target.value }) })),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, borderTop: "1px solid var(--border)", paddingTop: 20 } },
            React.createElement("span", { className: "ff-mono", style: { fontSize: 12, color: "var(--text-dim)" } },
                totalDoneSets,
                " S\u00E4tze abgehakt"),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { className: "ff-btn ff-btn-danger", onClick: onCancel }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => onFinish(exercises, note, logDate) },
                    React.createElement(CircleCheck, { size: 15 }),
                    " Training abschlie\u00DFen"))),
        rest && (React.createElement("div", { className: "ff-rest-bar", style: { bottom: barBottom } },
            React.createElement("div", { className: "ff-rest-progress", style: { width: `${restProgress}%` } }),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                React.createElement(Clock, { size: 18, color: "var(--accent)" }),
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-eyebrow", style: { margin: 0 } }, "Pause"),
                    React.createElement("p", { className: "ff-display", style: { fontSize: 26, margin: 0 } }, formatTime(rest.secondsLeft)))),
            React.createElement("button", { className: "ff-btn", onClick: skipRest }, "\u00DCberspringen")))));
}
/* =========================================================================
   DIARY VIEW
   ========================================================================= */
// Eine einzelne, aufklappbare Trainings-Karte im Tagebuch. Enthält auch die
// Möglichkeit, das Datum eines bereits gespeicherten Trainings nachträglich
// zu ändern (kleines Zahnrad-Symbol neben dem Datum).

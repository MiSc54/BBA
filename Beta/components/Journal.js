/* =========================================================================
   Der Tagebuch-Tab inkl. Körperverlauf-Erfassung.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useMemo } from "https://esm.sh/react@18.3.1";
import { Plus, Check, ChevronDown, Play, X, Settings, Trophy } from "../data/icons.js";
import { MEASUREMENT_FIELDS } from "../data/constants.js";
import { parseLocalDateInput, formatDateLong } from "../utils/dates.js";
import { uid, calcBMI, formatSetLabel, computeLogVolume } from "../utils/calculations.js";
import { GlitchTitle, ConfirmDelete } from "./shared.js";

export function DiaryEntry({ log, onDelete, onEditDate }) {
    const [open, setOpen] = useState(false);
    const [editingDate, setEditingDate] = useState(false);
    const [dateValue, setDateValue] = useState(log.date.slice(0, 10));
    const volume = computeLogVolume(log);
    const commitDate = () => {
        if (dateValue) {
            const next = parseLocalDateInput(dateValue, log.date);
            onEditDate(log.id, next.toISOString());
        }
        setEditingDate(false);
    };
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", { style: { cursor: "pointer", flex: 1 }, onClick: () => setOpen((v) => !v) },
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, log.planName),
                editingDate ? (React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 6 }, onClick: (e) => e.stopPropagation() },
                    React.createElement("input", { type: "date", className: "ff-input", style: { padding: "6px 10px", fontSize: 12, maxWidth: 160 }, max: new Date().toISOString().slice(0, 10), value: dateValue, onChange: (e) => setDateValue(e.target.value), autoFocus: true }),
                    React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: commitDate },
                        React.createElement(Check, { size: 12 })))) : (React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3, display: "flex", alignItems: "center", gap: 6 } },
                    formatDateLong(log.date),
                    " \u00B7 ",
                    log.durationMin,
                    " min",
                    React.createElement("button", { className: "ff-btn ff-btn-icon", style: { padding: 2 }, onClick: (e) => { e.stopPropagation(); setEditingDate(true); }, title: "Datum \u00E4ndern" },
                        React.createElement(Settings, { size: 11 }))))),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                log.prs?.length > 0 && (React.createElement("span", { title: `${log.prs.length} neue(r) persönliche(r) Rekord(e)`, style: { display: "flex", alignItems: "center", color: "var(--accent)" } },
                    React.createElement(Trophy, { size: 14 }))),
                React.createElement("span", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13 } },
                    volume.toLocaleString("de-DE"),
                    " kg"),
                React.createElement(ConfirmDelete, { onConfirm: () => onDelete(log.id) }),
                React.createElement(ChevronDown, { size: 16, style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease", color: "var(--text-faint)", cursor: "pointer" }, onClick: () => setOpen((v) => !v) }))),
        open && (React.createElement("div", { style: { marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 } },
            log.exercises.map((ex, i) => {
                const pr = log.prs?.find((p) => p.exerciseName === ex.exerciseName);
                return (React.createElement("div", { key: i },
                    React.createElement("p", { style: { margin: 0, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 } },
                        ex.exerciseName,
                        pr && (React.createElement("span", { className: "ff-mono", style: { fontSize: 10, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3 } },
                            React.createElement(Trophy, { size: 11 }),
                            " NEUER REKORD"))),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, ex.sets.map((s, j) => `${s.done ? "✓" : "—"} ${formatSetLabel(s, ex.trackingType)}`).join("   "))));
            }),
            log.note && (React.createElement("div", { style: { marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border)" } },
                React.createElement("p", { className: "ff-field-label" }, "Notiz"),
                React.createElement("p", { style: { margin: 0, fontSize: 13, color: "var(--text-dim)" } }, log.note)))))));
}
// Formular (Popup) zum Erfassen oder Bearbeiten eines Körperverlauf-
// Eintrags: Datum, Gewicht und die einzelnen Umfangsmaße (Brust, Bizeps, ...).

export function BodyLogModal({ entry, onClose, onSave }) {
    const [date, setDate] = useState(entry?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
    const [weight, setWeight] = useState(entry?.weightKg ?? "");
    const [measurements, setMeasurements] = useState(entry?.measurements || {});
    const setM = (id) => (e) => setMeasurements((prev) => ({ ...prev, [id]: e.target.value }));
    const handleSave = () => {
        onSave({
            id: entry?.id || uid(),
            date: parseLocalDateInput(date, entry?.date).toISOString(),
            weightKg: weight === "" ? null : Number(weight),
            measurements: Object.fromEntries(Object.entries(measurements).filter(([, v]) => v !== "" && v !== null && v !== undefined).map(([k, v]) => [k, Number(v)])),
        });
    };
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, entry ? "Eintrag bearbeiten" : "Körpermaße erfassen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("label", { className: "ff-field-label" }, "Datum"),
            React.createElement("input", { type: "date", className: "ff-input", max: new Date().toISOString().slice(0, 10), value: date, onChange: (e) => setDate(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 16 } }, "Gewicht (kg)"),
            React.createElement("input", { type: "number", step: "0.1", className: "ff-input", placeholder: "z.B. 78.5", value: weight, onChange: (e) => setWeight(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 16 } }, "Umfangsma\u00DFe (cm, optional)"),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 } }, MEASUREMENT_FIELDS.map((m) => (React.createElement("div", { key: m.id },
                React.createElement("label", { className: "ff-field-label" }, m.label),
                React.createElement("input", { type: "number", step: "0.1", className: "ff-numinput", value: measurements[m.id] ?? "", onChange: setM(m.id) }))))),
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26 } },
                React.createElement("button", { className: "ff-btn", onClick: onClose }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleSave },
                    React.createElement(Check, { size: 14 }),
                    " Speichern")))));
}
// Eine einzelne Zeile im Körperverlauf: Datum, Gewicht, BMI und
// Umfangsmaße eines Eintrags, mit Bearbeiten-/Löschen-Button.

export function BodyLogEntry({ entry, heightCm, onDelete, onEdit }) {
    const bmi = calcBMI(entry.weightKg, heightCm);
    const activeMeasurements = MEASUREMENT_FIELDS.filter((m) => entry.measurements?.[m.id] != null);
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("div", null,
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, formatDateLong(entry.date)),
                React.createElement("p", { className: "ff-mono", style: { marginTop: 4, fontSize: 13, color: "var(--accent)" } },
                    entry.weightKg != null ? `${entry.weightKg} kg` : "—",
                    bmi ? ` · BMI ${bmi.toFixed(1)}` : "")),
            React.createElement("div", { style: { display: "flex", gap: 6 } },
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onEdit, title: "Bearbeiten" },
                    React.createElement(Settings, { size: 14 })),
                React.createElement(ConfirmDelete, { onConfirm: onDelete }))),
        activeMeasurements.length > 0 && (React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 } }, activeMeasurements.map((m) => (React.createElement("span", { key: m.id, className: "ff-tag-note", style: { padding: "3px 8px", border: "1px solid var(--border)", borderRadius: 12 } },
            m.label,
            ": ",
            entry.measurements[m.id],
            " cm")))))));
}
// TAGEBUCH-TAB: Zeigt entweder die Liste abgeschlossener Trainings
// (Modus "workouts") oder den Körperverlauf (Modus "body") — umschaltbar
// über die zwei Buttons oben ("Workouts" / "Körperverlauf").
// Tagebuch-Tab. Zeigt zusätzlich ganz oben (falls vorhanden) das gerade
// laufende, noch nicht abgeschlossene Training als eigenes Banner - mit
// "Fortsetzen"-Button, um genau dort weiterzumachen, wo man aufgehört hat.

export function DiaryView({ logs, onDelete, onEditDate, onGoToPlans, bodyLog, heightCm, onAddBodyEntry, onUpdateBodyEntry, onDeleteBodyEntry, activeWorkout, onResumeWorkout, onCancelWorkout }) {
    const [mode, setMode] = useState("workouts");
    const [showBodyModal, setShowBodyModal] = useState(false);
    const [editingBodyEntry, setEditingBodyEntry] = useState(null);
    const sorted = useMemo(() => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)), [logs]);
    const sortedBody = useMemo(() => [...bodyLog].sort((a, b) => new Date(b.date) - new Date(a.date)), [bodyLog]);
    // Anzahl bereits abgehakter Sätze im laufenden Training, für die kleine
    // Fortschrittsanzeige im Banner unten.
    const activeDoneSets = activeWorkout
        ? activeWorkout.exercises.reduce((s, ex) => s + ex.sets.filter((st) => st.done).length, 0)
        : 0;
    const activeTotalSets = activeWorkout
        ? activeWorkout.exercises.reduce((s, ex) => s + ex.sets.length, 0)
        : 0;
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Verlauf"),
        React.createElement(GlitchTitle, { text: "Tagebuch", size: 34 }),
        activeWorkout && (React.createElement("div", { className: "ff-card", style: { marginTop: 20, borderColor: "var(--accent)" } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 } },
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)", margin: 0 } }, "\u25CF L\u00C4UFT GERADE"),
                    React.createElement("p", { style: { margin: "4px 0 0 0", fontWeight: 700, fontSize: 17 } }, activeWorkout.planName),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 4 } },
                        activeDoneSets,
                        " von ",
                        activeTotalSets,
                        " S\u00E4tzen abgehakt")),
                React.createElement("div", { style: { display: "flex", gap: 8 } },
                    React.createElement("button", { className: "ff-btn ff-btn-danger ff-btn-sm", onClick: onCancelWorkout }, "Abbrechen"),
                    React.createElement("button", { className: "ff-btn ff-btn-primary ff-btn-sm", onClick: onResumeWorkout },
                        React.createElement(Play, { size: 13 }),
                        " Fortsetzen"))))),
        React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", { style: { display: "flex", gap: 8 } },
                React.createElement("button", { className: `ff-tagbtn ${mode === "workouts" ? "selected" : ""}`, onClick: () => setMode("workouts") }, "Workouts"),
                React.createElement("button", { className: `ff-tagbtn ${mode === "body" ? "selected" : ""}`, onClick: () => setMode("body") }, "K\u00F6rperverlauf")),
            mode === "body" && (React.createElement("button", { className: "ff-btn ff-btn-primary ff-btn-sm", onClick: () => { setEditingBodyEntry(null); setShowBodyModal(true); } },
                React.createElement(Plus, { size: 13 }),
                " Eintrag"))),
        mode === "workouts" ? (sorted.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Noch keine Eintr\u00E4ge im Tagebuch."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: onGoToPlans },
                React.createElement(Play, { size: 14 }),
                " Training starten"))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 22 } }, sorted.map((log) => React.createElement(DiaryEntry, { key: log.id, log: log, onDelete: onDelete, onEditDate: onEditDate }))))) : (sortedBody.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Noch keine K\u00F6rperma\u00DFe erfasst."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: () => setShowBodyModal(true) },
                React.createElement(Plus, { size: 14 }),
                " Ersten Eintrag erfassen"))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 22 } }, sortedBody.map((entry) => (React.createElement(BodyLogEntry, { key: entry.id, entry: entry, heightCm: heightCm, onDelete: () => onDeleteBodyEntry(entry.id), onEdit: () => { setEditingBodyEntry(entry); setShowBodyModal(true); } })))))),
        showBodyModal && (React.createElement(BodyLogModal, { entry: editingBodyEntry, onClose: () => setShowBodyModal(false), onSave: (entry) => {
                editingBodyEntry ? onUpdateBodyEntry(entry) : onAddBodyEntry(entry);
                setShowBodyModal(false);
            } }))));
}
// Eine einzelne Zeile in der Profil-Liste im Setup-Tab (Name anzeigen/
// bearbeiten, "Wechseln"-Button, Löschen).

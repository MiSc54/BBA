/* =========================================================================
   Trainingsplan-Editor, Plan-Übersicht und Vorlagen-Auswahl.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState } from "https://esm.sh/react@18.3.1";
import { Dumbbell, ClipboardList, Plus, Check, ChevronUp, ChevronDown, Play, X, Calendar, Copy, Heart } from "../data/icons.js";
import { WEEKDAYS, INTERVALS } from "../data/constants.js";
import { PLAN_TEMPLATES } from "../data/plans.js";
import { uid } from "../utils/calculations.js";
import { GlitchTitle, ConfirmDelete, FavoriteButton } from "./shared.js";
import { ExercisePickerModal } from "./Exercises.js";

export function PlanExerciseRow({ row, exercise, onChange, onRemove, onMove, isFirst, isLast }) {
    const set = (field) => (e) => onChange({ ...row, [field]: e.target.value });
    const trackingType = exercise?.trackingType || "strength";
    return (React.createElement("div", { className: "ff-card", style: { marginBottom: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("div", null,
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, exercise?.name || "Unbekannte Übung"),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } },
                    (exercise?.muscles || []).join(" · "),
                    exercise?.bodyweightFactor && React.createElement("span", { style: { color: "var(--accent)" } },
                        " \u00B7 \u2696 K\u00F6rpergewichtsbasiert (",
                        Math.round(exercise.bodyweightFactor * 100),
                        "%)"))),
            React.createElement("div", { style: { display: "flex", gap: 4 } },
                React.createElement("button", { className: "ff-btn ff-btn-icon", disabled: isFirst, onClick: () => onMove(-1) },
                    React.createElement(ChevronUp, { size: 15 })),
                React.createElement("button", { className: "ff-btn ff-btn-icon", disabled: isLast, onClick: () => onMove(1) },
                    React.createElement(ChevronDown, { size: 15 })),
                React.createElement(ConfirmDelete, { onConfirm: onRemove }))),
        trackingType === "distance" ? (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 } },
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Einheiten"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: row.sets, onChange: set("sets") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Strecke (km)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", step: "0.1", value: row.distanceKm ?? "", onChange: set("distanceKm") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Pause (s)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.pause, onChange: set("pause") })))) : trackingType === "duration" ? (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 } },
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "S\u00E4tze"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: row.sets, onChange: set("sets") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Zieldauer (s)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.durationSec ?? "", onChange: set("durationSec") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Pause (s)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.pause, onChange: set("pause") })))) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 } },
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "S\u00E4tze"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: row.sets, onChange: set("sets") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Wdh."),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: row.reps, onChange: set("reps") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Gewicht (kg)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.weight, onChange: set("weight") })),
            React.createElement("div", null,
                React.createElement("label", { className: "ff-field-label" }, "Pause (s)"),
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.pause, onChange: set("pause") })))),
        React.createElement("input", { className: "ff-input", style: { marginTop: 10 }, placeholder: "Notiz / Tipp", value: row.note, onChange: set("note") })));
}
/* =========================================================================
   PLAN-EDITOR — Formular zum Erstellen/Bearbeiten EINES Trainingsplans
   =========================================================================
   Hier werden Name, Beschreibung, Trainingstage/Intervall sowie die
   einzelnen Übungen (siehe PlanExerciseRow) eines Plans bearbeitet.
   Bei körpergewichtsbasierten Übungen (z.B. Liegestütze) wird das
   Startgewicht automatisch aus dem aktuellen Körpergewicht berechnet.
   ========================================================================= */

export function PlanEditor({ plan, initialTemplate, allExercises, allEquipment, ownedEquipment, settings, currentWeightKg, favoriteExercises, onSave, onCancel }) {
    // Baut aus einer Vorlagen-Übungszeile eine vollständige Plan-Übungszeile,
    // inkl. Werttyp-abhängiger Felder und automatischer Gewichtsberechnung bei
    // körpergewichtsbasierten Übungen.
    const buildRowFromTemplate = (row) => {
        const ex = allExercises.find((e) => e.id === row.exerciseId);
        const isBodyweight = !!ex?.bodyweightFactor;
        const autoWeight = isBodyweight && currentWeightKg ? Math.round(currentWeightKg * ex.bodyweightFactor * 10) / 10 : 0;
        return {
            id: uid(),
            exerciseId: row.exerciseId,
            sets: row.sets,
            reps: row.reps,
            weight: autoWeight,
            distanceKm: ex?.trackingType === "distance" ? 1 : undefined,
            durationSec: ex?.trackingType === "duration" ? 30 : undefined,
            pause: row.pause,
            note: "",
        };
    };
    const [name, setName] = useState(plan?.name || initialTemplate?.name || "");
    const [description, setDescription] = useState(plan?.description || initialTemplate?.description || "");
    const [exercises, setExercises] = useState(plan?.exercises || (initialTemplate ? initialTemplate.exercises.map(buildRowFromTemplate) : []));
    const [days, setDays] = useState(new Set(plan?.schedule?.days || []));
    const [interval, setInterval] = useState(plan?.schedule?.interval || "weekly");
    const [showPicker, setShowPicker] = useState(false);
    const exerciseById = (id) => allExercises.find((e) => e.id === id);
    const addExercise = (ex) => {
        const isBodyweight = !!ex.bodyweightFactor;
        const autoWeight = isBodyweight && currentWeightKg ? Math.round(currentWeightKg * ex.bodyweightFactor * 10) / 10 : settings.defaultWeight;
        setExercises((prev) => [...prev, {
                id: uid(),
                exerciseId: ex.id,
                sets: settings.defaultSets,
                reps: settings.defaultReps,
                weight: autoWeight,
                distanceKm: ex.trackingType === "distance" ? 1 : undefined,
                durationSec: ex.trackingType === "duration" ? 30 : undefined,
                pause: settings.defaultPause,
                note: "",
            }]);
        setShowPicker(false);
    };
    const toggleDay = (id) => setDays((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    const updateRow = (idx, next) => setExercises((prev) => prev.map((r, i) => (i === idx ? next : r)));
    const removeRow = (idx) => setExercises((prev) => prev.filter((_, i) => i !== idx));
    const moveRow = (idx, dir) => setExercises((prev) => {
        const next = [...prev];
        const target = idx + dir;
        if (target < 0 || target >= next.length)
            return prev;
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
    });
    const [nameError, setNameError] = useState(false);
    const handleSave = () => {
        if (!name.trim()) {
            setNameError(true);
            return;
        }
        onSave({
            id: plan?.id || uid(),
            name: name.trim(),
            description: description.trim(),
            exercises: exercises.map((r) => ({
                ...r,
                sets: Number(r.sets) || 1,
                reps: Number(r.reps) || 0,
                weight: Number(r.weight) || 0,
                pause: Number(r.pause) || 0,
                distanceKm: r.distanceKm !== undefined && r.distanceKm !== "" ? Number(r.distanceKm) : undefined,
                durationSec: r.durationSec !== undefined && r.durationSec !== "" ? Number(r.durationSec) : undefined,
            })),
            schedule: { days: [...days], interval },
        });
    };
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, plan ? "Plan bearbeiten" : "Neuer Plan"),
        React.createElement("input", { className: "ff-input-display", style: nameError ? { borderBottomColor: "var(--danger)" } : undefined, placeholder: "Plan-Name (z.B. Push A)", value: name, onChange: (e) => { setName(e.target.value); if (nameError)
                setNameError(false); } }),
        nameError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 6 }, className: "ff-mono" }, "Bitte gib deinem Plan einen Namen."),
        React.createElement("textarea", { className: "ff-textarea", style: { marginTop: 18 }, placeholder: "Beschreibung / Ziel des Plans (optional)", value: description, onChange: (e) => setDescription(e.target.value) }),
        React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("label", { className: "ff-field-label" },
                React.createElement(Calendar, { size: 11, style: { verticalAlign: "-2px", marginRight: 4 } }),
                "Trainingstage"),
            React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, WEEKDAYS.map((d) => (React.createElement("button", { key: d.id, className: `ff-tagbtn ${days.has(d.id) ? "selected" : ""}`, onClick: () => toggleDay(d.id) }, d.label)))),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 14 } }, "Intervall"),
            React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, INTERVALS.map((iv) => (React.createElement("button", { key: iv.id, className: `ff-tagbtn ${interval === iv.id ? "selected" : ""}`, onClick: () => setInterval(iv.id) }, iv.label))))),
        React.createElement("div", { style: { marginTop: 24 } },
            exercises.map((row, idx) => (React.createElement(PlanExerciseRow, { key: row.id, row: row, exercise: exerciseById(row.exerciseId), onChange: (next) => updateRow(idx, next), onRemove: () => removeRow(idx), onMove: (dir) => moveRow(idx, dir), isFirst: idx === 0, isLast: idx === exercises.length - 1 }))),
            React.createElement("button", { onClick: () => setShowPicker(true), style: { width: "100%", padding: "22px", border: "1px dashed var(--border-light)", borderRadius: 10, background: "transparent", color: "var(--text-dim)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } },
                React.createElement(Plus, { size: 16 }),
                " \u00DCbung hinzuf\u00FCgen")),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 20 } },
            React.createElement("span", { className: "ff-mono", style: { color: "var(--text-dim)", fontSize: 12 } },
                exercises.length,
                " \u00DCbungen"),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { className: "ff-btn", onClick: onCancel }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleSave },
                    React.createElement(Check, { size: 14 }),
                    " Plan speichern"))),
        showPicker && React.createElement(ExercisePickerModal, { allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: ownedEquipment, favoriteExercises: favoriteExercises, onPick: addExercise, onClose: () => setShowPicker(false) })));
}
/* =========================================================================
   PLANS LIST VIEW
   ========================================================================= */
/* =========================================================================
   TRAININGSPLÄNE-TAB — Liste aller Pläne + Wechsel zum Bearbeiten
   =========================================================================
   Zeigt entweder die Liste aller Pläne (mit Favoriten-Filter, Duplizieren-
   und Löschen-Button, "Starten"-Button) ODER, wenn ein Plan gerade
   bearbeitet wird, den PlanEditor (siehe unten).
   ========================================================================= */

export function PlansView({ plans, allExercises, allEquipment, ownedEquipment, settings, currentWeightKg, favoriteExercises, favoritePlans, onToggleFavoritePlan, onCreate, onUpdate, onDelete, onClone, onStart, hasActiveWorkout }) {
    const [editing, setEditing] = useState(null); // null | plan | "new"
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    // Wird gesetzt, wenn ein Plan über "Vorlage verwenden" gestartet wird.
    const [templateToApply, setTemplateToApply] = useState(null);
    if (editing) {
        return (React.createElement(PlanEditor, { plan: editing === "new" ? null : editing, initialTemplate: editing === "new" ? templateToApply : null, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: ownedEquipment, settings: settings, currentWeightKg: currentWeightKg, favoriteExercises: favoriteExercises, onCancel: () => { setEditing(null); setTemplateToApply(null); }, onSave: (plan) => {
                editing === "new" ? onCreate(plan) : onUpdate(plan);
                setEditing(null);
                setTemplateToApply(null);
            } }));
    }
    const favoriteSet = new Set(favoritePlans || []);
    const visiblePlans = onlyFavorites ? plans.filter((p) => favoriteSet.has(p.id)) : plans;
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 } },
            React.createElement("div", null,
                React.createElement("p", { className: "ff-eyebrow" }, "Konfigurator"),
                React.createElement(GlitchTitle, { text: "Trainingspl\u00E4ne", size: 34 })),
            React.createElement("div", { style: { display: "flex", gap: 8 } },
                React.createElement("button", { className: "ff-btn", onClick: () => setShowTemplates(true) },
                    React.createElement(ClipboardList, { size: 14 }),
                    " Vorlage verwenden"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => setEditing("new") },
                    React.createElement(Plus, { size: 14 }),
                    " Neuer Plan"))),
        hasActiveWorkout && (React.createElement("p", { className: "ff-tag-note", style: { marginTop: 12, color: "var(--accent)" } }, "\u25CF Es l\u00E4uft gerade ein Training \u2014 schlie\u00DFe es im Tagebuch ab oder brich es ab, bevor du ein neues startest.")),
        plans.length > 0 && (React.createElement("div", { style: { marginTop: 18 } },
            React.createElement("button", { className: `ff-tagbtn ${onlyFavorites ? "selected" : ""}`, onClick: () => setOnlyFavorites((v) => !v) },
                React.createElement(Heart, { size: 12, style: { verticalAlign: "-1px", marginRight: 4 }, fill: onlyFavorites ? "currentColor" : "none" }),
                "Nur Favoriten"))),
        plans.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Du hast noch keinen Trainingsplan."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: () => setEditing("new") },
                React.createElement(Plus, { size: 14 }),
                " Ersten Plan erstellen"))) : visiblePlans.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } }, "Keine Favoriten-Pl\u00E4ne.")) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 22 } }, visiblePlans.map((plan) => {
            const scheduleDays = (plan.schedule?.days || []).map((id) => WEEKDAYS.find((d) => d.id === id)?.label || id);
            const intervalLabel = INTERVALS.find((iv) => iv.id === plan.schedule?.interval)?.label;
            return (React.createElement("div", { key: plan.id, className: "ff-card" },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                    React.createElement("p", { className: "ff-display", style: { fontSize: 20, margin: 0 } }, plan.name),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 2 } },
                        React.createElement(FavoriteButton, { active: favoriteSet.has(plan.id), onToggle: () => onToggleFavoritePlan(plan.id) }),
                        React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: () => onClone(plan), title: "Plan duplizieren", style: { color: "var(--text-faint)" } },
                            React.createElement(Copy, { size: 15 })),
                        React.createElement(ConfirmDelete, { onConfirm: () => onDelete(plan.id) }))),
                plan.description && React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 6 } }, plan.description),
                React.createElement("p", { className: "ff-mono", style: { fontSize: 11, color: "var(--text-faint)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 } },
                    React.createElement(Dumbbell, { size: 13 }),
                    " ",
                    plan.exercises.length,
                    " \u00DCbungen"),
                scheduleDays.length > 0 && (React.createElement("p", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 } },
                    React.createElement(Calendar, { size: 13 }),
                    " ",
                    scheduleDays.join(", "),
                    " \u00B7 ",
                    intervalLabel)),
                React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
                    React.createElement("button", { className: "ff-btn", style: { flex: 1, justifyContent: "center" }, onClick: () => setEditing(plan) }, "Bearbeiten"),
                    React.createElement("button", { className: "ff-btn ff-btn-primary", style: { flex: 1, justifyContent: "center" }, onClick: () => onStart(plan), disabled: hasActiveWorkout, title: hasActiveWorkout ? "Bitte zuerst das laufende Training im Tagebuch abschließen oder abbrechen" : undefined },
                        React.createElement(Play, { size: 13 }),
                        " Starten"))));
        }))),
        showTemplates && (React.createElement(TemplatePickerModal, { allExercises: allExercises, onPick: (template) => { setTemplateToApply(template); setShowTemplates(false); setEditing("new"); }, onClose: () => setShowTemplates(false) }))));
}
// Popup zur Auswahl einer der 5 fertigen Plan-Vorlagen (PLAN_TEMPLATES).

export function TemplatePickerModal({ allExercises, onPick, onClose }) {
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 22, margin: 0 } }, "Vorlage w\u00E4hlen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, PLAN_TEMPLATES.map((tpl) => {
                const exerciseNames = tpl.exercises.map((row) => allExercises.find((e) => e.id === row.exerciseId)?.name || row.exerciseId);
                return (React.createElement("button", { key: tpl.id, onClick: () => onPick(tpl), style: { textAlign: "left", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", color: "var(--text)", cursor: "pointer" } },
                    React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 15 } }, tpl.name),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 4 } }, tpl.description),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 6, color: "var(--text-dim)" } }, exerciseNames.join(" · "))));
            })))));
}
/* =========================================================================
   ACTIVE WORKOUT VIEW
   ========================================================================= */
// Kleine Stoppuhr für Zeit-basierte Übungen (z.B. Plank): Start/Stop-Knopf,
// zählt hoch, übergibt beim Stoppen die gemessene Zeit an die Übung.

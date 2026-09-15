/* =========================================================================
   Der Übungen-Tab inkl. Übungsdetails, Historie, Muskeldiagramm und Auswahl-Modal.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useMemo } from "https://esm.sh/react@18.3.1";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "https://esm.sh/recharts@2.12.7?deps=react@18.3.1,react-dom@18.3.1";
import { Plus, Check, ChevronDown, Sparkles, X, Search, Loader2, History, ChevronRight, Heart } from "../data/icons.js";
import { EQUIPMENT_CATEGORY_ORDER, MUSCLE_GROUPS } from "../data/equipment.js";
import { formatDateShort, formatDateLong } from "../utils/dates.js";
import { uid, equipmentNames, formatSetLabel, calcEstimated1RM } from "../utils/calculations.js";
import { GlitchTitle, FavoriteButton } from "./shared.js";

export function AddExerciseModal({ allEquipment, onClose, onSave }) {
    const [name, setName] = useState("");
    const [selEquip, setSelEquip] = useState(new Set());
    const [selMuscles, setSelMuscles] = useState(new Set());
    const [description, setDescription] = useState("");
    const [stepsText, setStepsText] = useState("");
    const [mistakesText, setMistakesText] = useState("");
    const [generating, setGenerating] = useState(false);
    const [genError, setGenError] = useState("");
    const toggleSet = (setter) => (id) => setter((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    const generateDescription = async () => {
        if (!name.trim()) {
            setGenError("Bitte zuerst einen Namen eingeben.");
            return;
        }
        setGenerating(true);
        setGenError("");
        try {
            const equipList = equipmentNames([...selEquip], allEquipment);
            const prompt = `Du bist Fitness-Trainer. Für die Übung "${name}"${equipList.length ? " mit folgendem Geräteeinsatz: " + equipList.join(", ") : ""} antworte NUR mit einem validen JSON-Objekt (keine Einleitung, keine Markdown-Codeblöcke), exakt in diesem Format:
{"description": "1-2 Sätze auf Deutsch, was die Übung bewirkt", "steps": ["Schritt 1", "Schritt 2", "Schritt 3", "Schritt 4"], "mistakes": ["Häufiger Fehler 1", "Häufiger Fehler 2", "Häufiger Fehler 3"]}
Die Schritte beschreiben die korrekte Ausführung, kurz und knapp auf Deutsch.`;
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 500,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
            const data = await response.json();
            const text = (data.content || []).map((b) => b.text || "").join("").trim();
            const cleaned = text.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(cleaned);
            if (parsed.description)
                setDescription(parsed.description);
            if (Array.isArray(parsed.steps))
                setStepsText(parsed.steps.join("\n"));
            if (Array.isArray(parsed.mistakes))
                setMistakesText(parsed.mistakes.join("\n"));
        }
        catch (e) {
            setGenError("Beschreibung konnte nicht generiert werden. Bitte erneut versuchen oder manuell ausfüllen.");
        }
        finally {
            setGenerating(false);
        }
    };
    const [nameError, setNameError] = useState(false);
    const handleSubmit = () => {
        if (!name.trim()) {
            setNameError(true);
            return;
        }
        onSave({
            id: "custom-" + uid(),
            name: name.trim(),
            equipment: [...selEquip],
            muscles: [...selMuscles],
            description: description.trim(),
            executionSteps: stepsText.split("\n").map((s) => s.trim()).filter(Boolean),
            commonMistakes: mistakesText.split("\n").map((s) => s.trim()).filter(Boolean),
            custom: true,
        });
    };
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, "Eigene \u00DCbung anlegen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("label", { className: "ff-field-label" }, "Name der \u00DCbung"),
            React.createElement("input", { className: "ff-input", style: nameError ? { borderColor: "var(--danger)" } : undefined, placeholder: "z.B. Bulgarian Split Squat", value: name, onChange: (e) => { setName(e.target.value); if (nameError)
                    setNameError(false); } }),
            nameError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 6 }, className: "ff-mono" }, "Bitte gib einen Namen ein."),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "Ben\u00F6tigte Ger\u00E4te"),
            React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 140, overflowY: "auto" } }, allEquipment.map((eq) => (React.createElement("button", { key: eq.id, className: `ff-tagbtn ${selEquip.has(eq.id) ? "selected" : ""}`, onClick: () => toggleSet(setSelEquip)(eq.id) }, eq.name)))),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "Muskelgruppen"),
            React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, MUSCLE_GROUPS.map((m) => (React.createElement("button", { key: m, className: `ff-tagbtn ${selMuscles.has(m) ? "selected" : ""}`, onClick: () => toggleSet(setSelMuscles)(m) }, m)))),
            React.createElement("button", { className: "ff-btn", style: { marginTop: 18, color: "var(--accent)", borderColor: "var(--accent)" }, onClick: generateDescription, disabled: generating },
                generating ? React.createElement(Loader2, { size: 14, style: { animation: "spin 1s linear infinite" } }) : React.createElement(Sparkles, { size: 14 }),
                generating ? "Generiere..." : "Alles mit KI generieren (Claude Sonnet 4.5)"),
            genError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 8 } }, genError),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "Beschreibung (optional)"),
            React.createElement("textarea", { className: "ff-textarea", placeholder: "Kurze Beschreibung der \u00DCbung...", value: description, onChange: (e) => setDescription(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "Ausf\u00FChrung (optional, ein Schritt pro Zeile)"),
            React.createElement("textarea", { className: "ff-textarea", placeholder: "Startposition einnehmen...\nBewegung kontrolliert ausführen...", value: stepsText, onChange: (e) => setStepsText(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "H\u00E4ufige Fehler (optional, ein Fehler pro Zeile)"),
            React.createElement("textarea", { className: "ff-textarea", placeholder: "Rücken rundet sich...\nZu viel Schwung...", value: mistakesText, onChange: (e) => setMistakesText(e.target.value) }),
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26 } },
                React.createElement("button", { className: "ff-btn", onClick: onClose }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleSubmit },
                    React.createElement(Check, { size: 14 }),
                    " Speichern")))));
}
// Zeigt den Verlauf EINER Übung über die Zeit (kleines Diagramm), z.B. wie
// sich das Gewicht bei Bankdrücken über mehrere Trainings entwickelt hat.

export function ExerciseHistoryModal({ exercise, logs, onClose }) {
    const trackingType = exercise.trackingType || "strength";
    const sessions = useMemo(() => {
        const rows = [];
        logs.forEach((log) => {
            const match = log.exercises.find((e) => e.exerciseId === exercise.id);
            if (match) {
                const doneSets = match.sets.filter((s) => s.done);
                let metric = 0;
                if (trackingType === "distance")
                    metric = doneSets.reduce((m, s) => m + (Number(s.distanceKm) || 0), 0);
                else if (trackingType === "duration")
                    metric = doneSets.reduce((m, s) => Math.max(m, Number(s.durationSec) || 0), 0);
                else
                    metric = doneSets.reduce((m, s) => Math.max(m, Number(s.weight) || 0), 0);
                const est1RM = trackingType === "strength"
                    ? doneSets.reduce((m, s) => Math.max(m, calcEstimated1RM(s.weight, s.reps)), 0)
                    : 0;
                rows.push({ date: log.date, sets: match.sets, metric, est1RM });
            }
        });
        return rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [logs, exercise, trackingType]);
    const metricLabel = trackingType === "distance" ? "km" : trackingType === "duration" ? "sek." : "kg";
    const chartData = sessions.filter((s) => s.metric > 0).map((s) => ({ date: formatDateShort(s.date), wert: Math.round(s.metric * 10) / 10 }));
    const best1RM = sessions.reduce((m, s) => Math.max(m, s.est1RM), 0);
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-eyebrow" }, "Verlauf"),
                    React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, exercise.name)),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            trackingType === "strength" && best1RM > 0 && (React.createElement("p", { className: "ff-tag-note", style: { marginBottom: 14 } },
                "Gesch\u00E4tztes 1RM (Epley-Formel): ",
                React.createElement("span", { style: { color: "var(--accent)" } },
                    Math.round(best1RM * 10) / 10,
                    " kg"))),
            sessions.length === 0 ? (React.createElement("div", { className: "ff-empty" }, "Diese \u00DCbung wurde noch in keinem Training protokolliert.")) : (React.createElement(React.Fragment, null,
                chartData.length > 1 && (React.createElement("div", { style: { width: "100%", height: 180, marginBottom: 20 } },
                    React.createElement(ResponsiveContainer, null,
                        React.createElement(LineChart, { data: chartData, margin: { top: 5, right: 10, left: -20, bottom: 0 } },
                            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                            React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 10, fontFamily: "JetBrains Mono" } }),
                            React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 10, fontFamily: "JetBrains Mono" } }),
                            React.createElement(Tooltip, { contentStyle: { background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: 8, fontSize: 12 } }),
                            React.createElement(Line, { type: "monotone", dataKey: "wert", name: metricLabel, stroke: "#d4ff00", strokeWidth: 2, dot: { r: 3, fill: "#d4ff00" } }))))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [...sessions].reverse().map((s, i) => (React.createElement("div", { key: i, style: { borderBottom: "1px solid var(--border)", paddingBottom: 10 } },
                    React.createElement("p", { className: "ff-tag-note" }, formatDateLong(s.date)),
                    React.createElement("p", { style: { margin: "4px 0 0 0", fontSize: 13 } }, s.sets.filter((st) => st.done).map((st, j) => formatSetLabel(st, trackingType)).join("  ·  ") || "Keine Sätze abgehakt"),
                    trackingType === "strength" && s.est1RM > 0 && (React.createElement("p", { className: "ff-mono", style: { margin: "4px 0 0 0", fontSize: 11, color: "var(--text-faint)" } },
                        "gesch\u00E4tztes 1RM: ",
                        Math.round(s.est1RM * 10) / 10,
                        " kg")))))))))));
}
// Zeichnet die kleine Strichmännchen-Körpersilhouette (vorne/hinten) und
// färbt die trainierten Muskelgruppen in Neongrün ein. Reine Optik, keine
// echte Anatomie-Grafik.

export function BodyDiagram({ view, muscles }) {
    const has = (m) => muscles.includes(m);
    const all = has("Ganzkörper");
    const c = (active) => (all || active) ? "var(--accent)" : "#3a3a3a";
    const isFront = view === "front";
    const shoulderActive = has("Schultern");
    const armActive = isFront ? has("Bizeps") : (has("Trizeps") || has("Unterarme"));
    const torsoUpperActive = isFront ? has("Brust") : has("Rücken");
    const torsoLowerActive = isFront ? has("Core") : has("Rücken");
    const hipActive = !isFront && has("Gesäß");
    const legActive = isFront ? has("Quadrizeps") : has("Beinbizeps");
    const calfActive = has("Waden");
    return (React.createElement("svg", { viewBox: "0 0 120 240", style: { width: 96, height: "auto" } },
        React.createElement("circle", { cx: "60", cy: "18", r: "14", fill: "#3a3a3a" }),
        React.createElement("rect", { x: "52", y: "28", width: "16", height: "12", fill: "#3a3a3a" }),
        React.createElement("ellipse", { cx: "24", cy: "46", rx: "14", ry: "12", fill: c(shoulderActive) }),
        React.createElement("ellipse", { cx: "96", cy: "46", rx: "14", ry: "12", fill: c(shoulderActive) }),
        React.createElement("rect", { x: "10", y: "54", width: "20", height: "70", rx: "10", fill: c(armActive) }),
        React.createElement("rect", { x: "90", y: "54", width: "20", height: "70", rx: "10", fill: c(armActive) }),
        React.createElement("rect", { x: "36", y: "38", width: "48", height: "46", rx: "14", fill: c(torsoUpperActive) }),
        React.createElement("rect", { x: "40", y: "82", width: "40", height: "34", rx: "12", fill: c(torsoLowerActive) }),
        React.createElement("rect", { x: "38", y: "114", width: "44", height: "20", rx: "8", fill: c(hipActive) }),
        React.createElement("rect", { x: "38", y: "132", width: "20", height: "58", rx: "10", fill: c(legActive) }),
        React.createElement("rect", { x: "62", y: "132", width: "20", height: "58", rx: "10", fill: c(legActive) }),
        React.createElement("rect", { x: "39", y: "190", width: "18", height: "44", rx: "9", fill: c(calfActive) }),
        React.createElement("rect", { x: "63", y: "190", width: "18", height: "44", rx: "9", fill: c(calfActive) })));
}
// Detailansicht EINER Übung: Körperdiagramm mit hervorgehobenen
// Zielmuskeln, Beschreibung, Ausführungsschritte, häufige Fehler und
// benötigte Geräte. Wird geöffnet, wenn man im Übungen-Tab auf eine
// Übung klickt.

export function ExerciseDetailModal({ exercise, allEquipment, logs, onClose, onShowHistory }) {
    const muscles = exercise.muscles || [];
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", style: { maxWidth: 860 }, onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 30, margin: 0 } }, exercise.name),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("div", { className: "ff-detail-grid" },
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-eyebrow" }, "Zielmuskeln"),
                    React.createElement("div", { style: { display: "flex", gap: 18, marginTop: 12, justifyContent: "center", flexWrap: "wrap" } },
                        React.createElement("div", { style: { textAlign: "center" } },
                            React.createElement("p", { className: "ff-mono", style: { fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 6 } }, "VORNE"),
                            React.createElement(BodyDiagram, { view: "front", muscles: muscles })),
                        React.createElement("div", { style: { textAlign: "center" } },
                            React.createElement("p", { className: "ff-mono", style: { fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 6 } }, "HINTEN"),
                            React.createElement(BodyDiagram, { view: "back", muscles: muscles }))),
                    React.createElement("button", { className: "ff-btn ff-btn-sm", style: { width: "100%", justifyContent: "center", marginTop: 18 }, onClick: onShowHistory },
                        React.createElement(History, { size: 13 }),
                        " Verlauf ansehen")),
                React.createElement("div", null,
                    muscles.length > 0 && (React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", marginBottom: 16 } }, muscles.map((m) => (React.createElement("span", { key: m, className: "ff-mono", style: { fontSize: 11, padding: "6px 12px", borderRadius: 6, background: "var(--accent-dim)", color: "var(--accent)", letterSpacing: "0.05em" } }, m.toUpperCase()))))),
                    exercise.description ? (React.createElement("p", { style: { fontSize: 15, lineHeight: 1.6, color: "var(--text)", margin: 0 } }, exercise.description)) : (React.createElement("p", { style: { fontSize: 14, color: "var(--text-faint)", margin: 0 } }, "Keine Beschreibung hinterlegt.")),
                    exercise.executionSteps?.length > 0 && (React.createElement("div", { style: { marginTop: 22 } },
                        React.createElement("p", { className: "ff-eyebrow" }, "Ausf\u00FChrung"),
                        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 11, marginTop: 10 } }, exercise.executionSteps.map((step, i) => (React.createElement("div", { key: i, style: { display: "flex", gap: 12 } },
                            React.createElement("span", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13, minWidth: 20, flexShrink: 0 } }, String(i + 1).padStart(2, "0")),
                            React.createElement("span", { style: { fontSize: 14, color: "var(--text)", lineHeight: 1.5 } }, step))))))),
                    exercise.commonMistakes?.length > 0 && (React.createElement("div", { style: { marginTop: 22 } },
                        React.createElement("p", { className: "ff-eyebrow" }, "H\u00E4ufige Fehler"),
                        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 } }, exercise.commonMistakes.map((m, i) => (React.createElement("div", { key: i, style: { borderLeft: "2px solid var(--danger)", paddingLeft: 10 } },
                            React.createElement("span", { style: { fontSize: 14, color: "var(--text-dim)" } }, m))))))),
                    React.createElement("div", { style: { marginTop: 22 } },
                        React.createElement("p", { className: "ff-eyebrow" }, "Ben\u00F6tigte Ger\u00E4te"),
                        React.createElement("p", { style: { fontSize: 14, color: "var(--text)", marginTop: 8 } }, exercise.equipment.length ? equipmentNames(exercise.equipment, allEquipment).join(", ") : "Kein Gerät nötig")))))));
}
/* =========================================================================
   ÜBUNGEN-TAB — Bibliothek aller Übungen (vordefiniert + eigene)
   =========================================================================
   Enthält Suche, die Filter "Nur verfügbare" / "Nur Favoriten", sowie zwei
   einklappbare Filtergruppen: "Muskelgruppe" und "Gerätetyp" (dort gibt es
   auch die Option "Favoriten" = nur Übungen mit favorisierten Geräten).
   Klick auf eine Karte öffnet die Detailansicht (ExerciseDetailModal).
   ========================================================================= */

export function ExercisesView({ allExercises, allEquipment, ownedEquipment, logs, onAddCustom, favoriteExercises, onToggleFavoriteExercise, favoriteEquipment }) {
    const [search, setSearch] = useState("");
    const [muscleFilter, setMuscleFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [muscleFilterOpen, setMuscleFilterOpen] = useState(false);
    const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [historyEx, setHistoryEx] = useState(null);
    const [detailEx, setDetailEx] = useState(null);
    const ownedSet = useMemo(() => new Set(ownedEquipment), [ownedEquipment]);
    const favoriteSet = useMemo(() => new Set(favoriteExercises), [favoriteExercises]);
    const favoriteEquipmentSet = useMemo(() => new Set(favoriteEquipment || []), [favoriteEquipment]);
    const equipmentCategoryById = useMemo(() => {
        const map = {};
        allEquipment.forEach((eq) => { map[eq.id] = eq.category; });
        return map;
    }, [allEquipment]);
    const filtered = useMemo(() => {
        return allExercises.filter((ex) => {
            if (search && !ex.name.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (muscleFilter && !ex.muscles.includes(muscleFilter))
                return false;
            if (categoryFilter === "__favorites__") {
                if (!ex.equipment.some((id) => favoriteEquipmentSet.has(id)))
                    return false;
            }
            else if (categoryFilter && !ex.equipment.some((id) => equipmentCategoryById[id] === categoryFilter)) {
                return false;
            }
            if (onlyAvailable && !ex.equipment.every((id) => ownedSet.has(id)))
                return false;
            if (onlyFavorites && !favoriteSet.has(ex.id))
                return false;
            return true;
        });
    }, [allExercises, search, muscleFilter, categoryFilter, onlyAvailable, onlyFavorites, ownedSet, favoriteSet, favoriteEquipmentSet, equipmentCategoryById]);
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 } },
            React.createElement("div", null,
                React.createElement("p", { className: "ff-eyebrow" }, "Bibliothek"),
                React.createElement(GlitchTitle, { text: "\u00DCbungen", size: 34 })),
            React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Eigene \u00DCbung")),
        React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap", alignItems: "center" } },
            React.createElement("div", { style: { position: "relative", flex: "1 1 220px" } },
                React.createElement(Search, { size: 15, style: { position: "absolute", left: 12, top: 13, color: "var(--text-faint)" } }),
                React.createElement("input", { className: "ff-input", style: { paddingLeft: 36 }, placeholder: "\u00DCbung suchen...", value: search, onChange: (e) => setSearch(e.target.value) })),
            React.createElement("button", { className: `ff-tagbtn ${onlyAvailable ? "selected" : ""}`, onClick: () => setOnlyAvailable((v) => !v) }, "Nur verf\u00FCgbare"),
            React.createElement("button", { className: `ff-tagbtn ${onlyFavorites ? "selected" : ""}`, onClick: () => setOnlyFavorites((v) => !v) },
                React.createElement(Heart, { size: 12, style: { verticalAlign: "-1px", marginRight: 4 }, fill: onlyFavorites ? "currentColor" : "none" }),
                "Nur Favoriten")),
        React.createElement("div", { style: { marginTop: 14 } },
            React.createElement("button", { onClick: () => setMuscleFilterOpen((v) => !v), style: { display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "4px 0" } },
                React.createElement(ChevronDown, { size: 14, style: { transform: muscleFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" } }),
                React.createElement("span", { className: "ff-field-label", style: { margin: 0 } },
                    "Muskelgruppe",
                    muscleFilter ? `: ${muscleFilter}` : "")),
            muscleFilterOpen && (React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 } },
                React.createElement("button", { className: `ff-tagbtn ${!muscleFilter ? "selected" : ""}`, onClick: () => setMuscleFilter(null) }, "Alle"),
                MUSCLE_GROUPS.map((m) => (React.createElement("button", { key: m, className: `ff-tagbtn ${muscleFilter === m ? "selected" : ""}`, onClick: () => setMuscleFilter(m) }, m)))))),
        React.createElement("div", { style: { marginTop: 10 } },
            React.createElement("button", { onClick: () => setCategoryFilterOpen((v) => !v), style: { display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "4px 0" } },
                React.createElement(ChevronDown, { size: 14, style: { transform: categoryFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" } }),
                React.createElement("span", { className: "ff-field-label", style: { margin: 0 } },
                    "Ger\u00E4tetyp",
                    categoryFilter ? `: ${categoryFilter === "__favorites__" ? "Favoriten" : categoryFilter}` : "")),
            categoryFilterOpen && (React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 } },
                React.createElement("button", { className: `ff-tagbtn ${!categoryFilter ? "selected" : ""}`, onClick: () => setCategoryFilter(null) }, "Alle"),
                React.createElement("button", { className: `ff-tagbtn ${categoryFilter === "__favorites__" ? "selected" : ""}`, onClick: () => setCategoryFilter("__favorites__") },
                    React.createElement(Heart, { size: 11, style: { verticalAlign: "-1px", marginRight: 4 }, fill: categoryFilter === "__favorites__" ? "currentColor" : "none" }),
                    "Favoriten"),
                EQUIPMENT_CATEGORY_ORDER.map((c) => (React.createElement("button", { key: c, className: `ff-tagbtn ${categoryFilter === c ? "selected" : ""}`, onClick: () => setCategoryFilter(c) }, c)))))),
        filtered.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } }, "Keine \u00DCbungen gefunden.")) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 20 } }, filtered.map((ex) => {
            const available = ex.equipment.every((id) => ownedSet.has(id));
            return (React.createElement("div", { key: ex.id, className: "ff-card", style: { display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }, onClick: () => setDetailEx(ex) },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                    React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 15 } }, ex.name),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 2 } },
                        ex.custom && React.createElement("span", { className: "ff-tag-note", style: { color: "var(--accent)", marginRight: 4 } }, "EIGEN"),
                        React.createElement(FavoriteButton, { active: favoriteSet.has(ex.id), onToggle: () => onToggleFavoriteExercise(ex.id) }))),
                React.createElement("p", { className: "ff-tag-note" }, ex.muscles.join(" · ") || "—"),
                React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, equipmentNames(ex.equipment, allEquipment).map((n) => (React.createElement("span", { key: n, className: "ff-tag-note", style: { padding: "3px 8px", border: "1px solid var(--border)", borderRadius: 12 } }, n)))),
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 } },
                    React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: available ? "var(--accent)" : "var(--text-faint)" } }, available ? "● Verfügbar" : "○ Geräte fehlen"),
                    React.createElement("button", { className: "ff-btn ff-btn-icon ff-btn-sm", onClick: (e) => { e.stopPropagation(); setHistoryEx(ex); }, title: "Verlauf ansehen" },
                        React.createElement(History, { size: 14 })))));
        }))),
        showAdd && (React.createElement(AddExerciseModal, { allEquipment: allEquipment, onClose: () => setShowAdd(false), onSave: (ex) => { onAddCustom(ex); setShowAdd(false); } })),
        historyEx && React.createElement(ExerciseHistoryModal, { exercise: historyEx, logs: logs, onClose: () => setHistoryEx(null) }),
        detailEx && (React.createElement(ExerciseDetailModal, { exercise: detailEx, allEquipment: allEquipment, logs: logs, onClose: () => setDetailEx(null), onShowHistory: () => { setHistoryEx(detailEx); setDetailEx(null); } }))));
}
/* =========================================================================
   PLAN EDITOR
   ========================================================================= */
// Popup-Fenster zum Auswählen einer Übung, wenn man im Plan-Editor auf
// "+ Übung hinzufügen" klickt. Mit Suche sowie Filtern nach "nur mit
// meinen Geräten" und "nur Favoriten".

export function ExercisePickerModal({ allExercises, allEquipment, ownedEquipment, favoriteExercises, onPick, onClose }) {
    const [search, setSearch] = useState("");
    const ownedSet = useMemo(() => new Set(ownedEquipment || []), [ownedEquipment]);
    const favoriteSet = useMemo(() => new Set(favoriteExercises || []), [favoriteExercises]);
    const hasEquipment = ownedSet.size > 0;
    const [onlyAvailable, setOnlyAvailable] = useState(hasEquipment);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const filtered = allExercises.filter((ex) => {
        if (search && !ex.name.toLowerCase().includes(search.toLowerCase()))
            return false;
        if (onlyAvailable && !ex.equipment.every((id) => ownedSet.has(id)))
            return false;
        if (onlyFavorites && !favoriteSet.has(ex.id))
            return false;
        return true;
    });
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 22, margin: 0 } }, "\u00DCbung w\u00E4hlen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("input", { className: "ff-input", placeholder: "Suchen...", value: search, onChange: (e) => setSearch(e.target.value), autoFocus: true }),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" } },
                React.createElement("button", { className: `ff-tagbtn ${onlyAvailable ? "selected" : ""}`, onClick: () => setOnlyAvailable((v) => !v) }, "Nur mit meinen Ger\u00E4ten"),
                React.createElement("button", { className: `ff-tagbtn ${onlyFavorites ? "selected" : ""}`, onClick: () => setOnlyFavorites((v) => !v) },
                    React.createElement(Heart, { size: 12, style: { verticalAlign: "-1px", marginRight: 4 }, fill: onlyFavorites ? "currentColor" : "none" }),
                    "Nur Favoriten"),
                !hasEquipment && React.createElement("span", { className: "ff-tag-note" }, "Noch keine Ger\u00E4te ausgew\u00E4hlt \u2014 alle \u00DCbungen werden angezeigt.")),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 14, maxHeight: 340, overflowY: "auto" } },
                filtered.map((ex) => {
                    const available = ex.equipment.every((id) => ownedSet.has(id));
                    return (React.createElement("button", { key: ex.id, onClick: () => onPick(ex), style: { textAlign: "left", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" } },
                        React.createElement("div", null,
                            React.createElement("span", null,
                                favoriteSet.has(ex.id) && React.createElement(Heart, { size: 11, fill: "var(--accent)", color: "var(--accent)", style: { verticalAlign: "-1px", marginRight: 5 } }),
                                ex.name),
                            React.createElement("div", { className: "ff-tag-note", style: { marginTop: 2 } }, equipmentNames(ex.equipment, allEquipment).join(" · ") || "Kein Gerät nötig")),
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                            hasEquipment && (React.createElement("span", { className: "ff-mono", style: { fontSize: 10, color: available ? "var(--accent)" : "var(--text-faint)" } }, available ? "●" : "○")),
                            React.createElement(ChevronRight, { size: 15, color: "var(--text-faint)" }))));
                }),
                filtered.length === 0 && React.createElement("p", { className: "ff-tag-note", style: { padding: 10 } }, "Keine Treffer mit deinen aktuellen Ger\u00E4ten. Deaktiviere den Filter oder w\u00E4hle mehr Ger\u00E4te aus.")))));
}
// Eine einzelne Übungszeile innerhalb der Planerstellung. Zeigt je nach
// Werttyp der Übung unterschiedliche Felder (Sätze/Wdh./Gewicht ODER
// Strecke ODER Zieldauer) — siehe die drei "wenn/sonst"-Blöcke unten.

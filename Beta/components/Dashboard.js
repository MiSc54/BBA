/* =========================================================================
   Die Übersichtsseite (Dashboard) mit den Auswertungs- und Fortschrittskarten.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useMemo } from "https://esm.sh/react@18.3.1";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "https://esm.sh/recharts@2.12.7?deps=react@18.3.1,react-dom@18.3.1";
import { Dumbbell, Play, Clock, Flame, TrendingUp, Users } from "../data/icons.js";
import { MEASUREMENT_FIELDS, RANGE_OPTIONS } from "../data/constants.js";
import { EQUIPMENT, MUSCLE_GROUPS } from "../data/equipment.js";
import { formatDateShort, formatDateLong, startOfWeek } from "../utils/dates.js";
import { calcBMI, computeLogKcal, computeLogVolume, filterByRange } from "../utils/calculations.js";
import { GlitchTitle, DevCredit, StatCard, SwipeStatCard } from "./shared.js";

export function Dashboard({ logs, plans, allExercises, onGoToPlans, bodyLog, profileDetails, dashboardConfig, onSetRange, currentWeightKg }) {
    const range = dashboardConfig?.range || "month";
    const recent = useMemo(() => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3), [logs]);
    const sortedBody = useMemo(() => [...(bodyLog || [])].sort((a, b) => new Date(a.date) - new Date(b.date)), [bodyLog]);
    const heightCm = Number(profileDetails?.heightCm) || null;
    const goalWeight = profileDetails?.goalWeightKg ? Number(profileDetails.goalWeightKg) : null;
    const latestBody = sortedBody[sortedBody.length - 1];
    const latestBMI = latestBody ? calcBMI(latestBody.weightKg, heightCm) : null;
    const rangedLogs = useMemo(() => filterByRange(logs, range, (l) => l.date), [logs, range]);
    const rangedBody = useMemo(() => filterByRange(sortedBody, range, (e) => e.date), [sortedBody, range]);
    const weightChartData = rangedBody.filter((e) => e.weightKg != null).map((e) => ({ date: formatDateShort(e.date), gewicht: e.weightKg, ziel: goalWeight }));
    const visibleMeasurements = (dashboardConfig?.visibleMeasurements || []).filter((id) => rangedBody.some((e) => e.measurements?.[id] != null));
    const measurementChartData = rangedBody.map((e) => {
        const row = { date: formatDateShort(e.date) };
        visibleMeasurements.forEach((id) => { if (e.measurements?.[id] != null)
            row[id] = e.measurements[id]; });
        return row;
    });
    const measurementColors = ["#d4ff00", "#00fff9", "#ff00c1", "#ff9f40", "#4d9fff", "#c084fc", "#f472b6", "#34d399"];
    const energyChartData = useMemo(() => {
        return [...rangedLogs]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((l) => ({ date: formatDateShort(l.date), kcal: Math.round(computeLogKcal(l, allExercises, currentWeightKg)) }));
    }, [rangedLogs, allExercises, currentWeightKg]);
    // Muskelgruppen-Balance: zählt für jede Muskelgruppe, wie viele abgehakte
    // Sätze im gewählten Zeitraum darauf entfielen. Eine Übung mit mehreren
    // Muskelgruppen zählt für JEDE davon pro Satz - bewusste Vereinfachung,
    // keine biomechanisch exakte Gewichtung.
    const muscleBalance = useMemo(() => {
        const counts = {};
        MUSCLE_GROUPS.forEach((m) => { counts[m] = 0; });
        rangedLogs.forEach((log) => {
            log.exercises.forEach((ex) => {
                const meta = allExercises.find((e) => e.id === ex.exerciseId);
                const doneSets = ex.sets.filter((s) => s.done).length;
                (meta?.muscles || []).forEach((m) => {
                    if (counts[m] != null)
                        counts[m] += doneSets;
                });
            });
        });
        const max = Math.max(1, ...Object.values(counts));
        return MUSCLE_GROUPS.map((m) => ({ muscle: m, count: counts[m], pct: Math.round((counts[m] / max) * 100) }))
            .sort((a, b) => b.count - a.count);
    }, [rangedLogs, allExercises]);
    const hasMuscleData = muscleBalance.some((m) => m.count > 0);
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Willkommen zur\u00FCck"),
        React.createElement(GlitchTitle, { text: "Deine Trainings-Zentrale", size: 38 }),
        React.createElement("div", { className: "ff-stat-grid", style: { marginTop: 28 } },
            React.createElement(SwipeStatCard, { label: "Workouts", icon: Dumbbell, computeValue: (mode) => {
                    if (mode === "last")
                        return logs.length > 0 ? 1 : 0;
                    const now = new Date();
                    if (mode === "day")
                        return logs.filter((l) => new Date(l.date).toDateString() === now.toDateString()).length;
                    const weekStart = startOfWeek(now);
                    return logs.filter((l) => new Date(l.date) >= weekStart).length;
                } }),
            React.createElement(SwipeStatCard, { label: "Trainingszeit", icon: Clock, unit: "min", computeValue: (mode) => {
                    if (mode === "last") {
                        const last = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                        return last?.durationMin || 0;
                    }
                    const now = new Date();
                    if (mode === "day")
                        return logs.filter((l) => new Date(l.date).toDateString() === now.toDateString()).reduce((s, l) => s + (l.durationMin || 0), 0);
                    const weekStart = startOfWeek(now);
                    return logs.filter((l) => new Date(l.date) >= weekStart).reduce((s, l) => s + (l.durationMin || 0), 0);
                } }),
            React.createElement(SwipeStatCard, { label: "Energie", icon: Flame, unit: "kcal", computeValue: (mode) => {
                    if (!currentWeightKg || logs.length === 0)
                        return 0;
                    const now = new Date();
                    if (mode === "last") {
                        const last = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                        return last ? computeLogKcal(last, allExercises, currentWeightKg) : 0;
                    }
                    if (mode === "day") {
                        return logs.filter((l) => new Date(l.date).toDateString() === now.toDateString()).reduce((s, l) => s + computeLogKcal(l, allExercises, currentWeightKg), 0);
                    }
                    const weekStart = startOfWeek(now);
                    return logs.filter((l) => new Date(l.date) >= weekStart).reduce((s, l) => s + computeLogKcal(l, allExercises, currentWeightKg), 0);
                } }),
            (latestBody?.weightKg != null || goalWeight) && (React.createElement(StatCard, { label: "Gewicht / Ziel", value: `${latestBody?.weightKg ?? "—"}${goalWeight ? ` / ${goalWeight}` : ""}`, suffix: "kg", icon: TrendingUp })),
            latestBMI && React.createElement(StatCard, { label: "BMI", value: latestBMI.toFixed(1), icon: Users })),
        (dashboardConfig?.showWeight || (dashboardConfig?.showEnergy ?? true) || dashboardConfig?.showMeasurements) && (React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 } }, RANGE_OPTIONS.map((r) => (React.createElement("button", { key: r.id, className: `ff-tagbtn ${range === r.id ? "selected" : ""}`, onClick: () => onSetRange?.(r.id) }, r.label))))),
        (dashboardConfig?.showEnergy ?? true) && (React.createElement("div", { className: "ff-card", style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Progression"),
            React.createElement("p", { className: "ff-display", style: { fontSize: 22, marginTop: 2, marginBottom: 18 } }, "Energie \u00FCber Zeit"),
            energyChartData.length === 0 ? (React.createElement("div", { className: "ff-empty" },
                React.createElement("p", null, "Noch keine Workouts im gew\u00E4hlten Zeitraum."),
                React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: onGoToPlans },
                    React.createElement(Play, { size: 14 }),
                    " Erstes Training starten"))) : (React.createElement("div", { style: { width: "100%", height: 240 } },
                React.createElement(ResponsiveContainer, null,
                    React.createElement(LineChart, { data: energyChartData, margin: { top: 10, right: 10, left: -10, bottom: 0 } },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                        React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(Tooltip, { contentStyle: { background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "var(--text-dim)" } }),
                        React.createElement(Line, { type: "monotone", dataKey: "kcal", stroke: "#ff9f40", strokeWidth: 2, dot: { r: 3, fill: "#ff9f40" }, activeDot: { r: 6 } }))))))),
        dashboardConfig?.showWeight && weightChartData.length > 0 && (React.createElement("div", { className: "ff-card", style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "K\u00F6rperverlauf"),
            React.createElement("p", { className: "ff-display", style: { fontSize: 22, marginTop: 2, marginBottom: 18 } }, "Gewicht \u00FCber Zeit"),
            React.createElement("div", { style: { width: "100%", height: 220 } },
                React.createElement(ResponsiveContainer, null,
                    React.createElement(LineChart, { data: weightChartData, margin: { top: 10, right: 10, left: -10, bottom: 0 } },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                        React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" }, domain: ["auto", "auto"] }),
                        React.createElement(Tooltip, { contentStyle: { background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "var(--text-dim)" } }),
                        React.createElement(Line, { type: "monotone", dataKey: "gewicht", stroke: "#d4ff00", strokeWidth: 2, dot: { r: 3, fill: "#d4ff00" } }),
                        goalWeight && React.createElement(Line, { type: "monotone", dataKey: "ziel", stroke: "#8f8f8f", strokeWidth: 1.5, strokeDasharray: "6 4", dot: false, name: "Zielgewicht" })))))),
        dashboardConfig?.showMeasurements && visibleMeasurements.length > 0 && measurementChartData.length > 0 && (React.createElement("div", { className: "ff-card", style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "K\u00F6rperverlauf"),
            React.createElement("p", { className: "ff-display", style: { fontSize: 22, marginTop: 2, marginBottom: 18 } }, "Umfangsma\u00DFe \u00FCber Zeit"),
            React.createElement("div", { style: { width: "100%", height: 240 } },
                React.createElement(ResponsiveContainer, null,
                    React.createElement(LineChart, { data: measurementChartData, margin: { top: 10, right: 10, left: -10, bottom: 0 } },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                        React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" }, domain: ["auto", "auto"] }),
                        React.createElement(Tooltip, { contentStyle: { background: "var(--surface-2)", border: "1px solid var(--border-light)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "var(--text-dim)" } }),
                        visibleMeasurements.map((id, i) => {
                            const meta = MEASUREMENT_FIELDS.find((m) => m.id === id);
                            return React.createElement(Line, { key: id, type: "monotone", dataKey: id, name: meta?.label || id, stroke: measurementColors[i % measurementColors.length], strokeWidth: 2, dot: { r: 3 }, connectNulls: true });
                        })))))),
        (dashboardConfig?.showMuscleBalance ?? true) && hasMuscleData && (React.createElement("div", { className: "ff-card", style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Analyse"),
            React.createElement("p", { className: "ff-display", style: { fontSize: 22, marginTop: 2, marginBottom: 6 } }, "Muskelgruppen-Balance"),
            React.createElement("p", { className: "ff-tag-note", style: { marginBottom: 16 } }, "Abgehakte S\u00E4tze pro Muskelgruppe im gew\u00E4hlten Zeitraum - hilft zu erkennen, was zuletzt zu kurz kam."),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, muscleBalance.map((m) => (React.createElement("div", { key: m.muscle },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } },
                    React.createElement("span", { style: { fontSize: 13 } }, m.muscle),
                    React.createElement("span", { className: "ff-mono", style: { fontSize: 12, color: m.count > 0 ? "var(--accent)" : "var(--text-faint)" } },
                        m.count,
                        " S\u00E4tze")),
                React.createElement("div", { style: { height: 6, borderRadius: 3, background: "var(--surface-3)", overflow: "hidden" } },
                    React.createElement("div", { style: { height: "100%", width: `${m.pct}%`, background: m.count > 0 ? "var(--accent)" : "transparent", borderRadius: 3, transition: "width 0.3s ease" } })))))))),
        recent.length > 0 && (React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Letzte Workouts"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 } }, recent.map((l) => (React.createElement("div", { key: l.id, className: "ff-card", style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 } },
                React.createElement("div", null,
                    React.createElement("p", { style: { margin: 0, fontWeight: 600 } }, l.planName),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, formatDateLong(l.date))),
                React.createElement("p", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13 } },
                    computeLogVolume(l).toLocaleString("de-DE"),
                    " kg"))))))),
        React.createElement(DevCredit, null)));
}
/* =========================================================================
   EQUIPMENT VIEW
   ========================================================================= */
// Formular (Popup) zum Anlegen eines eigenen Geräts: Name + Kategorie.

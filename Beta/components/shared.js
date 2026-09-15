/* =========================================================================
   Kleine, mehrfach verwendete UI-Bausteine (Buttons, Kartenüberschriften, Statistik-Karten).
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useEffect, useMemo, useRef } from "https://esm.sh/react@18.3.1";
import { Trash2, X, ChevronRight, ArrowUp, Heart } from "../data/icons.js";
import { APP_VERSION, PERIOD_MODES, PERIOD_MODE_LABELS } from "../data/constants.js";

export function GlitchTitle({ text, size = 40 }) {
    return (React.createElement("h1", { className: "ff-display glitch", style: { fontSize: size, margin: 0 } },
        text,
        React.createElement("span", { className: "gl-a", "aria-hidden": "true" }, text),
        React.createElement("span", { className: "gl-b", "aria-hidden": "true" }, text)));
}
// Der grüne Kreis-Button unten rechts, der erscheint, sobald man weiter
// als 300px nach unten gescrollt hat, und beim Klick sanft nach oben
// zurückscrollt.

export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    if (!visible)
        return null;
    return (React.createElement("button", { className: "ff-scrolltop", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), title: "Nach oben", "aria-label": "Nach oben scrollen" },
        React.createElement(ArrowUp, { size: 18 })));
}
// Fußzeile ganz unten auf "Übersicht" und "Setup": Entwickler-Name +
// aktuelle Versionsnummer (aus der Konstante APP_VERSION ganz oben).

export function DevCredit() {
    return (React.createElement("div", { style: { textAlign: "center", marginTop: 40, marginBottom: 8 } },
        React.createElement("p", { className: "ff-mono", style: { color: "var(--text-faint)", fontSize: 11, margin: 0 } }, "Developed by Michael Schulze"),
        React.createElement("p", { className: "ff-mono", style: { color: "var(--text-faint)", fontSize: 10, margin: 0, marginTop: 2 } },
            "v",
            APP_VERSION)));
}
/* =========================================================================
   SMALL SHARED COMPONENTS
   ========================================================================= */
// Einfache Info-Kachel: großer Wert, kleines Label darüber, Icon oben rechts.
// Wird an vielen Stellen für Statistiken verwendet (z.B. "BMI: 23.4").

export function StatCard({ label, value, icon: Icon, suffix }) {
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("p", { className: "ff-eyebrow", style: { margin: 0 } }, label),
            React.createElement(Icon, { size: 16, color: "var(--text-faint)" })),
        React.createElement("p", { className: "ff-display", style: { fontSize: 34, marginTop: 10 } },
            value,
            suffix ? React.createElement("span", { style: { fontSize: 16, color: "var(--text-dim)", marginLeft: 4 } }, suffix) : null)));
}
// Löschen-Button mit eingebauter Sicherheitsabfrage: erster Klick zeigt
// "Wirklich?", erst der zweite Klick löscht tatsächlich.

export function ConfirmDelete({ onConfirm, label = "Löschen" }) {
    const [confirming, setConfirming] = useState(false);
    if (confirming) {
        return (React.createElement("div", { style: { display: "flex", gap: 6 } },
            React.createElement("button", { className: "ff-btn ff-btn-danger ff-btn-sm", onClick: (e) => { e.stopPropagation(); onConfirm(); } }, "Wirklich?"),
            React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: (e) => { e.stopPropagation(); setConfirming(false); } },
                React.createElement(X, { size: 13 }))));
    }
    return (React.createElement("button", { className: "ff-btn ff-btn-icon", title: label, onClick: (e) => { e.stopPropagation(); setConfirming(true); }, style: { color: "var(--text-faint)" } },
        React.createElement(Trash2, { size: 15 })));
}
// Wiederverwendbarer Herz-Button für Favoriten (Übungen/Geräte/Pläne).
// "active" = ausgefülltes Herz in Neongrün, sonst nur der Umriss.

export function FavoriteButton({ active, onToggle, size = 15 }) {
    return (React.createElement("button", { className: "ff-btn ff-btn-icon", title: active ? "Favorit entfernen" : "Zu Favoriten hinzufügen", onClick: (e) => { e.stopPropagation(); onToggle(); }, style: { color: active ? "var(--accent)" : "var(--text-faint)" } },
        React.createElement(Heart, { size: size, fill: active ? "var(--accent)" : "none" })));
}
/* =========================================================================
   DASHBOARD
   ========================================================================= */
// Die drei Zeiträume, durch die man bei den wischbaren Kacheln
// (SwipeStatCard) durchblättern kann.

// Wischbare Kachel mit drei Zeit-Modi (Letztes Workout / Heute / Diese Woche).
// Unterstützt Touch-Wischen, Maus-Ziehen (für Desktop-Tests) UND explizite Pfeil-Buttons,
// damit die Funktion unabhängig vom Eingabegerät zuverlässig nutzbar ist.
// Eine Kachel, die sich per Wischen (Touch), Ziehen (Maus) oder über die
// kleinen Pfeil-Buttons zwischen drei Zeiträumen umschalten lässt
// (siehe PERIOD_MODES direkt darüber). Wird für "Workouts", "Trainingszeit"
// und "Energie" auf der Übersichtsseite verwendet.
export function SwipeStatCard({ label, icon: Icon, unit, computeValue, formatValue }) {
    const [modeIdx, setModeIdx] = useState(0);
    const dragX = useRef(null);
    const mode = PERIOD_MODES[modeIdx];
    const value = useMemo(() => computeValue(mode), [mode, computeValue]);
    const display = formatValue ? formatValue(value) : Math.round(value).toLocaleString("de-DE");
    const cycle = (dir) => setModeIdx((i) => (i + dir + PERIOD_MODES.length) % PERIOD_MODES.length);
    const handleDragStart = (x) => { dragX.current = x; };
    const handleDragEnd = (x) => {
        if (dragX.current == null)
            return;
        const dx = x - dragX.current;
        if (dx > 40)
            cycle(1);
        else if (dx < -40)
            cycle(-1);
        dragX.current = null;
    };
    return (React.createElement("div", { className: "ff-card", style: { touchAction: "pan-y", userSelect: "none" }, onTouchStart: (e) => handleDragStart(e.touches[0].clientX), onTouchEnd: (e) => handleDragEnd(e.changedTouches[0].clientX), onMouseDown: (e) => handleDragStart(e.clientX), onMouseUp: (e) => handleDragEnd(e.clientX) },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("p", { className: "ff-eyebrow", style: { margin: 0 } },
                label,
                " \u00B7 ",
                PERIOD_MODE_LABELS[mode]),
            React.createElement(Icon, { size: 16, color: "var(--text-faint)" })),
        React.createElement("p", { className: "ff-display", style: { fontSize: 34, marginTop: 10 } },
            display,
            unit && React.createElement("span", { style: { fontSize: 16, color: "var(--text-dim)", marginLeft: 4 } }, unit)),
        React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 } },
            React.createElement("button", { className: "ff-btn ff-btn-icon", style: { padding: 3 }, onClick: (e) => { e.stopPropagation(); cycle(-1); }, title: "Vorheriger Zeitraum" },
                React.createElement(ChevronRight, { size: 14, style: { transform: "rotate(180deg)" } })),
            React.createElement("p", { className: "ff-tag-note", style: { margin: 0 } }, "wischen oder Pfeile"),
            React.createElement("button", { className: "ff-btn ff-btn-icon", style: { padding: 3 }, onClick: (e) => { e.stopPropagation(); cycle(1); }, title: "N\u00E4chster Zeitraum" },
                React.createElement(ChevronRight, { size: 14 })))));
}
/* =========================================================================
   ÜBERSICHT-TAB (Dashboard) — Startseite mit Kacheln und Diagrammen
   =========================================================================
   Oben: wischbare Kacheln für Workouts/Trainingszeit/Energie (siehe
   SwipeStatCard) sowie feste Kacheln für Gewicht/Ziel und BMI.
   Darunter: Zeitraum-Filter (Woche/Monat/.../Gesamt) und die Diagramme
   "Energie über Zeit", "Gewicht über Zeit" und "Umfangsmaße über Zeit" —
   welche davon sichtbar sind, wird im Setup-Tab eingestellt
   (dashboardConfig.showWeight / showEnergy / showMeasurements).
   ========================================================================= */

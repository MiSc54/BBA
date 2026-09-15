/* =========================================================================
   Der Geräte-Tab inkl. Modal zum Hinzufügen eigener Geräte.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useEffect, useMemo } from "https://esm.sh/react@18.3.1";
import { Plus, Trash2, Check, X, Search, Heart } from "../data/icons.js";
import { EQUIPMENT, EQUIPMENT_CATEGORY_ORDER } from "../data/equipment.js";
import { uid } from "../utils/calculations.js";
import { GlitchTitle } from "./shared.js";

export function AddEquipmentModal({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState(EQUIPMENT_CATEGORY_ORDER[0]);
    const [nameError, setNameError] = useState(false);
    const handleSubmit = () => {
        if (!name.trim()) {
            setNameError(true);
            return;
        }
        onSave({ id: "custom-eq-" + uid(), name: name.trim(), category, custom: true });
    };
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, "Eigenes Ger\u00E4t anlegen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("label", { className: "ff-field-label" }, "Name des Ger\u00E4ts"),
            React.createElement("input", { className: "ff-input", style: nameError ? { borderColor: "var(--danger)" } : undefined, placeholder: "z.B. Beinpresse 45\u00B0", value: name, onChange: (e) => { setName(e.target.value); if (nameError)
                    setNameError(false); }, autoFocus: true }),
            nameError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 6 }, className: "ff-mono" }, "Bitte gib einen Namen ein."),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 18 } }, "Kategorie"),
            React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, EQUIPMENT_CATEGORY_ORDER.map((cat) => (React.createElement("button", { key: cat, className: `ff-tagbtn ${category === cat ? "selected" : ""}`, onClick: () => setCategory(cat) }, cat)))),
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26 } },
                React.createElement("button", { className: "ff-btn", onClick: onClose }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleSubmit },
                    React.createElement(Check, { size: 14 }),
                    " Speichern")))));
}
/* =========================================================================
   GERÄTE-TAB — eigene Geräte auswählen und verwalten
   =========================================================================
   Zeigt alle 75 vordefinierten Geräte (Konstante EQUIPMENT ganz oben in der
   Datei) gruppiert nach Kategorie, plus eigene, selbst angelegte Geräte.
   Mit Suche, Kategorie-Filter, Favoriten-Filter und "Eigenes Gerät"-Button.
   Der "Speichern"-Button übernimmt die aktuelle Auswahl als "meine Geräte".
   ========================================================================= */

export function EquipmentView({ equipment, customEquipment, onSave, onAddCustom, onDeleteCustom, favoriteEquipment, onToggleFavoriteEquipment }) {
    const [selected, setSelected] = useState(new Set(equipment));
    const [dirty, setDirty] = useState(false);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    useEffect(() => { setSelected(new Set(equipment)); setDirty(false); }, [equipment]);
    const allEquipment = useMemo(() => [...EQUIPMENT, ...customEquipment], [customEquipment]);
    const favoriteSet = useMemo(() => new Set(favoriteEquipment || []), [favoriteEquipment]);
    const toggle = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        setDirty(true);
    };
    const grouped = useMemo(() => {
        const map = {};
        allEquipment
            .filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()))
            .filter((e) => !categoryFilter || e.category === categoryFilter)
            .filter((e) => !onlyFavorites || favoriteSet.has(e.id))
            .forEach((e) => {
            if (!map[e.category])
                map[e.category] = [];
            map[e.category].push(e);
        });
        return map;
    }, [allEquipment, search, categoryFilter, onlyFavorites, favoriteSet]);
    const customCategories = useMemo(() => Object.keys(grouped).filter((c) => !EQUIPMENT_CATEGORY_ORDER.includes(c)), [grouped]);
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 } },
            React.createElement("div", null,
                React.createElement("p", { className: "ff-eyebrow" }, "Konfiguration"),
                React.createElement(GlitchTitle, { text: "Verf\u00FCgbare Ger\u00E4te", size: 34 }),
                React.createElement("p", { style: { color: "var(--text-dim)", marginTop: 10, maxWidth: 520 } }, "W\u00E4hle die Ger\u00E4te aus, die dir zur Verf\u00FCgung stehen. Basierend darauf zeigen wir dir passende \u00DCbungen und du kannst Trainingspl\u00E4ne direkt mit deinem Equipment erstellen.")),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" } },
                React.createElement("span", { className: "ff-mono", style: { fontSize: 12, color: "var(--text-dim)" } },
                    selected.size,
                    " von ",
                    allEquipment.length,
                    " ausgew\u00E4hlt"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", disabled: !dirty, onClick: () => { onSave([...selected]); setDirty(false); } },
                    React.createElement(Check, { size: 14 }),
                    " Speichern"))),
        React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap", alignItems: "center" } },
            React.createElement("div", { style: { position: "relative", flex: "1 1 220px" } },
                React.createElement(Search, { size: 15, style: { position: "absolute", left: 12, top: 13, color: "var(--text-faint)" } }),
                React.createElement("input", { className: "ff-input", style: { paddingLeft: 36 }, placeholder: "Ger\u00E4t suchen...", value: search, onChange: (e) => setSearch(e.target.value) })),
            React.createElement("button", { className: `ff-tagbtn ${onlyFavorites ? "selected" : ""}`, onClick: () => setOnlyFavorites((v) => !v) },
                React.createElement(Heart, { size: 12, style: { verticalAlign: "-1px", marginRight: 4 }, fill: onlyFavorites ? "currentColor" : "none" }),
                "Nur Favoriten"),
            React.createElement("button", { className: "ff-btn", onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Eigenes Ger\u00E4t")),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 } },
            React.createElement("button", { className: `ff-tagbtn ${!categoryFilter ? "selected" : ""}`, onClick: () => setCategoryFilter(null) }, "Alle Kategorien"),
            EQUIPMENT_CATEGORY_ORDER.map((c) => (React.createElement("button", { key: c, className: `ff-tagbtn ${categoryFilter === c ? "selected" : ""}`, onClick: () => setCategoryFilter(c) }, c)))),
        [...EQUIPMENT_CATEGORY_ORDER, ...customCategories].map((cat) => (grouped[cat] ? (React.createElement("div", { key: cat, style: { marginTop: 28 } },
            React.createElement("p", { className: "ff-eyebrow" }, cat),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 10 } }, grouped[cat].map((eq) => (React.createElement("div", { key: eq.id, className: `ff-equip-card ${selected.has(eq.id) ? "selected" : ""}`, onClick: () => toggle(eq.id) },
                selected.has(eq.id) && React.createElement("div", { className: "ff-equip-check" },
                    React.createElement(Check, { size: 12 })),
                React.createElement("button", { className: "ff-btn ff-btn-icon", style: { position: "absolute", top: 6, left: 6, padding: 5, color: favoriteSet.has(eq.id) ? "var(--accent)" : "var(--text-faint)" }, onClick: (e) => { e.stopPropagation(); onToggleFavoriteEquipment(eq.id); }, title: favoriteSet.has(eq.id) ? "Favorit entfernen" : "Zu Favoriten hinzufügen" },
                    React.createElement(Heart, { size: 13, fill: favoriteSet.has(eq.id) ? "var(--accent)" : "none" })),
                eq.custom && (React.createElement("button", { className: "ff-btn ff-btn-icon", style: { position: "absolute", bottom: 8, right: 8, padding: 5, color: "var(--text-faint)" }, onClick: (e) => { e.stopPropagation(); onDeleteCustom(eq.id); }, title: "Eigenes Ger\u00E4t l\u00F6schen" },
                    React.createElement(Trash2, { size: 12 }))),
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 15, paddingRight: eq.custom ? 20 : 0, paddingTop: 14 } }, eq.name),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 4 } }, eq.custom ? "Eigenes Gerät" : eq.category))))))) : null)),
        Object.keys(grouped).length === 0 && (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } }, "Kein Ger\u00E4t gefunden.")),
        showAdd && (React.createElement(AddEquipmentModal, { onClose: () => setShowAdd(false), onSave: (eq) => { onAddCustom(eq); setShowAdd(false); } }))));
}
/* =========================================================================
   EXERCISES VIEW
   ========================================================================= */
// Formular (Popup) zum Anlegen einer eigenen Übung: Name, benötigte
// Geräte, Muskelgruppen, Beschreibung/Ausführung/Fehler — wahlweise mit
// KI-Unterstützung über den Button "Alles mit KI generieren" (ruft die
// Anthropic-API auf; funktioniert nur innerhalb von Claude.ai, siehe
// den try/catch-Block in generateDescription).

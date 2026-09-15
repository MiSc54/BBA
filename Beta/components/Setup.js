/* =========================================================================
   Der Setup-Tab (Einstellungen, Profile, Backup, CSV-Export).
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Plus, Check, Settings, Users, Download, Upload, FileDown } from "../data/icons.js";
import { MEASUREMENT_FIELDS } from "../data/constants.js";
import { GlitchTitle, DevCredit, ConfirmDelete } from "./shared.js";
import { Dashboard } from "./Dashboard.js";
import { EquipmentView } from "./EquipmentView.js";
import { ExercisesView } from "./Exercises.js";

export function ProfileRow({ profile, isActive, onRename, onDelete, onSwitch, canDelete }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(profile.name);
    const commit = () => {
        if (name.trim())
            onRename(name.trim());
        setEditing(false);
    };
    return (React.createElement("div", { className: "ff-card", style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderColor: isActive ? "var(--accent)" : undefined } },
        editing ? (React.createElement("input", { className: "ff-input", style: { maxWidth: 220 }, value: name, autoFocus: true, onChange: (e) => setName(e.target.value), onBlur: commit, onKeyDown: (e) => { if (e.key === "Enter")
                commit(); } })) : (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
            isActive && React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 } }),
            React.createElement("p", { style: { margin: 0, fontWeight: 700 } }, profile.name))),
        React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
            !isActive && React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: onSwitch }, "Wechseln"),
            React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: () => setEditing(true), title: "Umbenennen" },
                React.createElement(Settings, { size: 14 })),
            canDelete && React.createElement(ConfirmDelete, { onConfirm: onDelete }))));
}
// SETUP-TAB: Standardwerte für neue Übungen, Körperprofil (Geburtsdatum/
// Größe/Zielgewicht), Übersicht-Einstellungen (welche Diagramme sichtbar
// sind), Profilverwaltung (anlegen/umbenennen/löschen/wechseln) und
// Backup-Export/Import. Das ist die längste Einstellungs-Ansicht der App.

export function SettingsView({ settings, onSaveSettings, profiles, activeProfileId, onCreateProfile, onRenameProfile, onDeleteProfile, onSwitchProfile, onExportBackup, onImportBackup, profileDetails, onSaveProfileDetails, dashboardConfig, onSaveDashboardConfig, onExportWorkoutsCSV, onExportBodyLogCSV, }) {
    const [form, setForm] = useState(settings);
    const [savedFlash, setSavedFlash] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [importError, setImportError] = useState("");
    const [importBusy, setImportBusy] = useState(false);
    const [detailsForm, setDetailsForm] = useState(profileDetails);
    const [detailsSavedFlash, setDetailsSavedFlash] = useState(false);
    useEffect(() => setForm(settings), [settings]);
    useEffect(() => setDetailsForm(profileDetails), [profileDetails]);
    const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    const setDetailsField = (field) => (e) => setDetailsForm((prev) => ({ ...prev, [field]: e.target.value }));
    const saveDefaults = () => {
        onSaveSettings({
            defaultSets: Number(form.defaultSets) || 1,
            defaultReps: Number(form.defaultReps) || 1,
            defaultWeight: Number(form.defaultWeight) || 0,
            defaultPause: Number(form.defaultPause) || 0,
        });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1800);
    };
    const saveDetails = () => {
        onSaveProfileDetails({
            birthDate: detailsForm.birthDate || "",
            heightCm: detailsForm.heightCm === "" ? "" : Number(detailsForm.heightCm),
            goalWeightKg: detailsForm.goalWeightKg === "" ? "" : Number(detailsForm.goalWeightKg),
        });
        setDetailsSavedFlash(true);
        setTimeout(() => setDetailsSavedFlash(false), 1800);
    };
    const toggleDashboardFlag = (field) => {
        onSaveDashboardConfig({ ...dashboardConfig, [field]: !dashboardConfig[field] });
    };
    const toggleMeasurementVisible = (id) => {
        const current = dashboardConfig.visibleMeasurements || [];
        const next = current.includes(id) ? current.filter((m) => m !== id) : [...current, id];
        onSaveDashboardConfig({ ...dashboardConfig, visibleMeasurements: next });
    };
    const handleCreateProfile = () => {
        if (!newProfileName.trim())
            return;
        onCreateProfile(newProfileName.trim());
        setNewProfileName("");
    };
    const handleExport = async () => {
        const backup = await onExportBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const stamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `bernds-body-app-backup-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };
    const handleImportFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setImportError("");
        setImportBusy(true);
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            if (!parsed || !parsed.global || !Array.isArray(parsed.profiles)) {
                throw new Error("invalid");
            }
            await onImportBackup(parsed);
        }
        catch (err) {
            setImportError("Diese Datei sieht nicht wie ein gültiges Backup aus.");
        }
        finally {
            setImportBusy(false);
            e.target.value = "";
        }
    };
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Konfiguration"),
        React.createElement(GlitchTitle, { text: "Setup", size: 34 }),
        React.createElement("div", { style: { marginTop: 28 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Standardwerte f\u00FCr neue \u00DCbungen im Plan"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 520 } }, "Diese Werte werden automatisch vorausgef\u00FCllt, sobald du eine \u00DCbung zu einem Trainingsplan hinzuf\u00FCgst."),
            React.createElement("div", { className: "ff-card" },
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 } },
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "S\u00E4tze"),
                        React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: form.defaultSets, onChange: setField("defaultSets") })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "Wdh."),
                        React.createElement("input", { className: "ff-numinput", type: "number", min: "1", value: form.defaultReps, onChange: setField("defaultReps") })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "Gewicht (kg)"),
                        React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: form.defaultWeight, onChange: setField("defaultWeight") })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "Pause (s)"),
                        React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: form.defaultPause, onChange: setField("defaultPause") }))),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 16 } },
                    React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: saveDefaults },
                        React.createElement(Check, { size: 14 }),
                        " Standardwerte speichern"),
                    savedFlash && React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)" } }, "\u2713 Gespeichert")))),
        React.createElement("div", { style: { marginTop: 32 } },
            React.createElement("p", { className: "ff-eyebrow" }, "K\u00F6rperprofil"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 520 } }, "Grundlage f\u00FCr Alter, BMI und die K\u00F6rperverlaufs-Grafiken in der \u00DCbersicht. Gewicht und Umfangsma\u00DFe tr\u00E4gst du im Tagebuch unter \"K\u00F6rperverlauf\" ein."),
            React.createElement("div", { className: "ff-card" },
                React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 } },
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "Geburtsdatum"),
                        React.createElement("input", { type: "date", className: "ff-input", max: new Date().toISOString().slice(0, 10), value: detailsForm?.birthDate || "", onChange: setDetailsField("birthDate") })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "K\u00F6rpergr\u00F6\u00DFe (cm)"),
                        React.createElement("input", { type: "number", className: "ff-numinput", value: detailsForm?.heightCm ?? "", onChange: setDetailsField("heightCm") })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "ff-field-label" }, "Zielgewicht (kg)"),
                        React.createElement("input", { type: "number", step: "0.1", className: "ff-numinput", value: detailsForm?.goalWeightKg ?? "", onChange: setDetailsField("goalWeightKg") }))),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 16 } },
                    React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: saveDetails },
                        React.createElement(Check, { size: 14 }),
                        " K\u00F6rperprofil speichern"),
                    detailsSavedFlash && React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)" } }, "\u2713 Gespeichert")))),
        React.createElement("div", { style: { marginTop: 32 } },
            React.createElement("p", { className: "ff-eyebrow" }, "\u00DCbersicht anpassen"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 520 } }, "Steuert, welche K\u00F6rperverlaufs-Grafiken auf der \u00DCbersichtsseite angezeigt werden."),
            React.createElement("div", { className: "ff-card" },
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
                    React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
                        React.createElement("div", { className: `ff-checkbox ${dashboardConfig?.showWeight ? "checked" : ""}`, onClick: () => toggleDashboardFlag("showWeight") }, dashboardConfig?.showWeight && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { style: { fontSize: 14 } }, "Gewichtsverlauf anzeigen")),
                    React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
                        React.createElement("div", { className: `ff-checkbox ${(dashboardConfig?.showEnergy ?? true) ? "checked" : ""}`, onClick: () => toggleDashboardFlag("showEnergy") }, (dashboardConfig?.showEnergy ?? true) && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { style: { fontSize: 14 } }, "Energie-Verlauf anzeigen")),
                    React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
                        React.createElement("div", { className: `ff-checkbox ${dashboardConfig?.showMeasurements ? "checked" : ""}`, onClick: () => toggleDashboardFlag("showMeasurements") }, dashboardConfig?.showMeasurements && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { style: { fontSize: 14 } }, "Umfangsma\u00DFe anzeigen")),
                    React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
                        React.createElement("div", { className: `ff-checkbox ${(dashboardConfig?.showMuscleBalance ?? true) ? "checked" : ""}`, onClick: () => toggleDashboardFlag("showMuscleBalance") }, (dashboardConfig?.showMuscleBalance ?? true) && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { style: { fontSize: 14 } }, "Muskelgruppen-Balance anzeigen"))),
                dashboardConfig?.showMeasurements && (React.createElement("div", { style: { marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" } },
                    React.createElement("label", { className: "ff-field-label" }, "Welche Umfangsma\u00DFe im Chart"),
                    React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, MEASUREMENT_FIELDS.map((m) => (React.createElement("button", { key: m.id, className: `ff-tagbtn ${(dashboardConfig?.visibleMeasurements || []).includes(m.id) ? "selected" : ""}`, onClick: () => toggleMeasurementVisible(m.id) }, m.label)))))))),
        React.createElement("div", { style: { marginTop: 32 } },
            React.createElement("p", { className: "ff-eyebrow" },
                React.createElement(Users, { size: 11, style: { verticalAlign: "-2px", marginRight: 4 } }),
                "Profile"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 520 } }, "Ger\u00E4te und \u00DCbungen gelten f\u00FCr alle Profile gemeinsam. Trainingspl\u00E4ne, Tagebuch und Standardwerte sind pro Profil getrennt."),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, profiles.map((p) => (React.createElement(ProfileRow, { key: p.id, profile: p, isActive: p.id === activeProfileId, canDelete: profiles.length > 1, onRename: (name) => onRenameProfile(p.id, name), onDelete: () => onDeleteProfile(p.id), onSwitch: () => onSwitchProfile(p.id) })))),
            React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } },
                React.createElement("input", { className: "ff-input", placeholder: "Name f\u00FCr neues Profil", value: newProfileName, onChange: (e) => setNewProfileName(e.target.value) }),
                React.createElement("button", { className: "ff-btn", onClick: handleCreateProfile },
                    React.createElement(Plus, { size: 14 }),
                    " Anlegen"))),
        React.createElement("div", { style: { marginTop: 32 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Backup"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 560 } }, "Sichert Ger\u00E4te, \u00DCbungen, alle Profile mit Trainingspl\u00E4nen und Tagebuch in einer Datei. Empfehlenswert vor jedem App-Update auf GitHub, damit nichts verloren geht."),
            React.createElement("div", { className: "ff-card" },
                React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
                    React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleExport },
                        React.createElement(Download, { size: 14 }),
                        " Backup exportieren"),
                    React.createElement("label", { className: "ff-btn", style: { cursor: "pointer" } },
                        React.createElement(Upload, { size: 14 }),
                        " Backup importieren",
                        React.createElement("input", { type: "file", accept: "application/json", style: { display: "none" }, onChange: handleImportFile, disabled: importBusy }))),
                importBusy && React.createElement("p", { className: "ff-mono", style: { fontSize: 11, color: "var(--text-dim)", marginTop: 10 } }, "Importiere..."),
                importError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 10 } }, importError),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 12 } }, "Achtung: Ein Import \u00FCberschreibt alle aktuell auf diesem Ger\u00E4t gespeicherten Daten."))),
        React.createElement("div", { style: { marginTop: 32 } },
            React.createElement("p", { className: "ff-eyebrow" }, "CSV-Export"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: 14, maxWidth: 560 } }, "Exportiert dein Tagebuch bzw. deinen K\u00F6rperverlauf als CSV-Datei (z.B. zur Weiterverarbeitung in Excel oder Google Sheets). Anders als das Backup l\u00E4sst sich eine CSV-Datei nicht wieder importieren."),
            React.createElement("div", { className: "ff-card", style: { display: "flex", gap: 10, flexWrap: "wrap" } },
                React.createElement("button", { className: "ff-btn", onClick: onExportWorkoutsCSV },
                    React.createElement(FileDown, { size: 14 }),
                    " Tagebuch als CSV"),
                React.createElement("button", { className: "ff-btn", onClick: onExportBodyLogCSV },
                    React.createElement(FileDown, { size: 14 }),
                    " K\u00F6rperverlauf als CSV"))),
        React.createElement(DevCredit, null)));
}
/* =========================================================================
   APP ROOT
   ========================================================================= */
/* =========================================================================
   APP-ROOT — die zentrale Steuerzentrale der App
   =========================================================================
   Das ist die "Hauptkomponente". Alles beginnt hier:
   - Beim Start werden alle gespeicherten Daten geladen (Geräte, Übungen,
     Profile, Pläne, Tagebuch, ...) — siehe den ersten useEffect-Block.
   - Hier wird gemerkt, welcher Reiter (Tab) gerade sichtbar ist.
   - Hier liegen alle "Handler"-Funktionen (handleXYZ), die etwas ändern
     und speichern — z.B. handleCreatePlan, handleDeleteLog usw.
   - Ganz unten im "return (...)" wird je nach aktivem Reiter die passende
     Ansicht (Dashboard, EquipmentView, ExercisesView, ...) angezeigt und
     bekommt die benötigten Daten + Handler-Funktionen als "Props" (die
     Angaben in geschweiften Klammern wie plans={plans}) übergeben.
   Wenn du eine neue Funktion einbauen willst, die Daten dauerhaft
   speichert, ist DAS hier meist der richtige Ort dafür.
   ========================================================================= */

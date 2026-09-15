/* =========================================================================
   BERNDS BODY APP — Einstiegspunkt
   =========================================================================
   Bindet alle Module zusammen, startet React und rendert die
   Hauptkomponente "App". Die eigentliche Feature-Logik liegt in den
   Unterordnern data/, storage/, utils/, styles/ und components/
   (siehe PROJECT_MAP.md für die genaue Zuordnung).
   ========================================================================= */

import React, { useState, useEffect, useMemo, useCallback } from "https://esm.sh/react@18.3.1";
import { Users, Sun, Moon } from "./data/icons.js";
import { LOGO_DATA_URL, STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_PROFILE_DETAILS, DEFAULT_DASHBOARD_CONFIG, NAV_ITEMS } from "./data/constants.js";
import { EQUIPMENT } from "./data/equipment.js";
import { EXERCISE_LIBRARY } from "./data/exercises.js";
import { loadKey, saveKey, collectBackup, restoreBackup } from "./storage/storage.js";
import { buildWorkoutsCSV, buildBodyLogCSV, downloadTextFile } from "./storage/export.js";
import { parseLocalDateInput } from "./utils/dates.js";
import { uid, newProfile, recalcBodyweightExercisesInPlans, detectPRs } from "./utils/calculations.js";
import { GlobalStyles } from "./styles/GlobalStyles.js";
import { ScrollToTopButton } from "./components/shared.js";
import { Dashboard } from "./components/Dashboard.js";
import { EquipmentView } from "./components/EquipmentView.js";
import { ExercisesView } from "./components/Exercises.js";
import { PlansView } from "./components/PlanEditor.js";
import { ActiveWorkoutView } from "./components/ActiveWorkout.js";
import { DiaryView } from "./components/Journal.js";
import { SettingsView } from "./components/Setup.js";

export default function App() {
    const [tab, setTab] = useState("uebersicht");
    const [ready, setReady] = useState(false);
    const [equipment, setEquipment] = useState([]);
    const [customEquipment, setCustomEquipment] = useState([]);
    const [customExercises, setCustomExercises] = useState([]);
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [favoriteEquipment, setFavoriteEquipment] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [plans, setPlans] = useState([]);
    const [logs, setLogs] = useState([]);
    const [profileDetails, setProfileDetails] = useState(DEFAULT_PROFILE_DETAILS);
    const [bodyLog, setBodyLog] = useState([]);
    const [dashboardConfig, setDashboardConfig] = useState(DEFAULT_DASHBOARD_CONFIG);
    const [favoritePlans, setFavoritePlans] = useState([]);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [theme, setTheme] = useState("dark"); // "dark" | "light"
    // Initiales Laden: globale Daten + Profile, inkl. einmaliger Migration alter,
    // nicht profilgebundener Trainingspläne/Tagebücher in ein Standardprofil.
    useEffect(() => {
        (async () => {
            const [eq, ceq, ce, favEx, favEq, savedTheme, existingProfiles] = await Promise.all([
                loadKey(STORAGE_KEYS.equipment, []),
                loadKey(STORAGE_KEYS.customEquipment, []),
                loadKey(STORAGE_KEYS.customExercises, []),
                loadKey(STORAGE_KEYS.favoriteExercises, []),
                loadKey(STORAGE_KEYS.favoriteEquipment, []),
                loadKey(STORAGE_KEYS.theme, "dark"),
                loadKey(STORAGE_KEYS.profiles, null),
            ]);
            setEquipment(eq);
            setCustomEquipment(ceq);
            setCustomExercises(ce);
            setFavoriteExercises(favEx);
            setFavoriteEquipment(favEq);
            setTheme(savedTheme || "dark");
            let profileList = existingProfiles;
            if (!profileList) {
                // Erster Start nach dem Update: Profil anlegen und alte Daten übernehmen, falls vorhanden.
                const legacyPlans = await loadKey(STORAGE_KEYS.legacyPlans, []);
                const legacyLogs = await loadKey(STORAGE_KEYS.legacyLogs, []);
                const defaultProfile = newProfile("Standard");
                profileList = [defaultProfile];
                await saveKey(STORAGE_KEYS.profiles, profileList);
                await saveKey(STORAGE_KEYS.plans(defaultProfile.id), legacyPlans);
                await saveKey(STORAGE_KEYS.logs(defaultProfile.id), legacyLogs);
                await saveKey(STORAGE_KEYS.settings(defaultProfile.id), DEFAULT_SETTINGS);
                await saveKey(STORAGE_KEYS.profileDetails(defaultProfile.id), DEFAULT_PROFILE_DETAILS);
                await saveKey(STORAGE_KEYS.bodyLog(defaultProfile.id), []);
                await saveKey(STORAGE_KEYS.dashboardConfig(defaultProfile.id), DEFAULT_DASHBOARD_CONFIG);
                await saveKey(STORAGE_KEYS.favoritePlans(defaultProfile.id), []);
                // Für ein frisch angelegtes Profil gibt es naturgemäß noch kein
                // laufendes Training - trotzdem legen wir den Key mit "null" an,
                // damit loadKey() später sauber funktioniert.
                await saveKey(STORAGE_KEYS.activeWorkout(defaultProfile.id), null);
            }
            let activeId = await loadKey(STORAGE_KEYS.activeProfile, null);
            if (!activeId || !profileList.some((p) => p.id === activeId)) {
                activeId = profileList[0].id;
                await saveKey(STORAGE_KEYS.activeProfile, activeId);
            }
            const [pl, lg, st, pd, bl, dc, fp, aw] = await Promise.all([
                loadKey(STORAGE_KEYS.plans(activeId), []),
                loadKey(STORAGE_KEYS.logs(activeId), []),
                loadKey(STORAGE_KEYS.settings(activeId), DEFAULT_SETTINGS),
                loadKey(STORAGE_KEYS.profileDetails(activeId), DEFAULT_PROFILE_DETAILS),
                loadKey(STORAGE_KEYS.bodyLog(activeId), []),
                loadKey(STORAGE_KEYS.dashboardConfig(activeId), DEFAULT_DASHBOARD_CONFIG),
                loadKey(STORAGE_KEYS.favoritePlans(activeId), []),
                loadKey(STORAGE_KEYS.activeWorkout(activeId), null),
            ]);
            setProfiles(profileList);
            setActiveProfileId(activeId);
            setPlans(pl);
            setLogs(lg);
            setSettings(st);
            setProfileDetails(pd);
            setBodyLog(bl);
            setDashboardConfig(dc);
            setFavoritePlans(fp);
            // Falls beim letzten Mal ein Training nicht abgeschlossen wurde, ist es
            // hier immer noch da - der Nutzer kann es über das Tagebuch fortsetzen.
            setActiveWorkout(aw);
            setReady(true);
        })();
    }, []);
    const allExercises = useMemo(() => [...EXERCISE_LIBRARY, ...customExercises], [customExercises]);
    const allEquipment = useMemo(() => [...EQUIPMENT, ...customEquipment], [customEquipment]);
    // Aktuelles Körpergewicht = jüngster Körperverlaufs-Eintrag mit Gewichtsangabe.
    const currentWeightKg = useMemo(() => {
        const withWeight = [...bodyLog].filter((e) => e.weightKg != null).sort((a, b) => new Date(b.date) - new Date(a.date));
        return withWeight[0]?.weightKg ?? null;
    }, [bodyLog]);
    const persistEquipment = useCallback((next) => { setEquipment(next); saveKey(STORAGE_KEYS.equipment, next); }, []);
    const persistCustomEquipment = useCallback((next) => { setCustomEquipment(next); saveKey(STORAGE_KEYS.customEquipment, next); }, []);
    const persistCustomExercises = useCallback((next) => { setCustomExercises(next); saveKey(STORAGE_KEYS.customExercises, next); }, []);
    const persistPlans = useCallback((next) => { setPlans(next); saveKey(STORAGE_KEYS.plans(activeProfileId), next); }, [activeProfileId]);
    const persistLogs = useCallback((next) => { setLogs(next); saveKey(STORAGE_KEYS.logs(activeProfileId), next); }, [activeProfileId]);
    const persistSettings = useCallback((next) => { setSettings(next); saveKey(STORAGE_KEYS.settings(activeProfileId), next); }, [activeProfileId]);
    const persistProfileDetails = useCallback((next) => { setProfileDetails(next); saveKey(STORAGE_KEYS.profileDetails(activeProfileId), next); }, [activeProfileId]);
    const persistDashboardConfig = useCallback((next) => { setDashboardConfig(next); saveKey(STORAGE_KEYS.dashboardConfig(activeProfileId), next); }, [activeProfileId]);
    const persistFavoriteExercises = useCallback((next) => { setFavoriteExercises(next); saveKey(STORAGE_KEYS.favoriteExercises, next); }, []);
    const persistFavoriteEquipment = useCallback((next) => { setFavoriteEquipment(next); saveKey(STORAGE_KEYS.favoriteEquipment, next); }, []);
    const persistFavoritePlans = useCallback((next) => { setFavoritePlans(next); saveKey(STORAGE_KEYS.favoritePlans(activeProfileId), next); }, [activeProfileId]);
    const handleToggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        saveKey(STORAGE_KEYS.theme, next);
    };
    const toggleInArray = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
    const handleToggleFavoriteExercise = (id) => persistFavoriteExercises(toggleInArray(favoriteExercises, id));
    const handleToggleFavoriteEquipment = (id) => persistFavoriteEquipment(toggleInArray(favoriteEquipment, id));
    const handleToggleFavoritePlan = (id) => persistFavoritePlans(toggleInArray(favoritePlans, id));
    // Körperverlauf speichern + betroffene, körpergewichtsbasierte Übungen in allen (noch nicht
    // gestarteten) Trainingsplänen anhand des jeweils jüngsten Gewichtseintrags neu berechnen.
    const persistBodyLog = useCallback((nextBodyLog) => {
        setBodyLog(nextBodyLog);
        saveKey(STORAGE_KEYS.bodyLog(activeProfileId), nextBodyLog);
        const withWeight = [...nextBodyLog].filter((e) => e.weightKg != null).sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestWeight = withWeight[0]?.weightKg ?? null;
        if (latestWeight) {
            const nextPlans = recalcBodyweightExercisesInPlans(plans, allExercises, latestWeight);
            persistPlans(nextPlans);
        }
    }, [activeProfileId, plans, allExercises, persistPlans]);
    const handleAddCustomExercise = (ex) => persistCustomExercises([...customExercises, ex]);
    const handleAddCustomEquipment = (eq) => persistCustomEquipment([...customEquipment, eq]);
    const handleDeleteCustomEquipment = (id) => {
        persistCustomEquipment(customEquipment.filter((e) => e.id !== id));
        persistEquipment(equipment.filter((e) => e !== id));
    };
    const handleCreatePlan = (plan) => persistPlans([...plans, plan]);
    const handleUpdatePlan = (plan) => persistPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
    const handleDeletePlan = (id) => persistPlans(plans.filter((p) => p.id !== id));
    const handleClonePlan = (plan) => persistPlans([...plans, { ...plan, id: uid(), name: `${plan.name}-Clone` }]);
    const handleAddBodyEntry = (entry) => persistBodyLog([...bodyLog, entry]);
    const handleUpdateBodyEntry = (entry) => persistBodyLog(bodyLog.map((e) => (e.id === entry.id ? entry : e)));
    const handleDeleteBodyEntry = (id) => persistBodyLog(bodyLog.filter((e) => e.id !== id));
    // Speichert den aktuellen Stand des laufenden Trainings dauerhaft (oder
    // löscht ihn, wenn "next" null ist - z.B. nach Abschluss/Abbruch).
    const persistActiveWorkout = useCallback((next) => {
        setActiveWorkout(next);
        saveKey(STORAGE_KEYS.activeWorkout(activeProfileId), next);
    }, [activeProfileId]);
    const handleStartWorkout = (plan) => {
        // Es kann immer nur EIN Training gleichzeitig laufen (pro Profil) - der
        // "Starten"-Button ist in PlansView zwar schon deaktiviert, falls schon
        // eins läuft, aber wir sichern das hier nochmal zusätzlich ab.
        if (activeWorkout)
            return;
        const exercises = plan.exercises.map((row) => {
            const meta = allExercises.find((e) => e.id === row.exerciseId);
            const trackingType = meta?.trackingType || "strength";
            const setsCount = Math.max(1, Number(row.sets) || 1);
            const makeSet = () => {
                if (trackingType === "distance")
                    return { distanceKm: row.distanceKm ?? 0, done: false };
                if (trackingType === "duration")
                    return { durationSec: row.durationSec ?? 0, done: false };
                return { reps: row.reps, weight: row.weight, done: false };
            };
            return {
                exerciseId: row.exerciseId,
                exerciseName: meta?.name || "Übung",
                trackingType,
                pause: Number(row.pause) || 60,
                sets: Array.from({ length: setsCount }, makeSet),
            };
        });
        persistActiveWorkout({
            planId: plan.id,
            planName: plan.name,
            exercises,
            note: "",
            logDate: new Date().toISOString().slice(0, 10),
            startedAt: Date.now(),
        });
        // Direkt zum laufenden Training springen, damit man sofort loslegen kann.
        setTab("training");
    };
    // Wird von ActiveWorkoutView bei JEDER Änderung aufgerufen (Satz abgehakt,
    // Wiederholungen/Gewicht getippt, Notiz geschrieben, Datum geändert) und
    // schreibt den neuen Stand sofort in den dauerhaften Speicher. Genau DAS
    // ist die geforderte Zwischenspeicherung "nach jedem Satz".
    const handleUpdateActiveWorkout = (nextWorkout) => persistActiveWorkout(nextWorkout);
    // Reiter wechseln, um das laufende Training weiterzuführen (Button im
    // Tagebuch-Banner oder in der Navigation oben).
    const handleResumeWorkout = () => setTab("training");
    // Laufendes Training komplett verwerfen (nach Sicherheitsabfrage in der
    // Oberfläche) - löscht den Zwischenspeicher, OHNE einen Tagebuch-Eintrag
    // anzulegen. Das Training taucht dann nirgends in den Diagrammen auf.
    const handleCancelWorkout = () => {
        persistActiveWorkout(null);
        setTab("tagebuch");
    };
    // logDate erlaubt das rückwirkende Anlegen eines Trainings mit einem frei wählbaren Datum;
    // die Trainingsdauer wird trotzdem aus der tatsächlich verstrichenen Zeit berechnet.
    const handleFinishWorkout = (exercises, note, logDate) => {
        const durationMin = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
        const chosenDate = logDate ? parseLocalDateInput(logDate) : new Date();
        // Vergleich mit allen bisherigen Trainings (vor dem Hinzufügen) - so
        // wird erkannt, ob gerade eine neue Bestleistung erzielt wurde.
        const prs = detectPRs(exercises, logs, allExercises);
        const log = {
            id: uid(),
            planId: activeWorkout.planId,
            planName: activeWorkout.planName,
            date: chosenDate.toISOString(),
            durationMin,
            note: note.trim(),
            exercises,
            prs,
        };
        // Erst JETZT, beim Abschließen, wandert das Training endgültig ins
        // Tagebuch (logs) und taucht damit auch erstmals in den Diagrammen auf.
        persistLogs([...logs, log]);
        // Zwischenspeicher des laufenden Trainings wieder leeren.
        persistActiveWorkout(null);
        setTab("tagebuch");
    };
    const handleDeleteLog = (id) => persistLogs(logs.filter((l) => l.id !== id));
    const handleEditLogDate = (id, newDateISO) => persistLogs(logs.map((l) => (l.id === id ? { ...l, date: newDateISO } : l)));
    // --- Profile ---
    const switchProfile = async (id) => {
        if (id === activeProfileId)
            return;
        setReady(false);
        const [pl, lg, st, pd, bl, dc, fp, aw] = await Promise.all([
            loadKey(STORAGE_KEYS.plans(id), []),
            loadKey(STORAGE_KEYS.logs(id), []),
            loadKey(STORAGE_KEYS.settings(id), DEFAULT_SETTINGS),
            loadKey(STORAGE_KEYS.profileDetails(id), DEFAULT_PROFILE_DETAILS),
            loadKey(STORAGE_KEYS.bodyLog(id), []),
            loadKey(STORAGE_KEYS.dashboardConfig(id), DEFAULT_DASHBOARD_CONFIG),
            loadKey(STORAGE_KEYS.favoritePlans(id), []),
            loadKey(STORAGE_KEYS.activeWorkout(id), null),
        ]);
        setActiveProfileId(id);
        setPlans(pl);
        setLogs(lg);
        setSettings(st);
        setProfileDetails(pd);
        setBodyLog(bl);
        setDashboardConfig(dc);
        setFavoritePlans(fp);
        // Jedes Profil hat sein eigenes, unabhängiges laufendes Training (falls
        // vorhanden) - beim Umschalten wird also das des NEUEN Profils geladen.
        setActiveWorkout(aw);
        await saveKey(STORAGE_KEYS.activeProfile, id);
        setTab("uebersicht");
        setReady(true);
    };
    const handleCreateProfile = async (name) => {
        const p = newProfile(name);
        const nextProfiles = [...profiles, p];
        setProfiles(nextProfiles);
        await saveKey(STORAGE_KEYS.profiles, nextProfiles);
        await saveKey(STORAGE_KEYS.plans(p.id), []);
        await saveKey(STORAGE_KEYS.logs(p.id), []);
        await saveKey(STORAGE_KEYS.settings(p.id), DEFAULT_SETTINGS);
        await saveKey(STORAGE_KEYS.profileDetails(p.id), DEFAULT_PROFILE_DETAILS);
        await saveKey(STORAGE_KEYS.bodyLog(p.id), []);
        await saveKey(STORAGE_KEYS.dashboardConfig(p.id), DEFAULT_DASHBOARD_CONFIG);
        await saveKey(STORAGE_KEYS.favoritePlans(p.id), []);
        await saveKey(STORAGE_KEYS.activeWorkout(p.id), null);
        switchProfile(p.id);
    };
    const handleRenameProfile = (id, name) => {
        const next = profiles.map((p) => (p.id === id ? { ...p, name } : p));
        setProfiles(next);
        saveKey(STORAGE_KEYS.profiles, next);
    };
    const handleDeleteProfile = async (id) => {
        if (profiles.length <= 1)
            return;
        const next = profiles.filter((p) => p.id !== id);
        setProfiles(next);
        await saveKey(STORAGE_KEYS.profiles, next);
        if (id === activeProfileId) {
            switchProfile(next[0].id);
        }
    };
    // --- Backup ---
    const handleExportBackup = () => collectBackup(profiles);
    const handleImportBackup = async (backup) => {
        await restoreBackup(backup);
        // Nach dem Import komplett neu laden, damit alle Profile/States konsistent sind.
        window.location.reload();
    };
    if (!ready) {
        return (React.createElement("div", { className: `ff-root ${theme === "light" ? "theme-light" : ""}`, style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" } },
            React.createElement(GlobalStyles, null),
            React.createElement("p", { className: "ff-mono", style: { color: "var(--text-dim)" } }, "Lade Bernds Body App...")));
    }
    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    return (React.createElement("div", { className: `ff-root ${theme === "light" ? "theme-light" : ""}` },
        React.createElement(GlobalStyles, null),
        React.createElement("style", null, `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`),
        React.createElement("div", { className: "ff-nav" },
            React.createElement("div", { className: "ff-logo" },
                React.createElement("img", { src: LOGO_DATA_URL, alt: "Logo", className: "ff-logo-img" }),
                React.createElement("span", { className: "ff-logo-word" },
                    "BERNDS ",
                    React.createElement("span", { className: "hi" }, "BODY"),
                    " APP")),
            React.createElement("div", { className: "ff-tabs" },
                NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (React.createElement("button", { key: item.id, className: `ff-tab ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id) },
                        React.createElement(Icon, { size: 14 }),
                        " ",
                        item.label));
                }),
                activeWorkout && (React.createElement("button", { className: `ff-tab active`, style: { color: "var(--accent)", borderColor: "var(--accent)" }, onClick: () => setTab("training") }, "\u25CF Training"))),
            profiles.length > 0 && (React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 5 } },
                React.createElement(Users, { size: 12 }),
                " ",
                activeProfile?.name)),
            React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: handleToggleTheme, title: theme === "dark" ? "Helles Design" : "Dunkles Design", style: { color: "var(--text-dim)" } }, theme === "dark" ? React.createElement(Sun, { size: 16 }) : React.createElement(Moon, { size: 16 }))),
        React.createElement("div", { className: "ff-main" },
            React.createElement(ScrollToTopButton, null),
            tab === "training" && activeWorkout ? (React.createElement(ActiveWorkoutView, { workout: activeWorkout, allExercises: allExercises, onUpdate: handleUpdateActiveWorkout, onFinish: handleFinishWorkout, onCancel: handleCancelWorkout })) : (React.createElement(React.Fragment, null,
                tab === "uebersicht" && (React.createElement(Dashboard, { logs: logs, plans: plans, allExercises: allExercises, onGoToPlans: () => setTab("plaene"), bodyLog: bodyLog, profileDetails: profileDetails, dashboardConfig: dashboardConfig, onSetRange: (range) => persistDashboardConfig({ ...dashboardConfig, range }), currentWeightKg: currentWeightKg })),
                tab === "geraete" && (React.createElement(EquipmentView, { equipment: equipment, customEquipment: customEquipment, onSave: persistEquipment, onAddCustom: handleAddCustomEquipment, onDeleteCustom: handleDeleteCustomEquipment, favoriteEquipment: favoriteEquipment, onToggleFavoriteEquipment: handleToggleFavoriteEquipment })),
                tab === "uebungen" && (React.createElement(ExercisesView, { allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, logs: logs, onAddCustom: handleAddCustomExercise, favoriteExercises: favoriteExercises, onToggleFavoriteExercise: handleToggleFavoriteExercise, favoriteEquipment: favoriteEquipment })),
                tab === "plaene" && (React.createElement(PlansView, { plans: plans, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, settings: settings, currentWeightKg: currentWeightKg, favoriteExercises: favoriteExercises, favoritePlans: favoritePlans, onToggleFavoritePlan: handleToggleFavoritePlan, onCreate: handleCreatePlan, onUpdate: handleUpdatePlan, onDelete: handleDeletePlan, onClone: handleClonePlan, onStart: handleStartWorkout, hasActiveWorkout: !!activeWorkout })),
                tab === "tagebuch" && (React.createElement(DiaryView, { logs: logs, onDelete: handleDeleteLog, onEditDate: handleEditLogDate, onGoToPlans: () => setTab("plaene"), bodyLog: bodyLog, heightCm: profileDetails?.heightCm, onAddBodyEntry: handleAddBodyEntry, onUpdateBodyEntry: handleUpdateBodyEntry, onDeleteBodyEntry: handleDeleteBodyEntry, activeWorkout: activeWorkout, onResumeWorkout: handleResumeWorkout, onCancelWorkout: handleCancelWorkout })),
                tab === "setup" && (React.createElement(SettingsView, { settings: settings, onSaveSettings: persistSettings, profiles: profiles, activeProfileId: activeProfileId, onCreateProfile: handleCreateProfile, onRenameProfile: handleRenameProfile, onDeleteProfile: handleDeleteProfile, onSwitchProfile: switchProfile, onExportBackup: handleExportBackup, onImportBackup: handleImportBackup, profileDetails: profileDetails, onSaveProfileDetails: persistProfileDetails, dashboardConfig: dashboardConfig, onSaveDashboardConfig: persistDashboardConfig, onExportWorkoutsCSV: () => downloadTextFile(`bernds-body-app-tagebuch-${new Date().toISOString().slice(0, 10)}.csv`, buildWorkoutsCSV(logs)), onExportBodyLogCSV: () => downloadTextFile(`bernds-body-app-koerperverlauf-${new Date().toISOString().slice(0, 10)}.csv`, buildBodyLogCSV(bodyLog, profileDetails?.heightCm)) })))))));
}
/* =========================================================================
   STANDALONE MOUNT (nicht Teil des Claude.ai-Artifacts)
   ========================================================================= */

/* =========================================================================
   START DER APP
   ========================================================================= */
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(React.createElement(App, null));

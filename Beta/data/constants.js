/* =========================================================================
   Feste Grundeinstellungen, Speicher-Schlüssel und Auswahllisten der App.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import { LayoutDashboard, Wrench, Dumbbell, ClipboardList, BookOpen, Settings } from "./icons.js";

export const LOGO_DATA_URL = "data:image/png;base64,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";

export const APP_VERSION = "1.3.0";

export const STORAGE_KEYS = {
    equipment: "ff_equipment",
    customEquipment: "ff_custom_equipment",
    customExercises: "ff_custom_exercises",
    favoriteExercises: "ff_favorite_exercises",
    favoriteEquipment: "ff_favorite_equipment",
    // Hell/Dunkel ist eine reine Geräte-Einstellung (nicht profilgebunden).
    theme: "ff_theme",
    profiles: "ff_profiles",
    activeProfile: "ff_active_profile",
    plans: (profileId) => `ff_plans_${profileId}`,
    logs: (profileId) => `ff_logs_${profileId}`,
    settings: (profileId) => `ff_settings_${profileId}`,
    profileDetails: (profileId) => `ff_profile_details_${profileId}`,
    bodyLog: (profileId) => `ff_bodylog_${profileId}`,
    dashboardConfig: (profileId) => `ff_dashboard_config_${profileId}`,
    favoritePlans: (profileId) => `ff_favorite_plans_${profileId}`,
    // Das aktuell laufende, noch nicht abgeschlossene Training (falls vorhanden).
    // Wird nach JEDEM abgehakten Satz aktualisiert, damit man den Reiter
    // wechseln (oder die App sogar schließen) kann, ohne den Fortschritt zu
    // verlieren. Ist NICHT Teil von "logs" (Tagebuch) - taucht deshalb auch
    // nicht in den Diagrammen auf, solange es nicht abgeschlossen wurde.
    activeWorkout: (profileId) => `ff_active_workout_${profileId}`,
    // Alte, nicht profilgebundene Keys - nur für die einmalige Migration bestehender Daten.
    legacyPlans: "ff_plans",
    legacyLogs: "ff_logs",
};

// Standardwerte für Sätze/Wiederholungen/Gewicht/Pause, die beim
// Hinzufügen einer Übung zu einem Trainingsplan automatisch vorausgefüllt
// werden. Im Setup-Tab pro Profil anpassbar.
export const DEFAULT_SETTINGS = { defaultSets: 3, defaultReps: 10, defaultWeight: 0, defaultPause: 60 };

// Standardwerte für das Körperprofil eines neuen Profils (noch leer).
export const DEFAULT_PROFILE_DETAILS = { birthDate: "", heightCm: "", goalWeightKg: "" };

// Umfangsmaße - "Gesäß" wurde zu "Hüfte" korrigiert, da das der gängige Fachbegriff für diesen
// Umfangswert ist (Hüftumfang, z.B. für die Taille-Hüfte-Relation); "Schultern" als sinnvolle Ergänzung.
// Die Umfangsmaße, die im Körperverlauf erfasst werden können (Brust,
// Schultern, Bizeps, ...). Neue Maße könntest du hier ergänzen — dann
// tauchen sie automatisch im Erfassungs-Formular und den Diagrammen auf.
export const MEASUREMENT_FIELDS = [
    { id: "brust", label: "Brust" },
    { id: "schulter", label: "Schultern" },
    { id: "bizeps", label: "Bizeps" },
    { id: "unterarm", label: "Unterarme" },
    { id: "bauch", label: "Bauch / Taille" },
    { id: "huefte", label: "Hüfte" },
    { id: "oberschenkel", label: "Oberschenkel" },
    { id: "wade", label: "Waden" },
];

// Standard-Einstellungen dafür, welche Diagramme auf der Übersichtsseite
// sichtbar sind und welche Umfangsmaße dort angezeigt werden. Wird pro
// Profil gespeichert und im Setup-Tab bearbeitet.
export const DEFAULT_DASHBOARD_CONFIG = {
    showWeight: true,
    showBMI: true,
    showMeasurements: true,
    showEnergy: true,
    showMuscleBalance: true,
    visibleMeasurements: MEASUREMENT_FIELDS.map((m) => m.id),
    range: "month",
};

// Die auswählbaren Zeiträume für die Diagramm-Filter auf der Übersicht.
export const RANGE_OPTIONS = [
    { id: "week", label: "Woche" },
    { id: "month", label: "Monat" },
    { id: "3months", label: "3 Mon." },
    { id: "6months", label: "6 Mon." },
    { id: "year", label: "1 Jahr" },
    { id: "all", label: "Gesamt" },
];

// Die Wochentage für die Trainingsplan-Terminierung (Checkboxen im Plan-Editor).
export const WEEKDAYS = [
    { id: "mo", label: "Mo" },
    { id: "di", label: "Di" },
    { id: "mi", label: "Mi" },
    { id: "do", label: "Do" },
    { id: "fr", label: "Fr" },
    { id: "sa", label: "Sa" },
    { id: "so", label: "So" },
];

// Auswahlmöglichkeiten für das Wiederholungs-Intervall eines Trainingsplans.
export const INTERVALS = [
    { id: "weekly", label: "Wöchentlich" },
    { id: "biweekly", label: "Alle 2 Wochen" },
    { id: "triweekly", label: "Alle 3 Wochen" },
    { id: "monthly", label: "Monatlich" },
];

// Die Reiter (Tabs) oben in der Navigation, in dieser Reihenfolge. "icon"
// verweist auf die importierten Icon-Komponenten ganz oben in der Datei.
export const NAV_ITEMS = [
    { id: "uebersicht", label: "Übersicht", icon: LayoutDashboard },
    { id: "geraete", label: "Geräte", icon: Wrench },
    { id: "uebungen", label: "Übungen", icon: Dumbbell },
    { id: "plaene", label: "Pläne", icon: ClipboardList },
    { id: "tagebuch", label: "Tagebuch", icon: BookOpen },
    { id: "setup", label: "Setup", icon: Settings },
];

export const PERIOD_MODES = ["last", "day", "week"];

export const PERIOD_MODE_LABELS = { last: "Letztes Workout", day: "Heute", week: "Diese Woche" };

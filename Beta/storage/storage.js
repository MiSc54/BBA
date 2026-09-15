/* =========================================================================
   Grundlegende Speicherfunktionen (loadKey/saveKey) sowie Backup-Erstellung und -Wiederherstellung.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_PROFILE_DETAILS, DEFAULT_DASHBOARD_CONFIG } from "../data/constants.js";

export async function loadKey(key, fallback) {
    try {
        const res = await window.storage.get(key, false);
        return res ? JSON.parse(res.value) : fallback;
    }
    catch (e) {
        return fallback;
    }
}
// Speichert einen Wert dauerhaft unter einem Schlüssel (Key). Nutzt die
// von Claude.ai bereitgestellte window.storage-API bzw. im eigenständigen
// PWA-Build den localStorage-Ersatz aus index.html.

export async function saveKey(key, value) {
    try {
        await window.storage.set(key, JSON.stringify(value), false);
    }
    catch (e) {
        console.error("Speicherfehler", key, e);
    }
}
// Wandelt eine Liste von Geräte-IDs in ihre lesbaren Namen um, z.B.
// ["langhantel"] -> ["Langhantel"].

export async function collectBackup(profiles) {
    const [equipment, customEquipment, customExercises, favoriteExercises, favoriteEquipment] = await Promise.all([
        loadKey(STORAGE_KEYS.equipment, []),
        loadKey(STORAGE_KEYS.customEquipment, []),
        loadKey(STORAGE_KEYS.customExercises, []),
        loadKey(STORAGE_KEYS.favoriteExercises, []),
        loadKey(STORAGE_KEYS.favoriteEquipment, []),
    ]);
    const profileData = {};
    for (const p of profiles) {
        const [plans, logs, settings, profileDetails, bodyLog, dashboardConfig, favoritePlans, activeWorkout] = await Promise.all([
            loadKey(STORAGE_KEYS.plans(p.id), []),
            loadKey(STORAGE_KEYS.logs(p.id), []),
            loadKey(STORAGE_KEYS.settings(p.id), DEFAULT_SETTINGS),
            loadKey(STORAGE_KEYS.profileDetails(p.id), DEFAULT_PROFILE_DETAILS),
            loadKey(STORAGE_KEYS.bodyLog(p.id), []),
            loadKey(STORAGE_KEYS.dashboardConfig(p.id), DEFAULT_DASHBOARD_CONFIG),
            loadKey(STORAGE_KEYS.favoritePlans(p.id), []),
            loadKey(STORAGE_KEYS.activeWorkout(p.id), null),
        ]);
        profileData[p.id] = { plans, logs, settings, profileDetails, bodyLog, dashboardConfig, favoritePlans, activeWorkout };
    }
    return {
        version: 4,
        exportedAt: new Date().toISOString(),
        global: { equipment, customEquipment, customExercises, favoriteExercises, favoriteEquipment },
        profiles,
        profileData,
    };
}
// Spielt eine zuvor exportierte Backup-Datei komplett zurück (überschreibt
// alle aktuellen Daten). Wird beim "Backup importieren"-Button im Setup
// aufgerufen.

export async function restoreBackup(backup) {
    await saveKey(STORAGE_KEYS.equipment, backup.global?.equipment || []);
    await saveKey(STORAGE_KEYS.customEquipment, backup.global?.customEquipment || []);
    await saveKey(STORAGE_KEYS.customExercises, backup.global?.customExercises || []);
    await saveKey(STORAGE_KEYS.favoriteExercises, backup.global?.favoriteExercises || []);
    await saveKey(STORAGE_KEYS.favoriteEquipment, backup.global?.favoriteEquipment || []);
    await saveKey(STORAGE_KEYS.profiles, backup.profiles || []);
    for (const p of backup.profiles || []) {
        const data = backup.profileData?.[p.id] || {};
        await saveKey(STORAGE_KEYS.plans(p.id), data.plans || []);
        await saveKey(STORAGE_KEYS.logs(p.id), data.logs || []);
        await saveKey(STORAGE_KEYS.settings(p.id), data.settings || DEFAULT_SETTINGS);
        await saveKey(STORAGE_KEYS.profileDetails(p.id), data.profileDetails || DEFAULT_PROFILE_DETAILS);
        await saveKey(STORAGE_KEYS.bodyLog(p.id), data.bodyLog || []);
        await saveKey(STORAGE_KEYS.dashboardConfig(p.id), data.dashboardConfig || DEFAULT_DASHBOARD_CONFIG);
        await saveKey(STORAGE_KEYS.favoritePlans(p.id), data.favoritePlans || []);
        // Älteren Backups (vor diesem Update) fehlt "activeWorkout" noch komplett -
        // dann bleibt es einfach leer (null), statt einen Fehler zu verursachen.
        await saveKey(STORAGE_KEYS.activeWorkout(p.id), data.activeWorkout ?? null);
    }
}
// Escaped einen einzelnen CSV-Wert (Anführungszeichen bei Kommas/Semikolons/Zeilenumbrüchen).

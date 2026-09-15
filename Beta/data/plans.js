/* =========================================================================
   Fertige Trainingsplan-Vorlagen (PLAN_TEMPLATES).
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

// Fertige Plan-Vorlagen ("Vorlage verwenden" im Pläne-Tab). Jede Übung hat
// feste Standardwerte. Beim Übernehmen wird daraus ein normaler, frei
// bearbeitbarer eigener Plan erzeugt - die Vorlage selbst bleibt unverändert.
export const PLAN_TEMPLATES = [
    {
        id: "tpl-ganzkoerper-einsteiger",
        name: "Ganzkörper (Einsteiger)",
        description: "Einfacher Rundum-Plan für den Start - trainiert alle großen Muskelgruppen an einem Tag.",
        exercises: [
            { exerciseId: "bankdruecken", sets: 3, reps: 10, pause: 90 },
            { exerciseId: "kniebeuge", sets: 3, reps: 10, pause: 90 },
            { exerciseId: "kabelrudern", sets: 3, reps: 12, pause: 60 },
            { exerciseId: "schulterdruecken", sets: 3, reps: 10, pause: 60 },
            { exerciseId: "plank", sets: 3, reps: 1, pause: 45 },
        ],
    },
    {
        id: "tpl-push",
        name: "Push (Brust/Schultern/Trizeps)",
        description: "Drück-Übungen für Brust, Schultern und Trizeps - erster Tag eines Push/Pull/Legs-Splits.",
        exercises: [
            { exerciseId: "bankdruecken", sets: 4, reps: 8, pause: 90 },
            { exerciseId: "schraegbankdruecken", sets: 3, reps: 10, pause: 90 },
            { exerciseId: "schulterdruecken", sets: 3, reps: 10, pause: 60 },
            { exerciseId: "trizeps-kabel", sets: 3, reps: 12, pause: 45 },
            { exerciseId: "dips", sets: 3, reps: 10, pause: 60 },
        ],
    },
    {
        id: "tpl-pull",
        name: "Pull (Rücken/Bizeps)",
        description: "Zieh-Übungen für Rücken und Bizeps - zweiter Tag eines Push/Pull/Legs-Splits.",
        exercises: [
            { exerciseId: "klimmzuege", sets: 4, reps: 8, pause: 90 },
            { exerciseId: "latzug-eng", sets: 3, reps: 10, pause: 60 },
            { exerciseId: "kabelrudern", sets: 3, reps: 12, pause: 60 },
            { exerciseId: "facepulls", sets: 3, reps: 15, pause: 45 },
            { exerciseId: "bizepscurls", sets: 3, reps: 12, pause: 45 },
        ],
    },
    {
        id: "tpl-legs",
        name: "Legs (Beine/Gesäß)",
        description: "Beintag - dritter Tag eines Push/Pull/Legs-Splits.",
        exercises: [
            { exerciseId: "kniebeuge", sets: 4, reps: 8, pause: 120 },
            { exerciseId: "beinpresse-ex", sets: 3, reps: 12, pause: 90 },
            { exerciseId: "beinstrecker-ex", sets: 3, reps: 12, pause: 60 },
            { exerciseId: "beinbeuger-ex", sets: 3, reps: 12, pause: 60 },
            { exerciseId: "hip-thrust", sets: 3, reps: 10, pause: 60 },
        ],
    },
    {
        id: "tpl-ganzkoerper-fortgeschritten",
        name: "Ganzkörper (Fortgeschritten)",
        description: "Intensiverer Ganzkörper-Plan mit Kreuzheben als Schwerpunktübung.",
        exercises: [
            { exerciseId: "kreuzheben", sets: 4, reps: 6, pause: 120 },
            { exerciseId: "bankdruecken", sets: 4, reps: 8, pause: 90 },
            { exerciseId: "klimmzuege", sets: 3, reps: 8, pause: 90 },
            { exerciseId: "kniebeuge", sets: 3, reps: 8, pause: 90 },
            { exerciseId: "plank", sets: 3, reps: 1, pause: 45 },
        ],
    },
];

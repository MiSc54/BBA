import React, { useState, useEffect, useMemo, useCallback, useRef } from "https://esm.sh/react@18.3.1";
const LOGO_DATA_URL = "data:image/png;base64,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";
const APP_VERSION = "1.2.1";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "https://esm.sh/recharts@2.12.7?deps=react@18.3.1,react-dom@18.3.1";
import { LayoutDashboard, Wrench, Dumbbell, ClipboardList, BookOpen, Plus, Trash2, Check, ChevronUp, ChevronDown, Sparkles, Play, Clock, Flame, TrendingUp, X, Search, Loader2, History, ChevronRight, CircleCheck, Settings, Users, Download, Upload, Calendar, ChevronsUpDown, RotateCcw, Copy, ArrowUp, Heart, } from "https://esm.sh/lucide-react@0.383.0?deps=react@18.3.1";
/* =========================================================================
   CONSTANTS
   ========================================================================= */
const EQUIPMENT = [
    // Freie Gewichte
    { id: "langhantel", name: "Langhantel", category: "Freie Gewichte" },
    { id: "kurzhanteln", name: "Kurzhanteln", category: "Freie Gewichte" },
    { id: "verstellbare-kurzhanteln", name: "Verstellbare Kurzhanteln", category: "Freie Gewichte" },
    { id: "ez-curl-stange", name: "EZ-Curl-Stange", category: "Freie Gewichte" },
    { id: "kettlebell", name: "Kettlebell", category: "Freie Gewichte" },
    { id: "medizinball", name: "Medizinball", category: "Freie Gewichte" },
    { id: "trap-bar", name: "Trap Bar (Hex Bar)", category: "Freie Gewichte" },
    { id: "gewichtsweste", name: "Gewichtsweste", category: "Freie Gewichte" },
    { id: "gewichtsscheiben", name: "Gewichtsscheiben", category: "Freie Gewichte" },
    // Bank
    { id: "flachbank", name: "Flachbank", category: "Bank" },
    { id: "schraegbank", name: "Schrägbank", category: "Bank" },
    { id: "negativbank", name: "Negativbank", category: "Bank" },
    { id: "verstellbare-bank", name: "Verstellbare Bank", category: "Bank" },
    { id: "scott-bank", name: "Scott-Bank (Preacher Curl)", category: "Bank" },
    { id: "hyperextension-bank", name: "Hyperextension-Bank", category: "Bank" },
    // Rack
    { id: "kniebeugenstaender", name: "Kniebeugenständer", category: "Rack" },
    { id: "klimmzugstange", name: "Klimmzugstange", category: "Rack" },
    { id: "power-rack", name: "Power Rack (Käfig)", category: "Rack" },
    { id: "halbrack", name: "Halbrack", category: "Rack" },
    { id: "dip-barren", name: "Dip-Barren", category: "Rack" },
    { id: "multipresse", name: "Multipresse (Smith Machine)", category: "Rack" },
    // Kabel
    { id: "kabelzug", name: "Kabelzug (Kabelturm)", category: "Kabel" },
    { id: "latzug", name: "Latzug", category: "Kabel" },
    { id: "tiefzug", name: "Tiefzug (Low Row)", category: "Kabel" },
    { id: "kabel-crossover", name: "Kabel-Crossover", category: "Kabel" },
    { id: "umlenkrolle", name: "Umlenkrolle (Single Pulley)", category: "Kabel" },
    // Maschinen
    { id: "beinpresse", name: "Beinpresse", category: "Maschinen" },
    { id: "beinstrecker", name: "Beinstrecker", category: "Maschinen" },
    { id: "beinbeuger", name: "Beinbeuger", category: "Maschinen" },
    { id: "butterfly", name: "Butterfly", category: "Maschinen" },
    { id: "brustpresse-maschine", name: "Brustpresse-Maschine", category: "Maschinen" },
    { id: "ruderzug-sitzend", name: "Rudermaschine (sitzend)", category: "Maschinen" },
    { id: "t-bar-rudern", name: "T-Bar Rudergerät", category: "Maschinen" },
    { id: "rueckenstrecker", name: "Rückenstrecker-Maschine", category: "Maschinen" },
    { id: "bauchmaschine", name: "Bauchmaschine (Crunch)", category: "Maschinen" },
    { id: "schulterpresse-maschine", name: "Schulterpresse-Maschine", category: "Maschinen" },
    { id: "adduktoren-maschine", name: "Adduktoren-Maschine", category: "Maschinen" },
    { id: "abduktoren-maschine", name: "Abduktoren-Maschine", category: "Maschinen" },
    { id: "wadenheber-maschine", name: "Wadenheber-Maschine", category: "Maschinen" },
    { id: "assisted-pullup", name: "Assisted Pull-Up/Dip-Maschine", category: "Maschinen" },
    { id: "rotationsmaschine", name: "Rotationsmaschine (Torso)", category: "Maschinen" },
    { id: "nackenmaschine", name: "Nackenmaschine", category: "Maschinen" },
    { id: "butterfly-reverse", name: "Butterfly reverse", category: "Maschinen" },
    { id: "rueckenzugmaschine-sitzend", name: "Rückenzugmaschine (sitzend)", category: "Maschinen" },
    { id: "butterfly-griffe", name: "Butterfly (mit Griffen)", category: "Maschinen" },
    { id: "schraegbankmaschine-sitzend", name: "Schrägbankmaschine (sitzend)", category: "Maschinen" },
    { id: "seitenhebemaschine", name: "Seitenhebemaschine (mit Polster)", category: "Maschinen" },
    { id: "bizepsmaschine", name: "Bizepsmaschine", category: "Maschinen" },
    { id: "dipmaschine-sitzend", name: "Dipmaschine (sitzend)", category: "Maschinen" },
    { id: "ruderzug-brustpolster", name: "Rudermaschine sitzend (mit Brustpolster)", category: "Maschinen" },
    // Cardio
    { id: "laufband", name: "Laufband", category: "Cardio" },
    { id: "crosstrainer", name: "Crosstrainer", category: "Cardio" },
    { id: "spinning-bike", name: "Spinning-Bike", category: "Cardio" },
    { id: "liegeergometer", name: "Liegeergometer", category: "Cardio" },
    { id: "rudergeraet", name: "Rudergerät", category: "Cardio" },
    { id: "stepper", name: "Stepper (Treppensteiger)", category: "Cardio" },
    { id: "sprungseil", name: "Sprungseil", category: "Cardio" },
    { id: "airbike", name: "Airbike (Assault Bike)", category: "Cardio" },
    { id: "ski-ergometer", name: "Ski-Ergometer", category: "Cardio" },
    // Funktional
    { id: "eigengewicht", name: "Eigengewicht", category: "Funktional" },
    { id: "widerstandsband", name: "Widerstandsband", category: "Funktional" },
    { id: "sling-trainer", name: "Sling Trainer / TRX", category: "Funktional" },
    { id: "battle-ropes", name: "Battle Ropes", category: "Funktional" },
    { id: "plyo-box", name: "Plyo Box (Sprungbox)", category: "Funktional" },
    { id: "bosu-ball", name: "Bosu-Ball", category: "Funktional" },
    { id: "gymnastikball", name: "Gymnastikball (Swiss Ball)", category: "Funktional" },
    { id: "faszienrolle", name: "Faszienrolle", category: "Funktional" },
    { id: "turnringe", name: "Turnringe", category: "Funktional" },
    { id: "slam-ball", name: "Slam Ball", category: "Funktional" },
    { id: "landmine", name: "Landmine-Aufsatz", category: "Funktional" },
    { id: "ab-wheel", name: "Ab Wheel (Bauchroller)", category: "Funktional" },
    { id: "parallettes", name: "Parallettes", category: "Funktional" },
    { id: "sandbag", name: "Sandbag", category: "Funktional" },
    // Zubehör
    { id: "klimmzug-assistenzband", name: "Klimmzug-Assistenzband", category: "Zubehör" },
    { id: "klettertau", name: "Klettertau", category: "Zubehör" },
    { id: "sled", name: "Sled / Prowler (Schlitten)", category: "Zubehör" },
    { id: "aerobic-step", name: "Aerobic-Step", category: "Zubehör" },
    { id: "balance-board", name: "Balance Board", category: "Zubehör" },
    { id: "vibrationsplatte", name: "Vibrationsplatte", category: "Zubehör" },
    { id: "captains-chair", name: "Captain's Chair (Beinheber)", category: "Zubehör" },
    { id: "grip-trainer", name: "Handkrafttrainer", category: "Zubehör" },
    { id: "push-up-griffe", name: "Liegestützgriffe", category: "Zubehör" },
    { id: "yoga-matte", name: "Trainingsmatte", category: "Zubehör" },
];
const EQUIPMENT_CATEGORY_ORDER = ["Freie Gewichte", "Bank", "Rack", "Kabel", "Maschinen", "Cardio", "Funktional", "Zubehör"];
const MUSCLE_GROUPS = ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps", "Unterarme", "Quadrizeps", "Beinbizeps", "Waden", "Gesäß", "Core", "Ganzkörper"];
const EXERCISE_LIBRARY = [
    {
        id: "bankdruecken", name: "Bankdrücken", equipment: ["flachbank", "langhantel"], muscles: ["Brust", "Trizeps", "Schultern"],
        description: "Der Klassiker für die Brustmuskulatur - baut Kraft und Masse in Brust, Schultern und Trizeps auf.",
        executionSteps: ["Lege dich auf die Bank, Füße fest auf dem Boden, Schulterblätter zusammengezogen.", "Greife die Stange etwas breiter als schulterbreit.", "Senke die Stange kontrolliert zur unteren Brust ab.", "Drücke die Stange explosiv nach oben, bis die Arme fast gestreckt sind."],
        commonMistakes: ["Po hebt von der Bank ab.", "Ellbogen zeigen zu weit nach außen.", "Stange wird ungleichmäßig geführt."],
    },
    {
        id: "schraegbankdruecken", name: "Schrägbankdrücken", equipment: ["schraegbank", "langhantel"], muscles: ["Brust", "Schultern", "Trizeps"],
        description: "Betont den oberen Brustmuskel stärker als das klassische Bankdrücken.",
        executionSteps: ["Bank auf 30-45° einstellen.", "Stange etwas breiter als schulterbreit greifen.", "Kontrolliert zur oberen Brust absenken.", "Nach oben drücken, ohne die Arme komplett durchzustrecken."],
        commonMistakes: ["Bankwinkel zu steil (wird zur Schulterübung).", "Stange springt vom Brustkorb ab.", "Unterer Rücken hohl gedrückt."],
    },
    {
        id: "kh-bankdruecken", name: "Kurzhantel-Bankdrücken", equipment: ["flachbank", "kurzhanteln"], muscles: ["Brust", "Trizeps"],
        description: "Erlaubt eine größere Bewegungsamplitude und trainiert Brust und Trizeps beidseitig unabhängig.",
        executionSteps: ["Kurzhanteln mit gestreckten Armen über der Brust starten.", "Kontrolliert bis auf Brusthöhe absenken.", "Ellbogen circa 45° zum Körper halten.", "Zurück nach oben drücken, Hanteln fast zusammenführen."],
        commonMistakes: ["Zu tiefes Absenken belastet die Schultern.", "Hanteln kippen unkontrolliert zur Seite.", "Schwung aus dem Rücken statt aus der Brust."],
    },
    {
        id: "kniebeuge", name: "Kniebeuge", equipment: ["kniebeugenstaender", "langhantel"], muscles: ["Quadrizeps", "Gesäß", "Beinbizeps", "Core"],
        description: "Königsübung für die Beinmuskulatur - trainiert den gesamten Unterkörper.",
        executionSteps: ["Hantel auf dem oberen Rücken (Trapezmuskel), schulterbreiter Stand.", "Blick nach vorne, Brust raus, Core anspannen.", "Beuge kontrolliert in Hüfte und Knie, als würdest du dich hinsetzen.", "Gehe mindestens bis Oberschenkel parallel zum Boden.", "Drücke dich durch die Ferse wieder nach oben."],
        commonMistakes: ["Knie fallen nach innen.", "Runder Rücken beim Abwärtsgehen.", "Fersen heben sich vom Boden."],
    },
    {
        id: "kreuzheben", name: "Kreuzheben", equipment: ["langhantel"], muscles: ["Rücken", "Beinbizeps", "Gesäß", "Core"],
        description: "Eine der effektivsten Ganzkörperübungen - kräftigt die gesamte hintere Muskelkette.",
        executionSteps: ["Stange über der Fußmitte, schulterbreiter Stand.", "Rücken gerade, Brust raus, Griff etwas außerhalb der Schienbeine.", "Stange nah am Körper nach oben ziehen, Hüfte und Knie strecken sich gemeinsam.", "Oben Hüfte vollständig strecken, nicht überstrecken.", "Kontrolliert wieder ablassen."],
        commonMistakes: ["Runder Rücken beim Anheben.", "Stange wandert weit vom Körper weg.", "Hüfte schießt vor den Schultern hoch."],
    },
    {
        id: "klimmzuege", name: "Klimmzüge", equipment: ["klimmzugstange"], muscles: ["Rücken", "Bizeps", "Unterarme"], bodyweightFactor: 1.0,
        description: "Eine der besten Übungen für den breiten Rücken - trainiert zusätzlich Bizeps und Griffkraft.",
        executionSteps: ["Stange etwas breiter als schulterbreit greifen.", "Aus dem Hang starten, Schulterblätter aktivieren.", "Körper nach oben ziehen, bis Kinn über der Stange ist.", "Kontrolliert wieder ablassen bis Arme fast gestreckt sind."],
        commonMistakes: ["Schwungholen mit dem ganzen Körper.", "Nur bis zur Hälfte hochziehen.", "Schultern hängen unten nicht locker."],
    },
    {
        id: "latzug-eng", name: "Latzug eng", equipment: ["latzug"], muscles: ["Rücken", "Bizeps"],
        description: "Baut die Rückenbreite auf und ist eine gute Alternative oder Ergänzung zu Klimmzügen.",
        executionSteps: ["Eng am Dreieckgriff oder schulterbreit greifen, aufrecht sitzen.", "Stange zur oberen Brust ziehen, Ellbogen nach unten führen.", "Schulterblätter am Ende der Bewegung zusammenziehen.", "Kontrolliert in die Ausgangsposition zurückführen."],
        commonMistakes: ["Oberkörper schaukelt stark nach hinten.", "Stange wird hinter den Nacken gezogen.", "Zu viel Schwung statt Muskelarbeit."],
    },
    {
        id: "kabelrudern", name: "Rudern am Kabelzug", equipment: ["kabelzug"], muscles: ["Rücken", "Bizeps"],
        description: "Kräftigt den mittleren Rücken und verbessert die Haltung.",
        executionSteps: ["Aufrecht sitzen, Griff mit gestreckten Armen fassen.", "Rumpf stabil halten, leichte Vorneigung im Startpunkt.", "Griff zum Bauchnabel ziehen, Ellbogen eng am Körper.", "Schulterblätter zusammenziehen, dann kontrolliert zurückführen."],
        commonMistakes: ["Rücken rundet sich beim Ziehen.", "Zu starkes Vor- und Zurückschaukeln.", "Ellbogen weichen zu weit nach außen aus."],
    },
    {
        id: "beinpresse-ex", name: "Beinpresse", equipment: ["beinpresse"], muscles: ["Quadrizeps", "Gesäß", "Beinbizeps"],
        description: "Trainiert die gesamte Beinmuskulatur gelenkschonend und mit hohen Gewichten.",
        executionSteps: ["Füße schulterbreit mittig auf der Plattform platzieren.", "Sicherungen lösen, Beine langsam beugen.", "Bis ca. 90° Kniewinkel absenken.", "Kraftvoll durch die Fersen zurück nach oben drücken, Knie nicht durchstrecken."],
        commonMistakes: ["Unterer Rücken hebt von der Polsterung ab.", "Knie fallen beim Drücken nach innen.", "Zu tiefes Absenken mit rundem Becken."],
    },
    {
        id: "schulterdruecken", name: "Schulterdrücken", equipment: ["kurzhanteln"], muscles: ["Schultern", "Trizeps", "Core"],
        description: "Baut kräftige, runde Schultern auf und stabilisiert gleichzeitig den Rumpf.",
        executionSteps: ["Kurzhanteln auf Schulterhöhe starten, Handflächen nach vorne.", "Core anspannen, kein Hohlkreuz.", "Hanteln über den Kopf drücken, bis Arme fast gestreckt sind.", "Kontrolliert zurück auf Schulterhöhe absenken."],
        commonMistakes: ["Starkes Hohlkreuz durch fehlende Rumpfspannung.", "Hanteln driften zu weit nach vorne.", "Ellbogen komplett durchgedrückt am oberen Punkt."],
    },
    {
        id: "bizepscurls", name: "Bizeps-Curls", equipment: ["kurzhanteln"], muscles: ["Bizeps", "Unterarme"],
        description: "Isolationsübung für den Bizeps - einfach zu erlernen und sehr effektiv.",
        executionSteps: ["Hanteln neben dem Körper, Handflächen nach vorne.", "Ellbogen eng am Oberkörper fixieren.", "Hanteln kontrolliert nach oben curlen.", "Langsam wieder ablassen, ohne die Arme durchzuschlagen."],
        commonMistakes: ["Schwungholen mit dem Oberkörper.", "Ellbogen wandern nach vorne.", "Bewegung wird nicht vollständig ausgeführt."],
    },
    {
        id: "kb-swings", name: "Kettlebell Swings", equipment: ["kettlebell"], muscles: ["Ganzkörper", "Gesäß", "Core"],
        description: "Explosive Ganzkörperübung, die Kraft und Ausdauer gleichzeitig trainiert.",
        executionSteps: ["Kettlebell mit beiden Händen vor dem Körper greifen.", "Aus der Hüfte in die Knie schwingen, Kettlebell zwischen den Beinen durch.", "Hüfte explosiv nach vorne strecken.", "Kettlebell schwingt bis auf Schulterhöhe, dann zurückschwingen lassen."],
        commonMistakes: ["Bewegung kommt aus den Armen statt der Hüfte.", "Runder Rücken in der Tiefposition.", "Zu tiefe Kniebeuge statt Hüftbewegung."],
    },
    {
        id: "liegestuetz", name: "Liegestütze", equipment: ["eigengewicht"], muscles: ["Brust", "Trizeps", "Core"], bodyweightFactor: 0.64,
        description: "Effektive Bodyweight-Übung für Brust, Trizeps und Rumpfstabilität - überall durchführbar.",
        executionSteps: ["Hände etwas breiter als schulterbreit auf dem Boden platzieren.", "Körper von Kopf bis Ferse in einer Linie halten.", "Kontrolliert absenken, bis die Brust fast den Boden berührt.", "Kraftvoll zurück in die Ausgangsposition drücken."],
        commonMistakes: ["Hüfte sackt durch oder wird zu hoch gedrückt.", "Ellbogen zeigen komplett zur Seite.", "Bewegungsradius zu klein."],
    },
    {
        id: "plank", name: "Plank", equipment: ["eigengewicht"], muscles: ["Core"], trackingType: "duration", met: 3,
        description: "Statische Übung zur Kräftigung der gesamten Rumpfmuskulatur.",
        executionSteps: ["Unterarme und Zehenspitzen auf dem Boden aufstützen.", "Körper von Kopf bis Ferse zu einer geraden Linie formen.", "Bauchnabel Richtung Wirbelsäule ziehen, Gesäß leicht anspannen.", "Position für die geplante Zeit halten, ruhig weiteratmen."],
        commonMistakes: ["Hüfte hängt durch.", "Po wird zu hoch in die Luft gestreckt.", "Luft anhalten statt gleichmäßig zu atmen."],
    },
    {
        id: "ausfallschritte", name: "Ausfallschritte", equipment: ["kurzhanteln"], muscles: ["Quadrizeps", "Gesäß", "Beinbizeps"],
        description: "Trainiert Beine und Gesäß einseitig und verbessert nebenbei die Balance.",
        executionSteps: ["Großen Schritt nach vorne machen.", "Beide Knie auf ca. 90° beugen, Oberkörper aufrecht.", "Hinteres Knie schwebt kurz über dem Boden.", "Kraftvoll zurück in die Ausgangsposition drücken."],
        commonMistakes: ["Vorderes Knie schiebt weit über die Zehenspitzen.", "Oberkörper kippt nach vorne.", "Schritt ist zu kurz für einen sauberen Winkel."],
    },
    {
        id: "laufen", name: "Laufen", equipment: ["laufband"], muscles: [], trackingType: "distance", kcalPerKgKm: 1.0,
        description: "Grundlegendes Ausdauertraining für Herz-Kreislauf-System und Kondition.",
        executionSteps: ["Moderates Tempo wählen, aufrecht laufen.", "Arme locker im Rhythmus mitschwingen.", "Gleichmäßig und tief atmen.", "Tempo und Steigung nach Trainingsziel anpassen."],
        commonMistakes: ["Zu schnell starten und früh ermüden.", "Verkrampfte Schultern und Arme.", "Zu kurze, hastige Schritte."],
    },
    {
        id: "rudern-ergo", name: "Rudern (Ergometer)", equipment: ["rudergeraet"], muscles: ["Rücken"], trackingType: "distance", kcalPerKgKm: 0.9,
        description: "Ganzkörper-Cardio, das gleichzeitig Rücken, Beine und Arme kräftigt.",
        executionSteps: ["Mit den Beinen abdrücken, Oberkörper bleibt zunächst aufrecht.", "Anschließend Oberkörper leicht nach hinten lehnen und Arme anziehen.", "Griff zum unteren Brustbein ziehen.", "Bewegung in umgekehrter Reihenfolge kontrolliert lösen."],
        commonMistakes: ["Nur mit den Armen rudern statt Beinkraft zu nutzen.", "Runder Rücken während des Zugs.", "Hektische, unkontrollierte Bewegung."],
    },
    {
        id: "trizeps-kabel", name: "Trizepsdrücken am Kabel", equipment: ["kabelzug"], muscles: ["Trizeps"],
        description: "Isolierte Übung für den Trizeps mit konstanter Spannung durch den Kabelzug.",
        executionSteps: ["Griff im Obergriff fassen, Ellbogen eng am Körper fixieren.", "Griff kontrolliert nach unten drücken, bis Arme fast gestreckt sind.", "Kurz halten und Trizeps anspannen.", "Langsam zurück in die Ausgangsposition führen."],
        commonMistakes: ["Ellbogen wandern vom Körper weg.", "Oberkörper beugt sich beim Drücken nach vorne.", "Bewegung wird nicht vollständig ausgeführt."],
    },
    {
        id: "facepulls", name: "Face Pulls", equipment: ["kabelzug"], muscles: ["Schultern", "Rücken"],
        description: "Wichtige Übung für die hintere Schulter und die Schulterblatt-Stabilität.",
        executionSteps: ["Seilgriff auf Gesichtshöhe einstellen.", "Griff mit beiden Händen fassen, leicht zurücklehnen.", "Seil Richtung Gesicht ziehen, Ellbogen hoch und außen führen.", "Schulterblätter am Ende zusammenziehen, dann kontrolliert lösen."],
        commonMistakes: ["Zu schweres Gewicht führt zu Schwung.", "Ellbogen sinken nach unten ab.", "Zug erfolgt nur aus den Armen, nicht aus den Schultern."],
    },
    {
        id: "hip-thrust", name: "Hip Thrust", equipment: ["flachbank", "langhantel"], muscles: ["Gesäß", "Beinbizeps"],
        description: "Eine der effektivsten Übungen zum gezielten Aufbau der Gesäßmuskulatur.",
        executionSteps: ["Oberer Rücken an der Bank abstützen, Hantel über der Hüfte.", "Füße hüftbreit aufstellen, Fersen nah am Gesäß.", "Hüfte kraftvoll nach oben strecken, Gesäß fest anspannen.", "Kontrolliert wieder absenken, ohne die Hüfte ganz abzusetzen."],
        commonMistakes: ["Überstreckung im unteren Rücken statt Hüftstreckung.", "Kinn wird beim Hochdrücken in den Nacken gezogen.", "Füße stehen zu weit vom Körper entfernt."],
    },
    {
        id: "beinstrecker-ex", name: "Beinstrecker sitzend", equipment: ["beinstrecker"], muscles: ["Quadrizeps"],
        description: "Isolationsübung, die gezielt den vorderen Oberschenkel (Quadrizeps) trainiert.",
        executionSteps: ["Rückenlehne so einstellen, dass die Knie mit dem Drehpunkt der Maschine übereinstimmen.", "Schienbeinpolster liegt oberhalb der Fußgelenke an.", "Beine kontrolliert nach vorne strecken.", "Langsam wieder in die Ausgangsposition absenken."],
        commonMistakes: ["Bewegung wird ruckartig statt kontrolliert ausgeführt.", "Gesäß hebt vom Sitz ab.", "Knie werden am oberen Punkt überstreckt."],
    },
    {
        id: "beinbeuger-ex", name: "Beinbeuger liegend", equipment: ["beinbeuger"], muscles: ["Beinbizeps"],
        description: "Isolationsübung für die hintere Oberschenkelmuskulatur (Beinbizeps).",
        executionSteps: ["Position so einstellen, dass die Knie am Drehpunkt der Maschine liegen.", "Fersen unter dem Polster fixieren.", "Beine kontrolliert Richtung Gesäß beugen.", "Langsam wieder zurückführen, ohne das Gewicht fallen zu lassen."],
        commonMistakes: ["Hüfte hebt während der Bewegung ab.", "Schwungholen statt kontrollierter Ausführung.", "Zu geringer Bewegungsradius."],
    },
    {
        id: "butterfly-ex", name: "Butterfly", equipment: ["butterfly"], muscles: ["Brust"],
        description: "Isolationsübung, die die Brustmuskulatur gezielt von der Seite zusammenführt.",
        executionSteps: ["Rücken fest an die Rückenlehne anlehnen.", "Griffe oder Armpolster auf Brusthöhe fassen.", "Arme kontrolliert vor der Brust zusammenführen.", "Langsam wieder auseinanderführen, ohne die Dehnung zu übertreiben."],
        commonMistakes: ["Schwung statt kontrollierter Bewegung.", "Schultern werden nach vorne gezogen.", "Bewegung wird zu ruckartig beendet."],
    },
    {
        id: "sitzendes-rudern", name: "Sitzendes Rudern", equipment: ["ruderzug-sitzend"], muscles: ["Rücken", "Bizeps"],
        description: "Kräftigt den mittleren Rücken in einer stabilen, sitzenden Position.",
        executionSteps: ["Aufrecht sitzen, Füße auf den Fußstützen fixieren.", "Griff mit leicht gebeugten Armen fassen.", "Griff zum Bauch ziehen, Schulterblätter zusammenführen.", "Kontrolliert in die Ausgangsposition zurückführen."],
        commonMistakes: ["Oberkörper schaukelt stark vor und zurück.", "Rücken rundet sich während des Zugs.", "Schultern ziehen sich zu den Ohren hoch."],
    },
    {
        id: "hyperextensions", name: "Hyperextensions", equipment: ["rueckenstrecker"], muscles: ["Rücken", "Gesäß", "Beinbizeps"],
        description: "Kräftigt den unteren Rücken und die hintere Kette - gut zur Vorbeugung von Rückenschmerzen.",
        executionSteps: ["Hüfte am Polster fixieren, Oberkörper hängt locker nach vorne.", "Core anspannen, Rücken gerade halten.", "Oberkörper kontrolliert nach oben strecken, bis Rumpf und Beine eine Linie bilden.", "Langsam wieder in die Ausgangsposition absenken."],
        commonMistakes: ["Überstreckung im unteren Rücken am oberen Punkt.", "Bewegung wird zu schnell und mit Schwung ausgeführt.", "Kopf wird stark in den Nacken gezogen."],
    },
    {
        id: "bauchmaschine-crunch", name: "Crunch an der Bauchmaschine", equipment: ["bauchmaschine"], muscles: ["Core"],
        description: "Isolierte Bauchübung mit einstellbarem Widerstand für gezielte Bauchmuskelarbeit.",
        executionSteps: ["Polster auf Brust bzw. Schultern einstellen und fest greifen.", "Bauchmuskeln anspannen, nicht mit dem Nacken ziehen.", "Oberkörper kontrolliert nach vorne/unten einrollen.", "Langsam in die Ausgangsposition zurückführen."],
        commonMistakes: ["Zug erfolgt aus dem Nacken statt aus dem Bauch.", "Zu schweres Gewicht führt zu Schwung.", "Bewegung wird nicht vollständig kontrolliert."],
    },
    {
        id: "schulterpresse-maschine-ex", name: "Schulterpresse (Maschine)", equipment: ["schulterpresse-maschine"], muscles: ["Schultern", "Trizeps"],
        description: "Geführte Druckbewegung für die Schultern - besonders einsteigerfreundlich.",
        executionSteps: ["Sitzhöhe so einstellen, dass die Griffe auf Schulterhöhe sind.", "Rücken fest an die Lehne anlehnen.", "Griffe nach oben drücken, bis Arme fast gestreckt sind.", "Kontrolliert zurück auf Schulterhöhe absenken."],
        commonMistakes: ["Hohlkreuz durch fehlende Rückenanlage.", "Ellbogen komplett am oberen Punkt durchgedrückt.", "Bewegung zu schnell und unkontrolliert."],
    },
    {
        id: "dips", name: "Dips", equipment: ["dip-barren"], muscles: ["Trizeps", "Brust"], bodyweightFactor: 0.84,
        description: "Kräftige Druckübung für Trizeps und untere Brust mit dem eigenen Körpergewicht.",
        executionSteps: ["An den Barren hochstützen, Arme gestreckt.", "Leichte Vorlage des Oberkörpers für mehr Brustbeteiligung.", "Kontrolliert absenken, bis die Oberarme etwa parallel zum Boden sind.", "Kraftvoll zurück nach oben drücken."],
        commonMistakes: ["Zu tiefes Absenken belastet die Schultern.", "Schultern ziehen sich nach oben zu den Ohren.", "Bewegung wird nur im oberen Bereich ausgeführt."],
    },
    {
        id: "kniebeuge-multipresse", name: "Kniebeuge an der Multipresse", equipment: ["multipresse"], muscles: ["Quadrizeps", "Gesäß"],
        description: "Geführte Variante der Kniebeuge - gut zum Erlernen der Bewegung oder für schwere Sätze ohne Spotter.",
        executionSteps: ["Stange auf dem oberen Rücken platzieren, Füße leicht vor der Stange positionieren.", "Core anspannen, kontrolliert in die Hocke gehen.", "Bis mindestens Oberschenkel parallel zum Boden absenken.", "Durch die Fersen wieder nach oben drücken."],
        commonMistakes: ["Füße zu nah unter der Stange positioniert.", "Knie fallen nach innen.", "Fersen heben beim Hochdrücken ab."],
    },
    {
        id: "crosstrainer-ex", name: "Crosstrainer", equipment: ["crosstrainer"], muscles: [], trackingType: "distance", kcalPerKgKm: 0.85,
        description: "Gelenkschonendes Ganzkörper-Cardiotraining für Ausdauer und Fettverbrennung.",
        executionSteps: ["Aufrecht stehen, Griffe locker greifen oder frei bewegen.", "Gleichmäßiges Tempo im gesamten Bewegungsradius wählen.", "Beine und Arme koordiniert mitbewegen lassen.", "Widerstand und Tempo nach Trainingsziel steigern."],
        commonMistakes: ["Sich zu stark auf die Griffe abstützen.", "Zu kurzer, abgehackter Bewegungsradius.", "Oberkörper sackt nach vorne."],
    },
    {
        id: "spinning-ex", name: "Spinning", equipment: ["spinning-bike"], muscles: ["Quadrizeps"], trackingType: "duration", met: 7.5,
        description: "Intensives Radtraining für Ausdauer und Beinkraft.",
        executionSteps: ["Sattelhöhe so einstellen, dass das Knie im tiefsten Punkt leicht gebeugt bleibt.", "Aufrechte, stabile Oberkörperhaltung einnehmen.", "Gleichmäßig in den Pedalen treten, Widerstand nach Intervall anpassen.", "Bei Sprints kurzzeitig aus dem Sattel gehen, wenn gewünscht."],
        commonMistakes: ["Sattel zu niedrig eingestellt, belastet die Knie.", "Oberkörper kippt zu weit nach vorne.", "Zu hoher Widerstand bei niedriger Trittfrequenz."],
    },
    {
        id: "seilspringen", name: "Seilspringen", equipment: ["sprungseil"], muscles: ["Waden"], trackingType: "duration", met: 11,
        description: "Effektives und platzsparendes Cardiotraining, das zusätzlich Koordination fördert.",
        executionSteps: ["Seil mit beiden Händen locker greifen, Ellbogen nah am Körper.", "Aus den Handgelenken schwingen, nicht aus den Armen.", "Mit dem Vorfuß leicht und kontrolliert abspringen.", "Gleichmäßigen Rhythmus über die geplante Dauer halten."],
        commonMistakes: ["Zu hohe Sprünge mit hartem Aufkommen.", "Schwung kommt aus den Schultern statt den Handgelenken.", "Unregelmäßiger Rhythmus führt zu Stolperern."],
    },
    {
        id: "sling-rudern", name: "Rudern am Sling Trainer", equipment: ["sling-trainer"], muscles: ["Rücken", "Core"],
        description: "Funktionelle Übung mit dem eigenen Körpergewicht, die Rücken und Rumpfstabilität kombiniert.",
        executionSteps: ["Griffe fassen, Körper schräg nach hinten lehnen, Arme gestreckt.", "Körper als stabile Linie von Kopf bis Ferse halten.", "Oberkörper zu den Griffen ziehen, Ellbogen nach hinten führen.", "Kontrolliert zurück in die gestreckte Position ablassen."],
        commonMistakes: ["Hüfte sackt während der Bewegung durch.", "Zug erfolgt nur aus den Armen.", "Körperwinkel zu leicht, wodurch die Übung zu einfach wird."],
    },
    {
        id: "russian-twist", name: "Russian Twist mit Medizinball", equipment: ["medizinball"], muscles: ["Core"],
        description: "Rotationsübung für die schrägen Bauchmuskeln.",
        executionSteps: ["Im Sitzen die Beine leicht anheben, Oberkörper nach hinten neigen.", "Medizinball mit beiden Händen vor dem Körper halten.", "Oberkörper kontrolliert von Seite zu Seite drehen.", "Ball bei jeder Seite kurz neben der Hüfte absetzen oder antippen."],
        commonMistakes: ["Bewegung kommt nur aus den Armen, nicht aus der Rotation.", "Rücken rundet sich stark.", "Zu schnelles, unkontrolliertes Tempo."],
    },
    {
        id: "wadenheben", name: "Wadenheben", equipment: ["wadenheber-maschine"], muscles: ["Waden"],
        description: "Isolationsübung für die Wadenmuskulatur mit vollem Bewegungsradius.",
        executionSteps: ["Schultern unter die Polster positionieren, Fußballen auf der Kante.", "Fersen kontrolliert unter die Standfläche absenken für eine tiefe Dehnung.", "Kraftvoll auf die Zehenspitzen nach oben drücken.", "Kurz oben halten, dann langsam wieder absenken."],
        commonMistakes: ["Bewegung wird zu klein und ruckartig ausgeführt.", "Knie werden stark gebeugt statt gestreckt gehalten.", "Fersen senken sich nicht vollständig ab."],
    },
    {
        id: "t-bar-rudern-ex", name: "T-Bar Rudern", equipment: ["t-bar-rudern"], muscles: ["Rücken", "Bizeps"],
        description: "Baut Rückendicke auf und ermöglicht das Rudern mit hohen Gewichten.",
        executionSteps: ["Über der Stange stehen, Rücken gerade, leichte Vorbeuge aus der Hüfte.", "Griff mit beiden Händen fassen.", "Stange zum Oberbauch ziehen, Ellbogen nach hinten führen.", "Kontrolliert wieder absenken, ohne den Rücken zu runden."],
        commonMistakes: ["Rücken rundet sich beim Ziehen.", "Zu starkes Aufrichten des Oberkörpers als Schwung.", "Bewegung wird nicht vollständig ausgeführt."],
    },
    {
        id: "ab-wheel-rollout", name: "Ab Wheel Rollout", equipment: ["ab-wheel"], muscles: ["Core"],
        description: "Anspruchsvolle Core-Übung, die die gesamte Rumpfmuskulatur unter Spannung hält.",
        executionSteps: ["Im Kniestand das Rad mit beiden Händen greifen.", "Core fest anspannen, Rad langsam nach vorne rollen.", "So weit rollen, wie die Spannung im Rumpf gehalten werden kann.", "Aus dem Bauch zurück in die Ausgangsposition ziehen."],
        commonMistakes: ["Hohlkreuz durch fehlende Rumpfspannung.", "Zu weites Rollen ohne Kontrolle.", "Bewegung kommt aus den Schultern statt dem Rumpf."],
    },
    {
        id: "sled-push", name: "Sled Push", equipment: ["sled"], muscles: ["Quadrizeps", "Gesäß", "Cardio"],
        description: "Intensive Ganzkörperübung, die Kraft und Ausdauer der Beine kombiniert.",
        executionSteps: ["Sled mit leicht gebeugten Armen fassen, Körper in Schräglage.", "Core anspannen, kraftvolle, kurze Schritte setzen.", "Konstanten Druck über den ganzen Antritt aufrechterhalten.", "Über die geplante Distanz gleichmäßig weiterschieben."],
        commonMistakes: ["Oberkörper zu aufrecht statt in Schräglage.", "Zu große, unkontrollierte Schritte.", "Arme komplett durchgestreckt statt aktiv stützend."],
    },
    {
        id: "battle-ropes-waves", name: "Battle Ropes Wellen", equipment: ["battle-ropes"], muscles: ["Schultern", "Core"], trackingType: "duration", met: 8,
        description: "Hochintensives Intervalltraining für Schultern, Arme und Rumpf.",
        executionSteps: ["Hüftbreiter Stand, Knie leicht gebeugt, ein Seilende in jeder Hand.", "Core fest anspannen.", "Arme abwechselnd kraftvoll auf und ab bewegen, sodass Wellen entstehen.", "Gleichmäßigen Rhythmus über die geplante Intervalldauer halten."],
        commonMistakes: ["Rücken rundet sich während der Bewegung.", "Bewegung kommt nur aus den Handgelenken statt den Schultern.", "Zu hohes Tempo führt zu unsauberer Ausführung."],
    },
    {
        id: "abduktion-maschine", name: "Abduktion an der Maschine", equipment: ["abduktoren-maschine"], muscles: ["Gesäß"],
        description: "Isolationsübung für die äußere Hüft- und Gesäßmuskulatur.",
        executionSteps: ["Aufrecht hinsetzen, Rücken an die Lehne.", "Beine außen an die Polster anlegen.", "Beine kontrolliert nach außen drücken.", "Langsam wieder zur Ausgangsposition zurückführen."],
        commonMistakes: ["Schwungholen mit dem Oberkörper.", "Bewegung zu schnell und ruckartig.", "Zu geringer Bewegungsradius."],
    },
    {
        id: "adduktion-maschine", name: "Adduktion an der Maschine", equipment: ["adduktoren-maschine"], muscles: ["Quadrizeps"],
        description: "Isolationsübung für die innere Oberschenkelmuskulatur.",
        executionSteps: ["Aufrecht hinsetzen, Rücken an die Lehne.", "Beine außen an den Polstern starten.", "Beine kontrolliert zusammenführen.", "Langsam wieder zur Ausgangsposition zurückführen."],
        commonMistakes: ["Zu schweres Gewicht führt zu Schwung.", "Bewegung wird nicht vollständig kontrolliert.", "Becken kippt während der Bewegung."],
    },
    {
        id: "butterfly-reverse-ex", name: "Butterfly reverse", equipment: ["butterfly-reverse"], muscles: ["Schultern", "Rücken"],
        description: "Kräftigt die hintere Schulter und den oberen Rücken - guter Ausgleich zum Bankdrücken.",
        executionSteps: ["Aufrecht sitzen, Brust an die Polsterung.", "Griffe mit leicht gebeugten Armen fassen.", "Arme nach hinten öffnen, Schulterblätter zusammenziehen.", "Kontrolliert wieder nach vorne führen."],
        commonMistakes: ["Schwung statt kontrollierter Bewegung.", "Zu schweres Gewicht verkürzt den Bewegungsradius.", "Schultern ziehen sich nach oben."],
    },
    {
        id: "rueckenzug-sitzend-ex", name: "Rückenzug sitzend", equipment: ["rueckenzugmaschine-sitzend"], muscles: ["Rücken", "Bizeps"],
        description: "Kräftigt den breiten Rücken in einer geführten, gelenkschonenden Bewegung.",
        executionSteps: ["Aufrecht sitzen, Beine fixieren.", "Griff mit leicht gebeugten Armen fassen.", "Griff kontrolliert zum Oberkörper ziehen.", "Langsam wieder in die Ausgangsposition zurückführen."],
        commonMistakes: ["Oberkörper schaukelt stark mit.", "Zug erfolgt nur aus den Armen.", "Schultern ziehen sich zu den Ohren hoch."],
    },
    {
        id: "brustpresse-sitzend-ex", name: "Brustpresse sitzend", equipment: ["brustpresse-maschine"], muscles: ["Brust", "Trizeps", "Schultern"],
        description: "Geführte Druckbewegung für die Brust - einsteigerfreundlich und gelenkschonend.",
        executionSteps: ["Sitzhöhe so einstellen, dass Griffe auf Brusthöhe sind.", "Rücken fest an die Lehne anlehnen.", "Griffe nach vorne drücken, bis Arme fast gestreckt sind.", "Kontrolliert zurück zur Ausgangsposition führen."],
        commonMistakes: ["Schulterblätter lösen sich von der Lehne.", "Ellbogen am Endpunkt komplett durchgedrückt.", "Bewegung zu schnell und unkontrolliert."],
    },
    {
        id: "butterfly-griffe-ex", name: "Butterfly mit Griffen", equipment: ["butterfly-griffe"], muscles: ["Brust"],
        description: "Variante des Butterfly mit freien Griffen für einen größeren Bewegungsradius.",
        executionSteps: ["Rücken fest an die Rückenlehne anlehnen.", "Griffe auf Brusthöhe mit leicht gebeugten Armen fassen.", "Griffe kontrolliert vor der Brust zusammenführen.", "Langsam wieder in die Dehnung zurückführen."],
        commonMistakes: ["Zu weites Zurückführen überdehnt die Schulter.", "Schwung statt kontrollierter Bewegung.", "Schultern werden nach vorne gezogen."],
    },
    {
        id: "schraegbankmaschine-ex", name: "Schrägbankdrücken sitzend (Maschine)", equipment: ["schraegbankmaschine-sitzend"], muscles: ["Brust", "Schultern", "Trizeps"],
        description: "Geführte Variante des Schrägbankdrückens, betont die obere Brust.",
        executionSteps: ["Sitzposition so einstellen, dass Griffe auf oberer Brusthöhe sind.", "Rücken fest an die Lehne anlehnen.", "Griffe nach oben-vorne drücken, bis Arme fast gestreckt sind.", "Kontrolliert zurückführen."],
        commonMistakes: ["Hohlkreuz durch fehlende Rückenanlage.", "Ellbogen komplett durchgedrückt am Endpunkt.", "Zu schnelles, unkontrolliertes Tempo."],
    },
    {
        id: "seitenheben-maschine-ex", name: "Seitheben an der Maschine", equipment: ["seitenhebemaschine"], muscles: ["Schultern"],
        description: "Isolierte, geführte Übung für die seitliche Schulter.",
        executionSteps: ["Aufrecht sitzen, Oberarm am Polster anlegen.", "Core anspannen, Schultern tief halten.", "Arm kontrolliert bis Schulterhöhe anheben.", "Langsam wieder absenken."],
        commonMistakes: ["Schwung durch Mitdrehen des Oberkörpers.", "Arm wird über Schulterhöhe gerissen.", "Bewegung zu schnell und unkontrolliert."],
    },
    {
        id: "bizepsmaschine-ex", name: "Bizeps an der Maschine", equipment: ["bizepsmaschine"], muscles: ["Bizeps"],
        description: "Isolierte, geführte Übung für den Bizeps mit konstanter Spannung.",
        executionSteps: ["Oberarme fest auf dem Polster ablegen.", "Griffe fassen, Startposition mit gestreckten Armen.", "Kontrolliert nach oben curlen.", "Langsam wieder ablassen, ohne durchzuschlagen."],
        commonMistakes: ["Ellbogen heben vom Polster ab.", "Schwungholen mit dem Oberkörper.", "Bewegung wird nicht vollständig ausgeführt."],
    },
    {
        id: "dipmaschine-sitzend-ex", name: "Dips an der Maschine (sitzend)", equipment: ["dipmaschine-sitzend"], muscles: ["Trizeps", "Brust"],
        description: "Geführte, gelenkschonende Variante der Dips für Trizeps und untere Brust.",
        executionSteps: ["Aufrecht hinsetzen, Griffe fassen.", "Core anspannen, Rücken gerade halten.", "Griffe kontrolliert nach unten drücken.", "Langsam wieder in die Ausgangsposition zurückführen."],
        commonMistakes: ["Schultern ziehen sich zu den Ohren hoch.", "Bewegung nur im oberen Teilbereich.", "Zu schnelles, unkontrolliertes Tempo."],
    },
    {
        id: "ruderzug-brustpolster-ex", name: "Rudern sitzend mit Brustpolster", equipment: ["ruderzug-brustpolster"], muscles: ["Rücken", "Bizeps"],
        description: "Chest-Supported Row - isoliert den Rücken durch die feste Brustauflage ohne Schwung aus dem unteren Rücken.",
        executionSteps: ["Brust fest an das Polster anlehnen.", "Griffe mit leicht gebeugten Armen fassen.", "Griffe zum Körper ziehen, Schulterblätter zusammenführen.", "Kontrolliert wieder nach vorne führen."],
        commonMistakes: ["Kopf hebt stark vom Polster ab.", "Zug erfolgt nur aus den Armen.", "Schultern ziehen sich zu den Ohren hoch."],
    },
    {
        id: "situps", name: "Sit-Ups", equipment: ["eigengewicht"], muscles: ["Core"], bodyweightFactor: 0.3,
        description: "Klassische Bauchübung mit größerer Bewegungsamplitude als der Crunch.",
        executionSteps: ["Rückenlage, Knie aufgestellt, Hände locker an den Schläfen oder vor der Brust.", "Core anspannen, mit dem Oberkörper aufrollen.", "Bis in eine aufrechte Sitzposition kommen.", "Kontrolliert zurück in die Ausgangsposition ablegen."],
        commonMistakes: ["Zug am Kopf/Nacken mit den Händen.", "Schwungholen statt Bauchkraft nutzen.", "Füße werden nicht fixiert und heben ab."],
    },
    {
        id: "kniebeuge-eigengewicht", name: "Kniebeuge (Eigengewicht)", equipment: ["eigengewicht"], muscles: ["Quadrizeps", "Gesäß", "Beinbizeps", "Core"], bodyweightFactor: 0.9,
        description: "Kniebeuge mit dem eigenen Körpergewicht - ideal zum Erlernen der Bewegung oder als Konditionsübung.",
        executionSteps: ["Schulterbreiter Stand, Arme locker vor dem Körper oder auf der Brust.", "Blick nach vorne, Brust raus, Core anspannen.", "Kontrolliert in die Hocke gehen, Knie folgen den Zehen.", "Durch die Fersen wieder nach oben drücken."],
        commonMistakes: ["Knie fallen nach innen.", "Fersen heben vom Boden ab.", "Oberkörper kippt zu weit nach vorne."],
    },
];
const STORAGE_KEYS = {
    equipment: "ff_equipment",
    customEquipment: "ff_custom_equipment",
    customExercises: "ff_custom_exercises",
    favoriteExercises: "ff_favorite_exercises",
    favoriteEquipment: "ff_favorite_equipment",
    profiles: "ff_profiles",
    activeProfile: "ff_active_profile",
    plans: (profileId) => `ff_plans_${profileId}`,
    logs: (profileId) => `ff_logs_${profileId}`,
    settings: (profileId) => `ff_settings_${profileId}`,
    profileDetails: (profileId) => `ff_profile_details_${profileId}`,
    bodyLog: (profileId) => `ff_bodylog_${profileId}`,
    dashboardConfig: (profileId) => `ff_dashboard_config_${profileId}`,
    favoritePlans: (profileId) => `ff_favorite_plans_${profileId}`,
    // Alte, nicht profilgebundene Keys - nur für die einmalige Migration bestehender Daten.
    legacyPlans: "ff_plans",
    legacyLogs: "ff_logs",
};
const DEFAULT_SETTINGS = { defaultSets: 3, defaultReps: 10, defaultWeight: 0, defaultPause: 60 };
const DEFAULT_PROFILE_DETAILS = { birthDate: "", heightCm: "", goalWeightKg: "" };
// Umfangsmaße - "Gesäß" wurde zu "Hüfte" korrigiert, da das der gängige Fachbegriff für diesen
// Umfangswert ist (Hüftumfang, z.B. für die Taille-Hüfte-Relation); "Schultern" als sinnvolle Ergänzung.
const MEASUREMENT_FIELDS = [
    { id: "brust", label: "Brust" },
    { id: "schulter", label: "Schultern" },
    { id: "bizeps", label: "Bizeps" },
    { id: "unterarm", label: "Unterarme" },
    { id: "bauch", label: "Bauch / Taille" },
    { id: "huefte", label: "Hüfte" },
    { id: "oberschenkel", label: "Oberschenkel" },
    { id: "wade", label: "Waden" },
];
const DEFAULT_DASHBOARD_CONFIG = {
    showWeight: true,
    showBMI: true,
    showMeasurements: true,
    showEnergy: true,
    visibleMeasurements: MEASUREMENT_FIELDS.map((m) => m.id),
    range: "month",
};
const RANGE_OPTIONS = [
    { id: "week", label: "Woche" },
    { id: "month", label: "Monat" },
    { id: "3months", label: "3 Mon." },
    { id: "6months", label: "6 Mon." },
    { id: "year", label: "1 Jahr" },
    { id: "all", label: "Gesamt" },
];
function filterByRange(items, range, getDate) {
    if (!range || range === "all")
        return items;
    const now = new Date();
    const cutoff = new Date(now);
    if (range === "week")
        cutoff.setDate(now.getDate() - 7);
    else if (range === "month")
        cutoff.setMonth(now.getMonth() - 1);
    else if (range === "3months")
        cutoff.setMonth(now.getMonth() - 3);
    else if (range === "6months")
        cutoff.setMonth(now.getMonth() - 6);
    else if (range === "year")
        cutoff.setFullYear(now.getFullYear() - 1);
    else
        return items;
    return items.filter((it) => new Date(getDate(it)) >= cutoff);
}
const WEEKDAYS = [
    { id: "mo", label: "Mo" },
    { id: "di", label: "Di" },
    { id: "mi", label: "Mi" },
    { id: "do", label: "Do" },
    { id: "fr", label: "Fr" },
    { id: "sa", label: "Sa" },
    { id: "so", label: "So" },
];
const INTERVALS = [
    { id: "weekly", label: "Wöchentlich" },
    { id: "biweekly", label: "Alle 2 Wochen" },
    { id: "triweekly", label: "Alle 3 Wochen" },
    { id: "monthly", label: "Monatlich" },
];
const NAV_ITEMS = [
    { id: "uebersicht", label: "Übersicht", icon: LayoutDashboard },
    { id: "geraete", label: "Geräte", icon: Wrench },
    { id: "uebungen", label: "Übungen", icon: Dumbbell },
    { id: "plaene", label: "Pläne", icon: ClipboardList },
    { id: "tagebuch", label: "Tagebuch", icon: BookOpen },
    { id: "setup", label: "Setup", icon: Settings },
];
/* =========================================================================
   HELPERS
   ========================================================================= */
function uid() {
    return Math.random().toString(36).slice(2, 10);
}
// Wandelt den Wert eines <input type="date"> (immer "YYYY-MM-DD") in ein Date-Objekt in der
// LOKALEN Zeitzone um. new Date("YYYY-MM-DD") würde stattdessen UTC-Mitternacht liefern, was je
// nach Zeitzone/Uhrzeit zu einer Verschiebung um einen Tag führen und Zeitraum-Filter verfälschen kann.
function parseLocalDateInput(dateStr, fallbackTime) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const base = fallbackTime ? new Date(fallbackTime) : new Date();
    return new Date(y, (m || 1) - 1, d || 1, base.getHours(), base.getMinutes(), base.getSeconds());
}
async function loadKey(key, fallback) {
    try {
        const res = await window.storage.get(key, false);
        return res ? JSON.parse(res.value) : fallback;
    }
    catch (e) {
        return fallback;
    }
}
async function saveKey(key, value) {
    try {
        await window.storage.set(key, JSON.stringify(value), false);
    }
    catch (e) {
        console.error("Speicherfehler", key, e);
    }
}
function equipmentNames(ids, list = EQUIPMENT) {
    return ids.map((id) => list.find((e) => e.id === id)?.name || id);
}
function newProfile(name) {
    return { id: "profile-" + uid(), name };
}
function calcAge(birthDateISO) {
    if (!birthDateISO)
        return null;
    const b = new Date(birthDateISO);
    if (isNaN(b.getTime()))
        return null;
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate()))
        age--;
    return age;
}
function calcBMI(weightKg, heightCm) {
    const w = Number(weightKg);
    const h = Number(heightCm);
    if (!w || !h)
        return null;
    const hm = h / 100;
    return w / (hm * hm);
}
function formatDurationMMSS(totalSeconds) {
    const s = Math.max(0, Math.round(Number(totalSeconds) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function formatSetLabel(set, trackingType) {
    if (trackingType === "distance")
        return `${set.distanceKm ?? 0} km`;
    if (trackingType === "duration")
        return `${formatDurationMMSS(set.durationSec)} min`;
    return `${set.reps}×${set.weight}kg`;
}
// Liefert einen sinnvollen MET-Schätzwert (Metabolisches Äquivalent), falls die Übung keinen
// eigenen hinterlegt hat - grobe, aber nachvollziehbare Kategorisierung nach Trainingsart.
function estimateMet(exercise) {
    if (exercise.met)
        return exercise.met;
    if (exercise.trackingType === "distance")
        return 9;
    if (exercise.trackingType === "duration")
        return exercise.muscles?.includes("Core") ? 3.5 : 6;
    if (exercise.bodyweightFactor)
        return 6;
    return 4.5;
}
// Schätzt den kcal-Verbrauch eines einzelnen Satzes. Berücksichtigt je nach Werttyp Strecke,
// Zeit oder Wiederholungen/Gewicht - und immer das aktuelle Körpergewicht, da dieses den
// tatsächlichen Energieverbrauch maßgeblich beeinflusst. Alles nur eine Näherung, keine
// medizinisch exakte Messung.
function calcSetKcal(set, exercise, bodyweightKg) {
    if (!bodyweightKg || !set?.done)
        return 0;
    const met = estimateMet(exercise);
    if (exercise.trackingType === "distance") {
        const factor = exercise.kcalPerKgKm ?? 1.0;
        return (Number(set.distanceKm) || 0) * bodyweightKg * factor;
    }
    if (exercise.trackingType === "duration") {
        const hours = (Number(set.durationSec) || 0) / 3600;
        return met * bodyweightKg * hours;
    }
    const reps = Number(set.reps) || 0;
    const weight = Number(set.weight) || 0;
    const hours = (reps * 3) / 3600; // grobe Annahme: ~3 Sekunden pro Wiederholung
    const intensityBoost = weight > 0 ? 1 + Math.min(1, weight / bodyweightKg) * 0.5 : 1;
    return met * intensityBoost * bodyweightKg * hours;
}
function computeLogKcal(log, allExercises, bodyweightKg) {
    if (!bodyweightKg)
        return 0;
    return log.exercises.reduce((sum, ex) => {
        const meta = allExercises.find((e) => e.id === ex.exerciseId);
        if (!meta)
            return sum;
        return sum + ex.sets.reduce((s, set) => s + calcSetKcal(set, meta, bodyweightKg), 0);
    }, 0);
}
// Errechnet für körpergewichtsbasierte Übungen (z.B. Liegestütze, Klimmzüge) den anteiligen
// Gewichtswert aus dem aktuellen Körpergewicht und trägt ihn in alle betroffenen, noch nicht
// gestarteten Trainingspläne ein. Vergangene Tagebucheinträge bleiben davon unberührt.
function recalcBodyweightExercisesInPlans(plans, allExercises, currentWeightKg) {
    if (!currentWeightKg)
        return plans;
    return plans.map((plan) => ({
        ...plan,
        exercises: plan.exercises.map((row) => {
            const ex = allExercises.find((e) => e.id === row.exerciseId);
            if (!ex?.bodyweightFactor)
                return row;
            return { ...row, weight: Math.round(currentWeightKg * ex.bodyweightFactor * 10) / 10 };
        }),
    }));
}
// Sammelt den gesamten App-Zustand (global + alle Profile) für den Backup-Export.
async function collectBackup(profiles) {
    const [equipment, customEquipment, customExercises, favoriteExercises, favoriteEquipment] = await Promise.all([
        loadKey(STORAGE_KEYS.equipment, []),
        loadKey(STORAGE_KEYS.customEquipment, []),
        loadKey(STORAGE_KEYS.customExercises, []),
        loadKey(STORAGE_KEYS.favoriteExercises, []),
        loadKey(STORAGE_KEYS.favoriteEquipment, []),
    ]);
    const profileData = {};
    for (const p of profiles) {
        const [plans, logs, settings, profileDetails, bodyLog, dashboardConfig, favoritePlans] = await Promise.all([
            loadKey(STORAGE_KEYS.plans(p.id), []),
            loadKey(STORAGE_KEYS.logs(p.id), []),
            loadKey(STORAGE_KEYS.settings(p.id), DEFAULT_SETTINGS),
            loadKey(STORAGE_KEYS.profileDetails(p.id), DEFAULT_PROFILE_DETAILS),
            loadKey(STORAGE_KEYS.bodyLog(p.id), []),
            loadKey(STORAGE_KEYS.dashboardConfig(p.id), DEFAULT_DASHBOARD_CONFIG),
            loadKey(STORAGE_KEYS.favoritePlans(p.id), []),
        ]);
        profileData[p.id] = { plans, logs, settings, profileDetails, bodyLog, dashboardConfig, favoritePlans };
    }
    return {
        version: 3,
        exportedAt: new Date().toISOString(),
        global: { equipment, customEquipment, customExercises, favoriteExercises, favoriteEquipment },
        profiles,
        profileData,
    };
}
// Spielt einen zuvor exportierten Backup-Datensatz vollständig zurück.
async function restoreBackup(backup) {
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
    }
}
function computeLogVolume(log) {
    return log.exercises.reduce((sum, ex) => {
        return sum + ex.sets.filter((s) => s.done).reduce((s2, s) => s2 + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0);
    }, 0);
}
function formatDateShort(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}
function formatDateLong(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}
function startOfWeek(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // Monday = 0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
}
/* =========================================================================
   GLOBAL STYLES
   ========================================================================= */
function GlobalStyles() {
    return (React.createElement("style", null, `
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

      .ff-root {
        --bg: #0a0a0a;
        --bg-card: #121212;
        --bg-card-hover: #171717;
        --border: #262626;
        --border-light: #333333;
        --accent: #d4ff00;
        --accent-dim: rgba(212,255,0,0.12);
        --text: #ffffff;
        --text-dim: #8f8f8f;
        --text-faint: #565656;
        --danger: #ff5c5c;
        --danger-dim: rgba(255,92,92,0.12);
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        width: 100%;
      }
      .ff-root * { box-sizing: border-box; }
      .ff-mono { font-family: 'JetBrains Mono', monospace; }
      .ff-display { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.95; }

      .ff-eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.15em;
        color: var(--text-dim);
        text-transform: uppercase;
        margin: 0 0 6px 0;
      }

      .glitch { position: relative; display: inline-block; color: var(--text); }
      .glitch .gl-a, .glitch .gl-b {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%;
        overflow: hidden; mix-blend-mode: screen;
      }
      .glitch .gl-a { color: #00fff9; transform: translate(-2px,0); opacity: 0.55; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
      .glitch .gl-b { color: #ff00c1; transform: translate(2px,0); opacity: 0.55; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }

      .ff-accent { color: var(--accent); }

      .ff-nav {
        position: sticky; top: 0; z-index: 20;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; padding: 14px 24px;
        background: rgba(10,10,10,0.92); backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border);
        flex-wrap: wrap;
      }
      .ff-logo { display: flex; align-items: center; gap: 10px; }
      .ff-logo-img { width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0; object-fit: cover; }
      .ff-logo-mark {
        width: 34px; height: 34px; border-radius: 8px; background: var(--accent);
        display: flex; align-items: center; justify-content: center; color: #0a0a0a; flex-shrink: 0;
      }
      .ff-logo-word { font-family: 'Anton', sans-serif; font-size: 17px; letter-spacing: 0.01em; white-space: nowrap; }
      .ff-logo-word .hi { color: var(--accent); }
      @media (max-width: 560px) { .ff-logo-word { font-size: 14px; } }

      .ff-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
      .ff-tabs::-webkit-scrollbar { display: none; }
      .ff-tab {
        display: flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: var(--text-dim); background: transparent; border: 1px solid transparent;
        cursor: pointer; white-space: nowrap; transition: all 0.15s ease;
      }
      .ff-tab:hover { color: var(--text); background: var(--bg-card-hover); }
      .ff-tab.active { color: var(--text); background: #1a1a1a; border-color: var(--border-light); }
      .ff-tab.active svg { color: var(--accent); }

      .ff-tag-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-faint); letter-spacing: 0.08em; }

      .ff-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }

      .ff-card {
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px;
      }

      .ff-btn {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
        padding: 11px 18px; border-radius: 8px; border: 1px solid var(--border-light); background: transparent;
        color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
        transition: all 0.15s ease; white-space: nowrap;
      }
      .ff-btn:hover { background: var(--bg-card-hover); border-color: #444; }
      .ff-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .ff-btn-primary { background: var(--accent); border-color: var(--accent); color: #0a0a0a; font-weight: 700; }
      .ff-btn-primary:hover { background: #c2ec00; }
      .ff-btn-danger { border-color: var(--danger); color: var(--danger); }
      .ff-btn-danger:hover { background: var(--danger-dim); }
      .ff-btn-icon { padding: 8px; }
      .ff-btn-sm { padding: 7px 12px; font-size: 11px; }

      .ff-input, .ff-textarea, .ff-numinput {
        width: 100%; background: #0d0d0d; border: 1px solid var(--border); border-radius: 8px;
        color: var(--text); padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 14px;
        outline: none; transition: border-color 0.15s ease;
      }
      .ff-input:focus, .ff-textarea:focus, .ff-numinput:focus { border-color: var(--accent); }
      .ff-input::placeholder, .ff-textarea::placeholder { color: var(--text-faint); }
      .ff-textarea { resize: vertical; min-height: 70px; }
      .ff-numinput { text-align: center; padding: 10px 8px; }

      .ff-input-display {
        width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border);
        color: var(--text); padding: 10px 2px; font-family: 'Anton', sans-serif; text-transform: uppercase;
        font-size: 34px; outline: none; letter-spacing: -0.01em;
      }
      .ff-input-display::placeholder { color: #3a3a3a; }
      .ff-input-display:focus { border-bottom-color: var(--accent); }

      .ff-field-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px; display: block; }

      .ff-tagbtn {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em;
        padding: 8px 13px; border-radius: 20px; border: 1px solid var(--border-light); background: #0d0d0d;
        color: var(--text-dim); cursor: pointer; transition: all 0.15s ease;
      }
      .ff-tagbtn:hover { border-color: #555; }
      .ff-tagbtn.selected { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

      .ff-equip-card {
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 16px;
        cursor: pointer; position: relative; transition: all 0.15s ease;
      }
      .ff-equip-card:hover { border-color: #444; }
      .ff-equip-card.selected { border-color: var(--accent); background: var(--accent-dim); }
      .ff-equip-check {
        position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%;
        background: var(--accent); color: #0a0a0a; display: flex; align-items: center; justify-content: center;
      }

      .ff-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      @media (max-width: 720px) { .ff-stat-grid { grid-template-columns: repeat(2, 1fr); } }

      .ff-empty {
        text-align: center; padding: 60px 20px; color: var(--text-dim);
        border: 1px dashed var(--border-light); border-radius: 12px;
      }

      .ff-modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(3px);
        display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
      }
      .ff-modal {
        background: #0e0e0e; border: 1px solid var(--border-light); border-radius: 14px; padding: 28px;
        max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto;
      }

      .ff-detail-grid { display: grid; grid-template-columns: 200px 1fr; gap: 32px; }
      @media (max-width: 640px) { .ff-detail-grid { grid-template-columns: 1fr; } }

      .ff-checkbox {
        width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--border-light);
        background: #0d0d0d; display: flex; align-items: center; justify-content: center; cursor: pointer;
        flex-shrink: 0; transition: all 0.15s ease;
      }
      .ff-checkbox.checked { background: var(--accent); border-color: var(--accent); color: #0a0a0a; }

      .ff-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .ff-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

      .ff-rest-bar {
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 150;
        background: #0e0e0e; border-top: 1px solid var(--border-light);
        padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        box-shadow: 0 -8px 24px rgba(0,0,0,0.5); overflow: hidden; transition: bottom 0.15s ease;
      }
      .ff-rest-progress {
        position: absolute; top: 0; left: 0; height: 3px; background: var(--accent);
        transition: width 1s linear;
      }
      @keyframes restFlash { 0% { opacity: 0; } 12% { opacity: 0.4; } 100% { opacity: 0; } }
      .ff-flash-overlay {
        position: fixed; inset: 0; background: var(--accent); pointer-events: auto; cursor: pointer;
        z-index: 300; animation: restFlash 1s ease-out forwards;
      }

      .ff-scrolltop {
        position: fixed; right: 20px; bottom: 24px; z-index: 140;
        width: 44px; height: 44px; border-radius: 50%; border: none;
        background: var(--accent); color: #0a0a0a; display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.5); transition: transform 0.15s ease;
      }
      .ff-scrolltop:active { transform: scale(0.92); }
    `));
}
function GlitchTitle({ text, size = 40 }) {
    return (React.createElement("h1", { className: "ff-display glitch", style: { fontSize: size, margin: 0 } },
        text,
        React.createElement("span", { className: "gl-a", "aria-hidden": "true" }, text),
        React.createElement("span", { className: "gl-b", "aria-hidden": "true" }, text)));
}
function ScrollToTopButton() {
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
function DevCredit() {
    return (React.createElement("div", { style: { textAlign: "center", marginTop: 40, marginBottom: 8 } },
        React.createElement("p", { className: "ff-mono", style: { color: "var(--text-faint)", fontSize: 11, margin: 0 } }, "Developed by Michael Schulze"),
        React.createElement("p", { className: "ff-mono", style: { color: "var(--text-faint)", fontSize: 10, margin: 0, marginTop: 2 } },
            "v",
            APP_VERSION)));
}
/* =========================================================================
   SMALL SHARED COMPONENTS
   ========================================================================= */
function StatCard({ label, value, icon: Icon, suffix }) {
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("p", { className: "ff-eyebrow", style: { margin: 0 } }, label),
            React.createElement(Icon, { size: 16, color: "var(--text-faint)" })),
        React.createElement("p", { className: "ff-display", style: { fontSize: 34, marginTop: 10 } },
            value,
            suffix ? React.createElement("span", { style: { fontSize: 16, color: "var(--text-dim)", marginLeft: 4 } }, suffix) : null)));
}
function ConfirmDelete({ onConfirm, label = "Löschen" }) {
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
function FavoriteButton({ active, onToggle, size = 15 }) {
    return (React.createElement("button", { className: "ff-btn ff-btn-icon", title: active ? "Favorit entfernen" : "Zu Favoriten hinzufügen", onClick: (e) => { e.stopPropagation(); onToggle(); }, style: { color: active ? "var(--accent)" : "var(--text-faint)" } },
        React.createElement(Heart, { size: size, fill: active ? "var(--accent)" : "none" })));
}
/* =========================================================================
   DASHBOARD
   ========================================================================= */
const PERIOD_MODES = ["last", "day", "week"];
const PERIOD_MODE_LABELS = { last: "Letztes Workout", day: "Heute", week: "Diese Woche" };
// Wischbare Kachel mit drei Zeit-Modi (Letztes Workout / Heute / Diese Woche).
// Unterstützt Touch-Wischen, Maus-Ziehen (für Desktop-Tests) UND explizite Pfeil-Buttons,
// damit die Funktion unabhängig vom Eingabegerät zuverlässig nutzbar ist.
function SwipeStatCard({ label, icon: Icon, unit, computeValue, formatValue }) {
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
function Dashboard({ logs, plans, allExercises, onGoToPlans, bodyLog, profileDetails, dashboardConfig, onSetRange, currentWeightKg }) {
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
                        React.createElement(Tooltip, { contentStyle: { background: "#0e0e0e", border: "1px solid #333", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "#aaa" } }),
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
                        React.createElement(Tooltip, { contentStyle: { background: "#0e0e0e", border: "1px solid #333", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "#aaa" } }),
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
                        React.createElement(Tooltip, { contentStyle: { background: "#0e0e0e", border: "1px solid #333", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "#aaa" } }),
                        visibleMeasurements.map((id, i) => {
                            const meta = MEASUREMENT_FIELDS.find((m) => m.id === id);
                            return React.createElement(Line, { key: id, type: "monotone", dataKey: id, name: meta?.label || id, stroke: measurementColors[i % measurementColors.length], strokeWidth: 2, dot: { r: 3 }, connectNulls: true });
                        })))))),
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
function AddEquipmentModal({ onClose, onSave }) {
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
function EquipmentView({ equipment, customEquipment, onSave, onAddCustom, onDeleteCustom, favoriteEquipment, onToggleFavoriteEquipment }) {
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
function AddExerciseModal({ allEquipment, onClose, onSave }) {
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
function ExerciseHistoryModal({ exercise, logs, onClose }) {
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
                rows.push({ date: log.date, sets: match.sets, metric });
            }
        });
        return rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [logs, exercise, trackingType]);
    const metricLabel = trackingType === "distance" ? "km" : trackingType === "duration" ? "sek." : "kg";
    const chartData = sessions.filter((s) => s.metric > 0).map((s) => ({ date: formatDateShort(s.date), wert: Math.round(s.metric * 10) / 10 }));
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-eyebrow" }, "Verlauf"),
                    React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, exercise.name)),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            sessions.length === 0 ? (React.createElement("div", { className: "ff-empty" }, "Diese \u00DCbung wurde noch in keinem Training protokolliert.")) : (React.createElement(React.Fragment, null,
                chartData.length > 1 && (React.createElement("div", { style: { width: "100%", height: 180, marginBottom: 20 } },
                    React.createElement(ResponsiveContainer, null,
                        React.createElement(LineChart, { data: chartData, margin: { top: 5, right: 10, left: -20, bottom: 0 } },
                            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                            React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 10, fontFamily: "JetBrains Mono" } }),
                            React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 10, fontFamily: "JetBrains Mono" } }),
                            React.createElement(Tooltip, { contentStyle: { background: "#0e0e0e", border: "1px solid #333", borderRadius: 8, fontSize: 12 } }),
                            React.createElement(Line, { type: "monotone", dataKey: "wert", name: metricLabel, stroke: "#d4ff00", strokeWidth: 2, dot: { r: 3, fill: "#d4ff00" } }))))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [...sessions].reverse().map((s, i) => (React.createElement("div", { key: i, style: { borderBottom: "1px solid var(--border)", paddingBottom: 10 } },
                    React.createElement("p", { className: "ff-tag-note" }, formatDateLong(s.date)),
                    React.createElement("p", { style: { margin: "4px 0 0 0", fontSize: 13 } }, s.sets.filter((st) => st.done).map((st, j) => formatSetLabel(st, trackingType)).join("  ·  ") || "Keine Sätze abgehakt"))))))))));
}
function BodyDiagram({ view, muscles }) {
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
function ExerciseDetailModal({ exercise, allEquipment, logs, onClose, onShowHistory }) {
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
function ExercisesView({ allExercises, allEquipment, ownedEquipment, logs, onAddCustom, favoriteExercises, onToggleFavoriteExercise }) {
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
            if (categoryFilter && !ex.equipment.some((id) => equipmentCategoryById[id] === categoryFilter))
                return false;
            if (onlyAvailable && !ex.equipment.every((id) => ownedSet.has(id)))
                return false;
            if (onlyFavorites && !favoriteSet.has(ex.id))
                return false;
            return true;
        });
    }, [allExercises, search, muscleFilter, categoryFilter, onlyAvailable, onlyFavorites, ownedSet, favoriteSet, equipmentCategoryById]);
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
                    categoryFilter ? `: ${categoryFilter}` : "")),
            categoryFilterOpen && (React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 } },
                React.createElement("button", { className: `ff-tagbtn ${!categoryFilter ? "selected" : ""}`, onClick: () => setCategoryFilter(null) }, "Alle"),
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
function ExercisePickerModal({ allExercises, allEquipment, ownedEquipment, favoriteExercises, onPick, onClose }) {
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
                    return (React.createElement("button", { key: ex.id, onClick: () => onPick(ex), style: { textAlign: "left", background: "#0d0d0d", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" } },
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
function PlanExerciseRow({ row, exercise, onChange, onRemove, onMove, isFirst, isLast }) {
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
function PlanEditor({ plan, allExercises, allEquipment, ownedEquipment, settings, currentWeightKg, favoriteExercises, onSave, onCancel }) {
    const [name, setName] = useState(plan?.name || "");
    const [description, setDescription] = useState(plan?.description || "");
    const [exercises, setExercises] = useState(plan?.exercises || []);
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
function PlansView({ plans, allExercises, allEquipment, ownedEquipment, settings, currentWeightKg, favoriteExercises, favoritePlans, onToggleFavoritePlan, onCreate, onUpdate, onDelete, onClone, onStart }) {
    const [editing, setEditing] = useState(null); // null | plan | "new"
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    if (editing) {
        return (React.createElement(PlanEditor, { plan: editing === "new" ? null : editing, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: ownedEquipment, settings: settings, currentWeightKg: currentWeightKg, favoriteExercises: favoriteExercises, onCancel: () => setEditing(null), onSave: (plan) => {
                editing === "new" ? onCreate(plan) : onUpdate(plan);
                setEditing(null);
            } }));
    }
    const favoriteSet = new Set(favoritePlans || []);
    const visiblePlans = onlyFavorites ? plans.filter((p) => favoriteSet.has(p.id)) : plans;
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 } },
            React.createElement("div", null,
                React.createElement("p", { className: "ff-eyebrow" }, "Konfigurator"),
                React.createElement(GlitchTitle, { text: "Trainingspl\u00E4ne", size: 34 })),
            React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => setEditing("new") },
                React.createElement(Plus, { size: 14 }),
                " Neuer Plan")),
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
                    React.createElement("button", { className: "ff-btn ff-btn-primary", style: { flex: 1, justifyContent: "center" }, onClick: () => onStart(plan) },
                        React.createElement(Play, { size: 13 }),
                        " Starten"))));
        })))));
}
/* =========================================================================
   ACTIVE WORKOUT VIEW
   ========================================================================= */
function DurationTimerCell({ value, onRecord }) {
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        if (!running)
            return;
        const t = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(t);
    }, [running]);
    const start = () => { setElapsed(0); setRunning(true); };
    const stop = () => { setRunning(false); onRecord(elapsed); };
    return (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
        React.createElement("span", { className: "ff-mono", style: { fontSize: 15, color: running ? "var(--accent)" : "var(--text)", minWidth: 44 } }, formatDurationMMSS(running ? elapsed : (value || 0))),
        !running ? (React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: start },
            React.createElement(Play, { size: 12 }),
            " Start")) : (React.createElement("button", { className: "ff-btn ff-btn-sm ff-btn-primary", onClick: stop },
            React.createElement(CircleCheck, { size: 12 }),
            " Stop"))));
}
function ActiveWorkoutView({ workout, allExercises, onFinish, onCancel }) {
    const [exercises, setExercises] = useState(workout.exercises);
    const [note, setNote] = useState("");
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [rest, setRest] = useState(null); // { total, secondsLeft, key }
    const [flash, setFlash] = useState(false);
    const [barBottom, setBarBottom] = useState(0);
    // Countdown: läuft unabhängig vom Flash-Timeout, damit dessen Cleanup
    // (bei Wechsel von rest -> null) nicht versehentlich den Flash-Timer mit-abbricht.
    useEffect(() => {
        if (!rest)
            return;
        if (rest.secondsLeft <= 0) {
            setFlash(true);
            setRest(null);
            return;
        }
        const t = setTimeout(() => setRest((r) => (r ? { ...r, secondsLeft: r.secondsLeft - 1 } : r)), 1000);
        return () => clearTimeout(t);
    }, [rest]);
    // Eigener, entkoppelter Effekt für das grüne Aufleuchten: verschwindet zuverlässig
    // nach ca. 1 Sekunde, unabhängig vom Countdown-Effekt.
    useEffect(() => {
        if (!flash)
            return;
        const t = setTimeout(() => setFlash(false), 1000);
        return () => clearTimeout(t);
    }, [flash]);
    // Pausenbalken an der tatsächlich sichtbaren Bildschirmkante ausrichten (visualViewport),
    // damit er auf Mobilgeräten nicht hinter der Browser-Leiste verschwindet / Scrollen erfordert.
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv)
            return;
        const update = () => {
            const offset = window.innerHeight - (vv.height + vv.offsetTop);
            setBarBottom(Math.max(0, Math.round(offset)));
        };
        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
        };
    }, []);
    const startRest = (seconds) => {
        if (!seconds || seconds <= 0)
            return;
        setRest({ total: seconds, secondsLeft: seconds, key: uid() });
    };
    const skipRest = () => setRest(null);
    const dismissFlash = () => setFlash(false);
    const updateSet = (exIdx, setIdx, field, value) => {
        setExercises((prev) => prev.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s));
            return { ...ex, sets };
        }));
    };
    const toggleDone = (exIdx, setIdx) => {
        const willBeDone = !exercises[exIdx].sets[setIdx].done;
        setExercises((prev) => prev.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, done: !s.done } : s));
            return { ...ex, sets };
        }));
        if (willBeDone)
            startRest(exercises[exIdx].pause);
    };
    // Für Zeit-Übungen: Stoppuhr-Ergebnis übernehmen, Satz direkt als erledigt markieren und Pause starten.
    const completeDurationSet = (exIdx, setIdx, elapsedSeconds) => {
        setExercises((prev) => prev.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, durationSec: elapsedSeconds, done: true } : s));
            return { ...ex, sets };
        }));
        startRest(exercises[exIdx].pause);
    };
    const totalDoneSets = exercises.reduce((s, ex) => s + ex.sets.filter((st) => st.done).length, 0);
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const restProgress = rest ? Math.max(0, (rest.secondsLeft / rest.total) * 100) : 0;
    return (React.createElement("div", { style: { paddingBottom: rest ? 88 : 0 } },
        flash && React.createElement("div", { className: "ff-flash-overlay", onClick: dismissFlash }),
        React.createElement("p", { className: "ff-eyebrow" }, "Training l\u00E4uft"),
        React.createElement(GlitchTitle, { text: workout.planName, size: 34 }),
        React.createElement("div", { style: { marginTop: 16, maxWidth: 220 } },
            React.createElement("label", { className: "ff-field-label" }, "Datum (f\u00FCr nachtr\u00E4gliche Eintr\u00E4ge anpassbar)"),
            React.createElement("input", { type: "date", className: "ff-input", max: new Date().toISOString().slice(0, 10), value: logDate, onChange: (e) => setLogDate(e.target.value) })),
        React.createElement("div", { style: { marginTop: 22, display: "flex", flexDirection: "column", gap: 14 } }, exercises.map((ex, exIdx) => {
            const meta = allExercises.find((e) => e.id === ex.exerciseId);
            const trackingType = ex.trackingType || meta?.trackingType || "strength";
            return (React.createElement("div", { key: ex.exerciseId + exIdx, className: "ff-card" },
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 17 } }, ex.exerciseName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } },
                    (meta?.muscles || []).join(" · "),
                    " \u00B7 Pause ",
                    ex.pause,
                    "s"),
                React.createElement("div", { style: { marginTop: 14, display: "flex", flexDirection: "column", gap: 8 } }, trackingType === "distance" ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Einheit"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Strecke (km)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement("input", { className: "ff-numinput", type: "number", step: "0.1", value: s.distanceKm ?? "", onChange: (e) => updateSet(exIdx, setIdx, "distanceKm", e.target.value) })))))) : trackingType === "duration" ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1.4fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Satz"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Zeit (Stoppuhr)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1.4fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement(DurationTimerCell, { value: s.durationSec, onRecord: (secs) => completeDurationSet(exIdx, setIdx, secs) })))))) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("span", null),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Satz"),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Wdh."),
                        React.createElement("span", { className: "ff-field-label", style: { marginBottom: 0 } }, "Gewicht (kg)")),
                    ex.sets.map((s, setIdx) => (React.createElement("div", { key: setIdx, style: { display: "grid", gridTemplateColumns: "28px 1fr 1fr 1fr", gap: 8, alignItems: "center" } },
                        React.createElement("div", { className: `ff-checkbox ${s.done ? "checked" : ""}`, onClick: () => toggleDone(exIdx, setIdx) }, s.done && React.createElement(Check, { size: 14 })),
                        React.createElement("span", { className: "ff-mono", style: { fontSize: 13, color: "var(--text-dim)" } },
                            "#",
                            setIdx + 1),
                        React.createElement("input", { className: "ff-numinput", type: "number", value: s.reps, onChange: (e) => updateSet(exIdx, setIdx, "reps", e.target.value) }),
                        React.createElement("input", { className: "ff-numinput", type: "number", value: s.weight, onChange: (e) => updateSet(exIdx, setIdx, "weight", e.target.value) })))))))));
        })),
        React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("label", { className: "ff-field-label" }, "Notiz zum Training (optional)"),
            React.createElement("textarea", { className: "ff-textarea", placeholder: "z.B. F\u00FChlte sich stark an, n\u00E4chstes Mal mehr Gewicht...", value: note, onChange: (e) => setNote(e.target.value) })),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, borderTop: "1px solid var(--border)", paddingTop: 20 } },
            React.createElement("span", { className: "ff-mono", style: { fontSize: 12, color: "var(--text-dim)" } },
                totalDoneSets,
                " S\u00E4tze abgehakt"),
            React.createElement("div", { style: { display: "flex", gap: 10 } },
                React.createElement("button", { className: "ff-btn ff-btn-danger", onClick: onCancel }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => onFinish(exercises, note, logDate) },
                    React.createElement(CircleCheck, { size: 15 }),
                    " Training abschlie\u00DFen"))),
        rest && (React.createElement("div", { className: "ff-rest-bar", style: { bottom: barBottom } },
            React.createElement("div", { className: "ff-rest-progress", style: { width: `${restProgress}%` } }),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                React.createElement(Clock, { size: 18, color: "var(--accent)" }),
                React.createElement("div", null,
                    React.createElement("p", { className: "ff-eyebrow", style: { margin: 0 } }, "Pause"),
                    React.createElement("p", { className: "ff-display", style: { fontSize: 26, margin: 0 } }, formatTime(rest.secondsLeft)))),
            React.createElement("button", { className: "ff-btn", onClick: skipRest }, "\u00DCberspringen")))));
}
/* =========================================================================
   DIARY VIEW
   ========================================================================= */
function DiaryEntry({ log, onDelete, onEditDate }) {
    const [open, setOpen] = useState(false);
    const [editingDate, setEditingDate] = useState(false);
    const [dateValue, setDateValue] = useState(log.date.slice(0, 10));
    const volume = computeLogVolume(log);
    const commitDate = () => {
        if (dateValue) {
            const next = parseLocalDateInput(dateValue, log.date);
            onEditDate(log.id, next.toISOString());
        }
        setEditingDate(false);
    };
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", { style: { cursor: "pointer", flex: 1 }, onClick: () => setOpen((v) => !v) },
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, log.planName),
                editingDate ? (React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 6 }, onClick: (e) => e.stopPropagation() },
                    React.createElement("input", { type: "date", className: "ff-input", style: { padding: "6px 10px", fontSize: 12, maxWidth: 160 }, max: new Date().toISOString().slice(0, 10), value: dateValue, onChange: (e) => setDateValue(e.target.value), autoFocus: true }),
                    React.createElement("button", { className: "ff-btn ff-btn-sm", onClick: commitDate },
                        React.createElement(Check, { size: 12 })))) : (React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3, display: "flex", alignItems: "center", gap: 6 } },
                    formatDateLong(log.date),
                    " \u00B7 ",
                    log.durationMin,
                    " min",
                    React.createElement("button", { className: "ff-btn ff-btn-icon", style: { padding: 2 }, onClick: (e) => { e.stopPropagation(); setEditingDate(true); }, title: "Datum \u00E4ndern" },
                        React.createElement(Settings, { size: 11 }))))),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                React.createElement("span", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13 } },
                    volume.toLocaleString("de-DE"),
                    " kg"),
                React.createElement(ConfirmDelete, { onConfirm: () => onDelete(log.id) }),
                React.createElement(ChevronDown, { size: 16, style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease", color: "var(--text-faint)", cursor: "pointer" }, onClick: () => setOpen((v) => !v) }))),
        open && (React.createElement("div", { style: { marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 } },
            log.exercises.map((ex, i) => (React.createElement("div", { key: i },
                React.createElement("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 } }, ex.exerciseName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, ex.sets.map((s, j) => `${s.done ? "✓" : "—"} ${formatSetLabel(s, ex.trackingType)}`).join("   "))))),
            log.note && (React.createElement("div", { style: { marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border)" } },
                React.createElement("p", { className: "ff-field-label" }, "Notiz"),
                React.createElement("p", { style: { margin: 0, fontSize: 13, color: "var(--text-dim)" } }, log.note)))))));
}
function BodyLogModal({ entry, onClose, onSave }) {
    const [date, setDate] = useState(entry?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
    const [weight, setWeight] = useState(entry?.weightKg ?? "");
    const [measurements, setMeasurements] = useState(entry?.measurements || {});
    const setM = (id) => (e) => setMeasurements((prev) => ({ ...prev, [id]: e.target.value }));
    const handleSave = () => {
        onSave({
            id: entry?.id || uid(),
            date: parseLocalDateInput(date, entry?.date).toISOString(),
            weightKg: weight === "" ? null : Number(weight),
            measurements: Object.fromEntries(Object.entries(measurements).filter(([, v]) => v !== "" && v !== null && v !== undefined).map(([k, v]) => [k, Number(v)])),
        });
    };
    return (React.createElement("div", { className: "ff-modal-backdrop", onClick: onClose },
        React.createElement("div", { className: "ff-modal ff-scrollbar", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 24, margin: 0 } }, entry ? "Eintrag bearbeiten" : "Körpermaße erfassen"),
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onClose },
                    React.createElement(X, { size: 18 }))),
            React.createElement("label", { className: "ff-field-label" }, "Datum"),
            React.createElement("input", { type: "date", className: "ff-input", max: new Date().toISOString().slice(0, 10), value: date, onChange: (e) => setDate(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 16 } }, "Gewicht (kg)"),
            React.createElement("input", { type: "number", step: "0.1", className: "ff-input", placeholder: "z.B. 78.5", value: weight, onChange: (e) => setWeight(e.target.value) }),
            React.createElement("label", { className: "ff-field-label", style: { marginTop: 16 } }, "Umfangsma\u00DFe (cm, optional)"),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 } }, MEASUREMENT_FIELDS.map((m) => (React.createElement("div", { key: m.id },
                React.createElement("label", { className: "ff-field-label" }, m.label),
                React.createElement("input", { type: "number", step: "0.1", className: "ff-numinput", value: measurements[m.id] ?? "", onChange: setM(m.id) }))))),
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 26 } },
                React.createElement("button", { className: "ff-btn", onClick: onClose }, "Abbrechen"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: handleSave },
                    React.createElement(Check, { size: 14 }),
                    " Speichern")))));
}
function BodyLogEntry({ entry, heightCm, onDelete, onEdit }) {
    const bmi = calcBMI(entry.weightKg, heightCm);
    const activeMeasurements = MEASUREMENT_FIELDS.filter((m) => entry.measurements?.[m.id] != null);
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("div", null,
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, formatDateLong(entry.date)),
                React.createElement("p", { className: "ff-mono", style: { marginTop: 4, fontSize: 13, color: "var(--accent)" } },
                    entry.weightKg != null ? `${entry.weightKg} kg` : "—",
                    bmi ? ` · BMI ${bmi.toFixed(1)}` : "")),
            React.createElement("div", { style: { display: "flex", gap: 6 } },
                React.createElement("button", { className: "ff-btn ff-btn-icon", onClick: onEdit, title: "Bearbeiten" },
                    React.createElement(Settings, { size: 14 })),
                React.createElement(ConfirmDelete, { onConfirm: onDelete }))),
        activeMeasurements.length > 0 && (React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 } }, activeMeasurements.map((m) => (React.createElement("span", { key: m.id, className: "ff-tag-note", style: { padding: "3px 8px", border: "1px solid var(--border)", borderRadius: 12 } },
            m.label,
            ": ",
            entry.measurements[m.id],
            " cm")))))));
}
function DiaryView({ logs, onDelete, onEditDate, onGoToPlans, bodyLog, heightCm, onAddBodyEntry, onUpdateBodyEntry, onDeleteBodyEntry }) {
    const [mode, setMode] = useState("workouts");
    const [showBodyModal, setShowBodyModal] = useState(false);
    const [editingBodyEntry, setEditingBodyEntry] = useState(null);
    const sorted = useMemo(() => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)), [logs]);
    const sortedBody = useMemo(() => [...bodyLog].sort((a, b) => new Date(b.date) - new Date(a.date)), [bodyLog]);
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Verlauf"),
        React.createElement(GlitchTitle, { text: "Tagebuch", size: 34 }),
        React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" } },
            React.createElement("div", { style: { display: "flex", gap: 8 } },
                React.createElement("button", { className: `ff-tagbtn ${mode === "workouts" ? "selected" : ""}`, onClick: () => setMode("workouts") }, "Workouts"),
                React.createElement("button", { className: `ff-tagbtn ${mode === "body" ? "selected" : ""}`, onClick: () => setMode("body") }, "K\u00F6rperverlauf")),
            mode === "body" && (React.createElement("button", { className: "ff-btn ff-btn-primary ff-btn-sm", onClick: () => { setEditingBodyEntry(null); setShowBodyModal(true); } },
                React.createElement(Plus, { size: 13 }),
                " Eintrag"))),
        mode === "workouts" ? (sorted.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Noch keine Eintr\u00E4ge im Tagebuch."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: onGoToPlans },
                React.createElement(Play, { size: 14 }),
                " Training starten"))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 22 } }, sorted.map((log) => React.createElement(DiaryEntry, { key: log.id, log: log, onDelete: onDelete, onEditDate: onEditDate }))))) : (sortedBody.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Noch keine K\u00F6rperma\u00DFe erfasst."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: () => setShowBodyModal(true) },
                React.createElement(Plus, { size: 14 }),
                " Ersten Eintrag erfassen"))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 22 } }, sortedBody.map((entry) => (React.createElement(BodyLogEntry, { key: entry.id, entry: entry, heightCm: heightCm, onDelete: () => onDeleteBodyEntry(entry.id), onEdit: () => { setEditingBodyEntry(entry); setShowBodyModal(true); } })))))),
        showBodyModal && (React.createElement(BodyLogModal, { entry: editingBodyEntry, onClose: () => setShowBodyModal(false), onSave: (entry) => {
                editingBodyEntry ? onUpdateBodyEntry(entry) : onAddBodyEntry(entry);
                setShowBodyModal(false);
            } }))));
}
function ProfileRow({ profile, isActive, onRename, onDelete, onSwitch, canDelete }) {
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
function SettingsView({ settings, onSaveSettings, profiles, activeProfileId, onCreateProfile, onRenameProfile, onDeleteProfile, onSwitchProfile, onExportBackup, onImportBackup, profileDetails, onSaveProfileDetails, dashboardConfig, onSaveDashboardConfig, }) {
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
                        React.createElement("span", { style: { fontSize: 14 } }, "Umfangsma\u00DFe anzeigen"))),
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
        React.createElement(DevCredit, null)));
}
/* =========================================================================
   APP ROOT
   ========================================================================= */
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
    // Initiales Laden: globale Daten + Profile, inkl. einmaliger Migration alter,
    // nicht profilgebundener Trainingspläne/Tagebücher in ein Standardprofil.
    useEffect(() => {
        (async () => {
            const [eq, ceq, ce, favEx, favEq, existingProfiles] = await Promise.all([
                loadKey(STORAGE_KEYS.equipment, []),
                loadKey(STORAGE_KEYS.customEquipment, []),
                loadKey(STORAGE_KEYS.customExercises, []),
                loadKey(STORAGE_KEYS.favoriteExercises, []),
                loadKey(STORAGE_KEYS.favoriteEquipment, []),
                loadKey(STORAGE_KEYS.profiles, null),
            ]);
            setEquipment(eq);
            setCustomEquipment(ceq);
            setCustomExercises(ce);
            setFavoriteExercises(favEx);
            setFavoriteEquipment(favEq);
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
            }
            let activeId = await loadKey(STORAGE_KEYS.activeProfile, null);
            if (!activeId || !profileList.some((p) => p.id === activeId)) {
                activeId = profileList[0].id;
                await saveKey(STORAGE_KEYS.activeProfile, activeId);
            }
            const [pl, lg, st, pd, bl, dc, fp] = await Promise.all([
                loadKey(STORAGE_KEYS.plans(activeId), []),
                loadKey(STORAGE_KEYS.logs(activeId), []),
                loadKey(STORAGE_KEYS.settings(activeId), DEFAULT_SETTINGS),
                loadKey(STORAGE_KEYS.profileDetails(activeId), DEFAULT_PROFILE_DETAILS),
                loadKey(STORAGE_KEYS.bodyLog(activeId), []),
                loadKey(STORAGE_KEYS.dashboardConfig(activeId), DEFAULT_DASHBOARD_CONFIG),
                loadKey(STORAGE_KEYS.favoritePlans(activeId), []),
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
    const handleStartWorkout = (plan) => {
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
        setActiveWorkout({ planId: plan.id, planName: plan.name, exercises, startedAt: Date.now() });
    };
    // logDate erlaubt das rückwirkende Anlegen eines Trainings mit einem frei wählbaren Datum;
    // die Trainingsdauer wird trotzdem aus der tatsächlich verstrichenen Zeit berechnet.
    const handleFinishWorkout = (exercises, note, logDate) => {
        const durationMin = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
        const chosenDate = logDate ? parseLocalDateInput(logDate) : new Date();
        const log = {
            id: uid(),
            planId: activeWorkout.planId,
            planName: activeWorkout.planName,
            date: chosenDate.toISOString(),
            durationMin,
            note: note.trim(),
            exercises,
        };
        persistLogs([...logs, log]);
        setActiveWorkout(null);
        setTab("tagebuch");
    };
    const handleDeleteLog = (id) => persistLogs(logs.filter((l) => l.id !== id));
    const handleEditLogDate = (id, newDateISO) => persistLogs(logs.map((l) => (l.id === id ? { ...l, date: newDateISO } : l)));
    // --- Profile ---
    const switchProfile = async (id) => {
        if (id === activeProfileId)
            return;
        setReady(false);
        const [pl, lg, st, pd, bl, dc, fp] = await Promise.all([
            loadKey(STORAGE_KEYS.plans(id), []),
            loadKey(STORAGE_KEYS.logs(id), []),
            loadKey(STORAGE_KEYS.settings(id), DEFAULT_SETTINGS),
            loadKey(STORAGE_KEYS.profileDetails(id), DEFAULT_PROFILE_DETAILS),
            loadKey(STORAGE_KEYS.bodyLog(id), []),
            loadKey(STORAGE_KEYS.dashboardConfig(id), DEFAULT_DASHBOARD_CONFIG),
            loadKey(STORAGE_KEYS.favoritePlans(id), []),
        ]);
        setActiveProfileId(id);
        setPlans(pl);
        setLogs(lg);
        setSettings(st);
        setProfileDetails(pd);
        setBodyLog(bl);
        setDashboardConfig(dc);
        setFavoritePlans(fp);
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
        return (React.createElement("div", { className: "ff-root", style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" } },
            React.createElement(GlobalStyles, null),
            React.createElement("p", { className: "ff-mono", style: { color: "var(--text-dim)" } }, "Lade Bernds Body App...")));
    }
    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    return (React.createElement("div", { className: "ff-root" },
        React.createElement(GlobalStyles, null),
        React.createElement("style", null, `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`),
        React.createElement("div", { className: "ff-nav" },
            React.createElement("div", { className: "ff-logo" },
                React.createElement("img", { src: LOGO_DATA_URL, alt: "Logo", className: "ff-logo-img" }),
                React.createElement("span", { className: "ff-logo-word" },
                    "BERNDS ",
                    React.createElement("span", { className: "hi" }, "BODY"),
                    " APP")),
            !activeWorkout && (React.createElement("div", { className: "ff-tabs" }, NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (React.createElement("button", { key: item.id, className: `ff-tab ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id) },
                    React.createElement(Icon, { size: 14 }),
                    " ",
                    item.label));
            }))),
            !activeWorkout && profiles.length > 0 && (React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 5 } },
                React.createElement(Users, { size: 12 }),
                " ",
                activeProfile?.name)),
            activeWorkout && React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)" } }, "\u25CF AKTIVES TRAINING")),
        React.createElement("div", { className: "ff-main" },
            !activeWorkout && React.createElement(ScrollToTopButton, null),
            activeWorkout ? (React.createElement(ActiveWorkoutView, { workout: activeWorkout, allExercises: allExercises, onFinish: handleFinishWorkout, onCancel: () => setActiveWorkout(null) })) : (React.createElement(React.Fragment, null,
                tab === "uebersicht" && (React.createElement(Dashboard, { logs: logs, plans: plans, allExercises: allExercises, onGoToPlans: () => setTab("plaene"), bodyLog: bodyLog, profileDetails: profileDetails, dashboardConfig: dashboardConfig, onSetRange: (range) => persistDashboardConfig({ ...dashboardConfig, range }), currentWeightKg: currentWeightKg })),
                tab === "geraete" && (React.createElement(EquipmentView, { equipment: equipment, customEquipment: customEquipment, onSave: persistEquipment, onAddCustom: handleAddCustomEquipment, onDeleteCustom: handleDeleteCustomEquipment, favoriteEquipment: favoriteEquipment, onToggleFavoriteEquipment: handleToggleFavoriteEquipment })),
                tab === "uebungen" && (React.createElement(ExercisesView, { allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, logs: logs, onAddCustom: handleAddCustomExercise, favoriteExercises: favoriteExercises, onToggleFavoriteExercise: handleToggleFavoriteExercise })),
                tab === "plaene" && (React.createElement(PlansView, { plans: plans, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, settings: settings, currentWeightKg: currentWeightKg, favoriteExercises: favoriteExercises, favoritePlans: favoritePlans, onToggleFavoritePlan: handleToggleFavoritePlan, onCreate: handleCreatePlan, onUpdate: handleUpdatePlan, onDelete: handleDeletePlan, onClone: handleClonePlan, onStart: handleStartWorkout })),
                tab === "tagebuch" && (React.createElement(DiaryView, { logs: logs, onDelete: handleDeleteLog, onEditDate: handleEditLogDate, onGoToPlans: () => setTab("plaene"), bodyLog: bodyLog, heightCm: profileDetails?.heightCm, onAddBodyEntry: handleAddBodyEntry, onUpdateBodyEntry: handleUpdateBodyEntry, onDeleteBodyEntry: handleDeleteBodyEntry })),
                tab === "setup" && (React.createElement(SettingsView, { settings: settings, onSaveSettings: persistSettings, profiles: profiles, activeProfileId: activeProfileId, onCreateProfile: handleCreateProfile, onRenameProfile: handleRenameProfile, onDeleteProfile: handleDeleteProfile, onSwitchProfile: switchProfile, onExportBackup: handleExportBackup, onImportBackup: handleImportBackup, profileDetails: profileDetails, onSaveProfileDetails: persistProfileDetails, dashboardConfig: dashboardConfig, onSaveDashboardConfig: persistDashboardConfig })))))));
}
/* =========================================================================
   STANDALONE MOUNT (nicht Teil des Claude.ai-Artifacts)
   ========================================================================= */
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(React.createElement(App, null));

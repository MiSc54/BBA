import React, { useState, useEffect, useMemo, useCallback } from "https://esm.sh/react@18.3.1";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "https://esm.sh/recharts@2.12.7?deps=react@18.3.1,react-dom@18.3.1";
import { LayoutDashboard, Wrench, Dumbbell, ClipboardList, BookOpen, Plus, Trash2, Check, ChevronUp, ChevronDown, Sparkles, Play, Clock, Flame, TrendingUp, X, Search, Loader2, History, ChevronRight, CircleCheck, } from "https://esm.sh/lucide-react@0.383.0?deps=react@18.3.1";
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
const MUSCLE_GROUPS = ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps", "Unterarme", "Quadrizeps", "Beinbizeps", "Waden", "Gesäß", "Core", "Cardio", "Ganzkörper"];
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
        id: "klimmzuege", name: "Klimmzüge", equipment: ["klimmzugstange"], muscles: ["Rücken", "Bizeps", "Unterarme"],
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
        id: "liegestuetz", name: "Liegestütze", equipment: ["eigengewicht"], muscles: ["Brust", "Trizeps", "Core"],
        description: "Effektive Bodyweight-Übung für Brust, Trizeps und Rumpfstabilität - überall durchführbar.",
        executionSteps: ["Hände etwas breiter als schulterbreit auf dem Boden platzieren.", "Körper von Kopf bis Ferse in einer Linie halten.", "Kontrolliert absenken, bis die Brust fast den Boden berührt.", "Kraftvoll zurück in die Ausgangsposition drücken."],
        commonMistakes: ["Hüfte sackt durch oder wird zu hoch gedrückt.", "Ellbogen zeigen komplett zur Seite.", "Bewegungsradius zu klein."],
    },
    {
        id: "plank", name: "Plank", equipment: ["eigengewicht"], muscles: ["Core"],
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
        id: "laufen", name: "Laufen", equipment: ["laufband"], muscles: ["Cardio"],
        description: "Grundlegendes Ausdauertraining für Herz-Kreislauf-System und Kondition.",
        executionSteps: ["Moderates Tempo wählen, aufrecht laufen.", "Arme locker im Rhythmus mitschwingen.", "Gleichmäßig und tief atmen.", "Tempo und Steigung nach Trainingsziel anpassen."],
        commonMistakes: ["Zu schnell starten und früh ermüden.", "Verkrampfte Schultern und Arme.", "Zu kurze, hastige Schritte."],
    },
    {
        id: "rudern-ergo", name: "Rudern (Ergometer)", equipment: ["rudergeraet"], muscles: ["Cardio", "Rücken"],
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
        id: "beinstrecker-ex", name: "Beinstrecker", equipment: ["beinstrecker"], muscles: ["Quadrizeps"],
        description: "Isolationsübung, die gezielt den vorderen Oberschenkel (Quadrizeps) trainiert.",
        executionSteps: ["Rückenlehne so einstellen, dass die Knie mit dem Drehpunkt der Maschine übereinstimmen.", "Schienbeinpolster liegt oberhalb der Fußgelenke an.", "Beine kontrolliert nach vorne strecken.", "Langsam wieder in die Ausgangsposition absenken."],
        commonMistakes: ["Bewegung wird ruckartig statt kontrolliert ausgeführt.", "Gesäß hebt vom Sitz ab.", "Knie werden am oberen Punkt überstreckt."],
    },
    {
        id: "beinbeuger-ex", name: "Beinbeuger", equipment: ["beinbeuger"], muscles: ["Beinbizeps"],
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
        id: "dips", name: "Dips", equipment: ["dip-barren"], muscles: ["Trizeps", "Brust"],
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
        id: "crosstrainer-ex", name: "Crosstrainer", equipment: ["crosstrainer"], muscles: ["Cardio"],
        description: "Gelenkschonendes Ganzkörper-Cardiotraining für Ausdauer und Fettverbrennung.",
        executionSteps: ["Aufrecht stehen, Griffe locker greifen oder frei bewegen.", "Gleichmäßiges Tempo im gesamten Bewegungsradius wählen.", "Beine und Arme koordiniert mitbewegen lassen.", "Widerstand und Tempo nach Trainingsziel steigern."],
        commonMistakes: ["Sich zu stark auf die Griffe abstützen.", "Zu kurzer, abgehackter Bewegungsradius.", "Oberkörper sackt nach vorne."],
    },
    {
        id: "spinning-ex", name: "Spinning", equipment: ["spinning-bike"], muscles: ["Cardio", "Quadrizeps"],
        description: "Intensives Radtraining für Ausdauer und Beinkraft.",
        executionSteps: ["Sattelhöhe so einstellen, dass das Knie im tiefsten Punkt leicht gebeugt bleibt.", "Aufrechte, stabile Oberkörperhaltung einnehmen.", "Gleichmäßig in den Pedalen treten, Widerstand nach Intervall anpassen.", "Bei Sprints kurzzeitig aus dem Sattel gehen, wenn gewünscht."],
        commonMistakes: ["Sattel zu niedrig eingestellt, belastet die Knie.", "Oberkörper kippt zu weit nach vorne.", "Zu hoher Widerstand bei niedriger Trittfrequenz."],
    },
    {
        id: "seilspringen", name: "Seilspringen", equipment: ["sprungseil"], muscles: ["Cardio", "Waden"],
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
        id: "battle-ropes-waves", name: "Battle Ropes Wellen", equipment: ["battle-ropes"], muscles: ["Schultern", "Cardio", "Core"],
        description: "Hochintensives Intervalltraining für Schultern, Arme und Rumpf.",
        executionSteps: ["Hüftbreiter Stand, Knie leicht gebeugt, ein Seilende in jeder Hand.", "Core fest anspannen.", "Arme abwechselnd kraftvoll auf und ab bewegen, sodass Wellen entstehen.", "Gleichmäßigen Rhythmus über die geplante Intervalldauer halten."],
        commonMistakes: ["Rücken rundet sich während der Bewegung.", "Bewegung kommt nur aus den Handgelenken statt den Schultern.", "Zu hohes Tempo führt zu unsauberer Ausführung."],
    },
];
const STORAGE_KEYS = {
    equipment: "ff_equipment",
    customEquipment: "ff_custom_equipment",
    customExercises: "ff_custom_exercises",
    plans: "ff_plans",
    logs: "ff_logs",
};
const NAV_ITEMS = [
    { id: "uebersicht", label: "Übersicht", icon: LayoutDashboard },
    { id: "geraete", label: "Geräte", icon: Wrench },
    { id: "uebungen", label: "Übungen", icon: Dumbbell },
    { id: "plaene", label: "Pläne", icon: ClipboardList },
    { id: "tagebuch", label: "Tagebuch", icon: BookOpen },
];
/* =========================================================================
   HELPERS
   ========================================================================= */
function uid() {
    return Math.random().toString(36).slice(2, 10);
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
    `));
}
function GlitchTitle({ text, size = 40 }) {
    return (React.createElement("h1", { className: "ff-display glitch", style: { fontSize: size, margin: 0 } },
        text,
        React.createElement("span", { className: "gl-a", "aria-hidden": "true" }, text),
        React.createElement("span", { className: "gl-b", "aria-hidden": "true" }, text)));
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
/* =========================================================================
   DASHBOARD
   ========================================================================= */
function Dashboard({ logs, plans, onGoToPlans }) {
    const stats = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now);
        const total = logs.length;
        const thisWeek = logs.filter((l) => new Date(l.date) >= weekStart).length;
        const totalVolume = logs.reduce((s, l) => s + computeLogVolume(l), 0);
        const totalTime = logs.reduce((s, l) => s + (l.durationMin || 0), 0);
        return { total, thisWeek, totalVolume, totalTime };
    }, [logs]);
    const chartData = useMemo(() => {
        return [...logs]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((l) => ({ date: formatDateShort(l.date), volume: computeLogVolume(l) }));
    }, [logs]);
    const recent = useMemo(() => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3), [logs]);
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Willkommen zur\u00FCck"),
        React.createElement(GlitchTitle, { text: "Deine Trainings-Zentrale", size: 38 }),
        React.createElement("div", { className: "ff-stat-grid", style: { marginTop: 28 } },
            React.createElement(StatCard, { label: "Workouts Total", value: stats.total, icon: Dumbbell }),
            React.createElement(StatCard, { label: "Diese Woche", value: stats.thisWeek, icon: Flame }),
            React.createElement(StatCard, { label: "Gesamtvolumen (kg)", value: stats.totalVolume.toLocaleString("de-DE"), icon: TrendingUp }),
            React.createElement(StatCard, { label: "Trainingszeit (min)", value: stats.totalTime, icon: Clock })),
        React.createElement("div", { className: "ff-card", style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Progression"),
            React.createElement("p", { className: "ff-display", style: { fontSize: 22, marginTop: 2, marginBottom: 18 } }, "Volumen \u00FCber Zeit"),
            chartData.length === 0 ? (React.createElement("div", { className: "ff-empty" },
                React.createElement("p", null, "Noch keine Workouts protokolliert."),
                React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: onGoToPlans },
                    React.createElement(Play, { size: 14 }),
                    " Erstes Training starten"))) : (React.createElement("div", { style: { width: "100%", height: 260 } },
                React.createElement(ResponsiveContainer, null,
                    React.createElement(LineChart, { data: chartData, margin: { top: 10, right: 10, left: -10, bottom: 0 } },
                        React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#222", vertical: false }),
                        React.createElement(XAxis, { dataKey: "date", stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(YAxis, { stroke: "#666", tick: { fontSize: 11, fontFamily: "JetBrains Mono" } }),
                        React.createElement(Tooltip, { contentStyle: { background: "#0e0e0e", border: "1px solid #333", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }, labelStyle: { color: "#aaa" } }),
                        React.createElement(Line, { type: "monotone", dataKey: "volume", stroke: "#d4ff00", strokeWidth: 2, dot: { r: 4, fill: "#d4ff00" }, activeDot: { r: 6 } })))))),
        recent.length > 0 && (React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("p", { className: "ff-eyebrow" }, "Letzte Workouts"),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 } }, recent.map((l) => (React.createElement("div", { key: l.id, className: "ff-card", style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 } },
                React.createElement("div", null,
                    React.createElement("p", { style: { margin: 0, fontWeight: 600 } }, l.planName),
                    React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, formatDateLong(l.date))),
                React.createElement("p", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13 } },
                    computeLogVolume(l).toLocaleString("de-DE"),
                    " kg")))))))));
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
function EquipmentView({ equipment, customEquipment, onSave, onAddCustom, onDeleteCustom }) {
    const [selected, setSelected] = useState(new Set(equipment));
    const [dirty, setDirty] = useState(false);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    useEffect(() => { setSelected(new Set(equipment)); setDirty(false); }, [equipment]);
    const allEquipment = useMemo(() => [...EQUIPMENT, ...customEquipment], [customEquipment]);
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
            .forEach((e) => {
            if (!map[e.category])
                map[e.category] = [];
            map[e.category].push(e);
        });
        return map;
    }, [allEquipment, search]);
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
            React.createElement("button", { className: "ff-btn", onClick: () => setShowAdd(true) },
                React.createElement(Plus, { size: 14 }),
                " Eigenes Ger\u00E4t")),
        [...EQUIPMENT_CATEGORY_ORDER, ...customCategories].map((cat) => (grouped[cat] ? (React.createElement("div", { key: cat, style: { marginTop: 28 } },
            React.createElement("p", { className: "ff-eyebrow" }, cat),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 10 } }, grouped[cat].map((eq) => (React.createElement("div", { key: eq.id, className: `ff-equip-card ${selected.has(eq.id) ? "selected" : ""}`, onClick: () => toggle(eq.id) },
                selected.has(eq.id) && React.createElement("div", { className: "ff-equip-check" },
                    React.createElement(Check, { size: 12 })),
                eq.custom && (React.createElement("button", { className: "ff-btn ff-btn-icon", style: { position: "absolute", bottom: 8, right: 8, padding: 5, color: "var(--text-faint)" }, onClick: (e) => { e.stopPropagation(); onDeleteCustom(eq.id); }, title: "Eigenes Ger\u00E4t l\u00F6schen" },
                    React.createElement(Trash2, { size: 12 }))),
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 15, paddingRight: eq.custom ? 20 : 0 } }, eq.name),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 4 } }, eq.custom ? "Eigenes Gerät" : eq.category))))))) : null)),
        search && Object.keys(grouped).length === 0 && (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } }, "Kein Ger\u00E4t gefunden.")),
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
    const sessions = useMemo(() => {
        const rows = [];
        logs.forEach((log) => {
            const match = log.exercises.find((e) => e.exerciseId === exercise.id);
            if (match) {
                const doneSets = match.sets.filter((s) => s.done && Number(s.weight) > 0);
                const maxWeight = doneSets.reduce((m, s) => Math.max(m, Number(s.weight)), 0);
                rows.push({ date: log.date, sets: match.sets, maxWeight });
            }
        });
        return rows.sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [logs, exercise]);
    const chartData = sessions.filter((s) => s.maxWeight > 0).map((s) => ({ date: formatDateShort(s.date), gewicht: s.maxWeight }));
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
                            React.createElement(Line, { type: "monotone", dataKey: "gewicht", stroke: "#d4ff00", strokeWidth: 2, dot: { r: 3, fill: "#d4ff00" } }))))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [...sessions].reverse().map((s, i) => (React.createElement("div", { key: i, style: { borderBottom: "1px solid var(--border)", paddingBottom: 10 } },
                    React.createElement("p", { className: "ff-tag-note" }, formatDateLong(s.date)),
                    React.createElement("p", { style: { margin: "4px 0 0 0", fontSize: 13 } }, s.sets.filter((st) => st.done).map((st, j) => `${st.reps}×${st.weight}kg`).join("  ·  ") || "Keine Sätze abgehakt"))))))))));
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
function ExercisesView({ allExercises, allEquipment, ownedEquipment, logs, onAddCustom }) {
    const [search, setSearch] = useState("");
    const [muscleFilter, setMuscleFilter] = useState(null);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [historyEx, setHistoryEx] = useState(null);
    const [detailEx, setDetailEx] = useState(null);
    const ownedSet = useMemo(() => new Set(ownedEquipment), [ownedEquipment]);
    const filtered = useMemo(() => {
        return allExercises.filter((ex) => {
            if (search && !ex.name.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (muscleFilter && !ex.muscles.includes(muscleFilter))
                return false;
            if (onlyAvailable && !ex.equipment.every((id) => ownedSet.has(id)))
                return false;
            return true;
        });
    }, [allExercises, search, muscleFilter, onlyAvailable, ownedSet]);
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
            React.createElement("button", { className: `ff-tagbtn ${onlyAvailable ? "selected" : ""}`, onClick: () => setOnlyAvailable((v) => !v) }, "Nur verf\u00FCgbare")),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 } },
            React.createElement("button", { className: `ff-tagbtn ${!muscleFilter ? "selected" : ""}`, onClick: () => setMuscleFilter(null) }, "Alle"),
            MUSCLE_GROUPS.map((m) => (React.createElement("button", { key: m, className: `ff-tagbtn ${muscleFilter === m ? "selected" : ""}`, onClick: () => setMuscleFilter(m) }, m)))),
        filtered.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } }, "Keine \u00DCbungen gefunden.")) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 20 } }, filtered.map((ex) => {
            const available = ex.equipment.every((id) => ownedSet.has(id));
            return (React.createElement("div", { key: ex.id, className: "ff-card", style: { display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }, onClick: () => setDetailEx(ex) },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                    React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 15 } }, ex.name),
                    ex.custom && React.createElement("span", { className: "ff-tag-note", style: { color: "var(--accent)" } }, "EIGEN")),
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
function ExercisePickerModal({ allExercises, allEquipment, ownedEquipment, onPick, onClose }) {
    const [search, setSearch] = useState("");
    const ownedSet = useMemo(() => new Set(ownedEquipment || []), [ownedEquipment]);
    const hasEquipment = ownedSet.size > 0;
    const [onlyAvailable, setOnlyAvailable] = useState(hasEquipment);
    const filtered = allExercises.filter((ex) => {
        if (search && !ex.name.toLowerCase().includes(search.toLowerCase()))
            return false;
        if (onlyAvailable && !ex.equipment.every((id) => ownedSet.has(id)))
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
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 12 } },
                React.createElement("button", { className: `ff-tagbtn ${onlyAvailable ? "selected" : ""}`, onClick: () => setOnlyAvailable((v) => !v) }, "Nur mit meinen Ger\u00E4ten"),
                !hasEquipment && React.createElement("span", { className: "ff-tag-note" }, "Noch keine Ger\u00E4te ausgew\u00E4hlt \u2014 alle \u00DCbungen werden angezeigt.")),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 14, maxHeight: 340, overflowY: "auto" } },
                filtered.map((ex) => {
                    const available = ex.equipment.every((id) => ownedSet.has(id));
                    return (React.createElement("button", { key: ex.id, onClick: () => onPick(ex), style: { textAlign: "left", background: "#0d0d0d", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" } },
                        React.createElement("div", null,
                            React.createElement("span", null, ex.name),
                            React.createElement("div", { className: "ff-tag-note", style: { marginTop: 2 } }, equipmentNames(ex.equipment, allEquipment).join(" · ") || "Kein Gerät nötig")),
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                            hasEquipment && (React.createElement("span", { className: "ff-mono", style: { fontSize: 10, color: available ? "var(--accent)" : "var(--text-faint)" } }, available ? "●" : "○")),
                            React.createElement(ChevronRight, { size: 15, color: "var(--text-faint)" }))));
                }),
                filtered.length === 0 && React.createElement("p", { className: "ff-tag-note", style: { padding: 10 } }, "Keine Treffer mit deinen aktuellen Ger\u00E4ten. Deaktiviere den Filter oder w\u00E4hle mehr Ger\u00E4te aus.")))));
}
function PlanExerciseRow({ row, exercise, onChange, onRemove, onMove, isFirst, isLast }) {
    const set = (field) => (e) => onChange({ ...row, [field]: e.target.value });
    return (React.createElement("div", { className: "ff-card", style: { marginBottom: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("div", null,
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, exercise?.name || "Unbekannte Übung"),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, (exercise?.muscles || []).join(" · "))),
            React.createElement("div", { style: { display: "flex", gap: 4 } },
                React.createElement("button", { className: "ff-btn ff-btn-icon", disabled: isFirst, onClick: () => onMove(-1) },
                    React.createElement(ChevronUp, { size: 15 })),
                React.createElement("button", { className: "ff-btn ff-btn-icon", disabled: isLast, onClick: () => onMove(1) },
                    React.createElement(ChevronDown, { size: 15 })),
                React.createElement(ConfirmDelete, { onConfirm: onRemove }))),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 14 } },
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
                React.createElement("input", { className: "ff-numinput", type: "number", min: "0", value: row.pause, onChange: set("pause") }))),
        React.createElement("input", { className: "ff-input", style: { marginTop: 10 }, placeholder: "Notiz / Tipp", value: row.note, onChange: set("note") })));
}
function PlanEditor({ plan, allExercises, allEquipment, ownedEquipment, onSave, onCancel }) {
    const [name, setName] = useState(plan?.name || "");
    const [description, setDescription] = useState(plan?.description || "");
    const [exercises, setExercises] = useState(plan?.exercises || []);
    const [showPicker, setShowPicker] = useState(false);
    const exerciseById = (id) => allExercises.find((e) => e.id === id);
    const addExercise = (ex) => {
        setExercises((prev) => [...prev, { id: uid(), exerciseId: ex.id, sets: 3, reps: 10, weight: 0, pause: 60, note: "" }]);
        setShowPicker(false);
    };
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
            exercises: exercises.map((r) => ({ ...r, sets: Number(r.sets) || 1, reps: Number(r.reps) || 0, weight: Number(r.weight) || 0, pause: Number(r.pause) || 0 })),
        });
    };
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, plan ? "Plan bearbeiten" : "Neuer Plan"),
        React.createElement("input", { className: "ff-input-display", style: nameError ? { borderBottomColor: "var(--danger)" } : undefined, placeholder: "Plan-Name (z.B. Push A)", value: name, onChange: (e) => { setName(e.target.value); if (nameError)
                setNameError(false); } }),
        nameError && React.createElement("p", { style: { color: "var(--danger)", fontSize: 12, marginTop: 6 }, className: "ff-mono" }, "Bitte gib deinem Plan einen Namen."),
        React.createElement("textarea", { className: "ff-textarea", style: { marginTop: 18 }, placeholder: "Beschreibung / Ziel des Plans (optional)", value: description, onChange: (e) => setDescription(e.target.value) }),
        React.createElement("div", { style: { marginTop: 20 } },
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
        showPicker && React.createElement(ExercisePickerModal, { allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: ownedEquipment, onPick: addExercise, onClose: () => setShowPicker(false) })));
}
/* =========================================================================
   PLANS LIST VIEW
   ========================================================================= */
function PlansView({ plans, allExercises, allEquipment, ownedEquipment, onCreate, onUpdate, onDelete, onStart }) {
    const [editing, setEditing] = useState(null); // null | plan | "new"
    if (editing) {
        return (React.createElement(PlanEditor, { plan: editing === "new" ? null : editing, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: ownedEquipment, onCancel: () => setEditing(null), onSave: (plan) => {
                editing === "new" ? onCreate(plan) : onUpdate(plan);
                setEditing(null);
            } }));
    }
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 } },
            React.createElement("div", null,
                React.createElement("p", { className: "ff-eyebrow" }, "Konfigurator"),
                React.createElement(GlitchTitle, { text: "Trainingspl\u00E4ne", size: 34 })),
            React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => setEditing("new") },
                React.createElement(Plus, { size: 14 }),
                " Neuer Plan")),
        plans.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Du hast noch keinen Trainingsplan."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: () => setEditing("new") },
                React.createElement(Plus, { size: 14 }),
                " Ersten Plan erstellen"))) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 22 } }, plans.map((plan) => (React.createElement("div", { key: plan.id, className: "ff-card" },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                React.createElement("p", { className: "ff-display", style: { fontSize: 20, margin: 0 } }, plan.name),
                React.createElement(ConfirmDelete, { onConfirm: () => onDelete(plan.id) })),
            plan.description && React.createElement("p", { style: { fontSize: 13, color: "var(--text-dim)", marginTop: 6 } }, plan.description),
            React.createElement("p", { className: "ff-mono", style: { fontSize: 11, color: "var(--text-faint)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 } },
                React.createElement(Dumbbell, { size: 13 }),
                " ",
                plan.exercises.length,
                " \u00DCbungen"),
            React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } },
                React.createElement("button", { className: "ff-btn", style: { flex: 1, justifyContent: "center" }, onClick: () => setEditing(plan) }, "Bearbeiten"),
                React.createElement("button", { className: "ff-btn ff-btn-primary", style: { flex: 1, justifyContent: "center" }, onClick: () => onStart(plan) },
                    React.createElement(Play, { size: 13 }),
                    " Starten")))))))));
}
/* =========================================================================
   ACTIVE WORKOUT VIEW
   ========================================================================= */
function ActiveWorkoutView({ workout, allExercises, onFinish, onCancel }) {
    const [exercises, setExercises] = useState(workout.exercises);
    const [note, setNote] = useState("");
    const updateSet = (exIdx, setIdx, field, value) => {
        setExercises((prev) => prev.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s));
            return { ...ex, sets };
        }));
    };
    const toggleDone = (exIdx, setIdx) => {
        setExercises((prev) => prev.map((ex, i) => {
            if (i !== exIdx)
                return ex;
            const sets = ex.sets.map((s, j) => (j === setIdx ? { ...s, done: !s.done } : s));
            return { ...ex, sets };
        }));
    };
    const totalDoneSets = exercises.reduce((s, ex) => s + ex.sets.filter((st) => st.done).length, 0);
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Training l\u00E4uft"),
        React.createElement(GlitchTitle, { text: workout.planName, size: 34 }),
        React.createElement("div", { style: { marginTop: 22, display: "flex", flexDirection: "column", gap: 14 } }, exercises.map((ex, exIdx) => {
            const meta = allExercises.find((e) => e.id === ex.exerciseId);
            return (React.createElement("div", { key: ex.exerciseId + exIdx, className: "ff-card" },
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 17 } }, ex.exerciseName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, (meta?.muscles || []).join(" · ")),
                React.createElement("div", { style: { marginTop: 14, display: "flex", flexDirection: "column", gap: 8 } },
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
                        React.createElement("input", { className: "ff-numinput", type: "number", value: s.weight, onChange: (e) => updateSet(exIdx, setIdx, "weight", e.target.value) })))))));
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
                React.createElement("button", { className: "ff-btn ff-btn-primary", onClick: () => onFinish(exercises, note) },
                    React.createElement(CircleCheck, { size: 15 }),
                    " Training abschlie\u00DFen")))));
}
/* =========================================================================
   DIARY VIEW
   ========================================================================= */
function DiaryEntry({ log, onDelete }) {
    const [open, setOpen] = useState(false);
    const volume = computeLogVolume(log);
    return (React.createElement("div", { className: "ff-card" },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }, onClick: () => setOpen((v) => !v) },
            React.createElement("div", null,
                React.createElement("p", { style: { margin: 0, fontWeight: 700, fontSize: 16 } }, log.planName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } },
                    formatDateLong(log.date),
                    " \u00B7 ",
                    log.durationMin,
                    " min")),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
                React.createElement("span", { className: "ff-mono", style: { color: "var(--accent)", fontSize: 13 } },
                    volume.toLocaleString("de-DE"),
                    " kg"),
                React.createElement(ConfirmDelete, { onConfirm: () => onDelete(log.id) }),
                React.createElement(ChevronDown, { size: 16, style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease", color: "var(--text-faint)" } }))),
        open && (React.createElement("div", { style: { marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 } },
            log.exercises.map((ex, i) => (React.createElement("div", { key: i },
                React.createElement("p", { style: { margin: 0, fontWeight: 600, fontSize: 13 } }, ex.exerciseName),
                React.createElement("p", { className: "ff-tag-note", style: { marginTop: 3 } }, ex.sets.map((s, j) => `${s.done ? "✓" : "—"} ${s.reps}×${s.weight}kg`).join("   "))))),
            log.note && (React.createElement("div", { style: { marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border)" } },
                React.createElement("p", { className: "ff-field-label" }, "Notiz"),
                React.createElement("p", { style: { margin: 0, fontSize: 13, color: "var(--text-dim)" } }, log.note)))))));
}
function DiaryView({ logs, onDelete, onGoToPlans }) {
    const sorted = useMemo(() => [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)), [logs]);
    return (React.createElement("div", null,
        React.createElement("p", { className: "ff-eyebrow" }, "Verlauf"),
        React.createElement(GlitchTitle, { text: "Tagebuch", size: 34 }),
        sorted.length === 0 ? (React.createElement("div", { className: "ff-empty", style: { marginTop: 24 } },
            React.createElement("p", null, "Noch keine Eintr\u00E4ge im Tagebuch."),
            React.createElement("button", { className: "ff-btn ff-btn-primary", style: { marginTop: 14 }, onClick: onGoToPlans },
                React.createElement(Play, { size: 14 }),
                " Training starten"))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 22 } }, sorted.map((log) => React.createElement(DiaryEntry, { key: log.id, log: log, onDelete: onDelete }))))));
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
    const [plans, setPlans] = useState([]);
    const [logs, setLogs] = useState([]);
    const [activeWorkout, setActiveWorkout] = useState(null);
    useEffect(() => {
        (async () => {
            const [eq, ceq, ce, pl, lg] = await Promise.all([
                loadKey(STORAGE_KEYS.equipment, []),
                loadKey(STORAGE_KEYS.customEquipment, []),
                loadKey(STORAGE_KEYS.customExercises, []),
                loadKey(STORAGE_KEYS.plans, []),
                loadKey(STORAGE_KEYS.logs, []),
            ]);
            setEquipment(eq);
            setCustomEquipment(ceq);
            setCustomExercises(ce);
            setPlans(pl);
            setLogs(lg);
            setReady(true);
        })();
    }, []);
    const allExercises = useMemo(() => [...EXERCISE_LIBRARY, ...customExercises], [customExercises]);
    const allEquipment = useMemo(() => [...EQUIPMENT, ...customEquipment], [customEquipment]);
    const persistEquipment = useCallback((next) => { setEquipment(next); saveKey(STORAGE_KEYS.equipment, next); }, []);
    const persistCustomEquipment = useCallback((next) => { setCustomEquipment(next); saveKey(STORAGE_KEYS.customEquipment, next); }, []);
    const persistCustomExercises = useCallback((next) => { setCustomExercises(next); saveKey(STORAGE_KEYS.customExercises, next); }, []);
    const persistPlans = useCallback((next) => { setPlans(next); saveKey(STORAGE_KEYS.plans, next); }, []);
    const persistLogs = useCallback((next) => { setLogs(next); saveKey(STORAGE_KEYS.logs, next); }, []);
    const handleAddCustomExercise = (ex) => persistCustomExercises([...customExercises, ex]);
    const handleAddCustomEquipment = (eq) => persistCustomEquipment([...customEquipment, eq]);
    const handleDeleteCustomEquipment = (id) => {
        persistCustomEquipment(customEquipment.filter((e) => e.id !== id));
        persistEquipment(equipment.filter((e) => e !== id));
    };
    const handleCreatePlan = (plan) => persistPlans([...plans, plan]);
    const handleUpdatePlan = (plan) => persistPlans(plans.map((p) => (p.id === plan.id ? plan : p)));
    const handleDeletePlan = (id) => persistPlans(plans.filter((p) => p.id !== id));
    const handleStartWorkout = (plan) => {
        const exercises = plan.exercises.map((row) => {
            const meta = allExercises.find((e) => e.id === row.exerciseId);
            const setsCount = Math.max(1, Number(row.sets) || 1);
            return {
                exerciseId: row.exerciseId,
                exerciseName: meta?.name || "Übung",
                sets: Array.from({ length: setsCount }, () => ({ reps: row.reps, weight: row.weight, done: false })),
            };
        });
        setActiveWorkout({ planId: plan.id, planName: plan.name, exercises, startedAt: Date.now() });
    };
    const handleFinishWorkout = (exercises, note) => {
        const durationMin = Math.max(1, Math.round((Date.now() - activeWorkout.startedAt) / 60000));
        const log = {
            id: uid(),
            planId: activeWorkout.planId,
            planName: activeWorkout.planName,
            date: new Date().toISOString(),
            durationMin,
            note: note.trim(),
            exercises,
        };
        persistLogs([...logs, log]);
        setActiveWorkout(null);
        setTab("tagebuch");
    };
    const handleDeleteLog = (id) => persistLogs(logs.filter((l) => l.id !== id));
    if (!ready) {
        return (React.createElement("div", { className: "ff-root", style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" } },
            React.createElement(GlobalStyles, null),
            React.createElement("p", { className: "ff-mono", style: { color: "var(--text-dim)" } }, "Lade Bernds Body App...")));
    }
    return (React.createElement("div", { className: "ff-root" },
        React.createElement(GlobalStyles, null),
        React.createElement("style", null, `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`),
        React.createElement("div", { className: "ff-nav" },
            React.createElement("div", { className: "ff-logo" },
                React.createElement("div", { className: "ff-logo-mark" },
                    React.createElement(Dumbbell, { size: 18 })),
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
            activeWorkout && React.createElement("span", { className: "ff-mono", style: { fontSize: 11, color: "var(--accent)" } }, "\u25CF AKTIVES TRAINING")),
        React.createElement("div", { className: "ff-main" }, activeWorkout ? (React.createElement(ActiveWorkoutView, { workout: activeWorkout, allExercises: allExercises, onFinish: handleFinishWorkout, onCancel: () => setActiveWorkout(null) })) : (React.createElement(React.Fragment, null,
            tab === "uebersicht" && React.createElement(Dashboard, { logs: logs, plans: plans, onGoToPlans: () => setTab("plaene") }),
            tab === "geraete" && (React.createElement(EquipmentView, { equipment: equipment, customEquipment: customEquipment, onSave: persistEquipment, onAddCustom: handleAddCustomEquipment, onDeleteCustom: handleDeleteCustomEquipment })),
            tab === "uebungen" && (React.createElement(ExercisesView, { allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, logs: logs, onAddCustom: handleAddCustomExercise })),
            tab === "plaene" && (React.createElement(PlansView, { plans: plans, allExercises: allExercises, allEquipment: allEquipment, ownedEquipment: equipment, onCreate: handleCreatePlan, onUpdate: handleUpdatePlan, onDelete: handleDeletePlan, onStart: handleStartWorkout })),
            tab === "tagebuch" && React.createElement(DiaryView, { logs: logs, onDelete: handleDeleteLog, onGoToPlans: () => setTab("plaene") }))))));
}
/* =========================================================================
   STANDALONE MOUNT (nicht Teil des Claude.ai-Artifacts)
   ========================================================================= */
import ReactDOM from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(React.createElement(App, null));

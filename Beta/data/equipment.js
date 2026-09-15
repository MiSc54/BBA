/* =========================================================================
   Liste aller fest eingebauten Trainingsgeräte (EQUIPMENT) inkl. Kategorien und Muskelgruppen.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

/* =========================================================================
   CONSTANTS
   ========================================================================= */
/* =========================================================================
   GERÄTELISTE — hier stehen ALLE 75 vordefinierten Trainingsgeräte
   =========================================================================
   Jedes Gerät hat eine eindeutige id (nicht verändern!), einen Anzeigenamen
   und eine Kategorie (siehe EQUIPMENT_CATEGORY_ORDER direkt darunter für
   die möglichen Kategorien). Willst du ein weiteres Gerät fest einbauen
   (nicht nur über "Eigenes Gerät" in der App selbst), kannst du hier
   einfach eine weitere Zeile nach demselben Muster ergänzen.
   ========================================================================= */
export const EQUIPMENT = [
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
// Die Reihenfolge, in der Geräte-Kategorien angezeigt und im Gerätetyp-
// Filter aufgelistet werden.

export const EQUIPMENT_CATEGORY_ORDER = ["Freie Gewichte", "Bank", "Rack", "Kabel", "Maschinen", "Cardio", "Funktional", "Zubehör"];

// Alle Muskelgruppen, nach denen Übungen im Übungen-Tab gefiltert werden
// können und die in der Detailansicht als Tags angezeigt werden.
export const MUSCLE_GROUPS = ["Brust", "Rücken", "Schultern", "Bizeps", "Trizeps", "Unterarme", "Quadrizeps", "Beinbizeps", "Waden", "Gesäß", "Core", "Ganzkörper"];

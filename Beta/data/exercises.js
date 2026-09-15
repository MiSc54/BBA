/* =========================================================================
   Zentrale Übungsbibliothek (EXERCISE_LIBRARY).
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

/* =========================================================================
   ÜBUNGSBIBLIOTHEK — hier stehen ALLE vordefinierten Übungen
   =========================================================================
   Jede Übung ist ein Objekt mit:
   - id: eindeutige Kennung (nicht verändern, sonst gehen ggf. gespeicherte
     Trainingspläne kaputt, die auf diese ID verweisen!)
   - name: Anzeigename
   - equipment: Liste der benötigten Geräte-IDs (siehe EQUIPMENT oben)
   - muscles: trainierte Muskelgruppen (siehe MUSCLE_GROUPS)
   - description/executionSteps/commonMistakes: Texte für die Detailansicht
   - bodyweightFactor (optional): Anteil des Körpergewichts, der bewegt
     wird (z.B. 0.64 bei Liegestütze) — wird für die automatische
     Gewichtsberechnung und Kalorienschätzung verwendet
   - trackingType (optional): "distance" (Strecke in km) oder "duration"
     (Zeit/Stoppuhr) statt der normalen Sätze/Wdh./Gewicht-Erfassung
   - met/kcalPerKgKm (optional): Werte für die Kalorienschätzung
   Willst du eine eigene Übung fest in die App einbauen (nicht nur über
   "Eigene Übung anlegen" in der App selbst), kannst du hier einfach ein
   weiteres Objekt nach demselben Muster ergänzen.
   ========================================================================= */
export const EXERCISE_LIBRARY = [
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
// Alle "Schlüssel" (Keys), unter denen Daten dauerhaft gespeichert werden.
// Manche sind pro Profil unterschiedlich (Funktionen, die eine profileId
// entgegennehmen), andere gelten global für die ganze App (z.B. equipment,
// da Geräte für alle Profile gleich sind).

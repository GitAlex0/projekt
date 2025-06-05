const fs = require('fs');
const path = require('path');
const readline = require('readline');

const quizData = {
    1: { q: "Ich kann kleine Objekte wie Nadel und Faden sicher handhaben.", type: "r", r: { min: 0, max:100 }, skill: "feinmotorik"},
    2: { q: "Ich arbeite sicher mit feinen Werkzeugen wie Schraubenzieher oder Pinzette.", type: "r", r: { min: 0, max:100 }, skill: "feinmotorik"},
    3: { q: "Es fällt mir leicht, beim Zeichnen oder Malen präzise Linien zu ziehen.", type: "r", r: { min: 0, max:100 }, skill: "feinmotorik"},

    4: { q: "Ich bleibe ruhig, auch wenn ich lange warten muss (z.B. in einer Schlange).", type: "r", r: { min: 0, max:100 }, skill: "geduld"},
    5: { q: "Ich kann gut damit umgehen, wenn jemand langsamer arbeitet als ich und ich mal warten muss.", type: "r", r: { min: 0, max:100 }, skill: "geduld"},

    6: { q: "Ich bleibe auch bei schwierigen oder langwierigen Aufgaben konzentriert.", type: "r", r: { min: 0, max:100 }, skill: "disziplin"},
    7: { q: "Ich kann mich konsequent an feste tägliche oder wöchentliche Routinen halten.", type: "r", r: { min: 0, max:100 }, skill: "disziplin"},

    8: { q: "Ich denke mir oft neue und originelle Ideen aus.", type: "r", r: { min: 0, max:100 }, skill: "kreativitaet"},
    9: { q: "Ich setze meine kreativen Ideen regelmäßig in die Realität um.", type: "r", r: { min: 0, max:100 }, skill: "kreativitaet"},
    10: { q: "Ich schätze kreative Freiräume mehr als genaue Vorgaben.", type: "r", r: { min: 0, max:100 }, skill: "kreativitaet"},
    11: { q: "Ich bin eine künstlerische Person", type: "r", r: { min: 0, max:100 }, skill: "kreativitaet"},

    12: { q: "Ich erkenne leicht, wie sich andere fühlen.", type: "r", r: { min: 0, max:100 }, skill: "empathie"},
    13: { q: "Ich helfe Menschen in schwierigen Situationen, auch ohne darum gebeten zu werden.", type: "r", r: { min: 0, max:100 }, skill: "empathie"},
    14: { q: "In Konflikten suche ich aktiv nach Lösungen, die für alle Beteiligten akzeptabel sind.", type: "r", r: { min: 0, max:100 }, skill: "empathie"},
    15: { q: "Ich bemühe mich, die Perspektiven aller Beteiligten in einem Konflikt zu verstehen.", type: "r", r: { min: 0, max:100 }, skill: "empathie"},

    16: { q: "Ich übernehme gerne die Hauptverantwortung in einer Gruppe.", type: "r", r: { min: 0, max:100 }, skill: "verantwortungsbewusstsein"},
    17: { q: "Bei Projekten übernehme ich bereitwillig Verantwortung.", type: "r", r: { min: 0, max:100 }, skill: "verantwortungsbewusstsein"},
    18: { q: "Ich halte mich an Vereinbarungen, auch wenn sie unbequem sind.", type: "r", r: { min: 0, max:100 }, skill: "verantwortungsbewusstsein"},
    19: { q: "Ich übernehme Verantwortung für meine Fehler, anstatt Ausreden zu suchen.", type: "r", r: { min: 0, max:100 }, skill: "verantwortungsbewusstsein"},

    20: { q: "Ich traue mir zu, Möbel zusammenzubauen oder Dinge zu reparieren und mache das auch gerne.", type: "r", r: { min: 0, max:100 }, skill: "handwerklichkeit"},
    21: { q: "Ich arbeite gerne mit Werkzeugen und Maschinen.", type: "r", r: { min: 0, max:100 }, skill: "handwerklichkeit"},
    22: { q: "Ich kann technische Zeichnungen oder Anleitungen gut verstehen und umsetzen.", type: "r", r: { min: 0, max:100 }, skill: "handwerklichkeit"},
    23: { q: "Auch einfache Möbel aufzubauen, kann mich überfordern (z.B. IKEA).", type: "r", r: { min: 0, max:100 }, skill: "handwerklichkeit"},

    24: { q: "Ich traue mir zu, neue Aufgaben selbstständig zu bewältigen.", type: "r", r: { min: 0, max:100 }, skill: "selbstbewusstsein"},
    25: { q: "Ich glaube an meine Fähigkeiten, auch wenn mir Fehler passieren.", type: "r", r: { min: 0, max:100 }, skill: "selbstbewusstsein"},
    26: { q: "Ich lasse mich nicht leicht verunsichern.", type: "r", r: { min: 0, max:100 }, skill: "selbstbewusstsein"},
    27: { q: "Ich kann offen zu meinen Stärken und Schwächen stehen.", type: "r", r: { min: 0, max:100 }, skill: "selbstbewusstsein"},

    28: { q: "Ich kann Kritik annehmen, ohne mich persönlich angegriffen zu fühlen.", type: "r", r: { min: 0, max:100 }, skill: "kritikfaehigkeit"},
    29: { q: "Bei Kritik bleibe ich ruhig und reagiere nicht gereizt.", type: "r", r: { min: 0, max:100 }, skill: "kritikfaehigkeit"},
    30: { q: "Ich kann erkennen, wenn Kritik berechtigt ist.", type: "r", r: { min: 0, max:100 }, skill: "kritikfaehigkeit"},
    31: { q: "Ich bitte aktiv um Feedback, um mich weiterzuentwickeln.", type: "r", r: { min: 0, max:100 }, skill: "kritikfaehigkeit"},

    32: { q: "In einer Gruppe übernehme ich gerne die Führung.", type: "r", r: { min: 0, max:100 }, skill: "fuerungsstaerke"},
    33: { q: "Ich bin überzeugt, dass eine Gruppe mit mir an der Spitze gut funktioniert.", type: "r", r: { min: 0, max:100 }, skill: "fuerungsstaerke"},

    34: { q: "Ich finde es einfach, zwischen mehreren Optionen die beste zu wählen.", type: "r", r: { min: 0, max:100 }, skill: "entscheidungsfreude"},
    35: { q: "Ich treffe Entscheidungen, ohne lange grübeln zu müssen.", type: "r", r: { min: 0, max:100 }, skill: "entscheidungsfreude"},
    36: { q: "Ich finde es wichtig, schnell eine Wahl zu treffen, auch wenn es keine „perfekte“ Lösung gibt.", type: "r", r: { min: 0, max:100 }, skill: "entscheidungsfreude"},

    37: { q: "Ich bin strukturiert und gut organisiert.", type: "r", r: { min: 0, max:100 }, skill: "organisationsfaehigkeit"},
    38: { q: "Ich bin zuverlässig pünktlich.", type: "r", r: { min: 0, max:100 }, skill: "organisationsfaehigkeit"},
    39: { q: "Ich plane meine Arbeit so, dass ich rechtzeitig fertig werde.", type: "r", r: { min: 0, max:100 }, skill: "organisationsfaehigkeit"},
    40: { q: "Ich verpasse keine Termine und Fristen, weil ich diese zuverlässig im Blick behalte.", type: "r", r: { min: 0, max:100 }, skill: "organisationsfaehigkeit"},

    41: { q: "Ich probiere gerne neue Methoden aus, auch wenn der Erfolg ungewiss ist.", type: "r", r: { min: 0, max:100 }, skill: "experimentierfreude"},
    42: { q: "Ich finde es aufregend, in einem Experiment Dinge zu verändern, um zu sehen, wie sich das Ergebnis verändert.", type: "r", r: { min: 0, max:100 }, skill: "experimentierfreude"},
    43: { q: "Ich gehe oft Risiken ein, um neue Erfahrungen zu machen.", type: "r", r: { min: 0, max:100 }, skill: "experimentierfreude"},
    44: { q: "Ich gehe oft von gewohnten Wegen ab, um neue Möglichkeiten zu entdecken.", type: "r", r: { min: 0, max:100 }, skill: "experimentierfreude"},

    45: { q: "Ich bearbeite in der Schule auch ohne ständige Kontrolle zuverlässig meine Aufgaben.", type: "r", r: { min: 0, max:100 }, skill: "selbststaendigkeit"},
    46: { q: "Ich fange Aufgaben selbstständig an, ohne darauf hingewiesen zu werden.", type: "r", r: { min: 0, max:100 }, skill: "selbststaendigkeit"},
    47: { q: "Ich komme gut damit klar, wenn es mal keine klaren Ansagen gibt.", type: "r", r: { min: 0, max:100 }, skill: "selbststaendigkeit"},
    48: { q: "Ich kann gut für mich selbst sorgen, sollte das erforderlich sein.", type: "r", r: { min: 0, max:100 }, skill: "selbststaendigkeit"},

    49: { q: "Ein berühmter Detektiv untersucht einen Einbruch. Er befragt drei Verdächtige: Tom: \"Ich war die ganze Nacht zu Hause.\";Lisa: \"Ich habe Tom abends in einem Café gesehen.\";Chris: \"Lisa lügt!\";Der Detektiv weiß, dass nur eine Person die Wahrheit sagt. Wer ist der Einbrecher?", type: "mc", a: { 1: "Tom", 2: "Lisa", 3: "Chris" }, c: 1, skill: "logischesVerstaendnis" },
    50: { q: "Ein wertvoller Diamant wurde aus einem Museum gestohlen. Die Polizei befragt drei Verdächtigen: Anna: \„Ich habe den Diamanten nicht gestohlen!\“; Ben: \„Anna sagt die Wahrheit!\“; Chris: \„Ben lügt!\“ Die Polizei weiß, dass nur eine dieser drei Personen die Wahrheit sagt. Wer hat den Diamanten gestohlen?", type: "mc", a: { 1: "Anna", 2: "Ben", 3: "Chris" }, c: 1, skill: "logischesVerstaendnis" },
    51: { q: "Wie viele verschiedene Möglichkeiten gibt es, drei Bücher auf ein Regal zu stellen, wenn es fünf Bücher zur Auswahl gibt?", type: "mc", a: { 1: "72", 2: "54", 3: "45", 4: "60" }, c: 4, skill: "logischesVerstaendnis" },
    52: { q: "Du hast 2 Fässer: Ein Fass fasst 5 Liter, das andere 3 Liter. Wie oft musst du ein Fass füllen, leeren oder umfüllen, um 4 Liter abmessen?", type: "mc", a: { 1: "8", 2: "5", 3: "7", 4: "6" }, c: 4, skill: "logischesVerstaendnis" },

    53: { q: "Ein Produkt kostet 150 Euro. Der Preis wird um 20 % reduziert. Wie viel kostet das Produkt nach der Reduktion?", type: "mc", a: { 1: "115€", 2: "120€", 3: "125€", 4: "130€" }, c: 2, skill: "mathematik" },
    54: { q: "In einer Fabrik sind 4 Maschinen erforderlich, um 120 Stücke eines Produkts in 6 Stunden zu produzieren. Wie viele Maschinen sind erforderlich, um 315 Stücke in 9 Stunden zu produzieren?", type: "mc", a: { 1: "6", 2: "7", 3: "8", 4: "9" }, c: 2, skill: "mathematik" },
    55: { q: "Ein Unternehmen hat in den letzten 5 Jahren folgende Gewinne erzielt: 3.000 Euro, 4.500 Euro, 2.000 Euro, 5.500 Euro und 4.000 Euro. Was ist der Durchschnittsgewinn über diese 5 Jahre?", type: "mc", a: { 1: "3.800€", 2: "3.400€", 3: "4.000€", 4: "3.600€" }, c: 1, skill: "mathematik" },
    56: { q: "In einer Schule sind 800 Schüler eingeschrieben, davon sind 60 % Jungen. Wie viele Mädchen gibt es an der Schule?", type: "mc", a: { 1: "300", 2: "320", 3: "280", 4: "360" }, c: 2, skill: "mathematik" },

    57: { q: "Ich fühle mich schnell überfordert, wenn viel auf einmal passiert.", type: "mc", a: { 1: "ja", 2: "eher ja", 3: "eher nein", 4: "nein" }, skill: "mentaleBelastbarkeit" },
    58: { q: "Ich bleibe ruhig, auch wenn viele Dinge gleichzeitig erledigt werden müssen.", type: "mc", a: { 1: "nein", 2: "eher nein", 3: "eher ja", 4: "ja" }, skill: "mentaleBelastbarkeit" },
    59: { q: "Ich kann gut mit Stress umgehen", type: "mc", a: { 1: "nein", 2: "eher nein", 3: "eher ja", 4: "ja" }, skill: "mentaleBelastbarkeit" },
    60: { q: "Unter Druck kann ich nicht arbeiten", type: "mc", a: { 1: "ja", 2: "eher ja", 3: "eher nein", 4: "nein" }, skill: "mentaleBelastbarkeit" },

    61: { q: "Ich mache oft körperliche oder anstrengende Tätigkeiten in meinem Alltag oder meiner Freizeit (Sport, schwere Dinge tragen etc.)", type: "mc", a: { 1: "nein", 2: "eher nein", 3: "eher ja", 4: "ja" }, skill: "koerperlicheBelastbarkeit" },
    62: { q: "Ich habe keine Probleme mit Arbeiten, bei denen ich viel stehen, laufen oder tragen muss.", type: "mc", a: { 1: "viele Probleme", 2: "eher viele", 3: "eher wenige", 4: "keine Probleme" }, skill: "koerperlicheBelastbarkeit" },
    63: { q: "Körperliche Arbeit macht mir Spaß", type: "mc", a: { 1: "nein", 2: "eher nein", 3: "eher ja", 4: "ja" }, skill: "koerperlicheBelastbarkeit" },

    64: { q: "Ich kann unter Druck schnell Informationen aufnehmen und verarbeiten.", type: "mc", a: { 1: "nein", 2: "eher nein", 3: "eher ja", 4: "ja" }, next:"65", skill: "druckDenken" },
    65: { q: "TEST UNTER DRUCK DENKEN: Die Erde hat 7 Kontinente. Welcher Knopf ist mit den richtigen Anfangsbuchstaben beschriftet?", type: "mc", a: { 1: "A,A,A,E,N,R,S,", 2: "A,A,A,E,N,N,S", 3: "A,A,A,A,E,N,S", 4: "A,A,A,A,A,E,S" }, c: 3, skill: "druckDenken", timed:{max: 20, zero: 45} },

    66: { q: "Kannst du Blut sehen?", type: "mc", a: { 1: "Nein", 2: "Ja" }, c: 2, skill: "blutSehen" },

    67: { q: "What is your favorite hobby?", type: "i", c: 24, skill: "season"},
    68: { q: "What is your dream destination?", type: "mc", a: { 1: "Paris", 2: "Tokyo", 3: "New York", 4: "Sydney", 5: "Hessen"}, skill: "travel", next:"67"},
    69: { q: "Kannst du Stress?", type: "mc", a: { 1: "Nein", 2: "Eher nein", 3: "So lala", 4: "Eher ja", 5: "Ja"}, skill: "stress", next:"70"},
    70: { q: "BEWEIS ES, DIE ZEIT LÄUFT: <br> WIE GEHT DIE ZAHLENFOLGE WEITER? <br>6 - 5 - 4 - 3 - 2 - ?", type: "i", c: 1, skill: "stress", timed:{max: 30, zero: 60}},
    71: { q: "Rechne: \\( x^2 + y^2 = z^2 \\)", type: "i", c: 24, skill: "season", math:true}
};

//Object { wellness: 1, colour: 1, season: 2, rate: 1, travel: 1 }

const skillData = {
    technische: { logischesVerstaendnis: 6, mathematik: 5, feinmotorik: 3, analytischesDenken: 5, geduld: 2, koerperlicheBelastbarkeit: 1, organisationsfaehigkeit: 1 },
    kreative: { feinmotorik: 5, geduld: 5, disziplin: 3, kreativitaet: 6, handwerklichkeit: 4, selbstbewusstsein: 3, kritikfaehigkeit: 1, entscheidungsfreude: 1, organisationsfaehigkeit: 2, experimentierfreude: 3, selbststaendigkeit: 4},
    soziale: { logischesVerstaendnis: 2, analytischesDenken: 3, geduld: 5, disziplin: 3, empathie: 6, verantwortungsbewusstsein: 4, kritikfaehigkeit: 2, mentaleBelastbarkeit: 5, fuehrungsstaerke: 3, entscheidungsfreude: 4, organisationsfaehigkeit: 3, selbststaendigkeit: 4 },
    management: { logischesVerstaendnis: 3, mathematik: 3, analytischesDenken: 5, disziplin: 5, empathie: 3, verantwortungsbewusstsein: 4, selbstbewusstsein: 3, kritikfaehigkeit: 3, mentaleBelastbarkeit: 4, fuehrungsstaerke: 6, entscheidungsfreude: 5, organisationsfaehigkeit: 4, druckDenken: 2, selbststaendigkeit: 5},
    naturwissenschaftliche: { logischesVerstaendnis: 5, mathematik: 4, feinmotorik: 2, analytischesDenken: 5, geduld: 2, disziplin: 2, kreativitaet: 1, verantwortungsbewusstsein: 1, kritikfaehigkeit: 3, organisationsfaehigkeit: 2, experimentierfreude: 5, selbststaendigkeit: 3 },
    medizin: { logischesVerstaendnis: 2, feinmotorik: 4, analytischesDenken: 3, geduld: 4, disziplin: 4, empathie: 5, verantwortungsbewusstsein: 4, selbstbewusstsein: 4, kritikfaehigkeit: 1, mentaleBelastbarkeit: 3, koerperlicheBelastbarkeit: 2, entscheidungsfreude: 1, organisationsfaehigkeit: 3, druckDenken: 4, blutSehen: 5, selbststaendigkeit: 3 },
    handwerk: { logischesVerstaendnis: 3, mathematik: 2, geduld: 2, disziplin: 3, verantwortungsbewusstsein: 3, handwerklichkeit: 6, kritikfaehigkeit: 2, mentaleBelastbarkeit: 1, koerperlicheBelastbarkeit: 6, entscheidungsfreude: 1, organisationsfaehigkeit: 2, selbststaendigkeit: 2 },
    verwaltung: { logischesVerstaendnis: 3, mathematik: 2, analytischesDenken: 3, geduld: 4, disziplin: 5, verantwortungsbewusstsein: 4, selbstbewusstsein: 3, kritikfaehigkeit: 3, mentaleBelastbarkeit: 3, fuehrungsstaerke: 2, entscheidungsfreude: 4, organisationsfaehigkeit: 3, druckDenken: 3, selbststaendigkeit: 4 },
    medien: { logischesVerstaendnis: 1, analytischesDenken: 4, disziplin: 2, kreativitaet: 6, kritikfaehigkeit: 3, mentaleBelastbarkeit: 1, entscheidungsfreude: 2, organisationsfaehigkeit: 3, experimentierfreude: 4, selbststaendigkeit: 2 }
};

// Vorlage: logischesVerstaendnis: 1, mathematik: 1, feinmotorik: 1, analytischesDenken: 1, geduld: 1, disziplin: 1, kreativitaet: 1, empathie: 1, verantwortungsbewusstsein: 1, handwerklichkeit: 1, selbstbewusstsein: 1, kritikfaehigkeit: 1, mentaleBelastbarkeit: 1, koerperlicheBelastbarkeit: 1, fuehrungsstaerke: 1, entscheidungsfreude: 1, organisationsfaehigkeit: 1, experimentierfreude: 1, druckDenken: 1, selbststaendigkeit: 1

function createJSON(data, name){
const filePath = path.join(__dirname, `${name}.json`);

fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('JSON file created successfully at', filePath);
    }
});
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//strikethrough: \x1b[9m
//reset: \x1b[0m
rl.question('(Re-)generate a JSON File: \n 1: Quiz-JSON \n 2: Skill-JSON\n', (answer) => {
    if (answer === '1') {
        createJSON(quizData, "quiz");
    } else if (answer === '2') {
        createJSON(skillData, "skills");
        // console.log("Folgt...")
    } else {
        console.log('Unknown command.');
    }
    rl.close();
});
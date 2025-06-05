const fs = require('fs');
const path = require('path');
const readline = require('readline');

const quizData = {
    1: { q: "How are you", type: "mc", a: { 1: "Great", 2: "Fine", 3: "Not great", 4: "Really bad" }, skill: "wellness" },
    2: { q: "What is your favorite color?", type: "mc", a: { 1: "Red", 2: "Blue", 3: "Green", 4: "Yellow" }, c: 2, skill: "colour", timed:{max: 30, zero: 60}},
    3: { q: "What is your favorite season?", type: "mc", a: { 1: "Spring", 2: "Summer", 3: "Autumn", 4: "Winter" }, c: 1, skill: "season", timed:{max: 10, zero: 40} },
    4: { q: "How much do you agree?", type: "r", r: { min: 0, max:100 }, skill: "rate", next:"1"},
    5: { q: "What is your favorite hobby?", type: "i", c: 24, skill: "season"},
    6: { q: "What is your dream destination?", type: "mc", a: { 1: "Paris", 2: "Tokyo", 3: "New York", 4: "Sydney", 5: "Hessen"}, skill: "travel", next:"5"},
    7: { q: "Kannst du Stress?", type: "mc", a: { 1: "Nein", 2: "Eher nein", 3: "So lala", 4: "Eher ja", 5: "Ja"}, skill: "stress", next:"8"},
    8: { q: "BEWEIS ES, DIE ZEIT LÄUFT: <br> WIE GEHT DIE ZAHLENFOLGE WEITER? <br>6 - 5 - 4 - 3 - 2 - ?", type: "i", c: 1, skill: "stress", timed:{max: 30, zero: 60}},
};

//Object { wellness: 1, colour: 1, season: 2, rate: 1, travel: 1 }

const skillData = {
    job1: { wellness: 1, colour: 4 },
    job2: { season: 3, wellness: 2 },
    job3: { colour: 5, rate: 1 },
    job4: { season: 2, rate: 4 },
    job5: { travel: 3, season: 5 },
    job6: { colour: 2, travel: 1 }
};

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
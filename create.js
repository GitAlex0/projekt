const fs = require('fs');
const path = require('path');
const readline = require('readline');

const quizData = {
    1: { q: "How are you", type: "mc", a: { 1: "Great", 2: "Fine", 3: "Not great", 4: "Really bad" }, skill: "wellness" },
    2: { q: "What is your favorite color?", type: "mc", a: { 1: "Red", 2: "Blue", 3: "Green", 4: "Yellow" }, c: 2, skill: "colour", timed:{max: 30, zero: 60}},
    3: { q: "What is your favorite season?", type: "mc", a: { 1: "Spring", 2: "Summer", 3: "Autumn", 4: "Winter" }, c: 1, skill: "season", timed:{max: 10, zero: 40} },
    4: { q: "How much do you agree?", type: "r", r: { min: 0, max:100 }, skill: "rate", next:"1"},
    5: { q: "What is your favorite hobby?", type: "mc", a: { 1: "Reading", 2: "Sports", 3: "Gaming", 4: "Traveling" }, skill: "season"},
    6: { q: "What is your dream destination?", type: "mc", a: { 1: "Paris", 2: "Tokyo", 3: "New York", 4: "Sydney", 5: "Hessen"}, skill: "travel", next:"5"}
};



const skillData = {
    1: { q: "How are you", type: "mc", a: { 1: "Great", 2: "Fine", 3: "Not great", 4: "Really bad" }, skill: "wellness" },
    2: { q: "What is your favorite color?", type: "mc", a: { 1: "Red", 2: "Blue", 3: "Green", 4: "Yellow" }, skill: "colour"},
    3: { q: "What is your favorite season?", type: "mc", a: { 1: "Spring", 2: "Summer", 3: "Autumn", 4: "Winter" }, skill: "season" },
    4: { q: "How much do you agree?", type: "r", r: { min: 0, max:100 }, skill: "rate", next:"1"},
    5: { q: "What is your favorite hobby?", type: "mc", a: { 1: "Reading", 2: "Sports", 3: "Gaming", 4: "Traveling" }, skill: "hobby", timed:true},
    6: { q: "What is your dream destination?", type: "mc", a: { 1: "Paris", 2: "Tokyo", 3: "New York", 4: "Sydney" }, skill: "travel", next:"5"}
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

rl.question('(Re-)generate a JSON File: \n 1: Quiz-JSON \n \x1b[9m2: Skill-JSON\x1b[0m\n', (answer) => {
    if (answer === '1') {
        createJSON(quizData, "quiz");
    } else if (answer === '2') {
        // createJSON(skillData, "skills");
        console.log("Folgt...")
    } else {
        console.log('Unknown command.');
    }
    rl.close();
});
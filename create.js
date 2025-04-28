const fs = require('fs');
const path = require('path');

// Simplified data
const exampleData = {
    1: { q: "How are you", type: "mc", a: { 1: "Great", 2: "Fine", 3: "Not great", 4: "Really bad" }, s: "wellness" },
    2: { q: "What is your favorite color?", type: "mc", a: { 1: "Red", 2: "Blue", 3: "Green", 4: "Yellow" }, s: "colour" },
    3: { q: "What is your favorite season?", type: "mc", a: { 1: "Spring", 2: "Summer", 3: "Autumn", 4: "Winter" }, s: "season" },
    4: { q: "How much do you agree?", type: "r", r: { min: 0, max:100 }, s: "rate" },
};

// Path to the JSON file
const filePath = path.join(__dirname, 'quiz.json');

// Write the JSON file
fs.writeFile(filePath, JSON.stringify(exampleData, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('JSON file created successfully at', filePath);
    }
});

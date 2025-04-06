const fs = require('fs');
const path = require('path');

// Simplified data
const exampleData = {
    user1: { name: "John Doe", age: 30, email: "johndoe@example.com" },
    user2: { name: "Jane Smith", age: 25, email: "janesmith@example.com" }
};

// Path to the JSON file
const filePath = path.join(__dirname, 'example.json');

// Write the JSON file
fs.writeFile(filePath, JSON.stringify(exampleData, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('JSON file created successfully at', filePath);
    }
});

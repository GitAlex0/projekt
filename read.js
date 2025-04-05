// Assuming the JSON file is named 'data.json' and located in the same directory as the HTML file

// Fetch the JSON data and apply it to a div
let jsonData;
var index = 0;

async function fetchData() {
    try {
        const response = await fetch('output.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        jsonData = await response.json();
        fu(); // Call fu() after jsonData is populated
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

fetchData();
document.cookie = "username=John Doe"; 

fu();
function fu() {
    console.log(jsonData.user1.name);
    console.log(Object.keys(jsonData).length);
}


function next() {
    var sortedKeys = Object.keys(jsonData).sort();
    console.log(sortedKeys);
    document.getElementById("here").innerHTML = jsonData[sortedKeys[0]].name;
    delete jsonData[sortedKeys[0]];
    alert(document.cookie);
}
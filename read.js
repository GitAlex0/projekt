// Assuming the JSON file is named 'data.json' and located in the same directory as the HTML file

// Fetch the JSON data and apply it to a div
let jsonData;
var index = 0;

async function fetchData() {
    try {
        const response = await fetch('example.json');
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


// fu();
function fu() {
    console.log(jsonData.user1.name);
    console.log(Object.keys(jsonData).length);
}


function next() {
    
    var sortedKeys = Object.keys(jsonData).sort();
    console.log(sortedKeys);
    document.getElementById("name").innerHTML = jsonData[sortedKeys[index]].name;
    document.getElementById("age").innerHTML = jsonData[sortedKeys[index]].age;
    document.getElementById("email").innerHTML = jsonData[sortedKeys[index]].email;
    document.cookie = "username="+jsonData[sortedKeys[index]].name+"; expires= 18 Dec 2025 UTC"; 
    // alert(document.cookie);
    index++;
    console.log(index + 'index');
    if (index >= Object.keys(jsonData).length) {
        index = 0;
    }
}
// Assuming the JSON file is named 'data.json' and located in the same directory as the HTML file

// Fetch the JSON data and apply it to a div
let jsonData;
var index = 0;

async function fetchData() {
    try {
        const response = await fetch('quiz.json');
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
    console.log(jsonData);
    console.log(Object.keys(jsonData).length);
}


function next() {
    
    var sortedKeys = Object.keys(jsonData).sort();
    console.log(sortedKeys);
    document.getElementById("name").innerHTML = "question " + jsonData[sortedKeys[index]].q;
    document.getElementById("age").innerHTML =  "type " + jsonData[sortedKeys[index]].type;
    if (jsonData[sortedKeys[index]].type == "mc"){
        document.getElementById("email").innerHTML = "answers " + jsonData[sortedKeys[index]].a;
    }else{
        document.getElementById("slider").style.display = "flex";
        document.getElementById("email").innerHTML = "r";
    }
    // document.cookie = "username="+jsonData[sortedKeys[index]].name+"; expires= 18 Dec 2025 UTC"; 
    // alert(document.cookie);
    
    index++;
    console.log(index + 'index');
    if (index >= Object.keys(jsonData).length) {
        index = 0;
    }
}
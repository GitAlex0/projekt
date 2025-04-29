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
    console.log('Successfully loaded data');
    // console.log(Object.keys(jsonData));
    // console.log(Object.keys(jsonData).sort());
}


function next() {
    clearButtons();
    //redundant but possible useful later
    var sortedKeys = Object.keys(jsonData).sort();
    // console.log(sortedKeys);
    document.getElementById("name").innerHTML = "question " + jsonData[sortedKeys[index]].q;
    document.getElementById("age").innerHTML =  "type " + jsonData[sortedKeys[index]].type;
    if (jsonData[sortedKeys[index]].type == "mc"){
        document.getElementById("email").innerHTML = "answers " + Object.keys(jsonData[sortedKeys[index]].a).length;
        for (let i = 1; i < Object.keys(jsonData[sortedKeys[index]].a).length + 1; i++){
            createButton(jsonData[sortedKeys[index]].a[i]);
        }
    }else{
        document.getElementById("slider").style.display = "flex";
        document.getElementById("email").innerHTML = "r";
    }
    // document.cookie = "username="+jsonData[sortedKeys[index]].name+"; expires= 18 Dec 2025 UTC"; 
    // alert(document.cookie);
    
    index++;
    console.log('Index ' + index);
    if (index >= Object.keys(jsonData).length) {
        index = 0;
    }
}

function createButton(value){
    const template = document.getElementById("button-template");
    const button = template.content.firstElementChild.cloneNode(true);
    button.textContent = value;
    document.getElementById("buttons").appendChild(button);
    
}

function clearButtons(){
    const buttonContainer = document.getElementById("buttons");
    buttonContainer.innerHTML = "";
}
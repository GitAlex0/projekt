// Assuming the JSON file is named 'data.json' and located in the same directory as the HTML file

// Fetch the JSON data and apply it to a div
let jsonData;
var index = 0;
let randomizedKeys;

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


// umbennen, Namensbedeutung unbekannt
function fu() {
    console.log(jsonData);
    console.log(Object.keys(jsonData).length);
    console.log('Successfully loaded data');
    randomizedKeys = shuffleKeys(Object.keys(jsonData));
}


function next() {
    clearButtons();
    populateQuiz(jsonData[randomizedKeys[index]]);
    index++;
    console.log('Index ' + index);
    if (index >= Object.keys(jsonData).length) {
        index = 0;
        //Sollte stattdessen zur Ergebnis Seite gehen
    }
}

function populateQuiz(question){
    document.getElementById("name").innerHTML =   "question " + question.q;
    document.getElementById("age").innerHTML =  "type " + question.type;

    if (question.type == "mc"){
        document.getElementById("email").innerHTML = "answers " + Object.keys(question.a).length;
        for (let i = 1; i < Object.keys(question.a).length + 1; i++){
            createButton(question.a[i]);
        }
    }else{
        document.getElementById("slider-container").style.display = "flex";
        console.log("done");
        document.getElementById("email").innerHTML = "r";
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
    const sliderContainer = document.getElementById("slider-container");
    sliderContainer.style.display = "none";
}

//nicht implementiert
function saveCookie(){
    document.cookie = index+"="+jsonData[sortedKeys[index]].q+";";
    console.log(document.cookie)
}

function shuffleKeys(keys){
    for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
}
let jsonData;
var index = 0;
let randomize = true;
let randomizedKeys;
let pubProgress;

async function fetchData() {
    try {
        const response = await fetch('quiz.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        jsonData = await response.json();
        fu();
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
    randomizedKeys = randomize ? generateQuestionOrder(Object.keys(jsonData), findOrder(Object.keys(jsonData))) : Object.keys(jsonData);
}


function next() {
    clearButtons();
    populateQuiz(jsonData[randomizedKeys[index]]);
    
    console.log('Index ' + index);
    let progress = index + 1;
    progress = progress / Object.keys(jsonData).length * 100
    progress = Math.round(progress);
    pubProgress = progress;
    console.log(progress + "%");
    updateProgressBar(progress);

    
    index++;
    if (index >= Object.keys(jsonData).length) {
        console.log("0");
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

function findOrder(keys){
    const fixedOrder = {};
    for (let i = 0; i < keys.length; i++){
        if(jsonData[keys[i]].next){
            let key = keys[i];
            let value = jsonData[keys[i]].next;
            fixedOrder[key] = value;
        }
    }
    
    return fixedOrder;
}

function generateQuestionOrder(keys, fixedOrder) {
    const addedKeys = new Set();

    const remainingKeys = keys.filter(key => !Object.values(fixedOrder).includes(key));
    const randomizedKeys = shuffleKeys(remainingKeys);

    const finalOrder = [];
    randomizedKeys.forEach(key => {
        if (!addedKeys.has(key)) {
            finalOrder.push(key);
            addedKeys.add(key);
        }

        if (fixedOrder[key] && !addedKeys.has(fixedOrder[key])) {
            finalOrder.push(fixedOrder[key]);
            addedKeys.add(fixedOrder[key]);
        }
    });

    return finalOrder;
}


function updateProgressBar(progress){
    console.log(progress);
    bar = document.getElementById("progress");
    bar.value = progress;
    document.getElementById("pLabel").textContent = progress + " %";

}
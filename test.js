let ids;
const exampleData = {
    1: { q: "How are you", type: "mc", a: { 1: "Great", 2: "Fine", 3: "Not great", 4: "Really bad" }, s: "wellness" },
    2: { q: "What is your favorite color?", type: "mc", a: { 1: "Red", 2: "Blue", 3: "Green", 4: "Yellow" }, s: "colour",next:"3" },
    3: { q: "What is your favorite season?", type: "mc", a: { 1: "Spring", 2: "Summer", 3: "Autumn", 4: "Winter" }, s: "season" },
    4: { q: "How much do you agree?", type: "r", r: { min: 0, max:100 }, s: "rate", next:"5"},
};
for (let i = 1; i < Object.keys(exampleData).length; i++){
    printNumbers(exampleData[i]);
}
function printNumbers(number){
    // console.log(number);
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
        if(exampleData[keys[i]].next){
            let key = keys[i];
            let value = exampleData[keys[i]].next;
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

function resolveIds(){
    ids = JSON.parse(localStorage.getItem("answers"))
    console.log(ids);
    for (let i = 0; i < Object.keys(ids).length; i++){
        console.log(i);
        question = jsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].q
        answer = jsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].a[ids[Object.keys(ids)[i]]];
        console.log("Q: " + question + " A: " + answer)
    }
}
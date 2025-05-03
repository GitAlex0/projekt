let jsonData;
var index = 0;
let randomize = false;
let randomizedKeys;
let pubProgress;

async function fetchData() {
  try {
    const response = await fetch("quiz.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    jsonData = await response.json();
    fu();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

fetchData();
// umbennen, Namensbedeutung unbekannt
function fu() {
  console.log(jsonData);
  console.log(Object.keys(jsonData).length);
  console.log("Successfully loaded data");
  randomizedKeys = randomize ? retrieveOrder() : Object.keys(jsonData);
  
  console.log(randomizedKeys);
}

function retrieveOrder(){
    const storedOrder = localStorage.getItem("randomizedKeys");
    console.log(storedOrder)
    if(storedOrder){
        console.log("localStorage");
        return JSON.parse(storedOrder);
    } else{
      console.log("Fresh")
      result = generateQuestionOrder(Object.keys(jsonData), findOrder(Object.keys(jsonData)))
      localStorage.setItem("randomizedKeys", JSON.stringify(result))
      return result;
    }
}

//nicht implementiert
function saveCookie() {
  document.cookie = index + "=" + jsonData[sortedKeys[index]].q + ";";
  console.log(document.cookie);
}

function shuffleKeys(keys) {
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
}

function findOrder(keys) {
  const fixedOrder = {};
  for (let i = 0; i < keys.length; i++) {
    if (jsonData[keys[i]].next) {
      let key = keys[i];
      let value = jsonData[keys[i]].next;
      fixedOrder[key] = value;
    }
  }

  return fixedOrder;
}

function generateQuestionOrder(keys, fixedOrder) {
  const addedKeys = new Set();

  const remainingKeys = keys.filter(
    (key) => !Object.values(fixedOrder).includes(key)
  );
  const randomizedKeys = shuffleKeys(remainingKeys);

  const finalOrder = [];
  randomizedKeys.forEach((key) => {
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
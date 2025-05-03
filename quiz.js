let answers = {}
function next() {
  clearButtons();
  populateQuiz(jsonData[randomizedKeys[index]]);

  console.log("Index " + index);
  let progress = index + 1;
  progress = (progress / Object.keys(jsonData).length) * 100;
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

function populateQuiz(question) {
    console.log(question);
  document.getElementById("name").innerHTML = "question " + question.q;
  document.getElementById("age").innerHTML = "type " + question.type;

  if (question.type == "mc") {
    document.getElementById("email").innerHTML =
      "answers " + Object.keys(question.a).length;
    for (let i = 1; i < Object.keys(question.a).length + 1; i++) {
      createButton(question.a[i], i);
    }
  } else {
    document.getElementById("slider-container").style.display = "flex";
    console.log("done");
    document.getElementById("email").innerHTML = "r";
  }
}

function createButton(value, id) {
  const template = document.getElementById("button-template");
  const button = template.content.firstElementChild.cloneNode(true);
  button.textContent = value;
  button.id = id;
  document.getElementById("buttons").appendChild(button);
}

function clearButtons() {
  const buttonContainer = document.getElementById("buttons");
  buttonContainer.innerHTML = "";
  const sliderContainer = document.getElementById("slider-container");
  sliderContainer.style.display = "none";
}

function updateProgressBar(progress) {
  console.log(progress);
  bar = document.getElementById("progress");
  bar.value = progress;
  document.getElementById("pLabel").textContent = progress + " %";
}

function answerButtonPress(id){
    console.log(jsonData[index].q)
    console.log(id);
    console.log(jsonData[index].a[id])
    saveAnswer(index, id)
}

function saveAnswer(questionId, answerId){
    answers = JSON.parse(localStorage.getItem("answers")) || {}
    answers[questionId] = answerId
    localStorage.setItem("answers", JSON.stringify(answers))
    console.log(answers);
}
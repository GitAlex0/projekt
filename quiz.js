let answers = {};
function next() {
  console.log(document.cookie + "cookie");
  clearButtons();
  populateQuiz(jsonData[randomizedKeys[index]]);

  console.log("Index " + index);
  let progress = index + 1;
  progress = (progress / Object.keys(jsonData).length) * 100;
  progress = Math.round(progress);
  pubProgress = progress;
  console.log(progress + "%");
  updateProgressBar(progress);
  setCookieIndex(index);
  index++;
  if (index >= Object.keys(jsonData).length) {
    console.log("0 reset");
    index = 0;
    //Sollte stattdessen zur Ergebnis Seite gehen
  }
}

function populateQuiz(question) {
  console.log(question);
  document.getElementById("question").innerHTML = question.q;

  if (question.type == "mc") {
    for (let i = 1; i < Object.keys(question.a).length + 1; i++) {
      createButton(question.a[i], i, randomizedKeys[index]);
    }
  } else {
    let slider = document.getElementById("slider");
    slider.dataset.index = randomizedKeys[index];
    console.log(jsonData[randomizedKeys[index]].q + 'slider')
    if(localStorage.getItem("answers") !== null) {slider.setAttribute("value", JSON.parse(localStorage.getItem("answers"))[randomizedKeys[index]]) || slider.setAttribute("value", 0)}
    document.getElementById("slider-container").style.display = "flex";
    console.log("done");
  }
}

function createButton(value, id, questionId) {
  const template = document.getElementById("button-template");
  const button = template.content.firstElementChild.cloneNode(true);
  button.textContent = value;
  button.dataset.id = id;
  button.dataset.questionId = questionId;
  document.getElementById("buttons").appendChild(button);

  answers = JSON.parse(localStorage.getItem("answers")) || {};
  selected = answers[questionId];
  console.log(selected + 'selected' + questionId);
  if (id == selected) {
    button.setAttribute("id", "selected");
  }
}

function clearButtons() {
  const buttonContainer = document.getElementById("buttons");
  buttonContainer.innerHTML = "";
  const sliderContainer = document.getElementById("slider-container");
  sliderContainer.style.display = "none";
}

function updateProgressBar(progress) {
  bar = document.getElementById("progress");
  bar.value = progress;
  document.getElementById("pLabel").textContent = progress + " %";
}

function inputSlider(slider) {
  console.log(slider.value);
  let output = document.getElementById("value");
  let value = slider.value;
  questionIndex = parseInt(slider.dataset.index)
  console.log("slider index above")
  output.innerHTML = value;
  saveAnswer(questionIndex, value)
}

function answerButtonPress(button) {
  buttonId = button.dataset.id;
  questionId = button.dataset.questionId;
  console.log(questionId + "buttonpress");
  console.log(jsonData[questionId].q);
  console.log(button.dataset.questionId);
  console.log(jsonData[questionId].a[buttonId]);
  saveAnswer(questionId, buttonId);

  let other = document.getElementsByClassName("quiz-button");
  Array.from(other).forEach((el) => {
    el.removeAttribute("id");
  });
  button.setAttribute("id", "selected");
}

function saveAnswer(questionId, answerId) {
  answers = JSON.parse(localStorage.getItem("answers")) || {};
  answers[questionId] = answerId;
  localStorage.setItem("answers", JSON.stringify(answers));
  console.log(answers);
}
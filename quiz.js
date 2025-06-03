let answers = {};
document.addEventListener('DOMContentLoaded', function() {
    var bar = new ProgressBar.Line('#progress-bar', {
        strokeWidth: 8,
        color: '#96BE93',
        trailColor: '#e3e3e3',
        trailWidth: 8,
        easing: 'easeInOut',
        svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
        text: { autoStyleContainer: false },
        from: { color: '#96BE93' },
        to: { color: '#96BE93' },
        step: (state, bar) => {
            let percent = Math.round(bar.value() * 100);
            document.getElementById('pLabel').textContent = percent + ' %';
        }
    });
    window.setProgress = function(percent) {
        bar.animate(percent / 100);
    };

    setProgress(0);
});
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
  setProgress(progress);
  setCookieIndex(index);
  index++;
  if (index >= Object.keys(jsonData).length) {
    console.log("0 reset");
    index = 0;
    document.getElementById("nextBtn").style.display="none"
    document.getElementById("resultBtn").style.display="flex"
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

  if(question.timed){
    let stopwatchContainer = document.getElementById("timed")
    let lockContainer = document.getElementById("lock")
    stopwatchContainer.style.display = "flex"
    lockContainer.style.display = "flex"

    console.log("timed question")
    console.log(keepTime(randomizedKeys[index], true))
  }else{
    let lockOpenContainer = document.getElementById("lock-open")
    lockOpenContainer.style.display = "flex"
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
  const stopwatchContainer = document.getElementById("timed");
  stopwatchContainer.style.display = "none"
  let lockContainer = document.getElementById("lock")
  lockContainer.style.display = "none"
  let lockOpenContainer = document.getElementById("lock-open")
  lockOpenContainer.style.display = "none"
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
  let time;
  buttonId = button.dataset.id;
  questionId = button.dataset.questionId;
  console.log(questionId + "buttonpress");
  console.log(jsonData[questionId].q);
  console.log(button.dataset.questionId);
  console.log(jsonData[questionId].a[buttonId]);
  timed = jsonData[questionId].timed
  if(timed){
    console.log("timed button press")
    
    time = keepTime(questionId, false)
    console.log(time + "pressed")
  }

  saveAnswer(questionId, buttonId, time);

  let other = document.getElementsByClassName("quiz-button");
  Array.from(other).forEach((el) => {
    el.removeAttribute("id");
    if(timed){ el.setAttribute("disabled", true)}
  });
  button.setAttribute("id", "selected");
}

function saveAnswer(questionId, answerId, time=false) {
  answers = JSON.parse(localStorage.getItem("answers")) || {};
  answers[questionId] = answerId;
  localStorage.setItem("answers", JSON.stringify(answers));
  console.log(answers);

  if(time){
  console.log(time)
  times = JSON.parse(localStorage.getItem("times")) || {}
  times[questionId] = time
  localStorage.setItem("times", JSON.stringify(times));
  console.log(times);
}
}

function keepTime(timeID, start=true){
  cookie = document.cookie
  regex = new RegExp(`${timeID}=(\\d+)`)
  let match = cookie.match(regex)
  // console.log(timeID + start + match)
  if(!match && start){
    date = new Date();
    //7 Tage Limit  
    date.setDate(date.getDate() + 7);
    //10 Minuten Limit
    // date.setTime(date.getTime() + 10 * 60 * 1000);
    date = date.toUTCString();
    newCookie = timeID + "=" + Date.now() + "; expires=" + date
    document.cookie = newCookie;
    return "Timer started"
  }else if(match && !start){
    time = Date.now() - match[1]
    time = time /1000
    document.cookie = timeID + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    return time;
  }else if(match && start){
    return "Timer already running, continue..."
  }else{
    return "keepTime Error, no Match found"
  }
}



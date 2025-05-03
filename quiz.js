function createButton(value) {
    const template = document.getElementById("button-template");
    const button = template.content.firstElementChild.cloneNode(true);
    button.textContent = value;
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
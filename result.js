let result = "";
let ljsonData;
// const skillCounts = {};
let skillData;
let descriptionData;
let minMatch = 50;

async function fetchSkillData() {
  try {
    const response = await fetch("skills.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    skillData = await response.json();
    fetchDescriptionData()
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function fetchDescriptionData() {
  try {
    const response = await fetch("descriptions.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    descriptionData = await response.json();
    loadJSONData();
    if (!isDrucken()) {
        checkAnswers(); // Only run this on interactive pages!
    }else{
        populateResultsDrucken();
        populateAttributesDrucken();
    }
    // On drucken.html, only the DOMContentLoaded hook will run the print-specific functions
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

fetchSkillData();

function runAfterFetchSkillData(){
    console.log(skillData);
}

function loadJSONData(){
    ljsonData = JSON.parse(localStorage.getItem("jsonData"))
}
function resolveIds(){
    ids = JSON.parse(localStorage.getItem("answers"))
    for (let i = 0; i < Object.keys(ids).length; i++){
        if(ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].type == "mc"){
            question = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].q
            answer = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].a[ids[Object.keys(ids)[i]]];
            console.log("Q: " + question + " A: " + answer)
            result += question;
            result += answer;
            let time;
            if(ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].timed){
                time = JSON.parse(localStorage.getItem("times"))[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]]
                console.log("Time taken: " + time)
                result += time;
            }
        }else{
            question = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].q
            approval = ids[parseInt(i) + 1]
            console.log("Q: " + question + " Approval: " + approval);
            result += question;
            result += approval
        }
    }
    // console.log(result);
    document.getElementById("result").innerHTML = result;
}
document.addEventListener("DOMContentLoaded", function() {
    loadJSONData();
    // resolveIds();
});


function mapTimePoints(val, max, zero){
    if(val <= max){return 100};
    if(val >= zero){return 0};
    return Math.floor(((zero-val) / (zero-max))*100)
}

function checkAnswers(){
    localStorage.setItem("points", JSON.stringify({}));

    ids = JSON.parse(localStorage.getItem("answers"))
    times = JSON.parse(localStorage.getItem("times"))
    for (let i = 0; i < Object.keys(ids).length; i++){
        console.log("Index: " + i);
        skill = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].skill
        questionType = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].type
        correctAnswerId = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].c
        timed = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].timed
        
        //mc & c
        if(questionType == "mc" && correctAnswerId){
            console.log("Type: mc-c")
            givenAnswerId =  ids[Object.keys(ids)[i]];
            
            if(givenAnswerId == correctAnswerId){
                if(timed){
                    time = times[Object.keys(times)[i]]
                    console.log("time taken: " + time + "s, max: " + timed.max + "s, zero: " + timed.zero + "s")
                    givePoints(skill, mapTimePoints(time, timed.max,timed.zero))
                    
                }else{
                    console.log("great job")
                    givePoints(skill, 100)
                }
            }else{
                console.log("WRONG")
                //no points
            }
        }

        //mc & nc
        if(questionType == "mc" && !correctAnswerId){
            console.log("Type: mc-nc")
            givenAnswerId =  ids[Object.keys(ids)[i]];
            length = Object.keys(ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].a).length
            points = Math.floor((givenAnswerId - 1) / (length - 1)*100)
            console.log("skill: " + skill + " givenAnswerId: " + givenAnswerId + " length: " + length + " points: " + points)
            givePoints(skill, points);
        }

        //r
        if(questionType == "r"){
            console.log("Type: r")
            rating = ids[Object.keys(ids)[i]]
            givePoints(skill, rating)
        }

        if(questionType == "i"){
            console.log("Type: i")
            givenAnswerId = ids[Object.keys(ids)[i]]
            if(givenAnswerId == correctAnswerId){
                givePoints(skill, 100)
            }else{console.log("WRONG")}
        }

        console.log('-'.repeat(10));
    }
    calculateJobs()
}

function countQuestions(){
    const skillCounts = {};
    Object.values(ljsonData).forEach(entry =>{
        if(entry.skill){skillCounts[entry.skill] = (skillCounts[entry.skill] || 0) + 1;}
    })
    return(skillCounts);
}


function givePoints(skill, points){
    sC = countQuestions();
    pointsO = JSON.parse(localStorage.getItem("points")) || {};
    if(sC[skill]){
        rP=points/sC[skill]
        console.log("\"" + skill + "\"-Points given: "+ rP)
        pointsO[skill] = (pointsO[skill] || 0) + rP;
        localStorage.setItem("points", JSON.stringify(pointsO));
    }
    // printPoints()
}

function printPoints(){
    p = localStorage.getItem("points") || JSON.stringify({})
    document.getElementById("points").innerHTML = p
    j = localStorage.getItem("jobScore") || JSON.stringify({})
    document.getElementById("jobScore").innerHTML = j
}

function calculateJobs(){
    pointsO = JSON.parse(localStorage.getItem("points")) || {}
    jobScore = {}
    jobTopSkills = {}

    for(const job of Object.keys(skillData)){
        const jobSkills = skillData[job];
        let score = 0;
        let maxScore = 0;
        let skillScores = [];

        for(const skill of Object.keys(jobSkills)){
            const weight = jobSkills[skill];
            const userPoints = pointsO[skill] || 0;
            score += userPoints * weight;
            maxScore += 100 * weight;
            const skillPercent = (userPoints / 100) * 100;
            skillScores.push({ skill, score: Math.round(skillPercent) });
        }
        jobScore[job] = maxScore > 0 ? (score / maxScore) * 100 : 0;

        skillScores.sort((a, b) => b.score - a.score);
        jobTopSkills[job] = skillScores.slice(0, 3);
    }
    localStorage.setItem("jobScore", JSON.stringify(jobScore));
    localStorage.setItem("jobTopSkills", JSON.stringify(jobTopSkills));
    console.log(jobScore)
    console.log(jobTopSkills)
    saveData(pointsO, jobScore, jobTopSkills);
    populateResults()
}

function populateResults(){
    jobScore = JSON.parse(localStorage.getItem("jobScore")) || {}
    jobTopSkills = JSON.parse(localStorage.getItem("jobTopSkills")) || {}

    const sortedJobs = Object.keys(jobScore).sort((a, b) => jobScore[b] - jobScore[a]);
    let jobIndex = 1;
    for(const job of sortedJobs){
        console.log("Job: " + job + ", Score: " + jobScore[job] + ", Top Scores: " + JSON.stringify(jobTopSkills[job]));
        
        if(jobScore[job] >= minMatch){
            console.log(job ,Math.floor(jobScore[job]), jobTopSkills[job], jobIndex)

            makeResultCard(job ,Math.floor(jobScore[job]), jobTopSkills[job], jobIndex)
            jobIndex++;
        }
        console.log('-'.repeat(10));
    }
}
function makeTempCard(){
    skills = [{"skill":"colour","score":Math.floor(Math.random()*100)},{"skill":"rate","score":Math.floor(Math.random()*100)}]
    makeResultCard("Toller Job", Math.floor(Math.random()*100), skills, Math.floor((Math.random()*10)+1))
}

function makeResultCard(job="none", score=0, skills, index){
    const template = document.getElementById("result-template");
    const card = template.content.cloneNode(true);

    const container = card.querySelector(".result-box");
    const title = container.querySelector(".jobName");
    const jobRank = container.querySelector(".jobRanking");
    const description = container.querySelector(".jobDescription")
    description.textContent = descriptionData[job].description;

    jobRank.textContent = index + `.\xa0`;

    const jobBarDiv = container.querySelector(".scoreBar");
    const jobLabel = container.querySelector(".scoreLabel");
    const jobBar = new ProgressBar.Line(jobBarDiv, {
        strokeWidth: 8,
        color: '#14213D',
        trailColor: '#e3e3e3',
        trailWidth: 8,
        easing: 'easeInOut',
        duration: 800,
        svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
        step: (state, bar) => {
            const val = Math.round(bar.value() * 100);
            jobLabel.textContent = val + " %";
            if(bar.value()>0.5){
              container.querySelector(".scoreLabelDiv").style.color = "#fff"
            }else{
                container.querySelector(".scoreLabelDiv").style.color = "#14213D"
            }
        }
    });
    jobBar.set(0);

    const skillBars = container.querySelectorAll(".attributeBar");
    const skillLabels = container.querySelectorAll(".attributeLabel");
    const skillNameLabels = container.querySelectorAll(".attributeNameLabel");
    const skillBarObjs = [];

    for(let i=0; i<skills.length; i++){
        skillBars[i].style.display='inline';
        skillLabels[i].style.display='inline';
        skillNameLabels[i].style.display='inline';

        const skillBar = new ProgressBar.Line(skillBars[i], {
            strokeWidth: 8,
            color: '#14213D',
            trailColor: '#e3e3e3',
            trailWidth: 8,
            easing: 'easeInOut',
            duration: 800,
            svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
            step: (state, bar) => {
                const val = Math.round(bar.value() * 100);
                skillLabels[i].textContent = val + " %";
            }
        });
        skillBar.set(0);
        skillBars[i]._progressbar = skillBar;
        skillNameLabels[i].textContent = descriptionData[skills[i].skill].name;
        skillBars[i].setAttribute('data-bar-value', skills[i].score / 100);
        skillBarObjs.push({
            bar: skillBar,
            value: skills[i].score / 100
        });
    }
    title.textContent = descriptionData[job].name;

    document.getElementById("results").appendChild(card);
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                jobBar.animate(score / 100);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(container);

}

// Helper: Detect if we're on drucken.html
function isDrucken() {
    return window.location.pathname.endsWith("drucken.html");
}

// --- DRUCKEN.HTML SPECIFIC FUNCTIONS ---
function makeDruckenResultCard(job = "none", score = 0, skills, index) {
    const template = document.getElementById("result-template");
    if (!template) return;
    const card = template.content.cloneNode(true);

    const container = card.querySelector(".result-box");
    const title = container.querySelector(".jobName");
    const jobRank = container.querySelector(".jobRanking");
    const description = container.querySelector(".jobDescription");
    const nameLabel = container.querySelector(".attributeNameLabel");
    if (descriptionData && descriptionData[job]) {
        description.textContent = descriptionData[job].description;
        title.textContent = descriptionData[job].name;
    } else {
        description.textContent = "";
        title.textContent = job;
    }
    jobRank.textContent = index + `.\xa0`;

    // Score Bar
    const jobBarDiv = container.querySelector(".scoreBar");
    const jobLabelDiv = container.querySelector(".scoreLabelDiv");
    let jobLabel = container.querySelector(".scoreLabel");
    if (!jobLabel) {
        jobLabel = document.createElement("span");
        jobLabel.className = "scoreLabel";
        jobLabelDiv.appendChild(jobLabel);
    }
    jobLabel.textContent = Math.round(score) + " %";
    // Draw static bar (no animation for print)
    if (typeof ProgressBar !== "undefined" && jobBarDiv) {
        let bar = new ProgressBar.Line(jobBarDiv, {
            strokeWidth: 8,
            color: '#14213D',
            trailColor: '#e3e3e3',
            trailWidth: 8,
            svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
            duration: 0
        });
        bar.set(score / 100);
    }

    // Skills/Attributes (if present in template)
    const skillBars = container.querySelectorAll(".attributeBar");
    const skillLabels = container.querySelectorAll(".attributeLabel");
    const skillNameLabels = container.querySelectorAll(".attributeNameLabel");
    for (let i = 0; i < skills.length; i++) {
        if (skillBars[i]) {
            skillBars[i].style.display = 'inline';
            if (typeof ProgressBar !== "undefined") {
                let bar = new ProgressBar.Line(skillBars[i], {
                    strokeWidth: 8,
                    color: '#14213D',
                    trailColor: '#e3e3e3',
                    trailWidth: 8,
                    svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
                    duration: 0
                });
                bar.set(skills[i].score / 100);
            }
        }
        if (skillLabels[i]) {
            skillLabels[i].style.display = 'inline';
            skillLabels[i].textContent = Math.round(skills[i].score) + " %";
        }
        if (skillNameLabels[i]) {
            skillNameLabels[i].style.display = 'inline';
            // Use styled name from descriptionData, fallback to key if missing
            const skillKey = skills[i].skill;
            if (descriptionData && descriptionData[skillKey] && descriptionData[skillKey].name) {
                skillNameLabels[i].textContent = descriptionData[skillKey].name;
            } else {
                skillNameLabels[i].textContent = skillKey;
            }
        }
    }

    // Append to body (or a dedicated container if you add one)
    let resultsDiv = document.getElementById("results");
    if (!resultsDiv) {
        resultsDiv = document.createElement("div");
        resultsDiv.id = "results";
        document.body.appendChild(resultsDiv);
    }
    resultsDiv.appendChild(card);
}

// --- OVERRIDE/HOOK FOR DRUCKEN ---
function populateResultsDrucken() {
    const jobScore = JSON.parse(localStorage.getItem("jobScore")) || {};
    const jobTopSkills = JSON.parse(localStorage.getItem("jobTopSkills")) || {};
    const sortedJobs = Object.keys(jobScore).sort((a, b) => jobScore[b] - jobScore[a]);
    let jobIndex = 1;
    for (const job of sortedJobs) {
        if (jobScore[job] >= minMatch) {
            makeDruckenResultCard(job, Math.floor(jobScore[job]), jobTopSkills[job], jobIndex);
            jobIndex++;
        }
    }
}

function populateAttributesDrucken() {
    // Lade die Attribute-Daten aus dem LocalStorage (hier: "points")
    let attributeScores = JSON.parse(localStorage.getItem("points")) || {};

    // In ein Array umwandeln und absteigend sortieren
    let sortedAttributes = Object.entries(attributeScores)
        .sort((a, b) => b[1] - a[1]);

    const template = document.getElementById("attribute-template");
    const listDiv = document.getElementById("ListAttributes");
    if (!template || !listDiv) return;

    // Vorherigen Inhalt löschen
    listDiv.innerHTML = "";

    sortedAttributes.forEach(([skillKey, score]) => {
        console.log("skillKey:", skillKey);
        console.log("descriptionData keys:", Object.keys(descriptionData));
        console.log("descriptionData[skillKey]:", descriptionData[skillKey]);
        const card = template.content.cloneNode(true);
        const nameLabel = card.querySelector(".attributeNameLabel");
        const scoreLabel = card.querySelector(".attributeLabel");
        const barDiv = card.querySelector(".attributeBar");
        console.log(skillKey)
        console.log(descriptionData)
        // Nutze den Namen direkt aus descriptionData, fallback auf skillKey
        if (nameLabel) {
            if (descriptionData && descriptionData[skillKey] && descriptionData[skillKey].name) {
                nameLabel.textContent = descriptionData[skillKey].name;
            } else {
                nameLabel.textContent = skillKey;
            }
        }
        if (scoreLabel) scoreLabel.textContent = Math.round(score) + " %";

        // Statische ProgressBar für Druck
        if (typeof ProgressBar !== "undefined" && barDiv) {
            let bar = new ProgressBar.Line(barDiv, {
                strokeWidth: 8,
                color: '#14213D',
                trailColor: '#e3e3e3',
                trailWidth: 8,
                svgStyle: {width: '100%', height: '100%', borderRadius: '2vh', display: 'block'},
                duration: 0
            });
            bar.set(score / 100);
        }

        listDiv.appendChild(card);
    });
}

// --- MAIN HOOK ---
// document.addEventListener("DOMContentLoaded", function () {
//     if (isDrucken()) {
//         populateResultsDrucken();
//         populateAttributesDrucken(); // <--- NEU: Attribute-Liste befüllen
//     } else {
//         loadJSONData();
//         // resolveIds(); // Uncomment if needed
//     }
// });

function downloadPDF() {
    // Select the results section you want to export
    var element = document.getElementById('results');
    // Optional: customize options for A4, margins, etc.
    var opt = {
        margin:       0.5,
        filename:     'BO-Test-O-Mat-Ergebnisse.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function toggleAttributes(button) {
    const attributesDiv = button.nextElementSibling;
    attributesDiv.classList.toggle('visible');

    if (attributesDiv.classList.contains('visible')) {
        const skillBars = attributesDiv.querySelectorAll('.attributeBar');
        const skillLabels = attributesDiv.querySelectorAll('.attributeLabel');
        skillBars.forEach((barDiv, i) => {
            if (barDiv._progressbar) {
                const value = parseFloat(barDiv.getAttribute('data-bar-value')) || 0;
                barDiv._progressbar.animate(value);
            }
        });
    }
}
function toggleAll(){
    let buttons = document.getElementsByClassName("toggleButton")
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].nextElementSibling.classList.add('visible');
    }
}

function saveData(points, jobScore, jobTopSkills){
    ids = JSON.parse(localStorage.getItem("answers"))
    time = JSON.parse(localStorage.getItem("totalTime"))
    stats = {time: time, url: window.location.href}
    saveDataToDB(ids, points, jobScore, jobTopSkills, stats)
}
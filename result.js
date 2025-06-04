let result = "";
let ljsonData;
// const skillCounts = {};
let skillData;
let minMatch = 50;

async function fetchSkillData() {
  try {
    const response = await fetch("skills.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    skillData = await response.json();
    loadJSONData();
    checkAnswers();
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
    printPoints()
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
    console.log(index + "This is the mRC Index")
    const template = document.getElementById("result-template");
    const card = template.content.cloneNode(true);

    const container = card.querySelector(".result-box");
    const title = container.querySelector(".jobName");
    const jobRank = container.querySelector(".jobRanking");

    jobRank.textContent = index + `.\xa0`;

    const jobBar = container.querySelectorAll(".scoreBar")[0]
    const jobLabel = container.querySelectorAll(".scoreLabel")[0]
    jobBar.value = Math.floor(score);
    jobLabel.textContent = jobBar.value + " %"

    for(i=0; i<skills.length; i++){
        console.log(skills[i].skill + skills[i].score);
        let skillBar = container.querySelectorAll(".attributeBar")[i]
        let skillLabel = container.querySelectorAll(".attributeLabel")[i]
        let skillNameLabel = container.querySelectorAll(".attributeNameLabel")[i]

        skillBar.style.display='inline'
        skillLabel.style.display='inline'
        skillNameLabel.style.display='inline'

        skillBar.value = skills[i].score
        skillLabel.textContent = skillBar.value + " %"
        skillNameLabel.textContent = skills[i].skill
    }
    title.textContent = job



    document.getElementById("results").appendChild(card)
}

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
}
function toggleAll(){
    let buttons = document.getElementsByClassName("toggleButton")
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].nextElementSibling.classList.add('visible');
    }
}

function saveData(points, jobScore, jobTopSkills){
    ids = JSON.parse(localStorage.getItem("answers"))

    saveDataToDB(ids, points, jobScore, jobTopSkills)
}
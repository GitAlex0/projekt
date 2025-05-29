let result = "";
let ljsonData;
// const skillCounts = {};

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
    resolveIds();
});


function mapTimePoints(val, max, zero){
    if(val <= max){return 100};
    if(val >= zero){return 0};
    return Math.floor(((zero-val) / (zero-max))*100)
}

function checkAnswers(){
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
}
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


function checkAnswers(){
    ids = JSON.parse(localStorage.getItem("answers"))
    for (let i = 0; i < Object.keys(ids).length; i++){
        console.log(i);
        skill = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].skill
        questionType = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].type
        correctAnswerId = ljsonData[Object.keys(JSON.parse(localStorage.getItem("answers")))[i]].c

        //mc & c
        if(questionType == "mc" && correctAnswerId){
            console.log("mc-c")
            givenAnswerId =  ids[Object.keys(ids)[i]];
            if(givenAnswerId == correctAnswerId){
                console.log("great job")
                givePoints(skill, 100)
            }else{
                console.log("WRONG")
                //no points
            }
        }
        if(questionType == "mc" && !correctAnswerId){
            givenAnswerId =  ids[Object.keys(ids)[i]];
            console.log(givenAnswerId)
            console.log("mc-nc")
            console.log(skill)
        }
        if(questionType == "r"){
            console.log("r")
            rating = ids[Object.keys(ids)[i]]
            givePoints(skill, rating)
        }
        console.log('-'.repeat(10));
    }
}

function countQuestions(){
    const skillCounts = {};
    Object.values(ljsonData).forEach(entry =>{
        if(entry.skill){
            skillCounts[entry.skill] = (skillCounts[entry.skill] || 0) + 1;
        }
    })
    return(skillCounts);
}


function givePoints(skill, points){
    sC = countQuestions();
    if(sC[skill]){
        console.log("true" + skill);
        rP=points/sC[skill]
        console.log(rP)
    }
}
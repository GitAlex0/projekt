let result;
let ljsonData;

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
    console.log(result);
    document.getElementById("result").innerHTML = result;
}
loadJSONData()
resolveIds()
// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://mkyhoyqtovtxxtydpgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reWhveXF0b3Z0eHh0eWRwZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDM4ODYsImV4cCI6MjA2NDYxOTg4Nn0.Z72P5s69JUiOCZSBE39kS_BhjLPIaux44znvRU2APJo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function saveDataToDB(answers={}, points={}, jobScore={}, jobTopSkills={}, stats={}){
    const { error } = await supabase
  .from('bo-db')
  .insert({ answers: answers, points: points, jobScore: jobScore, jobTopSkills: jobTopSkills, stats: stats})
console.log("saved data to db")

}
async function read() {
    let { data, error } = await supabase
        .from('test')
        .select('*');
    console.log(data);
}

async function deleteRow() {
    const { data, error } = await supabase
  .from('bo-db')
  .delete()
  .contains('test', true);

if (error) {
  console.error('Error deleting rows:', error);
} else {
  console.log('Deleted rows:', data);
}
}
async function deleteRowsWithMyCoolValue() {
    const { data, error } = await supabase
        .from('bo-db')
        .delete()
        .contains('stats', 19.795);

    if (error) {
        console.error('Error deleting rows:', error);
    } else {
        console.log('Deleted rows:', data);
    }
}


function prints(){
    console.log("ohimpriting")
}

async function getJobWithHighestAverageScore() {
    // 1. Fetch all jobScore columns
    const { data, error } = await supabase
        .from('bo-db')
        .select('jobScore');

    if (error) {
        console.error('Error fetching jobScores:', error);
        return;
    }

    // 2. Aggregate scores
    const jobTotals = {};
    const jobCounts = {};

    data.forEach(row => {
        const jobScore = row.jobScore;
        if (jobScore) {
            Object.entries(jobScore).forEach(([job, score]) => {
                if (!jobTotals[job]) {
                    jobTotals[job] = 0;
                    jobCounts[job] = 0;
                }
                jobTotals[job] += score;
                jobCounts[job] += 1;
            });
        }
    });

    // 3. Calculate averages
    const jobAverages = {};
    Object.keys(jobTotals).forEach(job => {
        jobAverages[job] = jobTotals[job] / jobCounts[job];
    });

    // 4. Find job with highest average
    let bestJob = null;
    let bestAvg = -Infinity;
    Object.entries(jobAverages).forEach(([job, avg]) => {
        if (avg > bestAvg) {
            bestAvg = avg;
            bestJob = job;
        }
    });

    console.log('Job with highest average:', bestJob, 'Average score:', bestAvg);
    return { job: bestJob, average: bestAvg };
}

async function getJobAverages() {
    const { data, error } = await supabase
        .from('bo-db')
        .select('jobScore');

    if (error) {
        console.error('Error fetching jobScores:', error);
        return;
    }

    const jobTotals = {};
    const jobCounts = {};

    data.forEach(row => {
        const jobScore = row.jobScore;
        if (jobScore) {
            Object.entries(jobScore).forEach(([job, score]) => {
                if (!jobTotals[job]) {
                    jobTotals[job] = 0;
                    jobCounts[job] = 0;
                }
                jobTotals[job] += score;
                jobCounts[job] += 1;
            });
        }
    });

    const jobAverages = {};
    Object.keys(jobTotals).forEach(job => {
        jobAverages[job] = jobTotals[job] / jobCounts[job];
    });

    console.log('Average score for each job:', jobAverages);
    return jobAverages;
}

async function showJobAveragesChart() {
    // Get the averages from your db.js function
    const jobAverages = await getJobAverages();

    // Sort jobs by average descending
    const sorted = Object.entries(jobAverages)
        .sort((a, b) => b[1] - a[1]);

    const labels = sorted.map(([job]) => job);
    const data = sorted.map(([_, avg]) => avg);

    // Draw the chart
    const ctx = document.getElementById('jobAveragesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Durchschnittlicher Score',
                data: data,
                backgroundColor: 'rgba(20, 33, 61, 0.7)',
                borderColor: 'rgba(20, 33, 61, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            // Remove or comment out the next line to make bars vertical (going up)
            // indexAxis: 'y',
            scales: {
                y: { // y axis is now vertical
                    beginAtZero: true
                }
            }
        }
    });
}

async function getSkillAverages() {
    const { data, error } = await supabase
        .from('bo-db')
        .select('points');

    if (error) {
        console.error('Error fetching points:', error);
        return;
    }

    const skillTotals = {};
    const skillCounts = {};

    data.forEach(row => {
        let points = row.points;
        // If points is a string, parse it
        if (typeof points === "string") {
            try {
                points = JSON.parse(points);
            } catch (e) {
                points = {};
            }
        }
        if (points) {
            Object.entries(points).forEach(([skill, value]) => {
                if (!skillTotals[skill]) {
                    skillTotals[skill] = 0;
                    skillCounts[skill] = 0;
                }
                skillTotals[skill] += value;
                skillCounts[skill] += 1;
            });
        }
    });

    const skillAverages = {};
    Object.keys(skillTotals).forEach(skill => {
        skillAverages[skill] = skillTotals[skill] / skillCounts[skill];
    });

    console.log('Average value for each skill:', skillAverages);
    return skillAverages;
}

async function showSkillAveragesChart() {
    const skillAverages = await getSkillAverages();

    // Sort skills by average descending
    const sorted = Object.entries(skillAverages)
        .sort((a, b) => b[1] - a[1]);

    const labels = sorted.map(([skill]) => skill);
    const data = sorted.map(([_, avg]) => avg);

    // Draw the chart
    const ctx = document.getElementById('skillAveragesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Durchschnittlicher Skill-Wert',
                data: data,
                backgroundColor: 'rgba(252, 163, 17, 0.7)',
                borderColor: 'rgba(252, 163, 17, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function showAverageTime() {
    // 1. Fetch all stats columns
    const { data, error } = await supabase
        .from('bo-db')
        .select('stats');

    if (error) {
        console.error('Error fetching stats:', error);
        return;
    }

    // 2. Extract time values
    let times = [];
    data.forEach(row => {
        let stats = row.stats;
        // If stats is a string, parse it
        if (typeof stats === "string") {
            try {
                stats = JSON.parse(stats);
            } catch (e) {
                stats = {};
            }
        }
        if (stats && typeof stats.time === "number") {
            times.push(stats.time);
        }
    });

    // 3. Calculate average
    const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;

    // 4. Format as mm:ss
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
    }

    // 5. Show in the page
    let el = document.getElementById('averageTime');
    if (!el) {
        el = document.createElement('p');
        el.id = 'averageTime';
        document.body.insertBefore(el, document.getElementById('jobAveragesChart'));
    }
    el.textContent = `⏱ Durchschnittliche Zeit: ${formatTime(avg)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    showJobAveragesChart();
    showAverageTime();
    showSkillAveragesChart()
});
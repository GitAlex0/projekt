// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://mkyhoyqtovtxxtydpgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reWhveXF0b3Z0eHh0eWRwZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDM4ODYsImV4cCI6MjA2NDYxOTg4Nn0.Z72P5s69JUiOCZSBE39kS_BhjLPIaux44znvRU2APJo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Helper functions for cookies
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Initialize onlyTestOMatRows from cookie if present
let onlyTestOMatRows = getCookie('onlyTestOMatRows') === 'true';

function prints(){
    console.log("ohimpriting")
}

async function getJobWithHighestAverageScore() {
    const { data, error } = await supabase
        .from('bo-db')
        .select('jobScore, stats');

    if (error) {
        console.error('Error fetching jobScores:', error);
        return;
    }

    const filteredData = filterRowsByUrl(data);

    // 2. Aggregate scores
    const jobTotals = {};
    const jobCounts = {};

    filteredData.forEach(row => {
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
        .select('jobScore, stats');

    if (error) {
        console.error('Error fetching jobScores:', error);
        return;
    }

    const filteredData = filterRowsByUrl(data);

    const jobTotals = {};
    const jobCounts = {};

    filteredData.forEach(row => {
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

async function getSkillAverages() {
    const { data, error } = await supabase
        .from('bo-db')
        .select('points, stats');

    if (error) {
        console.error('Error fetching points:', error);
        return;
    }

    const filteredData = filterRowsByUrl(data);

    const skillTotals = {};
    const skillCounts = {};

    filteredData.forEach(row => {
        let points = row.points;
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
    const { data, error } = await supabase
        .from('bo-db')
        .select('stats');

    if (error) {
        console.error('Error fetching stats:', error);
        return;
    }

    const filteredData = filterRowsByUrl(data);

    // 2. Extract time values
    let times = [];
    filteredData.forEach(row => {
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

async function deleteRowsWithEmptyPoints() {
    // 1. Fetch all rows with uuid and points
    const { data, error } = await supabase
        .from('bo-db')
        .select('uuid, points');

    if (error) {
        console.error('Error fetching rows:', error);
        return;
    }

    // 2. Find rows where points is an empty object
    const uuidsToDelete = data
        .filter(row => {
            // If points is a string, parse it
            let points = row.points;
            if (typeof points === "string") {
                try {
                    points = JSON.parse(points);
                } catch (e) {
                    points = {};
                }
            }
            // Check if points is an empty object
            return points && typeof points === "object" && Object.keys(points).length === 0;
        })
        .map(row => row.uuid);

    if (uuidsToDelete.length === 0) {
        console.log('No rows to delete.');
        return;
    }

    // 3. Delete those rows
    const { error: deleteError } = await supabase
        .from('bo-db')
        .delete()
        .in('uuid', uuidsToDelete);

    if (deleteError) {
        console.error('Error deleting rows:', deleteError);
    } else {
        console.log('Deleted rows with uuids:', uuidsToDelete);
    }
}

async function showTotalRowCount() {
    const { data, count, error } = await supabase
        .from('bo-db')
        .select('stats', { count: 'exact' });

    if (error) {
        console.error('Error fetching row count:', error);
        return;
    }

    const filteredData = filterRowsByUrl(data);
    const filteredCount = filteredData.length;

    let el = document.getElementById('totalRowCount');
    if (!el) {
        el = document.createElement('p');
        el.id = 'totalRowCount';
        document.body.insertBefore(el, document.body.firstChild);
    }
    el.textContent = `Teilnehmerzahl: ${filteredCount}`;
}

function filterRowsByUrl(data) {
    if (!onlyTestOMatRows) return data;
    return data.filter(row => {
        let stats = row.stats;
        if (typeof stats === "string") {
            try { stats = JSON.parse(stats); } catch (e) { stats = {}; }
        }
        return stats && stats.url === "https://test-o-mat.me/result.html";
    });
}

// Toggle creation
function createToggle() {
    let toggleDiv = document.createElement('div');
    toggleDiv.style.margin = "1em 0";
    toggleDiv.innerHTML = `
        <label>
            <input type="checkbox" id="toggleTestOMatRows" ${onlyTestOMatRows ? "checked" : ""}>
            Nur Teilnehmer mit URL "https://test-o-mat.me/result.html" anzeigen
        </label>
    `;
    document.body.insertBefore(toggleDiv, document.body.firstChild);

    document.getElementById('toggleTestOMatRows').addEventListener('change', function() {
        onlyTestOMatRows = this.checked;
        setCookie('onlyTestOMatRows', onlyTestOMatRows);
        location.reload(); // Refresh the page to apply the filter everywhere
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createToggle();
    showJobAveragesChart();
    showAverageTime();
    showSkillAveragesChart();
    showTotalRowCount();
});
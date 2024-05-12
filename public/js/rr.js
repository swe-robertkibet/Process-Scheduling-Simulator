document.getElementById("rrForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var numProcesses = parseInt(document.getElementById("numProcesses").value);
    var timeQuantum = parseInt(document.getElementById("timeQuantum").value);
    var arrivalTimes = [];
    var burstTimes = [];

    for (var i = 1; i <= numProcesses; i++) {
        arrivalTimes.push(parseInt(document.getElementById("arrivalTime" + i).value));
        burstTimes.push(parseInt(document.getElementById("burstTime" + i).value));
    }

    // Perform RR simulation and calculate results
    var remainingTimes = burstTimes.slice(); // Array to store remaining burst times
    var completionTimes = new Array(numProcesses).fill(0); // Array to store completion times
    var turnaroundTimes = new Array(numProcesses).fill(0); // Array to store turnaround times
    var waitingTimes = new Array(numProcesses).fill(0); // Array to store waiting times
    var currentTime = 0;
    var quantumUsed = new Array(numProcesses).fill(0); // Array to store quantum usage for each process

    while (true) {
        var allProcessesCompleted = true;

        for (var i = 0; i < numProcesses; i++) {
            if (remainingTimes[i] > 0) {
                allProcessesCompleted = false;

                // Execute the process for the time quantum or its remaining burst time, whichever is smaller
                var executionTime = Math.min(timeQuantum, remainingTimes[i]);
                remainingTimes[i] -= executionTime;
                currentTime += executionTime;
                quantumUsed[i] += executionTime;

                if (remainingTimes[i] === 0) {
                    completionTimes[i] = currentTime;
                    turnaroundTimes[i] = completionTimes[i] - arrivalTimes[i];
                    waitingTimes[i] = Math.max(0, turnaroundTimes[i] - burstTimes[i]); // Ensure waiting time is not negative
                }
            }
        }

        if (allProcessesCompleted) {
            break;
        }
    }

    // Calculate average turnaround time and average waiting time
    var totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
    var averageTurnaroundTime = totalTurnaroundTime / numProcesses;

    var totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
    var averageWaitingTime = totalWaitingTime / numProcesses;

    // Display results and generate Gantt chart
    displayResults(completionTimes, turnaroundTimes, waitingTimes, averageTurnaroundTime, averageWaitingTime);
    generateGanttChart(completionTimes, burstTimes, quantumUsed);

    // Explain the results
    explainRRResults(completionTimes, turnaroundTimes, waitingTimes, averageTurnaroundTime, averageWaitingTime);

    // Scroll to the results div
    var resultsDiv = document.getElementById("results");
    resultsDiv.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("numProcesses").addEventListener("change", function () {
    var numProcesses = parseInt(this.value);
    var processInputs = document.getElementById("processInputs");
    processInputs.innerHTML = "";

    for (var i = 1; i <= numProcesses; i++) {
        var processDiv = document.createElement("div");
        processDiv.innerHTML =
            '<label for="arrivalTime' +
            i +
            '">Arrival Time for Process ' +
            i +
            "</label>" +
            '<input type="number" id="arrivalTime' +
            i +
            '" name="arrivalTime' +
            i +
            '" required>' +
            '<label for="burstTime' +
            i +
            '">Burst Time for Process ' +
            i +
            "</label>" +
            '<input type="number" id="burstTime' +
            i +
            '" name="burstTime' +
            i +
            '" required>';
        processInputs.appendChild(processDiv);
    }
});

function displayResults(completionTimes, turnaroundTimes, waitingTimes, avgTurnaroundTime, avgWaitingTime) {
    // Display results
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
    <div class = "resultsHeading">
      <h2>Simulation Results</h2>
    </div>
      <table id="resultsTable">
        <tr><th>Process</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>
        ${completionTimes.map((time, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${time}</td>
            <td>${turnaroundTimes[index]}</td>
            <td>${waitingTimes[index]}</td>
          </tr>
        `).join('')}
      </table>
    <div class = "resultsAverage">
    <p><strong>Average Turnaround Time:</strong> ${avgTurnaroundTime.toFixed(2)}</p>
    <p><strong>Average Waiting Time:</strong> ${avgWaitingTime.toFixed(2)}</p>
    </div>
    `;

    // Apply table styles
    applyTableStyles();
}

function applyTableStyles() {
    var resultsTable = document.getElementById("resultsTable");
    resultsTable.style.width = "100%";
    resultsTable.style.borderCollapse = "collapse";

    var thList = resultsTable.getElementsByTagName("th");
    var tdList = resultsTable.getElementsByTagName("td");

    var cellList = Array.from(thList).concat(Array.from(tdList));

    cellList.forEach(function(cell) {
        cell.style.border = "1px solid #ddd";
        cell.style.padding = "8px";
        cell.style.textAlign = "center";
    });

    thList[0].style.backgroundColor = "#f2f2f2";

    for (var i = 0; i < tdList.length; i++) {
        if (i % 2 === 1) {
            tdList[i].style.backgroundColor = "#f2f2f2";
        }
    }
}

function generateGanttChart(completionTimes, burstTimes, quantumUsed) {
    var chartDiv = document.getElementById("ganttChart");

    // Clear any existing content in the chartDiv
    chartDiv.innerHTML = '';

    // Create the container div for the Gantt Chart
    var containerDiv = document.createElement("div");
    containerDiv.classList.add("gantt-container");

    // Create title for the Gantt Chart
    var title = document.createElement("div");
    title.classList.add("gantt-title");
    title.textContent = "Gantt Chart";
    containerDiv.appendChild(title);

    // Calculate the total duration of all processes
    var maxCompletionTime = Math.max(...completionTimes);

    // Calculate the width of each unit of time (1 unit = 10 pixels)
    var unitWidth = 10;

    // Create bars for each process
    for (var i = 0; i < completionTimes.length; i++) {
        var barDiv = document.createElement("div");
        barDiv.classList.add("gantt-bar");
        var width = burstTimes[i] * unitWidth;
        barDiv.style.width = width + "px";
        barDiv.style.backgroundColor = getRandomColor();

        // Add text label for process number and quantum usage
        var labelDiv = document.createElement("div");
        labelDiv.classList.add("gantt-label");
        labelDiv.textContent = "P" + (i + 1) + " (" + quantumUsed[i] + ")";
        barDiv.appendChild(labelDiv);

        containerDiv.appendChild(barDiv);
    }

    // Append the container div to the chartDiv
    chartDiv.appendChild(containerDiv);
}

// Function to generate random colors for the bars
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function explainRRResults(completionTimes, turnaroundTimes, waitingTimes, avgTurnaroundTime, avgWaitingTime) {
    var explanation = "<h2>Explanation of Round Robin Scheduling Results</h2><br>";
    
    // Explanation for completion times
    explanation += "<p><strong>Completion Times:</strong> Each process completes execution at the following times:<br>";
    for (var i = 0; i < completionTimes.length; i++) {
        explanation += "Process " + (i + 1) + " completes at time " + completionTimes[i] + ".<br>";
    }
    explanation += "</p>";
    
    // Explanation for turnaround times
    explanation += "<br><strong>Turnaround Times:</strong> Turnaround time for each process is calculated as the difference between completion time and arrival time. It represents the total time taken by a process from arrival to completion, including both waiting and execution time:<br>";
    for (var i = 0; i < turnaroundTimes.length; i++) {
        explanation += "Process " + (i + 1) + " has a turnaround time of " + turnaroundTimes[i] + ".<br>";
    }
    explanation += "</p>";
    
    // Explanation for waiting times
    explanation += "<br><strong>Waiting Times:</strong> Waiting time for each process is calculated as the difference between turnaround time and burst time. It indicates the time a process spends waiting in the ready queue before its execution begins:<br>";
    for (var i = 0; i < waitingTimes.length; i++) {
        explanation += "Process " + (i + 1) + " waits for " + waitingTimes[i] + " units of time.<br>";
    }
    explanation += "</p>";
    
    // Calculate total turnaround time and total waiting time
    var totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
    var totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
    
    // Explanation for average turnaround time and average waiting time
    explanation += "<br><strong>Average Turnaround Time:</strong> The average turnaround time across all processes is calculated as the total turnaround time divided by the number of processes. It indicates the average time taken from the arrival of a process to its completion, including waiting and execution time:<br>";
    explanation += "Average Turnaround Time = Total Turnaround Time / Number of Processes = " + totalTurnaroundTime.toFixed(2) + " / " + turnaroundTimes.length + " = " + avgTurnaroundTime.toFixed(2) + "<br>";
    
    explanation += "<br><strong>Average Waiting Time:</strong> The average waiting time across all processes is calculated as the total waiting time divided by the number of processes. It indicates the average time a process spends waiting in the ready queue before its execution starts:<br>";
    explanation += "Average Waiting Time = Total Waiting Time / Number of Processes = " + totalWaitingTime.toFixed(2) + " / " + waitingTimes.length + " = " + avgWaitingTime.toFixed(2) + "<br>";
    
    // Considering special cases or observations
    if (avgTurnaroundTime === avgWaitingTime) {
        explanation += "<br>When Average Turnaround Time is equal to Average Waiting Time, it suggests a balanced workload, where processes complete and wait for execution in similar durations.<br>";
    } else if (avgTurnaroundTime < avgWaitingTime) {
        explanation += "<br>When Average Turnaround Time is less than Average Waiting Time, it indicates efficient processing, with processes completing swiftly compared to their waiting times.<br>";
    } else {
        explanation += "<br>When Average Waiting Time is less than Average Turnaround Time, it suggests less efficient processing due to waiting, where processes spend more time waiting in the ready queue than completing execution.<br>";
    }
    
    // Display explanation in the #explainer div
    document.getElementById("explainer").innerHTML = explanation;
}

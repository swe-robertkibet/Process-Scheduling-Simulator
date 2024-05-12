document.getElementById("fcfsForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var numProcesses = parseInt(document.getElementById("numProcesses").value);
    var arrivalTimes = [];
    var burstTimes = [];

    for (var i = 1; i <= numProcesses; i++) {
        arrivalTimes.push(parseInt(document.getElementById("arrivalTime" + i).value));
        burstTimes.push(parseInt(document.getElementById("burstTime" + i).value));
    }

    // Perform FCFS simulation and calculate results
    var completionTimes = []; // Array to store completion times
    var turnaroundTimes = []; // Array to store turnaround times
    var waitingTimes = []; // Array to store waiting times

    // Calculate completion times
    var currentTime = 0;
    for (var i = 0; i < numProcesses; i++) {
        if (currentTime < arrivalTimes[i]) {
            currentTime = arrivalTimes[i]; // Correctly handle the case where a process arrives after the current time
        }
        currentTime += burstTimes[i];
        completionTimes.push(currentTime);
    }

    // Calculate turnaround times and waiting times
    for (var i = 0; i < numProcesses; i++) {
        turnaroundTimes.push(completionTimes[i] - arrivalTimes[i]);
        waitingTimes.push(turnaroundTimes[i] - burstTimes[i]);
    }

    // Calculate average turnaround time and average waiting time
    var totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
    var averageTurnaroundTime = totalTurnaroundTime / numProcesses;

    var totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
    var averageWaitingTime = totalWaitingTime / numProcesses;

    // Display results and generate Gantt chart
    displayResults(completionTimes, turnaroundTimes, waitingTimes, averageTurnaroundTime, averageWaitingTime);
    generateGanttChart(completionTimes, numProcesses);

    // Explain the results
    explainFCFSResults(completionTimes, turnaroundTimes, waitingTimes, averageTurnaroundTime, averageWaitingTime);


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


function generateGanttChart(completionTimes, numProcesses) {
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
    for (var i = 0; i < numProcesses; i++) {
        var barDiv = document.createElement("div");
        barDiv.classList.add("gantt-bar");
        barDiv.style.width = (completionTimes[i] * unitWidth) + "px";
        barDiv.style.backgroundColor = getRandomColor();

        // Add text label for process number
        var labelDiv = document.createElement("div");
        labelDiv.classList.add("gantt-label");
        labelDiv.textContent = "P" + (i + 1);
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


function explainFCFSResults(completionTimes, turnaroundTimes, waitingTimes, avgTurnaroundTime, avgWaitingTime) {
    var explanation = "<h2>Explanation of Scheduling Results</h2><br>";
    
    // Explanation for completion times
    explanation += "<p><strong>Completion Times</strong><br>";
    for (var i = 0; i < completionTimes.length; i++) {
        explanation += "Process " + (i + 1) + " completes at time " + completionTimes[i] + ".<br>";
    }
    
    // Explanation for turnaround times
    explanation += "<br><strong>Turnaround Times</strong><br>";
    for (var i = 0; i < turnaroundTimes.length; i++) {
        explanation += "Process " + (i + 1) + " has a turnaround time of " + turnaroundTimes[i] + ".<br>";
    }
    
    // Explanation for waiting times
    explanation += "<br><strong>Waiting Times</strong><br>";
    for (var i = 0; i < waitingTimes.length; i++) {
        explanation += "Process " + (i + 1) + " waits for " + waitingTimes[i] + " units of time.<br>";
    }
    
    // Explanation for average turnaround time and average waiting time
    explanation += "<br><strong>Average Turnaround Time:</strong> " + avgTurnaroundTime.toFixed(2) + "<br>";
    explanation += "<strong>Average Waiting Time:</strong> " + avgWaitingTime.toFixed(2) + "<br>";
    
    // Considering special cases or observations
    if (avgTurnaroundTime === avgWaitingTime) {
        explanation += "<br>Average Turnaround Time and Average Waiting Time are equal, indicating a balanced workload.<br>";
    } else if (avgTurnaroundTime < avgWaitingTime) {
        explanation += "<br>Average Turnaround Time is less than Average Waiting Time, indicating efficient processing.<br>";
    } else {
        explanation += "<br>Average Waiting Time is less than Average Turnaround Time, indicating less efficient processing due to waiting.<br>";
    }
    
    // Display explanation in the #explainer div
    document.getElementById("explainer").innerHTML = explanation;
}




















// function generateGanttChart(completionTimes, numProcesses) {
//     var chartDiv = document.getElementById("ganttChart");

//     // Clear any existing content in the chartDiv
//     chartDiv.innerHTML = '';

//     // Create the SVG element for the chart
//     var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svg.setAttribute("width", "100%"); // Set width to 100% of viewport width
//     svg.setAttribute("height", "200");

//     // Create title for the Gantt Chart
//     var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
//     title.setAttribute("x", "50%");
//     title.setAttribute("y", "30");
//     title.setAttribute("font-size", "20");
//     title.setAttribute("text-anchor", "middle");
//     title.textContent = "Gantt Chart";
//     svg.appendChild(title);

//     // Calculate the total duration of all processes
//     var maxCompletionTime = Math.max(...completionTimes);

//     // Calculate the width of each unit of time (1 unit = 10 pixels)
//     var unitWidth = 10;

//     // Create bars for each process
//     for (var i = 0; i < numProcesses; i++) {
//         var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//         rect.setAttribute("x", completionTimes[i] * unitWidth);
//         rect.setAttribute("y", 50);
//         rect.setAttribute("width", (completionTimes[i] - (i === 0 ? 0 : completionTimes[i - 1])) * unitWidth);
//         rect.setAttribute("height", 50);
//         rect.setAttribute("fill", getRandomColor());
//         rect.setAttribute("stroke", "black");
//         rect.setAttribute("stroke-width", "1");
//         svg.appendChild(rect);

//         // Add text label for process number
//         var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
//         var center = completionTimes[i] * unitWidth - 5 + ((completionTimes[i] - (i === 0 ? 0 : completionTimes[i - 1])) * unitWidth) / 2;
//         text.setAttribute("x", center);
//         text.setAttribute("y", 130);
//         text.setAttribute("font-size", "12");
//         text.setAttribute("text-anchor", "middle");
        
//         // Adjust label position if it overlaps with neighboring labels
//         if (i > 0 && center - text.getBBox().width / 2 < completionTimes[i-1] * unitWidth + text.getBBox().width / 2) {
//             text.setAttribute("x", completionTimes[i-1] * unitWidth + text.getBBox().width / 2 + 5);
//         }
        
//         text.textContent = "P" + (i + 1);
//         svg.appendChild(text);
//     }

//     // Add horizontal axis
//     var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     xAxis.setAttribute("x1", 0);
//     xAxis.setAttribute("y1", 100);
//     xAxis.setAttribute("x2", maxCompletionTime * unitWidth);
//     xAxis.setAttribute("y2", 100);
//     xAxis.setAttribute("stroke", "black");
//     xAxis.setAttribute("stroke-width", "2");
//     svg.appendChild(xAxis);

//     // Append the SVG element to the chartDiv
//     chartDiv.appendChild(svg);
// }


// // Function to generate random colors for the bars
// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

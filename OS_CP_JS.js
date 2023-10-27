document.getElementById('submitBtn').addEventListener('click', function () {
    const algorithm = document.getElementById('algorithm').value;
    const numProcesses = parseInt(document.getElementById('numProcesses').value);

    const processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const process = {
            pid: i + 1,
            arrival_time: parseInt(prompt(`Enter arrival time for Process ${i + 1}:`)),
            burst_time: parseInt(prompt(`Enter burst time for Process ${i + 1}:`))
        };
        processes.push(process);
    }

    // Display process information in the table
    const processTableBody = document.getElementById('processTableBody');
    processTableBody.innerHTML = '';

    processes.forEach((process) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>P${process.pid}</td><td>${process.arrival_time}</td><td>${process.burst_time}</td>`;
        processTableBody.appendChild(row);
    });

    // The rest of your scheduling algorithm visualization code can go here
    // ...

    const timelineElement = document.getElementById('timeline');
    timelineElement.innerHTML = '';

    if (algorithm === 'fcfs') {
        fcfsSchedulerVisualize(processes);
    } else if (algorithm === 'sjf') {
        sjfSchedulerVisualize(processes);
    } else if (algorithm === 'lrtf') {
        lrtfSchedulerVisualize(processes);
    } else if (algorithm === 'srtf') {
        srtfSchedulerVisualize(processes);
    } else if (algorithm === 'priority') {
        prioritySchedulerVisualize(processes);
    } else if (algorithm === 'roundrobin') {
        const quantum = parseInt(prompt('Enter time quantum for Round Robin:'));
        roundRobinSchedulerVisualize(processes, quantum);
    }

    // For demonstration purposes, you can clear the input fields after submitting
    // document.getElementById('algorithm').value = '';
    // document.getElementById('numProcesses').value = '';
});





// document.getElementById('submitBtn').addEventListener('click', function () {
//     const algorithm = document.getElementById('algorithm').value;
//     const numProcesses = parseInt(document.getElementById('numProcesses').value);

//     const processes = [];

//     for (let i = 0; i < numProcesses; i++) {
//         const process = {
//             pid: i + 1,
//             arrival_time: parseInt(prompt(`Enter arrival time for Process ${i + 1}:`)),
//             burst_time: parseInt(prompt(`Enter burst time for Process ${i + 1}:`))
//         };
//         processes.push(process);
//     }

//     const timelineElement = document.getElementById('timeline');
//     timelineElement.innerHTML = '';

//     if (algorithm === 'fcfs') {
//         fcfsSchedulerVisualize(processes);
//     } else if (algorithm === 'sjf') {
//         sjfSchedulerVisualize(processes);
//     } else if (algorithm === 'lrtf') {
//         lrtfSchedulerVisualize(processes);
//     } else if (algorithm === 'srtf') {
//         srtfSchedulerVisualize(processes);
//     } else if (algorithm === 'priority') {
//         prioritySchedulerVisualize(processes);
//     } else if (algorithm === 'roundrobin') {
//         const quantum = parseInt(prompt('Enter time quantum for Round Robin:'));
//         roundRobinSchedulerVisualize(processes, quantum);
//     }
// });

function fcfsSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;
    
    let currentTime = 0;

    for (const process of processes) {
        if (currentTime < process.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = process.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        // setTimeout(() => {
        //     processElement.classList.add('active');
        // }, currentTime * animationDuration);
        
        // setTimeout(() => {
        //     processElement.classList.remove('active');
        // }, (currentTime + process.burst_time) * animationDuration);

        currentTime += process.burst_time;
    }
}

function sjfSchedulerVisualize(processes) {

    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;
    
    const numProcesses = processes.length;
    const completed = new Array(numProcesses).fill(false);
    
    let currentTime = 0;
    let completedProcesses = 0;

    while (completedProcesses < numProcesses) {
        let shortestBurst = Infinity;
        let shortestIndex = -1;

        for (let i = 0; i < numProcesses; i++) {
            if (!completed[i] && processes[i].arrival_time <= currentTime && processes[i].burst_time < shortestBurst) {
                shortestBurst = processes[i].burst_time;
                shortestIndex = i;
            }
        }

        if (shortestIndex === -1) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - `;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime++;
            continue;
        }

        const process = processes[shortestIndex];
        completed[shortestIndex] = true;

        if (currentTime < process.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = process.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        // setTimeout(() => {
        //     processElement.classList.add('active');
        // }, currentTime * animationDuration);
        
        // setTimeout(() => {
        //     processElement.classList.remove('active');
        // }, (currentTime + process.burst_time) * animationDuration);

        currentTime += process.burst_time;
        completedProcesses++;
    }
}

function prioritySchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    processes.sort((a, b) => a.priority - b.priority);

    let currentTime = 0;

    for (const process of processes) {
        if (currentTime < process.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = process.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        currentTime += process.burst_time;
    }
}



function lrtfSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    processes.sort((a, b) => b.burst_time - a.burst_time);

    let currentTime = 0;

    while (processes.length > 0) {
        const availableProcesses = processes.filter((process) => process.arrival_time <= currentTime);
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        availableProcesses.sort((a, b) => b.burst_time - a.burst_time);
        const selectedProcess = availableProcesses[0];

        if (currentTime < selectedProcess.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${selectedProcess.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = selectedProcess.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${selectedProcess.pid} (${currentTime} - ${currentTime + 1})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        selectedProcess.burst_time--;

        if (selectedProcess.burst_time === 0) {
            const index = processes.indexOf(selectedProcess);
            if (index > -1) {
                processes.splice(index, 1);
            }
        }

        currentTime++;
    }
}



function srtfSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    let currentTime = 0;

    while (processes.length > 0) {
        const availableProcesses = processes.filter((process) => process.arrival_time <= currentTime);
        if (availableProcesses.length === 0) {
            currentTime++;
            continue;
        }

        availableProcesses.sort((a, b) => a.burst_time - b.burst_time);
        const selectedProcess = availableProcesses[0];

        if (currentTime < selectedProcess.arrival_time) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${selectedProcess.arrival_time}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = selectedProcess.arrival_time;
        }

        const processElement = document.createElement('div');
        processElement.textContent = `P${selectedProcess.pid} (${currentTime} - ${currentTime + 1})`;
        processElement.className = 'event';
        timelineElement.appendChild(processElement);

        selectedProcess.burst_time--;

        if (selectedProcess.burst_time === 0) {
            const index = processes.indexOf(selectedProcess);
            if (index > -1) {
                processes.splice(index, 1);
            }
        }

        currentTime++;
    }
}



function roundRobinSchedulerVisualize(processes, quantum) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    let currentTime = 0;

    while (processes.length > 0) {
        for (const process of processes) {
            if (process.arrival_time <= currentTime) {
                if (process.burst_time > quantum) {
                    const processElement = document.createElement('div');
                    processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + quantum})`;
                    processElement.className = 'event';
                    timelineElement.appendChild(processElement);

                    process.burst_time -= quantum;
                    currentTime += quantum;
                } else {
                    const processElement = document.createElement('div');
                    processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + process.burst_time})`;
                    processElement.className = 'event';
                    timelineElement.appendChild(processElement);

                    const index = processes.indexOf(process);
                    if (index > -1) {
                        processes.splice(index, 1);
                    }

                    currentTime += process.burst_time;
                }
            } else {
                currentTime++;
            }
        }
    }
}

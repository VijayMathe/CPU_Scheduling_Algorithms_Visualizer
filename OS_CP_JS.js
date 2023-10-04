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
});

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
    timelineElement.innerHTML = '';
    const animationDuration = 500;

    let currentTime = 0;
    const numProcesses = processes.length;

    while (!processes.every(process => process.completed)) {
        let highestPriorityProcess = null;

        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrival_time <= currentTime && !processes[i].completed) {
                if (
                    highestPriorityProcess === null ||
                    processes[i].priority < highestPriorityProcess.priority
                ) {
                    highestPriorityProcess = processes[i];
                }
            }
        }

        if (highestPriorityProcess === null) {
            // No ready processes, find the next arrival time
            const nextArrival = Math.min(
                ...processes.filter(p => !p.completed).map(p => p.arrival_time)
            );

            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - ${nextArrival}`;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime = nextArrival;
        } else {
            // Schedule the highest priority process
            const process = highestPriorityProcess;

            if (currentTime < process.arrival_time) {
                const idleElement = document.createElement('div');
                idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
                idleElement.className = 'event idle';
                timelineElement.appendChild(idleElement);
                currentTime = process.arrival_time;
            }

            const processElement = document.createElement('div');
            processElement.textContent = `P${process.pid} (${currentTime} - ${
                currentTime + process.burst_time
            })`;
            processElement.className = 'event';
            timelineElement.appendChild(processElement);

            setTimeout(() => {
                processElement.classList.add('active');
            }, currentTime * animationDuration);

            setTimeout(() => {
                processElement.classList.remove('active');
                process.completed = true;
            }, (currentTime + process.burst_time) * animationDuration);

            currentTime += process.burst_time;
        }
    }
}


function lrtfSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;
    
    let currentTime = 0;
    const numProcesses = processes.length;
    const completed = new Array(numProcesses).fill(false);

    while (!completed.every(process => process)) {
        let longestRemainingTime = -1;
        let longestIndex = -1;

        for (let i = 0; i < numProcesses; i++) {
            if (!completed[i] && processes[i].arrival_time <= currentTime) {
                const remainingTime = processes[i].burst_time;
                if (remainingTime > longestRemainingTime) {
                    longestRemainingTime = remainingTime;
                    longestIndex = i;
                }
            }
        }

        if (longestIndex === -1) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - `;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime++;
        } else {
            const process = processes[longestIndex];
            completed[longestIndex] = true;

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

            setTimeout(() => {
                processElement.classList.add('active');
            }, currentTime * animationDuration);

            setTimeout(() => {
                processElement.classList.remove('active');
            }, (currentTime + process.burst_time) * animationDuration);

            currentTime += process.burst_time;
        }
    }
}


function srtfSchedulerVisualize(processes) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    let currentTime = 0;
    const numProcesses = processes.length;
    const remainingTime = new Array(numProcesses);

    for (let i = 0; i < numProcesses; i++) {
        remainingTime[i] = processes[i].burst_time;
    }

    let completedProcesses = 0;

    while (completedProcesses < numProcesses) {
        let shortestRemainingTime = Infinity;
        let shortestIndex = -1;

        for (let i = 0; i < numProcesses; i++) {
            if (processes[i].arrival_time <= currentTime && remainingTime[i] < shortestRemainingTime && remainingTime[i] > 0) {
                shortestRemainingTime = remainingTime[i];
                shortestIndex = i;
            }
        }

        if (shortestIndex === -1) {
            const idleElement = document.createElement('div');
            idleElement.textContent = `Idle ${currentTime} - `;
            idleElement.className = 'event idle';
            timelineElement.appendChild(idleElement);
            currentTime++;
        } else {
            const process = processes[shortestIndex];
            remainingTime[shortestIndex]--;

            const processElement = document.createElement('div');
            processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + 1})`;
            processElement.className = 'event';
            timelineElement.appendChild(processElement);

            setTimeout(() => {
                processElement.classList.add('active');
            }, currentTime * animationDuration);

            setTimeout(() => {
                processElement.classList.remove('active');
                if (remainingTime[shortestIndex] === 0) {
                    completedProcesses++;
                }
            }, (currentTime + 1) * animationDuration);

            currentTime++;
        }
    }
}


function roundRobinSchedulerVisualize(processes, quantum) {
    const timelineElement = document.getElementById('timeline');
    const animationDuration = 500;

    let currentTime = 0;
    let completedProcesses = 0;
    const numProcesses = processes.length;
    const remainingTime = new Array(numProcesses).fill(0);

    while (completedProcesses < numProcesses) {
        for (let i = 0; i < numProcesses; i++) {
            if (remainingTime[i] > 0) {
                const timeSlice = Math.min(remainingTime[i], quantum);
                const process = processes[i];

                if (currentTime < process.arrival_time) {
                    const idleElement = document.createElement('div');
                    idleElement.textContent = `Idle ${currentTime} - ${process.arrival_time}`;
                    idleElement.className = 'event idle';
                    timelineElement.appendChild(idleElement);
                    currentTime = process.arrival_time;
                }

                const processElement = document.createElement('div');
                processElement.textContent = `P${process.pid} (${currentTime} - ${currentTime + timeSlice})`;
                processElement.className = 'event';
                timelineElement.appendChild(processElement);

                setTimeout(() => {
                    processElement.classList.add('active');
                }, currentTime * animationDuration);

                setTimeout(() => {
                    processElement.classList.remove('active');
                }, (currentTime + timeSlice) * animationDuration);

                remainingTime[i] -= timeSlice;
                currentTime += timeSlice;

                if (remainingTime[i] === 0) {
                    completedProcesses++;
                }
            }
        }
    }
}
const bells = new Audio("./sounds/bell.wav");
const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop"); 
const setBtn = document.querySelector(".btn-set"); 
const timeInput = document.querySelector(".time-input"); 
const session = document.querySelector(".minutes");
const secondsDiv = document.querySelector(".seconds");
let myInterval;
let state = true;

const appTimer = () => {
    if (state) {
        state = false;
        
        let minutes = Number.parseInt(session.textContent);
        let seconds = Number.parseInt(secondsDiv.textContent);
        let totalSeconds = minutes * 60 + seconds;

        if(totalSeconds === 0) {
             alert("Session has ended. Please set a new time.");
             state = true;
             return;
        }

        const updateSeconds = () => {
            const minuteDiv = document.querySelector(".minutes");
            const secondsDiv = document.querySelector(".seconds");

            totalSeconds--;

            let minutesLeft = Math.floor(totalSeconds / 60);
            let secondsLeft = totalSeconds % 60;

            if (secondsLeft < 10) {
                secondsDiv.textContent = "0" + secondsLeft;
            } else {
                secondsDiv.textContent = secondsLeft;
            }
            minuteDiv.textContent = `${minutesLeft}`;

            if (minutesLeft === 0 && secondsLeft === 0) {
                bells.play();
                clearInterval(myInterval);
                state = true; 
            }
        }
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert("Session has already started.");
    }
}

const stopTimer = () => {
    clearInterval(myInterval);
    state = true;
}

const setTime = () => {
    if(state) {
        let customMinutes = Number.parseInt(timeInput.value);
        if(customMinutes > 0){
             session.textContent = customMinutes;
             secondsDiv.textContent = "00";
        } else {
            alert("Please enter a valid number of minutes.");
        }
    } else {
        alert("Please stop the timer to change the time.");
    }
}

startBtn.addEventListener("click", appTimer);
stopBtn.addEventListener("click", stopTimer);
setBtn.addEventListener("click", setTime);
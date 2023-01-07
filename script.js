const buttonStartDiv = document.querySelector(".buttonStartDiv");
const startTimeBTN = document.querySelector(".startTimeBTN");
const actualMin = document.querySelector(".actualMin");
const actualSek = document.querySelector(".actualSek");

const pauseTimeBTN = document.createElement("button");
pauseTimeBTN.textContent = "Pauza";
pauseTimeBTN.className = "startPauseBTN";
pauseTimeBTN.classList.add("pauseTimeBTN");

const resetBTN = document.createElement("button");
resetBTN.textContent = "Reset";
resetBTN.className = "resetBTN";

let timer; // zmienna do czasu stopera
let timerRemoveResetBTN; // opóznienie uruchomienia funkcji removeResetBTN()

// po kliknięciu na przycisk start podmieniamy przycisk "start" na przycisk "pauza"
function startTimeDown() {
  console.log("klik startTimeDown");
  // buttonStartDiv.appendChild(pauseTimeBTN);   //też działą ale "repalceWith" jest krótsze
  // startTimeBTN.remove();
  startTimeBTN.replaceWith(pauseTimeBTN);
  pauseTimeBTN.addEventListener("click", pauseTime);
  timer = setInterval(timeDown, 1000); // uruchamiamy odliczanie czasu
  buttonStartDiv.appendChild(resetBTN);
  resetBTN.addEventListener("click", resetTime);
}

function pauseTime() {
  console.log("klik pauseTime");
  pauseTimeBTN.textContent = "Wznów";
  pauseTimeBTN.removeEventListener("click", pauseTime);
  pauseTimeBTN.addEventListener("click", wznowTime);
  // pauseTimeBTN.replaceWith(startTimeBTN);
  // startTimeBTN.addEventListener("click", startTimeDown);
  clearInterval(timer);
}

function wznowTime() {
  timer = setInterval(timeDown, 1000);
  pauseTimeBTN.textContent = "Pauza";
  pauseTimeBTN.removeEventListener("click", wznowTime);
  pauseTimeBTN.addEventListener("click", pauseTime);
}

function resetTime() {
  clearInterval(timer);
  actualMin.textContent = "25";
  actualSek.textContent = "00";
  resetBTN.classList.add("resetBTN0ff");
  pauseTimeBTN.replaceWith(startTimeBTN);
  timerRemoveResetBTN = setInterval(removeResetBTN, 1000); // uruchamiamy odliczanie czasu
}

function removeResetBTN() {
  resetBTN.classList.remove("resetBTN0ff");
  clearInterval(timerRemoveResetBTN);
  resetBTN.remove();
}

function timeDown() {
  let m = Number(actualMin.textContent);
  let s = Number(actualSek.textContent);
  if (s === 0) {
    s = 59;
    m -= 1;
  }
  s -= 1;
  s < 10 ? (s = "0" + s) : s;
  m < 10 ? (m = "0" + m) : m;
  // console.log(`-czas ${m} ${s}`);
  actualMin.textContent = m;
  actualSek.textContent = s;
}

startTimeBTN.addEventListener("click", startTimeDown);

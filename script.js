//Buttony
const plusTime = document.querySelector(".plusTime");
const minusTime = document.querySelector(".minusTime");
const buttonStartDiv = document.querySelector(".buttonStartDiv");
const btnPreviousDay = document.querySelector(".aboveTimeLine .setPreviousDay");
const btnNextDay = document.querySelector(".aboveTimeLine .setNexDay");
const btnDailyStatic = document.querySelector(".btnDailyStatic");

//upperWindowTime
const startTimeBTN = document.querySelector(".startTimeBTN");
const actualMin = document.querySelector(".actualMin");
const actualSek = document.querySelector(".actualSek");
const iconPause = document.querySelector(".iconPause");
const barOutside = document.querySelector(".barOutside");
const barInside = document.querySelector(".barInside");
const barProgres = document.querySelector(".barProgres");
const windowTime = document.querySelector(".windowTime");
const openWindowAddBeam = document.querySelector(".openWindowAddBeamBtn");

//lowerWindowTime
const displayActiveDay = document.querySelector(".aboveTimeLine .timeLineToday");
const svg = document.querySelector("svg");
const timeLine = document.querySelector(".timeLine");
const beamsDiv = document.querySelector(".beams");
const amountBeams = document.querySelector(".amountBeams");
const sumTimeBeams = document.querySelector(".sumTimeBeams");

//add beam window
const windowAddBeam = document.querySelector(".windowAddBeam");
const closeWindowAddBeam = document.querySelector(".btnCloseAddBeam");
const inputWindowAddBeam = document.querySelector(".windowAddBeam input");
const addBeamErrorMsg = document.querySelector(".addBeamErrorMsg");
const akceptWindowAddBeam = document.querySelector(".btnAddBeam");

const pauseTimeBTN = document.createElement("button");
pauseTimeBTN.textContent = "Pauza";
pauseTimeBTN.className = "startPauseBTN";
pauseTimeBTN.classList.add("pauseTimeBTN");

const resetBTN = document.createElement("button");
resetBTN.textContent = "Reset";
resetBTN.className = "resetBTN";

let timerDown; // dekramentacja minutnika
let timerRemoveResetBTN; // opóznienie uruchomienia funkcji removeResetBTN()

console.log(`START ${windowTime.classList.contains("increaseSizeWindowTime")}`);

//Uaktualnienie paska czasu
barProgres.style.width = countBarProgres(Number(actualMin.textContent), Number(actualSek.textContent));

// Pozwolenie  na powiadomienie o upływie czasu
if (Notification.permission === "granted") {
  console.log("mamy pozwolenie na powiadomienia");
} else if (Notification.permission !== "denied") {
  Notification.requestPermission().then((permission) => {
    console.log(permission);
  });
}

//######################  Obsługa WindowTime  ##################
// po kliknięciu na przycisk start podmieniamy przycisk "start" na przycisk "pauza"
function startTimeDown() {
  console.log("\x1B[31m  ---klik startTimeDown---");
  startTimeBTN.replaceWith(pauseTimeBTN);
  pauseTimeBTN.addEventListener("click", pauseTime);
  timerDown = setInterval(timeDown, 1000); // uruchamiamy odliczanie czasu
  buttonStartDiv.appendChild(resetBTN);
  resetBTN.addEventListener("click", resetTime);
  beam.addBeam(new Date());
}

function pauseTime() {
  console.log("\x1B[31m  ---klik pauseTime---");
  pauseTimeBTN.textContent = "Wznów";
  pauseTimeBTN.removeEventListener("click", pauseTime);
  pauseTimeBTN.addEventListener("click", resumeTime);
  iconPause.classList.toggle("show");
  clearInterval(timerDown);
}

function resumeTime() {
  console.log("\x1B[31m  ---klik wznówTime---");
  timerDown = setInterval(timeDown, 1000);
  pauseTimeBTN.textContent = "Pauza";
  iconPause.classList.toggle("show");
  pauseTimeBTN.removeEventListener("click", resumeTime);
  pauseTimeBTN.addEventListener("click", pauseTime);
}

function resetTime() {
  console.log("\x1B[31m  ---klik resetTime---");
  resetDisplayTime();
  beam.removeBeam("last");
}

// reset timera i menu w przypadku: konca czasu luk kliknięcia przycisku reset
function resetDisplayTime() {
  timerRemoveResetBTN = setTimeout(removeResetBTN, 500); // uruchamiamy odliczanie czasu animacji resetu
  pauseTimeBTN.removeEventListener("click", resumeTime);
  pauseTimeBTN.removeEventListener("click", pauseTime);
  clearInterval(timerDown);
  actualMin.textContent = "25";
  actualSek.textContent = "00";
  resetBTN.classList.add("resetBTN0ff");
  barProgres.style.width = countBarProgres(25, 0);
  beam.disactivateBeamPulse();
}

function removeResetBTN() {
  pauseTimeBTN.replaceWith(startTimeBTN);
  iconPause.classList.remove("show");
  pauseTimeBTN.textContent = "Pauza";
  resetBTN.classList.remove("resetBTN0ff");
  resetBTN.remove();
}

function changeSizeWindowTime() {
  if (windowTime.classList.contains("increaseSizeWindowTime")) {
    console.log("decrease");
    windowTime.classList.remove("increaseSizeWindowTime");
    windowTime.classList.add("decreaseSizeWindowTime");
    btnDailyStatic.classList.remove("upDown");
    btnDailyStatic.classList.add("downUp");
    btnDailyStatic.firstElementChild.classList.remove("fa-angles-up");
    btnDailyStatic.firstElementChild.classList.add("fa-angles-down");
  } else {
    console.log("increase");
    windowTime.classList.add("increaseSizeWindowTime");
    windowTime.classList.remove("decreaseSizeWindowTime");
    btnDailyStatic.classList.add("upDown");
    btnDailyStatic.classList.remove("downUp");
    btnDailyStatic.firstElementChild.classList.remove("fa-angles-down");
    btnDailyStatic.firstElementChild.classList.add("fa-angles-up");
  }
}

//######################  Obsługa czasu  ##################
function timeDown() {
  let m = Number(actualMin.textContent);
  let s = Number(actualSek.textContent);
  if (s === 0) {
    s = 60;
    m -= 1;
  }
  s -= 1;
  barProgres.style.width = countBarProgres(m, s); // musi być przed dodaniem ZERA gdy mamy liczbę <= 9
  s < 10 ? (s = "0" + s) : s;
  m < 10 ? (m = "0" + m) : m;
  // console.log(`-czas ${m} ${s}`);
  actualMin.textContent = m;
  actualSek.textContent = s;
  if (m === "03" && s === "00") left3Min();
  if (m <= 0 && s <= 0) timeIsUp();
}
function timeIsUp() {
  console.log(" czas miną, skończłeś naukę");
  new Audio("/sound/a.wav").play();
  new Notification("Koniec nauki", { icon: "timeIcon.png" });
  resetDisplayTime();
}

function left3Min() {
  console.log("3 min");
  new Notification("Zaraz koniec", {
    body: "Zostały 3 min",
    icon: "timeIcon.png",
    silent: true,
  });
}

function countBarProgres(m, s, setMin = 25, setSec = 0) {
  const allSecond = setMin * 60 + setSec;
  const leftSecond = m * 60 + s;
  const widthPrecent = (leftSecond * 100) / allSecond;
  return `${widthPrecent}%`;
}

function addOneMinute() {
  let m = Number(actualMin.textContent);
  if (m < 25) {
    m += 1;
    m < 10 ? (m = "0" + m) : m;
    if (m >= 25) actualSek.textContent = "00";
    barProgres.style.width = countBarProgres(m, Number(actualSek.textContent));
    actualMin.textContent = m;
  }
}
function minusOneMinute() {
  let m = Number(actualMin.textContent);
  if (m > 0) {
    m -= 1;
    m < 10 ? (m = "0" + m) : m;
    // if (m <= 0) actualSek.textContent = "00";
    barProgres.style.width = countBarProgres(m, Number(actualSek.textContent));
    actualMin.textContent = m;
  }
}

// ###################################  Ręczne dodawanie fasolek   ###################################
function openAddBeamWindow() {
  windowAddBeam.classList.add("active2");
}

function closeAddBeamWindow() {
  windowAddBeam.classList.remove("active2");
}

function addNewBeam() {
  console.log("++++++++++++ newBeam");
  const newBeamTime = inputWindowAddBeam.value.trim();
  console.log(newBeamTime);
  let errorHour = verificationInputNewBeam(newBeamTime);
  console.log("🚀  errorHour:", errorHour);

  if (!errorHour.flag) {
    inputWindowAddBeam.value = "";
    addBeamErrorMsg.textContent = "";
    // beam.addManuallyBeam(newBeamTime);,
  }
}

function verificationInputNewBeam(input) {
  let flagError = 0;
  let msg;

  let errorHour = {
    flag: 0,
    msg: "",
  };

  // gdy mamy godzine 9:15 a potrzebujemy 09:15
  if (input.length === 4 && input.slice(1, 2) == ":") {
    input = "0" + input;
  }

  if (input.length > 5) {
    errorHour.msg = "Za dużo znaków";
    errorHour.flag = 1;
  } else if (input.length < 5) {
    errorHour.msg = "Za mało znaków";
    errorHour.flag = 1;
  }
  if (input === "" || input == null) {
    errorHour.msg = "Brak godziny";
  }
  if (input.length == 5) {
    const h = parseInt(input.slice(0, 2));
    console.log("🚀  h:", h);
    const sign = input.slice(2, 3);
    console.log("🚀  sign:", sign);
    const m = parseInt(input.slice(3, 5));
    console.log("🚀  m:", m);

    if (h < 8 || h > 20) {
      errorHour.flag = 1;
      errorHour.msg = "Błędna godzina";
    }
    if (m < 0 || m > 60) {
      errorHour.flag = 1;
      errorHour.msg = "Błędne minuty";
    }
    if (sign !== ":") {
      errorHour.flag = 1;
      errorHour.msg = "Błędny  znak :";
    }

    if (/[a-zA-Z]/.test(input)) {
      errorHour.msg = "Nie poprawne znaki";
      errorHour.flag = 1;
    }

    // ostatni możliwy wpis to 20:00
    if (h === 20 && m > 0) {
      console.log("lala");
      errorHour.flag = 1;
      errorHour.msg = "Błędna godzina 20+";
    }
  }

  addBeamErrorMsg.textContent = errorHour.msg;

  return errorHour;
}

//#####################  Zmiana dni wyświetlania histori na TimeLine  ####################
function setNextDayTimeLine() {
  console.log("\x1b[32m** klik jutro  **");
  const activeDay = displayActiveDay.textContent;
  const newActiveDay = beam.changeDay(activeDay, "+");
  displayActiveDay.textContent = newActiveDay;
  beam.disactivateBTNNextDay(newActiveDay);
}

function setPreviousDayTimeLine() {
  console.log("\x1b[32m** klik wczoraj **");
  const activeDay = displayActiveDay.textContent;
  const newActiveDay = beam.changeDay(activeDay, "-");
  displayActiveDay.textContent = newActiveDay;
  beam.disactivateBTNPreviousDay(newActiveDay);
}
//############################# Rysowanei fasolek  #########################################################
const beam = new Beam();
displayActiveDay.textContent = new Date().displayDMY();
beam.render(displayActiveDay.textContent);

//######################  Listener ##################################
startTimeBTN.addEventListener("click", startTimeDown);
plusTime.addEventListener("click", addOneMinute);
minusTime.addEventListener("click", minusOneMinute);
btnDailyStatic.addEventListener("click", changeSizeWindowTime);

btnNextDay.addEventListener("click", setNextDayTimeLine);
btnPreviousDay.addEventListener("click", setPreviousDayTimeLine);
openWindowAddBeam.addEventListener("click", openAddBeamWindow);
closeWindowAddBeam.addEventListener("click", closeAddBeamWindow);
akceptWindowAddBeam.addEventListener("click", addNewBeam);

//#####################  DODATKOWE ANIMACJE  ############################
// animacja .ghost po nacisnieciu przycisku + lub -
plusTime.addEventListener("click", function (e) {
  // console.log(`x ${e.clientX}, y${e.clientY}`);
  // console.log(`top ${e.target.getBoundingClientRect().top}, sY ${scrollY}`);
  //pobieramy pozycje prostokąta obrysowanego
  let x = e.clientX - e.target.getBoundingClientRect().left;
  let y = e.clientY - e.target.getBoundingClientRect().top;

  const newSpan = document.createElement("span");
  newSpan.classList.add("ghost");
  newSpan.style.left = x + "px";
  newSpan.style.top = y + "px";
  this.appendChild(newSpan);

  // usuwamy spana po 500ms
  setTimeout(() => {
    document.querySelector(".ghost").remove();
  }, 500);
});

minusTime.addEventListener("click", function (e) {
  // console.log(`x ${e.clientX}, y${e.clientY}`);
  // console.log(`top ${e.target.getBoundingClientRect().top}, sY ${scrollY}`);
  //pobieramy pozycje prostokąta obrysowanego
  let x = e.clientX - e.target.getBoundingClientRect().left;
  let y = e.clientY - e.target.getBoundingClientRect().top;

  const newSpan = document.createElement("span");
  newSpan.classList.add("ghost");
  newSpan.style.left = x + "px";
  newSpan.style.top = y + "px";
  this.appendChild(newSpan);

  // usuwamy spana po 500ms
  setTimeout(() => {
    document.querySelector(".ghost").remove();
  }, 500);
});

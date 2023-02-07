const buttonStartDiv = document.querySelector(".buttonStartDiv");
const startTimeBTN = document.querySelector(".startTimeBTN");
const actualMin = document.querySelector(".actualMin");
const actualSek = document.querySelector(".actualSek");
const iconPause = document.querySelector(".iconPause");
const plusTime = document.querySelector(".plusTime");
const minusTime = document.querySelector(".minusTime");
const barOutside = document.querySelector(".barOutside");
const barInside = document.querySelector(".barInside");
const barProgres = document.querySelector(".barProgres");
const btnDailyStatic = document.querySelector(".btnDailyStatic");
const windowTime = document.querySelector(".windowTime");

const svg = document.querySelector("svg");
const timeLine = document.querySelector(".timeLine");

const pauseTimeBTN = document.createElement("button");
pauseTimeBTN.textContent = "Pauza";
pauseTimeBTN.className = "startPauseBTN";
pauseTimeBTN.classList.add("pauseTimeBTN");

const resetBTN = document.createElement("button");
resetBTN.textContent = "Reset";
resetBTN.className = "resetBTN";

const beam11 = {
  startTime: "as",
  stopTime: false,
};

// const person = {
//   isHuman: false,
//   printIntroduction: function () {
//     console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
//   },
// };

let timerDown; // dekramentacja minutnika
let timerRemoveResetBTN; // opóznienie uruchomienia funkcji removeResetBTN()

console.log(`START ${windowTime.classList.contains("increaseSizeWindowTime")}`);

//Uaktualnienie paska czasu
barProgres.style.width = countBarProgres(
  Number(actualMin.textContent),
  Number(actualSek.textContent)
);

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
  console.log("klik startTimeDown");
  // buttonStartDiv.appendChild(pauseTimeBTN);   //też działą ale "repalceWith" jest krótsze
  // startTimeBTN.remove();
  startTimeBTN.replaceWith(pauseTimeBTN);
  pauseTimeBTN.addEventListener("click", pauseTime);
  timerDown = setInterval(timeDown, 1000); // uruchamiamy odliczanie czasu
  buttonStartDiv.appendChild(resetBTN);
  resetBTN.addEventListener("click", resetTime);

  startBeam();
}

function pauseTime() {
  console.log("klik pauseTime");
  pauseTimeBTN.textContent = "Wznów";
  pauseTimeBTN.removeEventListener("click", pauseTime);
  pauseTimeBTN.addEventListener("click", resumeTime);
  iconPause.classList.toggle("show");
  clearInterval(timerDown);
  // iconPause.style.scale = 1; // pokazanie DiV
  // pauseTimeBTN.replaceWith(startTimeBTN);
  // startTimeBTN.addEventListener("click", startTimeDown);
}

function resumeTime() {
  console.log("klik wznówTime");
  timerDown = setInterval(timeDown, 1000);
  pauseTimeBTN.textContent = "Pauza";
  iconPause.classList.toggle("show");
  pauseTimeBTN.removeEventListener("click", resumeTime);
  pauseTimeBTN.addEventListener("click", pauseTime);
}

function resetTime() {
  console.log("klik resetTime");
  clearInterval(timerDown);
  actualMin.textContent = "25";
  actualSek.textContent = "00";
  resetBTN.classList.add("resetBTN0ff");
  pauseTimeBTN.removeEventListener("click", resumeTime);
  pauseTimeBTN.removeEventListener("click", pauseTime);
  barProgres.style.width = countBarProgres(25, 0);
  timerRemoveResetBTN = setTimeout(removeResetBTN, 500); // uruchamiamy odliczanie czasu animacji resetu
  stopBeam();
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
    windowTime.classList.remove("increaseSizeWindowTime");
    windowTime.classList.add("decreaseSizeWindowTime");
  } else {
    windowTime.classList.add("increaseSizeWindowTime");
    windowTime.classList.remove("decreaseSizeWindowTime");
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
  clearInterval(timerDown);
  new Audio("/sound/a.wav").play();
  new Notification("Koniec nauki", { icon: "timeIcon.png" });
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

//############################# Rysowanei fasolek  #########################################################

// class bean {
//   constructor() {
//     this.timeStart = new Date();
//     this.tiemStop;
//   }
// }

function startBeam() {
  beam11.startTime = new Date();
}

function stopBeam() {
  beam11.stopTime = new Date();
  beam11.duration = beam11.stopTime - beam11.startTime;
  // beam11.startTime.setHours(20);
  // beam11.startTime.setMinutes(0);
  // beam11.startTime.setSeconds(0);

  // beam11.startTime.setMilliseconds(0);
  console.log("🚀  startTime", beam11.startTime);

  let beam11div = document.createElement("div");
  beam11div.classList.add("beam11");
  timeLine.appendChild(beam11div);
  const widthTimeLine = document.querySelector(".hourLabel").clientWidth;
  const pxnaMin = widthTimeLine / (12 * 60); //ile px zajmuje jedna minuta na Timeline

  const hour8 = new Date(); // disiejszy dzień 8h
  hour8.setHours(8); //GTM+1
  hour8.setMinutes(0);
  hour8.setSeconds(0);
  hour8.setMilliseconds(0);

  const minAfter8 = Math.round((beam11.startTime - hour8) / (60 * 1000)); // róznica czasu
  const leftOffset = minAfter8 * pxnaMin;

  document.documentElement.style.setProperty("--beamLeft", leftOffset + "px");
}

//######################  Listener ##################################
startTimeBTN.addEventListener("click", startTimeDown);
plusTime.addEventListener("click", addOneMinute);
minusTime.addEventListener("click", minusOneMinute);
btnDailyStatic.addEventListener("click", changeSizeWindowTime);

//#####################  DODATKOWE ANIMACJE  ############################
// animacja .ghost po nacisnieciu przycisku + lub -
plusTime.addEventListener("click", function (e) {
  console.log(`x ${e.clientX}, y${e.clientY}`);
  console.log(`top ${e.target.getBoundingClientRect().top}, sY ${scrollY}`);
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
  console.log(`x ${e.clientX}, y${e.clientY}`);
  console.log(`top ${e.target.getBoundingClientRect().top}, sY ${scrollY}`);
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

// const links = document.querySelectorAll("a");
// links.forEach((btn) =>
//   btn.addEventListener("click", function (e) {
//     console.log(e.clientX + "x");
//     console.log(e.clientY + "Y");

//     console.log(e.target.offsetLeft + "left");
//     console.log(e.target.offsetTop + "top");

//     //   console.log(e.target);

//     let x = e.clientX - e.target.offsetLeft;
//     console.log(x);
//     let y = e.clientY - e.target.offsetTop;
//     console.log(y);

//     const newSpan = document.createElement("span");
//     newSpan.style.left = x + "px";
//     newSpan.style.top = y + "px";
//     this.appendChild(newSpan);
//   })
// );
// barProgres.addEventListener("click", (e) => {
//   let width = e.offsetX;
//   console.log(width);
// });

// U+02228  encja >
// U+022CE encja > lekko zakrzywiona

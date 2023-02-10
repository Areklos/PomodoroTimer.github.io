//Tworzenie fasolek na osi czasu
console.log("\x1b[1mbeamC");
class Beam {
  constructor() {
    this.allBeams = [
      { start: new Date("2023-02-01 8:00:00"), stop: new Date("2023-02-01 8:25:00") },
      { start: new Date("2023-02-01 10:00:00"), stop: new Date("2023-02-01 10:25:00") },
      { start: new Date("2023-02-01 12:00:00"), stop: new Date("2023-02-01 12:25:00") },
    ];
  }

  // w forEach rysujemy wszystkie fasolki które były w bazie danych
  printAllBeams() {
    this.allBeams.forEach((e, i) => {
      this.printBeam(i);
    });
  }

  // Rysujemy na timeline jedną fasolke
  printBeam(i) {
    const beam = this.allBeams[i];
    const startPrint = beam.start;
    console.log(`\x1B[34m Fasolka nr: ${i} - ${startPrint.hms()}`);
    const eightHour = 8 * 60;
    const minutesLeftOffset = startPrint.getMinutes() + startPrint.getHours() * 60 - eightHour;
    const widthTimeLine = document.querySelector(".hourLabel").clientWidth;
    const pxnaMin = widthTimeLine / (12 * 60); //ile px zajmuje jedna minuta na Timeline
    const leftOffset = minutesLeftOffset * pxnaMin;

    const beamDiv = document.createElement("div");
    beamDiv.classList.add("beam");
    beamDiv.style.left = leftOffset + "px";
    timeLine.appendChild(beamDiv);
  }

  // po kliknieciu przycisku "start nauki" tworzymy nową fasolke z datą poczatku i rysujemy na timeline
  addBeam(start) {
    const newBeam = { start, stop: "-" };
    this.allBeams.push(newBeam);
    this.printBeam(this.allBeams.length - 1);
  }

  // po upływie czasu wpisujemy czas konca
  addStopTimeToBeam(stop) {
    this.allBeams[this.allBeams.length - 1].stop = stop;
  }
}

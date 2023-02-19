//Tworzenie fasolek na osi czasu
console.log("\x1b[1mbeamC");
class Beam {
  constructor() {
    this.key = "beams";
    this.allBeams = JSON.parse(localStorage.getItem(this.key)) || [];
    // this.allBeams = [
    //   { id: "1a", start: new Date("2023-02-01 8:00:00"), stop: new Date("2023-02-01 8:25:00") },
    //   { id: "2a", start: new Date("2023-02-01 10:00:00"), stop: new Date("2023-02-01 10:25:00") },
    //   { id: Date.now().toString(), start: new Date("2023-02-01 12:00:00"), stop: new Date("2023-02-01 12:25:00") },
    // ];
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
    const startPrint = new Date(beam.start); // przez JSON mamy stringa a nie date
    console.log(`\x1B[34m Fasolka nr: ${i} - ${startPrint.displayHMS()}`);
    const eightHour = 8 * 60;
    const minutesLeftOffset = startPrint.getMinutes() + startPrint.getHours() * 60 - eightHour;
    const widthTimeLine = document.querySelector(".hourLabel").clientWidth;
    const pxnaMin = widthTimeLine / (12 * 60); //ile px zajmuje jedna minuta na Timeline
    const leftOffset = minutesLeftOffset * pxnaMin;

    const beamSymbol = document.createElement("div");
    beamSymbol.classList.add("beam");
    beamSymbol.style.left = leftOffset + "px";
    beamsDiv.appendChild(beamSymbol);

    const beamTooltip = document.createElement("div");
    beamTooltip.textContent = `start: ${startPrint.displayHM()}`;
    beamTooltip.classList.add("beamTooltip");
    beamSymbol.appendChild(beamTooltip);
  }

  // po kliknieciu przycisku "start nauki" tworzymy nową fasolke z datą poczatku i rysujemy na timeline
  addBeam(start) {
    const activeDay = start.displayDMY();
    let actuallyDayId = 0;
    let selectedDay = this.allBeams.find((e) => e.day === activeDay);
    console.log("🚀  selectedDay", selectedDay);
    if (!selectedDay) {
      console.log("Pierwszy wpis w tym dniu");
      this.allBeams.push(this.newDay(activeDay));
      selectedDay = this.allBeams.find((e) => e.day === activeDay);
      actuallyDayId = 1;
    }
    actuallyDayId ? null : (actuallyDayId = 1 + selectedDay.beams[selectedDay.beams.length - 1].id);
    selectedDay.beams.push(this.newBeam(actuallyDayId, start));

    this.saveToLocalStorage();
  }

  newBeam(id, start) {
    return { id, start, stop: "-", status: "active" };
  }

  newDay(day) {
    return { day, beams: [] }; // jesli pierwszy raz w danym dniu uruchamiamy program to musimy dodać dzień
  }

  saveToLocalStorage() {
    localStorage.setItem(this.key, JSON.stringify(this.allBeams));
  }

  // do testów w consoli
  readLS() {
    console.log(JSON.parse(localStorage.getItem(beam.key)));
  }

  // po upływie czasu wpisujemy czas konca
  addStopTimeToBeam(stop) {
    this.allBeams[this.allBeams.length - 1].stop = stop;
  }

  getNumber() {
    return this.allBeams.length;
  }

  getStartTime(i) {
    return this.allBeams[i].start.displayHMS();
  }

  render() {
    clearBeams();
    renderBeams();
  }

  renderBeams() {}

  clearBeams() {
    while (beamsDiv.firstChild) {
      beamsDiv.removeChild(beamsDiv.firstChild);
    }
  }
}

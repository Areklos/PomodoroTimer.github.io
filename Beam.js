//Tworzenie fasolek na osi czasu
console.log("\x1b[1mbeamC");
class Beam {
  constructor() {
    this.key = "beams";
    this.allBeams = JSON.parse(localStorage.getItem(this.key)) || [];
    // this.allBeams = [];

    // this.allBeams = [
    //   {
    //     day: "19-02-2023",
    //     beams: [
    //       { id: 1, start: "10.02.2023-10:00", stop: "10.02.2023-10:25" },
    //       { id: 2, start: "10.02.2023-11:00", stop: "10.02.2023-11:25" },
    //     ],
    //   },
    // ];
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
    this.render();
  }

  //usuwamy wszystkie fasolki i renderujemy od nowa wszystkie
  render() {
    this.clearBeams();
    this.renderBeams();
  }

  clearBeams() {
    while (beamsDiv.firstChild) {
      beamsDiv.removeChild(beamsDiv.firstChild);
    }
  }

  renderBeams() {
    const DayToRender = "19-02-2023";
    let selectedDay = this.allBeams.find((e) => e.day === DayToRender);
    console.log("🚀  Beam  selectedDay", selectedDay);
    selectedDay.beams.forEach((e, i) => {
      const startPrint = new Date(e.start); // przez JSON mamy stringa a nie date
      console.log(`\x1B[34m Fasolka nr: ${i} - ${startPrint.displayHMS()}`);
      const eightHour = 8 * 60;
      const minutesLeftOffset = startPrint.getMinutes() + startPrint.getHours() * 60 - eightHour;
      const widthTimeLine = document.querySelector(".hourLabel").clientWidth;
      const pxnaMin = widthTimeLine / (12 * 60); //ile px zajmuje jedna minuta na Timeline
      const leftOffset = minutesLeftOffset * pxnaMin;
      beamsDiv.appendChild(this.createBeamSymbol(leftOffset, startPrint));
    });
  }

  createBeamSymbol(leftOffset, startPrint) {
    const beamSymbol = document.createElement("div");
    beamSymbol.classList.add("beam");
    beamSymbol.style.left = leftOffset + "px";
    beamSymbol.appendChild(this.createBeamToolTip(startPrint));
    return beamSymbol;
  }

  createBeamToolTip(startPrint) {
    const beamToolTip = document.createElement("div");
    beamToolTip.textContent = `start: ${startPrint.displayHM()}`;
    beamToolTip.classList.add("beamToolTip");
    return beamToolTip;
  }

  // w forEach rysujemy wszystkie fasolki które były w bazie danych
  //   printAllBeams() {
  //   this.allBeams.forEach((e, i) => {
  //     this.printBeam(i);
  //   });
  // }

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

  newBeam(id, start) {
    return { id, start, stop: "-", status: "active" };
  }

  newDay(day) {
    return { day, beams: [] }; // jesli pierwszy raz w danym dniu uruchamiamy program to musimy dodać dzień
  }

  saveToLocalStorage() {
    localStorage.setItem(this.key, JSON.stringify(this.allBeams));
  }

  // po upływie czasu wpisujemy czas konca
  addStopTimeToBeam(stop) {
    this.allBeams[this.allBeams.length - 1].stop = stop;
  }

  // getNumber() {
  //   return this.allBeams.length;
  // }

  getStartTime(i) {
    return this.allBeams[i].start.displayHMS();
  }

  // do testów w consoli
  readLS() {
    console.log(JSON.parse(localStorage.getItem(beam.key)));
  }
}

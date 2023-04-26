//Tworzenie fasolek na osi czasu
// console.log("\x1b[1mbeamC");
class Beam {
  constructor() {
    this.key = "beams";
    this.allBeams = JSON.parse(localStorage.getItem(this.key)) || [];
    // this.dayToRender = new Date();
    // this.dayToRender = this.dayToRender.displayDMY();

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
    console.log("f_addBeam activeDay:", activeDay);
    let actuallyDayId = 0;
    let selectedDay = this.allBeams.find((e) => e.day === activeDay);
    console.log("f_addBeam  selectedDay", selectedDay);
    if (!selectedDay) {
      console.log("f_addBeam Pierwszy wpis w tym dniu");
      this.allBeams.push(this.newDay(activeDay)); // dd-mm-yyyy
      selectedDay = this.allBeams.find((e) => e.day === activeDay);
      actuallyDayId = 1;
    }
    console.log("f_addBeam aID", actuallyDayId);
    actuallyDayId ? null : (actuallyDayId = 1 + selectedDay.beams[selectedDay.beams.length - 1].id);
    selectedDay.beams.push(this.newBeam(actuallyDayId, start.displayHM()));
    this.saveToLocalStorage();
    this.render(activeDay);
  }

  // Po kliknięciu w ToolTipie na usuń usuwamy daną fasolkę (last - automatyczne usunięcie  ostatniej fasolki)
  removeBeam(idToRemove) {
    let activeDay;
    let selectedDay;
    if (idToRemove === "last") {
      activeDay = new Date().displayDMY();
      console.log("f_removeBeam activeDay: LAST", activeDay);
      selectedDay = this.allBeams.filter((e) => e.day === activeDay)[0]; //szukamy dni z którego bedziemy usuwać fasolke
      idToRemove = selectedDay.beams.length;
      console.log("f_removeBeam idToRemove", idToRemove);
    } else {
      activeDay = displayActiveDay.textContent;
      console.log("f_removeBeam activeDay ELSE", activeDay);
      selectedDay = this.allBeams.filter((e) => e.day === activeDay)[0]; //szukamy dni z którego bedziemy usuwać fasolke
    }

    console.log("f_removeBeam  selectedDay", selectedDay);
    const dayBeforDelay = selectedDay.beams;
    console.log("f_removeBeam dayBeforDelay", dayBeforDelay);
    const newBeams = selectedDay.beams.filter((e) => e.id !== idToRemove); // zwracamy tablcie bez usuniętej fasolki
    console.log("f_removeBeam Beam  newBeams day after delay", newBeams);
    newBeams.map((e, i) => (e.id = i + 1)); // numerujemy ID fasolek od nowa
    this.allBeams.filter((e) => e.day === activeDay)[0].beams = newBeams; // podmienimay stara tablice na nowa, juz bez usunietej fasolki i z nowymi ID

    // gdy nie ma w danym dniu żadnych fasolek usuwamy cały dzień z tablicy
    const numBeamsInActiveDay = selectedDay.beams.length;
    if (!numBeamsInActiveDay) {
      this.allBeams = this.allBeams.filter((e) => e.day !== activeDay);
    }
    console.log("f_removeBeam ostatecznie", this.allBeams);

    this.saveToLocalStorage();
    this.render(activeDay);
  }

  // usuwamy wszystkie fasolki i renderujemy je wszystkie od nowa
  render(activeDay) {
    console.log("---f RENDER---");
    this.clearBeams();
    this.renderBeams(activeDay);
  }

  // usuwanie wszystkich fasolek
  clearBeams() {
    while (beamsDiv.firstChild) {
      beamsDiv.removeChild(beamsDiv.firstChild);
    }
  }

  // Renderowanie wszystkich fasolek
  renderBeams(activeDay) {
    let selectedDay = this.allBeams.find((e) => e.day === activeDay);
    this.renderDayStatistic(activeDay);
    if (!selectedDay) return; // przy starcie Local Storage może być puste, dlatego wycodziym z funkcji, lub W LS nie ma nic w danym dniu
    console.log("---f activeDay", activeDay);
    console.log("---f Beam  selectedDay", selectedDay);
    selectedDay.beams.forEach((e, i) => {
      console.log(`\x1B[34m Fasolka id:\x1B[33m ${e.id} - ${e.start} \x1B[34m ${activeDay}`);
      beamsDiv.appendChild(this.createBeamSymbol(e.start));
      if (e.status === "active") {
        beamsDiv.lastChild.classList.add("active"); // dodanie pulsacji na aktywną fasolkę
      }
    });
  }

  renderDayStatistic(activeDay) {
    const selectedDay = this.allBeams.find((e) => e.day === activeDay);
    let amountBeamsFilter;
    if (selectedDay) {
      amountBeamsFilter = selectedDay.beams.filter((e) => e.status === "-").length;
    } else {
      amountBeamsFilter = 0;
      console.log("Brak statystyk dziennych");
    }
    amountBeams.textContent = amountBeamsFilter;
    sumTimeBeams.textContent = amountBeamsFilter * 0.5 + " h";
  }

  disactivateBeamPulse() {
    const activeDay = new Date().displayDMY();
    console.log("🚀  Beam  activeDay:", activeDay);
    const selectedDay = this.allBeams.find((e) => e.day === activeDay);
    console.log("🚀  Beam  selectedDay:", selectedDay);
    selectedDay.beams.at(-1).status = "-";
    this.saveToLocalStorage();
    this.render(activeDay);
  }

  // Tworzymy DIVa jednej fasolki
  createBeamSymbol(startPrint) {
    const beamSymbol = document.createElement("div");
    beamSymbol.classList.add("beam");
    beamSymbol.style.left = this.leftOffset(startPrint) + "px";
    beamSymbol.appendChild(this.createBeamToolTip(startPrint));
    return beamSymbol;
  }

  // Dodajemy ToolTipa do DIVa stworzonej fasolki
  createBeamToolTip(startPrint) {
    const beamToolTip = document.createElement("div");
    beamToolTip.textContent = `start: ${startPrint}`;
    beamToolTip.classList.add("beamToolTip");
    return beamToolTip;
  }

  // zmieniamy aktualny dzien o jeden wcześniej lub pózniej
  changeDay(dayDMY, sign) {
    const dayToChange = dayDMY.strDMYtoDate();
    let newActiveDay;
    if (sign === "-") {
      newActiveDay = new Date(dayToChange.setDate(dayToChange.getDate() - 1)).displayDMY();
    } else if (sign === "+") {
      newActiveDay = new Date(dayToChange.setDate(dayToChange.getDate() + 1)).displayDMY();
    } else {
      console.log(`\x1b[41m ERROR: błednny znak przy funkcji "beam.changeDay"`);
    }
    this.render(newActiveDay);
    return newActiveDay;
  }

  newBeam(id, start, status = "active") {
    console.log("🚀  -----Beam  start:", start);
    return { id, start, stop: "-", status };
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

  // Dezaktywujemy przycisk NEXDAY gdy data jest >+ od dziesiejszej
  disactivateBTNNextDay(activeDay) {
    activeDay = activeDay.strDMYtoDate();
    const maxDay = new Date().displayDMY().strDMYtoDate(); // obcinamy godziny, min, sek, ms
    if (activeDay >= maxDay) {
      console.log("dezaktywacja BTN next Day");
      btnNextDay.classList.add("deactivate");
      btnNextDay.removeEventListener("click", setNextDayTimeLine);
    } else if (activeDay < maxDay && btnNextDay.classList.contains("deactivate")) {
      console.log("aktywacja BTN Next Day");
      btnNextDay.classList.remove("deactivate");
      btnNextDay.addEventListener("click", setNextDayTimeLine);
    }
  }

  // narazie tylko aktywacja BTN Nex day, ponieważ nie mam ustawionego minaimalnego dnia
  disactivateBTNPreviousDay(activeDay) {
    activeDay = activeDay.strDMYtoDate();
    const maxDay = new Date().displayDMY().strDMYtoDate(); // obcinamy godziny, min, sek, ms
    if (activeDay < maxDay && btnNextDay.classList.contains("deactivate")) {
      console.log("aktywacja BTN Next Day");
      btnNextDay.classList.remove("deactivate");
      btnNextDay.addEventListener("click", setNextDayTimeLine);
    }
  }

  // dodajemy fasolke ręcznie w danym dniu w postaci hh:mm
  addManuallyBeam(start) {
    const activeDay = displayActiveDay.textContent;
    console.log("---f AddManualy activeDay:", activeDay);
    let actuallyDayId = 0;
    let selectedDay = this.allBeams.find((e) => e.day === activeDay);
    console.log("---f AddManualy selectedDay", selectedDay);
    if (!selectedDay) {
      console.log("Pierwszy wpis w tym dniu");
      this.allBeams.push(this.newDay(activeDay)); // dd-mm-yyyy
      selectedDay = this.allBeams.find((e) => e.day === activeDay);
      actuallyDayId = 1;
    }

    actuallyDayId ? null : (actuallyDayId = 1 + selectedDay.beams[selectedDay.beams.length - 1].id);
    selectedDay.beams.push(this.newBeam(actuallyDayId, start, "-"));

    this.saveToLocalStorage();
    this.render(activeDay);
  }

  // odległość w jakiej ma narysować sie fasolka
  leftOffset(startPrint) {
    const eightHour = 8 * 60;
    const minutesLeftOffset = Number(startPrint.slice(3)) + Number(startPrint.slice(0, 2)) * 60 - eightHour;
    const widthTimeLine = document.querySelector(".hourLabel").clientWidth;
    const pxnaMin = widthTimeLine / (12 * 60); //ile px zajmuje jedna minuta na Timeline
    const leftOffset = minutesLeftOffset * pxnaMin;
    return leftOffset;
  }
}

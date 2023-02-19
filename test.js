Date.prototype.displayDMY = function () {
  const d = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  const m = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1;
  const y = this.getFullYear() < 10 ? "0" + this.getFullYear() : this.getFullYear();
  const print = `${d}-${m}-${y}`;
  return print;
};

const a = [
  { day: "10-02-2023", beams: [{ id: 1, start: "10.02.2023-10:00", stop: "10.02.2023-10:25" }] },
  { day: "15-02-2023", beams: [{ id: 2, start: "10.02.2023-11:00", stop: "10.02.2023-11:25" }] },
];
console.log(a);

function addCos(start = new Date()) {
  const activeDay = start.displayDMY();
  console.log("🚀  activeDay", activeDay);
  let actuallyDayId = 0;
  let selectedDay = a.find((e) => e.day === activeDay);
  console.log("🚀  selectedDay", selectedDay);
  if (selectedDay) {
  } else {
    console.log("nie ma wpisu");
    // a.push({ day: activeDay, beams: [{ id: 1, start: "1111", stop: "-", status: "active" }] });

    a.push(newDay(activeDay));
    selectedDay = a.find((e) => e.day === activeDay);
    actuallyDayId = 1;
  }
  actuallyDayId ? null : (actuallyDayId = 1 + selectedDay.beams[selectedDay.beams.length - 1].id);
  console.log("🚀  actualId", actuallyDayId);
  selectedDay.beams.push(newBeam(actuallyDayId));
  console.log("tak, jest wpis z danego dnia");

  const size = encodeURI(JSON.stringify(a)).split(/%..|./).length - 1;
  console.log("🚀  sizeB: ", size);
}

addCos();

function newBeam(id) {
  return { id, start: "331", stop: "-", status: "active" };
}

function newDay(day) {
  return { day, beams: [] }; // jesli pierwszy raz w danym dniu uruchamiamy program to musimy dodać dzień
}

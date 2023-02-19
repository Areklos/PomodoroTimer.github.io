// zwraca datę w postaci: hh:mm:ss
Date.prototype.displayHMS = function () {
  const h = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
  const m = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  const s = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
  const print = `${h}:${m}:${s}`;
  return print;
};

// zwraca datę w postaci: hh:mm
Date.prototype.displayHM = function () {
  const h = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
  const m = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  const print = `${h}:${m}`;
  return print;
};
// zwraca datę w postaci: dd-mm-yyyy
Date.prototype.displayDMY = function () {
  const d = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  const m = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1;
  const y = this.getFullYear() < 10 ? "0" + this.getFullYear() : this.getFullYear();
  const print = `${d}-${m}-${y}`;
  return print;
};

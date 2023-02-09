// zwraca datę w postaci hh:mm:ss
Date.prototype.hms = function () {
  const h = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
  const m = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  const s = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
  const print = `${h}:${m}:${s}`;
  return print;
};

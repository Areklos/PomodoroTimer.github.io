console.log("----------------------------------------test change Day");
let a = new Date();
console.log("🚀  a", a);
const oneDayinMS = 1000 * 60 * 60 * 24;
let b = a.setDate(a.getDate() + 1);
console.log("🚀  b", new Date(b));

let c = "10-02-2003";
let tab = c.split("-");
console.log("🚀  tab", tab);

console.log("----------------------------------------test change Day");

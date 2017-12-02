//const fs = require("fs");
//const s = fs.readFileSync("./flipper.hull").toString();

const W = 256;
const H = 256;

const supportedCommands = "MmlLHhVvZz".split("");
const absoluteCommands = "MLHVZ".split("");
const singleNumberCommands = "HhVv".split("");

function contains(arr, el) {
  return arr.indexOf(el) !== -1;
}

function startsWithNumber(s) {
  return /^-?\d/.test(s);
}

function toHull(d) {
  const parts = d.split(" ");

  let p = [0, 0];
  let absolute = true;
  let volatile = false;

  const points = [];
  let part;
  let lastCommand;
  while ((part = parts.shift())) {
    if (contains(supportedCommands, part)) {
      absolute = contains(absoluteCommands, part);
      volatile = part === "m" || part === "M";
      lastCommand = part;

      if (part === "Z" || part === "z") {
        points.push([points[0][0], points[0][1]]);
      }
    } else if (startsWithNumber(part)) {
      const arr = part.split(",").map(parseFloat);
      if (contains(singleNumberCommands, part)) {
        const num = parseFloat(parts.shift());
        if (part === "H" || part === "h") {
          points.push([p[0], (part === "h" ? p[1] : num) + num]);
        } else if (part === "V" || part === "v") {
          points.push([(part === "v" ? p[0] : 0) + num, p[1]]);
        }
      }

      // MmLl
      if (absolute) {
        p = arr;
      } else {
        p = [p[0] + arr[0], p[1] + arr[1]];
      }

      if (!volatile) {
        points.push(p);
      }
    } else {
      throw part;
    }
  }
  return points;
}

const d =
  "M 12.773125,113.36602 221.3132,95.992053 l 12.11088,1.651482 10.58724,6.605925 7.48176,8.10713 2.84979,11.98594 -1.51508,13.41407 -4.62098,9.90131 -9.00254,8.33802 -9.58241,3.43426 -12.70975,0.58031 -203.961053,-17.77707 -5.9080342,-2.37991 -3.4503706,-4.50127 -1.9267305,-6.60592 1.1009889,-7.00904 3.5114276,-5.52164 z";

const p = toHull(d);
console.log(p);

const canvasEl = document.createElement("canvas");
canvasEl.setAttribute("width", 256);
canvasEl.setAttribute("height", 256);
document.body.appendChild(canvasEl);

const ctx = canvasEl.getContext("2d");

ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(0, H / 2);
ctx.lineTo(W, H / 2);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(W / 2, 0);
ctx.lineTo(W / 2, H);
ctx.stroke();

ctx.strokeStyle = "black";
ctx.beginPath();
p.forEach((p, i) =>
  ctx[i ? "lineTo" : "moveTo"](
    //p[0], p[1]
    W / 2 + p[0] * 0.25,
    H / 2 + p[1] * 0.25
  )
);
ctx.stroke();

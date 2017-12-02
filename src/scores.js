"use strict";

function heur(o) {
  return o.c * 1000 + o.t + o.f;
}

function sigma(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

// o: coins:int, time:int, fuel:int, ts:int
window.saveScore = function saveScore(level, o) {
  o.ts = new Date().valueOf();
  const key = "scores_" + level;
  const top = loadLS(key, []);
  top.push(o);
  top.sort(function(a, b) {
    return sigma(heur(a) - heur(b));
  });
  top.reverse();
  if (top.length > 5) {
    top.pop();
  }
  saveLS(key, top);
};

function zeroPad(n) {
  return n < 10 ? "0" + n : n;
}

function ts(n) {
  const d = new Date(n);
  return [
    d.toISOString().split("T")[0],
    " ",
    d.getHours(),
    ":",
    zeroPad(d.getMinutes())
  ].join("");
}

window.getScores = function getScores(level) {
  const key = "scores_" + level;
  const top = loadLS(key, []);
  return top
    .map(function(o) {
      return [
        ts(o.ts),
        "  -  coins:",
        o.c,
        "  time:",
        o.t,
        "  fuel:",
        o.f
      ].join("");
    })
    .join("\n");
};

// getScores('1')
// saveScore('1', {c:10, t:5, f:2})

"use strict";

const sfx = {};

function addSfx(name) {
  sfx[name] = new Howl({
    src: [`assets/sfx/${name}.webm`, `assets/sfx/${name}.mp3`]
  });
}

window.audioMap = {
  sfx: "ball_out collision_1 collision_3 flipper gameover win".split(" ")
};

window.audioMap.sfx.forEach(addSfx);

window.setSfx = function setSfx(state) {
  window.audioMap.sfx.forEach(function(n) {
    sfx[n].mute(!state);
  });
};

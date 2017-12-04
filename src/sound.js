"use strict";

const sfx = {};

function addSfx(name) {
  sfx[name] = new Howl({
    src: [`assets/sfx/${name}.webm`, `assets/sfx/${name}.mp3`]
  });
}

window.audioMap = {
  sfx: "ball_out get_ready try_again levelup_good_job collision_1 collision_2 collision_3 flipper gameover gameover_voice manyballs dingding win dest1 dest2 dest3 metal".split(" ")
};

window.audioMap.sfx.forEach(addSfx);

window.setSfx = function setSfx(state) {
  window.audioMap.sfx.forEach(function(n) {
    sfx[n].mute(!state);
  });
};

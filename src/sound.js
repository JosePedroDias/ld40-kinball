"use strict";

const sfx = {};
const music = {};

function addSfx(name) {
  sfx[name] = new Howl({
    src: [`assets/sfx/${name}.webm`, `assets/sfx/${name}.mp3`]
  });
}

function addMusic(name) {
  music[name] = new Howl({
    src: [`assets/music/${name}.webm`, `assets/music/${name}.mp3`],
    loop: name !== "gameOver"
  });
}

window.audioMap.sfx.forEach(addSfx);
window.audioMap.music.forEach(addMusic);

window.setSfx = function setSfx(state) {
  window.audioMap.sfx.forEach(function(n) {
    sfx[n].mute(!state);
  });
};

window.setMusic = function setMusic(state) {
  window.audioMap.music.forEach(function(n) {
    music[n].mute(!state);
  });
};

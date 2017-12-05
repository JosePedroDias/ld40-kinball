"use strict";

var _memoryStorage = {};

window.saveLS = function saveLS(key, value) {
  try {
    var s = JSON.stringify(value);
    _memoryStorage[key] = s;
    localStorage.setItem(key, s);
  } catch (_) {}
};

window.loadLS = function loadLS(key, defaultValue) {
  try {
    var s = localStorage.getItem(key);
    if (s === null) {
      return defaultValue;
    }
    return JSON.parse(s);
  } catch (ex) {
    var s$1 = _memoryStorage[key];
    if (s$1 === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(s$1);
    } catch (_) {
      return defaultValue;
    }
  }
};

window.deleteLS = function deleteLS(key) {
  delete _memoryStorage[key];
  try {
    localStorage.removeItem(key);
  } catch (_) {}
};

window.resetLS = function resetLS() {
  try {
    _memoryStorage = {};
    localStorage.clear();
  } catch (_) {}
};
(function(global) {
  var progress = ["start", "middle", "end"];

  var variants = ["normal", "down"];

  var prefix = "assets/bgm/";

  var levelSongs = [{ d: 3626, n: "track1" }, { d: 5274, n: "track2" }];

  var max_plays = 2; //we move forward or backward to avoid repeating the same loop over and over

  var music_parts = undefined;
  var part_fn = undefined;

  var current_loop = "start_normal";
  var last_played = 0;
  var last_played_times = 0;

  function loadMusic(levelNumber, partfn_from_level) {
    if (music_parts !== undefined){
      // we need to unload first;
      music_parts.unload();
    }

    part_fn = partfn_from_level
    music_parts = {};

    last_played = 0;
    last_played_times = 0;

    var song = levelSongs[levelNumber];
    var track_path = prefix + song.n + "/";
    var sample_prefix = song.n + "_all";
    var segment_duration = song.d;

    var max_variants = variants.length;
    var max_progress = progress.length;

    var has_repeated = false;

    var process_queue_sequentially = function() {
      var parts = current_loop.split("_");
      var cp = progress.indexOf(parts[0]);
      var cv = variants.indexOf(parts[1]);

      if (!has_repeated) {
        //console.log('Repeating loop ' + current_loop);
        has_repeated = true;
        music_parts.play(current_loop);
        return;
      }

      has_repeated = false;

      cv++;

      var needs_reset = false;

      if (cv >= max_variants) {
        cv = 0;

        /*cp++;
      if (cp >= max_progress) {
        cp = 0;
      }*/
        cp = getPart();
        if (cp === last_played){
          last_played_times++;
          if (last_played_times >= max_plays){
            //console.log("Moving on ...")
            if (cp >= 2){
              cp = 1;
            } else {
              cp++;
            }
            needs_reset = true;
          }
        } else {
          needs_reset = true;
        }
      }

      if (needs_reset){
        last_played = cp;
        last_played_times = 0;  
      }


      current_loop = progress[cp] + "_" + variants[cv];

      //console.log('Changing loop to ' + current_loop);
      //console.log('current part = ' + cp);

      music_parts.play(current_loop);
    };

    var sprite_offset = 0;
    for (var p = 0; p < progress.length; p++) {
      for (var v = 0; v < variants.length; v++) {
        music_parts[progress[p] + "_" + variants[v]] = [
          sprite_offset,
          segment_duration
        ];
        sprite_offset += segment_duration;
      }
    }

    music_parts = new Howl({
      src: [
        track_path + sample_prefix + ".webm",
        track_path + sample_prefix + ".mp3"
      ], //todo: webm mp3
      onend: process_queue_sequentially,
      sprite: music_parts
    });

    //console.log('Starting ' + current_loop);
    //music_parts.play(current_loop);
  }

  var currentPart = 0;
  function getPart() {
    if (part_fn === undefined){
      currentPart++;
      if (currentPart >= 3){
        currentPart = 0;
      }
    } else {
      currentPart = part_fn();
    }
    return currentPart;
  }

  document.body.addEventListener("keydown", function (ev) {
    var k = ev.keyCode;
    if (k < 49 || k > 51) {
      return;
    }
    currentPart = k - 49;
    //console.log(currentPart);
  });

  //loadMusic(0);

  function setMusic(state) {
    if (state) {
      music_parts.play(current_loop);
    } else {
      music_parts.stop();
    }
  }

  function isMusicPlaying(){
    return music_parts && music_parts.playing();
  }

  global.loadMusic = loadMusic;
  global.setMusic = setMusic;
  global.isMusicPlaying = isMusicPlaying;
})(this);
"use strict";

var sfx = {};

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
levelBuilders.push(function buildLevel(engine, W, H) {
  var flipperColor = "#ff8f00"; //orange
  var plungerColor = "#fdd835"; //yellow
  var goalColor = "#76ff03"; //green
  var triangleBumperColor = "#673ab7";//purple

  var circularBumperColor = "#ffc046";//yellow

  var wallColorDark = "#808e95"; //gray light

  var orangeDestructible_1 = "#ff6f00";//orange dark
  var orangeDestructible_2 = "#ffa000";//orange
  var orangeDestructible_3 = "#ffca28";//orange light

  var redDestructible_1 = "#a30000";//red dark
  var redDestructible_2 = "#ff6434";//red
  var redDestructible_3 = "#f48fb1";//red light

  var tealishDestructible_1 = "#004c40";//teal dark
  var tealishDestructible_2 = "#00796b";//teal
  var tealishDestructible_3 = "#48a999";//teal light
  var pinkish = "#ec407a";//pink

  var gatewayColor = "#b2ebf2";//teal

  var boundsAreVisible = false;

  // BOUNDS

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var upperBound = createRect({
    engine,
    pos: [W * 0.7, -1500],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var leftBound = createRect({
    engine,
    pos: [-1010, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var rightBound = createRect({
    engine,
    pos: [2130, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, -150],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, 80],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, 300],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left top
  createTriangleBumper({
    engine,
    pos: [700, -150],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left middle
  createTriangleBumper({
    engine,
    pos: [700, 80],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left bottom
  createTriangleBumper({
    engine,
    pos: [700, 300],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });


  // bottom to top

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper lower
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right pillar ball tunel - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 + 340, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // rightmost pillar tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 420, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //first arc - start - right
  var arc1 = createArc({
    pos: [730, -870 +400],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc1]);

  //second arc - start - left
  var arc2 = createArc({
    pos: [150, -870 +400],
    r: 90,
    a0: -90,
    a1: -180,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [440, -961 +400],
    dims: [580, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right plunger protector
  createRect({
    engine,
    pos: [780, 440],
    dims: [104, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });


  

  // middle bottom



  // middle middle main

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });


  createRect({
    engine,
    pos: [W * 0.5 - 100, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest2",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 - 100, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest2",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 + 100, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest2",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 + 100, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest2",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [490 - 200 - 50, 150 - 400 - 100],
    r: 75,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest2",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [490 + 20 + 50, 150 - 400 - 100],
    r: 75,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest2",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [400, 150 - 400 + 75],
    r: 75,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest2",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });


  createRotatingPolygon({
    engine,
    pos: [400, 150 - 400 + 75 + 425],
    r: 75,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest2",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });



  createPlunger({
    engine,
    pos: [780, H * 0.5],
    dims: [46, 32],
    angle: 0,
    options: {
      render: {
        fillStyle: plungerColor
      }
    }
  });

  // lower safety net attempt
  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });


  // GOAL
  createRotatingPolygon({
    engine,
    pos: [W * 0.5, H * 0.4 - 200],
    r: 25,
    spinsPerSecond: 1,
    sides: 3,
    options: {
      isStatic: true,
      custom: "goal brick",
      render: {
        fillStyle: goalColor
      }
    }
  });

  return {
    spawnPos: [780, H * 0.2],
    musicIndex: 1,
    higher_h: -340000, //never play the highest
    middle_h: -240, 
    lower_h: H * 0.8
  };
});
levelBuilders.push(function buildLevel(engine, W, H) {
  var flipperColor = "#01579b"; //blue
  var plungerColor = "#fdd835"; //yellow
  var goalColor = "#76ff03"; //green
  var triangleBumperColor = "#673ab7";//purple

  var circularBumperColor = "#ffc046";//yellow

  var wallColorDark = "#808e95"; //gray light

  var orangeDestructible_1 = "#ff6f00";//orange dark
  var orangeDestructible_2 = "#ffa000";//orange
  var orangeDestructible_3 = "#ffca28";//orange light
  var tealishDestructible_1 = "#004c40";//teal dark
  var tealishDestructible_2 = "#00796b";//teal
  var tealishDestructible_3 = "#48a999";//teal light
  var pinkish = "#ec407a";//pink

  var gatewayColor = "#b2ebf2";//teal

  var boundsAreVisible = false;

  // BOUNDS

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var upperBound = createRect({
    engine,
    pos: [W * 0.7, -1500],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var leftBound = createRect({
    engine,
    pos: [-1010, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var rightBound = createRect({
    engine,
    pos: [2130, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });


  createBumper({
    engine,
    pos: [400, 300 - 700],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });


  createBumper({
    engine,
    pos: [200, 300 - 400],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [200 + 400, 300 - 400],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, -150],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, 80],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  createTriangleBumper({
    engine,
    pos: [100, 300],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left top
  createTriangleBumper({
    engine,
    pos: [700, -150],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left middle
  createTriangleBumper({
    engine,
    pos: [700, 80],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left bottom
  createTriangleBumper({
    engine,
    pos: [700, 300],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });


  // bottom to top

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper lower
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right pillar ball tunel - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 + 340, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // rightmost pillar tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 420, -210 + 200],
    dims: [1300-400, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //first arc - start - right
  var arc1 = createArc({
    pos: [730, -870 +400],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc1]);

  //second arc - start - left
  var arc2 = createArc({
    pos: [150, -870 +400],
    r: 90,
    a0: -90,
    a1: -180,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [440, -961 +400],
    dims: [580, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right plunger protector
  createRect({
    engine,
    pos: [780, 440],
    dims: [104, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });



  // middle top

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3 - 400],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4 - 400],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5 - 400],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  // createBumper({
  //   engine,
  //   pos: [308, 150 - 400],
  //   r: 12,
  //   options: {
  //     custom: "sfx|collision_1",
  //     render: {
  //       fillStyle: pinkish
  //     }

  //   }
  // });

  // createBumper({
  //   engine,
  //   pos: [490, 150 - 400],
  //   r: 12,
  //   options: {
  //     custom: "sfx|collision_1",
  //     render: {
  //       fillStyle: pinkish
  //     }

  //   }
  // });

///
  

  // middle bottom

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createBumper({
    engine,
    pos: [308, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createBumper({
    engine,
    pos: [490, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  // left main

  createRect({
    engine,
    pos: [W * 0.5 - 200, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 - 200, H * 0.4 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 - 200, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  // createBumper({
  //   engine,
  //   pos: [308 - 200, 150 - 200],
  //   r: 12,
  //   options: {
  //     custom: "sfx|collision_1",
  //     render: {
  //       fillStyle: pinkish
  //     }

  //   }
  // });

  createBumper({
    engine,
    pos: [490 - 200, 150 - 200],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  //////

  // right main

  createRect({
    engine,
    pos: [W * 0.5 + 200, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 + 200, H * 0.4 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5 + 200, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });


  createBumper({
    engine,
    pos: [308 + 200, 150 - 200],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  // createBumper({
  //   engine,
  //   pos: [490 + 200, 150 - 200],
  //   r: 12,
  //   options: {
  //     custom: "sfx|collision_1",
  //     render: {
  //       fillStyle: pinkish
  //     }

  //   }
  // });

  //////

  // middle middle main

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  // createRect({
  //   engine,
  //   pos: [W * 0.5, H * 0.4 - 200],
  //   dims: [80, 30],
  //   angle: 0,
  //   options: {
  //     custom: "brick sfx|dest3",
  //     render: {
  //       fillStyle: tealishDestructible_2
  //     }
  //   }
  // });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5 - 200],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_1
      }
    }
  });

  //top bumpers


   createBumper({
    engine,
    pos: [490 - 200, 150 - 400],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createBumper({
    engine,
    pos: [490 + 20, 150 - 400],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });



  createPlunger({
    engine,
    pos: [780, H * 0.5],
    dims: [46, 32],
    angle: 0,
    options: {
      render: {
        fillStyle: plungerColor
      }
    }
  });

  // createTriangleBumper({
  //   engine,
  //   pos: [150, -300],
  //   v0: [-40, 30],
  //   v1: [40, 30],
  //   v2: [0, -30],
  //   options: {
  //     custom: "goal",
  //     render: {
  //       fillStyle: goalColor
  //     }
  //   }
  // });

  // lower safety net attempt
  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });


  // GOAL
  createRotatingPolygon({
    engine,
    pos: [W * 0.5, H * 0.4 - 200],
    r: 25,
    spinsPerSecond: 1,
    sides: 3,
    options: {
      isStatic: true,
      custom: "goal brick",
      render: {
        fillStyle: goalColor
      }
    }
  });

  return {
    spawnPos: [780, H * 0.2],
    musicIndex: 0,
    higher_h: -340000, //never play the highest
    middle_h: -240, 
    lower_h: H * 0.8
  };
});
levelBuilders.push(function buildLevel(engine, W, H) {
  var flipperColor = "#b71c1c"; //red
  var plungerColor = "#fdd835"; //yellow
  var goalColor = "#76ff03"; //green
  var triangleBumperColor = "#673ab7";//purple

  var circularBumperColor = "#ffc046";//yellow

  var wallColorDark = "#808e95"; //gray light

  var orangeDestructible_1 = "#ff6f00";//orange dark
  var orangeDestructible_2 = "#ffa000";//orange
  var orangeDestructible_3 = "#ffca28";//orange light
  var tealishDestructible_1 = "#004c40";//teal dark
  var tealishDestructible_2 = "#00796b";//teal
  var tealishDestructible_3 = "#48a999";//teal light
  var pinkish = "#ec407a";//pink

  var gatewayColor = "#b2ebf2";//teal

  var boundsAreVisible = false;

  // bottom to top

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper lower
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // createRotatingPolygon({
  //   engine,
  //   pos: [200, -600],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [goalColor, tealishDestructible],
  //     custom: "brick",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible
  //     }
  //   }
  // });


  createRotatingPolygon({
    engine,
    pos: [690, -300],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });


  createRotatingPolygon({
    engine,
    pos: [100, -750],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [400, -400],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [704, -600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  // right pillar ball tunel - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 + 340, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // rightmost pillar tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 420, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //first arc - start - right
  var arc1 = createArc({
    pos: [730, -870],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc1]);

  //second arc - start - left
  var arc2 = createArc({
    pos: [150, -870],
    r: 90,
    a0: -90,
    a1: -180,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [440, -961],
    dims: [580, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right plunger protector
  createRect({
    engine,
    pos: [780, 440],
    dims: [104, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 - 250, -400],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 + 210, -375],
    dims: [110, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //left flipper upper
  createFlipper({
    engine,
    pos: [W / 2 - 100, -340],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper upper
  createFlipper({
    engine,
    pos: [W / 2 + 100, -340],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });


  //bottom bumpers
  //top bumpers
  createBumper({
    engine,
    pos: [200, 300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [600, 300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });


  //top bumpers
  createBumper({
    engine,
    pos: [400, -650],
    r: 48,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [400, -850],
    r: 48,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });


  //triangle left top
  createTriangleBumper({
    engine,
    pos: [150, -750],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left middle
  createTriangleBumper({
    engine,
    pos: [150, -600],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [650, -750],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });


  //triangle right middle
  createTriangleBumper({
    engine,
    pos: [650, -600],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right, below
  createTriangleBumper({
    engine,
    pos: [650, -460],
    v0: [50, 0],
    v1: [0, 50],
    v2: [30, 100],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  // left gateway
  createRect({
    engine,
    pos: [150, -50],
    dims: [400, 12],
    angle: 70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [230, -50],
    dims: [400, 12],
    angle: 70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });


  // right gateway
  createRect({
    engine,
    pos: [568, -50],
    dims: [400, 12],
    angle: -70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [648, -50],
    dims: [400, 12],
    angle: -70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  // createBumper({
  //   engine,
  //   pos: [W * 0.6, H * 0.55],
  //   r: 32,
  //   options: { custom: "sfx|collision_1" }
  // });
  // createBumper({
  //   engine,
  //   pos: [W * 0.25, H * 0.2],
  //   r: 48,
  //   options: { custom: "sfx|collision_3" }
  // });

  // bottom left
  createBumper({
    engine,
    pos: [250, -250],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

  // bottom right
  createBumper({
    engine,
    pos: [550, -250],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var upperBound = createRect({
    engine,
    pos: [W * 0.7, -1500],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var leftBound = createRect({
    engine,
    pos: [-1010, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var rightBound = createRect({
    engine,
    pos: [2130, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });


  

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });


  createBumper({
    engine,
    pos: [308, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createBumper({
    engine,
    pos: [490, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });





  createPlunger({
    engine,
    pos: [780, H * 0.5],
    dims: [46, 32],
    angle: 0,
    options: {
      render: {
        fillStyle: plungerColor
      }
    }
  });

  // createTriangleBumper({
  //   engine,
  //   pos: [150, -300],
  //   v0: [-40, 30],
  //   v1: [40, 30],
  //   v2: [0, -30],
  //   options: {
  //     custom: "goal",
  //     render: {
  //       fillStyle: goalColor
  //     }
  //   }
  // });

  // lower safety net attempt
  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createRotatingPolygon({
    engine,
    pos: [110, -300],
    r: 25,
    spinsPerSecond: 1,
    sides: 3,
    options: {
      isStatic: true,
      custom: "goal brick",
      render: {
        fillStyle: goalColor
      }
    }
  });

  return {
    spawnPos: [780, H * 0.2],
    musicIndex: 0,
    higher_h: -340000, //never play the highest
    middle_h: -340, 
    lower_h: H * 0.8
  };
});
levelBuilders.push(function buildLevel(engine, W, H) {
  var flipperColor = "#b71c1c"; //red
  var plungerColor = "#fdd835"; //yellow
  var goalColor = "#76ff03"; //green
  var triangleBumperColor = "#673ab7";//purple

  var circularBumperColor = "#ffc046";//yellow

  var wallColorDark = "#808e95"; //gray light

  var orangeDestructible_1 = "#ff6f00";//orange dark
  var orangeDestructible_2 = "#ffa000";//orange
  var orangeDestructible_3 = "#ffca28";//orange light
  var tealishDestructible_1 = "#004c40";//teal dark
  var tealishDestructible_2 = "#00796b";//teal
  var tealishDestructible_3 = "#48a999";//teal light
  var pinkish = "#ec407a";//pink


  var redDestructible_1 = "#a30000";//red dark
  var redDestructible_2 = "#ff6434";//red
  var redDestructible_3 = "#f48fb1";//red light

  var gatewayColor = "#b2ebf2";//teal

  var boundsAreVisible = false;

  // bottom to top

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper lower
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //left flipper middle
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.1],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper middle
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.1],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // createRotatingPolygon({
  //   engine,
  //   pos: [200, -600],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [goalColor, tealishDestructible],
  //     custom: "brick",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible
  //     }
  //   }
  // });


  createRotatingPolygon({
    engine,
    pos: [470, -300],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [470, -200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });


  createRotatingPolygon({
    engine,
    pos: [450, -700],
    r: 100,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3, tealishDestructible_1, tealishDestructible_2, tealishDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });


  // createRotatingPolygon({
  //   engine,
  //   pos: [100, -750],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
  //     custom: "brick sfx|dest1",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible_1
  //     }
  //   }
  // });

  // createRotatingPolygon({
  //   engine,
  //   pos: [400, -400],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
  //     custom: "brick sfx|dest1",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible_1
  //     }
  //   }
  // });

  // createRotatingPolygon({
  //   engine,
  //   pos: [704, -600],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
  //     custom: "brick sfx|dest1",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible_1
  //     }
  //   }
  // });

  // right pillar ball tunel - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 + 340, -210 + 400],
    dims: [500, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // rightmost pillar tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 420, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //first arc - start - right
  var arc1 = createArc({
    pos: [730, -870],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc1]);

  //second arc - start - left
  var arc2 = createArc({
    pos: [150, -870],
    r: 90,
    a0: -90,
    a1: -180,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [440, -961],
    dims: [580, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right plunger protector
  createRect({
    engine,
    pos: [780, 440],
    dims: [104, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 - 250, -400],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 + 210 + 150, -375],
    dims: [110, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //left flipper upper
  createFlipper({
    engine,
    pos: [W / 2 - 100, -340],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper upper
  createFlipper({
    engine,
    pos: [W / 2 + 100 + 150, -340],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //bottom bumpers
  createBumper({
    engine,
    pos: [200, 300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [600, 300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  //top bumpers
  createBumper({
    engine,
    pos: [200, 300-300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [600, 300-300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });



  // left gateway
  createRect({
    engine,
    pos: [150, -50 - 600],
    dims: [400-100, 12],
    angle: 70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [230, -50 - 600],
    dims: [400-100, 12],
    angle: 70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });


  // right gateway
  createRect({
    engine,
    pos: [568 + 50, -600],
    dims: [400-100, 12],
    angle: -70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [648 + 50, -600],
    dims: [400-100, 12],
    angle: -70,
    options: {
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  // top left
  createBumper({
    engine,
    pos: [250, -250 - 600],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

  //top right
  createBumper({
    engine,
    pos: [550, -250 - 600],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var upperBound = createRect({
    engine,
    pos: [W * 0.7, -1500],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var leftBound = createRect({
    engine,
    pos: [-1010, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  var rightBound = createRect({
    engine,
    pos: [2130, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });



  createRect({
    engine,
    pos: [W * 0.5, H * 0.3],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });


  createBumper({
    engine,
    pos: [308, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createBumper({
    engine,
    pos: [490, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });




  // //triangle right top
  createTriangleBumper({
    engine,
    pos: [780, -160],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

// //triangle left top
createTriangleBumper({
    engine,
    pos: [100, -160],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });
















  createPlunger({
    engine,
    pos: [780, H * 0.5],
    dims: [46, 32],
    angle: 0,
    options: {
      render: {
        fillStyle: plungerColor
      }
    }
  });

  // createTriangleBumper({
  //   engine,
  //   pos: [150, -300],
  //   v0: [-40, 30],
  //   v1: [40, 30],
  //   v2: [0, -30],
  //   options: {
  //     custom: "goal",
  //     render: {
  //       fillStyle: goalColor
  //     }
  //   }
  // });

  // lower safety net attempt
  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createRotatingPolygon({
    engine,
    pos: [110, -900],
    r: 25,
    spinsPerSecond: 1,
    sides: 3,
    options: {
      isStatic: true,
      custom: "goal brick",
      render: {
        fillStyle: goalColor
      }
    }
  });

  return {
    spawnPos: [780, H * 0.2],
    musicIndex: 1,
    higher_h: -340000, //never play the highest
    middle_h: -340, 
    lower_h: H * 0.8
  };
});
var M = Matter;

var W = 800;
var H = 600;

var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;

var currentLevel = 0;
var score = 0;
var spareBalls = 3;
var extraBalls = 6;
var blinkUntil = 0;
var won = false;
var specialMessage = "";

var highScore = loadLS("score", 0);
var soundEnabled = loadLS("sound", true);
var spawnPos;
var isBlinking = false;
var needsNewBall = false;
var propagate_key_up_left_flippers = 0;
var propagate_key_up_right_flippers = 0;
var number_of_left_flippers = 0;
var number_of_right_flippers = 0;

var displayTimer;
function displaySpecialMessage(msg, onDone) {
  var duration = 1200;
  specialMessage = msg;
  blinkUntil = getTime() + duration;

  if (displayTimer) {
    clearInterval(displayTimer);
  }

  displayTimer = setInterval(function() {
    isBlinking = !isBlinking;
    var t = getTime();
    if (t > blinkUntil) {
      clearInterval(displayTimer);
      displayTimer = undefined;
      specialMessage = "";
      isBlinking = false;
      onDone && onDone();
    }
  }, 150);
}

function increase_brightness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

function getTime() {
  return new Date().valueOf();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inArr(item, arr) {
  return arr.indexOf(item) !== -1;
}

function removeFromArr(item, arr) {
  var i = arr.indexOf(item);
  arr.splice(i, 1);
  return arr;
}

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

function accum(newVec, vects, maxLen) {
  vects.push(newVec);
  var avgVec = { x: 0, y: 0 };
  if (vects.length > maxLen) {
    vects.shift();
  }
  vects.forEach(function (ref) {
    var x = ref.x;
    var y = ref.y;

    avgVec.x += x;
    avgVec.y += y;
  });
  avgVec.x /= vects.length;
  avgVec.y /= vects.length;
  return avgVec;
}

function linearize(n, a, b) {
  var l = Math.abs(b - a);

  var r;
  if (a > b) {
    r = (n - a) / -l;
  } else {
    r = (n - a) / l;
  }

  return clamp(r, 0, 1);
}

function p(arr) {
  return { x: arr[0], y: arr[1] };
}

var YELLOW = "#DD2";
var DARK_GRAY = "#333";


var KC_M = 77;
var KC_R = 82;
var KC_S = 83;
var KC_T = 84;
var KC_Z = 90;
var KC_SPACE = 32;
var KC_LEFT = 37;
var KC_RIGHT = 39;
var KC_UP = 38;
var KC_DOWN = 40;
var KC_ENTER = 13;
var KCS = [KC_Z, KC_M, KC_R, KC_S, KC_DOWN, KC_ENTER, KC_T];

var keyIsDown = {};
var keyIsUp = {};

var ballsOnScreen = [];
var ballsToRemove = [];

var currentTilt = 0;
var nextTilt = 0;
var stopTilt = 0;

function hookKeys() {
  document.addEventListener("keydown", function (ev) {
    var kc = ev.keyCode;
    //console.log(kc);
    if (ev.ctrlKey || ev.altKey || ev.shiftKey || !inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (keyIsDown[kc]) {
      return;
    }

    if (kc === KC_Z || kc === KC_M) {
      soundEnabled && sfx.flipper.play();
    } else if (kc === KC_S) {
      soundEnabled = !soundEnabled;
      saveLS("sound", soundEnabled);
      setSfx(soundEnabled);
      setMusic(soundEnabled);
    }

    keyIsDown[kc] = true;
  });

  document.addEventListener("keyup", function (ev) {
    var kc = ev.keyCode;
    if (ev.ctrlKey || ev.altKey || ev.shiftKey || !inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (!keyIsDown[kc]) {
      return;
    }

    if (kc === KC_DOWN) {
      soundEnabled && sfx.ball_out.play();
    }

    if (kc === KC_ENTER && ballsOnScreen.length === 0) {
      if (won) {
        startNextLevel();
      } else {
        restart();
      }
    }

    keyIsDown[kc] = false;
    keyIsUp[kc] = true;
  });
}

var beforeUpdateCbs = [];

function polarMove(ref) {
  var pos = ref.pos;
  var r = ref.r;
  var angle = ref.angle;

  var a = DEG2RAD * angle;
  return [pos[0] + Math.cos(a) * r, pos[1] + Math.sin(a) * r];
}

function createArc(ref) {
  var pos = ref.pos;
  var r = ref.r;
  var a0 = ref.a0;
  var a1 = ref.a1;
  var steps = ref.steps;
  var dims = ref.dims;
  var options = ref.options;

  var a = a0;
  var da = (a1 - a0) / steps;

  var parts = [];
  for (var i = 0; i <= steps; ++i) {
    var p = polarMove({ pos, r, angle: a });
    var rect = M.Bodies.rectangle(p[0], p[1], dims[0], dims[1], {
      angle: a * DEG2RAD,
      render: options.render
    });
    parts.push(rect);

    a += da;
  }

  return M.Body.create(Object.assign({}, {parts}, options));
}

function createFlipperShape(ref) {
  var pos = ref.pos;
  var ra = ref.ra;
  var rb = ref.rb;
  var length = ref.length;
  var options = ref.options;

  var pa = [pos[0] - length / 2, pos[1]];
  var pb = [pos[0] + length / 2, pos[1]];

  var circleA = M.Bodies.circle(pa[0], pa[1], ra, { render: options.render });
  var circleB = M.Bodies.circle(pb[0], pb[1], rb, { render: options.render });
  var poly = M.Bodies.fromVertices(
    pos[0],
    pos[1],
    [
      { x: pa[0], y: pa[1] - ra },
      { x: pa[0], y: pa[1] + ra },
      { x: pb[0], y: pb[1] + rb },
      { x: pb[0], y: pb[1] - rb }
    ],
    { render: options.render }
  );

  return M.Body.create({ parts: [circleA, circleB, poly] }, options);
}

function createFlipper(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var dims = ref.dims;
  var nailRelPos = ref.nailRelPos;
  var minAngle = ref.minAngle;
  var key = ref.key;
  var angVel = ref.angVel;
  var renderOptions = ref.renderOptions;

  var nailPos = { x: pos[0] + nailRelPos[0], y: pos[1] + nailRelPos[1] };

  var invertAngles = nailRelPos[0] > 0;

  if (invertAngles) {
    number_of_right_flippers++;
  } else {
    number_of_left_flippers++;
  }

  //const rect = M.Bodies.rectangle(nailPos.x, nailPos.y, dims[0], dims[1], {
  //  density: 0.0015
  //}); // 0.001

  var rect = createFlipperShape({
    pos: [nailPos.x, nailPos.y],
    ra: invertAngles ? 12 : 16,
    rb: invertAngles ? 16 : 12,
    length: dims[0] - Math.max(24, 16),
    options: { density: 0.0015, render: renderOptions }
  });

  var limitR = 5;

  var ballMaxPos = polarMove({
    pos: [nailPos.x, nailPos.y],
    r: 32,
    angle: invertAngles ? 180 - minAngle : minAngle
  });
  var ballMax = M.Bodies.circle(ballMaxPos[0], ballMaxPos[1], limitR, {
    isStatic: true,
    render: renderOptions
  });

  var constraint = M.Constraint.create({
    pointA: nailPos,
    bodyB: rect,
    pointB: { x: nailRelPos[0], y: nailRelPos[1] },
    length: 0
  });

  var wentDownF = 0;
  var is_key_up_master = false;

  beforeUpdateCbs.push(function () {
    var rotateFlipper = keyIsDown[key];
    var keyIsUpPressed = keyIsUp[key];
    var propagate_flipper = 0;
    if (invertAngles) {
      propagate_flipper = propagate_key_up_right_flippers;
    } else {
      propagate_flipper = propagate_key_up_left_flippers;
    }

    var placeBackFlipper =
      keyIsUpPressed || (propagate_flipper > 0 && !is_key_up_master);
    if (placeBackFlipper) {
      wentDownF = getTime() + 100;
      if (keyIsUpPressed) {
        keyIsUp[key] = false;
        is_key_up_master = true;
        if (invertAngles) {
          propagate_key_up_right_flippers = number_of_right_flippers - 1;
        } else {
          propagate_key_up_left_flippers = number_of_left_flippers - 1;
        }
      } else {
        if (invertAngles) {
          propagate_key_up_right_flippers--;
        } else {
          propagate_key_up_left_flippers--;
        }
      }
    }

    if (rotateFlipper) {
      //console.log((rect.angle * RAD2DEG).toFixed(1));
      var i = invertAngles ? 1 : -1;
      var n = linearize(rect.angle * RAD2DEG, 30 * i, -7 * i);
      //console.log((n * 100).toFixed(1));
      M.Body.setAngularVelocity(rect, angVel * n);
    } else {
      if (wentDownF > 0) {
        var ctime = getTime();
        if (ctime < wentDownF) {
          M.Body.setAngularVelocity(rect, -angVel * 0.3);
        } else {
          wentDownF = 0;
          is_key_up_master = false;
        }
      }
    }
  });

  M.World.add(engine.world, [rect, ballMax, constraint]);
}

function createRect(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var dims = ref.dims;
  var angle = ref.angle;
  var options = ref.options;

  var rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], Object.assign({}, {isStatic: true,
    angle: angle * DEG2RAD},
    options));

  M.World.add(engine.world, [rectangle]);

  return rectangle;
}

function createRotatingPolygon(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var r = ref.r;
  var spinsPerSecond = ref.spinsPerSecond;
  var sides = ref.sides;
  var options = ref.options;

  var poly = M.Bodies.polygon(pos[0], pos[1], sides, r, options);
  var dAngle = spinsPerSecond * 360 * DEG2RAD / 60;
  beforeUpdateCbs.push(function () {
    M.Body.setAngle(poly, poly.angle + dAngle);
  });
  M.World.add(engine.world, [poly]);
}

function createPlunger(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var dims = ref.dims;
  var angle = ref.angle;
  var options = ref.options;

  var rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], Object.assign({}, {angle: angle * DEG2RAD,
    density: 0.3},
    options));

  var dx = 10;

  var stiff = 0.01;
  var aStiff = 0;
  var damp = 0.001;
  var len = 1;

  var c1 = M.Constraint.create({
    pointA: { x: -dx, y: 0 },
    bodyA: rectangle,
    pointB: { x: pos[0] - dx, y: pos[1] },
    stiffness: stiff,
    angularStiffness: aStiff,
    damping: damp,
    length: len
  });

  var c2 = M.Constraint.create({
    pointA: { x: dx, y: 0 },
    bodyA: rectangle,
    pointB: { x: pos[0] + dx, y: pos[1] },
    stiffness: stiff,
    angularStiffness: aStiff,
    damping: damp,
    length: len
  });

  M.World.add(engine.world, [rectangle, c1, c2]);

  beforeUpdateCbs.push(function () {
    if (keyIsDown[KC_DOWN]) {
      M.Body.applyForce(rectangle, rectangle.position, {
        x: 0,
        y: 20
      });
    }
  });
}

function createSphere(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var r = ref.r;

  var sphere = M.Bodies.circle(pos[0], pos[1], r, {
    density: 0.0006,
    friction: 0,
    restitution: 0.5
  });

  M.World.add(engine.world, [sphere]);

  return sphere;
}

function createBumper(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var r = ref.r;
  var options = ref.options;

  var sphere = M.Bodies.circle(pos[0], pos[1], r, Object.assign({}, {friction: 1,
    restitution: 2},
    options));

  var constraint = M.Constraint.create({
    bodyA: sphere,
    pointA: { x: 0, y: 0 },
    pointB: { x: pos[0], y: pos[1] },
    stiffness: 0.2,
    angularStiffness: 0,
    damping: 0.5,
    length: 0
  });

  M.World.add(engine.world, [sphere, constraint]);
}

function createTriangleBumper(ref) {
  var engine = ref.engine;
  var pos = ref.pos;
  var v0 = ref.v0;
  var v1 = ref.v1;
  var v2 = ref.v2;
  var r = ref.r;
  var options = ref.options;

  var originalVerts = [v0, v1, v2].map(p);
  var verts = r ? M.Vertices.chamfer(originalVerts, r) : originalVerts;
  var ctr = p(pos) || M.Vertices.centre(originalVerts);
  var tri = M.Bodies.fromVertices(ctr.x, ctr.y, verts, Object.assign({}, {isStatic: true,
    friction: 1,
    restitution: 2},
    options));
  M.World.add(engine.world, [tri]);
  return tri;
}

function hookMouse(ref) {
  var engine = ref.engine;
  var render = ref.render;

  var mouse = M.Mouse.create(render.canvas);
  var mouseConstraint = M.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      angularStiffness: 0,
      render: {
        //visible: false
      }
    }
  });

  M.World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;
}

function prepare() {
  var engine = M.Engine.create();

  var render = M.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: W,
      height: H,
      wireframes: false
      //showAngleIndicator: true
    }
  });
  engine.world.gravity.y = 0.4;

  M.Events.on(engine, "beforeUpdate", function() {
    beforeUpdateCbs.forEach(function (cb) { return cb(); });
  });

  var levelConfig;

  function restart() {
    sfx.gameover.stop();
    score = 0;
    currentLevel = 0;
    spareBalls = 3;
    extraBalls = 6;
    needsNewBall = false;
    startNextLevel();
    soundEnabled && sfx.dingding.play();
    displaySpecialMessage("   O -> INSERTED COIN <- O");
  }
  window.restart = restart;

  function startNextLevel() {
    sfx.win.stop();
    sfx.gameover.stop();
    won = false;
    spareBalls = 3;
    beforeUpdateCbs = [];
    M.World.clear(engine.world);
    M.Engine.clear(engine);

    beforeUpdateCbs.push(function () {
      ballsToRemove.forEach(removeBall);
      ballsToRemove = [];
      if (needsNewBall) {
        needsNewBall = false;
        --spareBalls;
        if (spareBalls > 0) {
          // still have extra balls
          displaySpecialMessage("       TRY AGAIN   O x " + spareBalls);
          soundEnabled && sfx.try_again.play();

          addBall();
        } else if (spareBalls === 0) {
          // no more, SPAM the MOFO
          displaySpecialMessage("OO LOOKS LIKE YOU NEED BALLS OO");
          soundEnabled && sfx.manyballs.play();
          for (var i = 0; i < extraBalls; ++i) {
            addBall();
          }
        } else if (ballsOnScreen.length === 0) {
          // game over
          setMusic(false);
          soundEnabled && sfx.gameover_voice.play();
          soundEnabled && setTimeout(function() {
            soundEnabled && sfx.gameover.play();
          }, 1000);
          if (score > highScore) {
            highScore = score;
            saveLS("score", highScore);
          }
        }
      }
    });

    number_of_left_flippers = 0;
    number_of_right_flippers = 0;
    propagate_key_up_right_flippers = 0;
    propagate_key_up_left_flippers = 0;

    // SAFER WAY TO RESTART... OR DO SOMETHING ELSE?
    if (currentLevel >= levelBuilders.length){
      displaySpecialMessage("OO !!!!!CONTRATULATIONS!!!!!! OO");
      currentLevel = 0;
    }


    levelConfig = levelBuilders[currentLevel](engine, W, H);
    spawnPos = levelConfig.spawnPos;

    addBall();

    loadMusic(levelConfig.musicIndex, function(){
      //console.log('called my get part, spare balls - ' + spareBalls + ' number of balls on screen ' + ballsOnScreen.length + 'xxxx' + ballsOnScreen[0].position.x + 'yyyyyyy' + ballsOnScreen[0].position.y  );
      if (spareBalls <= 0 && ballsOnScreen.length > 2){
        //console.log('music in panic mode');
        return 2;
      }

      if (ballsOnScreen.length){
        if (ballsOnScreen[0].position.y <= levelConfig.higher_h){
          //console.log('music in higher mode');
          return 2;
        }
        if (ballsOnScreen[0].position.y <= levelConfig.middle_h){
          //console.log('music in middle mode');
          return 1;
        }
        //console.log('music in lower mode');
        return 0;
      }
      //console.log('no balls');
      return 0;
    });
    soundEnabled && sfx.get_ready.play();
    soundEnabled && setTimeout(function() {
      // avoid double play if player activated the sound in this time
      !isMusicPlaying() && setMusic(soundEnabled);
    }, 1500);


    ++currentLevel;
  }
  window.startNextLevel = startNextLevel;

  startNextLevel();

  // hookMouse({ engine, render });
  hookKeys();

  var buffer = [];
  M.Events.on(engine, "beforeTick", function () {
    if (ballsOnScreen.length === 0) {
      return;
    }

    /* process tilt key */
    var tilt_offset_x = 0;
    var tilt_offset_y = 0;
    var apply_tilt = false;

    if (keyIsDown[KC_T]) {
      var cdate = new Date().valueOf();
      if (currentTilt === 0) {
        ///console.log('Set new tilt');
        currentTilt = cdate;
        nextTilt = cdate + 10000; //10 seconds cool down
        stopTilt = cdate + 1000; //1 second duration
        apply_tilt = true;
        var new_offset_x = getRandomInt(-10, 10) * 0.004;
        var new_offset_y = getRandomInt(-10, 10) * 0.004;
        ballsOnScreen.forEach(function (b) {
          M.Body.applyForce(b, b.position, {
            x: new_offset_x,
            y: new_offset_y
          });
        });
      } else if (cdate < stopTilt) {
        //console.log('Grace time');
        apply_tilt = true;
      }

      //apply_tilt = false; // disable shake cam
      if (apply_tilt) {
        //console.log('Applying tilt');
        displaySpecialMessage("=============== TILT ===============");
        tilt_offset_x = getRandomInt(-10, 10);
        tilt_offset_y = getRandomInt(-10, 10);
        buffer = [];
      }
    } else if (keyIsUp[KC_T]) {
      keyIsUp[KC_T] = false;
    }

    /* reset tilt state */
    if (currentTilt !== 0 && new Date().valueOf() > nextTilt) {
      //console.log('RESETING TILT');
      currentTilt = 0;
      nextTilt = 0;
      stopTilt = 0;
    }

    var s = clamp(40 * ballsOnScreen[0].speed, 200, 100000);
    var cam_offset_x = s + tilt_offset_x;
    var cam_offset_y = s + tilt_offset_y;
    // const cam_offset_x = s + tilt_offset_x + 500;
    // const cam_offset_y = s + tilt_offset_y + 500;
    var v = accum({ x: cam_offset_x, y: cam_offset_y }, buffer, 180);
    M.Render.lookAt(render, ballsOnScreen, v, false);
  });

  function addBall() {
    var sphere = createSphere({ engine, pos: spawnPos, r: 20 });
    ballsOnScreen.push(sphere);
  }

  function removeBall(ball) {
    removeFromArr(ball, ballsOnScreen);
    M.World.remove(engine.world, ball);
  }

  function win() {
    won = true;
    soundEnabled && sfx.dingding.play();
    displaySpecialMessage("           LEVEL UP!", function () {
      soundEnabled && sfx.dingding.play();
      displaySpecialMessage("          +1000 POINTS");
      score += 1000;
    });
    ballsOnScreen.forEach(function (b) { return ballsToRemove.push(b); });

    setMusic(false);
    soundEnabled && sfx.levelup_good_job.play();
    soundEnabled && sfx.win.play();
  }
  window.win = win;

  function onCustom(_custom, body, otherBody) {
    //console.log("custom: %s", _custom);

    _custom.split(" ").forEach(function (custom) {
      if (custom === "goal") {
        win();
      } else if (custom === "boundary") {
        ballsToRemove.push(otherBody);
        needsNewBall = true;
      } else if (custom.indexOf("sfx|") === 0) {
        var sample = custom.split("|")[1];
        soundEnabled && sfx[sample].play();
      } else if (custom === "brick") {
        // to make it without multiple colors
        var nextColor =
          body.remainingBrickColors && body.remainingBrickColors.shift();
        if (nextColor) {
          body.render.fillStyle = nextColor;
        } else {
          M.World.remove(engine.world, body);
          if ("brickDone" in body) {
            body.brickDone(body);
          }
        }
      }
    });
  }

  M.Events.on(engine, "collisionEnd", function (ev) {
    ev.pairs.forEach(function (ref) {
      var bodyA = ref.bodyA;
      var bodyB = ref.bodyB;

      //soundEnabled && sfx.collision_1.play();

      // all the bodies who have sound will restore to their original colors on collision end
      if (bodyA.custom && bodyA.custom.indexOf('sfx|') !== -1 && bodyA.render && bodyA.render.oldFillStyle){
        ++score;
        bodyA.render.fillStyle = bodyA.render.oldFillStyle;
        bodyA.render.oldFillStyle = undefined;
      }
      if (bodyB.custom && bodyB.custom.indexOf('sfx|') !== -1 && bodyB.render && bodyB.render.oldFillStyle){
        ++score;
        bodyB.render.fillStyle = bodyB.render.oldFillStyle;
        bodyA.render.oldFillStyle = undefined;
      }

      if (bodyA.custom) {
        onCustom(bodyA.custom, bodyA, bodyB);
      }
      if (bodyB.custom) {
        onCustom(bodyB.custom, bodyB, bodyA);
      }

    });
  });

  M.Events.on(engine, "collisionStart", function (ev) {
    ev.pairs.forEach(function (ref) {
      var bodyA = ref.bodyA;
      var bodyB = ref.bodyB;

      // all the bodies who have sound will have increased brightness during the collision
      if (bodyA.custom && bodyA.custom.indexOf('sfx|') !== -1 && bodyA.render && bodyA.render.fillStyle && bodyA.render.oldFillStyle === undefined){
        bodyA.render.oldFillStyle = bodyA.render.fillStyle;
        bodyA.render.fillStyle = increase_brightness(bodyA.render.fillStyle, 25);
      }
      if (bodyB.custom && bodyB.custom.indexOf('sfx|') !== -1 && bodyB.render && bodyB.render.fillStyle && bodyB.render.oldFillStyle === undefined){
        bodyB.render.oldFillStyle = bodyB.render.fillStyle;
        bodyB.render.fillStyle = increase_brightness(bodyB.render.fillStyle, 25);
      }
    });
  });

  var bgImg = new Image();
  bgImg.src = "assets/title.png";
  var bgPattern,
    bgReady = false;
  bgImg.onload = function() {
    bgReady = true;
  };

  M.Events.on(render, "afterRender", function(ev) {
    var t = ev.timestamp;
    //M.Render.startViewTransform(render);

    var ctx = render.context;

    if (bgReady && t < 4000) {
      if (!bgPattern) {
        bgPattern = ctx.createPattern(bgImg, "repeat");
      }

      ctx.fillStyle = bgPattern;
      ctx.globalAlpha = t < 1000 ? t/1000 : (t > 3000 ? 1 - (t - 3000) / 1000 : 1);
      ctx.fillRect(0, 0, 800, 600);
      ctx.globalAlpha = 1;
    }

    ctx.font = "40px DotMatrixBold";

    ctx.fillStyle = isBlinking ? YELLOW : DARK_GRAY;
    ctx.fillText("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", 20 + 4.5, 50);
    ctx.fillText("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", 20, 50);

    ctx.fillStyle = isBlinking ? DARK_GRAY : YELLOW;
    var msg;
    if (specialMessage) {
      msg = specialMessage;
    } else if (ballsOnScreen.length > 0) {
      msg =
        "HIGH:" +
        highScore +
        " SCORE:" +
        score +
        " BALLS:" +
        (spareBalls >= 0 ? spareBalls : "?!") +
        " L:" +
        currentLevel;
    } else {
      msg = won ? "    PRESS ENTER TO CONTINUE" : "           GAME OVER";
    }
    ctx.fillText(msg, 20, 50);

    //M.Render.endViewTransform(render);
  });

  M.Engine.run(engine);
  M.Render.run(render);
}

prepare();

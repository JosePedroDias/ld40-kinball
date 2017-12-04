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

  var music_parts = undefined;

  var current_loop = "start_normal";

  function loadMusic(levelNumber) {
    if (music_parts !== undefined){
      // we need to unload first;
      music_parts.unload();
    }

    music_parts = {};

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

      if (cv >= max_variants) {
        cv = 0;

        /*cp++;
      if (cp >= max_progress) {
        cp = 0;
      }*/

        cp = getPart();
      }

      current_loop = progress[cp] + "_" + variants[cv];

      //console.log('Changing loop to ' + current_loop);

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

  global.loadMusic = loadMusic;
  global.setMusic = setMusic;
})(this);
"use strict";

var sfx = {};

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
levelBuilders.push(function buildLevel(engine, W, H) {
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3
  });

  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3
  });

  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30
  });

  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30
  });

  createRect({
    engine,
    pos: [W / 2 - 340, H * 0.41],
    dims: [360, 24],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2 + 340, H * 0.41],
    dims: [360, 24],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2 + 270, H * 0.51],
    dims: [260, 12],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2, H * 0.092],
    dims: [700, 24],
    angle: 0
  });

  createBumper({
    engine,
    pos: [W * 0.7, H * 0.4],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });
  createBumper({
    engine,
    pos: [W * 0.6, H * 0.55],
    r: 32,
    options: { custom: "sfx|collision_1" }
  });
  createBumper({
    engine,
    pos: [W * 0.25, H * 0.2],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });

  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: { custom: "sfx|collision_1" }
  });

  var arc = createArc({
    pos: [W * 0.805, H * 0.252],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [12, 24],
    steps: 12,
    options: { isStatic: true }
  });
  M.World.add(engine.world, [arc]);

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: false
      }
    }
  });

  createPlunger({
    engine,
    pos: [W * 0.877, H * 0.6],
    dims: [40, 32],
    angle: 0
  });

  createTriangleBumper({
    engine,
    pos: [300, 250],
    v0: [-40, 30],
    v1: [40, 30],
    v2: [0, -30],
    //r: 10
    options: {
      custom: "goal"
    }
  });

  return {
    spawnPos: [W * 0.88, H * 0.5],
    musicIndex: 0
  };
});
levelBuilders.push(function buildLevel(engine, W, H) {
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3
  });

  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3
  });

  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30
  });

  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30
  });

  createRect({
    engine,
    pos: [W / 2 - 340, H * 0.41],
    dims: [360, 24],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2 + 340, H * 0.41],
    dims: [360, 24],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2 + 270, H * 0.51],
    dims: [260, 12],
    angle: 90
  });

  createRect({
    engine,
    pos: [W / 2, H * 0.092],
    dims: [700, 24],
    angle: 0
  });

  createBumper({
    engine,
    pos: [W * 0.7, H * 0.4],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });
  createBumper({
    engine,
    pos: [W * 0.6, H * 0.55],
    r: 32,
    options: { custom: "sfx|collision_1" }
  });
  createBumper({
    engine,
    pos: [W * 0.25, H * 0.2],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });

  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: { custom: "sfx|collision_1" }
  });

  var arc = createArc({
    pos: [W * 0.805, H * 0.252],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [12, 24],
    steps: 12,
    options: { isStatic: true }
  });
  M.World.add(engine.world, [arc]);

  var lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: false
      }
    }
  });

  createPlunger({
    engine,
    pos: [W * 0.877, H * 0.6],
    dims: [40, 32],
    angle: 0
  });

  createTriangleBumper({
    engine,
    pos: [300, 250],
    v0: [-40, 30],
    v1: [40, 30],
    v2: [0, -30],
    //r: 10
    options: { custom: "goal" }
  });

  return {
    spawnPos: [W * 0.88, H * 0.5],
    musicIndex: 1
  };
});
var M = Matter;

var W = 800;
var H = 600;

var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;

var currentLevel = 0;
var score = 0;
var spareBalls = 1;
var extraBalls = 6;
var blinkUntil = 0;
var won = false;
var specialMessage = "";

var highScore = loadLS("score", 0);
var soundEnabled = loadLS("sound", true);
var spawnPos;
var isBlinking = false;
var needsNewBall = false;

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
  }, 100);
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

var KC_Z = 90;
var KC_M = 77;
var KC_R = 82;
var KC_S = 83;
var KC_T = 84;
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
      angle: a * DEG2RAD
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

  var circleA = M.Bodies.circle(pa[0], pa[1], ra);
  var circleB = M.Bodies.circle(pb[0], pb[1], rb);
  var poly = M.Bodies.fromVertices(pos[0], pos[1], [
    { x: pa[0], y: pa[1] - ra },
    { x: pa[0], y: pa[1] + ra },
    { x: pb[0], y: pb[1] + rb },
    { x: pb[0], y: pb[1] - rb }
  ]);

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

  var nailPos = { x: pos[0] + nailRelPos[0], y: pos[1] + nailRelPos[1] };

  var invertAngles = nailRelPos[0] > 0;

  //const rect = M.Bodies.rectangle(nailPos.x, nailPos.y, dims[0], dims[1], {
  //  density: 0.0015
  //}); // 0.001

  var rect = createFlipperShape({
    pos: [nailPos.x, nailPos.y],
    ra: invertAngles ? 12 : 16,
    rb: invertAngles ? 16 : 12,
    length: dims[0] - Math.max(24, 16),
    options: { density: 0.0015 }
  });

  var limitR = 5;

  var ballMaxPos = polarMove({
    pos: [nailPos.x, nailPos.y],
    r: 32,
    angle: invertAngles ? 180 - minAngle : minAngle
  });
  var ballMax = M.Bodies.circle(ballMaxPos[0], ballMaxPos[1], limitR, {
    isStatic: true
  });

  var constraint = M.Constraint.create({
    pointA: nailPos,
    bodyB: rect,
    pointB: { x: nailRelPos[0], y: nailRelPos[1] },
    length: 0
  });

  var wentDownF = 0;

  beforeUpdateCbs.push(function () {
    var rotateFlipper = keyIsDown[key];

    var placeBackFlipper = keyIsUp[key];
    if (placeBackFlipper) {
      wentDownF = getTime() + 100;
      keyIsUp[key] = false;
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
        y: 10
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
    displaySpecialMessage("INSERTED COIN");
  }
  window.restart = restart;

  function startNextLevel() {
    sfx.win.stop();
    sfx.gameover.stop();
    won = false;
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
          addBall();
        } else if (spareBalls === 0) {
          // no more, SPAM the MOFO
          displaySpecialMessage("LOOKS LIKE YOU NEED BALLS...");
          for (var i = 0; i < extraBalls; ++i) {
            addBall();
          }
        } else if (ballsOnScreen.length === 0) {
          // game over
          setMusic(false);
          soundEnabled && sfx.gameover.play();
          if (score > highScore) {
            highScore = score;
            saveLS("score", highScore);
          }
        }
      }
    });

    levelConfig = levelBuilders[currentLevel](engine, W, H);
    spawnPos = levelConfig.spawnPos;

    addBall();

    loadMusic(levelConfig.musicIndex);
    setMusic(soundEnabled);

    ++currentLevel;
    if (currentLevel >= levelBuilders.length) {
      currentLevel = 0;
    }
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

  function onCustom(custom, body, otherBody) {
    console.log("custom: %s", body.custom);
    if (custom === "goal") {
      won = true;
      displaySpecialMessage("LEVEL UP!", function () {
        displaySpecialMessage("+1000 POINTS");
        score += 1000;
      });
      ballsOnScreen.forEach(function (b) { return ballsToRemove.push(b); });

      setMusic(false);
      soundEnabled && sfx.win.play();
    } else if (custom === "boundary") {
      ballsToRemove.push(otherBody);
      needsNewBall = true;
    } else if (custom.indexOf("sfx|") === 0) {
      var sample = custom.split("|")[1];
      soundEnabled && sfx[sample].play();
    }
  }

  M.Events.on(engine, "collisionEnd", function (ev) {
    ev.pairs.forEach(function (ref) {
      var bodyA = ref.bodyA;
      var bodyB = ref.bodyB;

      ++score;
      //soundEnabled && sfx.collision_1.play();

      if (bodyA.custom) {
        onCustom(bodyA.custom, bodyA, bodyB);
      }
      if (bodyB.custom) {
        onCustom(bodyB.custom, bodyB, bodyA);
      }
    });
  });

  /*const bgImg = new Image();
  bgImg.src = "ball.png";
  let bgPattern,
    bgReady = false;
  bgImg.onload = function() {
    bgReady = true;
  };

  M.Events.on(render, "beforeRender", function() {
    const ctx = render.context;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    M.Render.startViewTransform(render);

    if (bgReady) {
      if (!bgPattern) {
        bgPattern = ctx.createPattern(bgImg, "repeat");
      }

      ctx.fillStyle = bgPattern;
      ctx.fillRect(-2500, -2500, 5000, 5000);
    }

    M.Render.endViewTransform(render);
  });*/

  M.Events.on(render, "afterRender", function() {
    //M.Render.startViewTransform(render);

    var ctx = render.context;
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
      msg = won ? "PRESS ENTER TO CONTINUE" : "GAME OVER";
    }
    ctx.fillText(msg, 20, 50);

    //M.Render.endViewTransform(render);
  });

  M.Engine.run(engine);
  M.Render.run(render);
}

prepare();

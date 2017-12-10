const M = Matter;

const W = 800;
const H = 600;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const DEBUG_TRIGGERS = false;

let currentLevel = 0;
let score = 0;
let spareBalls = 3;
let extraBalls = 6;
let blinkUntil = 0;
let won = false;
let specialMessage = "";

let highScore = loadLS("score", 0);
let soundEnabled = loadLS("sound", true);
let spawnPos;
let isBlinking = false;
let needsNewBall = false;

let displayTimer;
function displaySpecialMessage(msg, onDone) {
  const duration = 1200;
  specialMessage = msg;
  blinkUntil = getTime() + duration;

  if (displayTimer) {
    clearInterval(displayTimer);
  }

  displayTimer = setInterval(function() {
    isBlinking = !isBlinking;
    const t = getTime();
    if (t > blinkUntil) {
      clearInterval(displayTimer);
      displayTimer = undefined;
      specialMessage = "";
      isBlinking = false;
      onDone && onDone();
    }
  }, 150);
}

function increase_brightness(hex, percent) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return (
    "#" +
    (0 | ((1 << 8) + r + (256 - r) * percent / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + (256 - g) * percent / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + (256 - b) * percent / 100)).toString(16).substr(1)
  );
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
  const i = arr.indexOf(item);
  arr.splice(i, 1);
  return arr;
}

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

function accum(newVec, vects, maxLen) {
  vects.push(newVec);
  const avgVec = { x: 0, y: 0 };
  if (vects.length > maxLen) {
    vects.shift();
  }
  vects.forEach(({ x, y }) => {
    avgVec.x += x;
    avgVec.y += y;
  });
  avgVec.x /= vects.length;
  avgVec.y /= vects.length;
  return avgVec;
}

function linearize(n, a, b) {
  const l = Math.abs(b - a);

  let r;
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

const YELLOW = "#DD2";
const DARK_GRAY = "#333";

const TR_LEFT_FLIPPER = 1;
const TR_RIGHT_FLIPPER = 2;
const TR_LAUNCH = 3;
const TR_TILT = 4;
const TR_TOGGLE_AUDIO = 5;
const TR_TOGGLE_PAUSE = 6; // TODO

const KC_M = 77;
const KC_S = 83;
const KC_T = 84;
const KC_Z = 90;
const KC_SPACE = 32;
const KC_LEFT = 37;
const KC_RIGHT = 39;
const KC_UP = 38;
const KC_DOWN = 40;
const KCS = [
  KC_DOWN,
  KC_Z,
  KC_LEFT,
  KC_M,
  KC_RIGHT,
  KC_T,
  KC_SPACE,
  KC_UP,
  KC_S
];

const keyToTrigger = {
  [KC_DOWN]: TR_LAUNCH,
  [KC_Z]: TR_LEFT_FLIPPER,
  [KC_LEFT]: TR_LEFT_FLIPPER,
  [KC_M]: TR_RIGHT_FLIPPER,
  [KC_RIGHT]: TR_RIGHT_FLIPPER,
  [KC_T]: TR_TILT,
  [KC_SPACE]: TR_TILT,
  [KC_UP]: TR_TILT,
  [KC_S]: TR_TOGGLE_AUDIO
};

const triggerIsDown = {};
let triggerJustChanged = {};
let anyTriggerIsDown = false;

const ballsOnScreen = [];
let ballsToRemove = [];

let currentTilt = 0;
let nextTilt = 0;
let stopTilt = 0;

function hookKeys() {
  document.addEventListener("keydown", ev => {
    const kc = ev.keyCode;
    //console.log(kc);
    if (ev.ctrlKey || ev.altKey || ev.shiftKey || !inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();

    const tr = keyToTrigger[kc];

    if (triggerIsDown[tr]) {
      return;
    }

    triggerIsDown[tr] = true;
    triggerJustChanged[tr] = true;
  });

  document.addEventListener("keyup", ev => {
    const kc = ev.keyCode;
    if (ev.ctrlKey || ev.altKey || ev.shiftKey || !inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();

    const tr = keyToTrigger[kc];

    if (!triggerIsDown[tr]) {
      return;
    }

    triggerIsDown[tr] = false;
    triggerJustChanged[tr] = true;
  });
}

let beforeUpdateCbs = [];

function polarMove({ pos, r, angle }) {
  const a = DEG2RAD * angle;
  return [pos[0] + Math.cos(a) * r, pos[1] + Math.sin(a) * r];
}

function createArc({ pos, r, a0, a1, steps, dims, options }) {
  let a = a0;
  const da = (a1 - a0) / steps;

  const parts = [];
  for (let i = 0; i <= steps; ++i) {
    const p = polarMove({ pos, r, angle: a });
    const rect = M.Bodies.rectangle(p[0], p[1], dims[0], dims[1], {
      angle: a * DEG2RAD,
      render: options.render
    });
    parts.push(rect);

    a += da;
  }

  return M.Body.create({ parts, ...options });
}

function createFlipperShape({ pos, ra, rb, length, options }) {
  const pa = [pos[0] - length / 2, pos[1]];
  const pb = [pos[0] + length / 2, pos[1]];

  const circleA = M.Bodies.circle(pa[0], pa[1], ra, { render: options.render });
  const circleB = M.Bodies.circle(pb[0], pb[1], rb, { render: options.render });
  const poly = M.Bodies.fromVertices(
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

function createFlipper({
  engine,
  pos,
  dims,
  nailRelPos,
  minAngle,
  key,
  angVel,
  renderOptions
}) {
  const nailPos = { x: pos[0] + nailRelPos[0], y: pos[1] + nailRelPos[1] };

  const invertAngles = nailRelPos[0] > 0;

  //const rect = M.Bodies.rectangle(nailPos.x, nailPos.y, dims[0], dims[1], {
  //  density: 0.0015
  //}); // 0.001

  const rect = createFlipperShape({
    pos: [nailPos.x, nailPos.y],
    ra: invertAngles ? 12 : 16,
    rb: invertAngles ? 16 : 12,
    length: dims[0] - Math.max(24, 16),
    options: { density: 0.0015, render: renderOptions }
  });

  const limitR = 5;

  const ballMaxPos = polarMove({
    pos: [nailPos.x, nailPos.y],
    r: 32,
    angle: invertAngles ? 180 - minAngle : minAngle
  });
  const ballMax = M.Bodies.circle(ballMaxPos[0], ballMaxPos[1], limitR, {
    isStatic: true,
    render: renderOptions
  });

  var constraint = M.Constraint.create({
    pointA: nailPos,
    bodyB: rect,
    pointB: { x: nailRelPos[0], y: nailRelPos[1] },
    length: 0
  });

  let wentDownF = 0;

  beforeUpdateCbs.push(() => {
    const rotateFlipper = triggerIsDown[key];
    const justWentUp = !rotateFlipper && triggerJustChanged[key];

    if (justWentUp) {
      wentDownF = getTime() + 100;
    }

    if (rotateFlipper) {
      const i = invertAngles ? 1 : -1;
      const n = linearize(rect.angle * RAD2DEG, 30 * i, -7 * i);
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

function createRect({ engine, pos, dims, angle, options }) {
  const rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], {
    isStatic: true,
    angle: angle * DEG2RAD,
    ...options
  });

  M.World.add(engine.world, [rectangle]);

  return rectangle;
}

function createRotatingPolygon({
  engine,
  pos,
  r,
  spinsPerSecond,
  sides,
  options
}) {
  const poly = M.Bodies.polygon(pos[0], pos[1], sides, r, options);
  const dAngle = spinsPerSecond * 360 * DEG2RAD / 60;

  beforeUpdateCbs.push(() => {
    M.Body.setAngle(poly, poly.angle + dAngle);
  });
  M.World.add(engine.world, [poly]);
}

function createPlunger({ engine, pos, dims, angle, options }) {
  const rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], {
    angle: angle * DEG2RAD,
    density: 0.3,
    ...options
  });

  const dx = 10;

  const stiff = 0.01;
  const aStiff = 0;
  const damp = 0.001;
  const len = 1;

  const c1 = M.Constraint.create({
    pointA: { x: -dx, y: 0 },
    bodyA: rectangle,
    pointB: { x: pos[0] - dx, y: pos[1] },
    stiffness: stiff,
    angularStiffness: aStiff,
    damping: damp,
    length: len
  });

  const c2 = M.Constraint.create({
    pointA: { x: dx, y: 0 },
    bodyA: rectangle,
    pointB: { x: pos[0] + dx, y: pos[1] },
    stiffness: stiff,
    angularStiffness: aStiff,
    damping: damp,
    length: len
  });

  M.World.add(engine.world, [rectangle, c1, c2]);

  function justDown(tr) {
    return triggerJustChanged[tr] && triggerIsDown[tr];
  }

  function justUp(tr) {
    return triggerJustChanged[tr] && !triggerIsDown[tr];
  }

  beforeUpdateCbs.push(() => {
    // down
    if (justDown(TR_LEFT_FLIPPER) || justDown(TR_RIGHT_FLIPPER)) {
      soundEnabled && sfx.flipper.play();
    }

    if (justDown(TR_TOGGLE_AUDIO)) {
      soundEnabled = !soundEnabled;
      saveLS("sound", soundEnabled);
      setSfx(soundEnabled);
      setMusic(soundEnabled);
    }

    // up
    if (justUp(TR_LAUNCH)) {
      soundEnabled && sfx.ball_out.play();
    }

    if (anyTriggerIsDown && ballsOnScreen.length === 0) {
      if (won) {
        startNextLevel();
      } else {
        restart();
      }
    }

    if (triggerIsDown[TR_LAUNCH]) {
      M.Body.applyForce(rectangle, rectangle.position, {
        x: 0,
        y: 20
      });
    }
  });
}

function createSphere({ engine, pos, r }) {
  const sphere = M.Bodies.circle(pos[0], pos[1], r, {
    density: 0.0006,
    friction: 0,
    restitution: 0.5
  });

  M.World.add(engine.world, [sphere]);

  return sphere;
}

function createBumper({ engine, pos, r, options }) {
  const sphere = M.Bodies.circle(pos[0], pos[1], r, {
    //density: 0.0001, // 0.001
    friction: 1,
    restitution: 2,
    ...options
  });

  const constraint = M.Constraint.create({
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

function createTriangleBumper({ engine, pos, v0, v1, v2, r, options }) {
  const originalVerts = [v0, v1, v2].map(p);
  const verts = r ? M.Vertices.chamfer(originalVerts, r) : originalVerts;
  const ctr = p(pos) || M.Vertices.centre(originalVerts);
  const tri = M.Bodies.fromVertices(ctr.x, ctr.y, verts, {
    isStatic: true,
    friction: 1,
    restitution: 2,
    ...options
  });
  M.World.add(engine.world, [tri]);
  return tri;
}

setTimeout(hookTouch, 500);

function hookTouch() {
  const g = document.querySelector("canvas").getBoundingClientRect();
  const x0 = g.left;
  const y0 = g.top;
  //console.log(x0, y0);
  const h = 0.5;
  function electTrigger(pos) {
    const [x, y] = [
      clamp((pos[0] - x0) / W, 0, 1),
      clamp((pos[1] - y0) / H, 0, 1)
    ];

    const a = x > y; // TR
    const b = x > 1 - y; // BR
    //console.log("%s, %s -> %s %s", x.toFixed(1), y.toFixed(1), a ? 1 : 0, b ? 1 : 0);

    if (a) {
      if (b) {
        return TR_RIGHT_FLIPPER; // right
      } else {
        return TR_TILT; // top
      }
    } else {
      if (b) {
        return TR_LAUNCH; // bottom
      } else {
        return TR_LEFT_FLIPPER; // left
      }
    }
  }

  function setTouchTrigger(state) {
    return function(ev) {
      ev.preventDefault();
      ev.stopPropagation(); // touches changedTouches targetTouches
      for (let i = 0, l = ev.changedTouches.length; i < l; ++i) {
        //console.log(l);
        const ct = ev.changedTouches[i];
        const tr = electTrigger([ct.clientX, ct.clientY]);
        triggerIsDown[tr] = state;
        triggerJustChanged[tr] = true;
      }
      //return true;
    };
  }

  document.documentElement.addEventListener(
    "touchstart",
    setTouchTrigger(true),
    { passive: false }
  );
  document.documentElement.addEventListener(
    "touchend",
    setTouchTrigger(false),
    { passive: false }
  );
}

function hookMouse({ engine, render }) {
  const mouse = M.Mouse.create(render.canvas);
  const mouseConstraint = M.MouseConstraint.create(engine, {
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
  const engine = M.Engine.create();

  const render = M.Render.create({
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
    beforeUpdateCbs.forEach(cb => cb());

    anyTriggerIsDown = false;
    const triggers = Object.keys(triggerIsDown);
    for (let k in triggers) {
      anyTriggerIsDown |= triggerIsDown[k];
    }

    triggerJustChanged = {};
  });

  let levelConfig;

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

    beforeUpdateCbs.push(() => {
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
          for (let i = 0; i < extraBalls; ++i) {
            addBall();
          }
        } else if (ballsOnScreen.length === 0) {
          // game over
          setMusic(false);
          soundEnabled && sfx.gameover_voice.play();
          soundEnabled &&
            setTimeout(function() {
              soundEnabled && sfx.gameover.play();
            }, 1000);
          if (score > highScore) {
            highScore = score;
            saveLS("score", highScore);
          }
        }
      }
    });

    // SAFER WAY TO RESTART... OR DO SOMETHING ELSE?
    if (currentLevel >= levelBuilders.length) {
      displaySpecialMessage("OO !!!!!CONTRATULATIONS!!!!!! OO");
      currentLevel = 0;
    }

    levelConfig = levelBuilders[currentLevel](engine, W, H);
    spawnPos = levelConfig.spawnPos;

    addBall();

    loadMusic(levelConfig.musicIndex, function() {
      //console.log('called my get part, spare balls - ' + spareBalls + ' number of balls on screen ' + ballsOnScreen.length + 'xxxx' + ballsOnScreen[0].position.x + 'yyyyyyy' + ballsOnScreen[0].position.y  );
      if (spareBalls <= 0 && ballsOnScreen.length > 2) {
        //console.log('music in panic mode');
        return 2;
      }

      if (ballsOnScreen.length) {
        if (ballsOnScreen[0].position.y <= levelConfig.higher_h) {
          //console.log('music in higher mode');
          return 2;
        }
        if (ballsOnScreen[0].position.y <= levelConfig.middle_h) {
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
    soundEnabled &&
      setTimeout(function() {
        // avoid double play if player activated the sound in this time
        !isMusicPlaying() && setMusic(soundEnabled);
      }, 1500);

    ++currentLevel;
  }
  window.startNextLevel = startNextLevel;

  startNextLevel();

  // hookMouse({ engine, render });
  hookKeys();

  let buffer = [];
  M.Events.on(engine, "beforeTick", () => {
    if (ballsOnScreen.length === 0) {
      return;
    }

    /* process tilt key */
    let tilt_offset_x = 0;
    let tilt_offset_y = 0;
    let apply_tilt = false;

    if (triggerIsDown[TR_TILT]) {
      const cdate = new Date().valueOf();
      if (currentTilt === 0) {
        ///console.log('Set new tilt');
        currentTilt = cdate;
        nextTilt = cdate + 10000; //10 seconds cool down
        stopTilt = cdate + 1000; //1 second duration
        apply_tilt = true;
        const new_offset_x = getRandomInt(-10, 10) * 0.004;
        const new_offset_y = getRandomInt(-10, 10) * 0.004;
        ballsOnScreen.forEach(b => {
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
    }

    /* reset tilt state */
    if (currentTilt !== 0 && new Date().valueOf() > nextTilt) {
      //console.log('RESETING TILT');
      currentTilt = 0;
      nextTilt = 0;
      stopTilt = 0;
    }

    const s = clamp(40 * ballsOnScreen[0].speed, 200, 100000);
    const cam_offset_x = s + tilt_offset_x;
    const cam_offset_y = s + tilt_offset_y;
    // const cam_offset_x = s + tilt_offset_x + 500;
    // const cam_offset_y = s + tilt_offset_y + 500;
    const v = accum({ x: cam_offset_x, y: cam_offset_y }, buffer, 180);
    M.Render.lookAt(render, ballsOnScreen, v, false);
  });

  function addBall() {
    const sphere = createSphere({ engine, pos: spawnPos, r: 20 });
    ballsOnScreen.push(sphere);
  }

  function removeBall(ball) {
    removeFromArr(ball, ballsOnScreen);
    M.World.remove(engine.world, ball);
  }

  function win() {
    won = true;
    soundEnabled && sfx.dingding.play();
    displaySpecialMessage("           LEVEL UP!", () => {
      soundEnabled && sfx.dingding.play();
      displaySpecialMessage("          +1000 POINTS");
      score += 1000;
    });
    ballsOnScreen.forEach(b => ballsToRemove.push(b));

    setMusic(false);
    soundEnabled && sfx.levelup_good_job.play();
    soundEnabled && sfx.win.play();
  }
  window.win = win;

  function onCustom(_custom, body, otherBody) {
    //console.log("custom: %s", _custom);

    _custom.split(" ").forEach(custom => {
      if (custom === "goal") {
        win();
      } else if (custom === "boundary") {
        ballsToRemove.push(otherBody);
        needsNewBall = true;
      } else if (custom.indexOf("sfx|") === 0) {
        const sample = custom.split("|")[1];
        soundEnabled && sfx[sample].play();
      } else if (custom === "brick") {
        // to make it without multiple colors
        const nextColor =
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

  M.Events.on(engine, "collisionEnd", ev => {
    ev.pairs.forEach(({ bodyA, bodyB }) => {
      //soundEnabled && sfx.collision_1.play();

      // all the bodies who have sound will restore to their original colors on collision end
      if (
        bodyA.custom &&
        bodyA.custom.indexOf("sfx|") !== -1 &&
        bodyA.render &&
        bodyA.render.oldFillStyle
      ) {
        ++score;
        bodyA.render.fillStyle = bodyA.render.oldFillStyle;
        bodyA.render.oldFillStyle = undefined;
      }
      if (
        bodyB.custom &&
        bodyB.custom.indexOf("sfx|") !== -1 &&
        bodyB.render &&
        bodyB.render.oldFillStyle
      ) {
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

  M.Events.on(engine, "collisionStart", ev => {
    ev.pairs.forEach(({ bodyA, bodyB }) => {
      // all the bodies who have sound will have increased brightness during the collision
      if (
        bodyA.custom &&
        bodyA.custom.indexOf("sfx|") !== -1 &&
        bodyA.render &&
        bodyA.render.fillStyle &&
        bodyA.render.oldFillStyle === undefined
      ) {
        bodyA.render.oldFillStyle = bodyA.render.fillStyle;
        bodyA.render.fillStyle = increase_brightness(
          bodyA.render.fillStyle,
          25
        );
      }
      if (
        bodyB.custom &&
        bodyB.custom.indexOf("sfx|") !== -1 &&
        bodyB.render &&
        bodyB.render.fillStyle &&
        bodyB.render.oldFillStyle === undefined
      ) {
        bodyB.render.oldFillStyle = bodyB.render.fillStyle;
        bodyB.render.fillStyle = increase_brightness(
          bodyB.render.fillStyle,
          25
        );
      }
    });
  });

  const bgImg = new Image();
  bgImg.src = "assets/title.png";
  let bgPattern,
    bgReady = false;
  bgImg.onload = function() {
    bgReady = true;
  };

  M.Events.on(render, "afterRender", function(ev) {
    const t = ev.timestamp;
    //M.Render.startViewTransform(render);

    const ctx = render.context;

    if (bgReady && t < 4000) {
      if (!bgPattern) {
        bgPattern = ctx.createPattern(bgImg, "repeat");
      }

      ctx.fillStyle = bgPattern;
      ctx.globalAlpha =
        t < 1000 ? t / 1000 : t > 3000 ? 1 - (t - 3000) / 1000 : 1;
      ctx.fillRect(0, 0, 800, 600);
      ctx.globalAlpha = 1;
    }

    ctx.font = "40px DotMatrixBold";

    ctx.fillStyle = isBlinking ? YELLOW : DARK_GRAY;
    ctx.fillText("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", 20 + 4.5, 50);
    ctx.fillText("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", 20, 50);

    ctx.fillStyle = isBlinking ? DARK_GRAY : YELLOW;
    let msg;
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
      msg = won ? "    PRESS TO CONTINUE" : "           GAME OVER";
    }
    ctx.fillText(msg, 20, 50);

    if (DEBUG_TRIGGERS) {
      const triggers = [
        "L",
        triggerIsDown[TR_LEFT_FLIPPER] ? "O" : "_",
        " R",
        triggerIsDown[TR_RIGHT_FLIPPER] ? "O" : "_",
        " T",
        triggerIsDown[TR_TILT] ? "O" : "_",
        " L",
        triggerIsDown[TR_LAUNCH] ? "O" : "_",
        " A",
        anyTriggerIsDown ? "O" : "_"
      ].join("");
      ctx.fillText(triggers, 0, (H - 20) / 2);
    }

    //M.Render.endViewTransform(render);
  });

  M.Engine.run(engine);
  M.Render.run(render);
}

prepare();

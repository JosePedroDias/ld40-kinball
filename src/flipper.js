const M = Matter;

const W = 800;
const H = 600;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

let sound_enabled = loadLS("sound", true);
let spawnPos = [W * 0.88, H * 0.5];

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

const KC_Z = 90;
const KC_M = 77;
const KC_R = 82;
const KC_S = 83;
const KC_SPACE = 32;
const KC_LEFT = 37;
const KC_RIGHT = 39;
const KC_UP = 38;
const KC_DOWN = 40;
const KCS = [KC_Z, KC_M, KC_R, KC_S, KC_DOWN];

const keyIsDown = {};
const keyIsUp = {};

const ballsOnScreen = [];
let ballsToRemove = [];
let score = 0;

function hookKeys() {
  document.addEventListener("keydown", ev => {
    const kc = ev.keyCode;
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
      sound_enabled && sfx.flipper.play();
    } else if (kc === KC_S) {
      sound_enabled = !sound_enabled;
      saveLS("sound", sound_enabled);
      setSfx(sound_enabled);
      setMusic(sound_enabled);
    }

    keyIsDown[kc] = true;
  });

  document.addEventListener("keyup", ev => {
    const kc = ev.keyCode;
    if (ev.ctrlKey || ev.altKey || ev.shiftKey || !inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (!keyIsDown[kc]) {
      return;
    }

    if (kc === KC_DOWN) {
      sound_enabled && sfx.ball_out.play();
    }

    keyIsDown[kc] = false;
    keyIsUp[kc] = true;
  });
}

const beforeUpdateCbs = [];

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
      angle: a * DEG2RAD
    });
    parts.push(rect);

    a += da;
  }

  return M.Body.create({ parts, ...options });
}

function createFlipperShape({ pos, ra, rb, length, options }) {
  const pa = [pos[0] - length / 2, pos[1]];
  const pb = [pos[0] + length / 2, pos[1]];

  const circleA = M.Bodies.circle(pa[0], pa[1], ra);
  const circleB = M.Bodies.circle(pb[0], pb[1], rb);
  const poly = M.Bodies.fromVertices(pos[0], pos[1], [
    { x: pa[0], y: pa[1] - ra },
    { x: pa[0], y: pa[1] + ra },
    { x: pb[0], y: pb[1] + rb },
    { x: pb[0], y: pb[1] - rb }
  ]);

  return M.Body.create({ parts: [circleA, circleB, poly] }, options);
}

function createFlipper({
  engine,
  pos,
  dims,
  nailRelPos,
  minAngle,
  key,
  angVel
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
    options: {
      density: 1,
      friction: 0,
      restitution: 2,
      mass: 100
    }
  });

  const limitR = 5;

  const ballMaxPos = polarMove({
    pos: [nailPos.x, nailPos.y],
    r: 32,
    angle: invertAngles ? 180 - minAngle : minAngle
  });
  const ballMax = M.Bodies.circle(ballMaxPos[0], ballMaxPos[1], limitR, {
    isStatic: true
  });

  var constraint = M.Constraint.create({
    pointA: nailPos,
    bodyB: rect,
    pointB: { x: nailRelPos[0], y: nailRelPos[1] },
    length: 0
  });

  let wentDownF = 0;

  beforeUpdateCbs.push(() => {
    const rotateFlipper = keyIsDown[key];

    const placeBackFlipper = keyIsUp[key];
    if (placeBackFlipper) {
      wentDownF = new Date().valueOf() + 100;
      keyIsUp[key] = false;
    }

    if (rotateFlipper) {
      //console.log((rect.angle * RAD2DEG).toFixed(1));
      const i = invertAngles ? 1 : -1;
      const n = linearize(rect.angle * RAD2DEG, 30 * i, -7 * i);
      //console.log((n * 100).toFixed(1));
      M.Body.setAngularVelocity(rect, angVel * n);
    } else {
      if (wentDownF > 0){
        var ctime = new Date().valueOf();
        if (ctime < wentDownF){
          M.Body.setAngularVelocity(rect, -angVel * 0.3 );
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

function createPlunger({ engine, pos, dims, angle }) {
  const rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], {
    angle: angle * DEG2RAD,
    density: 0.3
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

  beforeUpdateCbs.push(() => {
    if (keyIsDown[KC_DOWN]) {
      M.Body.applyForce(rectangle, rectangle.position, {
        x: 0,
        y: 10
      });
    }
  });
}

function createSphere({ engine, pos, r }) {
  const sphere = M.Bodies.circle(pos[0], pos[1], r, {
    density: 1, // 0.001
    friction: 0,
    restitution: 0.5,
    mass:0.3
  });

  M.World.add(engine.world, [sphere]);

  return sphere;
}

function createBumper({ engine, pos, r }) {
  const sphere = M.Bodies.circle(pos[0], pos[1], r, {
    //density: 0.0001, // 0.001
    friction: 1,
    restitution: 2
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

function createTriangleBumper({ engine, pos, v0, v1, v2, r }) {
  const originalVerts = [v0, v1, v2].map(p);
  const verts = M.Vertices.chamfer(originalVerts, r);
  const ctr = p(pos) || M.Vertices.centre(originalVerts);
  const tri = M.Bodies.fromVertices(ctr.x, ctr.y, verts, {
    isStatic: true,
    friction: 1,
    restitution: 2
  });
  M.World.add(engine.world, [tri]);
  return tri;
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
      wireframes: false,
      //showAngleIndicator: true
    }
  });

  engine.world.gravity.y = 0.4;

  M.Events.on(engine, "beforeUpdate", function() {
    beforeUpdateCbs.forEach(cb => cb());
  });

  addBall();

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

  createBumper({ engine, pos: [W * 0.7, H * 0.4], r: 48 });
  createBumper({ engine, pos: [W * 0.6, H * 0.55], r: 32 });
  createBumper({ engine, pos: [W * 0.25, H * 0.2], r: 48 });

  createBumper({ engine, pos: [W * 0.5, H * 1.1], r: 12 });

  const arc = createArc({
    pos: [W * 0.805, H * 0.252],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [12, 24],
    steps: 12,
    options: { isStatic: true }
  });
  M.World.add(engine.world, [arc]);

  const lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W, 64],
    angle: 0,
    options: {
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
    v0: [-50, -50],
    v1: [50, -50],
    v2: [0, 50],
    r: 20
  });

  hookMouse({ engine, render });
  hookKeys();

  const buffer = [];
  M.Events.on(engine, "beforeTick", () => {
    const s = clamp(40 * ballsOnScreen[0].speed, 200, 100000);
    const v = accum({ x: s, y: s }, buffer, 180);
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

  let needsNewBall = false;
  beforeUpdateCbs.push(() => {
    ballsToRemove.forEach(removeBall);
    ballsToRemove = [];
    if (needsNewBall) {
      needsNewBall = false;
      addBall();
    }
  });

  M.Events.on(engine, "collisionEnd", ev => {
    ev.pairs.forEach(({ bodyA, bodyB }) => {
      ++score;
      //sound_enabled && sfx.collision_1.play();
      if (inArr(lowerBound, [bodyA, bodyB])) {
        const ball = bodyA === lowerBound ? bodyB : bodyA;
        ballsToRemove.push(ball);
        needsNewBall = true;
      }
    });
  });

  M.Events.on(render, "afterRender", function() {
    //M.Render.startViewTransform(render);

    const ctx = render.context;
    ctx.font = "45px DotMatrixBold";

    ctx.fillStyle = "#444";
    ctx.fillText("HHHHHHHHHH", 20 + 4.5, 50);
    ctx.fillText("HHHHHHHHHH", 20, 50);

    ctx.fillStyle = "#DD2";
    ctx.fillText("SCORE " + score, 20, 50);

    //M.Render.endViewTransform(render);
  });

  M.Engine.run(engine);
  M.Render.run(render);

  loadMusic(0);
  setMusic(sound_enabled);
}

prepare();

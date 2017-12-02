const M = Matter;

const W = 800;
const H = 600;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function inArr(item, arr) {
  return arr.indexOf(item) !== -1;
}

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
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

const KC_Z = 90;
const KC_M = 77;
const KC_SPACE = 32;
const KCS = [KC_Z, KC_M, KC_SPACE];

const keyIsDown = {};

function hookKeys() {
  document.addEventListener("keydown", ev => {
    const kc = ev.keyCode;
    if (!inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (keyIsDown[kc]) {
      return;
    }
    keyIsDown[kc] = true;
  });

  document.addEventListener("keyup", ev => {
    const kc = ev.keyCode;
    if (!inArr(kc, KCS)) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if (KCS.indexOf())
      if (!keyIsDown[kc]) {
        return;
      }
    keyIsDown[kc] = false;
  });
}

const beforeUpdateCbs = [];

function polarMove({ pos, r, angle }) {
  const a = DEG2RAD * angle;
  return [pos[0] + Math.cos(a) * r, pos[1] + Math.sin(a) * r];
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

  const compound = M.Body.create({ parts: [circleA, circleB, poly] }, options);

  return compound;
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
    options: { density: 0.0015 }
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

  beforeUpdateCbs.push(() => {
    const rotateFlipper = keyIsDown[key];

    if (rotateFlipper) {
      //console.log((rect.angle * RAD2DEG).toFixed(1));
      const i = invertAngles ? 1 : -1;
      const n = linearize(rect.angle * RAD2DEG, 30 * i, -7 * i);
      //console.log((n * 100).toFixed(1));
      M.Body.setAngularVelocity(rect, angVel * n);
    }
  });

  M.World.add(engine.world, [rect, ballMax, constraint]);
}

function createRect({ engine, pos, dims, angle }) {
  const rectangle = M.Bodies.rectangle(pos[0], pos[1], dims[0], dims[1], {
    isStatic: true,
    angle: angle * DEG2RAD
  });

  M.World.add(engine.world, [rectangle]);
}

function createSphere({ engine, pos, r }) {
  const sphere = M.Bodies.circle(pos[0], pos[1], r, {
    density: 0.002, // 0.001
    friction: 0,
    restitution: 0.5
  });

  M.World.add(engine.world, [sphere]);
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
      wireframes: true,
      showAngleIndicator: true
    }
  });

  M.Events.on(engine, "beforeUpdate", function() {
    beforeUpdateCbs.forEach(cb => cb());
  });

  createSphere({ engine, pos: [W / 2 - 60, H / 2], r: 20 });

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
    pos: [W / 2, H * 0.092],
    dims: [700, 24],
    angle: 0
  });

  hookMouse({ engine, render });
  hookKeys();

  M.Engine.run(engine);
  M.Render.run(render);
}

prepare();

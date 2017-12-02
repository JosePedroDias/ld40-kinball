// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Constraint = Matter.Constraint;

const W = 800;
const H = 600;

const DEG2RAD = 3.1415927 / 180;

// create an engine
var engine = Engine.create();
/*engine.positionIterations *= 2;
engine.velocityIterations *= 2;
engine.constraintIterations *= 2;*/

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true
  }
});

const group = Body.nextGroup(true);

var sphere = Bodies.circle(W / 2 + 50, 200, 20, {
  density: 0.002, // 0.001
  friction: 0,
  restitution: 0.5
});

var limitL = Bodies.rectangle(W / 2 - 265, 380, 300, 25, {
  isStatic: true,
  angle: 30 * DEG2RAD
});
var limitR = Bodies.rectangle(W / 2 + 265, 380, 300, 25, {
  isStatic: true,
  angle: -30 * DEG2RAD
});
World.add(engine.world, [sphere, limitL, limitR]);

function posify(arr) {
  return arr.map(p => {
    return { x: p[0], y: p[1] };
  });
}

const verts = posify([
  [-10, 0],
  [0, 15],
  [100, 8],
  [105, 0],
  [100, -8],
  [0, -15]
]);
const verts2 = posify([
  [10, 0],
  [0, 15],
  [-100, 8],
  [-105, 0],
  [-100, -8],
  [0, -15]
]);

const nails = [];
const nailsKeys = { 90: 0, 77: 1 }; // 90=z, 77=m

function genFlipper(x, y, dx, dy, dx2, dy2, verts) {
  // x 400 y 400 dx 30 dy 0 dx2 20 dy2 5
  var flipper = Bodies.fromVertices(x, y, verts, {
    collisionFilter: {
      group: group
    },
    render: {
      strokeStyle: "#ffffff",
      sprite: {
        texture: "cenas.png"
      }
    }
  });

  const nail = Bodies.circle(x - dx, y - dy, 3, {
    isStatic: true,
    collisionFilter: {
      group: group
    }
  });

  const nail2 = Bodies.circle(x - dx - dx2, y - dy - dy2, 3, {
    isStatic: true,
    collisionFilter: {
      group: group
    }
  });

  const flipperHinge = Constraint.create({
    bodyA: nail,
    pointB: { x: -dx * 0.75, y: 0 },
    bodyB: flipper,
    stiffness: 1,
    length: 0
  });

  const flipperHinge2 = Constraint.create({
    bodyA: nail2,
    pointB: { x: -dx2 * 2, y: 0 },
    bodyB: flipper,
    stiffness: 0.4,
    length: 0
  });

  nails.push([nail, nail2]);

  // add all of the bodies to the world
  World.add(engine.world, [flipper, nail, nail2, flipperHinge, flipperHinge2]);
}

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

genFlipper(W / 2 - 70, H * 0.7 + 60, 30, 0, 20, 12, verts);
genFlipper(W / 2 + 70, H * 0.7 + 60, -30, 0, -20, 12, verts2);

const keyIsDown = {};

function moveNail(dy) {
  return function(ev) {
    const kc = ev.keyCode;
    const nailIndex = nailsKeys[kc];
    if (!isFinite(nailIndex)) {
      return;
    }

    if (ev.type === "keydown") {
      if (keyIsDown[kc]) {
        return;
      }
      keyIsDown[kc] = true;
    } else {
      keyIsDown[kc] = false;
    }

    const [nail, nail2] = nails[nailIndex];
    Body.setPosition(nail, { x: nail.position.x, y: nail.position.y - dy });
    Body.setPosition(nail2, { x: nail2.position.x, y: nail2.position.y + dy });
    //nail.position.y -= dy;
    //nail2.position.y += dy;
  };
}

document.addEventListener("keydown", moveNail(11));
document.addEventListener("keyup", moveNail(-11));

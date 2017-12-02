// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create();
/*engine.positionIterations *= 4;
engine.velocityIterations *= 4;
engine.constraintIterations *= 4;*/

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false
  }
});

const group = Body.nextGroup(true);

// create two boxes and a ground
//var box = Bodies.rectangle(400, 200, 80, 80);
var box = Bodies.circle(400, 200, 20, { xdensity: 0.001 / 4 });

/*

M -10 0 L 0 10 100 0 0 -10 Z

*/

const verts = [
  [-10, 0],
  [0, 10],
  [100, 0],
  [0, -10]
  /*[105.42, -30.36],
[116.01, -23.75],
[123.49, -15.64],
[126.34, -3.66],
[124.83, 9.76],
[120.21, 19.66],
[111.2, 28],
[101.62, 31.43],
[88.91, 32.01],
[-115.05, 14.23],
[-120.96, 11.85],
[-124.41, 7.35],
[-126.33, 0.75],
[-125.23, -6.26],
[-121.72, -11.78]*/
].map(p => {
  return { x: p[0], y: p[1] };
});
var flipper = Bodies.fromVertices(400, 400, verts, {
  //isStatic: true,
  //density: 1,
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

const nail = Bodies.circle(370, 400, 3, {
  isStatic: true,
  collisionFilter: {
    group: group
  }
});

const nail2 = Bodies.circle(370 - 20, 400, 3, {
  isStatic: true,
  collisionFilter: {
    group: group
  }
});

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

const flipperHinge = Constraint.create({
  bodyA: nail,
  pointB: { x: -20, y: 0 },
  bodyB: flipper,
  stiffness: 1,
  length: 0
});

const flipperHinge2 = Constraint.create({
  bodyA: nail2,
  pointB: { x: -40, y: 0 },
  bodyB: flipper,
  stiffness: 0.4,
  length: 0
});

// add all of the bodies to the world
World.add(engine.world, [
  box,
  flipper,
  nail,
  nail2,
  ground,
  flipperHinge,
  flipperHinge2
]);

/*
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
        visible: false
      }
    }
  });
World.add(engine.world, mouseConstraint);
*/

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

document.addEventListener("keydown", ev => {
  if (ev.keyCode === 32) {
    nail2.position.y += 10;
    setTimeout(() => {
      nail2.position.y -= 10;
    }, 100);
  }
});

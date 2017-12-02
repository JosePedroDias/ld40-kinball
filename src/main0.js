const W = 800;
const H = 600;
const AR = W / H;

let t = 0;

// PIXI (render)
PIXI.utils.skipHello();

const app = new PIXI.Application(W, H, {
  backgroundColor: 0x1099bb,
  antialias: false,
  transparent: false,
  resolution: 1
});
document.body.appendChild(app.view);

const vBall = PIXI.Sprite.fromImage("assets/gfx/ball.svg");
vBall.anchor.set(0.5);
app.stage.addChild(vBall);

const vGround = PIXI.Sprite.fromImage("assets/gfx/flipper.svg");
vGround.anchor.set(0.5);
vGround.x = W / 2;
vGround.y = H;
app.stage.addChild(vGround);

// MATTER (physics)

const points = [
  [105.42, -30.36],
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
  [-121.72, -11.78],
  [105.42, -30.36]
];

const engine = Matter.Engine.create();
const world = engine.world;

/*const verts = Matter.Svg.fromVertices(
  "M 12.773125,113.36602 221.3132,95.992053 l 12.11088,1.651482 10.58724,6.605925 7.48176,8.10713 2.84979,11.98594 -1.51508,13.41407 -4.62098,9.90131 -9.00254,8.33802 -9.58241,3.43426 -12.70975,0.58031 -203.961053,-17.77707 -5.9080342,-2.37991 -3.4503706,-4.50127 -1.9267305,-6.60592 1.1009889,-7.00904 3.5114276,-5.52164 z",
  30
);*/
const verts = points.map(p => {
  return { x: p[0], y: p[1] };
});
//console.log(verts);

//const g = Matter.Bodies.rectangle(W / 2, H, W, 16, { isStatic: true });
//const g = Matter.Bodies.fromVertices(W / 2, H / 2, points);
const g = Matter.Bodies.fromVertices(W / 2, H / 2, verts);
const f = Matter.Bodies.circle(W / 2, H / 2, 32);

Matter.World.add(world, g);
Matter.World.add(world, f);

Matter.Engine.run(engine);

function onFrame(dt, t) {
  //console.log("t:%s dt:%s", t.toFixed(2), dt.toFixed(2));
  //world.step(dt * 4);
  Matter.Engine.update(engine, dt / 10);

  world.bodies.forEach((b, i) => {
    if (i === 1) {
      const a = b.angle;
      const { x, y } = b.position;
      console.log("a:%s x:%s y:%s", a.toFixed(2), x.toFixed(2), y.toFixed(2));
      vBall.x = x;
      vBall.y = y;
    }
  });
}

app.ticker.add(function(dt) {
  dt /= 60;
  t += dt;
  onFrame(dt, t);
});

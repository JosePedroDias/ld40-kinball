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

const engine = Matter.Engine.create();
const world = engine.world;

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
const g = Matter.Bodies.fromVertices(W / 2, H, verts, { isStatic: true });
const f = Matter.Bodies.circle(W / 2 + 100, H / 2, 32);

Matter.World.add(world, [g, f]);
Matter.Engine.run(engine);

function onFrame(dt, t) {
  //console.log("t:%s dt:%s", t.toFixed(2), dt.toFixed(2));
  //world.step(dt * 4);
  Matter.Engine.update(engine);

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

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

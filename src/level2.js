levelBuilders.push(function buildLevel(engine, W, H) {
  createFlipper({
    engine,
    pos: [W * 0.5, H * 0.7],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: "blue"
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.9],
    dims: [600, 12],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        fillStyle: "red"
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.1, H * 0.5],
    dims: [600, 12],
    angle: 90,
    options: {
      custom: "boundary",
      render: {
        fillStyle: "red"
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.9, H * 0.5],
    dims: [600, 12],
    angle: 90,
    options: {
      custom: "boundary",
      render: {
        fillStyle: "red"
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.3],
    dims: [120, 30],
    angle: 0,
    options: {
      custom: "brick sfx|collision_1",
      remainingBrickColors: ["yellow", "green"],
      render: {
        fillStyle: "red"
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.9],
    dims: [600, 12],
    angle: 0,
    options: {
      render: {
        fillStyle: "red"
      }
    }
  });

  return {
    spawnPos: [W * 0.5, H * 0.5],
    musicIndex: 0
  };
});

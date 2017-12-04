levelBuilders.push(function buildLevel(engine, W, H) {

  const flipperColor = '#b71c1c';//red
  const plungerColor = '#fdd835';//yellow

  const wallCollorDark = '#808e95';//gray light

  const boundsAreVisible = true;

// bottom to top

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper lower
  createFlipper({
    engine,
    pos: [W / 2 + 100, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // right pillar ball tunel - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 + 340, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // ball tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 270, -200],
    dims: [1350, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  //first arc - start - right
  const arc1 = createArc({
    pos: [650, -870],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: { isStatic: true, render: {
      fillStyle: wallCollorDark
    }
    }
  });
  M.World.add(engine.world, [arc1]);

  //second arc - start - left
  const arc2 = createArc({
    pos: [150, -870],
    r: 90,
    a0: -90,
    a1: -180,
    dims: [24, 24],
    steps: 12,
    options: { isStatic: true, render: {
      fillStyle: wallCollorDark
    }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [W / 2, -960],
    dims: [500, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // left rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 - 250, -400],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  // right rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 + 220, -380],
    dims: [130, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallCollorDark
      }
    }
  });

  //left flipper upper
  createFlipper({
    engine,
    pos: [W / 2 - 100, -340],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  //right flipper upper
  createFlipper({
    engine,
    pos: [W / 2 + 100, -340],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });

  // createBumper({
  //   engine,
  //   pos: [W * 0.7, H * 0.4],
  //   r: 48,
  //   options: { custom: "sfx|collision_3" }
  // });
  // createBumper({
  //   engine,
  //   pos: [W * 0.6, H * 0.55],
  //   r: 32,
  //   options: { custom: "sfx|collision_1" }
  // });
  // createBumper({
  //   engine,
  //   pos: [W * 0.25, H * 0.2],
  //   r: 48,
  //   options: { custom: "sfx|collision_3" }
  // });

  // createBumper({
  //   engine,
  //   pos: [W * 0.5, H * 1.1],
  //   r: 12,
  //   options: { custom: "sfx|collision_1" }
  // });

  const lowerBound = createRect({
    engine,
    pos: [W * 0.7, H * 1.6],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  const upperBound = createRect({
    engine,
    pos: [W * 0.7, -1500],
    dims: [W * 4, 64],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  const leftBound = createRect({
    engine,
    pos: [-1010, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  const rightBound = createRect({
    engine,
    pos: [2130, -273],
    dims: [64, H * 4],
    angle: 0,
    options: {
      custom: "boundary",
      render: {
        visible: boundsAreVisible
      }
    }
  });

  createPlunger({
    engine,
    pos: [W * 0.877, H * 0.5],
    dims: [46, 32],
    angle: 0,
    options: {
      render: {
        fillStyle: plungerColor
      }
    }
  });

  // createTriangleBumper({
  //   engine,
  //   pos: [300, 250],
  //   v0: [-40, 30],
  //   v1: [40, 30],
  //   v2: [0, -30],
  //   options: {
  //     custom: "goalxxxxx"
  //   }
  // });

  return {
    spawnPos: [W * 0.88, H * 0.2],
    musicIndex: 1
  };
});

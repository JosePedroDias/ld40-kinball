levelBuilders.push(function buildLevel(engine, W, H) {
  const flipperColor = "#b71c1c"; //red
  const plungerColor = "#fdd835"; //yellow
  const goalColor = "#76ff03"; //green
  const triangleBumperColor = "#673ab7";//purple

  const wallColorDark = "#808e95"; //gray light

  const orangeDestructible_1 = "#ff6f00";//orange dark
  const orangeDestructible_2 = "#ffa000";//orange
  const orangeDestructible_3 = "#ffca28";//orange light
  const tealishDestructible_1 = "#004c40";//teal dark
  const tealishDestructible_2 = "#00796b";//teal
  const tealishDestructible_3 = "#48a999";//teal light
  const pinkish = "#ec407a";//pink

  const gatewayColor = "#b2ebf2";//teal

  const boundsAreVisible = false;

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
        fillStyle: wallColorDark
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
        fillStyle: wallColorDark
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
        fillStyle: wallColorDark
      }
    }
  });

  // createRotatingPolygon({
  //   engine,
  //   pos: [200, -600],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [goalColor, tealishDestructible],
  //     custom: "brick",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible
  //     }
  //   }
  // });


  createRotatingPolygon({
    engine,
    pos: [690, -300],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });


  createRotatingPolygon({
    engine,
    pos: [100, -750],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [400, -400],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [704, -600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
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
        fillStyle: wallColorDark
      }
    }
  });

  // rightmost pillar tunnel - start
  createRect({
    engine,
    pos: [W / 2 + 420, -210],
    dims: [1300, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //first arc - start - right
  const arc1 = createArc({
    pos: [730, -870],
    r: 90,
    a0: -90,
    a1: 0,
    dims: [24, 24],
    steps: 12,
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
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
    options: {
      isStatic: true,
      render: {
        fillStyle: wallColorDark
      }
    }
  });
  M.World.add(engine.world, [arc2]);

  // top limit
  createRect({
    engine,
    pos: [440, -961],
    dims: [580, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // right plunger protector
  createRect({
    engine,
    pos: [780, 440],
    dims: [104, 24],
    angle: 0,
    options: {
      render: {
        fillStyle: wallColorDark
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
        fillStyle: wallColorDark
      }
    }
  });

  // right rectangle - flipper to corner - upper
  createRect({
    engine,
    pos: [W / 2 + 210, -375],
    dims: [100, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
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


  //bottom bumpers
  //top bumpers
  createBumper({
    engine,
    pos: [200, 300],
    r: 32,
    options: { custom: "sfx|collision_3" }
  });

  createBumper({
    engine,
    pos: [600, 300],
    r: 32,
    options: { custom: "sfx|collision_3" }
  });


  //top bumpers
  createBumper({
    engine,
    pos: [400, -650],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });

  createBumper({
    engine,
    pos: [400, -850],
    r: 48,
    options: { custom: "sfx|collision_3" }
  });


  //triangle left top
  createTriangleBumper({
    engine,
    pos: [150, -750],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left middle
  createTriangleBumper({
    engine,
    pos: [150, -600],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [650, -750],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });


  //triangle right middle
  createTriangleBumper({
    engine,
    pos: [650, -600],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right, below
  createTriangleBumper({
    engine,
    pos: [650, -460],
    v0: [50, 0],
    v1: [0, 50],
    v2: [30, 100],
    options: {
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  // left gateway
  createRect({
    engine,
    pos: [150, -50],
    dims: [400, 12],
    angle: 70,
    options: {
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [230, -50],
    dims: [400, 12],
    angle: 70,
    options: {
      render: {
        fillStyle: gatewayColor
      }
    }
  });


  // right gateway
  createRect({
    engine,
    pos: [568, -50],
    dims: [400, 12],
    angle: -70,
    options: {
      render: {
        fillStyle: gatewayColor
      }
    }
  });

  createRect({
    engine,
    pos: [648, -50],
    dims: [400, 12],
    angle: -70,
    options: {
      render: {
        fillStyle: gatewayColor
      }
    }
  });

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

  // bottom left
  createBumper({
    engine,
    pos: [250, -250],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

  // bottom right
  createBumper({
    engine,
    pos: [550, -250],
    r: 24,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }
    }
  });

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



  createRect({
    engine,
    pos: [W * 0.5, H * 0.3],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|collision_1",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|collision_1",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|collision_1",
      render: {
        fillStyle: tealishDestructible_3
      }
    }
  });


  createBumper({
    engine,
    pos: [308, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createBumper({
    engine,
    pos: [490, 150],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });





  createPlunger({
    engine,
    pos: [780, H * 0.5],
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
  //   pos: [150, -300],
  //   v0: [-40, 30],
  //   v1: [40, 30],
  //   v2: [0, -30],
  //   options: {
  //     custom: "goal",
  //     render: {
  //       fillStyle: goalColor
  //     }
  //   }
  // });

  // lower safety net attempt
  createBumper({
    engine,
    pos: [W * 0.5, H * 1.1],
    r: 12,
    options: {
      custom: "sfx|collision_1",
      render: {
        fillStyle: pinkish
      }

    }
  });

  createRotatingPolygon({
    engine,
    pos: [110, -300],
    r: 25,
    spinsPerSecond: 1,
    sides: 3,
    options: {
      isStatic: true,
      custom: "goal brick",
      render: {
        fillStyle: goalColor
      }
    }
  });

  return {
    spawnPos: [780, H * 0.2],
    musicIndex: 0,
    higher_h: -340000, //never play the highest
    middle_h: -340, 
    lower_h: H * 0.8
  };
});

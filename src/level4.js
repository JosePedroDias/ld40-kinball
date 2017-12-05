levelBuilders.push(function buildLevel(engine, W, H) {
  const flipperColor = "#eceff1"; //white
  const plungerColor = "#fdd835"; //yellow
  const goalColor = "#76ff03"; //green
  const triangleBumperColor = "#673ab7";//purple

  const circularBumperColor = "#ffc046";//yellow

  const wallColorDark = "#808e95"; //gray light

  const orangeDestructible_1 = "#ff6f00";//orange dark
  const orangeDestructible_2 = "#ffa000";//orange
  const orangeDestructible_3 = "#ffca28";//orange light
  const tealishDestructible_1 = "#004c40";//teal dark
  const tealishDestructible_2 = "#00796b";//teal
  const tealishDestructible_3 = "#48a999";//teal light




  const redDestructible_1 = "#a30000";//red dark
  const redDestructible_2 = "#ff6434";//red
  const redDestructible_3 = "#f48fb1";//red light

  const pinkish = "#ec407a";//pink

  const gatewayColor = "#b2ebf2";//teal

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
        fillStyle: wallColorDark
      }
    }
  });

    //right flipper lower - left
  createFlipper({
    engine,
    pos: [W / 2 + 100 - 670, H * 0.9],
    dims: [128, 24],
    nailRelPos: [48, 0],
    minAngle: 60,
    key: KC_M,
    angVel: 0.3,
    renderOptions: {
      fillStyle: flipperColor
    }
  });


  // right rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 + 250 - 670, H * 0.8],
    dims: [200, 24],
    angle: -30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

    // left rectangle - flipper to corner - lower
  createRect({
    engine,
    pos: [W / 2 - 250 - 670, H * 0.8],
    dims: [200, 24],
    angle: 30,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  //left flipper lower
  createFlipper({
    engine,
    pos: [W / 2 - 100 - 670, H * 0.9],
    dims: [128, 24],
    nailRelPos: [-48, 0],
    minAngle: 60,
    key: KC_Z,
    angVel: -0.3,
    renderOptions: {
      fillStyle: flipperColor
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

  // left pillar - 2 from flipper - top - leftmost
  createRect({
    engine,
    pos: [W / 2 - 340 - 670, -12],
    dims: [900, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper - top
  createRect({
    engine,
    pos: [W / 2 - 340, -655],
    dims: [425, 24],
    angle: 90,
    options: {
      render: {
        fillStyle: wallColorDark
      }
    }
  });

  // left pillar - 2 from flipper
  createRect({
    engine,
    pos: [W / 2 - 340, 100],
    dims: [670, 24],
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




createBumper({
    engine,
    pos: [400, -300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  //SQUARE PARTY

  createRotatingPolygon({
    engine,
    pos: [200, -800],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [200, -700],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });
  
  createRotatingPolygon({
    engine,
    pos: [200, -600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

    createRotatingPolygon({
    engine,
    pos: [200, -500],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

    createRotatingPolygon({
    engine,
    pos: [400, -800],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [400, -700],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });
  
  createRotatingPolygon({
    engine,
    pos: [400, -600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

    createRotatingPolygon({
    engine,
    pos: [400, -500],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });


//end of squares

  createRotatingPolygon({
    engine,
    pos: [690, -300],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: orangeDestructible_1
      }
    }
  });


  // createRotatingPolygon({
  //   engine,
  //   pos: [100, -750],
  //   r: 25,
  //   spinsPerSecond: 0.5,
  //   sides: 6,
  //   options: {
  //     remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
  //     custom: "brick sfx|dest1",
  //     isStatic: true,
  //     render: {
  //       fillStyle: orangeDestructible_1
  //     }
  //   }
  // });

  createRotatingPolygon({
    engine,
    pos: [400, -400],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 6,
    options: {
      remainingBrickColors: [orangeDestructible_2, orangeDestructible_3],
      custom: "brick sfx|dest1",
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
      custom: "brick sfx|dest1",
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

  // top limit
  createRect({
    engine,
    pos: [-280, -450],
    dims: [675, 24],
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
    dims: [110, 24],
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
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [600, 300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });


  //top bumpers
  createBumper({
    engine,
    pos: [300, -650],
    r: 48,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [500, -650],
    r: 24,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });


  //triangle left top
  createTriangleBumper({
    engine,
    pos: [100, -750],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle left middle
  createTriangleBumper({
    engine,
    pos: [100, -600],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  ////// UNCOMMENT

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [650, -750],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });


  // //triangle right middle
  createTriangleBumper({
    engine,
    pos: [650, -600],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  // //triangle right, below
  createTriangleBumper({
    engine,
    pos: [650, -460],
    v0: [50, 0],
    v1: [0, 50],
    v2: [30, 100],
    options: {
      custom: "sfx|collision_2",
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
      custom: "sfx|metal",
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
      custom: "sfx|metal",
      render: {
        fillStyle: gatewayColor
      }
    }
  });


  // right gateway
  createRect({
    engine,
    pos: [568 + 80, -50],
    dims: [400, 12],
    angle: -90,
    options: {
      custom: "sfx|metal",
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
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.4],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
      }
    }
  });

  createRect({
    engine,
    pos: [W * 0.5, H * 0.5],
    dims: [80, 30],
    angle: 0,
    options: {
      custom: "brick sfx|dest3",
      render: {
        fillStyle: tealishDestructible_2
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
    pos: [-265, 50],
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

createRotatingPolygon({
    engine,
    pos: [400, -100],
    r: 140,
    spinsPerSecond: 1,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

createRotatingPolygon({
    engine,
    pos: [800 - 200, -800 + 600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [800 - 200, -700 + 600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });
  
  createRotatingPolygon({
    engine,
    pos: [800 - 200, -600 + 600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

    createRotatingPolygon({
    engine,
    pos: [800 - 200, -500 + 600],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });


    //left part of the table

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [20, -100],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [20, 100],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [20, 300],
    v0: [80, 0],
    v1: [0, 80],
    v2: [80, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [-570, -100],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [-570, 100],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  //triangle right top
  createTriangleBumper({
    engine,
    pos: [-570, 300],
    v0: [0, 0],
    v1: [80, 80],
    v2: [0, 160],
    options: {
      custom: "sfx|collision_2",
      render: {
        fillStyle: triangleBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [-400, 350],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [ -120, 350],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [-450, -300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createBumper({
    engine,
    pos: [-100, -300],
    r: 32,
    options: {
      custom: "sfx|collision_3",
      render: {
        fillStyle: circularBumperColor
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-400 - 20, 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-300 - 20, 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-200 - 20, 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-100 - 20, 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-400 - 20, 100],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-300 - 20, 100],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-200 - 20, 100],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-100 - 20, 100],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-400 - 20, 200 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-300 - 20, 200 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-200 - 20, 200 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-100 - 20, 200 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-400 - 20, 100 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-300 - 20, 100 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-200 - 20, 100 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
      }
    }
  });

  createRotatingPolygon({
    engine,
    pos: [-100 - 20, 100 - 200],
    r: 25,
    spinsPerSecond: 0.5,
    sides: 4,
    options: {
      remainingBrickColors: [redDestructible_2, redDestructible_3],
      custom: "brick sfx|dest1",
      isStatic: true,
      render: {
        fillStyle: redDestructible_1
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

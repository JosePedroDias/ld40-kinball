(function(global) {
  const progress = ["start", "middle", "end"];

  const variants = ["normal", "down"];

  const prefix = "assets/bgm/";

  const levelSongs = [{ d: 3626, n: "track1" }, { d: 5274, n: "track2" }];

  const max_plays = 2; //we move forward or backward to avoid repeating the same loop over and over

  let music_parts = undefined;
  let part_fn = undefined;

  let current_loop = "start_normal";
  let last_played = 0;
  let last_played_times = 0;

  function loadMusic(levelNumber, partfn_from_level) {
    if (music_parts !== undefined){
      // we need to unload first;
      music_parts.unload();
    }

    part_fn = partfn_from_level
    music_parts = {};

    last_played = 0;
    last_played_times = 0;

    const song = levelSongs[levelNumber];
    const track_path = prefix + song.n + "/";
    const sample_prefix = song.n + "_all";
    const segment_duration = song.d;

    const max_variants = variants.length;
    const max_progress = progress.length;

    let has_repeated = false;

    var process_queue_sequentially = function() {
      var parts = current_loop.split("_");
      var cp = progress.indexOf(parts[0]);
      var cv = variants.indexOf(parts[1]);

      if (!has_repeated) {
        //console.log('Repeating loop ' + current_loop);
        has_repeated = true;
        music_parts.play(current_loop);
        return;
      }

      has_repeated = false;

      cv++;

      if (cv >= max_variants) {
        cv = 0;

        /*cp++;
      if (cp >= max_progress) {
        cp = 0;
      }*/

        var needs_reset = false;
        cp = getPart();
        if (cp == last_played){
          last_played_times++;
          if (last_played_times === max_plays){
            //console.log("Moving on ...")
            if (cp === 3){
              cp = 2;
            } else {
              cp++;
            }
            needs_reset = true;
          }
        } else {
          needs_reset = true;
        }
      }

      if (needs_reset){
        last_played = cp;
        last_played_times = 0;  
      }

      current_loop = progress[cp] + "_" + variants[cv];

      //console.log('Changing loop to ' + current_loop);

      music_parts.play(current_loop);
    };

    var sprite_offset = 0;
    for (var p = 0; p < progress.length; p++) {
      for (var v = 0; v < variants.length; v++) {
        music_parts[progress[p] + "_" + variants[v]] = [
          sprite_offset,
          segment_duration
        ];
        sprite_offset += segment_duration;
      }
    }

    music_parts = new Howl({
      src: [
        track_path + sample_prefix + ".webm",
        track_path + sample_prefix + ".mp3"
      ], //todo: webm mp3
      onend: process_queue_sequentially,
      sprite: music_parts
    });

    //console.log('Starting ' + current_loop);
    //music_parts.play(current_loop);
  }

  let currentPart = 0;
  function getPart() {
    if (part_fn === undefined){
      currentPart++;
      if (currentPart >= 3){
        currentPart = 0;
      }
    } else {
      currentPart = part_fn();
    }
    return currentPart;
  }

  document.body.addEventListener("keydown", ev => {
    const k = ev.keyCode;
    if (k < 49 || k > 51) {
      return;
    }
    currentPart = k - 49;
    //console.log(currentPart);
  });

  //loadMusic(0);

  function setMusic(state) {
    if (state) {
      music_parts.play(current_loop);
    } else {
      music_parts.stop();
    }
  }

  function isMusicPlaying(){
    return music_parts && music_parts.playing();
  }

  global.loadMusic = loadMusic;
  global.setMusic = setMusic;
  global.isMusicPlaying = isMusicPlaying;
})(this);

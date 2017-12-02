(function(global) {
  const supportedCommands = "MmlLHhVvZz".split("");
  const absoluteCommands = "MLHVZ".split("");
  const singleNumberCommands = "HhVv".split("");

  function contains(arr, el) {
    return arr.indexOf(el) !== -1;
  }

  function startsWithNumber(s) {
    return /^-?\d/.test(s);
  }

  function svgDToPoly(d) {
    const parts = d.split(" ");

    let p = [0, 0];
    let absolute = true;
    let volatile = false;

    const points = [];
    let part;
    let lastCommand;
    while ((part = parts.shift())) {
      if (contains(supportedCommands, part)) {
        absolute = contains(absoluteCommands, part);
        volatile = part === "m" || part === "M";
        lastCommand = part;

        if (part === "Z" || part === "z") {
          points.push([points[0][0], points[0][1]]);
        }
      } else if (startsWithNumber(part)) {
        const arr = part.split(",").map(parseFloat);
        if (contains(singleNumberCommands, part)) {
          const num = parseFloat(parts.shift());
          if (part === "H" || part === "h") {
            points.push([p[0], (part === "h" ? p[1] : num) + num]);
          } else if (part === "V" || part === "v") {
            points.push([(part === "v" ? p[0] : 0) + num, p[1]]);
          }
        }

        // MmLl
        if (absolute) {
          p = arr;
        } else {
          p = [p[0] + arr[0], p[1] + arr[1]];
        }

        if (!volatile) {
          points.push(p);
        }
      } else {
        throw part;
      }
    }
    return points;
  }

  global.svgDToPoly = svgDToPoly;
})(this);

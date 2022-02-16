let numClicks = 0;
let erase = -1;

let points = [];
let Tpoints = [];

let x_up, y_up, x_down, y_down, ctx,rect;

function start() {
  const canvas = document.getElementById("myCanvas");
  const clear = document.getElementById("clear");

  canvas.height = window.innerHeight * 0.8;
  canvas.width = window.innerWidth * 0.8;
  ctx = canvas.getContext("2d");
  rect = canvas.getBoundingClientRect();

  clear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  canvas.addEventListener("click", (event) => {
    numClicks++;
    if (numClicks === 1) {
      singleClickTimer = setTimeout(() => {
        numClicks = 0;
        singleClick(event);
      }, 200);
    } else if (numClicks === 2) {
      clearTimeout(singleClickTimer);
      numClicks = 0;
      doubleClick(event);
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    x_up = event.clientX - rect.left;
    y_up = event.clientY - rect.top;
    console.log(x_up, y_up);
    let [i, type] = insideForAll(x_down, y_down);
    let [_, type1] = insideForAll(x_up, y_up);
    if (!type && type1 && !(x_up === x_down && y_up === y_down)) {
      let p = updatedPoints(i);
      Tpoints.splice(i, 1);
      Tpoints.push(p);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < Tpoints.length; i++) {
        drawTriangle(Tpoints[i], randomColor());
      }
    }
  });
  canvas.addEventListener("mousedown", (event) => {
    x_down = event.clientX - rect.left;
    y_down = event.clientY - rect.top;
    console.log(x_down, y_down);
  });
}

function updatedPoints(i) {
  let point = Tpoints[i];
  let z1 = [point[0][0] + x_up - x_down, point[0][1] + y_up - y_down];
  let z2 = [point[1][0] + x_up - x_down, point[1][1] + y_up - y_down];
  let z3 = [point[2][0] + x_up - x_down, point[2][1] + y_up - y_down];
  return [z1, z2, z3];
}

function getPoints(event) {
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let [_, type] = insideForAll(x, y);
  if (type) {
    points.push([x, y]);
  }
}

function drawTriangle(point, color) {
  var path = new Path2D();
  path.moveTo(point[0][0], point[0][1]);
  path.lineTo(point[1][0], point[1][1]);
  path.lineTo(point[2][0], point[2][1]);

  ctx.fillStyle = color;
  ctx.fill(path);
}

function randomColor() {
  let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return color;
}

function singleClick(event) {
  getPoints(event);
  if (points.length === 3) {
    Tpoints.push(points);
    drawTriangle(points, randomColor());

    points = [];
  }
}

function doubleClick(event) {
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let [i, type] = insideForAll(x, y);
  if (!type) {
    Tpoints.splice(i, 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < Tpoints.length; i++) {
      drawTriangle(Tpoints[i], randomColor());
    }
  }
}

function area(x_1, y_1, x_2, y_2, x_3, y_3) {
  return Math.abs(
    (x_1 * (y_2 - y_3) + x_2 * (y_3 - y_1) + x_3 * (y_1 - y_2)) / 2.0
  );
}

function isInside(p, x, y) {
  let A = area(p[0][0], p[0][1], p[1][0], p[1][1], p[2][0], p[2][1]);
  let A1 = area(x, y, p[1][0], p[1][1], p[2][0], p[2][1]);
  let A2 = area(p[0][0], p[0][1], x, y, p[2][0], p[2][1]);
  let A3 = area(p[0][0], p[0][1], p[1][0], p[1][1], x, y);
  return A == A1 + A2 + A3;
}

function insideForAll(x, y) {
  if (Tpoints.length === 0) {
    return [-1, true];
  }
  for (let i = 0; i < Tpoints.length; i++) {
    if (isInside(Tpoints[i], x, y)) {
      return [i, false];
    }
  }
  return [-1, true];
}

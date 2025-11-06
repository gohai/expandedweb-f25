// Expanded Web
// NYUSH F25 - gohai

let x;

function setup() {
  createCanvas(400, 200);
  x = width/2;
}

function draw() {
  background(255);
  circle(x, height/2, 40);
}

function mousePressed() {
  x = mouseX;

  let data = {
    angle: floor(map(x, 0, width, 0, 180))
  };

  // this sends a HTTP POST request to /servo
  httpPost('/servo', 'json', data);
}

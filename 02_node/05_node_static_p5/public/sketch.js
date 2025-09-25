// Expanded Web
// NYUSH F25 - gohai

let y = 100;
let speedY = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("skyblue");
  fill(lerpColor(color("yellow"), color("red"), map(y, 0, height, 0, 1)));
  noStroke();
  circle(width / 2, y, 100);
  y = y + speedY;
  speedY = speedY + 0.1;
  if (y + 50 >= height) {
    speedY = speedY * -0.95;
  }
}

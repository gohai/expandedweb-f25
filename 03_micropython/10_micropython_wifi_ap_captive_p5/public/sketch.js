function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  colorMode(HSB);
  background(frameCount % 360, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Expanded Web
// NYUSH F25 - gohai

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);

  // draw a color wheel
  colorMode(HSL);
  for (let i = 0; i < 360; i++) {
    fill(i, 100, 50);
    arc(width/2, height/2, 360, 360, radians(i - 90), radians(i + 1 - 90));
  }
  colorMode(RGB);
}

function mousePressed() {
  let c = get(mouseX, mouseY);

  let data = {
    r: floor(red(c)),
    g: floor(green(c)),
    b: floor(blue(c)),
  };

  // this sends a HTTP POST request to /rgb
  httpPost('/rgb', 'json', data);
}

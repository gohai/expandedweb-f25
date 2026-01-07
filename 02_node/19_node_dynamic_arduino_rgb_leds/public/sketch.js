let numLeds = 60; // needs to match the number in Arduino
let leds = [];

function setup() {
  createCanvas(400, 400);

  // each LED gets its own color variable
  for (let i = 0; i < numLeds; i++) {
    leds.push(color(0));
  }
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

  if (mouseIsPressed) {
    // send the current color under the mouse cursor
    let c = get(mouseX, mouseY);
    for (let i=0; i < 60; i++) {
      leds[i] = c;
    }
    sendColors(leds);
  }
}

function sendColors(ledsArray) {
  // convert the color variables to an array of
  // [ red, green blue ] to send to Node.js
  let values = [];
  for (let i=0; i < ledsArray.length; i++) {
    values.push([ round(red(ledsArray[i])), round(green(ledsArray[i])), round(blue(ledsArray[i])) ]);
  }

  let message = {
    leds: values,
  }

  // this sends a HTTP POST request to /rgb
  httpPost('/arduino/rgb', 'json', message);
}

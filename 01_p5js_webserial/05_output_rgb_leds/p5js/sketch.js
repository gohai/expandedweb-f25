let port;
let connectBtn;
let numLeds = 60; // needs to match the number in Arduino
let leds = [];

function setup() {
  createCanvas(400, 400);

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 115200);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  connectBtn = createButton("Connect to Arduino");
  connectBtn.mousePressed(connectBtnClick);

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
  for (let i = 0; i < ledsArray.length; i++) {
    let r = floor(red(ledsArray[i]));
    let g = floor(green(ledsArray[i]));
    let b = floor(blue(ledsArray[i]));
    if (i == 0) {
      port.write(0x80 | (r >> 1)); // signal for Arduino that it's the first
    } else {
      port.write(r >> 1);
    }
    port.write(g >> 1);
    port.write(b >> 1);
  }
}

function connectBtnClick() {
  port.open("Arduino", 115200);
  connectBtn.hide();
}

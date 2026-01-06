let port;
let connectBtn;
let ledOn = false;

function setup() {
  createCanvas(400, 400);

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  connectBtn = createButton("Connect to Arduino");
  connectBtn.mousePressed(connectBtnClick);
}

function draw() {
  background(255);

  if (ledOn) {
    fill(255, 0, 0);
  } else {
    noFill();
  }
  circle(width / 2, height / 2, 200);
}

function mouseClicked() {
  if (ledOn) {
    // it's on, turn it off
    ledOn = false;
    port.write("0\n");
  } else {
    // it's off, turn it on
    ledOn = true;
    port.write("1\n");
  }
}

function connectBtnClick() {
  port.open("Arduino", 57600);
  connectBtn.hide();
}

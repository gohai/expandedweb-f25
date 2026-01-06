let port;
let connectBtn;

function setup() {
  createCanvas(400, 200);

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

  let pos1 = sin(frameCount / 100);
  let pos2 = cos(frameCount / 100);

  fill(50);
  ellipse(width / 2 + (pos1 * width) / 2, height / 3, 40, 40);
  ellipse(width / 2 + (pos2 * width) / 2, (2 * height) / 3, 40, 40);

  let servoPos1 = floor(map(pos1, -1, 1, 0, 180));  // floor() to get rid of decimals
  let servoPos2 = floor(map(pos2, -1, 1, 0, 180));
  port.write(servoPos1 + "," + servoPos2 + "\n");
}

function connectBtnClick() {
  port.open("Arduino", 57600);
  connectBtn.hide();
}

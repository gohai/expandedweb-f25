// Expanded Web
// NYUSH F25 - gohai

let messages = [];
let favColor;
let favCoords;

function setup() {
  createCanvas(400, 400);

  httpGet('/messages', 'json', gotMessages);

  let buttonEl = createButton('Submit');
  buttonEl.mouseClicked(postMessage);
}

function draw() {
  background(255);

  // draw a color wheel
  colorMode(HSL);
  noStroke();
  for (let i = 0; i < 360; i++) {
    fill(i, 100, 50);
    arc(width/2, height/2, 360, 360, radians(i - 90), radians(i + 1 - 90));
  }
  colorMode(RGB);

  // draw the favorite colors we got from the backend
  for (let i=0; i < messages.length; i++) {
    stroke(0);
    noFill();
    rect(messages[i].coords.x - 5, messages[i].coords.y - 5, 10, 10);
    noStroke();
    fill(0);
    textSize(8);
    text(messages[i].from, messages[i].coords.x - 5, messages[i].coords.y + 15);
  }

  // let the user pick a favorite color using the mouse
  if (mouseIsPressed && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    favColor = get(mouseX, mouseY);
    favCoords = { x: mouseX, y: mouseY };
  }

  if (favColor) {
    fill(favColor);
    circle(favCoords.x, favCoords.y, 100);
  }
}

function gotMessages(data) {
  messages = data;
}

function postMessage() {
  if (!favColor)
    return;

  let message = {
    r: red(favColor),
    g: green(favColor),
    b: blue(favColor),
    coords: favCoords,
  };

  httpPost('/message', 'json', message);
  favColor = null;
}

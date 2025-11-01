// Expanded Web
// NYUSH F25 - gohai

let clicks = 0;

function setup() {
  createCanvas(400, 400);

  setInterval(getClicks, 5000);
}

function draw() {
  background(255);
  noStroke();
  fill(180, 0, 0);
  circle(width/2+5, height/2+5, 80);
  fill(255, 0, 0);
  if (mouseIsPressed) {
    circle(width/2+5, height/2+5, 80);
  } else {
    circle(width/2, height/2, 80);
  }
  text(clicks, 50, 50);
}

function mousePressed() {
  let data = {
    // not passing any data here in this example
  }
  httpPost('/click', 'json', data, gotClicks);
}

function getClicks() {
  httpGet('/clicks', 'json', gotClicks);
}

function gotClicks(data) {
  clicks = data.clicks;
}

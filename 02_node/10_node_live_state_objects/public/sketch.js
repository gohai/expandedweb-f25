// Expanded Web
// NYUSH F25 - gohai

let socket;
let objects = {};
let selected = null;

function setup() {
  createCanvas(400, 400);

  socket = io();

  socket.on('initialize', function(data) {
    console.log('received initialize', data);
    objects = data;
  });

  socket.on('update', function(key, values) {
    console.log('received update', key, values);
    objects[key] = values;
  });
}

function draw() {
  background(204);

  for (let emoji in objects) {
    textSize(64);
    textAlign(CENTER, CENTER);
    text(emoji, objects[emoji].x, objects[emoji].y);
  }
}

function mousePressed() {
  // did the user just select an object?
  let closestDist = 999;
  let closestEmoji = null;
  for (let emoji in objects) {
    let d = dist(mouseX, mouseY, objects[emoji].x, objects[emoji].y);
    if (d < closestDist) {
      closestDist = d;
      closestEmoji = emoji;
    }
  }
  if (closestDist < 20) {
    console.log('selected ' + closestEmoji);
    selected = closestEmoji;
  }
}

function mouseDragged() {
  if (selected != null) {
    objects[selected].x = mouseX;
    objects[selected].y = mouseY;
    // tell the server that the object moved
    socket.emit('update', selected, objects[selected]);
  }
}

function mouseReleased() {
  selected = null;
}

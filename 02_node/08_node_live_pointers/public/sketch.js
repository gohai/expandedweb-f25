let socket;
let pointers = {};

function setup() {
  createCanvas(400, 400);

  // this automatically connects to a Socket.IO (WebSocket)
  // server on the same host that serves this website
  // we could also connect to a different URL if we wanted
  socket = io();

  // here, we can register functions to be called when
  // certain events occur

  socket.on('mousemove', function(data) {
    // called when a "mousemove" message is received
    console.log('received', data);
    // add to our object
    pointers[data.id] = data;
    pointers[data.id].lastSeen = millis();
  });
}

function draw() {
  background(204);

  let sumPointerX = mouseX;
  let sumPointerY = mouseY;
  let numPointers = 1;

  // draw all the pointers
  // for..in loops over all properties of an object
  for (let id in pointers) {
    // get rid of entries that are too old
    // the user might have closed the website
    if (millis() - pointers[id].lastSeen > 3000) {
      delete pointers[id];
    } else {
      fill(255);
      beginShape();
      vertex(pointers[id].x, pointers[id].y);
      vertex(pointers[id].x, pointers[id].y+16);
      vertex(pointers[id].x+4, pointers[id].y+12);
      vertex(pointers[id].x+10, pointers[id].y+12);
      endShape(CLOSE);
      textSize(8);
      text(id, pointers[id].x, pointers[id].y + 30);
      //text(pointers[id].ip, pointers[id].x, pointers[id].y + 30);
      // for our average calculation
      sumPointerX += pointers[id].x;
      sumPointerY += pointers[id].y;
      numPointers++;
    }
  }

  let avgPointerX = sumPointerX / numPointers;
  let avgPointerY = sumPointerY / numPointers;
  //noFill();
  //circle(avgPointerX, avgPointerY, 50);

  // draw eye that follows the average pointer position
  fill(255);
  stroke(255);
  strokeWeight(5);
  circle(width/2, height/2, 100);
  fill(0);
  noStroke();
  let pupilX = map(avgPointerX, 0, width, width/2 - 20, width/2 + 20);
  let pupilY = map(avgPointerY, 0, height, height/2 - 20, height/2 + 20);
  circle(pupilX, pupilY, 50);
}

function mouseMoved() {
  // this sends a 'mousemove' message with the current
  // mouse coordinates to the server (instead of mousemove
  // we could use a different name just as well)

  let data = {
    x: mouseX,
    y: mouseY,
    id: socket.id,  // send our id for others to keep the data apart
  }
  socket.emit('mousemove', data);
}

// Expanded Web
// NYUSH F25 - gohai

let streamEl;

function setup() {
  noCanvas();

  // if we want to use the live stream image within p5
  // we can do this:
  streamEl = select('#stream');
  // optionally hide the source element (like with webcam):
  //streamEl.hide();
}

function draw() {
  //image(streamEl, 0, 0);
}

// Expanded Web
// NYUSH F25 - gohai

let inputEl;

function setup() {
  noCanvas();

  inputEl = createInput();
  let buttonEl = createButton('Submit');
  buttonEl.mouseClicked(postMessage);
}

function draw() {
}

function postMessage() {
  let message = {
    text: inputEl.value(),
  }

  // this sends a HTTP POST request to /say
  httpPost('/arduino/out', 'json', message);
  inputEl.value('');
}

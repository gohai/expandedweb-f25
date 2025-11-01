// Expanded Web
// NYUSH F25 - gohai

let messages = [];
let inputEl;

function setup() {
  createCanvas(400, 400);

  // this sends a HTTP GET request to /messages
  // and calls the gotMessages function with the
  // data received
  httpGet('/messages', 'json', gotMessages);

  inputEl = createInput();
  let buttonEl = createButton('Submit');
  buttonEl.mouseClicked(postMessage);
}

function draw() {
  background(255);
  let offY = 30;
  for (let i=messages.length-1; i >= 0; i--) {
    text(messages[i].from + ' wrote: ' + messages[i].text, 20, offY);
    offY += 20;
  }
}

// a so-called "callback" function
// (invoked whenever the response from the server is available)
function gotMessages(data) {
  messages = data;
}

function postMessage() {
  // you could put any additional data into this object
  // to be sent to the backend and stored there
  let message = {
    text: inputEl.value(),
  };

  // this sends a HTTP POST request to /message
  httpPost('/message', 'json', message);
  inputEl.value('');
}

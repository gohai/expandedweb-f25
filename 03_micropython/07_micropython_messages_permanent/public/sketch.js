// Expanded Web
// NYUSH F25 - gohai

// This example is very similar to 06_node_dynamic_messages.
// The comments only discuss what's different here. Have a
// look at the sketch.js file in the earlier example for additional
// explanation.

let messages = [];
let inputEl;

function setup() {
  createCanvas(400, 400);

  // setInterval() lets us tell the browser to call a certain
  // function (getMessages) every so often (5 seconds)
  setInterval(getMessages, 5000);

  inputEl = createInput();
  let buttonEl = createButton('Submit');
  buttonEl.mouseClicked(postMessage);
}

function draw() {
  background(255);
  let offY = 30;
  for (let i=0; i < messages.length; i++) {
    text(messages[i].from + ' wrote on ' + messages[i].date + ': ' + messages[i].text, 20, offY);
    offY += 20;
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    postMessage();
  }
}

function getMessages() {
  httpGet('/messages', 'json', gotMessages);
}

function gotMessages(data) {
  messages = data;
}

function postMessage() {
  let message = {
    text: inputEl.value(),
    // the ESP32 doesn't know the time, so have the clients add it to their messages
    date: new Date().toLocaleString(),
  };

  httpPost('/message', 'json', message, gotMessages);
  inputEl.value('');
}

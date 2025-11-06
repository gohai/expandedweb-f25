// Expanded Web
// NYUSH F25 - gohai

let bright = 0;
let maxBright = 0;
let minBright = 65535;

function setup() {
  createCanvas(400, 400);

  // request the live data from the server
  getLdrData();
}

function draw() {
  background(map(bright, minBright, maxBright, 0, 255));

  // this keeps track of the brightest and dimmest we saw
  if (bright > maxBright) {
    maxBright = bright;
  }
  if (bright < minBright) {
    minBright = bright;
  }
}

function getLdrData() {
  // this sends a HTTP GET request to /ldr
  httpGet('/ldr', 'json', gotLdrData);
}

function gotLdrData(data) {
  // this "callback" function is called when the browser
  // receives the data from the server
  console.log('Received', data);

  bright = data.value;

  // If we wanted, we can have the browser request the
  // data once again at this point. A nice way of doing
  // this is using the setTimeout() function. E.g. don't
  // request it immediately, but first wait a second, so
  // that we aren't stressing out the server too much.
  setTimeout(getLdrData, 1000);
}

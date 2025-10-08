// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let { SerialPort, ReadlineParser } = require('serialport');  // for making use of the serial port
let app = express();
let port = 3000;
let arduino = null;   // this will hold the serial port object

let lastLine = '';    // the last line of text received from Arduino
let lastValues = [];  // same, but interpreted as numbers

app.use(express.static('public'));
app.use(express.json());

// try to open the serial port
tryConnectArduinoAndRead();


app.get('/arduino/in', function(req, res) {
  // this returns the most recently received data as JSON
  let data = {
    text: lastLine,
    values: lastValues,
  };
  res.json(data);
});

app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});


/*
 * Helper functions for talking to Arduino
 */

async function tryConnectArduinoAndRead(baudRate = 57600) {
  await tryConnectArduino(baudRate);
  if (!arduino) {
    return;
  }

  // this splits the data received on the serial port in separate lines
  let parser = arduino.pipe(new ReadlineParser({ delimiter: '\n' }));

  parser.on('data', function(line) {
    // for every line that comes in:
    console.log('Received from Arduino: ' + line);
    lastLine = line.trim();  // get rid of \n
    // try to turn the text into numbers also
    lastValues = [];
    let fields = lastLine.split(',');
    for (let field of fields) {
      lastValues.push(parseInt(field));
    }
  });
}

async function tryConnectArduino(baudRate = 57600) {
  if (arduino && arduino.isOpen) {
    return;  // port is already open
  }
  try {
    let port = await getArduino();
    if (port) {
      arduino = new SerialPort({
        path: port.path,
        baudRate: baudRate,
      }, function(err) {
        if (err) {
          console.error(err.message);
        }
      });
      console.log('Opening connection with Arduino serial number ' + port.serialNumber);
    }
  } catch (e) {
    console.error('Error opening Arduino:', e);
  }
}

async function getArduino() {
  let ports = await SerialPort.list();
  for (port of ports) {
    if (port.vendorId == '2341' || port.vendorId == '3343')
      return port;
  }
  return null;
}

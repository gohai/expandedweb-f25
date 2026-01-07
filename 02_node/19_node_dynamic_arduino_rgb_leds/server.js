// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let { SerialPort } = require('serialport');
let app = express();
let port = 3000;
let arduino = null;

app.use(express.static('public'));
app.use(express.json());

// this uses a higher baudrate than normal
tryConnectArduino(115200);


// function for sending colors to the Arduino
function sendColors(ledArray) {
  for (let i=0; i < ledArray.length; i++) {
    for (let c=0; c < 3; c++) {
      let val = ledArray[i][c];
      // make sure the values are whole numbers
      val = Math.floor(val);
      // make sure val is 0-255
      val = Math.min(255, Math.max(0, val));
      if (i == 0 && c == 0) {
        val = 0x80 | (val >> 1);  // signal for Arduino that it's the first color
      } else {
        val = val >> 1;
      }
      if (arduino) {
        // write() can accept an array of bytes
        // (positive numbers under 256)
        arduino.write([val]);
      }
    }
  }
}

app.post('/arduino/rgb', function(req, res) {
  let message = req.body;
  if (!Array.isArray(message.leds) || message.leds.length == 0) {
    console.error('Missing leds array');
  } else {
    console.log('Received data for ' + message.leds.length + ' LEDs');
    sendColors(message.leds);
  }
  res.end();  // we don't send data - tells the client to not wait any longer
});


app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});


/*
 * Helper functions for talking to Arduino
 */

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

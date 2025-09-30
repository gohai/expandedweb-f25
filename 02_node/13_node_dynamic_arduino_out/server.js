// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let { SerialPort } = require('serialport');  // for making use of the serial port
let app = express();
let port = 3000;
let arduino = null;  // this will hold the serial port object

app.use(express.static('public'));
app.use(express.json());

// try to open the serial port
tryConnectArduino();


app.post('/arduino/out', function(req, res) {
  let message = req.body;
  console.log(req.ip + ' made me send to Arduino: ' + message.text);
  if (arduino) {
    arduino.write(message.text + '\n');  // this sends the string over the serial port
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
      });
      console.log('Opened connection with Arduino serial number ' + port.serialNumber);
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

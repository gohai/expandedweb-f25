// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
// this loads the file system functions in node
// see https://nodejs.org/docs/latest/api/fs.html
let fs = require('node:fs');
let app = express();
let port = 3000;

app.use(express.static('public'));
// this line makes express interpret the JSON formatted
// data that the frontend (p5) is going to send
app.use(express.json());


// array for all messages
let messages;

// this tries to load all the messages from the file
// messages.json - if this fails, we start with an
// empty array for messages
try {
  let data = fs.readFileSync('messages.json');
  messages = JSON.parse(data);
  console.log('Loaded messages');
} catch (e) {
  messages = [];
}


app.get('/messages', function(req, res) {
  // this function is being called whenever the server
  // receives a HTTP GET request for /messages
  // - it returns all messages (in JSON format)
  res.json(messages);
});

app.post('/message', function(req, res) {
  // this function is being called whenever the server
  // receives a HTTP POST request for /message
  // - the data the client sent is in req.body
  console.log(req.body);
  let message = req.body;
  // let's add some additional information
  message.date = new Date().toISOString();
  message.from = req.ip;
  // add it the messages array
  messages.push(message);
  // and save all current messages to a file (for permanence)
  fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
  // its a good practice return the final message to the client
  res.json(message);
});

app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});

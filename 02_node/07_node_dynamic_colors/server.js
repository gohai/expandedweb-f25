// Expanded Web
// NYUSH F25 - gohai

// the backend code is identical to 06_node_dynamic_messages
// despite the data being saved and retrieved differing

let express = require('express');
let fs = require('node:fs');
let app = express();
let port = 3000;

app.use(express.static('public'));
app.use(express.json());


let messages;

try {
  let data = fs.readFileSync('messages.json');
  messages = JSON.parse(data);
  console.log('Loaded messages');
} catch (e) {
  messages = [];
}


app.get('/messages', function(req, res) {
  res.json(messages);
});

app.post('/message', function(req, res) {
  console.log(req.body);
  let message = req.body;
  message.date = new Date().toISOString();
  message.from = req.ip;
  messages.push(message);
  fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
  res.json(message);
});

app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});

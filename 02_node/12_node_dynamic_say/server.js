// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let say = require('say');  // for text-to-speech
let app = express();
let port = 3000;

app.use(express.json());


app.use(function(req, res, next) {
  // this function is just for demo purposes:
  // it says a text whenever someone visits the
  // static website
  if (req.path == '/') {
    console.log(req.ip + ' visited');
    say.speak('Oh, a visitor!');
  }
  next();
});

// for the above to work, the static website
// functionality must be set up *after*
app.use(express.static('public'));

app.post('/say', function(req, res) {
  // more general/useful: sending a POST
  // request to /say will make your computer
  // say some text
  console.log(req.body);
  let message = req.body;
  if (message.text) {
    say.speak(message.text);
  }
  res.end();  // we don't send data - tells the client to not wait any longer
});

app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});

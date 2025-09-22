// Note: This is the Hello World example from express, but slightly modified
// to be closer to the JavaScript syntax introduced by IMA's CCL foundation.

let express = require('express');
let app = express();
let port = 3000;

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.listen(port, "0.0.0.0", function() {
  console.log('Example app listening on port ' + port);
});

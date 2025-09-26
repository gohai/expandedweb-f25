// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let app = express();
let port = 3000;

// servers can hold information in between requests
// e.g. we can create a variable that will change
// each time a HTTP request comes in

let visitors = 0;

app.get('/', function(req, res) {
  // this function is being called whenever a client
  // requests the main (root) page of this webserver
  visitors++;
  res.send('You are visitor ' + visitors);
});

app.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});

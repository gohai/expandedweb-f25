let express = require('express');
let app = express();
let port = 3000;

let visitors = 'nobody';

app.get('/', function(req, res) {
  // the req object contains various information about
  // the request we received from the client
  //console.log(req);

  // e.g. we can do something with the IP address of the
  // client
  res.send('Before you, ' + visitors + ' visited');
  visitors = visitors + ', ' + req.ip;
});

app.listen(port, "0.0.0.0", function() {
  console.log('Example app listening on port ' + port);
});

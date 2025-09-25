// Expanded Web
// NYUSH F25 - gohai

let express = require('express');
let http = require('node:http');
let socketIo = require('socket.io');

let app = express();
// we need to set up our webserver slightly differently than
// before for coexistence with Socket.io
let server = http.createServer(app);
// create the Socket.io (WebSocket) server
let io = new socketIo.Server(server);
let port = 3000;

app.use(express.static('public'));


io.on('connection', function(socket) {
  // this function is called whenever there is a new connection from a client

  console.log(socket.id + ' connected from ' + socket.handshake.address);
  // every client has (random) unique id
  // we can also get the client's ip address

  // in here, we can register functions to be called when
  // certain events occur:

  socket.on('disconnect', function(reason) {
    // e.g. this gets called when the client disconnects
    console.log(socket.id + ' disconnected');
  });

  socket.on('mousemove', function(data) {
    // and this gets called when one of the client sends
    // a "mousemove" message (by calling emit())
    console.log(socket.id, data);
    // if we want we can add additional information
    // to the data here, e.g. the ip address of the
    // sender
    data.ip = socket.handshake.address;
    // and then we pass it on to other connected
    // clients like so
    socket.broadcast.emit('mousemove', data);
  });

  // alternatively, we could also use the following
  // function to simply send on *any* received
  // message to all other clients"

  //socket.onAny(function(event, ...args) {
  //  console.log(socket.id, event, ...args);
  //  socket.broadcast.emit(event, ...args);
  //});
});

// this is now also "server" rather than "app"
server.listen(port, "0.0.0.0", function() {
  console.log('Example app listening on port ' + port);
});

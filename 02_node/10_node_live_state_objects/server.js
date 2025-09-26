// Expanded Web
// NYUSH F25 - gohai

// Sometimes, even with real-time interaction, it's necessary to synchronize
// an initial "state." For example, when you step into a room, you may want
// to know where other users placed items before you arrived. This example
// demonstrates how to do that. (Thanks to Lesley for pointing this out!)

let express = require('express');
let http = require('node:http');
let socketIo = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = new socketIo.Server(server);
let port = 3000;

app.use(express.static('public'));


// this variable will hold all the information that will
// be synchronized betweens browsers
// e.g. objects will look something like that

let objects = {
  '🦆': { x: 100, y: 200 },
  '🪐': { x: 200, y: 200 },
  '🌱': { x: 300, y: 200 },
};

// (we could load and save this object to a file like in
// 06_node_dynamic_messages, if we wanted to have permanence)


io.on('connection', function(socket) {
  console.log(socket.id + ' connected from ' + socket.handshake.address);

  // when a new browser connects, we send them *all* the current
  // state at once, so that they have the same information as
  // everyone else
  socket.emit('initialize', objects);

  socket.on('disconnect', function(reason) {
    console.log(socket.id + ' disconnected');
  });

  socket.on('update', function(key, values) {
    // when one of the browsers wants to update the values
    // of one of the objects, they send an "update" event
    // e.g. key = 🦆, values = { x: 200, y: 200 }
    // for moving the duck

    // we update the variable (for future new clients)
    objects[key] = values;
    // and pass on the message to everyone else
    socket.broadcast.emit('update', key, values);
  });
});

server.listen(port, '0.0.0.0', function() {
  console.log('Example app listening on port ' + port);
});

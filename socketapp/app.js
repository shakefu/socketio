var app = require('express')();
exports.app = app;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io')();
exports.io = io;
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('load', function (){
      socket.emit('load', 'console.log("Hello")');
  });
  socket.on('disconnect', function (){
      console.log("a user disconnected");
  });
});

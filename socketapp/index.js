var http = require('http');
var gaze = require('gaze');

var state = {server: null};

gaze(['*.js', '*.html', '**/*.js', '**/*.html'], function (err, watcher){
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
    try {
        delete require.cache[filepath];
    }
    catch (err) {
        throw err;    
    }
    state.server && state.server.close();
  });
});


var Server = function Server(){
    var app = require('./app');
    var server = http.Server(app.app);
    var io = app.io;
    io.listen(server);
    server.listen(3000, function(){
      console.log('listening on *:3000');
    });
    return {
        close: function (){
            state.server = null;
            console.log("Closing");
            io.emit('reload');
            process.nextTick(function (){
                io.close();
                process.nextTick(function (){
                    console.log("Closed");
                    process.nextTick(start);
                });
            });
        }
    };
};


var start = function (){
    state.server = new Server();
};

start();

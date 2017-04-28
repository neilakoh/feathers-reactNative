const feathers = require('feathers');
const socketio = require('feathers-socketio');

const app = feathers();

app.configure(socketio(function(io) {
  io.on('connection', function(socket) {
    console.log('connected');
    // THIS IS TO PASS DATA FROM SERVER TO CLIENT BY CALLING THE EMIT 'test' IN THE CLIENT
    // DATA SENDER
    // socket.emit('test', { hello: 'world' });

    // RECEIVE DATA FROM CLIENT BY CALLING 'test2' IN THE SERVER
    // DATA RECEIVER
    // socket.on('test2', function (data) {
    //   console.log(data);
    // });

    socket.on('test2', function (data) {
      socket.emit('test', data);
    });
  });

  // io.on('disconnected', function(socket) {
  //   console.log('disconnected');
  // });

  // Registering Socket.io middleware
  io.use(function (socket, next) {
    // Exposing a request property to services and hooks
    socket.feathers.referrer = socket.request.referrer;
    next();
  });
}));

console.log('Server is now running');
app.listen(3030);

const feathers = require('feathers');
const socketio = require('feathers-socketio');
const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');

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

    // GET DATA FROM CLIENT AND PASS IT BACK TO THE CLIENT
    socket.on('test2', function (data) {
      socket.emit('test', data);
    });

    // SAVING DATA TO THE DATABASE
    MongoClient.connect('mongodb://localhost:27017/feathers').then(db => {
      db.collection('messages').insert({name: 'test'})
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

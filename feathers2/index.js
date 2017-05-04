const feathers = require('feathers');
const socketio = require('feathers-socketio');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const service = require('feathers-mongodb');

const methods = require('./methods/app.js');
const mongoUrl = 'mongodb://localhost:27017/feathers';
const app = feathers();

app.configure(socketio(function(io) {
  io.on('connection', function(socket) {
    console.log('connected');

    socket.on('insert', function (query) {
      methods.mongoInsert(MongoClient, mongoUrl, query).then((res)=>{
        socket.emit('insert', res);
      });
    });

    socket.on('remove', function (query) {
      let query2 = {_id: ObjectId(query._id)};
      methods.mongoRemove(MongoClient, mongoUrl, query2).then((res)=>{
        socket.emit('remove', res);
      });
    });

    socket.on('update', function (query) {
      let id = ObjectId(query._id);
      let newValue = query.newVal;
      methods.mongoUpdate(MongoClient, mongoUrl, id, newValue).then((res)=>{
        socket.emit('update', res);
      });
    });

    socket.on('subscribe', function (query) {
      const collection = query.collection;
      methods.mongoSubscribe(MongoClient, mongoUrl, collection).then((res)=>{
        socket.emit('subscribe', res);
      });
    });

    socket.on('disconnect', function(socket) {
      console.log('disconnected');
    });
  });

  // Registering Socket.io middleware
  io.use(function (socket, next) {
    // Exposing a request property to services and hooks
    socket.feathers.referrer = socket.request.referrer;
    next();
  });
}));

console.log('Server is now running');
app.listen(3030);

module.exports = {
  mongoInsert: function(mongo, mongoUrl, query) {
    return new Promise(function (fulfill, reject){
      try {
        mongo.connect(mongoUrl).then(db => {
          db.collection('messages').insert(query).then((result)=>{
            fulfill(result);
          })
        });
      } catch(e) {
        reject(e);
      }
    });
  },

  mongoUpdate: function(mongo, mongoUrl, id, value) {
    return new Promise(function (fulfill, reject){
      try {
        mongo.connect(mongoUrl).then(db => {
          db.collection('messages').update({_id: id}, {$set: {name: value}}).then((result)=>{
            fulfill(result);
          })
        });
      } catch(e) {
        reject(e);
      }
    });
  },

  mongoRemove: function(mongo, mongoUrl, query) {
    return new Promise(function (fulfill, reject){
      try {
        mongo.connect(mongoUrl).then(db => {
          db.collection('messages').remove(query).then((result)=>{
            fulfill(result);
          })
        });
      } catch(e) {
        reject(e);
      }
    });
  },

  mongoSubscribe: function(mongo, mongoUrl, collection) {
    return new Promise(function (fulfill, reject){
      try {
        mongo.connect(mongoUrl).then(db => {
          db.collection(collection).find({}).toArray((err, docs)=>{
            if(!err) {
              fulfill(docs);
            } else {
              reject(e);
            }
          })
        });
      } catch(e) {
        reject(e);
      }
    });
  },


}

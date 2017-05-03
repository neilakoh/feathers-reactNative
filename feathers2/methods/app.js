module.exports = {
  mongoInsert: function(mongo, mongoUrl, data) {
    return new Promise(function (fulfill, reject){
      try {
        mongo.connect(mongoUrl).then(db => {
          db.collection('messages').insert(data).then((result)=>{
            fulfill(result);
          })
        });
      } catch(e) {
        reject(e);
      }
    });
  },
}

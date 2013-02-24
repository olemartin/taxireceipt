var mongodb = require('mongodb');
ObjectID = require('mongodb/lib/mongodb/bson/bson').ObjectID;

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}


function store(tourNum, from, to, project, callback){
  mongodb.connect(mongo_url, function(err, conn){
    conn.collection('tours', function(err, coll){
      object_to_insert = { 'date':new Date().toLocaleDateString(), 'tourNum': tourNum, 'from': from, 'to': to, 'project':project };
      coll.insert( object_to_insert, {safe:true}, function(err){
        callback()
      });
    });
  });
}

function list(callback) {
    console.log(mongo_url);
    mongodb.connect(mongo_url, function(err, conn){
        conn.collection('tours', function(err, coll){
            coll.find({}, {limit:100, sort:[['_id','desc']]}, function(err, cursor){
                cursor.toArray(function(err, items){
                    callback(items);
                });
            });
        });
    });
}

function remove(id, callback) {
    mongodb.connect(mongo_url, function(err, conn){
        conn.collection('tours', function(err, coll){
            coll.remove({"_id":new ObjectID(id)},
            function(err, removed) {
                callback();
            });
        });
    });
}



exports.store = store;
exports.list = list;
exports.remove = remove;
exports.generate_mongo_url = generate_mongo_url;

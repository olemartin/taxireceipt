var server = require("./server");
var router = require("./router");
var mongodb = require("./mongodb");
var requestHandlers = require("./requestHandlers");

require.paths.unshift('./node_modules');

var handle = {}
handle["/"] = requestHandlers.list;
handle["/list"] = requestHandlers.list;
handle["/add"] = requestHandlers.add;
handle["/remove"] = requestHandlers.remove;
handle["/post"] = requestHandlers.post;

/*
########################################
    CLOUDFOUNDRY SETUP
########################################    
*/
if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
  var mongo = {
      "hostname":"localhost",
      "port":27017,
      "username":"",
      "password":"",
      "name":"",
      "db":"db"}
}

var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 8888



mongo_url = mongodb.generate_mongo_url(mongo);

console.log(host);
console.log(port);
console.log(mongo_url);

server.start(router.route, handle, host, port);
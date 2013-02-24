var serv = require("./serv");
var router = require("./router");
var mongodb = require("./mongodb");
var requestHandlers = require("./requestHandlers");

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
else if(process.env.OPENSHIFT_MONGODB_DB_HOST){
  var mongo = {
      "hostname":process.env.OPENSHIFT_MONGODB_DB_HOST,
      "port":process.env.OPENSHIFT_MONGODB_DB_PORT,
      "username":process.env.OPENSHIFT_MONGODB_DB_USERNAME,
      "password":process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
      "name":"taxireceipt",
      "db":"taxireceipt"}
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
if (process.env.VCAP_APP_HOST) {
	var host = process.env.VCAP_APP_HOST;
	var port = process.env.VCAP_APP_PORT;
} else if (process.env.OPENSHIFT_INTERNAL_PORT) {
	var host = process.env.OPENSHIFT_INTERNAL_IP;
	var port = process.env.OPENSHIFT_INTERNAL_PORT;
} else {
	var host = 'localhost';
	var port = 8888	
}
mongo_url = mongodb.generate_mongo_url(mongo);

console.log(host);
console.log(port);
console.log(mongo_url);

serv.start(router.route, handle, host, port);
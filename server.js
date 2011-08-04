var http = require("http");
var url = require("url");

function start(route, handle, host, port) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, request, response);
    }
    http.createServer(onRequest).listen(port);
}

exports.start = start;
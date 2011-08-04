var static = require('node-static');
var file = new(static.Server)('.');

function route(handle, pathname, request, response) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else if (pathname.indexOf("/public") == 0) {
        file.serve(request, response);  
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route = route;
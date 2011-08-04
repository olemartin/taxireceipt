var Mustache = require('./mustache')
var fs = require('fs');
var mongodb = require('./mongodb')
var querystring = require('querystring')
   

function list(request, response) {
    mongodb.list(function(stored) {
        var view = {items: stored};
        fs.readFile('./templates/list.html', 'utf8', function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(Mustache.to_html(data, view))
            response.end()
        });
    }); 
}

function add(request, response) {
    fs.readFile('./templates/add.html', 'utf8', function (err, data) {
        if (err) throw err;
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write(Mustache.to_html(data))
        response.end()
    });
}

function post(request, response) {
    post_handler(request, function(request_data) {
        mongodb.store(request_data.tour, request_data.from, request_data.to, request_data.project, function() {
            response.writeHead(302, {'Location': 'list'});
            response.end()
        });
    });
}

function remove(request, response) {
    id = require('url').parse(request.url, true).query.id;
    console.log(id)
    mongodb.remove(id, function() {
        response.writeHead(302, {'Location': 'list'});
        response.end()
    });
}

function post_handler(request, callback) {
    var REQUEST = { };
    var CONTENT = '';

    if (request.method == 'POST') {
        request.addListener('data', function(chunk) {
            CONTENT+= chunk;
        });
    }

    request.addListener('end', function() {
        REQUEST = querystring.parse(CONTENT);
        callback(REQUEST);
    });
}

exports.add = add;
exports.list = list;
exports.post = post;
exports.remove = remove;
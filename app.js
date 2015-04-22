var Hapi = require('hapi'),
    handler = require('./lib/mailgun-post-handler');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: process.env.PORT || 5000
});

server.route({
    method: 'GET',
    path:'/',
    handler: function(request, reply){reply('OK');}
});

server.route({
    method: 'POST',
    path:'/post',
    handler: handler
});

server.start();
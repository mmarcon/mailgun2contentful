var Hapi = require('hapi'),
    handler = require('./lib/mailgun-post-handler');

var server = new Hapi.Server(),
    port = process.env.PORT || 5000;

server.connection({
    host: 'localhost',
    port: port
});

console.log('PORT = ' + port);

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
var Hapi = require('hapi'),
    handler = require('./lib/mailgun-post-handler');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: process.env.PORT || process.env.VCAP_APP_PORT || 3000
});

server.route({
    method: 'POST',
    path:'/post',
    handler: handler
});

server.start();
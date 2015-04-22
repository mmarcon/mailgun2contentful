var Hapi = require('hapi'),
    handler = require('./lib/mailgun-post-handler');

var server = new Hapi.Server(),
    config = {};

server.connection({
    host: 'localhost',
    port: process.env.PORT || process.env.VCAP_APP_PORT || 3000
});

server.route({
    method: 'GET',
    path:'/gimme',
    handler: function (request, reply) {
       reply('hello world');
    }
});


config.contentfulToken = process.env.CONTENTFUL_TOKEN || require('./config').contentfulToken;

server.route({
    method: 'POST',
    path:'/post',
    handler: handler
});

server.start();
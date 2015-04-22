var request = require('request');

var CONTENTFUL_URL = 'https://api.contentful.com/spaces/ytivo3qay7d1/entries';

function post(post, token, callback){
    var body = JSON.stringify(post);
    request({
        url: CONTENTFUL_URL,
        method: 'POST',
        headers: {
            'X-Contentful-Content-Type': 'Place',
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Authorization': 'BEARER ' + token,
            'Content-Length': body.length,
        }
        body: body
    }, function(e, response, data){
        if(e) {
            return callback(e);
        }
        return(null, response.statusCode);
    });

    module.exports = {
        post: post
    };
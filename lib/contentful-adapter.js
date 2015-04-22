var request = require('request');

var CONTENTFUL_POST_URL = 'https://api.contentful.com/spaces/ytivo3qay7d1/entries';
var CONTENTFUL_PUBLISH_URL_TEMPLATE = 'https://api.contentful.com/spaces/ytivo3qay7d1/entries/{id}/published';
var CONTENTFUL_TOKEN = process.env.CONTENTFUL_TOKEN;

function post(postObject, publish, callback) {
    var body = JSON.stringify(postObject);
    request({
        url: CONTENTFUL_POST_URL,
        method: 'POST',
        headers: {
            'X-Contentful-Content-Type': 'yUiYydQK3u6Ca0w2Wg6ke',
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'Authorization': 'Bearer ' + CONTENTFUL_TOKEN,
            'Content-Length': body.length,
        },
        body: body
    }, function(e, response, data){
        if(e) {
            return callback(e);
        }
        if(!publish) {
            return callback(null, response.statusCode);
        }
        var entry = JSON.parse(data);
        publishEntry(entry, callback);
    });
}

function publishEntry(entry, callback) {
    var id = entry.sys.id,
        version = entry.sys.version;

    request({
        url: CONTENTFUL_PUBLISH_URL_TEMPLATE.replace('{id}', id),
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + CONTENTFUL_TOKEN,
            'X-Contentful-Version': version
        }
    }, function(e, response, data){
        if(e) {
            return callback(e);
        }
        return callback(null, response.statusCode);
    });
}

module.exports = {
    post: post
};
var ent = require('ent'),
    geocoder = require('./geocoder-adapter'),
    contentful = require('./contentful-adapter');

var API_KEY = process.env.API_KEY;

function parse(request){
    var payload = request.payload,
        parsed = {};

    try { //We are parsing JSON typed on a phone screen, we better try/catch
        parsed = payload['body-plain'] && JSON.parse(ent.decode(payload['body-plain']));
    } catch(e){}

    return {
        location: {
            latitude: parsed.latitude,
            longitude: parsed.longitude
        },
        apiKey: parsed.key
    };
}

module.exports = function (request, reply) {
    var data = parse(request);
    if(data.apiKey !== API_KEY) {
        console.log(data.apiKey + ' is NOT ' + API_KEY);
        return reply('forbidden - check your key').code(403);
    }
    geocoder.reverseGeocode(data.location.latitude, data.location.longitude, function(place){
        var postObject = {
            fields: {
                name: {
                    'en-US': place.name,
                },
                location: {
                    'en-US': {
                        lat: place.position.latitude,
                        lon: place.position.longitude
                    }
                }
            }
        };
        contentful.post(postObject, true /*publish directly*/, function(e, statusCode){
            if(e) {
                return reply('not created').code(520);
            }
            reply('created').code(201);
        });
    });
};
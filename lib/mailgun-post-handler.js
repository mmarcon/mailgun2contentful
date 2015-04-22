var ent = require('ent'),
    geocoder = require('./geocoder-adapter'),
    contentful = require('./contentful-adapter');

function parse(request){
    var payload = request.payload,
        parsed = {};

    try { //We are parsing JSON typed on a phone screen, we better try/catch
        parsed.location = payload['body-plain'] && JSON.parse(ent.decode(payload['body-plain']));
    } catch(e){}

    return parsed;
}

module.exports = function (request, reply) {
    var data = parse(request);
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
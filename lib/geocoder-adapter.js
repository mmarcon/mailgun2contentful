var request = require('request');

var TEMPLATE_URL_ADDRESS = 'http://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=1220G0MOv2PBLjLq6tex&app_code=0MM0Lr7hPyqfv3GiPmBOyg&gen=8&prox={LAT},{LON},100&mode=retrieveAddresses';
var TEMPLATE_URL_LANDMARK = 'http://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=1220G0MOv2PBLjLq6tex&app_code=0MM0Lr7hPyqfv3GiPmBOyg&gen=8&prox={LAT},{LON},300&mode=retrieveLandmarks';

function normalize(place) {
    if(place.MatchLevel === 'landmark') {
        return {
            type: place.Location.LocationType,
            position: {
                latitude: place.Location.DisplayPosition.Latitude,
                longitude: place.Location.DisplayPosition.Longitude,
            },
            name: place.Location.Name
        };
    }
    if(place.MatchLevel === 'houseNumber') {
        return {
            type: place.Location.LocationType,
            position: {
                latitude: place.Location.DisplayPosition.Latitude,
                longitude: place.Location.DisplayPosition.Longitude,
            },
            name: place.Address.Label
        };
    }
    //Don't know how to normalize this
    return false;
}

function findLandmark(latitude, longitude, callback) {
    request({
        url: TEMPLATE_URL_LANDMARK.replace('{LAT}', latitude).replace('{LON}', longitude),
        method: 'GET',
        json: true
    }, function(e, r, data){
        if(e){
            return callback(false);
        }
        return callback(
                data &&
                data.Response &&
                data.Response.View &&
                data.Response.View[0] &&
                data.Response.View[0].Result &&
                data.Response.View[0].Result.length > 0 &&
                normalize(data.Response.View[0].Result[0]) //Looks like we've got landmarks nearby, take the first one, normalize it and return it
            );
    });
}

function findAddress(latitude, longitude, callback) {
    request({
        url: TEMPLATE_URL_ADDRESS.replace('{LAT}', latitude).replace('{LON}', longitude),
        method: 'GET',
        json: true
    }, function(e, r, data){
        if(e){
            return callback(false);
        }

        return callback(
                data &&
                data.Response &&
                data.Response.View &&
                data.Response.View[0] &&
                data.Response.View[0].Result &&
                data.Response.View[0].Result.length > 0 &&
                normalize(data.Response.View[0].Result[0]) //Looks like we've got landmarks nearby, take the first one, normalize it and return it
            );
    });
}

function reverseGeocode(latitude, longitude, callback){
    findLandmark(latitude, longitude, function(landmark){
        if(landmark) {
            return callback(landmark);
        }
        findAddress(latitude, longitude, function(place){
            callback(place);
        });
    });
}

module.exports = {
    reverseGeocode: reverseGeocode
};
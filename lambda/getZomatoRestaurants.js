const fetch = require('https');
const zApiKey = "d436351503c1a24f2215626e78067a16";

exports.handler = async (event) => {
    console.log("getZomatoRestaurants");

	var lat = event.latitude;
	var lng = event.longitude;

	const urlBase = 'developers.zomato.com';

	var latitude = "lat=" + lat + "&";
	var longitude = "lon=" + lng;

	var path = "/api/v2.1/geocode?" + latitude + longitude;
	
	var options = {
	    "hostname": urlBase,
	    "path": path,
	    "method": 'GET',
	    "headers": {'Accept': 'application/json', 'user-key': zApiKey}
	};
	
    return new Promise((resolve, reject) => {
        fetch.get(options, (resp) => {
            var data = '';
            resp.on('data', (chunk) => {
                data+=chunk;
            });
            
            resp.on('end', () => {
                data = JSON.parse(data);
                resolve(data);
            });
            
            resp.on('error', (err) => {
                console.error(err);
            });
        });
    });
};

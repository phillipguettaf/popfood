const gApiKey = "AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4";
const fetch = require("https");

exports.handler = async (event, context) => {
    
    var response;
    
    var lat = event.latitude;
	var lng = event.longitude;

	const urlBase = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
	const input = "input=" + event.name + "&inputtype=textquery";
	const fields = "&fields=place_id,name";
	const locationbias = "&locationbias=circle:1000@" + lat + "," + lng;
	const apiKeyURL = "&key=" + gApiKey;
	const url = urlBase + input + fields + fields + locationbias + apiKeyURL;

	
	console.log("About to fetch: " + event.name);
	
	const options = {
	    
	}
	
	return new Promise((resolve, reject) => {
        fetch.get(url, (resp) => {
            var data = '';
            resp.on('data', (chunk) => {
                data+= chunk
            });
            
            resp.on('end', () => {
            	const urlDetailBase = "https://maps.googleapis.com/maps/api/place/details/json?";
            	data = JSON.parse(data);
            	const place_id = "place_id=" + data.candidates[0].place_id;
            	const detailsFields = "&fields=place_id,name,rating,reviews"
            	const detailsURL = urlDetailBase + place_id + detailsFields + apiKeyURL;
        
            	fetch.get(detailsURL, (respo) => {
                    var respData = '';
                    respo.on('data', (chunk) => {
                        respData += chunk;
                    });
                    respo.on('end', () => {
                        var requestBody = event;
                        respData = JSON.parse(respData);
            		    var returnData = { respData, requestBody };
                        console.log(returnData);
            		    resolve(returnData);
                    });
                    
            	    respo.on('error', (err) => {
                		console.error(err);
                	});
                });
            });
            resp.on('error', (err) => {
                console.error(err);
            });
        });
	});
};

const fetch = require("node-fetch");

class apiController {
	
	googleRestaurants(req, res) {

		console.log('API Called for Google-ing restaurants');

		var lat = req.body.latitude;
		var lng = req.body.longitude;
		console.log(lat + ", " + lng + "\n");


		const urlBase = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
		const query = "query=*";
		var location = "&location=" + lat + "," + lng;
		const radius = "&radius=1";
		const type = "&type=restaurant";
		const apiKeyURL = "&key=AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4";

		var url = urlBase + query + location + radius + type + apiKeyURL;

		//page1
	    fetch(url, {
	        method: 'POST',
	        headers: {'Content-Type': 'application/json'}
	    }).then(response => {
	        return response.json();
	    }).then(data => {
	    	res.json(data);
	    }).catch(err => {
	        console.error(err);
	    });
	}

	getZomatoResaurants(req, res) {

		var lat = req.body.latitude;
		var lng = req.body.longitude;

		const urlBase = 'https://developers.zomato.com/api/v2.1/';
		const count = "&count=1";
		const apiKey = 'd436351503c1a24f2215626e78067a16';

		var latitude = "&lat=" + lat;
		var longitude = "&lon=" + lng;

		var response = [];
		
		for (var i =0; i < req.body.restaurants.length; i++) {
			var name = "&query=" + req.body.restaurants[i].name;
			var url = urlBase + name + count + latitude + longitude 
			var restaurant = fetch(url, {
				method: 'GET',
				headers: {'Accept': 'application/json', 'user-key': apiKey}
			}).then(data => {
				response.concat(data);
			});
		}
		return res.json(response);
	}
}

const controller = new apiController();
export default apiController;
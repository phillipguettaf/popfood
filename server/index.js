const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql = require('mysql');
const cors = require("cors");
const fetch = require("node-fetch");
const zApiKey = 'd436351503c1a24f2215626e78067a16';
const gApiKey = "AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4";

// Port for the API server
const serverPort = 8080;

// Use CORS with express
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(cors());
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true
	})
);

app.post("/googleRestaurants", function(req, res) {

	var lat = req.body.latitude;
	var lng = req.body.longitude;

	const urlBase = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
	const input = "input=" + req.body.name + "&inputtype=textquery";
	const fields = "&fields=place_id,name";
	const locationbias = "&locationbias=circle:1000@" + lat + "," + lng;
	const apiKeyURL = "&key=" + gApiKey;
	const url = urlBase + input + fields + fields + locationbias + apiKeyURL;

	//page1
    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).then(data => {
    	const urlDetailBase = "https://maps.googleapis.com/maps/api/place/details/json?";
    	const place_id = "place_id=" + data.candidates[0].place_id;
    	const detailsFields = "&fields=place_id,name,rating,reviews"
    	const detailsURL = urlDetailBase + place_id + detailsFields + apiKeyURL;

    	fetch(detailsURL, {
    		method: 'GET',
    		headers: {'Content-Type': "application/json"}
    	}).then(response => {
    		return response.json();
    	}).then (data => {
    		var requestBody = req.body;
    		var returnData = {data, requestBody};
    		res.json(returnData);
    	}).catch(err => {
    		console.error(err);
    	});
    }).catch(err => {
        console.error(err);
    });


});

app.post("/getZomatoRestaurants", function (req,res) {
	var lat = req.body.latitude;
	var lng = req.body.longitude;

	const urlBase = 'https://developers.zomato.com/api/v2.1/geocode?';

	var latitude = "lat=" + lat + "&";
	var longitude = "lon=" + lng;

	var url = urlBase + latitude + longitude 
	var restaurant = fetch(url, {
		method: 'GET',
		headers: {'Accept': 'application/json', 'user-key': zApiKey}
	}).then(response => {
		return response.json();
	}).then(data => {
		res.json(data);
	}).catch(err => {
		console.error(err);
	});
});

app.post("/getZomatoRestaurantReviews", function(req, res) {
	
	var urlReviewBase = "https://developers.zomato.com/api/v2.1/reviews?";
	
	var restID = "res_id=" + req.body.zRest.id;

	var reviewURL = urlReviewBase + restID;

	fetch(reviewURL, {
		method: 'GET',
		headers: {'Accept': 'application/json', 'user-key': zApiKey}
	}).then(response => {
		return response.json();
	}).then(data => {
		var requestData = req.body;
		var responseData = {requestData, data};
		res.json(responseData);
	}).catch(err => {
		console.error(err);
	});
})

app.post('/getCommentSentiment', function(req,res) {
	var postDoc = {
		"type": PLAIN_TEXT,
		"language": "en",
		"content": req.body.text
	}

	var postData = {
		"document": postDoc,
		"encodingType": UTF16
	};

	var url = "https://language.googleapis.com/v1beta2/documents:analyzeSentiment";


});

// Listen on server port
app.listen(serverPort);
console.log(`[Server] API Server running on port: ${serverPort}.`);



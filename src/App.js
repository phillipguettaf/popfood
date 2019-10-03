import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap.js';
import { apiGET, apiPOST } from './api';
import {BrowserRouter as Router} from 'react-router-dom';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			position: {
				lat: null,
				lng: null,
			},
			restaurants: []
		};

		this.printZRestaurants = this.printZRestaurants.bind(this);
		this.getfromPosition = this.getfromPosition.bind(this);
		this.addRestaurant = this.addRestaurant.bind(this);
		this.getZomatoRestaurants = this.getZomatoRestaurants.bind(this);
		this.getZomatoRestaurantReviews = this.getZomatoRestaurantReviews.bind(this);
		
		this.getfromPosition();

	} 

	componentDidMount() {
		console.log("mount");
	}

	getfromPosition() {
		console.log("Getting location...");
		this.watchId = navigator.geolocation.getCurrentPosition((position) => {
			console.log(position);
			this.setState({
				position: {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				},
				error: null,
			});

			this.getZomatoRestaurants();
		},
		(error) => console.log(error.message),
		{ enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
		);
		console.log("Got Position: " + this.state.position.lat, + ", " + this.state.position.lng);
	}


	getZomatoRestaurants() {
		if (this.state.position.lat && this.state.position.lng) {
		const vZData = {
			latitude: this.state.position.lat,
			longitude: this.state.position.lng
		}
	  	apiPOST('getZomatoRestaurants', vZData, this.printZRestaurants);
		} else {
		console.log("No position");
		}
	}

	getZomatoRestaurantReviews(gR, zR) {
		var zRest = zR.restaurant;
		var gRest = gR.result;
		var newRestaurant = {gRest, zRest};

		apiPOST('getZomatoRestaurantReviews', newRestaurant, (data) => {
			this.addRestaurant(data);
		})
	}

	addRestaurant(data) {
		var zomatoRestaurant = data.requestData.zRest;
		var zReviews = data.data.user_reviews;
		var googleRestaurant = data.requestData.gRest;

		var reviewsArray = googleRestaurant.reviews.concat(zReviews);

		var restaurant = {zomatoRestaurant, googleRestaurant, reviewsArray};

		this.setState({
			restaurants: [...this.state.restaurants, restaurant]
		});

		for (var review of restaurant.reviewsArray) {
			var reviewForSentimentAnalysis;
			if (review.text) {
				reviewForSentimentAnalysis = { text: review.text };
			} else {
				reviewForSentimentAnalysis = { text: review.review_text };
			}
			apiPOST('getCommentSentiment', reviewForSentimentAnalysis, (data) => console.log(data));
		}
	}


	printZRestaurants(data) {
		this.setState({
			zomatoResults: data
		});

		var restaurant;

		for (restaurant of this.state.zomatoResults.nearby_restaurants) {
			var restaurantData = {
				latitude: restaurant.restaurant.location.latitude,
				longitude: restaurant.restaurant.location.longitude,
				name: restaurant.restaurant.name,
				restaurant: restaurant.restaurant
			};
			apiPOST('googleRestaurants', restaurantData, (data) => {
				this.getZomatoRestaurantReviews(data.data, data.requestBody);
			});
			
		}
	}

	calculateAverage(restaurant) {
		var googleRating = restaurant.googleRestaurant.rating;
		var zomatoRating = restaurant.zomatoRestaurant.restaurant.user_rating.aggregate_rating;
		var averageRating = (googleRating + zomatoRating) / 2;



	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId);
	}



	render() {
		return (
			<div className="App">
				<Router>
					<GoogleMap 
						position={this.state.position} 
						zomatoRestaurants={this.state.zomatoResults} 
						googleRestaurants={this.state.googleRestaurants}
					/>
				</Router>
			</div>
		);
	}
}

export default App;
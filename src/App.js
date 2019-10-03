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
			restaurants: [],
			sentiments: []
		};

		this.addSentiments = this.addSentiments.bind(this);
		this.zomatoCallback = this.zomatoCallback.bind(this);
		this.getfromPosition = this.getfromPosition.bind(this);
		this.addRestaurant = this.addRestaurant.bind(this);
		this.getZomatoRestaurants = this.getZomatoRestaurants.bind(this);
		this.getZomatoRestaurantReviews = this.getZomatoRestaurantReviews.bind(this);
		
		this.getfromPosition();

	} 

	componentDidMount() {
		
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
		(error) => console.error(error.message),
		{ enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
		);
	}


	getZomatoRestaurants() {
		if (this.state.position.lat && this.state.position.lng) {
		const vZData = {
			latitude: this.state.position.lat,
			longitude: this.state.position.lng
		}
	  	apiPOST('getZomatoRestaurants', vZData, this.zomatoCallback);
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
		
		var reviewForSentimentAnalysis = {
			text: ""
		};

		for (var review of reviewsArray) {
			
			if (review.text) {
				reviewForSentimentAnalysis = { text: reviewForSentimentAnalysis.text + ". " + review.text };
			} else {
				reviewForSentimentAnalysis = { text: reviewForSentimentAnalysis.text + ". " + review.review_text };
			}
		}

		console.log(reviewForSentimentAnalysis);

		apiPOST('getCommentSentiment', reviewForSentimentAnalysis, (data) => this.addSentiments(data, restaurant));
	}

	addSentiments(data, restaurant) {
		var reviews = restaurant.reviewsArray;
		var googleInfo = restaurant.googleRestaurant;
		var zomatoInfo = restaurant.zomatoRestaurant;
		var sentiment = data.documentSentiment;

		var newRestaurant = {googleInfo, zomatoInfo, reviews, sentiment};

		this.setState({
			restaurants: [...this.state.restaurants, newRestaurant]
		});
		console.log(this.state.restaurants);
	}


	zomatoCallback(data) {
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
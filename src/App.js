import React, { Component } from 'react';
import './App.css';
import GoogleMap from './GoogleMap.js';
import { apiPOST } from './api';
import {BrowserRouter as Router} from 'react-router-dom';
import SideDrawer from './SideDrawer.js';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			position: {
				lat: null,
				lng: null,
			},
			restaurants: [],
			popularRestaurants: []
		};

		this.addSentiments = this.addSentiments.bind(this);
		this.zomatoCallback = this.zomatoCallback.bind(this);
		this.getfromPosition = this.getfromPosition.bind(this);
		this.addRestaurant = this.addRestaurant.bind(this);
		this.getZomatoRestaurants = this.getZomatoRestaurants.bind(this);
		this.getZomatoRestaurantReviews = this.getZomatoRestaurantReviews.bind(this);
		this.calculateAverage = this.calculateAverage.bind(this);
		this.recentreAt = this.recentreAt.bind(this);
		
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
				centre: {
					lat: position.coords.latitude,
					lng: position.coords.latitude
				},
				error: null,
			});

			this.getZomatoRestaurants();
			this.getCloudRestaurants();
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

	zomatoCallback(data) {
		var restaurant;
		for (restaurant of data.nearby_restaurants) {
			var restaurantData = {
				latitude: restaurant.restaurant.location.latitude,
				longitude: restaurant.restaurant.location.longitude,
				name: restaurant.restaurant.name,
				restaurant: restaurant.restaurant
			};
			apiPOST('googleRestaurants', restaurantData, (data) => {
				console.log(data);
				this.getZomatoRestaurantReviews(data.respData, data.requestBody);
			});
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
			} else if (review.review_text) {
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
		var averageRating = this.calculateAverage(newRestaurant);

		var newRestaurantWithRating = {googleInfo, zomatoInfo, reviews, sentiment, averageRating};


		this.setState({
			restaurants: [...this.state.restaurants, newRestaurantWithRating]
		});

		var cloudRest = {
			zomatoID: newRestaurantWithRating.zomatoInfo.id,
			aveRating: newRestaurantWithRating.averageRating,
			info: newRestaurantWithRating
		};

		apiPOST('saveRest', cloudRest, (data) => {console.log("Saved restaurant " + cloudRest.info.googleInfo.name + "to cloud")});

	}

	calculateAverage(restaurant) {
		var googleRating = restaurant.googleInfo.rating;
		var zomatoRating = parseFloat(restaurant.zomatoInfo.user_rating.aggregate_rating);
		var sentimentRating = ((restaurant.sentiment.score + 1) / 2) * 5;

		var averageRating = (googleRating + zomatoRating + sentimentRating) / 3;
		averageRating = +(Math.round(averageRating + "e+2")  + "e-2");
		return averageRating;
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId);
	}

	compareRestaurants(restA, restB) {
		var aRating = restA.averageRating;
		var bRating = restB.averageRating;
		if (aRating < bRating) {
			return 1;
		} else if (aRating > bRating) {
			return -1;
		}
		return 0;
	}

	recentreAt(rest) {
		this.setState({
			centre: {
				lat: rest.zomatoInfo.location.latitude,
				lng: rest.zomatoInfo.location.longitude
			}
		});
	}

	getCloudRestaurants() {
		console.log("Getting popular restaurants from cloud:");

		apiGET('getDynamoRestaurants', (data) => {
			console.log(this.state.popularRestaurants);
			this.setState({popularRestaurants: data});
		});
	}

	render() {
		return (
			<div className="App">
				<Router>
					<SideDrawer 
						recentreAt={this.recentreAt}
						nearbyrest={this.state.restaurants.sort(this.compareRestaurants)}
						popularRestaurants={this.state.popularRestaurants}
					/>
					<GoogleMap 
						position={this.state.centre} 
						restaurants={this.state.restaurants}
						popularRestaurants = {this.state.popularRestaurants}
					/>
				</Router>
			</div>
		);
	}
}

export default App;
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class GoogleMap extends Component {

	displayZomatoRestaurants = () => {
		if (this.props.zomatoRestaurants) {
			return this.props.zomatoRestaurants.nearby_restaurants.map((rest, index) => {
				return <Marker key={index*2+1} id={index*2+1} position={{
					lat: rest.restaurant.location.latitude,
					lng: rest.restaurant.location.longitude
				}}
				onClick={() => console.log("You clicked " + rest.restaurant.name + ": from Zomato.")} />
			});
		}
	}

	displayGoogleRestaurants = () => {
		if (this.props.googleRestaurants) {
			return this.props.googleRestaurants.map((rest, index) => {
				return <Marker key={index*2} id={index*2} position={{
					lat: rest.geometry.location.lat,
					lng: rest.geometry.location.lng
				}}
				onClick={()=> console.log("You clicked " + rest.name + ": from Google.")} />
			});
		}
	}
	
	render() {

		return (
			<Map
				google={this.props.google}
				zoom={17}
				initialCenter = {this.props.position}
				center = {this.props.position}
			>
				{this.displayZomatoRestaurants()}
				{this.displayGoogleRestaurants()}
				
			</Map>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4'
}) (GoogleMap);
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import './Map.css';

class GoogleMap extends Component {

	displayRestaurants = () => {
		if (this.props.restaurants) {
			return this.props.restaurants.map((rest, index) => {
				return <Marker key={index} id={index} position={{
					lat: rest.zomatoInfo.location.latitude,
					lng: rest.zomatoInfo.location.longitude
				}}
				onClick={() => console.log("You clicked " + rest.zomatoInfo.name)} />
			});
		}
	}
	
	render() {

		return (
			<Map 
				className="map"
				google={this.props.google}
				zoom={17}
				initialCenter = {this.props.position}
				center = {this.props.position}

			>
				{this.displayRestaurants()}
			</Map>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4'
}) (GoogleMap);
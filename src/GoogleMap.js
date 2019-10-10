import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import './Map.css';

class GoogleMap extends Component {

	state = {
		activeMarker: this.props.activeMarker
	};

	displayRestaurants = () => {
		if (this.props.restaurants) {
			return this.props.restaurants.map((rest, index) => {
				return <Marker 
					key={index} 
					id={rest.zomatoInfo.id} 
					position={{
						lat: rest.zomatoInfo.location.latitude,
						lng: rest.zomatoInfo.location.longitude
					}}
					rest={rest}
					onClick={this.selectRestaurant}
					title={rest.zomatoInfo.address}
					name={rest.zomatoInfo.name} />
			});
		}
	}
	
	selectRestaurant = (props, marker, e) => {
		this.props.selectRestaurant(props, marker, e);
	}

	onMapClicked = (props) => {
		if (this.props.showingInfoWindow) {
			this.props.onMapClicked(props);
		}
	}
	//
	render() {

		return (
			<Map 
				google={this.props.google}
				zoom={17}
				initialCenter = {this.props.position}
				center = {this.props.position}
				onClick={this.onMapClicked}
			>
				
				{this.displayRestaurants()}
				<InfoWindow
					marker={this.props.activeMarker}
					visible={this.props.showingInfoWindow}>
					<div>
						<h1>{this.props.selectedPlace.googleInfo.name}</h1>
						<p>Rating: {this.props.selectedPlace.averageRating} / 5</p>
						<p>{this.props.selectedPlace.zomatoInfo.location.address}</p>
					</div>
				</InfoWindow>
			</Map>
		);
	}
}
export default GoogleApiWrapper({
	apiKey: 'AIzaSyAjDXZHujgWXP2CP27sTJ3uy1J1BrFzEW4'
}) (GoogleMap);
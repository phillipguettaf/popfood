import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import "./SideDrawer.css"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

class SideDrawer extends Component {

	
	displayNearbyRestaurants = () => {
		if (this.props.nearbyrest) {
		
			return(
				this.props.nearbyrest.map((rest, index) => 
					<ListItem button onClick={this.recentreAt(rest)} key={rest.zomatoInfo.id}>
						<ListItemText
							primary={rest.googleInfo.name}
							secondary={rest.averageRating}
						/>
					</ListItem>
				)
			)
		}
	}

	recentreAt = (rest) => {
		this.props.recentreAt(rest);
	}

	render() {	
		return( 
			<Drawer 
				className="drawer"
				classes={{
					paper: "drawerPaper"
				}}
				variant="permanent"
				anchor="left"
			>
				<List>
				<ListItem>
				<ListItemText
					primary="Nearby Popular Restaurants"
				/>
				</ListItem>
					{this.displayNearbyRestaurants()}
				</List>
			</Drawer>
		);
	}
}
export default SideDrawer;

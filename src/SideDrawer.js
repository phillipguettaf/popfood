import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import "./SideDrawer.css"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class SideDrawer extends Component {

	
	displayNearbyRestaurants = () => {
		if (this.props.nearbyrest) {
		
			return(
				this.props.nearbyrest.map((rest, index) => 
					<ListItem key = {rest.zomatoInfo.id}>
						<Button>
						<ListItemText
							primary={rest.googleInfo.name}
							secondary={rest.averageRating}
						/>
						</Button>
					</ListItem>
				)
			)
		}
	}

	displayPopularRestaurants = () => {
		return({

		});
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

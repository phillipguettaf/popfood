import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import "./SideDrawer.css"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

class SideDrawer extends Component {

	displayRestaurants = (restaurants) => {
		if (restaurants) {
		
			return(
				restaurants.map((rest, index) => 
					<ListItem 
						button onClick={() => this.clickRestaurant(rest, index)} 
						key={rest.zomatoInfo.id}
						selected={this.props.selectedRest.zomatoInfo.id===rest.zomatoInfo.id} 
					>
						<ListItemText
							primary={rest.googleInfo.name}
							secondary={rest.averageRating}
						/>
					</ListItem>
				)
			)
		}
	}

	clickRestaurant = (rest)  => {
		this.props.clickRestaurant(rest)
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
				<List
					subheader={<ListSubheader style={{"backgroundColor":"white"}}>
						Nearby Popular Restaurants<Divider />
					</ListSubheader>}
				>	
					{this.displayRestaurants(this.props.nearbyrest)}
				</List>
				<Divider />
				<List
					subheader={<ListSubheader style={{"backgroundColor":"white"}}>
						All Time Popular Restaurants<Divider />
					</ListSubheader>}
				>	
					{this.displayRestaurants(this.props.popularRestaurants)}
				</List>

			</Drawer>
		);
	}
}
export default SideDrawer;

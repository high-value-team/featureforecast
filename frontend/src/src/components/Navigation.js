import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
<<<<<<< Updated upstream
import { Link } from 'react-router';
=======
import {Link} from 'react-router';
>>>>>>> Stashed changes

const styles = theme => ({
    root: {
     width: '100%',
    },
    flex: {
        flex: '1',
    },
    menuButton: {
        marginLeft: '-12',
        marginRight: '20',
    },
});

function Navigation ({title, classes}) {
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography type="display1" color="inherit" className={classes.flex}>
<<<<<<< Updated upstream
                        <Link to={"/"} style={{color:"white", textDecoration: "none" }}>FeatureForecast</Link> {title}
=======
                        <Link to={"/"}>{title}</Link>
>>>>>>> Stashed changes
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

Navigation.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);


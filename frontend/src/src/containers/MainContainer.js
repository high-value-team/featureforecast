import React  from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import {NODE_ENV, API_ROOT} from "../Config";

import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import * as boxActionCreators from "../Redux";

const styles = theme => ({
    container: {
        fontFamily: 'Roboto, sans-serif',
        width: '100%',
    },
    innerContainer: {
        maxWidth: '900px',
        margin: '0px auto',
    },
});

class MainContainer extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        loadVersion: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
        children: PropTypes.node,
    };

    componentDidMount() {
        this.props.loadVersion();
    }

    constructor(props) {
        super(props);
        console.log(`NODE_ENV:${NODE_ENV}`);
        console.log(`API_ROOT:${API_ROOT}`);
    }

    pad(n) {
        return String("00" + n).slice(-2);
    }

    formatVersion(version) {
        if (!version) {
            return 'Backend not available!';
        }
        const v = JSON.parse(version);
        const date = new Date(v.timestamp);
        return `Backend version: ${v.number}, ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
    }

    render () {
        const { classes } = this.props;
        const title = `${this.props.name.length === 0 ? '' : ' - ' + this.props.name}`;
        return (
            <div className={classes.container}>
                <Navigation title={title}/>
                <div className={classes.innerContainer}>
                    {this.props.children}
                    <div style={{display:'flex', color: '#0000008a', fontSize:'10px',}}>
                        <p style={{flexGrow: '1'}}>{this.formatVersion(this.props.version)} - Brought to you by <a href="http://high-value-team.de" target="_blank" rel="noopener noreferrer">high-value-team.de</a></p>
                        <p><Link to="/imprint">imprint and data privacy policy</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {version: state.project.version, name: state.project.name};
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(boxActionCreators, dispatch);
}

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainContainer));

export const MainContainerUnwrapped = MainContainer;




import React  from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import {NODE_ENV, API_ROOT} from "../Config";

import { withStyles } from 'material-ui/styles';
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import * as boxActionCreators from "../redux/project";

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
        version: PropTypes.string.isRequired,
        children: PropTypes.node,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
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
        return `version: ${v.number} time: ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
    }

    render () {
        const { classes } = this.props;
        const title = `FeatureForecast ${this.props.name.length === 0 ? '' : ' - ' + this.props.name}`;
        return (
            <div className={classes.container}>
                <Navigation title={title}/>
                <div className={classes.innerContainer}>
                    {this.props.children}
                    <p style={{color: '#0000008a', fontSize:'10px',}}>{this.formatVersion(this.props.version)}</p>
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




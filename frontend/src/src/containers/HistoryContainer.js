import React from 'react';
import HistoryPage from '../components/HistoryPage';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as boxActionCreators from '../redux/project';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

class HistoryContainer extends React.Component {

    static propTypes = {
        generateForecastQueryAndRedirect: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        historicalData: PropTypes.array.isRequired,
        tags: PropTypes.array.isRequired,
        expirationDate: PropTypes.string.isRequired,
        features: PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.loadHistory(this.props.projectID);
    }

    render () {
        return (
            <div>
                <Typography type="headline" color="inherit" style={{fontWeight:'bold', margin:'15px', marginLeft: '20px', color:'#0000008a'}}>
                    History
                </Typography>
                <HistoryPage {...this.props} />
            </div>
        );
    }
}

function mapStateToProps (state, props) {
    return {
        projectID: props.router.params.projectID,
        name: state.project.name,
        email: state.project.email,
        historicalData: state.project.historicalData,
        tags: state.project.tags,
        expirationDate: state.project.expirationDate,
        features: state.project.features,
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(boxActionCreators, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HistoryContainer);


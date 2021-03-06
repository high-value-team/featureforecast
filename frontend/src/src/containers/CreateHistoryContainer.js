import React from 'react';
import CreateHistoryPage from '../components/CreateHistoryPage';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as boxActionCreators from '../Redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

class CreateHistoryContainer extends React.Component {

    static propTypes = {
        submitHistory: PropTypes.func.isRequired,
    };

    render () {
        return (
            <div>
                <Typography type="headline" color="inherit" style={{fontWeight:'bold', margin:'15px', marginLeft: '20px', color:'#0000008a'}}>
                    Create History
                </Typography>
                <CreateHistoryPage submitHistory={this.props.submitHistory} />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return state;
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(boxActionCreators, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateHistoryContainer);


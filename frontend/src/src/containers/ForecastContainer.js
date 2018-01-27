import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as boxActionCreators from '../redux/project';
import PropTypes from 'prop-types';

import {withStyles} from "material-ui/styles/index";
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { Chart } from 'react-google-charts';

const styles = theme => ({
    root: {
        fontFamily: 'Roboto, sans-serif',
        width: '100%',
    },
    paper: {
        paddingTop: '10px',
        paddingLeft: '30px',
        paddingBottom: '30px',
    },
    orderedList: {
        // listStyleType: 'none',
        // padding: '10px',
        color: '#0000008a',
        listStylePosition: 'inside',
        marginLeft: '0px',
        paddingLeft: '0px',
        // padding: '0px'
    },
    listItem: {
        paddingBottom: '15px',
    },
});

class ForecastContainer extends React.Component {

    static propTypes = {
        router: PropTypes.object.isRequired,
        calculateForecast: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
        goBackAndReset: PropTypes.func.isRequired,

        projectID: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        features: PropTypes.array.isRequired,
        distribution: PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.onBack = this.onBack.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        this.props.calculateForecast(this.props.projectID, this.props.features);
    }

    onBack() {
        this.props.goBack();
    }

    onReset() {
        this.props.goBackAndReset();
    }

    render() {

        const { classes } = this.props;
        const chartData = this.props.distribution && this.props.distribution.map((d) => {
            return [d.cummulatedProbability, d.prognosis, d.count];
        });
        const data = [
            ['Probability', 'Prognosis', {role: 'annotation'}],
            ...chartData];
            // ...this.props.distribution];
        console.log(`data:${JSON.stringify(data, null, 2)}`);

        return (
            <div className={classes.root}>
                <Typography type="headline" color="inherit" style={{fontWeight:'bold', margin:'15px', marginLeft: '20px', color:'#0000008a'}}>
                    Project Created
                </Typography>
                <Paper className={classes.paper} elevation={4}>
                    <Typography type="title" style={{color: '#0000008a', marginTop: '30px', marginRight: '10px'}}>
                        History: {this.props.name}
                    </Typography>
                    <Typography type="title" style={{color: '#0000008a', marginTop: '30px', marginBottom: '0px', marginRight: '10px'}}>
                        Features
                    </Typography>

                    <ol className={classes.orderedList}>
                        {this.props.features.map( (feature, index) => {
                            return <li key={`feature-${index}`} className={classes.listItem}>quantity:{feature.quantity} tags:{JSON.stringify(feature.tags)}</li>
                        })}
                    </ol>

                    <Chart
                        chartType="BarChart"
                        data={data}
                        options={{
                            title: 'Feature Forecast',
                            chartArea: {width: '60%'},
                            orientation: 'horizontal',
                            legend: {position: 'none'},
                            colors: ['#b0120a', '#ffab91'],
                            hAxis: {
                                title: 'Probability',
                                minValue: 0
                            },
                            vAxis: {
                                title: 'Prognosis',
                            }
                        }}
                        graph_id="BarChart"
                        width="100%"
                        height="400px"
                        legend_toggle
                    />

                    <div style={{marginTop:'50px'}}>
                        <Button raised={true} color="primary" onClick={this.onBack}>
                            Back
                        </Button>
                        <Button raised={true} color="primary" style={{marginLeft:'20px'}} onClick={this.onReset}>
                            Reset
                        </Button>
                    </div>

                </Paper>
            </div>
        );
    }
}

function mapStateToProps (state, props) {
    // console.log(`router:${JSON.stringify(props.router, null, 2)}`);
    const features = JSON.parse(props.router.location.query.features);
    // console.log(`features:${JSON.stringify(features, null, 2)}`);
    return {
        projectID: props.router.params.projectID,
        name: state.project.name,
        features: features,
        distribution: state.project.distribution,
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(boxActionCreators, dispatch);
}

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForecastContainer));



import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from "material-ui/styles/index";
import { Chart } from 'react-google-charts';

const styles = theme => ({
    root: {
        fontFamily: 'Roboto, sans-serif',
        width: '100%',
    },
});

class ForecastChartCount extends React.Component {

    static propTypes = {
        distribution: PropTypes.array.isRequired,
    };

    render() {

        var chartData = [];
        if (this.props.distribution) {
            chartData = this.props.distribution.map((d) => {
                return [d.cummulatedProbability, d.count, d.prognosis];
            });
        }

        const data = [['Probability', 'Count', {role: 'annotation'}], ...chartData];

        return (
            <Chart
                chartType="BarChart"
                data={data}
                options={{
                    title: 'Feature Forecast / Frequencies',
                    chartArea: {width: '80%'},
                    orientation: 'horizontal',
                    legend: {position: 'none'},
                    colors: ['#b0120a', '#ffab91'],
                    bar: {
                        groupWidth: '95%'
                    },
                    hAxis: {
                        title: 'Probability',
                        minValue: 0,
                        viewWindow: {
                            min: 0.5,
                            max: 1.0
                        },
                        ticks: [0.5, 0.67, 0.75, 0.9, 1.0]
                    },
                    vAxis: {
                        title: 'Count',
                    }
                }}
                graph_id="BarChart"
                width="100%"
                height="400px"
                legend_toggle
            />
        );
    }
}

export default withStyles(styles)(ForecastChartCount);



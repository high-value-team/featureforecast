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

class ForecastChartPrognosis extends React.Component {

    static propTypes = {
        distribution: PropTypes.array.isRequired,
    };

    render() {

        var chartData = [];
        if (this.props.distribution) {
            chartData = this.props.distribution.map((d) => {
                return [d.cummulatedProbability, d.prognosis];
            });
        }

        const data = [['Probability', 'Prognosis'], ...chartData];

        return (
            <Chart
                chartType="LineChart"
                data={data}
                options={{
                    title: 'Feature Forecast / Prognoses',
                    chartArea: {width: '80%'},
                    orientation: 'horizontal',
                    legend: {position: 'none'},
                    colors: ['#b0120a', '#ffab91'],
                    hAxis: {
                        title: 'Probability',
                        minValue: 0,
                        viewWindow: {
                            min: 0.5,
                            max: 1.0
                        },
                        ticks: [0.5, 0.67, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
                    },
                    vAxis: {
                        title: 'Prognosis',
                    }
                }}
                graph_id="LineChart"
                width="100%"
                height="400px"
                legend_toggle
            />
        );
    }
}

export default withStyles(styles)(ForecastChartPrognosis);



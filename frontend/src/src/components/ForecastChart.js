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

class ForecastChart extends React.Component {

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
        // console.log(`data:${JSON.stringify(data, null, 2)}`);

        return (
            <Chart
                chartType="BarChart"
                data={data}
                options={{
                    title: 'Feature Forecast',
                    chartArea: {width: '60%'},
                    orientation: 'horizontal',
                    legend: {position: 'none'},
                    colors: ['#b0120a', '#ffab91'],
                    bar: {groupWidth: "95%"},
                    hAxis: {
                        title: 'Probability',
                        minValue: 0
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

export default withStyles(styles)(ForecastChart);



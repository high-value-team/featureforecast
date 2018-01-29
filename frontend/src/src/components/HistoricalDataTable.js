import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
    root: {
        fontFamily: 'Roboto, sans-serif',
        color: '#0000008a',
        // width: '100%',
    },
});

class HistoricalDataTable extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
    };

    render() {
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Value</TableCell>
                            <TableCell>Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map( (n, i) => {
                            return (
                                <TableRow key={`row-${i}`}>
                                    <TableCell>{n.value}</TableCell>
                                    <TableCell>{n.tags.join(',')}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default withStyles(styles)(HistoricalDataTable);

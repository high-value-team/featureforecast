import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { FormControl, FormHelperText } from 'material-ui/Form';
import RemoveIcon from 'material-ui-icons/Remove';
import AddIcon from 'material-ui-icons/Add';

const styles = theme => ({
    root: {
        fontFamily: 'Roboto, sans-serif',
        color: '#0000008a',
        // width: '100%',
    },
    paper: {
        paddingTop: '10px',
        paddingLeft: '30px',
        paddingBottom: '30px',
        paddingRight: '50px',
    },
    container: {
    },
    title: {
        // margin: theme.spacing.unit,
    },
    submitButton: {
        marginTop: '50px',
        // marginLeft: theme.spacing.unit,
        // marginTop: theme.spacing.unit * 3,
    },
    headline: {
        // margin: '8px',
        // marginTop: '50px',
        // color: '#0000008a',
    },
    orderedList: {
        listStyleType: 'none',
        padding: '0px',
    },
    row: {
        display: 'flex',
    },
    col: {
    },
    buttonWrap: {
        position: 'relative',
    },
    button: {
        position: 'absolute',
        bottom: '15px',
        left: '0',
    },
});

class HistoryPage extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        generateForecastQueryAndRedirect: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        historicalData: PropTypes.array.isRequired,
        expirationDate: PropTypes.string.isRequired,
        features: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        const features = props.features.length === 0 ? [] : props.features.map((feature) => {
            return {
                quantity: `${feature.quantity}`,
                tags: feature.tags.join(','),
            };
        });
        this.state = {
            features: features,
            newFeatureTags: '',
            newFeatureQuantity: '',
            featuresError: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.addFeature = this.addFeature.bind(this);
        this.removeFeature = this.removeFeature.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.newFeatureHandleKeyPress = this.newFeatureHandleKeyPress.bind(this);
    }

    onSubmit () {
        if (this.validate()) {
            const features = this.state.features.map((feature, index) => {
                return {
                    quantity: parseFloat(feature.quantity.replace(',','.')),
                    tags: feature.tags.split(/\s*;\s*|\s*,\s*/).filter(Boolean),
                };
            });
            this.props.generateForecastQueryAndRedirect(this.props.projectID, features);
        }
    }

    validate () {
        let isValid = true;

        // features
        if (this.state.features.length === 0 ) {
            this.setState({featuresError : 'invalid features data'});
            isValid = false;
        } else {
            this.setState({featuresError : null});
        }

        return isValid;
    }

    addFeature () {
        if (this.state.newFeatureTags.length === 0 || this.state.newFeatureQuantity.length === 0) {
            return;
        }

        var newFeature = {
            tags: this.state.newFeatureTags,
            quantity: this.state.newFeatureQuantity,
        };

        const features = [...this.state.features, newFeature];

        this.setState({
            features: features,
            newFeatureTags: '',
            newFeatureQuantity: '',
        });
    }

    removeFeature (index) {
        const features = this.state.features;
        features.splice(index, 1);
        this.setState({features: features});
    }

    updateQuantity (event, index) {
        const quantity = event.target.value;
        const features = this.state.features.map( (feature, idx) => {
            if (idx === index) {
                feature = {tags: feature.tags, quantity: quantity};
            }
            return feature;
        });
        this.setState({features: features});
    }

    updateTags (event, index) {
        const tags = event.target.value;
        const features = this.state.features.map( (feature, idx) => {
            if (idx === index) {
                feature = {tags: tags, quantity: feature.quantity};
            }
            return feature;
        });
        this.setState({features: features});
    }

    newFeatureHandleKeyPress (e) {
        if (e.key === 'Enter') {
            this.addFeature();
        }
    }

    render() {

        const { classes } = this.props;
        // const state = this.state;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper} elevation={4}>
                    <Typography type="title" style={{color: '#0000008a', marginTop: '30px', marginRight: '10px'}}>
                        History: {this.props.name}
                    </Typography>
                    <Typography type="title" style={{color: '#0000008a', marginTop: '10px', marginBottom: '20px', marginRight: '10px'}}>
                        Expiration Date: {this.props.expirationDate}
                    </Typography>


                    <Typography type="title" color="inherit" style={{fontWeight: 'bold', marginTop:'40px', color:'#0000008a'}}>
                        Features to forecast:
                    </Typography>

                    <ol className={classes.orderedList}>
                        {this.state.features.map( (feature, index) => {
                            return <li key={index}>
                                <div className={classes.row}>
                                    <TextField
                                        label=""
                                        style={{width: '350px'}}
                                        value={feature.tags}
                                        onChange={(e) => this.updateTags(e, index)}
                                        margin="normal"
                                        type="text"
                                    />
                                    <TextField
                                        label=""
                                        style={{width: '150px', marginLeft:'10px'}}
                                        value={feature.quantity}
                                        onChange={(e) => this.updateQuantity(e, index)}
                                        margin="normal"
                                        type="text"
                                    />
                                    <div className={[classes.buttonWrap, classes.col].join(' ')}>
                                        <RemoveIcon className={classes.button} onClick={() => this.removeFeature(index)}/>
                                    </div>
                                </div>
                            </li>
                        })}
                        <li key={"newItem"}>
                            <div className={classes.row}>
                                <FormControl error aria-describedby="features-error-text">
                                    <TextField
                                        label="tags"
                                        style={{width: '350px'}}
                                        value={this.state.newFeatureTags}
                                        onChange={(e)=> this.setState({newFeatureTags: e.target.value})}
                                        margin="normal"
                                        type="text"
                                    />
                                    {this.state.featuresError ? <FormHelperText id="features-error-text" style={{marginTop:'0px'}}>{this.state.featuresError}</FormHelperText> : null }
                                </FormControl>
                                <TextField
                                    label="quantity"
                                    style={{width: '150px',marginLeft:'10px'}}
                                    value={this.state.newFeatureQuantity}
                                    onChange={(e)=> this.setState({newFeatureQuantity: e.target.value})}
                                    margin="normal"
                                    type="text"
                                    onKeyPress={this.newFeatureHandleKeyPress}
                                />
                                <div className={[classes.buttonWrap, classes.col].join(' ')}>
                                    <AddIcon className={classes.button} onClick={this.addFeature}/>
                                </div>
                            </div>
                        </li>
                    </ol>

                    <div>
                        <Button raised={true} color="primary" className={classes.submitButton} onClick={this.onSubmit}>
                            Historical data:
                        </Button>
                    </div>

                    <Typography type="title" color="inherit" style={{fontWeight: 'bold', marginTop:'40px', color:'#0000008a'}}>
                        Features to forecast:
                    </Typography>

                    <Typography type="title" style={{color: '#0000008a', marginTop: '30px', marginRight: '10px'}}>
                        {this.props.historicalData.length} data points
                    </Typography>

                    <div>
                        {JSON.stringify(this.props.historicalData, null, 2)}
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(HistoryPage);

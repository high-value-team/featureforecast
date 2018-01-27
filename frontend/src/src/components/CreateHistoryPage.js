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

import Validator from 'validator';

// import ItemList from './ItemList';

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
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        width: '250px'
    },
    textFieldBig: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        // width: '90%',
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

class CreateHistoryPage extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        submitHistory: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            titleError: null,
            email: '',
            emailError: null,

            historicalDataBatch: '',
            historicalDataItems: [],
            newItemValue: '',
            newItemTags: '',
            historicalDataError: null,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
        this.transformHistoricalDataItems = this.transformHistoricalDataItems.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.updateTags = this.updateTags.bind(this);
    }

    onSubmit () {
        if (this.validate()) {
            const historicaldata = this.transformHistoricalDataItems(this.state.historicalDataItems);
            this.props.submitHistory({
                name: this.state.title,
                email: this.state.email,
                historicaldata: historicaldata,
                historicaldatatoparse: this.state.historicalDataBatch,
            });
        }
    }

    transformHistoricalDataItems(items) {
        return items.map((item) => {
            return {
                value: parseFloat(item.value).toFixed(1),
                tags: item.tags.split(','),
            };
        });
    }

    validate () {
        let isValid = true;

        // title
        if (this.state.title.length === 0 ) {
            this.setState({titleError : 'invalid title'});
            isValid = false;
        } else {
            this.setState({titleError : null});
        }

        // email
        if (!Validator.isEmail(this.state.email)) {
            this.setState({emailError : 'invalid email'});
            isValid = false;
        } else {
            this.setState({emailError : null});
        }

        // items
        if (this.state.historicalDataItems.length === 0 && this.state.historicalDataBatch.length === 0) {
            this.setState({historicalDataError : 'invalid historical data'});
            isValid = false;
        } else {
            this.setState({historicalDataError : null});
        }

        return isValid;
    }

    onTextFieldChange (event) {
        // console.log(event.target.id);
        switch (event.target.id) {
            case 'title':
                this.setState({title : event.target.value});
                break;
            case 'email':
                this.setState({email : event.target.value});
                break;
            default:
                break;
        }
    }

    addItem () {
        if (this.state.newItemValue.length === 0 || this.state.newItemTags.length === 0) {
            return;
        }

        var newItem = {
            value: this.state.newItemValue,
            tags: this.state.newItemTags,
        };

        const items = [...this.state.historicalDataItems, newItem];

        this.setState({
            historicalDataItems: items,
            newItemValue: '',
            newItemTags: '',
        });
    }

    removeItem (index) {
        const items = this.state.historicalDataItems;
        items.splice(index, 1);
        this.setState({historicalDataItems: items});
    }

    updateValue (event, index) {
        const value = event.target.value;
        const items = this.state.historicalDataItems.map( (item, idx) => {
            if (idx === index) {
                item = {value: value, tags: item.tags};
            }
            return item;
        });
        this.setState({historicalDataItems: items});
    }

    updateTags (event, index) {
        const tags = event.target.value;
        const items = this.state.historicalDataItems.map( (item, idx) => {
            if (idx === index) {
                item = {value: item.value, tags: tags};
            }
            return item;
        });
        this.setState({historicalDataItems: items});
    }

    render() {

        const { classes } = this.props;
        const state = this.state;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper} elevation={4}>
                    <div>
                        <FormControl error aria-describedby="title-error-text">
                            <TextField
                                error={this.state.titleError ? true : false}
                                id="title"
                                label="Project Title"
                                className={classes.textField}
                                value={state.title}
                                onChange={this.onTextFieldChange}
                                margin="normal"
                                type="title"
                            />
                            {this.state.titleError ? <FormHelperText id="title-error-text" style={{marginTop:'0px'}}>{this.state.titleError}</FormHelperText> : null }
                        </FormControl>
                    </div>

                    <div>
                        <FormControl error aria-describedby="email-error-text">
                            <TextField
                                id="email"
                                label="Your Email"
                                className={classes.textField}
                                value={state.email}
                                onChange={this.onTextFieldChange}
                                margin="normal"
                                type="email"
                            />
                            {this.state.emailError ? <FormHelperText id="email-error-text" style={{marginTop:'0px'}}>{this.state.emailError}</FormHelperText> : null }
                        </FormControl>
                    </div>

                    <Typography type="title" color="inherit" style={{fontWeight: 'bold', marginTop:'40px', color:'#0000008a'}}>
                        Historical Data
                    </Typography>


                    <ol className={classes.orderedList}>
                        {this.state.historicalDataItems.map( (item, index) => {
                            return <li key={index}>
                                <div className={classes.row}>
                                    <TextField
                                        // id={item.id}
                                        label=""
                                        className={classes.textField}
                                        value={item.value}
                                        onChange={(e) => this.updateValue(e, index)}
                                        margin="normal"
                                        type="text"
                                    />
                                    <TextField
                                        // id={item.id}
                                        label=""
                                        className={classes.textField}
                                        value={item.tags}
                                        onChange={(e) => this.updateTags(e, index)}
                                        margin="normal"
                                        type="text"
                                        style={{marginLeft:'10px'}}
                                    />
                                    <div className={[classes.buttonWrap, classes.col].join(' ')}>
                                        <RemoveIcon className={classes.button} onClick={() => this.removeItem(index)}/>
                                    </div>
                                </div>
                            </li>
                        })}
                        <li key={"newItem"}>
                            <div className={classes.row}>
                                <TextField
                                    label="value"
                                    className={classes.textField}
                                    value={this.state.newItemValue}
                                    onChange={(e)=> this.setState({newItemValue: e.target.value})}
                                    margin="normal"
                                    type="text"
                                />
                                <TextField
                                    label="tags"
                                    className={classes.textField}
                                    value={this.state.newItemTags}
                                    onChange={(e)=> this.setState({newItemTags: e.target.value})}
                                    margin="normal"
                                    type="text"
                                    style={{marginLeft:'10px'}}
                                />
                                <div className={[classes.buttonWrap, classes.col].join(' ')}>
                                    <AddIcon className={classes.button} onClick={this.addItem}/>
                                </div>
                            </div>
                        </li>
                    </ol>

                    <Typography type="title" color="inherit" style={{fontWeight: 'bold', marginTop:'40px', color:'#0000008a'}}>
                        Batch Data
                    </Typography>

                    <div className={classes.row}>
                        <FormControl error aria-describedby="email-error-text">
                            <TextField
                                id="historicalDataBatch"
                                label=""
                                multiline
                                rows="5"
                                rowsMax="99"
                                className={classes.textField}
                                value={this.state.historicalDataBatch}
                                onChange={(e)=> this.setState({historicalDataBatch: e.target.value})}
                                margin="normal"
                                type="text"
                                style={{width:'510px'}}
                            />
                            {this.state.historicalDataError ? <FormHelperText id="historical-data-error-text" style={{marginTop:'0px'}}>{this.state.historicalDataError}</FormHelperText> : null }
                        </FormControl>
                        <div className={[classes.buttonWrap, classes.col].join(' ')}>
                            <AddIcon className={classes.button} onClick={this.addBatch}/>
                        </div>
                    </div>

                    <div>
                        <Button raised={true} color="primary" className={classes.submitButton} onClick={this.onSubmit}>
                            Submit
                        </Button>
                    </div>

                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(CreateHistoryPage);

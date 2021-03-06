import 'react-redux'
import { browserHistory } from 'react-router'
import * as api from './Api'
import {COSMOS} from './Config'

//
// actions constants
//

const CREATE_HISTORY = 'CREATE_HISTORY';
const NEW_ID = 'NEW_ID';
const NEW_FORECAST = 'NEW_FORECAST';
const LOAD_HISTORY = 'LOAD_HISTORY';
const LOAD_VERSION = 'LOAD_VERSION';
const RESET_FEATURES = 'RESET_FEATURES';
const SET_FEATURES = 'SET_FEATURES';


//
// actions
//

function newID(projectID) {
    return {
        type: NEW_ID,
        projectID: projectID,
    }
}

function newForecast(projectID, distribution) {
    return {
        type: NEW_FORECAST,
        projectID: projectID,
        distribution: distribution,
    }
}

function resetFeatures() {
    return {
        type: RESET_FEATURES,
        features: [],
    }
}

function setFeatures(features) {
    return {
        type: SET_FEATURES,
        features: features,
    }
}

//
// action creators
//

function goBack() {
    return function(dispatch) {
        browserHistory.goBack();
    }
}

function goBackAndReset() {
    return function(dispatch) {
        dispatch(resetFeatures());
        browserHistory.goBack();
    }
}

function submitHistory(project) {
    return function (dispatch) {
        console.log("project:"+ project);
        api.createHistory(project)
            .then((projectID) => {
                dispatch(newID(projectID));
                browserHistory.push(`/${projectID}/history`);
            })
            .catch((err) => {
                console.warn('Error in submitHistory', err);
            });
    };
}

function generateForecastQueryAndRedirect(projectID, features) {
    return function(dispatch) {
        dispatch(setFeatures(features));
        browserHistory.push(`/${projectID}/forecast?features=${JSON.stringify(features)}`);
    }
}

function calculateForecast(projectID, features) {
    return function(dispatch) {
        dispatch(setFeatures(features));
        api.calculateForecast(projectID, features)
            .then((distribution) => {
                dispatch(newForecast(projectID, distribution));
            })
            .catch((err) => {
                console.warn('Error in calculateForecast:', err);
            });
    }
}

function loadHistory(projectID) {
    return function(dispatch) {
        api.loadHistory(projectID)
            .then((body) => {
                dispatch({
                    type: LOAD_HISTORY,
                    projectID: body.id,
                    name: body.name,
                    email: body.email,
                    historicalData: body.historicalData,
                    tags: body.tags,
                    expirationDate: body.expirationDate,
                });
            })
            .catch((err) => {
                console.warn('Error in loadSummary', err);
            });
    }
}

function loadVersion() {
    return function(dispatch) {
        api.getVersion()
            .then((version) => {
                dispatch({
                    type: LOAD_VERSION,
                    version: version,
                });
            })
            .catch((err) => {
                console.warn('Error in loadVersion:', err);
            });
    }
}

//
// reducers
//

// TODO schema definition?
// https://github.com/scotthovestadt/schema-object
// https://github.com/molnarg/js-schema
// https://github.com/gcanti/tcomb
// https://flow.org - static type checker
const initialState = {
    projectID: '',
    name: '',
    email: '',
    historicalData: [],
    tags: [],
    expirationDate: '',
    version: '',
    distribution: [],
    features: [],
};

function project (state = initialState, action) {
    switch (action.type) {
        case CREATE_HISTORY :
            return {
                ...state,
                name: action.name,
                email: action.email,
            };
        case NEW_ID:
            return {
                ...state,
                projectID: action.projectID,
            };
        case LOAD_HISTORY:
            return {
                ...state,
                projectID: action.projectID,
                name: action.name,
                email: action.email,
                historicalData: action.historicalData,
                tags: action.tags,
                expirationDate: action.expirationDate,
            };
        case NEW_FORECAST:
            return {
                ...state,
                projectID: action.projectID,
                distribution: action.distribution,
            };
        case LOAD_VERSION:
            return {
                ...state,
                version: action.version,
            };
        case RESET_FEATURES:
            return {
                ...state,
                features: action.features,
            };
        case SET_FEATURES:
            return {
                ...state,
                features: action.features,
            };
        default :
            return state;
    }
}


if (COSMOS) {
    // eslint-disable-next-line no-func-assign
    goBack = undefined;
    // eslint-disable-next-line no-func-assign
    goBackAndReset = undefined;
    // eslint-disable-next-line no-func-assign
    submitHistory = undefined;
    // eslint-disable-next-line no-func-assign
    calculateForecast = undefined;
    // eslint-disable-next-line no-func-assign
    loadHistory = undefined;
    // eslint-disable-next-line no-func-assign
    generateForecastQueryAndRedirect = undefined;
}

export {
    goBack,
    goBackAndReset,
    submitHistory,
    generateForecastQueryAndRedirect,
    calculateForecast,
    loadHistory,
    loadVersion,
};

export default project;

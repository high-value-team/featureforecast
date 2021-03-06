import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import MainContainer from './containers/MainContainer';
import CreateHistoryContainer from './containers/CreateHistoryContainer';
import HistoryContainer from './containers/HistoryContainer';
import ForecastContainer from "./containers/ForecastContainer";
import ImprintContainer from "./containers/ImprintContainer";

export default function getRoutes (history) {
    return (
        <Router history={history}>
            <Route path="/" component={MainContainer}>
                <Route path="/:projectID/history" component={HistoryContainer} />
                <Route path="/:projectID/forecast" component={ForecastContainer} />
                <Route path="/imprint" component={ImprintContainer} />

                <IndexRoute component={CreateHistoryContainer}/>
            </Route>
        </Router>
    );
}

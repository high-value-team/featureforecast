import createFetchProxy from 'react-cosmos-fetch-proxy';
import createReduxProxy from 'react-cosmos-redux-proxy';
import createRouterProxy from 'react-cosmos-router-proxy';
import createContextProxy from 'react-cosmos-context-proxy';
import PropTypes from 'prop-types';
import configureStore from './cosmos.configureStore';

//
// Redux
//

const ReduxProxy = createReduxProxy({
    createStore: state => configureStore(state)
});


//
// Context
//

const ContextProxy = createContextProxy({
    childContextTypes: {
        router: PropTypes.object,
    }
});

//
// proxy order
//

export default [
    ContextProxy,
    createFetchProxy(),
    ReduxProxy,
    createRouterProxy(),
];



//
// create snapshots
//

// import runTests from 'react-cosmos-telescope';
// runTests({
//   cosmosConfigPath: require.resolve('./cosmos.config.js')
// });


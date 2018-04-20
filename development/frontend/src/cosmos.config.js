// create a global variable to check if COSMOS is running
process.env.REACT_APP_COSMOS = true;

module.exports = {
    webpackConfigPath: 'react-scripts/config/webpack.config.dev',

    // TODO
    // GET http://localhost:8989/background.png 404 (Not Found)
    publicPath: 'src/public',
    publicUrl: '/static/',
};

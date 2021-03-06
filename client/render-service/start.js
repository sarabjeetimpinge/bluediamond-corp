// Not using ES6 `import` syntax here
// to avoid `require()`ing `babel-register`
// which would parse the whole server-side bundle by default.

require('source-map-support/register');

const startServer = require('universal-webpack/server');
const settings = require('../webpack/universal-webpack-settings');
const configuration = require('../webpack/webpack.config');

startServer(configuration, settings);

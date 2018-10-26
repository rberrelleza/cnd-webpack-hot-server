#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const commander = require('commander');
const path = require('path');
const package = require('./package.json');

commander
  .version(package.version)
  .option('-c, --config [type]', 'webpack configuration file')
  .option('-p, --port [type]', 'server port number (default: 35729)')
  .parse(process.argv);

// Load Webpack config file.
const configFile = path.join(process.cwd(), commander.config || './webpack.config.js');
const config = require(configFile);

const app = express();
const router = express.Router();
const env = app.get('env');
const port = commander.port || 35729;

const CND_BASE_PATH = '/cnd';
const HMR_PATH = '__webpack_hmr';

if (env == 'development') {
  // Inject HMR client code.
  config.entry = [
    'react-hot-loader/patch',
    // Configure client code to point to CND base path.
    `webpack-hot-middleware/client?path=${CND_BASE_PATH}/${HMR_PATH}&overlay=true`
  ].concat(config.entry);

  const compiler = webpack(config);

  // Set express middlewares. 
  // TODO: Try to disable serving all webpack compiled files and just run compiler.
  router.use(webpackDevMiddleware(compiler, { 
    hot: true,
    logTime: true,
    noInfo: true, 
    publicPath: config.output.publicPath,
    writeToDisk: true
  }));
  console.info("==> Webpack watching.");

  router.use(webpackHotMiddleware(compiler, {
    path: '/cnd/__webpack_hmr'
  }));
  console.info("==> Runing Hot Reload Middleware.");

  router.use(morgan('dev'));

  app.use('/', router);
}

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(
      `==> HMR server listening on http://localhost:${port}${CND_BASE_PATH}/${HMR_PATH}.`
    );
  }
})
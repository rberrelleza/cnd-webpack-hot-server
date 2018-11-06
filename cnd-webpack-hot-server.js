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
  .option('-b, --base-path [type]', 'base path where hmr will be listening to (default: \'/\')')
  .parse(process.argv);

// Load Webpack config file.
const configFile = path.join(process.cwd(), commander.config || './webpack.config.js');
const config = require(configFile);

const app = express();
const router = express.Router();
const env = app.get('env');
const port = commander.port || 35729;

const cndBasePath = commander.basePath || '';
const hmrPath = path.join('/', cndBasePath, '/__webpack_hmr');

// Configure client code to point to CND base path.
let clientOptions = `path=${hmrPath}&overlay=true`;
if (port) {
  clientOptions += `&port=${port}`;
}

if (env == 'development') {
  // Inject HMR client code.
  config.entry = [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?${clientOptions}`
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
    path: hmrPath
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
      `==> HMR server listening on http://localhost:${port}${hmrPath}.`
    );
  }
});
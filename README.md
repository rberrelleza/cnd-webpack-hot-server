# cnd-webpack-hot-server
 
Enable webpack hot reloading for [cloud native development (CND)][cnd-url]. This enables other tools like
[React Hot Loader](https://github.com/gaearon/react-hot-loader) to tweak React components in real time in your cloud native environment.

It uses the popular express middlewares [webpack-dev-middleware][dev-middleware-url] and [webpack-hot-middleware][hot-middleware-url] under the hood.

## Getting Started

Install the server module:

```console
yarn add cnd-webpack-hot-server --dev
```

## Usage

### With the CLI

If your `webpack.config.js` is on the root directory of your CND environment, run:

```console
cnd exec node_modules/cnd-webpack-hot-server/cnd-webpack-hot-server.js
```

You can also the path of your config file:
```console
cnd exec -- node_modules/cnd-webpack-hot-server/cnd-webpack-hot-server.js --config path/to/webpack.config.js
```

[See CND][cnd-url]

### With NPM Scripts

NPM package.json scripts are a convenient and useful means to run locally installed
binaries without having to be concerned about their full paths. Simply define a
script as such:

```json
"scripts": {
  "watch": "node node_modules/cnd-webpack-hot-server/cnd-webpack-hot-server.js"
}
```

And run the following in your CND environment:

```console
cnd exec yarn run watch
```

### The Result

This will start a server instance in your container and begin listening for connections from 
`localhost` on the default port `35729`.

## License

#### [MIT](./LICENSE)

[cnd-url]: https://github.com/okteto/cnd
[okteto-url]: https://okteto.com
[dev-middleware-url]: https://github.com/webpack/webpack-dev-middleware
[hot-middleware-url]: https://github.com/webpack/webpack-hot-middleware

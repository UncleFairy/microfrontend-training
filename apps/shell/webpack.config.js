const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json').dependencies;

/**
 * Webpack is the tool that prepares our source code for the browser.
 *
 * Module Federation lets this host load the two independently built trade
 * panels at runtime instead of compiling their source into this bundle.
 */
module.exports = {
  // index.tsx is where React starts rendering our application.
  entry: './src/index.tsx',

  output: {
    // `dist` is generated output. It is safe to delete and is in .gitignore.
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    // Remote chunks are served by the app that built them.
    publicPath: 'auto',
    uniqueName: 'shell'
  },

  resolve: {
    // This lets us import `./App` rather than `./App.tsx`.
    extensions: ['.tsx', '.ts', '.js']
  },

  module: {
    rules: [
      {
        // ts-loader converts TypeScript and JSX into JavaScript Webpack can use.
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Webpack only needs JavaScript output. `tsc --noEmit` can be run
            // separately later when we add a type-check command.
            transpileOnly: true
          }
        }
      },
      {
        // style-loader puts CSS on the page; css-loader lets JavaScript import it.
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        tradePanelA: 'tradePanelA@http://localhost:3001/remoteEntry.js',
        tradePanelB: 'tradePanelB@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] }
      }
    }),
    // Creates dist/index.html and automatically adds the bundled script to it.
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],

  devServer: {
    port: 3000,
    // If the browser visits a route directly, serve index.html so React can
    // eventually handle that route.
    historyApiFallback: true
  }
};

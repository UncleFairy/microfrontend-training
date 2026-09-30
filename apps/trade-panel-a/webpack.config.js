const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json').dependencies;

/**
 * This configuration belongs to Trade Panel A alone.
 *
 * That independence is important: a developer can start and build this panel
 * without starting the shell, while Module Federation also exposes its feature
 * component to the shell.
 */
module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: 'auto',
    uniqueName: 'tradePanelA'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Type checking is run separately with `npm run typecheck`.
            transpileOnly: true
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'tradePanelA',
      filename: 'remoteEntry.js',
      exposes: {
        './TradePanel': './src/TradePanel'
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] }
      }
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],

  devServer: {
    port: 3001,
    // Permit the shell's separate local origin to request federation assets.
    allowedHosts: 'all',
    // The shell runs on port 3000, so the federation container and its lazy
    // chunks must be usable from a different local origin during development.
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    historyApiFallback: true
  }
};

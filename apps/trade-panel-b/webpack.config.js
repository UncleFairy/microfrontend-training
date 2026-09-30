const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require('./package.json').dependencies;

/**
 * Trade Panel B has its own Webpack configuration and dev server. This means
 * it can be developed and deployed independently from the shell and Panel A,
 * and its feature component is exposed to the shell through Module Federation.
 */
module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: 'auto',
    uniqueName: 'tradePanelB'
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
            // `npm run typecheck` does full type checking separately.
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
      name: 'tradePanelB',
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
    port: 3002,
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

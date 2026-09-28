const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * This configuration belongs to Trade Panel A alone.
 *
 * That independence is important: a developer can start and build this panel
 * without starting the shell. In step 5, we will add Module Federation here to
 * make one component available to the shell as a remote application.
 */
module.exports = {
  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true
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

  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],

  devServer: {
    port: 3001,
    historyApiFallback: true
  }
};

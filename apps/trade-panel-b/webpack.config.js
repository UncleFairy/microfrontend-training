const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Trade Panel B has its own Webpack configuration and dev server. This means
 * it can be developed and deployed independently from the shell and Panel A.
 * Module Federation will be added in step 5.
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

  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],

  devServer: {
    port: 3002,
    historyApiFallback: true
  }
};

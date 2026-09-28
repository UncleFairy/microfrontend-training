const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack is the tool that prepares our source code for the browser.
 *
 * At this stage it has one job: bundle the shell application. In step 5, we
 * will extend this same file with Module Federation so that the shell can load
 * the two trade panels at runtime.
 */
module.exports = {
  // index.tsx is where React starts rendering our application.
  entry: './src/index.tsx',

  output: {
    // `dist` is generated output. It is safe to delete and is in .gitignore.
    path: path.resolve(__dirname, 'dist'),
    clean: true
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

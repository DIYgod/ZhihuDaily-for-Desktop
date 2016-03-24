var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

/**
 * Webpack Plugins
 */
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

  // Switch loaders to debug mode.
  //
  // See: http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // Developer tool to enhance debugging
  //
  // See: http://webpack.github.io/docs/configuration.html#devtool
  // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
  devtool: 'cheap-module-eval-source-map',

  // Cache generated modules and chunks to improve performance for multiple incremental builds.
  // This is enabled by default in watch mode.
  // You can pass false to disable it.
  //
  // See: http://webpack.github.io/docs/configuration.html#cache
  // cache: false,

  // The entry point for the bundle
  //
  // See: http://webpack.github.io/docs/configuration.html#entry
  entry: {

    'app': './src/main.js',

    'vendor': [
      './src/vendor.js',

      // See: https://github.com/gowravshekar/font-awesome-webpack
      'font-awesome-webpack!./config/font-awesome.config.js'
    ]

  },

  // Options affecting the resolving of modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#resolve
  resolve: {

    // An array of extensions that should be used to resolve modules.
    //
    // See: http://webpack.github.io/docs/configuration.html#resolve-extensions
    extensions: ['', '.js'],

    // Make sure root is src
    root: path.resolve(__dirname, '../src')

  },

  // Options affecting the output of the compilation.
  //
  // See: http://webpack.github.io/docs/configuration.html#output
  output: {

    // The output directory as absolute path (required).
    //
    // See: http://webpack.github.io/docs/configuration.html#output-path
    path: path.resolve(__dirname, '../dist'),

    // Specifies the name of each output file on disk.
    // IMPORTANT: You must not specify an absolute path here!
    //
    // See: http://webpack.github.io/docs/configuration.html#output-filename
    filename: '[name].bundle.js',

    // The filename of the SourceMaps for the JavaScript files.
    // They are inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: '[name].map',

    // The filename of non-entry chunks as relative path
    // inside the output.path directory.
    //
    // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
    chunkFilename: '[id].chunk.js'

  },
  // Options affecting the normal modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#module
  module: {

    // An array of automatically applied loaders.
    //
    // IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
    // This means they are not resolved relative to the configuration file.
    //
    // See: http://webpack.github.io/docs/configuration.html#module-loaders
    loaders: [

      // Transform ES6 to ES5
      //
      // See: https://github.com/babel/babel-loader
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},

      // transform *.scss to css, then inline to <head>
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      },

      // Raw loader support for *.html
      // Returns file content as string
      //
      // See: https://github.com/webpack/raw-loader
      {test: /\.html$/, loader: 'raw-loader', exclude: [path.resolve(__dirname, '../src/index.html')]},

      {test: /\.png$/, loader: 'url?limit=10000'},

      // font-awesome
      //
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}

    ]

  },

  // Add additional plugins to the compiler.
  //
  // See: http://webpack.github.io/docs/configuration.html#plugins
  plugins: [

    // Plugin: OccurenceOrderPlugin
    // Description: Varies the distribution of the ids to get the smallest id length
    // for often used ids.
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // See: https://github.com/webpack/docs/wiki/optimization#minimize
    new webpack.optimize.OccurenceOrderPlugin(true),

    // Plugin: CommonsChunkPlugin
    // Description: Shares common code between the pages.
    // It identifies common modules and put them into a commons chunk.
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
    new webpack.optimize.CommonsChunkPlugin({name: ['app', 'vendor'], minChunks: Infinity}),

    // Plugin: CopyWebpackPlugin
    // Description: Copy files and directories in webpack.
    //
    // Copies project static assets.
    //
    // See: https://www.npmjs.com/package/copy-webpack-plugin
    new CopyWebpackPlugin([{from: 'src/assets', to: 'assets'}]),

    // Plugin: HtmlWebpackPlugin
    // Description: Simplifies creation of HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles that include a hash in the filename
    // which changes every compilation.
    //
    // See: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({template: 'src/index.html', chunksSortMode: 'none', inject: true}),

    // Plugin: ExtractTextPlugin
    // Description: extract all compiled css into file (*.css)
    //
    // See: https://github.com/webpack/extract-text-webpack-plugin
    new ExtractTextPlugin('[name].css', {allChunks: true})

  ],

  postcss: [autoprefixer]

};

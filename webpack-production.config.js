var webpack = require('webpack');
var baseConfig = require('./webpack.config.js');

// Add the minifying plugin for production
var minifier = new webpack.optimize.UglifyJsPlugin();
baseConfig.plugins.push(minifier);

// Update the file name we output
baseConfig.output.filename = "bundle.min.js";

module.exports = baseConfig;

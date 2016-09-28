var path = require('path');
var webpack = require('webpack');
var BuildNumber = require('./DevUtils/BuildNumber.js')

// Try to get the build number we should use
var buildNum = "2.0.0";
try {
  buildNum = BuildNumber.getBuildNumber(true).toString();
} catch(err) {
  console.warn("Error retrieving build number: " + err.toString());
}

module.exports = {
  devtool: 'cheap-module-inline-source-map',
  entry: './index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'BUILD_NUMBER': JSON.stringify(buildNum)
    }),
    new webpack.BannerPlugin('Build Number: ' + buildNum)
  ]
}

var path = require('path');
var webpack = require('webpack');
var BuildNumber = require('./DevUtils/BuildNumber.js')

// Try to get the build number we should use
try {
  var buildNum = BuildNumber.getBuildNumber().toString();
} catch(e) {
  console.error("Could not parse build number :(");
  console.error(e.toString());
  return;
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

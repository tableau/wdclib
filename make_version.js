#!/usr/bin/env node
var program = require('commander');
var BuildNumber = require('./DevUtils/BuildNumber.js');
var execSync = require('child_process').execSync;
var fs = require('fs-extra');
var path = require('path');

// wrap everything in a try catch so we can log any errors we see
try {
  console.log("Running build");
  execSync('npm run-script build');

  console.log("Running build minify");
  execSync('npm run-script build_min');

  console.log("Done runing build processes");

  // Copying files over
  var buildNumber = new BuildNumber.VersionNumber(BuildNumber.getBuildNumber());

  // Build up the names for the regular and minified versions of the file
  var newFullFileName = BuildNumber.WDC_LIB_PREFIX + buildNumber.toString() + ".js";
  var newMinFileName = BuildNumber.WDC_LIB_PREFIX + buildNumber.toString() + ".min.js";

  // Build up the names for the latest versions of the file
  var latestBuildName = buildNumber.major + "." + buildNumber.minor + ".latest";
  var newLatestFullFileName = BuildNumber.WDC_LIB_PREFIX + latestBuildName + ".js";
  var newLatestMinFileName = BuildNumber.WDC_LIB_PREFIX + latestBuildName + ".min.js";

  var copyPairs = [
    {src: "bundle.js", dest: newFullFileName},
    {src: "bundle.min.js", dest: newMinFileName},
    {src: "bundle.js", dest: newLatestFullFileName},
    {src: "bundle.min.js", dest: newLatestMinFileName},
  ];

  // Go through and copy all the files
  for(var pair of copyPairs) {
    var srcPath = path.join(__dirname, ".", "dist", pair.src);
    var dstPath = path.join(__dirname, '.', 'versions', pair.dest);

    console.log("Copying '" + srcPath + "' to '" + dstPath + "'");
    fs.copySync(srcPath, dstPath);
  }

} catch(e) {
  debugger;
  console.error("Error encountered");
  console.error(e.toString());
}



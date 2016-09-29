#!/usr/bin/env node
var program = require('commander');
var BuildNumber = require('./DevUtils/BuildNumber.js');
var execSync = require('child_process').execSync;
var fs = require('fs.extra');
var path = require('path');

// wrap everything in a try catch so we can log any errors we see
try {
  program
    .option('-v, --versionNumber <versionNumber>', 'What version of the shim you are producing')
    .parse(process.argv);

  if (program.versionNumber) {
    console.log("Requesting to make version " + program.versionNumber);
    var version = new BuildNumber.VersionNumber(program.versionNumber);
    console.log("Parsed version is " + version.toString());
    console.log("Overriding version number to " + program.versionNumber);
    execSync("npm config set wdclib:versionNumber " + program.versionNumber);
  }

  console.log("Running build");
  execSync('npm run-script build');

  console.log("Running build minify");
  execSync('npm run-script build_min');

  console.log("Done runing build processes");

  var buildNumber = BuildNumber.getBuildNumber();

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
} finally {
  // Make sure we clear out the overriden version at the end
  if (!!program.versionNumber) {
    execSync('npm config rm wdclib:versionNumber');
  }
}



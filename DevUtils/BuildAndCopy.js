const execSync = require('child_process').execSync;
var BuildNumber = require('./BuildNumber.js');
var path = require('path');
var fs = require('fs.extra');

console.log("Running build");
execSync('npm run-script build');

console.log("Running build minify");
execSync('npm run-script build_min');

console.log("Done runing build processes");

// Get the build number so we know what to call this file
var buildNumber = BuildNumber.getBuildNumber(true);

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
  (function() {
    var srcPath = path.join(__dirname, "..", "dist", pair.src);
    var dstPath = path.join(BuildNumber.getJsSdkDir(), pair.dest);

    // Check if this file exists and not checked out. Try catch it because statSync can throw if file doesn't exist
    try {
      if (fs.statSync(dstPath).isFile() && !BuildNumber.isFileCheckedOut(dstPath)) {
        // We need to edit the file if it exists and isn't checked out
        var cmd = 'p4 edit "' + dstPath + '"';
        var result = execSync(cmd).toString();
        console.log(result);
      }
    } catch(e) {
      // Nothing
    }

    fs.copy(srcPath, dstPath, {replace: true}, function(err) {
      if (err) {
        console.log("Error copying " + srcPath + " to " + dstPath);
        throw err.toString();
      }

      console.log("Finished copying " + srcPath + " to " + dstPath);

      // check to see if this file was checked out already. If not, p4 add it
      if (!BuildNumber.isFileCheckedOut(dstPath)) {
        var cmd = 'p4 add "' + dstPath + '"';
        var result = execSync(cmd).toString();
        console.log(result);
      }
    });
  })();
}

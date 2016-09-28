var fs = require('fs');
var path = require('path');
const execSync = require('child_process').execSync;

var WDC_LIB_PREFIX = "tableauwdc-";

function VersionNumber(versionString) {
  var components = versionString.split(".");
  if (components.length < 3) {
    console.log()
    throw "Invalid number of components. versionString was '" + versionString + "'";
  }

  this.major = parseInt(components[0]).toString();
  this.minor = parseInt(components[1]).toString();
  this.fix = parseInt(components[2]).toString();
}

VersionNumber.prototype.toString = function() {
  return this.major + "." + this.minor + "." + this.fix;
}

VersionNumber.prototype.compare = function(other) {
  var majorDiff = this.major - other.major;
  var minorDiff = this.minor - other.minor;
  var fixDiff = this.fix - other.fix;

  if (majorDiff != 0) return majorDiff;
  if (minorDiff != 0) return minorDiff;
  if (fixDiff != 0) return fixDiff;

  return 0;
}

function isFileCheckedOut(filePath) {
  var cmd = 'p4 opened "' + filePath + '"';
  var result = execSync(cmd).toString();
  if (result.indexOf("- edit") >= 0 || result.indexOf("- add") >= 0) {
    return true;
  } else {
    return false;
  }
}

function getJsSdkDir() {
  var jsPath = path.join(__dirname, "..", "..", "js");
  return jsPath;
}

function getBuildNumber(checkPerforce) {
  var destinationPath = getJsSdkDir();
  var existingFiles = fs.readdirSync(destinationPath);
  var existingBuildNumbers = [];
  for(var jsFile of existingFiles) {
    if (jsFile.substr(0, WDC_LIB_PREFIX.length) === WDC_LIB_PREFIX) {
      var numberString = jsFile.substr(WDC_LIB_PREFIX.length);
      numberString = numberString.substr(0, numberString.length - ".js".length);
      existingBuildNumbers.push(new VersionNumber(numberString));
    }
  }

  var newest = new VersionNumber("0.0.0");
  for (var versionNumber of existingBuildNumbers) {
    if (versionNumber.compare(newest) > 0) {
      newest = versionNumber;
    }
  }

  console.log("Most recent build is " + newest.toString());

  var doIncrement = true;
  if (checkPerforce) {
    var newFileName = WDC_LIB_PREFIX + newest.toString() + ".js";
    var existingFilePath = path.join(getJsSdkDir(), newFileName);
    doIncrement = !isFileCheckedOut(existingFilePath);
  }

  var nextBuildNumber = newest;
  if (doIncrement) {
    nextBuildNumber.fix++;
  }

  console.log("Next number is " + nextBuildNumber.toString());
  return nextBuildNumber;
}

module.exports.getBuildNumber = getBuildNumber;
module.exports.WDC_LIB_PREFIX = WDC_LIB_PREFIX;
module.exports.isFileCheckedOut = isFileCheckedOut;
module.exports.getJsSdkDir = getJsSdkDir;

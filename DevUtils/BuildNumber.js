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

function getBuildNumber() {
  // Grab the version number from the environment variable
  var versionNumber = process.env.npm_package_config_versionNumber;
  if (versionNumber) {
    console.log("Found versionNumber in environment variable: '" + versionNumber + "'");
  } else {
    versionNumber = process.argv.versionNumber;
    console.log("Found versionNumber in argument: '" + versionNumber + "'");
  }

  return versionNumber;
}

module.exports.VersionNumber = VersionNumber;
module.exports.WDC_LIB_PREFIX = WDC_LIB_PREFIX;
module.exports.getBuildNumber = getBuildNumber;
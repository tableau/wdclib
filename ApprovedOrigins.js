var APPROVED_ORIGINS_KEY = "wdc_approved_origins";
var SEPARATOR = ",";
var Cookies = require('cookies-js');

function _getApprovedOriginsValue() {
  var result = Cookies.get(APPROVED_ORIGINS_KEY);
  return result;
}

function _saveApprovedOrigins(originArray) {
  var newOriginString = originArray.join(SEPARATOR);
  console.log("Saving approved origins '" + newOriginString + "'");
  
  // We could potentially make this a longer term cookie instead of just for the current session
  var result = Cookies.set(APPROVED_ORIGINS_KEY, newOriginString);
  return result;
}

// Adds an approved origins to the list already saved in a session cookie
function addApprovedOrigin(origin) {
  if (origin) {
    var origins = getApprovedOrigins();
    origins.push(origin);
    _saveApprovedOrigins(origins);
  }
}

function getApprovedOrigins() {
  var originsString = _getApprovedOriginsValue();
  if (!originsString || 0 === originsString.length) {
    return [];
  }

  var origins = originsString.split(SEPARATOR);
  return origins;
}

module.exports.addApprovedOrigin = addApprovedOrigin;
module.exports.getApprovedOrigins = getApprovedOrigins;

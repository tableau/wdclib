function copyFunctions(src, dest) {
  for (var key in src) {
    if (typeof src[key] === 'function') {
      dest[key] = src[key];
    }
  }
}

/**
* This function will link the given list of properties using getter/setter referencing
* the source
* 
* Important:
* The target object will be mutated
*             
* 
* @param {Object} source 
* @param {Object} target
* @param {Array} propertyList
*/
function linkObjectProperties(source, target, propertyList) {

  /**
   * Array.forEach ( supported by Edge )
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  */

  propertyList.forEach(function (propertyName) {

    Object.defineProperty(target, propertyName, {
      enumerable: true,
      configurable: true,
      get: function () {
        return source[propertyName];
      },
      set: function (value) {
        return source[propertyName] = value;
      }
    });

  });

}

var tableauProperties = [
  "authPurpose",
  "authType",
  "connectionData",
  "connectionName",
  "language",
  "locale",
  "logLevel",
  "password",
  "phase",
  "platformBuildNumber",
  "platformEdition",
  "platformOs",
  "platformVersion",
  "propertiesReady",
  "scriptVersion",
  "username",
  "usernameAlias",
  "APIVersion"
];

module.exports.copyFunctions = copyFunctions;
module.exports.linkObjectProperties = linkObjectProperties;
module.exports.tableauProperties = tableauProperties;
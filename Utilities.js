var Enums = require('./Enums.js');

// Init the enum values
var enumVals = {};
Enums.apply(enumVals);

function copyFunctions(src, dest) {
  for(var key in src) {
    if (typeof src[key] === 'function') {
      dest[key] = src[key];
    }
  }
}

var logLevelsMap = {};
logLevelsMap[enumVals.logLevelEnum.trace] = 0;
logLevelsMap[enumVals.logLevelEnum.debug] = 1;
logLevelsMap[enumVals.logLevelEnum.info] = 2;
logLevelsMap[enumVals.logLevelEnum.warn] = 3;
logLevelsMap[enumVals.logLevelEnum.error] = 4;
logLevelsMap[enumVals.logLevelEnum.fatal] = 5;
logLevelsMap[enumVals.logLevelEnum.off] = 6;

function convertLevelToNumber(logLevel, defaultVal) {
  // Check if we have a valid string logLevel passed in. If we don't, just fall back to trace
  var levelString = (!!logLevel && typeof logLevel === 'string') ? logLevel.toLowerCase() : enumVals.logLevelEnum.trace;
  var level = defaultVal || 0;
  if (logLevelsMap.hasOwnProperty(levelString)) {
    level = logLevelsMap[levelString];
  }

  return level;
}

function shouldLogMessage(messageLogLevel, tableauLogLevel) {
  var messageLevel = convertLevelToNumber(messageLogLevel, -1);
  if (messageLevel == -1) {
    // Log a message to the console if we can't parse out the logLevel which was requested
    // If we don't have a valid level passed in, assume that we should log at an fatal level
    console.error("Unable to parse log level '" + messageLevel + "'");
    messageLevel = logLevelsMap[enumVals.logLevelEnum.fatal];
  }

  // If we can't get a log level from Tableau, assume it is at info (Tableau's default)
  var tableauLevel = convertLevelToNumber(tableauLogLevel, logLevelsMap[enumVals.logLevelEnum.info]);

  // If the message is higher or equal to Tableau's level, we should log
  return messageLevel >= tableauLevel;
}

module.exports.copyFunctions = copyFunctions;
module.exports.shouldLogMessage = shouldLogMessage;

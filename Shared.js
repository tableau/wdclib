var Table = require('./Table.js');
var Enums = require('./Enums.js');
var Utilities = require('./Utilities.js');

/** @class This class represents the shared parts of the javascript
* library which do not have any dependence on whether we are running in
* the simulator, in Tableau, or anywhere else
* @param tableauApiObj {Object} - The already created tableau API object (usually window.tableau)
* @param privateApiObj {Object} - The already created private API object (usually window._tableau)
* @param globalObj {Object} - The global object to attach things to (usually window)
*/
function Shared (tableauApiObj, privateApiObj, globalObj) {
  this.privateApiObj = privateApiObj;
  this.globalObj = globalObj;
  this._hasAlreadyThrownErrorSoDontThrowAgain = false;

  this.changeTableauApiObj(tableauApiObj);
}


Shared.prototype.init = function() {
  console.log("Initializing shared WDC");
  this.globalObj.onerror = this._errorHandler.bind(this);

  // Initialize the functions which will be invoked by the native code
  this._initTriggerFunctions();

  // Assign the deprecated functions which aren't availible in this version of the API
  this._initDeprecatedFunctions();

  // Assign the new log2 method which allows us to specify a log level
  this.tableauApiObj.log2 = this._log2.bind(this);
}

Shared.prototype.changeTableauApiObj = function(tableauApiObj) {
  this.tableauApiObj = tableauApiObj;

  // Assign our make & register functions right away because a connector can use
  // them immediately, even before bootstrapping has completed
  this.tableauApiObj.makeConnector = this._makeConnector.bind(this);
  this.tableauApiObj.registerConnector = this._registerConnector.bind(this);

  Enums.apply(this.tableauApiObj);
}

Shared.prototype._errorHandler = function(message, file, line, column, errorObj) {
  console.error(errorObj); // print error for debugging in the browser
  if (this._hasAlreadyThrownErrorSoDontThrowAgain) {
    return true;
  }

  var msg = message;
  if(errorObj) {
    msg += "   stack:" + errorObj.stack;
  } else {
    msg += "   file: " + file;
    msg += "   line: " + line;
  }

  if (this.tableauApiObj && this.tableauApiObj.abortWithError) {
    this.tableauApiObj.abortWithError(msg);
  } else {
    throw msg;
  }

  this._hasAlreadyThrownErrorSoDontThrowAgain = true;
  return true;
}

Shared.prototype._makeConnector = function() {
  var defaultImpls = {
    init: function(cb) { cb(); },
    shutdown: function(cb) { cb(); }
  };

  return defaultImpls;
}

Shared.prototype._registerConnector = function (wdc) {

  // do some error checking on the wdc
  var functionNames = ["init", "shutdown", "getSchema", "getData"];
  for (var ii = functionNames.length - 1; ii >= 0; ii--) {
    if (typeof(wdc[functionNames[ii]]) !== "function") {
      throw "The connector did not define the required function: " + functionNames[ii];
    }
  };

  console.log("Connector registered");

  this.globalObj._wdc = wdc;
  this._wdc = wdc;
}

Shared.prototype._initTriggerFunctions = function() {
  this.privateApiObj.triggerInitialization = this._triggerInitialization.bind(this);
  this.privateApiObj.triggerSchemaGathering = this._triggerSchemaGathering.bind(this);
  this.privateApiObj.triggerDataGathering = this._triggerDataGathering.bind(this);
  this.privateApiObj.triggerShutdown = this._triggerShutdown.bind(this);
}

// Starts the WDC
Shared.prototype._triggerInitialization = function() {
  this._wdc.init(this.privateApiObj._initCallback);
}

// Starts the schema gathering process
Shared.prototype._triggerSchemaGathering = function() {
  this._wdc.getSchema(this.privateApiObj._schemaCallback);
}

// Starts the data gathering process
Shared.prototype._triggerDataGathering = function(tablesAndIncrementValues) {
  if (tablesAndIncrementValues.length != 1) {
    throw ("Unexpected number of tables specified. Expected 1, actual " + tablesAndIncrementValues.length.toString());
  }

  var tableAndIncremntValue = tablesAndIncrementValues[0];
  var isJoinFiltered = !!tableAndIncremntValue.filterColumnId;
  var table = new Table(
    tableAndIncremntValue.tableInfo, 
    tableAndIncremntValue.incrementValue, 
    isJoinFiltered, 
    tableAndIncremntValue.filterColumnId || '', 
    tableAndIncremntValue.filterValues || [],
    this.privateApiObj._tableDataCallback);

  this._wdc.getData(table, this.privateApiObj._dataDoneCallback);
}

// Tells the WDC it's time to shut down
Shared.prototype._triggerShutdown = function() {
  this._wdc.shutdown(this.privateApiObj._shutdownCallback);
}

// Initializes a series of global callbacks which have been deprecated in version 2.0.0
Shared.prototype._initDeprecatedFunctions = function() {
  this.tableauApiObj.initCallback = this._initCallback.bind(this);
  this.tableauApiObj.headersCallback = this._headersCallback.bind(this);
  this.tableauApiObj.dataCallback = this._dataCallback.bind(this);
  this.tableauApiObj.shutdownCallback = this._shutdownCallback.bind(this);
}

Shared.prototype._initCallback = function () {
  this.tableauApiObj.abortWithError("tableau.initCallback has been deprecated in version 2.0.0. Please use the callback function passed to init");
};

Shared.prototype._headersCallback = function (fieldNames, types) {
  this.tableauApiObj.abortWithError("tableau.headersCallback has been deprecated in version 2.0.0");
};

Shared.prototype._dataCallback = function (data, lastRecordToken, moreData) {
  this.tableauApiObj.abortWithError("tableau.dataCallback has been deprecated in version 2.0.0");
};

Shared.prototype._shutdownCallback = function () {
  this.tableauApiObj.abortWithError("tableau.shutdownCallback has been deprecated in version 2.0.0. Please use the callback function passed to shutdown");
};

Shared.prototype._log2 = function(msg, level) {
  // Check to see if we should actually log this message based on the Tableau's log level.
  // If this connector is running in a pre-10.2 version of tableau, this.tableauApiObj.logLevel will be undefined.
  // In this case, it will default to the info log level
  if (!this.logLevel) {
    // cache the logLevel locally so we don't need to call into the native layer each time we log
    this.logLevel = this.tableauApiObj.logLevel;
  }

  if (Utilities.shouldLogMessage(level, this.logLevel)) {
    this.tableauApiObj.log(msg);
  }
}

module.exports = Shared;

/*! Build Number: 2.1.1 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Main entry point to pull together everything needed for the WDC shim library
	// This file will be exported as a bundled js file by webpack so it can be included
	// in a <script> tag in an html document. Alernatively, a connector may include
	// this whole package in their code and would need to call init like this
	var tableauwdc = __webpack_require__(16);
	tableauwdc.init();


/***/ },
/* 1 */
/***/ function(module, exports) {

	/** This file lists all of the enums which should available for the WDC */
	var allEnums = {
	  phaseEnum : {
	    interactivePhase: "interactive",
	    authPhase: "auth",
	    gatherDataPhase: "gatherData"
	  },

	  authPurposeEnum : {
	    ephemeral: "ephemeral",
	    enduring: "enduring"
	  },

	  authTypeEnum : {
	    none: "none",
	    basic: "basic",
	    custom: "custom"
	  },

	  dataTypeEnum : {
	    bool: "bool",
	    date: "date",
	    datetime: "datetime",
	    float: "float",
	    int: "int",
	    string: "string"
	  },

	  columnRoleEnum : {
	      dimension: "dimension",
	      measure: "measure"
	  },

	  columnTypeEnum : {
	      continuous: "continuous",
	      discrete: "discrete"
	  },

	  aggTypeEnum : {
	      sum: "sum",
	      avg: "avg",
	      median: "median",
	      count: "count",
	      countd: "count_dist"
	  },

	  geographicRoleEnum : {
	      area_code: "area_code",
	      cbsa_msa: "cbsa_msa",
	      city: "city",
	      congressional_district: "congressional_district",
	      country_region: "country_region",
	      county: "county",
	      state_province: "state_province",
	      zip_code_postcode: "zip_code_postcode",
	      latitude: "latitude",
	      longitude: "longitude"
	  },

	  unitsFormatEnum : {
	      thousands: "thousands",
	      millions: "millions",
	      billions_english: "billions_english",
	      billions_standard: "billions_standard"
	  },

	  numberFormatEnum : {
	      number: "number",
	      currency: "currency",
	      scientific: "scientific",
	      percentage: "percentage"
	  },

	  localeEnum : {
	      america: "en-us",
	      brazil:  "pt-br",
	      china:   "zh-cn",
	      france:  "fr-fr",
	      germany: "de-de",
	      japan:   "ja-jp",
	      korea:   "ko-kr",
	      spain:   "es-es"
	  },

	  joinEnum : {
	      inner: "inner",
	      left: "left"
	  }
	}

	// Applies the enums as properties of the target object
	function apply(target) {
	  for(var key in allEnums) {
	    target[key] = allEnums[key];
	  }
	}

	module.exports.apply = apply;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/** @class Used for communicating between Tableau desktop/server and the WDC's
	* Javascript. is predominantly a pass-through to the Qt WebBridge methods
	* @param nativeApiRootObj {Object} - The root object where the native Api methods
	* are available. For WebKit, this is window.
	*/
	function NativeDispatcher (nativeApiRootObj) {
	  this.nativeApiRootObj = nativeApiRootObj;
	  this._initPublicInterface();
	  this._initPrivateInterface();
	}

	NativeDispatcher.prototype._initPublicInterface = function() {
	  console.log("Initializing public interface for NativeDispatcher");
	  this._submitCalled = false;

	  var publicInterface = {};
	  publicInterface.abortForAuth = this._abortForAuth.bind(this);
	  publicInterface.abortWithError = this._abortWithError.bind(this);
	  publicInterface.addCrossOriginException = this._addCrossOriginException.bind(this);
	  publicInterface.log = this._log.bind(this);
	  publicInterface.submit = this._submit.bind(this);
	  publicInterface.reportProgress = this._reportProgress.bind(this);

	  this.publicInterface = publicInterface;
	}

	NativeDispatcher.prototype._abortForAuth = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_abortForAuth.api(msg);
	}

	NativeDispatcher.prototype._abortWithError = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_abortWithError.api(msg);
	}

	NativeDispatcher.prototype._addCrossOriginException = function(destOriginList) {
	  this.nativeApiRootObj.WDCBridge_Api_addCrossOriginException.api(destOriginList);
	}

	NativeDispatcher.prototype._log = function(msg) {
	  this.nativeApiRootObj.WDCBridge_Api_log.api(msg);
	}

	NativeDispatcher.prototype._submit = function() {
	  if (this._submitCalled) {
	    console.log("submit called more than once");
	    return;
	  }

	  this._submitCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_submit.api();
	};

	NativeDispatcher.prototype._initPrivateInterface = function() {
	  console.log("Initializing private interface for NativeDispatcher");

	  this._initCallbackCalled = false;
	  this._shutdownCallbackCalled = false;

	  var privateInterface = {};
	  privateInterface._initCallback = this._initCallback.bind(this);
	  privateInterface._shutdownCallback = this._shutdownCallback.bind(this);
	  privateInterface._schemaCallback = this._schemaCallback.bind(this);
	  privateInterface._tableDataCallback = this._tableDataCallback.bind(this);
	  privateInterface._dataDoneCallback = this._dataDoneCallback.bind(this);

	  this.privateInterface = privateInterface;
	}

	NativeDispatcher.prototype._initCallback = function() {
	  if (this._initCallbackCalled) {
	    console.log("initCallback called more than once");
	    return;
	  }

	  this._initCallbackCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_initCallback.api();
	}

	NativeDispatcher.prototype._shutdownCallback = function() {
	  if (this._shutdownCallbackCalled) {
	    console.log("shutdownCallback called more than once");
	    return;
	  }

	  this._shutdownCallbackCalled = true;
	  this.nativeApiRootObj.WDCBridge_Api_shutdownCallback.api();
	}

	NativeDispatcher.prototype._schemaCallback = function(schema, standardConnections) {
	  // Check to make sure we are using a version of desktop which has the WDCBridge_Api_schemaCallbackEx defined
	  if (!!this.nativeApiRootObj.WDCBridge_Api_schemaCallbackEx) {
	    // Providing standardConnections is optional but we can't pass undefined back because Qt will choke
	    this.nativeApiRootObj.WDCBridge_Api_schemaCallbackEx.api(schema, standardConnections || []);
	  } else {
	    this.nativeApiRootObj.WDCBridge_Api_schemaCallback.api(schema);
	  }
	}

	NativeDispatcher.prototype._tableDataCallback = function(tableName, data) {
	  this.nativeApiRootObj.WDCBridge_Api_tableDataCallback.api(tableName, data);
	}

	NativeDispatcher.prototype._reportProgress = function (progress) {
	    this.nativeApiRootObj.WDCBridge_Api_reportProgress.api(progress);
	}

	NativeDispatcher.prototype._dataDoneCallback = function() {
	  this.nativeApiRootObj.WDCBridge_Api_dataDoneCallback.api();
	}

	module.exports = NativeDispatcher;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Table = __webpack_require__(5);
	var Enums = __webpack_require__(1);

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
	  var table = new Table(tableAndIncremntValue.tableInfo, tableAndIncremntValue.incrementValue, this.privateApiObj._tableDataCallback);
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

	module.exports = Shared;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @class Used for communicating between the simulator and web data connector. It does
	* this by passing messages between the WDC window and its parent window
	* @param globalObj {Object} - the global object to find tableau interfaces as well
	* as register events (usually window)
	*/
	function SimulatorDispatcher (globalObj) {
	  this.globalObj = globalObj;
	  this._initMessageHandling();
	  this._initPublicInterface();
	  this._initPrivateInterface();
	}

	SimulatorDispatcher.prototype._initMessageHandling = function() {
	  console.log("Initializing message handling");
	  this.globalObj.addEventListener('message', this._receiveMessage.bind(this), false);
	  this.globalObj.document.addEventListener("DOMContentLoaded", this._onDomContentLoaded.bind(this));
	}

	SimulatorDispatcher.prototype._onDomContentLoaded = function() {
	  // Attempt to notify the simulator window that the WDC has loaded
	  if(this.globalObj.parent !== window) {
	    this.globalObj.parent.postMessage(this._buildMessagePayload('loaded'), '*');
	  }

	  if(this.globalObj.opener) {
	    try { // Wrap in try/catch for older versions of IE
	      this.globalObj.opener.postMessage(this._buildMessagePayload('loaded'), '*');
	    } catch(e) {
	      console.warn('Some versions of IE may not accurately simulate the Web Data Connector. Please retry on a Webkit based browser');
	    }
	  }
	}

	SimulatorDispatcher.prototype._packagePropertyValues = function() {
	  var propValues = {
	    "connectionName": this.globalObj.tableau.connectionName,
	    "connectionData": this.globalObj.tableau.connectionData,
	    "password": this.globalObj.tableau.password,
	    "username": this.globalObj.tableau.username,
	    "usernameAlias": this.globalObj.tableau.usernameAlias,
	    "incrementalExtractColumn": this.globalObj.tableau.incrementalExtractColumn,
	    "versionNumber": this.globalObj.tableau.versionNumber,
	    "locale": this.globalObj.tableau.locale,
	    "authPurpose": this.globalObj.tableau.authPurpose,
	    "platformOS": this.globalObj.tableau.platformOS,
	    "platformVersion": this.globalObj.tableau.platformVersion,
	    "platformEdition": this.globalObj.tableau.platformEdition,
	    "platformBuildNumber": this.globalObj.tableau.platformBuildNumber
	  };

	  return propValues;
	}

	SimulatorDispatcher.prototype._applyPropertyValues = function(props) {
	  if (props) {
	    this.globalObj.tableau.connectionName = props.connectionName;
	    this.globalObj.tableau.connectionData = props.connectionData;
	    this.globalObj.tableau.password = props.password;
	    this.globalObj.tableau.username = props.username;
	    this.globalObj.tableau.usernameAlias = props.usernameAlias;
	    this.globalObj.tableau.incrementalExtractColumn = props.incrementalExtractColumn;
	    this.globalObj.tableau.locale = props.locale;
	    this.globalObj.tableau.language = props.locale;
	    this.globalObj.tableau.authPurpose = props.authPurpose;
	    this.globalObj.tableau.platformOS = props.platformOS;
	    this.globalObj.tableau.platformVersion = props.platformVersion;
	    this.globalObj.tableau.platformEdition = props.platformEdition;
	    this.globalObj.tableau.platformBuildNumber = props.platformBuildNumber;
	  }
	}

	SimulatorDispatcher.prototype._buildMessagePayload = function(msgName, msgData, props) {
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.1.1") };
	  return JSON.stringify(msgObj);
	}

	SimulatorDispatcher.prototype._sendMessage = function(msgName, msgData) {
	  var messagePayload = this._buildMessagePayload(msgName, msgData, this._packagePropertyValues());

	  // Check first to see if we have a messageHandler defined to post the message to
	  if (typeof this.globalObj.webkit != 'undefined' &&
	    typeof this.globalObj.webkit.messageHandlers != 'undefined' &&
	    typeof this.globalObj.webkit.messageHandlers.wdcHandler != 'undefined') {
	    this.globalObj.webkit.messageHandlers.wdcHandler.postMessage(messagePayload);
	  } else if (!this._sourceWindow) {
	    throw "Looks like the WDC is calling a tableau function before tableau.init() has been called."
	  } else {
	    this._sourceWindow.postMessage(messagePayload, "*");
	  }
	}

	SimulatorDispatcher.prototype._getPayloadObj = function(payloadString) {
	  var payload = null;
	  try {
	    payload = JSON.parse(payloadString);
	  } catch(e) {
	    return null;
	  }

	  return payload;
	}

	SimulatorDispatcher.prototype._getWebSecurityWarningConfirm = function() {
	  var hostName = this._sourceWindow.location.hostname;

	  var supportedHosts = ["localhost", "tableau.github.io"];
	  if (supportedHosts.indexOf(hostName) >= 0) {
	      return true;
	  }
	  // Whitelist Tableau domains
	  if (hostName && hostName.endsWith("online.tableau.com")) {
	      return true;
	  }

	  var localizedWarningTitle = this._getLocalizedString("webSecurityWarning");
	  var completeWarningMsg  = localizedWarningTitle + "\n\n" + hostName + "\n";
	  return confirm(completeWarningMsg);
	}

	SimulatorDispatcher.prototype._getCurrentLocale = function() {
	    // Use current browser's locale to get a localized warning message
	    var currentBrowserLanguage = (navigator.language || navigator.userLanguage);
	    var locale = currentBrowserLanguage? currentBrowserLanguage.substring(0, 2): "en";

	    var supportedLocales = ["de", "en", "es", "fr", "ja", "ko", "pt", "zh"];
	    // Fall back to English for other unsupported lanaguages
	    if (supportedLocales.indexOf(locale) < 0) {
	        locale = 'en';
	    }

	    return locale;
	}

	SimulatorDispatcher.prototype._getLocalizedString = function(stringKey) {
	    var locale = this._getCurrentLocale();

	    // Use static require here, otherwise webpack would generate a much bigger JS file
	    var deStringsMap = __webpack_require__(7);
	    var enStringsMap = __webpack_require__(8);
	    var esStringsMap = __webpack_require__(9);
	    var jaStringsMap = __webpack_require__(11);
	    var frStringsMap = __webpack_require__(10);
	    var koStringsMap = __webpack_require__(12);
	    var ptStringsMap = __webpack_require__(13);
	    var zhStringsMap = __webpack_require__(14);

	    var stringJsonMapByLocale =
	    {
	        "de": deStringsMap,
	        "en": enStringsMap,
	        "es": esStringsMap,
	        "fr": frStringsMap,
	        "ja": jaStringsMap,
	        "ko": koStringsMap,
	        "pt": ptStringsMap,
	        "zh": zhStringsMap
	    };

	    var localizedStringsJson = stringJsonMapByLocale[locale];
	    return localizedStringsJson[stringKey];
	}

	SimulatorDispatcher.prototype._receiveMessage = function(evt) {
	  console.log("Received message!");

	  var wdc = this.globalObj._wdc;
	  if (!wdc) {
	    throw "No WDC registered. Did you forget to call tableau.registerConnector?";
	  }

	  var payloadObj = this._getPayloadObj(evt.data);
	  if(!payloadObj) return; // This message is not needed for WDC

	  if (!this._sourceWindow) {
	    this._sourceWindow = evt.source
	  }

	  var msgData = payloadObj.msgData;
	  this._applyPropertyValues(payloadObj.props);

	  switch(payloadObj.msgName) {
	    case "init":
	      // Warn users about possible phinishing attacks
	      var confirmResult = this._getWebSecurityWarningConfirm();
	      if (!confirmResult) {
	        window.close();
	      } else {
	        this.globalObj.tableau.phase = msgData.phase;
	        this.globalObj._tableau.triggerInitialization();
	      }

	      break;
	    case "shutdown":
	      this.globalObj._tableau.triggerShutdown();
	      break;
	    case "getSchema":
	      this.globalObj._tableau.triggerSchemaGathering();
	      break;
	    case "getData":
	      this.globalObj._tableau.triggerDataGathering(msgData.tablesAndIncrementValues);
	      break;
	  }
	};

	/**** PUBLIC INTERFACE *****/
	SimulatorDispatcher.prototype._initPublicInterface = function() {
	  console.log("Initializing public interface");
	  this._submitCalled = false;

	  var publicInterface = {};
	  publicInterface.abortForAuth = this._abortForAuth.bind(this);
	  publicInterface.abortWithError = this._abortWithError.bind(this);
	  publicInterface.addCrossOriginException = this._addCrossOriginException.bind(this);
	  publicInterface.log = this._log.bind(this);
	  publicInterface.submit = this._submit.bind(this);

	  // Assign the public interface to this
	  this.publicInterface = publicInterface;
	}

	SimulatorDispatcher.prototype._abortForAuth = function(msg) {
	  this._sendMessage("abortForAuth", {"msg": msg});
	}

	SimulatorDispatcher.prototype._abortWithError = function(msg) {
	  this._sendMessage("abortWithError", {"errorMsg": msg});
	}

	SimulatorDispatcher.prototype._addCrossOriginException = function(destOriginList) {
	  // Don't bother passing this back to the simulator since there's nothing it can
	  // do. Just call back to the WDC indicating that it worked
	  console.log("Cross Origin Exception requested in the simulator. Pretending to work.")
	  setTimeout(function() {
	    this.globalObj._wdc.addCrossOriginExceptionCompleted(destOriginList);
	  }, 0);
	}

	SimulatorDispatcher.prototype._log = function(msg) {
	  this._sendMessage("log", {"logMsg": msg});
	}

	SimulatorDispatcher.prototype._submit = function() {
	  this._sendMessage("submit");
	};

	/**** PRIVATE INTERFACE *****/
	SimulatorDispatcher.prototype._initPrivateInterface = function() {
	  console.log("Initializing private interface");

	  var privateInterface = {};
	  privateInterface._initCallback = this._initCallback.bind(this);
	  privateInterface._shutdownCallback = this._shutdownCallback.bind(this);
	  privateInterface._schemaCallback = this._schemaCallback.bind(this);
	  privateInterface._tableDataCallback = this._tableDataCallback.bind(this);
	  privateInterface._dataDoneCallback = this._dataDoneCallback.bind(this);

	  // Assign the private interface to this
	  this.privateInterface = privateInterface;
	}

	SimulatorDispatcher.prototype._initCallback = function() {
	  this._sendMessage("initCallback");
	}

	SimulatorDispatcher.prototype._shutdownCallback = function() {
	  this._sendMessage("shutdownCallback");
	}

	SimulatorDispatcher.prototype._schemaCallback = function(schema, standardConnections) {
	  this._sendMessage("_schemaCallback", {"schema": schema, "standardConnections" : standardConnections || []});
	}

	SimulatorDispatcher.prototype._tableDataCallback = function(tableName, data) {
	  this._sendMessage("_tableDataCallback", { "tableName": tableName, "data": data });
	}

	SimulatorDispatcher.prototype._dataDoneCallback = function() {
	  this._sendMessage("_dataDoneCallback");
	}

	module.exports = SimulatorDispatcher;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	* @class Represents a single table which Tableau has requested
	* @param tableInfo {Object} - Information about the table
	* @param incrementValue {string=} - Incremental update value
	*/
	function Table(tableInfo, incrementValue, dataCallbackFn) {
	  /** @member {Object} Information about the table which has been requested. This is
	  guaranteed to be one of the tables the connector returned in the call to getSchema. */
	  this.tableInfo = tableInfo;

	  /** @member {string} Defines the incremental update value for this table. Empty string if
	  there is not an incremental update requested. */
	  this.incrementValue = incrementValue || "";

	  /** @private */
	  this._dataCallbackFn = dataCallbackFn;
	}

	/**
	* @method appends the given rows to the set of data contained in this table
	* @param data {array} - Either an array of arrays or an array of objects which represent
	* the individual rows of data to append to this table
	*/
	Table.prototype.appendRows = function(data) {
	  // Do some quick validation that this data is the format we expect
	  if (!data) {
	    console.warn("rows data is null or undefined");
	    return;
	  }

	  if (!Array.isArray(data)) {
	    // Log a warning because the data is not an array like we expected
	    console.warn("Table.appendRows must take an array of arrays or array of objects");
	    return;
	  }

	  // Call back with the rows for this table
	  this._dataCallbackFn(this.tableInfo.id, data);
	}

	module.exports = Table;


/***/ },
/* 6 */
/***/ function(module, exports) {

	function copyFunctions(src, dest) {
	  for(var key in src) {
	    if (typeof src[key] === 'function') {
	      dest[key] = src[key];
	    }
	  }
	}

	module.exports.copyFunctions = copyFunctions;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "wwTo help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/****************************************************************************
	**
	** Copyright (C) 2015 The Qt Company Ltd.
	** Copyright (C) 2014 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
	** Contact: http://www.qt.io/licensing/
	**
	** This file is part of the QtWebChannel module of the Qt Toolkit.
	**
	** $QT_BEGIN_LICENSE:LGPL21$
	** Commercial License Usage
	** Licensees holding valid commercial Qt licenses may use this file in
	** accordance with the commercial license agreement provided with the
	** Software or, alternatively, in accordance with the terms contained in
	** a written agreement between you and The Qt Company. For licensing terms
	** and conditions see http://www.qt.io/terms-conditions. For further
	** information use the contact form at http://www.qt.io/contact-us.
	**
	** GNU Lesser General Public License Usage
	** Alternatively, this file may be used under the terms of the GNU Lesser
	** General Public License version 2.1 or version 3 as published by the Free
	** Software Foundation and appearing in the file LICENSE.LGPLv21 and
	** LICENSE.LGPLv3 included in the packaging of this file. Please review the
	** following information to ensure the GNU Lesser General Public License
	** requirements will be met: https://www.gnu.org/licenses/lgpl.html and
	** http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html.
	**
	** As a special exception, The Qt Company gives you certain additional
	** rights. These rights are described in The Qt Company LGPL Exception
	** version 1.1, included in the file LGPL_EXCEPTION.txt in this package.
	**
	** $QT_END_LICENSE$
	**
	****************************************************************************/

	"use strict";

	var QWebChannelMessageTypes = {
	    signal: 1,
	    propertyUpdate: 2,
	    init: 3,
	    idle: 4,
	    debug: 5,
	    invokeMethod: 6,
	    connectToSignal: 7,
	    disconnectFromSignal: 8,
	    setProperty: 9,
	    response: 10,
	};

	var QWebChannel = function(transport, initCallback)
	{
	    if (typeof transport !== "object" || typeof transport.send !== "function") {
	        console.error("The QWebChannel expects a transport object with a send function and onmessage callback property." +
	                      " Given is: transport: " + typeof(transport) + ", transport.send: " + typeof(transport.send));
	        return;
	    }

	    var channel = this;
	    this.transport = transport;

	    this.send = function(data)
	    {
	        if (typeof(data) !== "string") {
	            data = JSON.stringify(data);
	        }
	        channel.transport.send(data);
	    }

	    this.transport.onmessage = function(message)
	    {
	        var data = message.data;
	        if (typeof data === "string") {
	            data = JSON.parse(data);
	        }
	        switch (data.type) {
	            case QWebChannelMessageTypes.signal:
	                channel.handleSignal(data);
	                break;
	            case QWebChannelMessageTypes.response:
	                channel.handleResponse(data);
	                break;
	            case QWebChannelMessageTypes.propertyUpdate:
	                channel.handlePropertyUpdate(data);
	                break;
	            default:
	                console.error("invalid message received:", message.data);
	                break;
	        }
	    }

	    this.execCallbacks = {};
	    this.execId = 0;
	    this.exec = function(data, callback)
	    {
	        if (!callback) {
	            // if no callback is given, send directly
	            channel.send(data);
	            return;
	        }
	        if (channel.execId === Number.MAX_VALUE) {
	            // wrap
	            channel.execId = Number.MIN_VALUE;
	        }
	        if (data.hasOwnProperty("id")) {
	            console.error("Cannot exec message with property id: " + JSON.stringify(data));
	            return;
	        }
	        data.id = channel.execId++;
	        channel.execCallbacks[data.id] = callback;
	        channel.send(data);
	    };

	    this.objects = {};

	    this.handleSignal = function(message)
	    {
	        var object = channel.objects[message.object];
	        if (object) {
	            object.signalEmitted(message.signal, message.args);
	        } else {
	            console.warn("Unhandled signal: " + message.object + "::" + message.signal);
	        }
	    }

	    this.handleResponse = function(message)
	    {
	        if (!message.hasOwnProperty("id")) {
	            console.error("Invalid response message received: ", JSON.stringify(message));
	            return;
	        }
	        channel.execCallbacks[message.id](message.data);
	        delete channel.execCallbacks[message.id];
	    }

	    this.handlePropertyUpdate = function(message)
	    {
	        for (var i in message.data) {
	            var data = message.data[i];
	            var object = channel.objects[data.object];
	            if (object) {
	                object.propertyUpdate(data.signals, data.properties);
	            } else {
	                console.warn("Unhandled property update: " + data.object + "::" + data.signal);
	            }
	        }
	        channel.exec({type: QWebChannelMessageTypes.idle});
	    }

	    this.debug = function(message)
	    {
	        channel.send({type: QWebChannelMessageTypes.debug, data: message});
	    };

	    channel.exec({type: QWebChannelMessageTypes.init}, function(data) {
	        for (var objectName in data) {
	            var object = new QObject(objectName, data[objectName], channel);
	        }
	        // now unwrap properties, which might reference other registered objects
	        for (var objectName in channel.objects) {
	            channel.objects[objectName].unwrapProperties();
	        }
	        if (initCallback) {
	            initCallback(channel);
	        }
	        channel.exec({type: QWebChannelMessageTypes.idle});
	    });
	};

	function QObject(name, data, webChannel)
	{
	    this.__id__ = name;
	    webChannel.objects[name] = this;

	    // List of callbacks that get invoked upon signal emission
	    this.__objectSignals__ = {};

	    // Cache of all properties, updated when a notify signal is emitted
	    this.__propertyCache__ = {};

	    var object = this;

	    // ----------------------------------------------------------------------

	    this.unwrapQObject = function(response)
	    {
	        if (response instanceof Array) {
	            // support list of objects
	            var ret = new Array(response.length);
	            for (var i = 0; i < response.length; ++i) {
	                ret[i] = object.unwrapQObject(response[i]);
	            }
	            return ret;
	        }
	        if (!response
	            || !response["__QObject*__"]
	            || response["id"] === undefined) {
	            return response;
	        }

	        var objectId = response.id;
	        if (webChannel.objects[objectId])
	            return webChannel.objects[objectId];

	        if (!response.data) {
	            console.error("Cannot unwrap unknown QObject " + objectId + " without data.");
	            return;
	        }

	        var qObject = new QObject( objectId, response.data, webChannel );
	        qObject.destroyed.connect(function() {
	            if (webChannel.objects[objectId] === qObject) {
	                delete webChannel.objects[objectId];
	                // reset the now deleted QObject to an empty {} object
	                // just assigning {} though would not have the desired effect, but the
	                // below also ensures all external references will see the empty map
	                // NOTE: this detour is necessary to workaround QTBUG-40021
	                var propertyNames = [];
	                for (var propertyName in qObject) {
	                    propertyNames.push(propertyName);
	                }
	                for (var idx in propertyNames) {
	                    delete qObject[propertyNames[idx]];
	                }
	            }
	        });
	        // here we are already initialized, and thus must directly unwrap the properties
	        qObject.unwrapProperties();
	        return qObject;
	    }

	    this.unwrapProperties = function()
	    {
	        for (var propertyIdx in object.__propertyCache__) {
	            object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx]);
	        }
	    }

	    function addSignal(signalData, isPropertyNotifySignal)
	    {
	        var signalName = signalData[0];
	        var signalIndex = signalData[1];
	        object[signalName] = {
	            connect: function(callback) {
	                if (typeof(callback) !== "function") {
	                    console.error("Bad callback given to connect to signal " + signalName);
	                    return;
	                }

	                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
	                object.__objectSignals__[signalIndex].push(callback);

	                if (!isPropertyNotifySignal && signalName !== "destroyed") {
	                    // only required for "pure" signals, handled separately for properties in propertyUpdate
	                    // also note that we always get notified about the destroyed signal
	                    webChannel.exec({
	                        type: QWebChannelMessageTypes.connectToSignal,
	                        object: object.__id__,
	                        signal: signalIndex
	                    });
	                }
	            },
	            disconnect: function(callback) {
	                if (typeof(callback) !== "function") {
	                    console.error("Bad callback given to disconnect from signal " + signalName);
	                    return;
	                }
	                object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || [];
	                var idx = object.__objectSignals__[signalIndex].indexOf(callback);
	                if (idx === -1) {
	                    console.error("Cannot find connection of signal " + signalName + " to " + callback.name);
	                    return;
	                }
	                object.__objectSignals__[signalIndex].splice(idx, 1);
	                if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
	                    // only required for "pure" signals, handled separately for properties in propertyUpdate
	                    webChannel.exec({
	                        type: QWebChannelMessageTypes.disconnectFromSignal,
	                        object: object.__id__,
	                        signal: signalIndex
	                    });
	                }
	            }
	        };
	    }

	    /**
	     * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
	     */
	    function invokeSignalCallbacks(signalName, signalArgs)
	    {
	        var connections = object.__objectSignals__[signalName];
	        if (connections) {
	            connections.forEach(function(callback) {
	                callback.apply(callback, signalArgs);
	            });
	        }
	    }

	    this.propertyUpdate = function(signals, propertyMap)
	    {
	        // update property cache
	        for (var propertyIndex in propertyMap) {
	            var propertyValue = propertyMap[propertyIndex];
	            object.__propertyCache__[propertyIndex] = propertyValue;
	        }

	        for (var signalName in signals) {
	            // Invoke all callbacks, as signalEmitted() does not. This ensures the
	            // property cache is updated before the callbacks are invoked.
	            invokeSignalCallbacks(signalName, signals[signalName]);
	        }
	    }

	    this.signalEmitted = function(signalName, signalArgs)
	    {
	        invokeSignalCallbacks(signalName, signalArgs);
	    }

	    function addMethod(methodData)
	    {
	        var methodName = methodData[0];
	        var methodIdx = methodData[1];
	        object[methodName] = function() {
	            var args = [];
	            var callback;
	            for (var i = 0; i < arguments.length; ++i) {
	                if (typeof arguments[i] === "function")
	                    callback = arguments[i];
	                else
	                    args.push(arguments[i]);
	            }

	            webChannel.exec({
	                "type": QWebChannelMessageTypes.invokeMethod,
	                "object": object.__id__,
	                "method": methodIdx,
	                "args": args
	            }, function(response) {
	                if (response !== undefined) {
	                    var result = object.unwrapQObject(response);
	                    if (callback) {
	                        (callback)(result);
	                    }
	                }
	            });
	        };
	    }

	    function bindGetterSetter(propertyInfo)
	    {
	        var propertyIndex = propertyInfo[0];
	        var propertyName = propertyInfo[1];
	        var notifySignalData = propertyInfo[2];
	        // initialize property cache with current value
	        // NOTE: if this is an object, it is not directly unwrapped as it might
	        // reference other QObject that we do not know yet
	        object.__propertyCache__[propertyIndex] = propertyInfo[3];

	        if (notifySignalData) {
	            if (notifySignalData[0] === 1) {
	                // signal name is optimized away, reconstruct the actual name
	                notifySignalData[0] = propertyName + "Changed";
	            }
	            addSignal(notifySignalData, true);
	        }

	        Object.defineProperty(object, propertyName, {
	            get: function () {
	                var propertyValue = object.__propertyCache__[propertyIndex];
	                if (propertyValue === undefined) {
	                    // This shouldn't happen
	                    console.warn("Undefined value in property cache for property \"" + propertyName + "\" in object " + object.__id__);
	                }

	                return propertyValue;
	            },
	            set: function(value) {
	                if (value === undefined) {
	                    console.warn("Property setter for " + propertyName + " called with undefined value!");
	                    return;
	                }
	                object.__propertyCache__[propertyIndex] = value;
	                webChannel.exec({
	                    "type": QWebChannelMessageTypes.setProperty,
	                    "object": object.__id__,
	                    "property": propertyIndex,
	                    "value": value
	                });
	            }
	        });

	    }

	    // ----------------------------------------------------------------------

	    data.methods.forEach(addMethod);

	    data.properties.forEach(bindGetterSetter);

	    data.signals.forEach(function(signal) { addSignal(signal, false); });

	    for (var name in data.enums) {
	        object[name] = data.enums[name];
	    }
	}

	//required for use with nodejs
	if (true) {
	    module.exports = {
	        QWebChannel: QWebChannel
	    };
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Utilities = __webpack_require__(6);
	var Shared = __webpack_require__(3);
	var NativeDispatcher = __webpack_require__(2);
	var SimulatorDispatcher = __webpack_require__(4);
	var qwebchannel = __webpack_require__(15);

	/** @module ShimLibrary - This module defines the WDC's shim library which is used
	to bridge the gap between the javascript code of the WDC and the driving context
	of the WDC (Tableau desktop, the simulator, etc.) */

	// This function should be called once bootstrapping has been completed and the
	// dispatcher and shared WDC objects are both created and available
	function bootstrappingFinished(_dispatcher, _shared) {
	  Utilities.copyFunctions(_dispatcher.publicInterface, window.tableau);
	  Utilities.copyFunctions(_dispatcher.privateInterface, window._tableau);
	  _shared.init();
	}

	// Initializes the wdc shim library. You must call this before doing anything with WDC
	module.exports.init = function() {

	  // The initial code here is the only place in our module which should have global
	  // knowledge of how all the WDC components are glued together. This is the only place
	  // which will know about the window object or other global objects. This code will be run
	  // immediately when the shim library loads and is responsible for determining the context
	  // which it is running it and setup a communications channel between the js & running code
	  var dispatcher = null;
	  var shared = null;

	  // Always define the private _tableau object at the start
	  window._tableau = {};

	  // Check to see if the tableauVersionBootstrap is defined as a global object. If so,
	  // we are running in the Tableau desktop/server context. If not, we're running in the simulator
	  if (!!window.tableauVersionBootstrap) {
	    // We have the tableau object defined
	    console.log("Initializing NativeDispatcher, Reporting version number");
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.1.1"));
	    dispatcher = new NativeDispatcher(window);
	  } else if (!!window.qt && !!window.qt.webChannelTransport) {
	    console.log("Initializing NativeDispatcher for qwebchannel");
	    window.tableau = {};

	    // We're running in a context where the webChannelTransport is available. This means QWebEngine is in use
	    window.channel = new qwebchannel.QWebChannel(qt.webChannelTransport, function(channel) {
	      console.log("QWebChannel created successfully");

	      // Define the function which tableau will call after it has inserted all the required objects into the javascript frame
	      window._tableau._nativeSetupCompleted = function() {
	        // Once the native code tells us everything here is done, we should have all the expected objects inserted into js
	        dispatcher = new NativeDispatcher(channel.objects);
	        window.tableau = channel.objects.tableau;
	        shared.changeTableauApiObj(window.tableau);
	        bootstrappingFinished(dispatcher, shared);
	      };

	      // Actually call into the version bootstrapper to report our version number
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.1.1"));
	    });
	  } else {
	    console.log("Version Bootstrap is not defined, Initializing SimulatorDispatcher");
	    window.tableau = {};
	    dispatcher = new SimulatorDispatcher(window);
	  }

	  // Initialize the shared WDC object and add in our enum values
	  shared = new Shared(window.tableau, window._tableau, window);

	  // Check to see if the dispatcher is already defined and immediately call the
	  // callback if so
	  if (dispatcher) {
	    bootstrappingFinished(dispatcher, shared);
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDg5Nzk4ODMxZTgyNDI1ZmNiZGM3Iiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0VudW1zLmpzIiwid2VicGFjazovLy8uL05hdGl2ZURpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vU2hhcmVkLmpzIiwid2VicGFjazovLy8uL1NpbXVsYXRvckRpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vVGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vVXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24iLCJ3ZWJwYWNrOi8vLy4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi90YWJsZWF1d2RjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgODk3OTg4MzFlODI0MjVmY2JkYzdcbiAqKi8iLCIvLyBNYWluIGVudHJ5IHBvaW50IHRvIHB1bGwgdG9nZXRoZXIgZXZlcnl0aGluZyBuZWVkZWQgZm9yIHRoZSBXREMgc2hpbSBsaWJyYXJ5XG4vLyBUaGlzIGZpbGUgd2lsbCBiZSBleHBvcnRlZCBhcyBhIGJ1bmRsZWQganMgZmlsZSBieSB3ZWJwYWNrIHNvIGl0IGNhbiBiZSBpbmNsdWRlZFxuLy8gaW4gYSA8c2NyaXB0PiB0YWcgaW4gYW4gaHRtbCBkb2N1bWVudC4gQWxlcm5hdGl2ZWx5LCBhIGNvbm5lY3RvciBtYXkgaW5jbHVkZVxuLy8gdGhpcyB3aG9sZSBwYWNrYWdlIGluIHRoZWlyIGNvZGUgYW5kIHdvdWxkIG5lZWQgdG8gY2FsbCBpbml0IGxpa2UgdGhpc1xudmFyIHRhYmxlYXV3ZGMgPSByZXF1aXJlKCcuL3RhYmxlYXV3ZGMuanMnKTtcbnRhYmxlYXV3ZGMuaW5pdCgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIFRoaXMgZmlsZSBsaXN0cyBhbGwgb2YgdGhlIGVudW1zIHdoaWNoIHNob3VsZCBhdmFpbGFibGUgZm9yIHRoZSBXREMgKi9cbnZhciBhbGxFbnVtcyA9IHtcbiAgcGhhc2VFbnVtIDoge1xuICAgIGludGVyYWN0aXZlUGhhc2U6IFwiaW50ZXJhY3RpdmVcIixcbiAgICBhdXRoUGhhc2U6IFwiYXV0aFwiLFxuICAgIGdhdGhlckRhdGFQaGFzZTogXCJnYXRoZXJEYXRhXCJcbiAgfSxcblxuICBhdXRoUHVycG9zZUVudW0gOiB7XG4gICAgZXBoZW1lcmFsOiBcImVwaGVtZXJhbFwiLFxuICAgIGVuZHVyaW5nOiBcImVuZHVyaW5nXCJcbiAgfSxcblxuICBhdXRoVHlwZUVudW0gOiB7XG4gICAgbm9uZTogXCJub25lXCIsXG4gICAgYmFzaWM6IFwiYmFzaWNcIixcbiAgICBjdXN0b206IFwiY3VzdG9tXCJcbiAgfSxcblxuICBkYXRhVHlwZUVudW0gOiB7XG4gICAgYm9vbDogXCJib29sXCIsXG4gICAgZGF0ZTogXCJkYXRlXCIsXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZXRpbWVcIixcbiAgICBmbG9hdDogXCJmbG9hdFwiLFxuICAgIGludDogXCJpbnRcIixcbiAgICBzdHJpbmc6IFwic3RyaW5nXCJcbiAgfSxcblxuICBjb2x1bW5Sb2xlRW51bSA6IHtcbiAgICAgIGRpbWVuc2lvbjogXCJkaW1lbnNpb25cIixcbiAgICAgIG1lYXN1cmU6IFwibWVhc3VyZVwiXG4gIH0sXG5cbiAgY29sdW1uVHlwZUVudW0gOiB7XG4gICAgICBjb250aW51b3VzOiBcImNvbnRpbnVvdXNcIixcbiAgICAgIGRpc2NyZXRlOiBcImRpc2NyZXRlXCJcbiAgfSxcblxuICBhZ2dUeXBlRW51bSA6IHtcbiAgICAgIHN1bTogXCJzdW1cIixcbiAgICAgIGF2ZzogXCJhdmdcIixcbiAgICAgIG1lZGlhbjogXCJtZWRpYW5cIixcbiAgICAgIGNvdW50OiBcImNvdW50XCIsXG4gICAgICBjb3VudGQ6IFwiY291bnRfZGlzdFwiXG4gIH0sXG5cbiAgZ2VvZ3JhcGhpY1JvbGVFbnVtIDoge1xuICAgICAgYXJlYV9jb2RlOiBcImFyZWFfY29kZVwiLFxuICAgICAgY2JzYV9tc2E6IFwiY2JzYV9tc2FcIixcbiAgICAgIGNpdHk6IFwiY2l0eVwiLFxuICAgICAgY29uZ3Jlc3Npb25hbF9kaXN0cmljdDogXCJjb25ncmVzc2lvbmFsX2Rpc3RyaWN0XCIsXG4gICAgICBjb3VudHJ5X3JlZ2lvbjogXCJjb3VudHJ5X3JlZ2lvblwiLFxuICAgICAgY291bnR5OiBcImNvdW50eVwiLFxuICAgICAgc3RhdGVfcHJvdmluY2U6IFwic3RhdGVfcHJvdmluY2VcIixcbiAgICAgIHppcF9jb2RlX3Bvc3Rjb2RlOiBcInppcF9jb2RlX3Bvc3Rjb2RlXCIsXG4gICAgICBsYXRpdHVkZTogXCJsYXRpdHVkZVwiLFxuICAgICAgbG9uZ2l0dWRlOiBcImxvbmdpdHVkZVwiXG4gIH0sXG5cbiAgdW5pdHNGb3JtYXRFbnVtIDoge1xuICAgICAgdGhvdXNhbmRzOiBcInRob3VzYW5kc1wiLFxuICAgICAgbWlsbGlvbnM6IFwibWlsbGlvbnNcIixcbiAgICAgIGJpbGxpb25zX2VuZ2xpc2g6IFwiYmlsbGlvbnNfZW5nbGlzaFwiLFxuICAgICAgYmlsbGlvbnNfc3RhbmRhcmQ6IFwiYmlsbGlvbnNfc3RhbmRhcmRcIlxuICB9LFxuXG4gIG51bWJlckZvcm1hdEVudW0gOiB7XG4gICAgICBudW1iZXI6IFwibnVtYmVyXCIsXG4gICAgICBjdXJyZW5jeTogXCJjdXJyZW5jeVwiLFxuICAgICAgc2NpZW50aWZpYzogXCJzY2llbnRpZmljXCIsXG4gICAgICBwZXJjZW50YWdlOiBcInBlcmNlbnRhZ2VcIlxuICB9LFxuXG4gIGxvY2FsZUVudW0gOiB7XG4gICAgICBhbWVyaWNhOiBcImVuLXVzXCIsXG4gICAgICBicmF6aWw6ICBcInB0LWJyXCIsXG4gICAgICBjaGluYTogICBcInpoLWNuXCIsXG4gICAgICBmcmFuY2U6ICBcImZyLWZyXCIsXG4gICAgICBnZXJtYW55OiBcImRlLWRlXCIsXG4gICAgICBqYXBhbjogICBcImphLWpwXCIsXG4gICAgICBrb3JlYTogICBcImtvLWtyXCIsXG4gICAgICBzcGFpbjogICBcImVzLWVzXCJcbiAgfSxcblxuICBqb2luRW51bSA6IHtcbiAgICAgIGlubmVyOiBcImlubmVyXCIsXG4gICAgICBsZWZ0OiBcImxlZnRcIlxuICB9XG59XG5cbi8vIEFwcGxpZXMgdGhlIGVudW1zIGFzIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldCBvYmplY3RcbmZ1bmN0aW9uIGFwcGx5KHRhcmdldCkge1xuICBmb3IodmFyIGtleSBpbiBhbGxFbnVtcykge1xuICAgIHRhcmdldFtrZXldID0gYWxsRW51bXNba2V5XTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL0VudW1zLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIEBjbGFzcyBVc2VkIGZvciBjb21tdW5pY2F0aW5nIGJldHdlZW4gVGFibGVhdSBkZXNrdG9wL3NlcnZlciBhbmQgdGhlIFdEQydzXG4qIEphdmFzY3JpcHQuIGlzIHByZWRvbWluYW50bHkgYSBwYXNzLXRocm91Z2ggdG8gdGhlIFF0IFdlYkJyaWRnZSBtZXRob2RzXG4qIEBwYXJhbSBuYXRpdmVBcGlSb290T2JqIHtPYmplY3R9IC0gVGhlIHJvb3Qgb2JqZWN0IHdoZXJlIHRoZSBuYXRpdmUgQXBpIG1ldGhvZHNcbiogYXJlIGF2YWlsYWJsZS4gRm9yIFdlYktpdCwgdGhpcyBpcyB3aW5kb3cuXG4qL1xuZnVuY3Rpb24gTmF0aXZlRGlzcGF0Y2hlciAobmF0aXZlQXBpUm9vdE9iaikge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmogPSBuYXRpdmVBcGlSb290T2JqO1xuICB0aGlzLl9pbml0UHVibGljSW50ZXJmYWNlKCk7XG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHB1YmxpYyBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IGZhbHNlO1xuXG4gIHZhciBwdWJsaWNJbnRlcmZhY2UgPSB7fTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0Rm9yQXV0aCA9IHRoaXMuX2Fib3J0Rm9yQXV0aC5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSB0aGlzLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbi5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UubG9nID0gdGhpcy5fbG9nLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5zdWJtaXQgPSB0aGlzLl9zdWJtaXQuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnJlcG9ydFByb2dyZXNzID0gdGhpcy5fcmVwb3J0UHJvZ3Jlc3MuYmluZCh0aGlzKTtcblxuICB0aGlzLnB1YmxpY0ludGVyZmFjZSA9IHB1YmxpY0ludGVyZmFjZTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0Rm9yQXV0aCA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9hYm9ydEZvckF1dGguYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydFdpdGhFcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9hYm9ydFdpdGhFcnJvci5hcGkobXNnKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gZnVuY3Rpb24oZGVzdE9yaWdpbkxpc3QpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYXBpKGRlc3RPcmlnaW5MaXN0KTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9sb2cuYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX3N1Ym1pdENhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwic3VibWl0IGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zdWJtaXQuYXBpKCk7XG59O1xuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFByaXZhdGVJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHJpdmF0ZSBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XG5cbiAgdGhpcy5faW5pdENhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX2RhdGFEb25lQ2FsbGJhY2sgPSB0aGlzLl9kYXRhRG9uZUNhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5faW5pdENhbGxiYWNrQ2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJpbml0Q2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IHRydWU7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2luaXRDYWxsYmFjay5hcGkoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NodXRkb3duQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcInNodXRkb3duQ2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zaHV0ZG93bkNhbGxiYWNrLmFwaSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2NoZW1hQ2FsbGJhY2sgPSBmdW5jdGlvbihzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMpIHtcbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHdlIGFyZSB1c2luZyBhIHZlcnNpb24gb2YgZGVza3RvcCB3aGljaCBoYXMgdGhlIFdEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCBkZWZpbmVkXG4gIGlmICghIXRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXgpIHtcbiAgICAvLyBQcm92aWRpbmcgc3RhbmRhcmRDb25uZWN0aW9ucyBpcyBvcHRpb25hbCBidXQgd2UgY2FuJ3QgcGFzcyB1bmRlZmluZWQgYmFjayBiZWNhdXNlIFF0IHdpbGwgY2hva2VcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4LmFwaShzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW10pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrLmFwaShzY2hlbWEpO1xuICB9XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV90YWJsZURhdGFDYWxsYmFjay5hcGkodGFibGVOYW1lLCBkYXRhKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3JlcG9ydFByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MuYXBpKHByb2dyZXNzKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfZGF0YURvbmVDYWxsYmFjay5hcGkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXRpdmVEaXNwYXRjaGVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL05hdGl2ZURpc3BhdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgVGFibGUgPSByZXF1aXJlKCcuL1RhYmxlLmpzJyk7XG52YXIgRW51bXMgPSByZXF1aXJlKCcuL0VudW1zLmpzJyk7XG5cbi8qKiBAY2xhc3MgVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBzaGFyZWQgcGFydHMgb2YgdGhlIGphdmFzY3JpcHRcbiogbGlicmFyeSB3aGljaCBkbyBub3QgaGF2ZSBhbnkgZGVwZW5kZW5jZSBvbiB3aGV0aGVyIHdlIGFyZSBydW5uaW5nIGluXG4qIHRoZSBzaW11bGF0b3IsIGluIFRhYmxlYXUsIG9yIGFueXdoZXJlIGVsc2VcbiogQHBhcmFtIHRhYmxlYXVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHRhYmxlYXUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cudGFibGVhdSlcbiogQHBhcmFtIHByaXZhdGVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHByaXZhdGUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cuX3RhYmxlYXUpXG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSBUaGUgZ2xvYmFsIG9iamVjdCB0byBhdHRhY2ggdGhpbmdzIHRvICh1c3VhbGx5IHdpbmRvdylcbiovXG5mdW5jdGlvbiBTaGFyZWQgKHRhYmxlYXVBcGlPYmosIHByaXZhdGVBcGlPYmosIGdsb2JhbE9iaikge1xuICB0aGlzLnByaXZhdGVBcGlPYmogPSBwcml2YXRlQXBpT2JqO1xuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IGZhbHNlO1xuXG4gIHRoaXMuY2hhbmdlVGFibGVhdUFwaU9iaih0YWJsZWF1QXBpT2JqKTtcbn1cblxuXG5TaGFyZWQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgc2hhcmVkIFdEQ1wiKTtcbiAgdGhpcy5nbG9iYWxPYmoub25lcnJvciA9IHRoaXMuX2Vycm9ySGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIG5hdGl2ZSBjb2RlXG4gIHRoaXMuX2luaXRUcmlnZ2VyRnVuY3Rpb25zKCk7XG5cbiAgLy8gQXNzaWduIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9ucyB3aGljaCBhcmVuJ3QgYXZhaWxpYmxlIGluIHRoaXMgdmVyc2lvbiBvZiB0aGUgQVBJXG4gIHRoaXMuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zKCk7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuY2hhbmdlVGFibGVhdUFwaU9iaiA9IGZ1bmN0aW9uKHRhYmxlYXVBcGlPYmopIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqID0gdGFibGVhdUFwaU9iajtcblxuICAvLyBBc3NpZ24gb3VyIG1ha2UgJiByZWdpc3RlciBmdW5jdGlvbnMgcmlnaHQgYXdheSBiZWNhdXNlIGEgY29ubmVjdG9yIGNhbiB1c2VcbiAgLy8gdGhlbSBpbW1lZGlhdGVseSwgZXZlbiBiZWZvcmUgYm9vdHN0cmFwcGluZyBoYXMgY29tcGxldGVkXG4gIHRoaXMudGFibGVhdUFwaU9iai5tYWtlQ29ubmVjdG9yID0gdGhpcy5fbWFrZUNvbm5lY3Rvci5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmoucmVnaXN0ZXJDb25uZWN0b3IgPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rvci5iaW5kKHRoaXMpO1xuXG4gIEVudW1zLmFwcGx5KHRoaXMudGFibGVhdUFwaU9iaik7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2Vycm9ySGFuZGxlciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGZpbGUsIGxpbmUsIGNvbHVtbiwgZXJyb3JPYmopIHtcbiAgY29uc29sZS5lcnJvcihlcnJvck9iaik7IC8vIHByaW50IGVycm9yIGZvciBkZWJ1Z2dpbmcgaW4gdGhlIGJyb3dzZXJcbiAgaWYgKHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBtc2cgPSBtZXNzYWdlO1xuICBpZihlcnJvck9iaikge1xuICAgIG1zZyArPSBcIiAgIHN0YWNrOlwiICsgZXJyb3JPYmouc3RhY2s7XG4gIH0gZWxzZSB7XG4gICAgbXNnICs9IFwiICAgZmlsZTogXCIgKyBmaWxlO1xuICAgIG1zZyArPSBcIiAgIGxpbmU6IFwiICsgbGluZTtcbiAgfVxuXG4gIGlmICh0aGlzLnRhYmxlYXVBcGlPYmogJiYgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKSB7XG4gICAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKG1zZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbXNnO1xuICB9XG5cbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IHRydWU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9tYWtlQ29ubmVjdG9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZhdWx0SW1wbHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfSxcbiAgICBzaHV0ZG93bjogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfVxuICB9O1xuXG4gIHJldHVybiBkZWZhdWx0SW1wbHM7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX3JlZ2lzdGVyQ29ubmVjdG9yID0gZnVuY3Rpb24gKHdkYykge1xuXG4gIC8vIGRvIHNvbWUgZXJyb3IgY2hlY2tpbmcgb24gdGhlIHdkY1xuICB2YXIgZnVuY3Rpb25OYW1lcyA9IFtcImluaXRcIiwgXCJzaHV0ZG93blwiLCBcImdldFNjaGVtYVwiLCBcImdldERhdGFcIl07XG4gIGZvciAodmFyIGlpID0gZnVuY3Rpb25OYW1lcy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XG4gICAgaWYgKHR5cGVvZih3ZGNbZnVuY3Rpb25OYW1lc1tpaV1dKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBcIlRoZSBjb25uZWN0b3IgZGlkIG5vdCBkZWZpbmUgdGhlIHJlcXVpcmVkIGZ1bmN0aW9uOiBcIiArIGZ1bmN0aW9uTmFtZXNbaWldO1xuICAgIH1cbiAgfTtcblxuICBjb25zb2xlLmxvZyhcIkNvbm5lY3RvciByZWdpc3RlcmVkXCIpO1xuXG4gIHRoaXMuZ2xvYmFsT2JqLl93ZGMgPSB3ZGM7XG4gIHRoaXMuX3dkYyA9IHdkYztcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5faW5pdFRyaWdnZXJGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJJbml0aWFsaXphdGlvbiA9IHRoaXMuX3RyaWdnZXJJbml0aWFsaXphdGlvbi5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlclNjaGVtYUdhdGhlcmluZyA9IHRoaXMuX3RyaWdnZXJTY2hlbWFHYXRoZXJpbmcuYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJEYXRhR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlckRhdGFHYXRoZXJpbmcuYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTaHV0ZG93biA9IHRoaXMuX3RyaWdnZXJTaHV0ZG93bi5iaW5kKHRoaXMpO1xufVxuXG4vLyBTdGFydHMgdGhlIFdEQ1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlckluaXRpYWxpemF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5pbml0KHRoaXMucHJpdmF0ZUFwaU9iai5faW5pdENhbGxiYWNrKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBzY2hlbWEgZ2F0aGVyaW5nIHByb2Nlc3NcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLmdldFNjaGVtYSh0aGlzLnByaXZhdGVBcGlPYmouX3NjaGVtYUNhbGxiYWNrKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBkYXRhIGdhdGhlcmluZyBwcm9jZXNzXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyRGF0YUdhdGhlcmluZyA9IGZ1bmN0aW9uKHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcykge1xuICBpZiAodGFibGVzQW5kSW5jcmVtZW50VmFsdWVzLmxlbmd0aCAhPSAxKSB7XG4gICAgdGhyb3cgKFwiVW5leHBlY3RlZCBudW1iZXIgb2YgdGFibGVzIHNwZWNpZmllZC4gRXhwZWN0ZWQgMSwgYWN0dWFsIFwiICsgdGFibGVzQW5kSW5jcmVtZW50VmFsdWVzLmxlbmd0aC50b1N0cmluZygpKTtcbiAgfVxuXG4gIHZhciB0YWJsZUFuZEluY3JlbW50VmFsdWUgPSB0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXNbMF07XG4gIHZhciB0YWJsZSA9IG5ldyBUYWJsZSh0YWJsZUFuZEluY3JlbW50VmFsdWUudGFibGVJbmZvLCB0YWJsZUFuZEluY3JlbW50VmFsdWUuaW5jcmVtZW50VmFsdWUsIHRoaXMucHJpdmF0ZUFwaU9iai5fdGFibGVEYXRhQ2FsbGJhY2spO1xuICB0aGlzLl93ZGMuZ2V0RGF0YSh0YWJsZSwgdGhpcy5wcml2YXRlQXBpT2JqLl9kYXRhRG9uZUNhbGxiYWNrKTtcbn1cblxuLy8gVGVsbHMgdGhlIFdEQyBpdCdzIHRpbWUgdG8gc2h1dCBkb3duXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyU2h1dGRvd24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLnNodXRkb3duKHRoaXMucHJpdmF0ZUFwaU9iai5fc2h1dGRvd25DYWxsYmFjayk7XG59XG5cbi8vIEluaXRpYWxpemVzIGEgc2VyaWVzIG9mIGdsb2JhbCBjYWxsYmFja3Mgd2hpY2ggaGF2ZSBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMFxuU2hhcmVkLnByb3RvdHlwZS5faW5pdERlcHJlY2F0ZWRGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmluaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouaGVhZGVyc0NhbGxiYWNrID0gdGhpcy5faGVhZGVyc0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5kYXRhQ2FsbGJhY2sgPSB0aGlzLl9kYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLnNodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5pbml0Q2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gaW5pdFwiKTtcbn07XG5cblNoYXJlZC5wcm90b3R5cGUuX2hlYWRlcnNDYWxsYmFjayA9IGZ1bmN0aW9uIChmaWVsZE5hbWVzLCB0eXBlcykge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LmhlYWRlcnNDYWxsYmFjayBoYXMgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9kYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSwgbGFzdFJlY29yZFRva2VuLCBtb3JlRGF0YSkge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LmRhdGFDYWxsYmFjayBoYXMgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LnNodXRkb3duQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gc2h1dGRvd25cIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlZDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9TaGFyZWQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogQGNsYXNzIFVzZWQgZm9yIGNvbW11bmljYXRpbmcgYmV0d2VlbiB0aGUgc2ltdWxhdG9yIGFuZCB3ZWIgZGF0YSBjb25uZWN0b3IuIEl0IGRvZXNcbiogdGhpcyBieSBwYXNzaW5nIG1lc3NhZ2VzIGJldHdlZW4gdGhlIFdEQyB3aW5kb3cgYW5kIGl0cyBwYXJlbnQgd2luZG93XG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSB0aGUgZ2xvYmFsIG9iamVjdCB0byBmaW5kIHRhYmxlYXUgaW50ZXJmYWNlcyBhcyB3ZWxsXG4qIGFzIHJlZ2lzdGVyIGV2ZW50cyAodXN1YWxseSB3aW5kb3cpXG4qL1xuZnVuY3Rpb24gU2ltdWxhdG9yRGlzcGF0Y2hlciAoZ2xvYmFsT2JqKSB7XG4gIHRoaXMuZ2xvYmFsT2JqID0gZ2xvYmFsT2JqO1xuICB0aGlzLl9pbml0TWVzc2FnZUhhbmRsaW5nKCk7XG4gIHRoaXMuX2luaXRQdWJsaWNJbnRlcmZhY2UoKTtcbiAgdGhpcy5faW5pdFByaXZhdGVJbnRlcmZhY2UoKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRNZXNzYWdlSGFuZGxpbmcgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgbWVzc2FnZSBoYW5kbGluZ1wiKTtcbiAgdGhpcy5nbG9iYWxPYmouYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX3JlY2VpdmVNZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy5nbG9iYWxPYmouZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgdGhpcy5fb25Eb21Db250ZW50TG9hZGVkLmJpbmQodGhpcykpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fb25Eb21Db250ZW50TG9hZGVkID0gZnVuY3Rpb24oKSB7XG4gIC8vIEF0dGVtcHQgdG8gbm90aWZ5IHRoZSBzaW11bGF0b3Igd2luZG93IHRoYXQgdGhlIFdEQyBoYXMgbG9hZGVkXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLnBhcmVudCAhPT0gd2luZG93KSB7XG4gICAgdGhpcy5nbG9iYWxPYmoucGFyZW50LnBvc3RNZXNzYWdlKHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQoJ2xvYWRlZCcpLCAnKicpO1xuICB9XG5cbiAgaWYodGhpcy5nbG9iYWxPYmoub3BlbmVyKSB7XG4gICAgdHJ5IHsgLy8gV3JhcCBpbiB0cnkvY2F0Y2ggZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFXG4gICAgICB0aGlzLmdsb2JhbE9iai5vcGVuZXIucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NvbWUgdmVyc2lvbnMgb2YgSUUgbWF5IG5vdCBhY2N1cmF0ZWx5IHNpbXVsYXRlIHRoZSBXZWIgRGF0YSBDb25uZWN0b3IuIFBsZWFzZSByZXRyeSBvbiBhIFdlYmtpdCBiYXNlZCBicm93c2VyJyk7XG4gICAgfVxuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb3BWYWx1ZXMgPSB7XG4gICAgXCJjb25uZWN0aW9uTmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25OYW1lLFxuICAgIFwiY29ubmVjdGlvbkRhdGFcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uRGF0YSxcbiAgICBcInBhc3N3b3JkXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQsXG4gICAgXCJ1c2VybmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lLFxuICAgIFwidXNlcm5hbWVBbGlhc1wiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lQWxpYXMsXG4gICAgXCJpbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW5cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4sXG4gICAgXCJ2ZXJzaW9uTnVtYmVyXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudmVyc2lvbk51bWJlcixcbiAgICBcImxvY2FsZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmxvY2FsZSxcbiAgICBcImF1dGhQdXJwb3NlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UsXG4gICAgXCJwbGF0Zm9ybU9TXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyxcbiAgICBcInBsYXRmb3JtVmVyc2lvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbixcbiAgICBcInBsYXRmb3JtRWRpdGlvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbixcbiAgICBcInBsYXRmb3JtQnVpbGROdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyXG4gIH07XG5cbiAgcmV0dXJuIHByb3BWYWx1ZXM7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hcHBseVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgaWYgKHByb3BzKSB7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSA9IHByb3BzLmNvbm5lY3Rpb25OYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEgPSBwcm9wcy5jb25uZWN0aW9uRGF0YTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkID0gcHJvcHMucGFzc3dvcmQ7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSA9IHByb3BzLnVzZXJuYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyA9IHByb3BzLnVzZXJuYW1lQWxpYXM7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4gPSBwcm9wcy5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW47XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUgPSBwcm9wcy5sb2NhbGU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sYW5ndWFnZSA9IHByb3BzLmxvY2FsZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmF1dGhQdXJwb3NlID0gcHJvcHMuYXV0aFB1cnBvc2U7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TID0gcHJvcHMucGxhdGZvcm1PUztcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbiA9IHByb3BzLnBsYXRmb3JtVmVyc2lvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbiA9IHByb3BzLnBsYXRmb3JtRWRpdGlvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXIgPSBwcm9wcy5wbGF0Zm9ybUJ1aWxkTnVtYmVyO1xuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9idWlsZE1lc3NhZ2VQYXlsb2FkID0gZnVuY3Rpb24obXNnTmFtZSwgbXNnRGF0YSwgcHJvcHMpIHtcbiAgdmFyIG1zZ09iaiA9IHtcIm1zZ05hbWVcIjogbXNnTmFtZSwgXCJtc2dEYXRhXCI6IG1zZ0RhdGEsIFwicHJvcHNcIjogcHJvcHMsIFwidmVyc2lvblwiOiBCVUlMRF9OVU1CRVIgfTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1zZ09iaik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEpIHtcbiAgdmFyIG1lc3NhZ2VQYXlsb2FkID0gdGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZChtc2dOYW1lLCBtc2dEYXRhLCB0aGlzLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMoKSk7XG5cbiAgLy8gQ2hlY2sgZmlyc3QgdG8gc2VlIGlmIHdlIGhhdmUgYSBtZXNzYWdlSGFuZGxlciBkZWZpbmVkIHRvIHBvc3QgdGhlIG1lc3NhZ2UgdG9cbiAgaWYgKHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycyAhPSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQpO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9zb3VyY2VXaW5kb3cpIHtcbiAgICB0aHJvdyBcIkxvb2tzIGxpa2UgdGhlIFdEQyBpcyBjYWxsaW5nIGEgdGFibGVhdSBmdW5jdGlvbiBiZWZvcmUgdGFibGVhdS5pbml0KCkgaGFzIGJlZW4gY2FsbGVkLlwiXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc291cmNlV2luZG93LnBvc3RNZXNzYWdlKG1lc3NhZ2VQYXlsb2FkLCBcIipcIik7XG4gIH1cbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFBheWxvYWRPYmogPSBmdW5jdGlvbihwYXlsb2FkU3RyaW5nKSB7XG4gIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShwYXlsb2FkU3RyaW5nKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhvc3ROYW1lID0gdGhpcy5fc291cmNlV2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuXG4gIHZhciBzdXBwb3J0ZWRIb3N0cyA9IFtcImxvY2FsaG9zdFwiLCBcInRhYmxlYXUuZ2l0aHViLmlvXCJdO1xuICBpZiAoc3VwcG9ydGVkSG9zdHMuaW5kZXhPZihob3N0TmFtZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLy8gV2hpdGVsaXN0IFRhYmxlYXUgZG9tYWluc1xuICBpZiAoaG9zdE5hbWUgJiYgaG9zdE5hbWUuZW5kc1dpdGgoXCJvbmxpbmUudGFibGVhdS5jb21cIikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGxvY2FsaXplZFdhcm5pbmdUaXRsZSA9IHRoaXMuX2dldExvY2FsaXplZFN0cmluZyhcIndlYlNlY3VyaXR5V2FybmluZ1wiKTtcbiAgdmFyIGNvbXBsZXRlV2FybmluZ01zZyAgPSBsb2NhbGl6ZWRXYXJuaW5nVGl0bGUgKyBcIlxcblxcblwiICsgaG9zdE5hbWUgKyBcIlxcblwiO1xuICByZXR1cm4gY29uZmlybShjb21wbGV0ZVdhcm5pbmdNc2cpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0Q3VycmVudExvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFVzZSBjdXJyZW50IGJyb3dzZXIncyBsb2NhbGUgdG8gZ2V0IGEgbG9jYWxpemVkIHdhcm5pbmcgbWVzc2FnZVxuICAgIHZhciBjdXJyZW50QnJvd3Nlckxhbmd1YWdlID0gKG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IudXNlckxhbmd1YWdlKTtcbiAgICB2YXIgbG9jYWxlID0gY3VycmVudEJyb3dzZXJMYW5ndWFnZT8gY3VycmVudEJyb3dzZXJMYW5ndWFnZS5zdWJzdHJpbmcoMCwgMik6IFwiZW5cIjtcblxuICAgIHZhciBzdXBwb3J0ZWRMb2NhbGVzID0gW1wiZGVcIiwgXCJlblwiLCBcImVzXCIsIFwiZnJcIiwgXCJqYVwiLCBcImtvXCIsIFwicHRcIiwgXCJ6aFwiXTtcbiAgICAvLyBGYWxsIGJhY2sgdG8gRW5nbGlzaCBmb3Igb3RoZXIgdW5zdXBwb3J0ZWQgbGFuYWd1YWdlc1xuICAgIGlmIChzdXBwb3J0ZWRMb2NhbGVzLmluZGV4T2YobG9jYWxlKSA8IDApIHtcbiAgICAgICAgbG9jYWxlID0gJ2VuJztcbiAgICB9XG5cbiAgICByZXR1cm4gbG9jYWxlO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0TG9jYWxpemVkU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nS2V5KSB7XG4gICAgdmFyIGxvY2FsZSA9IHRoaXMuX2dldEN1cnJlbnRMb2NhbGUoKTtcblxuICAgIC8vIFVzZSBzdGF0aWMgcmVxdWlyZSBoZXJlLCBvdGhlcndpc2Ugd2VicGFjayB3b3VsZCBnZW5lcmF0ZSBhIG11Y2ggYmlnZ2VyIEpTIGZpbGVcbiAgICB2YXIgZGVTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbicpO1xuICAgIHZhciBlblN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uJyk7XG4gICAgdmFyIGVzU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VzLUVTLmpzb24nKTtcbiAgICB2YXIgamFTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfamEtSlAuanNvbicpO1xuICAgIHZhciBmclN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19mci1GUi5qc29uJyk7XG4gICAgdmFyIGtvU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2tvLUtSLmpzb24nKTtcbiAgICB2YXIgcHRTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbicpO1xuICAgIHZhciB6aFN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc196aC1DTi5qc29uJyk7XG5cbiAgICB2YXIgc3RyaW5nSnNvbk1hcEJ5TG9jYWxlID1cbiAgICB7XG4gICAgICAgIFwiZGVcIjogZGVTdHJpbmdzTWFwLFxuICAgICAgICBcImVuXCI6IGVuU3RyaW5nc01hcCxcbiAgICAgICAgXCJlc1wiOiBlc1N0cmluZ3NNYXAsXG4gICAgICAgIFwiZnJcIjogZnJTdHJpbmdzTWFwLFxuICAgICAgICBcImphXCI6IGphU3RyaW5nc01hcCxcbiAgICAgICAgXCJrb1wiOiBrb1N0cmluZ3NNYXAsXG4gICAgICAgIFwicHRcIjogcHRTdHJpbmdzTWFwLFxuICAgICAgICBcInpoXCI6IHpoU3RyaW5nc01hcFxuICAgIH07XG5cbiAgICB2YXIgbG9jYWxpemVkU3RyaW5nc0pzb24gPSBzdHJpbmdKc29uTWFwQnlMb2NhbGVbbG9jYWxlXTtcbiAgICByZXR1cm4gbG9jYWxpemVkU3RyaW5nc0pzb25bc3RyaW5nS2V5XTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3JlY2VpdmVNZXNzYWdlID0gZnVuY3Rpb24oZXZ0KSB7XG4gIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgbWVzc2FnZSFcIik7XG5cbiAgdmFyIHdkYyA9IHRoaXMuZ2xvYmFsT2JqLl93ZGM7XG4gIGlmICghd2RjKSB7XG4gICAgdGhyb3cgXCJObyBXREMgcmVnaXN0ZXJlZC4gRGlkIHlvdSBmb3JnZXQgdG8gY2FsbCB0YWJsZWF1LnJlZ2lzdGVyQ29ubmVjdG9yP1wiO1xuICB9XG5cbiAgdmFyIHBheWxvYWRPYmogPSB0aGlzLl9nZXRQYXlsb2FkT2JqKGV2dC5kYXRhKTtcbiAgaWYoIXBheWxvYWRPYmopIHJldHVybjsgLy8gVGhpcyBtZXNzYWdlIGlzIG5vdCBuZWVkZWQgZm9yIFdEQ1xuXG4gIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XG4gICAgdGhpcy5fc291cmNlV2luZG93ID0gZXZ0LnNvdXJjZVxuICB9XG5cbiAgdmFyIG1zZ0RhdGEgPSBwYXlsb2FkT2JqLm1zZ0RhdGE7XG4gIHRoaXMuX2FwcGx5UHJvcGVydHlWYWx1ZXMocGF5bG9hZE9iai5wcm9wcyk7XG5cbiAgc3dpdGNoKHBheWxvYWRPYmoubXNnTmFtZSkge1xuICAgIGNhc2UgXCJpbml0XCI6XG4gICAgICAvLyBXYXJuIHVzZXJzIGFib3V0IHBvc3NpYmxlIHBoaW5pc2hpbmcgYXR0YWNrc1xuICAgICAgdmFyIGNvbmZpcm1SZXN1bHQgPSB0aGlzLl9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtKCk7XG4gICAgICBpZiAoIWNvbmZpcm1SZXN1bHQpIHtcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBoYXNlID0gbXNnRGF0YS5waGFzZTtcbiAgICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckluaXRpYWxpemF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzaHV0ZG93blwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNodXRkb3duKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0U2NoZW1hXCI6XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0RGF0YVwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckRhdGFHYXRoZXJpbmcobXNnRGF0YS50YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8qKioqIFBVQkxJQyBJTlRFUkZBQ0UgKioqKiovXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwdWJsaWMgaW50ZXJmYWNlIHRvIHRoaXNcbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydEZvckF1dGhcIiwge1wibXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydFdpdGhFcnJvclwiLCB7XCJlcnJvck1zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gZnVuY3Rpb24oZGVzdE9yaWdpbkxpc3QpIHtcbiAgLy8gRG9uJ3QgYm90aGVyIHBhc3NpbmcgdGhpcyBiYWNrIHRvIHRoZSBzaW11bGF0b3Igc2luY2UgdGhlcmUncyBub3RoaW5nIGl0IGNhblxuICAvLyBkby4gSnVzdCBjYWxsIGJhY2sgdG8gdGhlIFdEQyBpbmRpY2F0aW5nIHRoYXQgaXQgd29ya2VkXG4gIGNvbnNvbGUubG9nKFwiQ3Jvc3MgT3JpZ2luIEV4Y2VwdGlvbiByZXF1ZXN0ZWQgaW4gdGhlIHNpbXVsYXRvci4gUHJldGVuZGluZyB0byB3b3JrLlwiKVxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2xvYmFsT2JqLl93ZGMuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb25Db21wbGV0ZWQoZGVzdE9yaWdpbkxpc3QpO1xuICB9LCAwKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImxvZ1wiLCB7XCJsb2dNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzdWJtaXRcIik7XG59O1xuXG4vKioqKiBQUklWQVRFIElOVEVSRkFDRSAqKioqKi9cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHJpdmF0ZUludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwcml2YXRlIGludGVyZmFjZVwiKTtcblxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX2RhdGFEb25lQ2FsbGJhY2sgPSB0aGlzLl9kYXRhRG9uZUNhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwcml2YXRlIGludGVyZmFjZSB0byB0aGlzXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJpbml0Q2FsbGJhY2tcIik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic2h1dGRvd25DYWxsYmFja1wiKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX3NjaGVtYUNhbGxiYWNrXCIsIHtcInNjaGVtYVwiOiBzY2hlbWEsIFwic3RhbmRhcmRDb25uZWN0aW9uc1wiIDogc3RhbmRhcmRDb25uZWN0aW9ucyB8fCBbXX0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfdGFibGVEYXRhQ2FsbGJhY2tcIiwgeyBcInRhYmxlTmFtZVwiOiB0YWJsZU5hbWUsIFwiZGF0YVwiOiBkYXRhIH0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9kYXRhRG9uZUNhbGxiYWNrXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRvckRpc3BhdGNoZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuKiBAY2xhc3MgUmVwcmVzZW50cyBhIHNpbmdsZSB0YWJsZSB3aGljaCBUYWJsZWF1IGhhcyByZXF1ZXN0ZWRcbiogQHBhcmFtIHRhYmxlSW5mbyB7T2JqZWN0fSAtIEluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWJsZVxuKiBAcGFyYW0gaW5jcmVtZW50VmFsdWUge3N0cmluZz19IC0gSW5jcmVtZW50YWwgdXBkYXRlIHZhbHVlXG4qL1xuZnVuY3Rpb24gVGFibGUodGFibGVJbmZvLCBpbmNyZW1lbnRWYWx1ZSwgZGF0YUNhbGxiYWNrRm4pIHtcbiAgLyoqIEBtZW1iZXIge09iamVjdH0gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYmxlIHdoaWNoIGhhcyBiZWVuIHJlcXVlc3RlZC4gVGhpcyBpc1xuICBndWFyYW50ZWVkIHRvIGJlIG9uZSBvZiB0aGUgdGFibGVzIHRoZSBjb25uZWN0b3IgcmV0dXJuZWQgaW4gdGhlIGNhbGwgdG8gZ2V0U2NoZW1hLiAqL1xuICB0aGlzLnRhYmxlSW5mbyA9IHRhYmxlSW5mbztcblxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBEZWZpbmVzIHRoZSBpbmNyZW1lbnRhbCB1cGRhdGUgdmFsdWUgZm9yIHRoaXMgdGFibGUuIEVtcHR5IHN0cmluZyBpZlxuICB0aGVyZSBpcyBub3QgYW4gaW5jcmVtZW50YWwgdXBkYXRlIHJlcXVlc3RlZC4gKi9cbiAgdGhpcy5pbmNyZW1lbnRWYWx1ZSA9IGluY3JlbWVudFZhbHVlIHx8IFwiXCI7XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuID0gZGF0YUNhbGxiYWNrRm47XG59XG5cbi8qKlxuKiBAbWV0aG9kIGFwcGVuZHMgdGhlIGdpdmVuIHJvd3MgdG8gdGhlIHNldCBvZiBkYXRhIGNvbnRhaW5lZCBpbiB0aGlzIHRhYmxlXG4qIEBwYXJhbSBkYXRhIHthcnJheX0gLSBFaXRoZXIgYW4gYXJyYXkgb2YgYXJyYXlzIG9yIGFuIGFycmF5IG9mIG9iamVjdHMgd2hpY2ggcmVwcmVzZW50XG4qIHRoZSBpbmRpdmlkdWFsIHJvd3Mgb2YgZGF0YSB0byBhcHBlbmQgdG8gdGhpcyB0YWJsZVxuKi9cblRhYmxlLnByb3RvdHlwZS5hcHBlbmRSb3dzID0gZnVuY3Rpb24oZGF0YSkge1xuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcbiAgaWYgKCFkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKFwicm93cyBkYXRhIGlzIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxuICAgIGNvbnNvbGUud2FybihcIlRhYmxlLmFwcGVuZFJvd3MgbXVzdCB0YWtlIGFuIGFycmF5IG9mIGFycmF5cyBvciBhcnJheSBvZiBvYmplY3RzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9UYWJsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGNvcHlGdW5jdGlvbnMoc3JjLCBkZXN0KSB7XG4gIGZvcih2YXIga2V5IGluIHNyYykge1xuICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb3B5RnVuY3Rpb25zID0gY29weUZ1bmN0aW9ucztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9VdGlsaXRpZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb25cbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb25cbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VzLUVTLmpzb25cbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvblxuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwid3dUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTUgVGhlIFF0IENvbXBhbnkgTHRkLlxuKiogQ29weXJpZ2h0IChDKSAyMDE0IEtsYXLDpGx2ZGFsZW5zIERhdGFrb25zdWx0IEFCLCBhIEtEQUIgR3JvdXAgY29tcGFueSwgaW5mb0BrZGFiLmNvbSwgYXV0aG9yIE1pbGlhbiBXb2xmZiA8bWlsaWFuLndvbGZmQGtkYWIuY29tPlxuKiogQ29udGFjdDogaHR0cDovL3d3dy5xdC5pby9saWNlbnNpbmcvXG4qKlxuKiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIFF0V2ViQ2hhbm5lbCBtb2R1bGUgb2YgdGhlIFF0IFRvb2xraXQuXG4qKlxuKiogJFFUX0JFR0lOX0xJQ0VOU0U6TEdQTDIxJFxuKiogQ29tbWVyY2lhbCBMaWNlbnNlIFVzYWdlXG4qKiBMaWNlbnNlZXMgaG9sZGluZyB2YWxpZCBjb21tZXJjaWFsIFF0IGxpY2Vuc2VzIG1heSB1c2UgdGhpcyBmaWxlIGluXG4qKiBhY2NvcmRhbmNlIHdpdGggdGhlIGNvbW1lcmNpYWwgbGljZW5zZSBhZ3JlZW1lbnQgcHJvdmlkZWQgd2l0aCB0aGVcbioqIFNvZnR3YXJlIG9yLCBhbHRlcm5hdGl2ZWx5LCBpbiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIGNvbnRhaW5lZCBpblxuKiogYSB3cml0dGVuIGFncmVlbWVudCBiZXR3ZWVuIHlvdSBhbmQgVGhlIFF0IENvbXBhbnkuIEZvciBsaWNlbnNpbmcgdGVybXNcbioqIGFuZCBjb25kaXRpb25zIHNlZSBodHRwOi8vd3d3LnF0LmlvL3Rlcm1zLWNvbmRpdGlvbnMuIEZvciBmdXJ0aGVyXG4qKiBpbmZvcm1hdGlvbiB1c2UgdGhlIGNvbnRhY3QgZm9ybSBhdCBodHRwOi8vd3d3LnF0LmlvL2NvbnRhY3QtdXMuXG4qKlxuKiogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIFVzYWdlXG4qKiBBbHRlcm5hdGl2ZWx5LCB0aGlzIGZpbGUgbWF5IGJlIHVzZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyXG4qKiBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMi4xIG9yIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWVcbioqIFNvZnR3YXJlIEZvdW5kYXRpb24gYW5kIGFwcGVhcmluZyBpbiB0aGUgZmlsZSBMSUNFTlNFLkxHUEx2MjEgYW5kXG4qKiBMSUNFTlNFLkxHUEx2MyBpbmNsdWRlZCBpbiB0aGUgcGFja2FnaW5nIG9mIHRoaXMgZmlsZS4gUGxlYXNlIHJldmlldyB0aGVcbioqIGZvbGxvd2luZyBpbmZvcm1hdGlvbiB0byBlbnN1cmUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiogcmVxdWlyZW1lbnRzIHdpbGwgYmUgbWV0OiBodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2xncGwuaHRtbCBhbmRcbioqIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9vbGQtbGljZW5zZXMvbGdwbC0yLjEuaHRtbC5cbioqXG4qKiBBcyBhIHNwZWNpYWwgZXhjZXB0aW9uLCBUaGUgUXQgQ29tcGFueSBnaXZlcyB5b3UgY2VydGFpbiBhZGRpdGlvbmFsXG4qKiByaWdodHMuIFRoZXNlIHJpZ2h0cyBhcmUgZGVzY3JpYmVkIGluIFRoZSBRdCBDb21wYW55IExHUEwgRXhjZXB0aW9uXG4qKiB2ZXJzaW9uIDEuMSwgaW5jbHVkZWQgaW4gdGhlIGZpbGUgTEdQTF9FWENFUFRJT04udHh0IGluIHRoaXMgcGFja2FnZS5cbioqXG4qKiAkUVRfRU5EX0xJQ0VOU0UkXG4qKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcyA9IHtcbiAgICBzaWduYWw6IDEsXG4gICAgcHJvcGVydHlVcGRhdGU6IDIsXG4gICAgaW5pdDogMyxcbiAgICBpZGxlOiA0LFxuICAgIGRlYnVnOiA1LFxuICAgIGludm9rZU1ldGhvZDogNixcbiAgICBjb25uZWN0VG9TaWduYWw6IDcsXG4gICAgZGlzY29ubmVjdEZyb21TaWduYWw6IDgsXG4gICAgc2V0UHJvcGVydHk6IDksXG4gICAgcmVzcG9uc2U6IDEwLFxufTtcblxudmFyIFFXZWJDaGFubmVsID0gZnVuY3Rpb24odHJhbnNwb3J0LCBpbml0Q2FsbGJhY2spXG57XG4gICAgaWYgKHR5cGVvZiB0cmFuc3BvcnQgIT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRyYW5zcG9ydC5zZW5kICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBRV2ViQ2hhbm5lbCBleHBlY3RzIGEgdHJhbnNwb3J0IG9iamVjdCB3aXRoIGEgc2VuZCBmdW5jdGlvbiBhbmQgb25tZXNzYWdlIGNhbGxiYWNrIHByb3BlcnR5LlwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcIiBHaXZlbiBpczogdHJhbnNwb3J0OiBcIiArIHR5cGVvZih0cmFuc3BvcnQpICsgXCIsIHRyYW5zcG9ydC5zZW5kOiBcIiArIHR5cGVvZih0cmFuc3BvcnQuc2VuZCkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzO1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuXG4gICAgdGhpcy5zZW5kID0gZnVuY3Rpb24oZGF0YSlcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLnRyYW5zcG9ydC5zZW5kKGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMudHJhbnNwb3J0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zaWduYWw6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVTaWduYWwoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnJlc3BvbnNlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUmVzcG9uc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnByb3BlcnR5VXBkYXRlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUHJvcGVydHlVcGRhdGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJpbnZhbGlkIG1lc3NhZ2UgcmVjZWl2ZWQ6XCIsIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmV4ZWNDYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLmV4ZWNJZCA9IDA7XG4gICAgdGhpcy5leGVjID0gZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXG4gICAge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBpZiBubyBjYWxsYmFjayBpcyBnaXZlbiwgc2VuZCBkaXJlY3RseVxuICAgICAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFubmVsLmV4ZWNJZCA9PT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgICAgICAgLy8gd3JhcFxuICAgICAgICAgICAgY2hhbm5lbC5leGVjSWQgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZXhlYyBtZXNzYWdlIHdpdGggcHJvcGVydHkgaWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuaWQgPSBjaGFubmVsLmV4ZWNJZCsrO1xuICAgICAgICBjaGFubmVsLmV4ZWNDYWxsYmFja3NbZGF0YS5pZF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLm9iamVjdHMgPSB7fTtcblxuICAgIHRoaXMuaGFuZGxlU2lnbmFsID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBvYmplY3QgPSBjaGFubmVsLm9iamVjdHNbbWVzc2FnZS5vYmplY3RdO1xuICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3Quc2lnbmFsRW1pdHRlZChtZXNzYWdlLnNpZ25hbCwgbWVzc2FnZS5hcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuaGFuZGxlZCBzaWduYWw6IFwiICsgbWVzc2FnZS5vYmplY3QgKyBcIjo6XCIgKyBtZXNzYWdlLnNpZ25hbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGlmICghbWVzc2FnZS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCByZXNwb25zZSBtZXNzYWdlIHJlY2VpdmVkOiBcIiwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1ttZXNzYWdlLmlkXShtZXNzYWdlLmRhdGEpO1xuICAgICAgICBkZWxldGUgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlLmRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhW2ldO1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1tkYXRhLm9iamVjdF07XG4gICAgICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnByb3BlcnR5VXBkYXRlKGRhdGEuc2lnbmFscywgZGF0YS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHByb3BlcnR5IHVwZGF0ZTogXCIgKyBkYXRhLm9iamVjdCArIFwiOjpcIiArIGRhdGEuc2lnbmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmlkbGV9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGNoYW5uZWwuc2VuZCh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGVidWcsIGRhdGE6IG1lc3NhZ2V9KTtcbiAgICB9O1xuXG4gICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbml0fSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgUU9iamVjdChvYmplY3ROYW1lLCBkYXRhW29iamVjdE5hbWVdLCBjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3cgdW53cmFwIHByb3BlcnRpZXMsIHdoaWNoIG1pZ2h0IHJlZmVyZW5jZSBvdGhlciByZWdpc3RlcmVkIG9iamVjdHNcbiAgICAgICAgZm9yICh2YXIgb2JqZWN0TmFtZSBpbiBjaGFubmVsLm9iamVjdHMpIHtcbiAgICAgICAgICAgIGNoYW5uZWwub2JqZWN0c1tvYmplY3ROYW1lXS51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluaXRDYWxsYmFjaykge1xuICAgICAgICAgICAgaW5pdENhbGxiYWNrKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gUU9iamVjdChuYW1lLCBkYXRhLCB3ZWJDaGFubmVsKVxue1xuICAgIHRoaXMuX19pZF9fID0gbmFtZTtcbiAgICB3ZWJDaGFubmVsLm9iamVjdHNbbmFtZV0gPSB0aGlzO1xuXG4gICAgLy8gTGlzdCBvZiBjYWxsYmFja3MgdGhhdCBnZXQgaW52b2tlZCB1cG9uIHNpZ25hbCBlbWlzc2lvblxuICAgIHRoaXMuX19vYmplY3RTaWduYWxzX18gPSB7fTtcblxuICAgIC8vIENhY2hlIG9mIGFsbCBwcm9wZXJ0aWVzLCB1cGRhdGVkIHdoZW4gYSBub3RpZnkgc2lnbmFsIGlzIGVtaXR0ZWRcbiAgICB0aGlzLl9fcHJvcGVydHlDYWNoZV9fID0ge307XG5cbiAgICB2YXIgb2JqZWN0ID0gdGhpcztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRoaXMudW53cmFwUU9iamVjdCA9IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgbGlzdCBvZiBvYmplY3RzXG4gICAgICAgICAgICB2YXIgcmV0ID0gbmV3IEFycmF5KHJlc3BvbnNlLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcmV0W2ldID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2VbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3BvbnNlXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2VbXCJfX1FPYmplY3QqX19cIl1cbiAgICAgICAgICAgIHx8IHJlc3BvbnNlW1wiaWRcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iamVjdElkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgIGlmICh3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdKVxuICAgICAgICAgICAgcmV0dXJuIHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF07XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHVud3JhcCB1bmtub3duIFFPYmplY3QgXCIgKyBvYmplY3RJZCArIFwiIHdpdGhvdXQgZGF0YS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcU9iamVjdCA9IG5ldyBRT2JqZWN0KCBvYmplY3RJZCwgcmVzcG9uc2UuZGF0YSwgd2ViQ2hhbm5lbCApO1xuICAgICAgICBxT2JqZWN0LmRlc3Ryb3llZC5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0gPT09IHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgbm93IGRlbGV0ZWQgUU9iamVjdCB0byBhbiBlbXB0eSB7fSBvYmplY3RcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGFzc2lnbmluZyB7fSB0aG91Z2ggd291bGQgbm90IGhhdmUgdGhlIGRlc2lyZWQgZWZmZWN0LCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gYmVsb3cgYWxzbyBlbnN1cmVzIGFsbCBleHRlcm5hbCByZWZlcmVuY2VzIHdpbGwgc2VlIHRoZSBlbXB0eSBtYXBcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB0aGlzIGRldG91ciBpcyBuZWNlc3NhcnkgdG8gd29ya2Fyb3VuZCBRVEJVRy00MDAyMVxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lcy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCBpbiBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxT2JqZWN0W3Byb3BlcnR5TmFtZXNbaWR4XV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gaGVyZSB3ZSBhcmUgYWxyZWFkeSBpbml0aWFsaXplZCwgYW5kIHRodXMgbXVzdCBkaXJlY3RseSB1bndyYXAgdGhlIHByb3BlcnRpZXNcbiAgICAgICAgcU9iamVjdC51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHJldHVybiBxT2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudW53cmFwUHJvcGVydGllcyA9IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5SWR4IGluIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfXykge1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSA9IG9iamVjdC51bndyYXBRT2JqZWN0KG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUlkeF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU2lnbmFsKHNpZ25hbERhdGEsIGlzUHJvcGVydHlOb3RpZnlTaWduYWwpXG4gICAge1xuICAgICAgICB2YXIgc2lnbmFsTmFtZSA9IHNpZ25hbERhdGFbMF07XG4gICAgICAgIHZhciBzaWduYWxJbmRleCA9IHNpZ25hbERhdGFbMV07XG4gICAgICAgIG9iamVjdFtzaWduYWxOYW1lXSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGNvbm5lY3QgdG8gc2lnbmFsIFwiICsgc2lnbmFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnB1c2goY2FsbGJhY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIHNpZ25hbE5hbWUgIT09IFwiZGVzdHJveWVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSByZXF1aXJlZCBmb3IgXCJwdXJlXCIgc2lnbmFscywgaGFuZGxlZCBzZXBhcmF0ZWx5IGZvciBwcm9wZXJ0aWVzIGluIHByb3BlcnR5VXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsc28gbm90ZSB0aGF0IHdlIGFsd2F5cyBnZXQgbm90aWZpZWQgYWJvdXQgdGhlIGRlc3Ryb3llZCBzaWduYWxcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmNvbm5lY3RUb1NpZ25hbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogc2lnbmFsSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGRpc2Nvbm5lY3QgZnJvbSBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGZpbmQgY29ubmVjdGlvbiBvZiBzaWduYWwgXCIgKyBzaWduYWxOYW1lICsgXCIgdG8gXCIgKyBjYWxsYmFjay5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIGlmICghaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbCAmJiBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmRpc2Nvbm5lY3RGcm9tU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGUgZ2l2ZW4gc2lnbmFsbmFtZS4gQWxzbyB3b3JrcyBmb3IgcHJvcGVydHkgbm90aWZ5IGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncylcbiAgICB7XG4gICAgICAgIHZhciBjb25uZWN0aW9ucyA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxOYW1lXTtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb25zKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIHNpZ25hbEFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb3BlcnR5VXBkYXRlID0gZnVuY3Rpb24oc2lnbmFscywgcHJvcGVydHlNYXApXG4gICAge1xuICAgICAgICAvLyB1cGRhdGUgcHJvcGVydHkgY2FjaGVcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJbmRleCBpbiBwcm9wZXJ0eU1hcCkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eU1hcFtwcm9wZXJ0eUluZGV4XTtcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBzaWduYWxOYW1lIGluIHNpZ25hbHMpIHtcbiAgICAgICAgICAgIC8vIEludm9rZSBhbGwgY2FsbGJhY2tzLCBhcyBzaWduYWxFbWl0dGVkKCkgZG9lcyBub3QuIFRoaXMgZW5zdXJlcyB0aGVcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGNhY2hlIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFja3MgYXJlIGludm9rZWQuXG4gICAgICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsc1tzaWduYWxOYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbEVtaXR0ZWQgPSBmdW5jdGlvbihzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgaW52b2tlU2lnbmFsQ2FsbGJhY2tzKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1ldGhvZChtZXRob2REYXRhKVxuICAgIHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXRob2REYXRhWzBdO1xuICAgICAgICB2YXIgbWV0aG9kSWR4ID0gbWV0aG9kRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbnZva2VNZXRob2QsXG4gICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBtZXRob2RJZHgsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG9iamVjdC51bndyYXBRT2JqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FsbGJhY2spKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kR2V0dGVyU2V0dGVyKHByb3BlcnR5SW5mbylcbiAgICB7XG4gICAgICAgIHZhciBwcm9wZXJ0eUluZGV4ID0gcHJvcGVydHlJbmZvWzBdO1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHlJbmZvWzFdO1xuICAgICAgICB2YXIgbm90aWZ5U2lnbmFsRGF0YSA9IHByb3BlcnR5SW5mb1syXTtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBwcm9wZXJ0eSBjYWNoZSB3aXRoIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgLy8gTk9URTogaWYgdGhpcyBpcyBhbiBvYmplY3QsIGl0IGlzIG5vdCBkaXJlY3RseSB1bndyYXBwZWQgYXMgaXQgbWlnaHRcbiAgICAgICAgLy8gcmVmZXJlbmNlIG90aGVyIFFPYmplY3QgdGhhdCB3ZSBkbyBub3Qga25vdyB5ZXRcbiAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlJbmZvWzNdO1xuXG4gICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm90aWZ5U2lnbmFsRGF0YVswXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBuYW1lIGlzIG9wdGltaXplZCBhd2F5LCByZWNvbnN0cnVjdCB0aGUgYWN0dWFsIG5hbWVcbiAgICAgICAgICAgICAgICBub3RpZnlTaWduYWxEYXRhWzBdID0gcHJvcGVydHlOYW1lICsgXCJDaGFuZ2VkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRTaWduYWwobm90aWZ5U2lnbmFsRGF0YSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGRuJ3QgaGFwcGVuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuZGVmaW5lZCB2YWx1ZSBpbiBwcm9wZXJ0eSBjYWNoZSBmb3IgcHJvcGVydHkgXFxcIlwiICsgcHJvcGVydHlOYW1lICsgXCJcXFwiIGluIG9iamVjdCBcIiArIG9iamVjdC5fX2lkX18pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQcm9wZXJ0eSBzZXR0ZXIgZm9yIFwiICsgcHJvcGVydHlOYW1lICsgXCIgY2FsbGVkIHdpdGggdW5kZWZpbmVkIHZhbHVlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2V0UHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogcHJvcGVydHlJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRhdGEubWV0aG9kcy5mb3JFYWNoKGFkZE1ldGhvZCk7XG5cbiAgICBkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChiaW5kR2V0dGVyU2V0dGVyKTtcblxuICAgIGRhdGEuc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uKHNpZ25hbCkgeyBhZGRTaWduYWwoc2lnbmFsLCBmYWxzZSk7IH0pO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLmVudW1zKSB7XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IGRhdGEuZW51bXNbbmFtZV07XG4gICAgfVxufVxuXG4vL3JlcXVpcmVkIGZvciB1c2Ugd2l0aCBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBRV2ViQ2hhbm5lbDogUVdlYkNoYW5uZWxcbiAgICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcXdlYmNoYW5uZWwvcXdlYmNoYW5uZWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL1V0aWxpdGllcy5qcycpO1xudmFyIFNoYXJlZCA9IHJlcXVpcmUoJy4vU2hhcmVkLmpzJyk7XG52YXIgTmF0aXZlRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vTmF0aXZlRGlzcGF0Y2hlci5qcycpO1xudmFyIFNpbXVsYXRvckRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL1NpbXVsYXRvckRpc3BhdGNoZXIuanMnKTtcbnZhciBxd2ViY2hhbm5lbCA9IHJlcXVpcmUoJ3F3ZWJjaGFubmVsJyk7XG5cbi8qKiBAbW9kdWxlIFNoaW1MaWJyYXJ5IC0gVGhpcyBtb2R1bGUgZGVmaW5lcyB0aGUgV0RDJ3Mgc2hpbSBsaWJyYXJ5IHdoaWNoIGlzIHVzZWRcbnRvIGJyaWRnZSB0aGUgZ2FwIGJldHdlZW4gdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgV0RDIGFuZCB0aGUgZHJpdmluZyBjb250ZXh0XG5vZiB0aGUgV0RDIChUYWJsZWF1IGRlc2t0b3AsIHRoZSBzaW11bGF0b3IsIGV0Yy4pICovXG5cbi8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBvbmNlIGJvb3RzdHJhcHBpbmcgaGFzIGJlZW4gY29tcGxldGVkIGFuZCB0aGVcbi8vIGRpc3BhdGNoZXIgYW5kIHNoYXJlZCBXREMgb2JqZWN0cyBhcmUgYm90aCBjcmVhdGVkIGFuZCBhdmFpbGFibGVcbmZ1bmN0aW9uIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChfZGlzcGF0Y2hlciwgX3NoYXJlZCkge1xuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wdWJsaWNJbnRlcmZhY2UsIHdpbmRvdy50YWJsZWF1KTtcbiAgVXRpbGl0aWVzLmNvcHlGdW5jdGlvbnMoX2Rpc3BhdGNoZXIucHJpdmF0ZUludGVyZmFjZSwgd2luZG93Ll90YWJsZWF1KTtcbiAgX3NoYXJlZC5pbml0KCk7XG59XG5cbi8vIEluaXRpYWxpemVzIHRoZSB3ZGMgc2hpbSBsaWJyYXJ5LiBZb3UgbXVzdCBjYWxsIHRoaXMgYmVmb3JlIGRvaW5nIGFueXRoaW5nIHdpdGggV0RDXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gVGhlIGluaXRpYWwgY29kZSBoZXJlIGlzIHRoZSBvbmx5IHBsYWNlIGluIG91ciBtb2R1bGUgd2hpY2ggc2hvdWxkIGhhdmUgZ2xvYmFsXG4gIC8vIGtub3dsZWRnZSBvZiBob3cgYWxsIHRoZSBXREMgY29tcG9uZW50cyBhcmUgZ2x1ZWQgdG9nZXRoZXIuIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2VcbiAgLy8gd2hpY2ggd2lsbCBrbm93IGFib3V0IHRoZSB3aW5kb3cgb2JqZWN0IG9yIG90aGVyIGdsb2JhbCBvYmplY3RzLiBUaGlzIGNvZGUgd2lsbCBiZSBydW5cbiAgLy8gaW1tZWRpYXRlbHkgd2hlbiB0aGUgc2hpbSBsaWJyYXJ5IGxvYWRzIGFuZCBpcyByZXNwb25zaWJsZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIGNvbnRleHRcbiAgLy8gd2hpY2ggaXQgaXMgcnVubmluZyBpdCBhbmQgc2V0dXAgYSBjb21tdW5pY2F0aW9ucyBjaGFubmVsIGJldHdlZW4gdGhlIGpzICYgcnVubmluZyBjb2RlXG4gIHZhciBkaXNwYXRjaGVyID0gbnVsbDtcbiAgdmFyIHNoYXJlZCA9IG51bGw7XG5cbiAgLy8gQWx3YXlzIGRlZmluZSB0aGUgcHJpdmF0ZSBfdGFibGVhdSBvYmplY3QgYXQgdGhlIHN0YXJ0XG4gIHdpbmRvdy5fdGFibGVhdSA9IHt9O1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgdGFibGVhdVZlcnNpb25Cb290c3RyYXAgaXMgZGVmaW5lZCBhcyBhIGdsb2JhbCBvYmplY3QuIElmIHNvLFxuICAvLyB3ZSBhcmUgcnVubmluZyBpbiB0aGUgVGFibGVhdSBkZXNrdG9wL3NlcnZlciBjb250ZXh0LiBJZiBub3QsIHdlJ3JlIHJ1bm5pbmcgaW4gdGhlIHNpbXVsYXRvclxuICBpZiAoISF3aW5kb3cudGFibGVhdVZlcnNpb25Cb290c3RyYXApIHtcbiAgICAvLyBXZSBoYXZlIHRoZSB0YWJsZWF1IG9iamVjdCBkZWZpbmVkXG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciwgUmVwb3J0aW5nIHZlcnNpb24gbnVtYmVyXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKHdpbmRvdyk7XG4gIH0gZWxzZSBpZiAoISF3aW5kb3cucXQgJiYgISF3aW5kb3cucXQud2ViQ2hhbm5lbFRyYW5zcG9ydCkge1xuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIgZm9yIHF3ZWJjaGFubmVsXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1ID0ge307XG5cbiAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgY29udGV4dCB3aGVyZSB0aGUgd2ViQ2hhbm5lbFRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFRoaXMgbWVhbnMgUVdlYkVuZ2luZSBpcyBpbiB1c2VcbiAgICB3aW5kb3cuY2hhbm5lbCA9IG5ldyBxd2ViY2hhbm5lbC5RV2ViQ2hhbm5lbChxdC53ZWJDaGFubmVsVHJhbnNwb3J0LCBmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlFXZWJDaGFubmVsIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuXG4gICAgICAvLyBEZWZpbmUgdGhlIGZ1bmN0aW9uIHdoaWNoIHRhYmxlYXUgd2lsbCBjYWxsIGFmdGVyIGl0IGhhcyBpbnNlcnRlZCBhbGwgdGhlIHJlcXVpcmVkIG9iamVjdHMgaW50byB0aGUgamF2YXNjcmlwdCBmcmFtZVxuICAgICAgd2luZG93Ll90YWJsZWF1Ll9uYXRpdmVTZXR1cENvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBPbmNlIHRoZSBuYXRpdmUgY29kZSB0ZWxscyB1cyBldmVyeXRoaW5nIGhlcmUgaXMgZG9uZSwgd2Ugc2hvdWxkIGhhdmUgYWxsIHRoZSBleHBlY3RlZCBvYmplY3RzIGluc2VydGVkIGludG8ganNcbiAgICAgICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKGNoYW5uZWwub2JqZWN0cyk7XG4gICAgICAgIHdpbmRvdy50YWJsZWF1ID0gY2hhbm5lbC5vYmplY3RzLnRhYmxlYXU7XG4gICAgICAgIHNoYXJlZC5jaGFuZ2VUYWJsZWF1QXBpT2JqKHdpbmRvdy50YWJsZWF1KTtcbiAgICAgICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBBY3R1YWxseSBjYWxsIGludG8gdGhlIHZlcnNpb24gYm9vdHN0cmFwcGVyIHRvIHJlcG9ydCBvdXIgdmVyc2lvbiBudW1iZXJcbiAgICAgIGNoYW5uZWwub2JqZWN0cy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJWZXJzaW9uIEJvb3RzdHJhcCBpcyBub3QgZGVmaW5lZCwgSW5pdGlhbGl6aW5nIFNpbXVsYXRvckRpc3BhdGNoZXJcIik7XG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcbiAgICBkaXNwYXRjaGVyID0gbmV3IFNpbXVsYXRvckRpc3BhdGNoZXIod2luZG93KTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNoYXJlZCBXREMgb2JqZWN0IGFuZCBhZGQgaW4gb3VyIGVudW0gdmFsdWVzXG4gIHNoYXJlZCA9IG5ldyBTaGFyZWQod2luZG93LnRhYmxlYXUsIHdpbmRvdy5fdGFibGVhdSwgd2luZG93KTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRpc3BhdGNoZXIgaXMgYWxyZWFkeSBkZWZpbmVkIGFuZCBpbW1lZGlhdGVseSBjYWxsIHRoZVxuICAvLyBjYWxsYmFjayBpZiBzb1xuICBpZiAoZGlzcGF0Y2hlcikge1xuICAgIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChkaXNwYXRjaGVyLCBzaGFyZWQpO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3RhYmxlYXV3ZGMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDUkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==
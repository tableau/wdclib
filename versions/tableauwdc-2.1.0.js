/*! Build Number: 2.1.0 */
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
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.1.0") };
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
	  // Due to cross-origin security issues over https, we may not be able to retrieve _sourceWindow.
	  // Use sourceOrigin instead.
	  var hostName = this._sourceOrigin || this._sourceWindow.location.origin;

	  var supportedHosts = ["http://localhost", "https://localhost", "http://tableau.github.io", "https://tableau.github.io"];
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
	    this._sourceWindow = evt.source;
	    this._sourceOrigin = evt.origin;
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
	  }.bind(this), 0);
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

	  // bind the public facing version of this function so it can be passed around
	  this.appendRows = this._appendRows.bind(this);
	}

	/**
	* @method appends the given rows to the set of data contained in this table
	* @param data {array} - Either an array of arrays or an array of objects which represent
	* the individual rows of data to append to this table
	*/
	Table.prototype._appendRows = function(data) {
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
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.1.0"));
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
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.1.0"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDQzYTZiMWVkOGNkOTQ0MWQ0NWNhIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0VudW1zLmpzIiwid2VicGFjazovLy8uL05hdGl2ZURpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vU2hhcmVkLmpzIiwid2VicGFjazovLy8uL1NpbXVsYXRvckRpc3BhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vVGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vVXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24iLCJ3ZWJwYWNrOi8vLy4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi90YWJsZWF1d2RjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNDNhNmIxZWQ4Y2Q5NDQxZDQ1Y2FcbiAqKi8iLCIvLyBNYWluIGVudHJ5IHBvaW50IHRvIHB1bGwgdG9nZXRoZXIgZXZlcnl0aGluZyBuZWVkZWQgZm9yIHRoZSBXREMgc2hpbSBsaWJyYXJ5XG4vLyBUaGlzIGZpbGUgd2lsbCBiZSBleHBvcnRlZCBhcyBhIGJ1bmRsZWQganMgZmlsZSBieSB3ZWJwYWNrIHNvIGl0IGNhbiBiZSBpbmNsdWRlZFxuLy8gaW4gYSA8c2NyaXB0PiB0YWcgaW4gYW4gaHRtbCBkb2N1bWVudC4gQWxlcm5hdGl2ZWx5LCBhIGNvbm5lY3RvciBtYXkgaW5jbHVkZVxuLy8gdGhpcyB3aG9sZSBwYWNrYWdlIGluIHRoZWlyIGNvZGUgYW5kIHdvdWxkIG5lZWQgdG8gY2FsbCBpbml0IGxpa2UgdGhpc1xudmFyIHRhYmxlYXV3ZGMgPSByZXF1aXJlKCcuL3RhYmxlYXV3ZGMuanMnKTtcbnRhYmxlYXV3ZGMuaW5pdCgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIFRoaXMgZmlsZSBsaXN0cyBhbGwgb2YgdGhlIGVudW1zIHdoaWNoIHNob3VsZCBhdmFpbGFibGUgZm9yIHRoZSBXREMgKi9cbnZhciBhbGxFbnVtcyA9IHtcbiAgcGhhc2VFbnVtIDoge1xuICAgIGludGVyYWN0aXZlUGhhc2U6IFwiaW50ZXJhY3RpdmVcIixcbiAgICBhdXRoUGhhc2U6IFwiYXV0aFwiLFxuICAgIGdhdGhlckRhdGFQaGFzZTogXCJnYXRoZXJEYXRhXCJcbiAgfSxcblxuICBhdXRoUHVycG9zZUVudW0gOiB7XG4gICAgZXBoZW1lcmFsOiBcImVwaGVtZXJhbFwiLFxuICAgIGVuZHVyaW5nOiBcImVuZHVyaW5nXCJcbiAgfSxcblxuICBhdXRoVHlwZUVudW0gOiB7XG4gICAgbm9uZTogXCJub25lXCIsXG4gICAgYmFzaWM6IFwiYmFzaWNcIixcbiAgICBjdXN0b206IFwiY3VzdG9tXCJcbiAgfSxcblxuICBkYXRhVHlwZUVudW0gOiB7XG4gICAgYm9vbDogXCJib29sXCIsXG4gICAgZGF0ZTogXCJkYXRlXCIsXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZXRpbWVcIixcbiAgICBmbG9hdDogXCJmbG9hdFwiLFxuICAgIGludDogXCJpbnRcIixcbiAgICBzdHJpbmc6IFwic3RyaW5nXCJcbiAgfSxcblxuICBjb2x1bW5Sb2xlRW51bSA6IHtcbiAgICAgIGRpbWVuc2lvbjogXCJkaW1lbnNpb25cIixcbiAgICAgIG1lYXN1cmU6IFwibWVhc3VyZVwiXG4gIH0sXG5cbiAgY29sdW1uVHlwZUVudW0gOiB7XG4gICAgICBjb250aW51b3VzOiBcImNvbnRpbnVvdXNcIixcbiAgICAgIGRpc2NyZXRlOiBcImRpc2NyZXRlXCJcbiAgfSxcblxuICBhZ2dUeXBlRW51bSA6IHtcbiAgICAgIHN1bTogXCJzdW1cIixcbiAgICAgIGF2ZzogXCJhdmdcIixcbiAgICAgIG1lZGlhbjogXCJtZWRpYW5cIixcbiAgICAgIGNvdW50OiBcImNvdW50XCIsXG4gICAgICBjb3VudGQ6IFwiY291bnRfZGlzdFwiXG4gIH0sXG5cbiAgZ2VvZ3JhcGhpY1JvbGVFbnVtIDoge1xuICAgICAgYXJlYV9jb2RlOiBcImFyZWFfY29kZVwiLFxuICAgICAgY2JzYV9tc2E6IFwiY2JzYV9tc2FcIixcbiAgICAgIGNpdHk6IFwiY2l0eVwiLFxuICAgICAgY29uZ3Jlc3Npb25hbF9kaXN0cmljdDogXCJjb25ncmVzc2lvbmFsX2Rpc3RyaWN0XCIsXG4gICAgICBjb3VudHJ5X3JlZ2lvbjogXCJjb3VudHJ5X3JlZ2lvblwiLFxuICAgICAgY291bnR5OiBcImNvdW50eVwiLFxuICAgICAgc3RhdGVfcHJvdmluY2U6IFwic3RhdGVfcHJvdmluY2VcIixcbiAgICAgIHppcF9jb2RlX3Bvc3Rjb2RlOiBcInppcF9jb2RlX3Bvc3Rjb2RlXCIsXG4gICAgICBsYXRpdHVkZTogXCJsYXRpdHVkZVwiLFxuICAgICAgbG9uZ2l0dWRlOiBcImxvbmdpdHVkZVwiXG4gIH0sXG5cbiAgdW5pdHNGb3JtYXRFbnVtIDoge1xuICAgICAgdGhvdXNhbmRzOiBcInRob3VzYW5kc1wiLFxuICAgICAgbWlsbGlvbnM6IFwibWlsbGlvbnNcIixcbiAgICAgIGJpbGxpb25zX2VuZ2xpc2g6IFwiYmlsbGlvbnNfZW5nbGlzaFwiLFxuICAgICAgYmlsbGlvbnNfc3RhbmRhcmQ6IFwiYmlsbGlvbnNfc3RhbmRhcmRcIlxuICB9LFxuXG4gIG51bWJlckZvcm1hdEVudW0gOiB7XG4gICAgICBudW1iZXI6IFwibnVtYmVyXCIsXG4gICAgICBjdXJyZW5jeTogXCJjdXJyZW5jeVwiLFxuICAgICAgc2NpZW50aWZpYzogXCJzY2llbnRpZmljXCIsXG4gICAgICBwZXJjZW50YWdlOiBcInBlcmNlbnRhZ2VcIlxuICB9LFxuXG4gIGxvY2FsZUVudW0gOiB7XG4gICAgICBhbWVyaWNhOiBcImVuLXVzXCIsXG4gICAgICBicmF6aWw6ICBcInB0LWJyXCIsXG4gICAgICBjaGluYTogICBcInpoLWNuXCIsXG4gICAgICBmcmFuY2U6ICBcImZyLWZyXCIsXG4gICAgICBnZXJtYW55OiBcImRlLWRlXCIsXG4gICAgICBqYXBhbjogICBcImphLWpwXCIsXG4gICAgICBrb3JlYTogICBcImtvLWtyXCIsXG4gICAgICBzcGFpbjogICBcImVzLWVzXCJcbiAgfSxcblxuICBqb2luRW51bSA6IHtcbiAgICAgIGlubmVyOiBcImlubmVyXCIsXG4gICAgICBsZWZ0OiBcImxlZnRcIlxuICB9XG59XG5cbi8vIEFwcGxpZXMgdGhlIGVudW1zIGFzIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldCBvYmplY3RcbmZ1bmN0aW9uIGFwcGx5KHRhcmdldCkge1xuICBmb3IodmFyIGtleSBpbiBhbGxFbnVtcykge1xuICAgIHRhcmdldFtrZXldID0gYWxsRW51bXNba2V5XTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL0VudW1zLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqIEBjbGFzcyBVc2VkIGZvciBjb21tdW5pY2F0aW5nIGJldHdlZW4gVGFibGVhdSBkZXNrdG9wL3NlcnZlciBhbmQgdGhlIFdEQydzXG4qIEphdmFzY3JpcHQuIGlzIHByZWRvbWluYW50bHkgYSBwYXNzLXRocm91Z2ggdG8gdGhlIFF0IFdlYkJyaWRnZSBtZXRob2RzXG4qIEBwYXJhbSBuYXRpdmVBcGlSb290T2JqIHtPYmplY3R9IC0gVGhlIHJvb3Qgb2JqZWN0IHdoZXJlIHRoZSBuYXRpdmUgQXBpIG1ldGhvZHNcbiogYXJlIGF2YWlsYWJsZS4gRm9yIFdlYktpdCwgdGhpcyBpcyB3aW5kb3cuXG4qL1xuZnVuY3Rpb24gTmF0aXZlRGlzcGF0Y2hlciAobmF0aXZlQXBpUm9vdE9iaikge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmogPSBuYXRpdmVBcGlSb290T2JqO1xuICB0aGlzLl9pbml0UHVibGljSW50ZXJmYWNlKCk7XG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHB1YmxpYyBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IGZhbHNlO1xuXG4gIHZhciBwdWJsaWNJbnRlcmZhY2UgPSB7fTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0Rm9yQXV0aCA9IHRoaXMuX2Fib3J0Rm9yQXV0aC5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSB0aGlzLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbi5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UubG9nID0gdGhpcy5fbG9nLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5zdWJtaXQgPSB0aGlzLl9zdWJtaXQuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnJlcG9ydFByb2dyZXNzID0gdGhpcy5fcmVwb3J0UHJvZ3Jlc3MuYmluZCh0aGlzKTtcblxuICB0aGlzLnB1YmxpY0ludGVyZmFjZSA9IHB1YmxpY0ludGVyZmFjZTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0Rm9yQXV0aCA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9hYm9ydEZvckF1dGguYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydFdpdGhFcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9hYm9ydFdpdGhFcnJvci5hcGkobXNnKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gZnVuY3Rpb24oZGVzdE9yaWdpbkxpc3QpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYXBpKGRlc3RPcmlnaW5MaXN0KTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9sb2cuYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX3N1Ym1pdENhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwic3VibWl0IGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zdWJtaXQuYXBpKCk7XG59O1xuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFByaXZhdGVJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHJpdmF0ZSBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XG5cbiAgdGhpcy5faW5pdENhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX2RhdGFEb25lQ2FsbGJhY2sgPSB0aGlzLl9kYXRhRG9uZUNhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5faW5pdENhbGxiYWNrQ2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJpbml0Q2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IHRydWU7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2luaXRDYWxsYmFjay5hcGkoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NodXRkb3duQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcInNodXRkb3duQ2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zaHV0ZG93bkNhbGxiYWNrLmFwaSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2NoZW1hQ2FsbGJhY2sgPSBmdW5jdGlvbihzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMpIHtcbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHdlIGFyZSB1c2luZyBhIHZlcnNpb24gb2YgZGVza3RvcCB3aGljaCBoYXMgdGhlIFdEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCBkZWZpbmVkXG4gIGlmICghIXRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXgpIHtcbiAgICAvLyBQcm92aWRpbmcgc3RhbmRhcmRDb25uZWN0aW9ucyBpcyBvcHRpb25hbCBidXQgd2UgY2FuJ3QgcGFzcyB1bmRlZmluZWQgYmFjayBiZWNhdXNlIFF0IHdpbGwgY2hva2VcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4LmFwaShzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW10pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrLmFwaShzY2hlbWEpO1xuICB9XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV90YWJsZURhdGFDYWxsYmFjay5hcGkodGFibGVOYW1lLCBkYXRhKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3JlcG9ydFByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MuYXBpKHByb2dyZXNzKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfZGF0YURvbmVDYWxsYmFjay5hcGkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXRpdmVEaXNwYXRjaGVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL05hdGl2ZURpc3BhdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgVGFibGUgPSByZXF1aXJlKCcuL1RhYmxlLmpzJyk7XG52YXIgRW51bXMgPSByZXF1aXJlKCcuL0VudW1zLmpzJyk7XG5cbi8qKiBAY2xhc3MgVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBzaGFyZWQgcGFydHMgb2YgdGhlIGphdmFzY3JpcHRcbiogbGlicmFyeSB3aGljaCBkbyBub3QgaGF2ZSBhbnkgZGVwZW5kZW5jZSBvbiB3aGV0aGVyIHdlIGFyZSBydW5uaW5nIGluXG4qIHRoZSBzaW11bGF0b3IsIGluIFRhYmxlYXUsIG9yIGFueXdoZXJlIGVsc2VcbiogQHBhcmFtIHRhYmxlYXVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHRhYmxlYXUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cudGFibGVhdSlcbiogQHBhcmFtIHByaXZhdGVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHByaXZhdGUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cuX3RhYmxlYXUpXG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSBUaGUgZ2xvYmFsIG9iamVjdCB0byBhdHRhY2ggdGhpbmdzIHRvICh1c3VhbGx5IHdpbmRvdylcbiovXG5mdW5jdGlvbiBTaGFyZWQgKHRhYmxlYXVBcGlPYmosIHByaXZhdGVBcGlPYmosIGdsb2JhbE9iaikge1xuICB0aGlzLnByaXZhdGVBcGlPYmogPSBwcml2YXRlQXBpT2JqO1xuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IGZhbHNlO1xuXG4gIHRoaXMuY2hhbmdlVGFibGVhdUFwaU9iaih0YWJsZWF1QXBpT2JqKTtcbn1cblxuXG5TaGFyZWQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgc2hhcmVkIFdEQ1wiKTtcbiAgdGhpcy5nbG9iYWxPYmoub25lcnJvciA9IHRoaXMuX2Vycm9ySGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIGZ1bmN0aW9ucyB3aGljaCB3aWxsIGJlIGludm9rZWQgYnkgdGhlIG5hdGl2ZSBjb2RlXG4gIHRoaXMuX2luaXRUcmlnZ2VyRnVuY3Rpb25zKCk7XG5cbiAgLy8gQXNzaWduIHRoZSBkZXByZWNhdGVkIGZ1bmN0aW9ucyB3aGljaCBhcmVuJ3QgYXZhaWxpYmxlIGluIHRoaXMgdmVyc2lvbiBvZiB0aGUgQVBJXG4gIHRoaXMuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zKCk7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuY2hhbmdlVGFibGVhdUFwaU9iaiA9IGZ1bmN0aW9uKHRhYmxlYXVBcGlPYmopIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqID0gdGFibGVhdUFwaU9iajtcblxuICAvLyBBc3NpZ24gb3VyIG1ha2UgJiByZWdpc3RlciBmdW5jdGlvbnMgcmlnaHQgYXdheSBiZWNhdXNlIGEgY29ubmVjdG9yIGNhbiB1c2VcbiAgLy8gdGhlbSBpbW1lZGlhdGVseSwgZXZlbiBiZWZvcmUgYm9vdHN0cmFwcGluZyBoYXMgY29tcGxldGVkXG4gIHRoaXMudGFibGVhdUFwaU9iai5tYWtlQ29ubmVjdG9yID0gdGhpcy5fbWFrZUNvbm5lY3Rvci5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmoucmVnaXN0ZXJDb25uZWN0b3IgPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rvci5iaW5kKHRoaXMpO1xuXG4gIEVudW1zLmFwcGx5KHRoaXMudGFibGVhdUFwaU9iaik7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2Vycm9ySGFuZGxlciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGZpbGUsIGxpbmUsIGNvbHVtbiwgZXJyb3JPYmopIHtcbiAgY29uc29sZS5lcnJvcihlcnJvck9iaik7IC8vIHByaW50IGVycm9yIGZvciBkZWJ1Z2dpbmcgaW4gdGhlIGJyb3dzZXJcbiAgaWYgKHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBtc2cgPSBtZXNzYWdlO1xuICBpZihlcnJvck9iaikge1xuICAgIG1zZyArPSBcIiAgIHN0YWNrOlwiICsgZXJyb3JPYmouc3RhY2s7XG4gIH0gZWxzZSB7XG4gICAgbXNnICs9IFwiICAgZmlsZTogXCIgKyBmaWxlO1xuICAgIG1zZyArPSBcIiAgIGxpbmU6IFwiICsgbGluZTtcbiAgfVxuXG4gIGlmICh0aGlzLnRhYmxlYXVBcGlPYmogJiYgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKSB7XG4gICAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKG1zZyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbXNnO1xuICB9XG5cbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IHRydWU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9tYWtlQ29ubmVjdG9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZWZhdWx0SW1wbHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfSxcbiAgICBzaHV0ZG93bjogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfVxuICB9O1xuXG4gIHJldHVybiBkZWZhdWx0SW1wbHM7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX3JlZ2lzdGVyQ29ubmVjdG9yID0gZnVuY3Rpb24gKHdkYykge1xuXG4gIC8vIGRvIHNvbWUgZXJyb3IgY2hlY2tpbmcgb24gdGhlIHdkY1xuICB2YXIgZnVuY3Rpb25OYW1lcyA9IFtcImluaXRcIiwgXCJzaHV0ZG93blwiLCBcImdldFNjaGVtYVwiLCBcImdldERhdGFcIl07XG4gIGZvciAodmFyIGlpID0gZnVuY3Rpb25OYW1lcy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XG4gICAgaWYgKHR5cGVvZih3ZGNbZnVuY3Rpb25OYW1lc1tpaV1dKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBcIlRoZSBjb25uZWN0b3IgZGlkIG5vdCBkZWZpbmUgdGhlIHJlcXVpcmVkIGZ1bmN0aW9uOiBcIiArIGZ1bmN0aW9uTmFtZXNbaWldO1xuICAgIH1cbiAgfTtcblxuICBjb25zb2xlLmxvZyhcIkNvbm5lY3RvciByZWdpc3RlcmVkXCIpO1xuXG4gIHRoaXMuZ2xvYmFsT2JqLl93ZGMgPSB3ZGM7XG4gIHRoaXMuX3dkYyA9IHdkYztcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5faW5pdFRyaWdnZXJGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJJbml0aWFsaXphdGlvbiA9IHRoaXMuX3RyaWdnZXJJbml0aWFsaXphdGlvbi5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlclNjaGVtYUdhdGhlcmluZyA9IHRoaXMuX3RyaWdnZXJTY2hlbWFHYXRoZXJpbmcuYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJEYXRhR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlckRhdGFHYXRoZXJpbmcuYmluZCh0aGlzKTtcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTaHV0ZG93biA9IHRoaXMuX3RyaWdnZXJTaHV0ZG93bi5iaW5kKHRoaXMpO1xufVxuXG4vLyBTdGFydHMgdGhlIFdEQ1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlckluaXRpYWxpemF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5pbml0KHRoaXMucHJpdmF0ZUFwaU9iai5faW5pdENhbGxiYWNrKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBzY2hlbWEgZ2F0aGVyaW5nIHByb2Nlc3NcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLmdldFNjaGVtYSh0aGlzLnByaXZhdGVBcGlPYmouX3NjaGVtYUNhbGxiYWNrKTtcbn1cblxuLy8gU3RhcnRzIHRoZSBkYXRhIGdhdGhlcmluZyBwcm9jZXNzXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyRGF0YUdhdGhlcmluZyA9IGZ1bmN0aW9uKHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcykge1xuICBpZiAodGFibGVzQW5kSW5jcmVtZW50VmFsdWVzLmxlbmd0aCAhPSAxKSB7XG4gICAgdGhyb3cgKFwiVW5leHBlY3RlZCBudW1iZXIgb2YgdGFibGVzIHNwZWNpZmllZC4gRXhwZWN0ZWQgMSwgYWN0dWFsIFwiICsgdGFibGVzQW5kSW5jcmVtZW50VmFsdWVzLmxlbmd0aC50b1N0cmluZygpKTtcbiAgfVxuXG4gIHZhciB0YWJsZUFuZEluY3JlbW50VmFsdWUgPSB0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXNbMF07XG4gIHZhciB0YWJsZSA9IG5ldyBUYWJsZSh0YWJsZUFuZEluY3JlbW50VmFsdWUudGFibGVJbmZvLCB0YWJsZUFuZEluY3JlbW50VmFsdWUuaW5jcmVtZW50VmFsdWUsIHRoaXMucHJpdmF0ZUFwaU9iai5fdGFibGVEYXRhQ2FsbGJhY2spO1xuICB0aGlzLl93ZGMuZ2V0RGF0YSh0YWJsZSwgdGhpcy5wcml2YXRlQXBpT2JqLl9kYXRhRG9uZUNhbGxiYWNrKTtcbn1cblxuLy8gVGVsbHMgdGhlIFdEQyBpdCdzIHRpbWUgdG8gc2h1dCBkb3duXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyU2h1dGRvd24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLnNodXRkb3duKHRoaXMucHJpdmF0ZUFwaU9iai5fc2h1dGRvd25DYWxsYmFjayk7XG59XG5cbi8vIEluaXRpYWxpemVzIGEgc2VyaWVzIG9mIGdsb2JhbCBjYWxsYmFja3Mgd2hpY2ggaGF2ZSBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMFxuU2hhcmVkLnByb3RvdHlwZS5faW5pdERlcHJlY2F0ZWRGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmluaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouaGVhZGVyc0NhbGxiYWNrID0gdGhpcy5faGVhZGVyc0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5kYXRhQ2FsbGJhY2sgPSB0aGlzLl9kYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLnNodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5pbml0Q2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gaW5pdFwiKTtcbn07XG5cblNoYXJlZC5wcm90b3R5cGUuX2hlYWRlcnNDYWxsYmFjayA9IGZ1bmN0aW9uIChmaWVsZE5hbWVzLCB0eXBlcykge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LmhlYWRlcnNDYWxsYmFjayBoYXMgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9kYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSwgbGFzdFJlY29yZFRva2VuLCBtb3JlRGF0YSkge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LmRhdGFDYWxsYmFjayBoYXMgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LnNodXRkb3duQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gc2h1dGRvd25cIik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlZDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9TaGFyZWQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogQGNsYXNzIFVzZWQgZm9yIGNvbW11bmljYXRpbmcgYmV0d2VlbiB0aGUgc2ltdWxhdG9yIGFuZCB3ZWIgZGF0YSBjb25uZWN0b3IuIEl0IGRvZXNcbiogdGhpcyBieSBwYXNzaW5nIG1lc3NhZ2VzIGJldHdlZW4gdGhlIFdEQyB3aW5kb3cgYW5kIGl0cyBwYXJlbnQgd2luZG93XG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSB0aGUgZ2xvYmFsIG9iamVjdCB0byBmaW5kIHRhYmxlYXUgaW50ZXJmYWNlcyBhcyB3ZWxsXG4qIGFzIHJlZ2lzdGVyIGV2ZW50cyAodXN1YWxseSB3aW5kb3cpXG4qL1xuZnVuY3Rpb24gU2ltdWxhdG9yRGlzcGF0Y2hlciAoZ2xvYmFsT2JqKSB7XG4gIHRoaXMuZ2xvYmFsT2JqID0gZ2xvYmFsT2JqO1xuICB0aGlzLl9pbml0TWVzc2FnZUhhbmRsaW5nKCk7XG4gIHRoaXMuX2luaXRQdWJsaWNJbnRlcmZhY2UoKTtcbiAgdGhpcy5faW5pdFByaXZhdGVJbnRlcmZhY2UoKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRNZXNzYWdlSGFuZGxpbmcgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgbWVzc2FnZSBoYW5kbGluZ1wiKTtcbiAgdGhpcy5nbG9iYWxPYmouYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX3JlY2VpdmVNZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy5nbG9iYWxPYmouZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgdGhpcy5fb25Eb21Db250ZW50TG9hZGVkLmJpbmQodGhpcykpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fb25Eb21Db250ZW50TG9hZGVkID0gZnVuY3Rpb24oKSB7XG4gIC8vIEF0dGVtcHQgdG8gbm90aWZ5IHRoZSBzaW11bGF0b3Igd2luZG93IHRoYXQgdGhlIFdEQyBoYXMgbG9hZGVkXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLnBhcmVudCAhPT0gd2luZG93KSB7XG4gICAgdGhpcy5nbG9iYWxPYmoucGFyZW50LnBvc3RNZXNzYWdlKHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQoJ2xvYWRlZCcpLCAnKicpO1xuICB9XG5cbiAgaWYodGhpcy5nbG9iYWxPYmoub3BlbmVyKSB7XG4gICAgdHJ5IHsgLy8gV3JhcCBpbiB0cnkvY2F0Y2ggZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFXG4gICAgICB0aGlzLmdsb2JhbE9iai5vcGVuZXIucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NvbWUgdmVyc2lvbnMgb2YgSUUgbWF5IG5vdCBhY2N1cmF0ZWx5IHNpbXVsYXRlIHRoZSBXZWIgRGF0YSBDb25uZWN0b3IuIFBsZWFzZSByZXRyeSBvbiBhIFdlYmtpdCBiYXNlZCBicm93c2VyJyk7XG4gICAgfVxuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb3BWYWx1ZXMgPSB7XG4gICAgXCJjb25uZWN0aW9uTmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25OYW1lLFxuICAgIFwiY29ubmVjdGlvbkRhdGFcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uRGF0YSxcbiAgICBcInBhc3N3b3JkXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQsXG4gICAgXCJ1c2VybmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lLFxuICAgIFwidXNlcm5hbWVBbGlhc1wiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lQWxpYXMsXG4gICAgXCJpbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW5cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4sXG4gICAgXCJ2ZXJzaW9uTnVtYmVyXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudmVyc2lvbk51bWJlcixcbiAgICBcImxvY2FsZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmxvY2FsZSxcbiAgICBcImF1dGhQdXJwb3NlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UsXG4gICAgXCJwbGF0Zm9ybU9TXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyxcbiAgICBcInBsYXRmb3JtVmVyc2lvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbixcbiAgICBcInBsYXRmb3JtRWRpdGlvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbixcbiAgICBcInBsYXRmb3JtQnVpbGROdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyXG4gIH07XG5cbiAgcmV0dXJuIHByb3BWYWx1ZXM7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hcHBseVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgaWYgKHByb3BzKSB7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSA9IHByb3BzLmNvbm5lY3Rpb25OYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEgPSBwcm9wcy5jb25uZWN0aW9uRGF0YTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkID0gcHJvcHMucGFzc3dvcmQ7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSA9IHByb3BzLnVzZXJuYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyA9IHByb3BzLnVzZXJuYW1lQWxpYXM7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4gPSBwcm9wcy5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW47XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUgPSBwcm9wcy5sb2NhbGU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sYW5ndWFnZSA9IHByb3BzLmxvY2FsZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmF1dGhQdXJwb3NlID0gcHJvcHMuYXV0aFB1cnBvc2U7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TID0gcHJvcHMucGxhdGZvcm1PUztcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbiA9IHByb3BzLnBsYXRmb3JtVmVyc2lvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbiA9IHByb3BzLnBsYXRmb3JtRWRpdGlvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXIgPSBwcm9wcy5wbGF0Zm9ybUJ1aWxkTnVtYmVyO1xuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9idWlsZE1lc3NhZ2VQYXlsb2FkID0gZnVuY3Rpb24obXNnTmFtZSwgbXNnRGF0YSwgcHJvcHMpIHtcbiAgdmFyIG1zZ09iaiA9IHtcIm1zZ05hbWVcIjogbXNnTmFtZSwgXCJtc2dEYXRhXCI6IG1zZ0RhdGEsIFwicHJvcHNcIjogcHJvcHMsIFwidmVyc2lvblwiOiBCVUlMRF9OVU1CRVIgfTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1zZ09iaik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEpIHtcbiAgdmFyIG1lc3NhZ2VQYXlsb2FkID0gdGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZChtc2dOYW1lLCBtc2dEYXRhLCB0aGlzLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMoKSk7XG5cbiAgLy8gQ2hlY2sgZmlyc3QgdG8gc2VlIGlmIHdlIGhhdmUgYSBtZXNzYWdlSGFuZGxlciBkZWZpbmVkIHRvIHBvc3QgdGhlIG1lc3NhZ2UgdG9cbiAgaWYgKHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycyAhPSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQpO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9zb3VyY2VXaW5kb3cpIHtcbiAgICB0aHJvdyBcIkxvb2tzIGxpa2UgdGhlIFdEQyBpcyBjYWxsaW5nIGEgdGFibGVhdSBmdW5jdGlvbiBiZWZvcmUgdGFibGVhdS5pbml0KCkgaGFzIGJlZW4gY2FsbGVkLlwiXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fc291cmNlV2luZG93LnBvc3RNZXNzYWdlKG1lc3NhZ2VQYXlsb2FkLCBcIipcIik7XG4gIH1cbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFBheWxvYWRPYmogPSBmdW5jdGlvbihwYXlsb2FkU3RyaW5nKSB7XG4gIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgdHJ5IHtcbiAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShwYXlsb2FkU3RyaW5nKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGF5bG9hZDtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcbiAgLy8gRHVlIHRvIGNyb3NzLW9yaWdpbiBzZWN1cml0eSBpc3N1ZXMgb3ZlciBodHRwcywgd2UgbWF5IG5vdCBiZSBhYmxlIHRvIHJldHJpZXZlIF9zb3VyY2VXaW5kb3cuXG4gIC8vIFVzZSBzb3VyY2VPcmlnaW4gaW5zdGVhZC5cbiAgdmFyIGhvc3ROYW1lID0gdGhpcy5fc291cmNlT3JpZ2luIHx8IHRoaXMuX3NvdXJjZVdpbmRvdy5sb2NhdGlvbi5vcmlnaW47XG5cbiAgdmFyIHN1cHBvcnRlZEhvc3RzID0gW1wiaHR0cDovL2xvY2FsaG9zdFwiLCBcImh0dHBzOi8vbG9jYWxob3N0XCIsIFwiaHR0cDovL3RhYmxlYXUuZ2l0aHViLmlvXCIsIFwiaHR0cHM6Ly90YWJsZWF1LmdpdGh1Yi5pb1wiXTtcbiAgaWYgKHN1cHBvcnRlZEhvc3RzLmluZGV4T2YoaG9zdE5hbWUpID49IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIFdoaXRlbGlzdCBUYWJsZWF1IGRvbWFpbnNcbiAgaWYgKGhvc3ROYW1lICYmIGhvc3ROYW1lLmVuZHNXaXRoKFwib25saW5lLnRhYmxlYXUuY29tXCIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBsb2NhbGl6ZWRXYXJuaW5nVGl0bGUgPSB0aGlzLl9nZXRMb2NhbGl6ZWRTdHJpbmcoXCJ3ZWJTZWN1cml0eVdhcm5pbmdcIik7XG4gIHZhciBjb21wbGV0ZVdhcm5pbmdNc2cgID0gbG9jYWxpemVkV2FybmluZ1RpdGxlICsgXCJcXG5cXG5cIiArIGhvc3ROYW1lICsgXCJcXG5cIjtcbiAgcmV0dXJuIGNvbmZpcm0oY29tcGxldGVXYXJuaW5nTXNnKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldEN1cnJlbnRMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBVc2UgY3VycmVudCBicm93c2VyJ3MgbG9jYWxlIHRvIGdldCBhIGxvY2FsaXplZCB3YXJuaW5nIG1lc3NhZ2VcbiAgICB2YXIgY3VycmVudEJyb3dzZXJMYW5ndWFnZSA9IChuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZSk7XG4gICAgdmFyIGxvY2FsZSA9IGN1cnJlbnRCcm93c2VyTGFuZ3VhZ2U/IGN1cnJlbnRCcm93c2VyTGFuZ3VhZ2Uuc3Vic3RyaW5nKDAsIDIpOiBcImVuXCI7XG5cbiAgICB2YXIgc3VwcG9ydGVkTG9jYWxlcyA9IFtcImRlXCIsIFwiZW5cIiwgXCJlc1wiLCBcImZyXCIsIFwiamFcIiwgXCJrb1wiLCBcInB0XCIsIFwiemhcIl07XG4gICAgLy8gRmFsbCBiYWNrIHRvIEVuZ2xpc2ggZm9yIG90aGVyIHVuc3VwcG9ydGVkIGxhbmFndWFnZXNcbiAgICBpZiAoc3VwcG9ydGVkTG9jYWxlcy5pbmRleE9mKGxvY2FsZSkgPCAwKSB7XG4gICAgICAgIGxvY2FsZSA9ICdlbic7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvY2FsZTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldExvY2FsaXplZFN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZ0tleSkge1xuICAgIHZhciBsb2NhbGUgPSB0aGlzLl9nZXRDdXJyZW50TG9jYWxlKCk7XG5cbiAgICAvLyBVc2Ugc3RhdGljIHJlcXVpcmUgaGVyZSwgb3RoZXJ3aXNlIHdlYnBhY2sgd291bGQgZ2VuZXJhdGUgYSBtdWNoIGJpZ2dlciBKUyBmaWxlXG4gICAgdmFyIGRlU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb24nKTtcbiAgICB2YXIgZW5TdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZW4tVVMuanNvbicpO1xuICAgIHZhciBlc1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uJyk7XG4gICAgdmFyIGphU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24nKTtcbiAgICB2YXIgZnJTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbicpO1xuICAgIHZhciBrb1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uJyk7XG4gICAgdmFyIHB0U3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb24nKTtcbiAgICB2YXIgemhTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfemgtQ04uanNvbicpO1xuXG4gICAgdmFyIHN0cmluZ0pzb25NYXBCeUxvY2FsZSA9XG4gICAge1xuICAgICAgICBcImRlXCI6IGRlU3RyaW5nc01hcCxcbiAgICAgICAgXCJlblwiOiBlblN0cmluZ3NNYXAsXG4gICAgICAgIFwiZXNcIjogZXNTdHJpbmdzTWFwLFxuICAgICAgICBcImZyXCI6IGZyU3RyaW5nc01hcCxcbiAgICAgICAgXCJqYVwiOiBqYVN0cmluZ3NNYXAsXG4gICAgICAgIFwia29cIjoga29TdHJpbmdzTWFwLFxuICAgICAgICBcInB0XCI6IHB0U3RyaW5nc01hcCxcbiAgICAgICAgXCJ6aFwiOiB6aFN0cmluZ3NNYXBcbiAgICB9O1xuXG4gICAgdmFyIGxvY2FsaXplZFN0cmluZ3NKc29uID0gc3RyaW5nSnNvbk1hcEJ5TG9jYWxlW2xvY2FsZV07XG4gICAgcmV0dXJuIGxvY2FsaXplZFN0cmluZ3NKc29uW3N0cmluZ0tleV07XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIG1lc3NhZ2UhXCIpO1xuXG4gIHZhciB3ZGMgPSB0aGlzLmdsb2JhbE9iai5fd2RjO1xuICBpZiAoIXdkYykge1xuICAgIHRocm93IFwiTm8gV0RDIHJlZ2lzdGVyZWQuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgdGFibGVhdS5yZWdpc3RlckNvbm5lY3Rvcj9cIjtcbiAgfVxuXG4gIHZhciBwYXlsb2FkT2JqID0gdGhpcy5fZ2V0UGF5bG9hZE9iaihldnQuZGF0YSk7XG4gIGlmKCFwYXlsb2FkT2JqKSByZXR1cm47IC8vIFRoaXMgbWVzc2FnZSBpcyBub3QgbmVlZGVkIGZvciBXRENcblxuICBpZiAoIXRoaXMuX3NvdXJjZVdpbmRvdykge1xuICAgIHRoaXMuX3NvdXJjZVdpbmRvdyA9IGV2dC5zb3VyY2U7XG4gICAgdGhpcy5fc291cmNlT3JpZ2luID0gZXZ0Lm9yaWdpbjtcbiAgfVxuXG4gIHZhciBtc2dEYXRhID0gcGF5bG9hZE9iai5tc2dEYXRhO1xuICB0aGlzLl9hcHBseVByb3BlcnR5VmFsdWVzKHBheWxvYWRPYmoucHJvcHMpO1xuXG4gIHN3aXRjaChwYXlsb2FkT2JqLm1zZ05hbWUpIHtcbiAgICBjYXNlIFwiaW5pdFwiOlxuICAgICAgLy8gV2FybiB1c2VycyBhYm91dCBwb3NzaWJsZSBwaGluaXNoaW5nIGF0dGFja3NcbiAgICAgIHZhciBjb25maXJtUmVzdWx0ID0gdGhpcy5fZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybSgpO1xuICAgICAgaWYgKCFjb25maXJtUmVzdWx0KSB7XG4gICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5waGFzZSA9IG1zZ0RhdGEucGhhc2U7XG4gICAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJJbml0aWFsaXphdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2h1dGRvd25cIjpcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJTaHV0ZG93bigpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImdldFNjaGVtYVwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNjaGVtYUdhdGhlcmluZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImdldERhdGFcIjpcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJEYXRhR2F0aGVyaW5nKG1zZ0RhdGEudGFibGVzQW5kSW5jcmVtZW50VmFsdWVzKTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG4vKioqKiBQVUJMSUMgSU5URVJGQUNFICoqKioqL1xuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQdWJsaWNJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZVwiKTtcbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRGb3JBdXRoID0gdGhpcy5fYWJvcnRGb3JBdXRoLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydFdpdGhFcnJvciA9IHRoaXMuX2Fib3J0V2l0aEVycm9yLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5sb2cgPSB0aGlzLl9sb2cuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnN1Ym1pdCA9IHRoaXMuX3N1Ym1pdC5iaW5kKHRoaXMpO1xuXG4gIC8vIEFzc2lnbiB0aGUgcHVibGljIGludGVyZmFjZSB0byB0aGlzXG4gIHRoaXMucHVibGljSW50ZXJmYWNlID0gcHVibGljSW50ZXJmYWNlO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRGb3JBdXRoID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiYWJvcnRGb3JBdXRoXCIsIHtcIm1zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0V2l0aEVycm9yID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiYWJvcnRXaXRoRXJyb3JcIiwge1wiZXJyb3JNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XG4gIC8vIERvbid0IGJvdGhlciBwYXNzaW5nIHRoaXMgYmFjayB0byB0aGUgc2ltdWxhdG9yIHNpbmNlIHRoZXJlJ3Mgbm90aGluZyBpdCBjYW5cbiAgLy8gZG8uIEp1c3QgY2FsbCBiYWNrIHRvIHRoZSBXREMgaW5kaWNhdGluZyB0aGF0IGl0IHdvcmtlZFxuICBjb25zb2xlLmxvZyhcIkNyb3NzIE9yaWdpbiBFeGNlcHRpb24gcmVxdWVzdGVkIGluIHRoZSBzaW11bGF0b3IuIFByZXRlbmRpbmcgdG8gd29yay5cIilcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdsb2JhbE9iai5fd2RjLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uQ29tcGxldGVkKGRlc3RPcmlnaW5MaXN0KTtcbiAgfS5iaW5kKHRoaXMpLCAwKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImxvZ1wiLCB7XCJsb2dNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzdWJtaXRcIik7XG59O1xuXG4vKioqKiBQUklWQVRFIElOVEVSRkFDRSAqKioqKi9cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHJpdmF0ZUludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwcml2YXRlIGludGVyZmFjZVwiKTtcblxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX2RhdGFEb25lQ2FsbGJhY2sgPSB0aGlzLl9kYXRhRG9uZUNhbGxiYWNrLmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwcml2YXRlIGludGVyZmFjZSB0byB0aGlzXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJpbml0Q2FsbGJhY2tcIik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic2h1dGRvd25DYWxsYmFja1wiKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX3NjaGVtYUNhbGxiYWNrXCIsIHtcInNjaGVtYVwiOiBzY2hlbWEsIFwic3RhbmRhcmRDb25uZWN0aW9uc1wiIDogc3RhbmRhcmRDb25uZWN0aW9ucyB8fCBbXX0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfdGFibGVEYXRhQ2FsbGJhY2tcIiwgeyBcInRhYmxlTmFtZVwiOiB0YWJsZU5hbWUsIFwiZGF0YVwiOiBkYXRhIH0pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9kYXRhRG9uZUNhbGxiYWNrXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRvckRpc3BhdGNoZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuKiBAY2xhc3MgUmVwcmVzZW50cyBhIHNpbmdsZSB0YWJsZSB3aGljaCBUYWJsZWF1IGhhcyByZXF1ZXN0ZWRcbiogQHBhcmFtIHRhYmxlSW5mbyB7T2JqZWN0fSAtIEluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWJsZVxuKiBAcGFyYW0gaW5jcmVtZW50VmFsdWUge3N0cmluZz19IC0gSW5jcmVtZW50YWwgdXBkYXRlIHZhbHVlXG4qL1xuZnVuY3Rpb24gVGFibGUodGFibGVJbmZvLCBpbmNyZW1lbnRWYWx1ZSwgZGF0YUNhbGxiYWNrRm4pIHtcbiAgLyoqIEBtZW1iZXIge09iamVjdH0gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYmxlIHdoaWNoIGhhcyBiZWVuIHJlcXVlc3RlZC4gVGhpcyBpc1xuICBndWFyYW50ZWVkIHRvIGJlIG9uZSBvZiB0aGUgdGFibGVzIHRoZSBjb25uZWN0b3IgcmV0dXJuZWQgaW4gdGhlIGNhbGwgdG8gZ2V0U2NoZW1hLiAqL1xuICB0aGlzLnRhYmxlSW5mbyA9IHRhYmxlSW5mbztcblxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBEZWZpbmVzIHRoZSBpbmNyZW1lbnRhbCB1cGRhdGUgdmFsdWUgZm9yIHRoaXMgdGFibGUuIEVtcHR5IHN0cmluZyBpZlxuICB0aGVyZSBpcyBub3QgYW4gaW5jcmVtZW50YWwgdXBkYXRlIHJlcXVlc3RlZC4gKi9cbiAgdGhpcy5pbmNyZW1lbnRWYWx1ZSA9IGluY3JlbWVudFZhbHVlIHx8IFwiXCI7XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuID0gZGF0YUNhbGxiYWNrRm47XG5cbiAgLy8gYmluZCB0aGUgcHVibGljIGZhY2luZyB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24gc28gaXQgY2FuIGJlIHBhc3NlZCBhcm91bmRcbiAgdGhpcy5hcHBlbmRSb3dzID0gdGhpcy5fYXBwZW5kUm93cy5iaW5kKHRoaXMpO1xufVxuXG4vKipcbiogQG1ldGhvZCBhcHBlbmRzIHRoZSBnaXZlbiByb3dzIHRvIHRoZSBzZXQgb2YgZGF0YSBjb250YWluZWQgaW4gdGhpcyB0YWJsZVxuKiBAcGFyYW0gZGF0YSB7YXJyYXl9IC0gRWl0aGVyIGFuIGFycmF5IG9mIGFycmF5cyBvciBhbiBhcnJheSBvZiBvYmplY3RzIHdoaWNoIHJlcHJlc2VudFxuKiB0aGUgaW5kaXZpZHVhbCByb3dzIG9mIGRhdGEgdG8gYXBwZW5kIHRvIHRoaXMgdGFibGVcbiovXG5UYWJsZS5wcm90b3R5cGUuX2FwcGVuZFJvd3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gIC8vIERvIHNvbWUgcXVpY2sgdmFsaWRhdGlvbiB0aGF0IHRoaXMgZGF0YSBpcyB0aGUgZm9ybWF0IHdlIGV4cGVjdFxuICBpZiAoIWRhdGEpIHtcbiAgICBjb25zb2xlLndhcm4oXCJyb3dzIGRhdGEgaXMgbnVsbCBvciB1bmRlZmluZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgLy8gTG9nIGEgd2FybmluZyBiZWNhdXNlIHRoZSBkYXRhIGlzIG5vdCBhbiBhcnJheSBsaWtlIHdlIGV4cGVjdGVkXG4gICAgY29uc29sZS53YXJuKFwiVGFibGUuYXBwZW5kUm93cyBtdXN0IHRha2UgYW4gYXJyYXkgb2YgYXJyYXlzIG9yIGFycmF5IG9mIG9iamVjdHNcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ2FsbCBiYWNrIHdpdGggdGhlIHJvd3MgZm9yIHRoaXMgdGFibGVcbiAgdGhpcy5fZGF0YUNhbGxiYWNrRm4odGhpcy50YWJsZUluZm8uaWQsIGRhdGEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL1RhYmxlLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gY29weUZ1bmN0aW9ucyhzcmMsIGRlc3QpIHtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgaWYgKHR5cGVvZiBzcmNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvcHlGdW5jdGlvbnMgPSBjb3B5RnVuY3Rpb25zO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL1V0aWxpdGllcy5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvblxuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZW4tVVMuanNvblxuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvblxuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvblxuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvblxuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJ3d1RvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfemgtQ04uanNvblxuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKipcbioqIENvcHlyaWdodCAoQykgMjAxNSBUaGUgUXQgQ29tcGFueSBMdGQuXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTQgS2xhcsOkbHZkYWxlbnMgRGF0YWtvbnN1bHQgQUIsIGEgS0RBQiBHcm91cCBjb21wYW55LCBpbmZvQGtkYWIuY29tLCBhdXRob3IgTWlsaWFuIFdvbGZmIDxtaWxpYW4ud29sZmZAa2RhYi5jb20+XG4qKiBDb250YWN0OiBodHRwOi8vd3d3LnF0LmlvL2xpY2Vuc2luZy9cbioqXG4qKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgUXRXZWJDaGFubmVsIG1vZHVsZSBvZiB0aGUgUXQgVG9vbGtpdC5cbioqXG4qKiAkUVRfQkVHSU5fTElDRU5TRTpMR1BMMjEkXG4qKiBDb21tZXJjaWFsIExpY2Vuc2UgVXNhZ2VcbioqIExpY2Vuc2VlcyBob2xkaW5nIHZhbGlkIGNvbW1lcmNpYWwgUXQgbGljZW5zZXMgbWF5IHVzZSB0aGlzIGZpbGUgaW5cbioqIGFjY29yZGFuY2Ugd2l0aCB0aGUgY29tbWVyY2lhbCBsaWNlbnNlIGFncmVlbWVudCBwcm92aWRlZCB3aXRoIHRoZVxuKiogU29mdHdhcmUgb3IsIGFsdGVybmF0aXZlbHksIGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgY29udGFpbmVkIGluXG4qKiBhIHdyaXR0ZW4gYWdyZWVtZW50IGJldHdlZW4geW91IGFuZCBUaGUgUXQgQ29tcGFueS4gRm9yIGxpY2Vuc2luZyB0ZXJtc1xuKiogYW5kIGNvbmRpdGlvbnMgc2VlIGh0dHA6Ly93d3cucXQuaW8vdGVybXMtY29uZGl0aW9ucy4gRm9yIGZ1cnRoZXJcbioqIGluZm9ybWF0aW9uIHVzZSB0aGUgY29udGFjdCBmb3JtIGF0IGh0dHA6Ly93d3cucXQuaW8vY29udGFjdC11cy5cbioqXG4qKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgVXNhZ2VcbioqIEFsdGVybmF0aXZlbHksIHRoaXMgZmlsZSBtYXkgYmUgdXNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXJcbioqIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyLjEgb3IgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZVxuKiogU29mdHdhcmUgRm91bmRhdGlvbiBhbmQgYXBwZWFyaW5nIGluIHRoZSBmaWxlIExJQ0VOU0UuTEdQTHYyMSBhbmRcbioqIExJQ0VOU0UuTEdQTHYzIGluY2x1ZGVkIGluIHRoZSBwYWNrYWdpbmcgb2YgdGhpcyBmaWxlLiBQbGVhc2UgcmV2aWV3IHRoZVxuKiogZm9sbG93aW5nIGluZm9ybWF0aW9uIHRvIGVuc3VyZSB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qKiByZXF1aXJlbWVudHMgd2lsbCBiZSBtZXQ6IGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvbGdwbC5odG1sIGFuZFxuKiogaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL29sZC1saWNlbnNlcy9sZ3BsLTIuMS5odG1sLlxuKipcbioqIEFzIGEgc3BlY2lhbCBleGNlcHRpb24sIFRoZSBRdCBDb21wYW55IGdpdmVzIHlvdSBjZXJ0YWluIGFkZGl0aW9uYWxcbioqIHJpZ2h0cy4gVGhlc2UgcmlnaHRzIGFyZSBkZXNjcmliZWQgaW4gVGhlIFF0IENvbXBhbnkgTEdQTCBFeGNlcHRpb25cbioqIHZlcnNpb24gMS4xLCBpbmNsdWRlZCBpbiB0aGUgZmlsZSBMR1BMX0VYQ0VQVElPTi50eHQgaW4gdGhpcyBwYWNrYWdlLlxuKipcbioqICRRVF9FTkRfTElDRU5TRSRcbioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzID0ge1xuICAgIHNpZ25hbDogMSxcbiAgICBwcm9wZXJ0eVVwZGF0ZTogMixcbiAgICBpbml0OiAzLFxuICAgIGlkbGU6IDQsXG4gICAgZGVidWc6IDUsXG4gICAgaW52b2tlTWV0aG9kOiA2LFxuICAgIGNvbm5lY3RUb1NpZ25hbDogNyxcbiAgICBkaXNjb25uZWN0RnJvbVNpZ25hbDogOCxcbiAgICBzZXRQcm9wZXJ0eTogOSxcbiAgICByZXNwb25zZTogMTAsXG59O1xuXG52YXIgUVdlYkNoYW5uZWwgPSBmdW5jdGlvbih0cmFuc3BvcnQsIGluaXRDYWxsYmFjaylcbntcbiAgICBpZiAodHlwZW9mIHRyYW5zcG9ydCAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdHJhbnNwb3J0LnNlbmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlIFFXZWJDaGFubmVsIGV4cGVjdHMgYSB0cmFuc3BvcnQgb2JqZWN0IHdpdGggYSBzZW5kIGZ1bmN0aW9uIGFuZCBvbm1lc3NhZ2UgY2FsbGJhY2sgcHJvcGVydHkuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiIEdpdmVuIGlzOiB0cmFuc3BvcnQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydCkgKyBcIiwgdHJhbnNwb3J0LnNlbmQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydC5zZW5kKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2hhbm5lbCA9IHRoaXM7XG4gICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbihkYXRhKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwudHJhbnNwb3J0LnNlbmQoZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmFuc3BvcnQub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnNpZ25hbDpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVNpZ25hbChkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVSZXNwb25zZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucHJvcGVydHlVcGRhdGU6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVQcm9wZXJ0eVVwZGF0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZDpcIiwgbWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZXhlY0NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuZXhlY0lkID0gMDtcbiAgICB0aGlzLmV4ZWMgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcbiAgICB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIGlmIG5vIGNhbGxiYWNrIGlzIGdpdmVuLCBzZW5kIGRpcmVjdGx5XG4gICAgICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5uZWwuZXhlY0lkID09PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICAgICAgICAvLyB3cmFwXG4gICAgICAgICAgICBjaGFubmVsLmV4ZWNJZCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBleGVjIG1lc3NhZ2Ugd2l0aCBwcm9wZXJ0eSBpZDogXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5pZCA9IGNoYW5uZWwuZXhlY0lkKys7XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1tkYXRhLmlkXSA9IGNhbGxiYWNrO1xuICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIHRoaXMub2JqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5oYW5kbGVTaWduYWwgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1ttZXNzYWdlLm9iamVjdF07XG4gICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdC5zaWduYWxFbWl0dGVkKG1lc3NhZ2Uuc2lnbmFsLCBtZXNzYWdlLmFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHNpZ25hbDogXCIgKyBtZXNzYWdlLm9iamVjdCArIFwiOjpcIiArIG1lc3NhZ2Uuc2lnbmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgaWYgKCFtZXNzYWdlLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHJlc3BvbnNlIG1lc3NhZ2UgcmVjZWl2ZWQ6IFwiLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGRlbGV0ZSBjaGFubmVsLmV4ZWNDYWxsYmFja3NbbWVzc2FnZS5pZF07XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVQcm9wZXJ0eVVwZGF0ZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2UuZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGFbaV07XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gY2hhbm5lbC5vYmplY3RzW2RhdGEub2JqZWN0XTtcbiAgICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QucHJvcGVydHlVcGRhdGUoZGF0YS5zaWduYWxzLCBkYXRhLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcHJvcGVydHkgdXBkYXRlOiBcIiArIGRhdGEub2JqZWN0ICsgXCI6OlwiICsgZGF0YS5zaWduYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWcgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgY2hhbm5lbC5zZW5kKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5kZWJ1ZywgZGF0YTogbWVzc2FnZX0pO1xuICAgIH07XG5cbiAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmluaXR9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIG9iamVjdE5hbWUgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBRT2JqZWN0KG9iamVjdE5hbWUsIGRhdGFbb2JqZWN0TmFtZV0sIGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyB1bndyYXAgcHJvcGVydGllcywgd2hpY2ggbWlnaHQgcmVmZXJlbmNlIG90aGVyIHJlZ2lzdGVyZWQgb2JqZWN0c1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGNoYW5uZWwub2JqZWN0cykge1xuICAgICAgICAgICAgY2hhbm5lbC5vYmplY3RzW29iamVjdE5hbWVdLnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5pdENhbGxiYWNrKSB7XG4gICAgICAgICAgICBpbml0Q2FsbGJhY2soY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pZGxlfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBRT2JqZWN0KG5hbWUsIGRhdGEsIHdlYkNoYW5uZWwpXG57XG4gICAgdGhpcy5fX2lkX18gPSBuYW1lO1xuICAgIHdlYkNoYW5uZWwub2JqZWN0c1tuYW1lXSA9IHRoaXM7XG5cbiAgICAvLyBMaXN0IG9mIGNhbGxiYWNrcyB0aGF0IGdldCBpbnZva2VkIHVwb24gc2lnbmFsIGVtaXNzaW9uXG4gICAgdGhpcy5fX29iamVjdFNpZ25hbHNfXyA9IHt9O1xuXG4gICAgLy8gQ2FjaGUgb2YgYWxsIHByb3BlcnRpZXMsIHVwZGF0ZWQgd2hlbiBhIG5vdGlmeSBzaWduYWwgaXMgZW1pdHRlZFxuICAgIHRoaXMuX19wcm9wZXJ0eUNhY2hlX18gPSB7fTtcblxuICAgIHZhciBvYmplY3QgPSB0aGlzO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdGhpcy51bndyYXBRT2JqZWN0ID0gZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAge1xuICAgICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgLy8gc3VwcG9ydCBsaXN0IG9mIG9iamVjdHNcbiAgICAgICAgICAgIHZhciByZXQgPSBuZXcgQXJyYXkocmVzcG9uc2UubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICByZXRbaV0gPSBvYmplY3QudW53cmFwUU9iamVjdChyZXNwb25zZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzcG9uc2VcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVtcIl9fUU9iamVjdCpfX1wiXVxuICAgICAgICAgICAgfHwgcmVzcG9uc2VbXCJpZFwiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JqZWN0SWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0pXG4gICAgICAgICAgICByZXR1cm4gd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgdW53cmFwIHVua25vd24gUU9iamVjdCBcIiArIG9iamVjdElkICsgXCIgd2l0aG91dCBkYXRhLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxT2JqZWN0ID0gbmV3IFFPYmplY3QoIG9iamVjdElkLCByZXNwb25zZS5kYXRhLCB3ZWJDaGFubmVsICk7XG4gICAgICAgIHFPYmplY3QuZGVzdHJveWVkLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXSA9PT0gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdO1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBub3cgZGVsZXRlZCBRT2JqZWN0IHRvIGFuIGVtcHR5IHt9IG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGp1c3QgYXNzaWduaW5nIHt9IHRob3VnaCB3b3VsZCBub3QgaGF2ZSB0aGUgZGVzaXJlZCBlZmZlY3QsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBiZWxvdyBhbHNvIGVuc3VyZXMgYWxsIGV4dGVybmFsIHJlZmVyZW5jZXMgd2lsbCBzZWUgdGhlIGVtcHR5IG1hcFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHRoaXMgZGV0b3VyIGlzIG5lY2Vzc2FyeSB0byB3b3JrYXJvdW5kIFFUQlVHLTQwMDIxXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4IGluIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHFPYmplY3RbcHJvcGVydHlOYW1lc1tpZHhdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBoZXJlIHdlIGFyZSBhbHJlYWR5IGluaXRpYWxpemVkLCBhbmQgdGh1cyBtdXN0IGRpcmVjdGx5IHVud3JhcCB0aGUgcHJvcGVydGllc1xuICAgICAgICBxT2JqZWN0LnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgcmV0dXJuIHFPYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy51bndyYXBQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJZHggaW4gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fKSB7XG4gICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJZHhdID0gb2JqZWN0LnVud3JhcFFPYmplY3Qob2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTaWduYWwoc2lnbmFsRGF0YSwgaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbClcbiAgICB7XG4gICAgICAgIHZhciBzaWduYWxOYW1lID0gc2lnbmFsRGF0YVswXTtcbiAgICAgICAgdmFyIHNpZ25hbEluZGV4ID0gc2lnbmFsRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W3NpZ25hbE5hbWVdID0ge1xuICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gY29ubmVjdCB0byBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlOb3RpZnlTaWduYWwgJiYgc2lnbmFsTmFtZSAhPT0gXCJkZXN0cm95ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBub3RlIHRoYXQgd2UgYWx3YXlzIGdldCBub3RpZmllZCBhYm91dCB0aGUgZGVzdHJveWVkIHNpZ25hbFxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuY29ubmVjdFRvU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gZGlzY29ubmVjdCBmcm9tIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZmluZCBjb25uZWN0aW9uIG9mIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUgKyBcIiB0byBcIiArIGNhbGxiYWNrLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVxdWlyZWQgZm9yIFwicHVyZVwiIHNpZ25hbHMsIGhhbmRsZWQgc2VwYXJhdGVseSBmb3IgcHJvcGVydGllcyBpbiBwcm9wZXJ0eVVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGlzY29ubmVjdEZyb21TaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IHNpZ25hbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGFsbCBjYWxsYmFja3MgZm9yIHRoZSBnaXZlbiBzaWduYWxuYW1lLiBBbHNvIHdvcmtzIGZvciBwcm9wZXJ0eSBub3RpZnkgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb25zID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbE5hbWVdO1xuICAgICAgICBpZiAoY29ubmVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgc2lnbmFsQXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihzaWduYWxzLCBwcm9wZXJ0eU1hcClcbiAgICB7XG4gICAgICAgIC8vIHVwZGF0ZSBwcm9wZXJ0eSBjYWNoZVxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eUluZGV4IGluIHByb3BlcnR5TWFwKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5TWFwW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHNpZ25hbE5hbWUgaW4gc2lnbmFscykge1xuICAgICAgICAgICAgLy8gSW52b2tlIGFsbCBjYWxsYmFja3MsIGFzIHNpZ25hbEVtaXR0ZWQoKSBkb2VzIG5vdC4gVGhpcyBlbnN1cmVzIHRoZVxuICAgICAgICAgICAgLy8gcHJvcGVydHkgY2FjaGUgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrcyBhcmUgaW52b2tlZC5cbiAgICAgICAgICAgIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxzW3NpZ25hbE5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsRW1pdHRlZCA9IGZ1bmN0aW9uKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpXG4gICAge1xuICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWV0aG9kKG1ldGhvZERhdGEpXG4gICAge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG1ldGhvZERhdGFbMF07XG4gICAgICAgIHZhciBtZXRob2RJZHggPSBtZXRob2REYXRhWzFdO1xuICAgICAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmludm9rZU1ldGhvZCxcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiOiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IG1ldGhvZElkeCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWxsYmFjaykocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRHZXR0ZXJTZXR0ZXIocHJvcGVydHlJbmZvKVxuICAgIHtcbiAgICAgICAgdmFyIHByb3BlcnR5SW5kZXggPSBwcm9wZXJ0eUluZm9bMF07XG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eUluZm9bMV07XG4gICAgICAgIHZhciBub3RpZnlTaWduYWxEYXRhID0gcHJvcGVydHlJbmZvWzJdO1xuICAgICAgICAvLyBpbml0aWFsaXplIHByb3BlcnR5IGNhY2hlIHdpdGggY3VycmVudCB2YWx1ZVxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzIGlzIGFuIG9iamVjdCwgaXQgaXMgbm90IGRpcmVjdGx5IHVud3JhcHBlZCBhcyBpdCBtaWdodFxuICAgICAgICAvLyByZWZlcmVuY2Ugb3RoZXIgUU9iamVjdCB0aGF0IHdlIGRvIG5vdCBrbm93IHlldFxuICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSBwcm9wZXJ0eUluZm9bM107XG5cbiAgICAgICAgaWYgKG5vdGlmeVNpZ25hbERhdGEpIHtcbiAgICAgICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIG5hbWUgaXMgb3B0aW1pemVkIGF3YXksIHJlY29uc3RydWN0IHRoZSBhY3R1YWwgbmFtZVxuICAgICAgICAgICAgICAgIG5vdGlmeVNpZ25hbERhdGFbMF0gPSBwcm9wZXJ0eU5hbWUgKyBcIkNoYW5nZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZFNpZ25hbChub3RpZnlTaWduYWxEYXRhLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZG4ndCBoYXBwZW5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5kZWZpbmVkIHZhbHVlIGluIHByb3BlcnR5IGNhY2hlIGZvciBwcm9wZXJ0eSBcXFwiXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIlxcXCIgaW4gb2JqZWN0IFwiICsgb2JqZWN0Ll9faWRfXyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlByb3BlcnR5IHNldHRlciBmb3IgXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIiBjYWxsZWQgd2l0aCB1bmRlZmluZWQgdmFsdWUhXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zZXRQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBwcm9wZXJ0eUluZGV4LFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZGF0YS5tZXRob2RzLmZvckVhY2goYWRkTWV0aG9kKTtcblxuICAgIGRhdGEucHJvcGVydGllcy5mb3JFYWNoKGJpbmRHZXR0ZXJTZXR0ZXIpO1xuXG4gICAgZGF0YS5zaWduYWxzLmZvckVhY2goZnVuY3Rpb24oc2lnbmFsKSB7IGFkZFNpZ25hbChzaWduYWwsIGZhbHNlKTsgfSk7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEuZW51bXMpIHtcbiAgICAgICAgb2JqZWN0W25hbWVdID0gZGF0YS5lbnVtc1tuYW1lXTtcbiAgICB9XG59XG5cbi8vcmVxdWlyZWQgZm9yIHVzZSB3aXRoIG5vZGVqc1xuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgIFFXZWJDaGFubmVsOiBRV2ViQ2hhbm5lbFxuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vVXRpbGl0aWVzLmpzJyk7XG52YXIgU2hhcmVkID0gcmVxdWlyZSgnLi9TaGFyZWQuanMnKTtcbnZhciBOYXRpdmVEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9OYXRpdmVEaXNwYXRjaGVyLmpzJyk7XG52YXIgU2ltdWxhdG9yRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qcycpO1xudmFyIHF3ZWJjaGFubmVsID0gcmVxdWlyZSgncXdlYmNoYW5uZWwnKTtcblxuLyoqIEBtb2R1bGUgU2hpbUxpYnJhcnkgLSBUaGlzIG1vZHVsZSBkZWZpbmVzIHRoZSBXREMncyBzaGltIGxpYnJhcnkgd2hpY2ggaXMgdXNlZFxudG8gYnJpZGdlIHRoZSBnYXAgYmV0d2VlbiB0aGUgamF2YXNjcmlwdCBjb2RlIG9mIHRoZSBXREMgYW5kIHRoZSBkcml2aW5nIGNvbnRleHRcbm9mIHRoZSBXREMgKFRhYmxlYXUgZGVza3RvcCwgdGhlIHNpbXVsYXRvciwgZXRjLikgKi9cblxuLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIG9uY2UgYm9vdHN0cmFwcGluZyBoYXMgYmVlbiBjb21wbGV0ZWQgYW5kIHRoZVxuLy8gZGlzcGF0Y2hlciBhbmQgc2hhcmVkIFdEQyBvYmplY3RzIGFyZSBib3RoIGNyZWF0ZWQgYW5kIGF2YWlsYWJsZVxuZnVuY3Rpb24gYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKF9kaXNwYXRjaGVyLCBfc2hhcmVkKSB7XG4gIFV0aWxpdGllcy5jb3B5RnVuY3Rpb25zKF9kaXNwYXRjaGVyLnB1YmxpY0ludGVyZmFjZSwgd2luZG93LnRhYmxlYXUpO1xuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wcml2YXRlSW50ZXJmYWNlLCB3aW5kb3cuX3RhYmxlYXUpO1xuICBfc2hhcmVkLmluaXQoKTtcbn1cblxuLy8gSW5pdGlhbGl6ZXMgdGhlIHdkYyBzaGltIGxpYnJhcnkuIFlvdSBtdXN0IGNhbGwgdGhpcyBiZWZvcmUgZG9pbmcgYW55dGhpbmcgd2l0aCBXRENcbm1vZHVsZS5leHBvcnRzLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICAvLyBUaGUgaW5pdGlhbCBjb2RlIGhlcmUgaXMgdGhlIG9ubHkgcGxhY2UgaW4gb3VyIG1vZHVsZSB3aGljaCBzaG91bGQgaGF2ZSBnbG9iYWxcbiAgLy8ga25vd2xlZGdlIG9mIGhvdyBhbGwgdGhlIFdEQyBjb21wb25lbnRzIGFyZSBnbHVlZCB0b2dldGhlci4gVGhpcyBpcyB0aGUgb25seSBwbGFjZVxuICAvLyB3aGljaCB3aWxsIGtub3cgYWJvdXQgdGhlIHdpbmRvdyBvYmplY3Qgb3Igb3RoZXIgZ2xvYmFsIG9iamVjdHMuIFRoaXMgY29kZSB3aWxsIGJlIHJ1blxuICAvLyBpbW1lZGlhdGVseSB3aGVuIHRoZSBzaGltIGxpYnJhcnkgbG9hZHMgYW5kIGlzIHJlc3BvbnNpYmxlIGZvciBkZXRlcm1pbmluZyB0aGUgY29udGV4dFxuICAvLyB3aGljaCBpdCBpcyBydW5uaW5nIGl0IGFuZCBzZXR1cCBhIGNvbW11bmljYXRpb25zIGNoYW5uZWwgYmV0d2VlbiB0aGUganMgJiBydW5uaW5nIGNvZGVcbiAgdmFyIGRpc3BhdGNoZXIgPSBudWxsO1xuICB2YXIgc2hhcmVkID0gbnVsbDtcblxuICAvLyBBbHdheXMgZGVmaW5lIHRoZSBwcml2YXRlIF90YWJsZWF1IG9iamVjdCBhdCB0aGUgc3RhcnRcbiAgd2luZG93Ll90YWJsZWF1ID0ge307XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSB0YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCBpcyBkZWZpbmVkIGFzIGEgZ2xvYmFsIG9iamVjdC4gSWYgc28sXG4gIC8vIHdlIGFyZSBydW5uaW5nIGluIHRoZSBUYWJsZWF1IGRlc2t0b3Avc2VydmVyIGNvbnRleHQuIElmIG5vdCwgd2UncmUgcnVubmluZyBpbiB0aGUgc2ltdWxhdG9yXG4gIGlmICghIXdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCkge1xuICAgIC8vIFdlIGhhdmUgdGhlIHRhYmxlYXUgb2JqZWN0IGRlZmluZWRcbiAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBOYXRpdmVEaXNwYXRjaGVyLCBSZXBvcnRpbmcgdmVyc2lvbiBudW1iZXJcIik7XG4gICAgd2luZG93LnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwLlJlcG9ydFZlcnNpb25OdW1iZXIoQlVJTERfTlVNQkVSKTtcbiAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIod2luZG93KTtcbiAgfSBlbHNlIGlmICghIXdpbmRvdy5xdCAmJiAhIXdpbmRvdy5xdC53ZWJDaGFubmVsVHJhbnNwb3J0KSB7XG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciBmb3IgcXdlYmNoYW5uZWxcIik7XG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcblxuICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gYSBjb250ZXh0IHdoZXJlIHRoZSB3ZWJDaGFubmVsVHJhbnNwb3J0IGlzIGF2YWlsYWJsZS4gVGhpcyBtZWFucyBRV2ViRW5naW5lIGlzIGluIHVzZVxuICAgIHdpbmRvdy5jaGFubmVsID0gbmV3IHF3ZWJjaGFubmVsLlFXZWJDaGFubmVsKHF0LndlYkNoYW5uZWxUcmFuc3BvcnQsIGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUVdlYkNoYW5uZWwgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIik7XG5cbiAgICAgIC8vIERlZmluZSB0aGUgZnVuY3Rpb24gd2hpY2ggdGFibGVhdSB3aWxsIGNhbGwgYWZ0ZXIgaXQgaGFzIGluc2VydGVkIGFsbCB0aGUgcmVxdWlyZWQgb2JqZWN0cyBpbnRvIHRoZSBqYXZhc2NyaXB0IGZyYW1lXG4gICAgICB3aW5kb3cuX3RhYmxlYXUuX25hdGl2ZVNldHVwQ29tcGxldGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIG5hdGl2ZSBjb2RlIHRlbGxzIHVzIGV2ZXJ5dGhpbmcgaGVyZSBpcyBkb25lLCB3ZSBzaG91bGQgaGF2ZSBhbGwgdGhlIGV4cGVjdGVkIG9iamVjdHMgaW5zZXJ0ZWQgaW50byBqc1xuICAgICAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIoY2hhbm5lbC5vYmplY3RzKTtcbiAgICAgICAgd2luZG93LnRhYmxlYXUgPSBjaGFubmVsLm9iamVjdHMudGFibGVhdTtcbiAgICAgICAgc2hhcmVkLmNoYW5nZVRhYmxlYXVBcGlPYmood2luZG93LnRhYmxlYXUpO1xuICAgICAgICBib290c3RyYXBwaW5nRmluaXNoZWQoZGlzcGF0Y2hlciwgc2hhcmVkKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEFjdHVhbGx5IGNhbGwgaW50byB0aGUgdmVyc2lvbiBib290c3RyYXBwZXIgdG8gcmVwb3J0IG91ciB2ZXJzaW9uIG51bWJlclxuICAgICAgY2hhbm5lbC5vYmplY3RzLnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwLlJlcG9ydFZlcnNpb25OdW1iZXIoQlVJTERfTlVNQkVSKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIlZlcnNpb24gQm9vdHN0cmFwIGlzIG5vdCBkZWZpbmVkLCBJbml0aWFsaXppbmcgU2ltdWxhdG9yRGlzcGF0Y2hlclwiKTtcbiAgICB3aW5kb3cudGFibGVhdSA9IHt9O1xuICAgIGRpc3BhdGNoZXIgPSBuZXcgU2ltdWxhdG9yRGlzcGF0Y2hlcih3aW5kb3cpO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIFdEQyBvYmplY3QgYW5kIGFkZCBpbiBvdXIgZW51bSB2YWx1ZXNcbiAgc2hhcmVkID0gbmV3IFNoYXJlZCh3aW5kb3cudGFibGVhdSwgd2luZG93Ll90YWJsZWF1LCB3aW5kb3cpO1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGlzcGF0Y2hlciBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIGltbWVkaWF0ZWx5IGNhbGwgdGhlXG4gIC8vIGNhbGxiYWNrIGlmIHNvXG4gIGlmIChkaXNwYXRjaGVyKSB7XG4gICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGFibGVhdXdkYy5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9
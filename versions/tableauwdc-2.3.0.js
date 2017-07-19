/*! Build Number: 2.2.1 */
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
	var tableauwdc = __webpack_require__(19);
	tableauwdc.init();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var APPROVED_ORIGINS_KEY = "wdc_approved_origins";
	var SEPARATOR = ",";
	var Cookies = __webpack_require__(8);

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

	// Retrieves the origins which have already been approved by the user
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


/***/ },
/* 2 */
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
	    string: "string",
	    geometry: "geometry"
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
/* 3 */
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
	  // Report progress was added in 2.1 so it may not be available if Tableau only knows 2.0
	  if (!!this.nativeApiRootObj.WDCBridge_Api_reportProgress) {
	    this.nativeApiRootObj.WDCBridge_Api_reportProgress.api(progress);
	  } else {
	    console.log("reportProgress not available from this Tableau version");
	  }
	}

	NativeDispatcher.prototype._dataDoneCallback = function() {
	  this.nativeApiRootObj.WDCBridge_Api_dataDoneCallback.api();
	}

	module.exports = NativeDispatcher;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Table = __webpack_require__(6);
	var Enums = __webpack_require__(2);

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

	module.exports = Shared;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ApprovedOrigins = __webpack_require__(1);

	// Required for IE & Edge which don't support endsWith
	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"String.prototype.endsWith\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

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
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.2.1") };
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
	    // Make sure we only post this info back to the source origin the user approved in _getWebSecurityWarningConfirm
	    this._sourceWindow.postMessage(messagePayload, this._sourceOrigin);
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
	  var origin = this._sourceOrigin;

	  var Uri = __webpack_require__(17);
	  var parsedOrigin = new Uri(origin);
	  var hostName = parsedOrigin.host();

	  var supportedHosts = ["localhost", "tableau.github.io"];
	  if (supportedHosts.indexOf(hostName) >= 0) {
	      return true;
	  }

	  // Whitelist Tableau domains
	  if (hostName && hostName.endsWith("online.tableau.com")) {
	      return true;
	  }

	  var alreadyApprovedOrigins = ApprovedOrigins.getApprovedOrigins();
	  if (alreadyApprovedOrigins.indexOf(origin) >= 0) {
	    // The user has already approved this origin, no need to ask again
	    console.log("Already approved the origin'" + origin + "', not asking again");
	    return true;
	  }

	  var localizedWarningTitle = this._getLocalizedString("webSecurityWarning");
	  var completeWarningMsg  = localizedWarningTitle + "\n\n" + hostName + "\n";
	  var isConfirmed = confirm(completeWarningMsg);

	  if (isConfirmed) {
	    // Set a session cookie to mark that we've approved this already
	    ApprovedOrigins.addApprovedOrigin(origin);
	  }

	  return isConfirmed;
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
	    var deStringsMap = __webpack_require__(9);
	    var enStringsMap = __webpack_require__(10);
	    var esStringsMap = __webpack_require__(11);
	    var jaStringsMap = __webpack_require__(13);
	    var frStringsMap = __webpack_require__(12);
	    var koStringsMap = __webpack_require__(14);
	    var ptStringsMap = __webpack_require__(15);
	    var zhStringsMap = __webpack_require__(16);

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
	  publicInterface.reportProgress = this._reportProgress.bind(this);
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

	SimulatorDispatcher.prototype._reportProgress = function(msg) {
	  this._sendMessage("reportProgress", {"progressMsg": msg});
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
/* 6 */
/***/ function(module, exports) {

	/**
	* @class Represents a single table which Tableau has requested
	* @param tableInfo {Object} - Information about the table
	* @param incrementValue {string=} - Incremental update value
	*/
	function Table(tableInfo, incrementValue, isJoinFiltered, filterColumnId, filterValues, dataCallbackFn) {
	  /** @member {Object} Information about the table which has been requested. This is
	  guaranteed to be one of the tables the connector returned in the call to getSchema. */
	  this.tableInfo = tableInfo;

	  /** @member {string} Defines the incremental update value for this table. Empty string if
	  there is not an incremental update requested. */
	  this.incrementValue = incrementValue || "";

	  /** @member {boolean} Whether or not this table is meant to be filtered using filterValues. */
	  this.isJoinFiltered = isJoinFiltered;

	  /** @member {string} If this table is filtered, this is the column where the filter values
	   * should be found. */
	  this.filterColumnId = filterColumnId;

	  /** @member {array} An array of strings which specifies the values we want to retrieve. For
	   * example, if an ID column was the filter column, this would be a collection of IDs to retrieve. */
	  this.filterValues = filterValues;

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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Cookies.js - 1.2.3
	 * https://github.com/ScottHamper/Cookies
	 *
	 * This is free and unencumbered software released into the public domain.
	 */
	(function (global, undefined) {
	    'use strict';

	    var factory = function (window) {
	        if (typeof window.document !== 'object') {
	            throw new Error('Cookies.js requires a `window` with a `document` object');
	        }

	        var Cookies = function (key, value, options) {
	            return arguments.length === 1 ?
	                Cookies.get(key) : Cookies.set(key, value, options);
	        };

	        // Allows for setter injection in unit tests
	        Cookies._document = window.document;

	        // Used to ensure cookie keys do not collide with
	        // built-in `Object` properties
	        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	        
	        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

	        Cookies.defaults = {
	            path: '/',
	            secure: false
	        };

	        Cookies.get = function (key) {
	            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
	                Cookies._renewCache();
	            }
	            
	            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

	            return value === undefined ? undefined : decodeURIComponent(value);
	        };

	        Cookies.set = function (key, value, options) {
	            options = Cookies._getExtendedOptions(options);
	            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

	            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

	            return Cookies;
	        };

	        Cookies.expire = function (key, options) {
	            return Cookies.set(key, undefined, options);
	        };

	        Cookies._getExtendedOptions = function (options) {
	            return {
	                path: options && options.path || Cookies.defaults.path,
	                domain: options && options.domain || Cookies.defaults.domain,
	                expires: options && options.expires || Cookies.defaults.expires,
	                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
	            };
	        };

	        Cookies._isValidDate = function (date) {
	            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	        };

	        Cookies._getExpiresDate = function (expires, now) {
	            now = now || new Date();

	            if (typeof expires === 'number') {
	                expires = expires === Infinity ?
	                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
	            } else if (typeof expires === 'string') {
	                expires = new Date(expires);
	            }

	            if (expires && !Cookies._isValidDate(expires)) {
	                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
	            }

	            return expires;
	        };

	        Cookies._generateCookieString = function (key, value, options) {
	            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
	            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
	            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
	            options = options || {};

	            var cookieString = key + '=' + value;
	            cookieString += options.path ? ';path=' + options.path : '';
	            cookieString += options.domain ? ';domain=' + options.domain : '';
	            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
	            cookieString += options.secure ? ';secure' : '';

	            return cookieString;
	        };

	        Cookies._getCacheFromString = function (documentCookie) {
	            var cookieCache = {};
	            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

	            for (var i = 0; i < cookiesArray.length; i++) {
	                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

	                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
	                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
	                }
	            }

	            return cookieCache;
	        };

	        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
	            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
	            var separatorIndex = cookieString.indexOf('=');

	            // IE omits the "=" when the cookie value is an empty string
	            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

	            var key = cookieString.substr(0, separatorIndex);
	            var decodedKey;
	            try {
	                decodedKey = decodeURIComponent(key);
	            } catch (e) {
	                if (console && typeof console.error === 'function') {
	                    console.error('Could not decode cookie with key "' + key + '"', e);
	                }
	            }
	            
	            return {
	                key: decodedKey,
	                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
	            };
	        };

	        Cookies._renewCache = function () {
	            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
	            Cookies._cachedDocumentCookie = Cookies._document.cookie;
	        };

	        Cookies._areEnabled = function () {
	            var testKey = 'cookies.js';
	            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
	            Cookies.expire(testKey);
	            return areEnabled;
	        };

	        Cookies.enabled = Cookies._areEnabled();

	        return Cookies;
	    };
	    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

	    // AMD support
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return cookiesExport; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    // CommonJS/Node.js support
	    } else if (typeof exports === 'object') {
	        // Support Node.js specific `module.exports` (which can be a function)
	        if (typeof module === 'object' && typeof module.exports === 'object') {
	            exports = module.exports = cookiesExport;
	        }
	        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
	        exports.Cookies = cookiesExport;
	    } else {
	        global.Cookies = cookiesExport;
	    }
	})(typeof window === 'undefined' ? this : window);

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
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "wwTo help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jsUri
	 * https://github.com/derek-watson/jsUri
	 *
	 * Copyright 2013, Derek Watson
	 * Released under the MIT license.
	 *
	 * Includes parseUri regular expressions
	 * http://blog.stevenlevithan.com/archives/parseuri
	 * Copyright 2007, Steven Levithan
	 * Released under the MIT license.
	 */

	 /*globals define, module */

	(function(global) {

	  var re = {
	    starts_with_slashes: /^\/+/,
	    ends_with_slashes: /\/+$/,
	    pluses: /\+/g,
	    query_separator: /[&;]/,
	    uri_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?(\[[0-9a-fA-F:.]+\]|[^:\/?#]*)(?::(\d+|(?=:)))?(:)?)((((?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	  };

	  /**
	   * Define forEach for older js environments
	   * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
	   */
	  if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function(callback, thisArg) {
	      var T, k;

	      if (this == null) {
	        throw new TypeError(' this is null or not defined');
	      }

	      var O = Object(this);
	      var len = O.length >>> 0;

	      if (typeof callback !== "function") {
	        throw new TypeError(callback + ' is not a function');
	      }

	      if (arguments.length > 1) {
	        T = thisArg;
	      }

	      k = 0;

	      while (k < len) {
	        var kValue;
	        if (k in O) {
	          kValue = O[k];
	          callback.call(T, kValue, k, O);
	        }
	        k++;
	      }
	    };
	  }

	  /**
	   * unescape a query param value
	   * @param  {string} s encoded value
	   * @return {string}   decoded value
	   */
	  function decode(s) {
	    if (s) {
	        s = s.toString().replace(re.pluses, '%20');
	        s = decodeURIComponent(s);
	    }
	    return s;
	  }

	  /**
	   * Breaks a uri string down into its individual parts
	   * @param  {string} str uri
	   * @return {object}     parts
	   */
	  function parseUri(str) {
	    var parser = re.uri_parser;
	    var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "isColonUri", "relative", "path", "directory", "file", "query", "anchor"];
	    var m = parser.exec(str || '');
	    var parts = {};

	    parserKeys.forEach(function(key, i) {
	      parts[key] = m[i] || '';
	    });

	    return parts;
	  }

	  /**
	   * Breaks a query string down into an array of key/value pairs
	   * @param  {string} str query
	   * @return {array}      array of arrays (key/value pairs)
	   */
	  function parseQuery(str) {
	    var i, ps, p, n, k, v, l;
	    var pairs = [];

	    if (typeof(str) === 'undefined' || str === null || str === '') {
	      return pairs;
	    }

	    if (str.indexOf('?') === 0) {
	      str = str.substring(1);
	    }

	    ps = str.toString().split(re.query_separator);

	    for (i = 0, l = ps.length; i < l; i++) {
	      p = ps[i];
	      n = p.indexOf('=');

	      if (n !== 0) {
	        k = decode(p.substring(0, n));
	        v = decode(p.substring(n + 1));
	        pairs.push(n === -1 ? [p, null] : [k, v]);
	      }

	    }
	    return pairs;
	  }

	  /**
	   * Creates a new Uri object
	   * @constructor
	   * @param {string} str
	   */
	  function Uri(str) {
	    this.uriParts = parseUri(str);
	    this.queryPairs = parseQuery(this.uriParts.query);
	    this.hasAuthorityPrefixUserPref = null;
	  }

	  /**
	   * Define getter/setter methods
	   */
	  ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
	    Uri.prototype[key] = function(val) {
	      if (typeof val !== 'undefined') {
	        this.uriParts[key] = val;
	      }
	      return this.uriParts[key];
	    };
	  });

	  /**
	   * if there is no protocol, the leading // can be enabled or disabled
	   * @param  {Boolean}  val
	   * @return {Boolean}
	   */
	  Uri.prototype.hasAuthorityPrefix = function(val) {
	    if (typeof val !== 'undefined') {
	      this.hasAuthorityPrefixUserPref = val;
	    }

	    if (this.hasAuthorityPrefixUserPref === null) {
	      return (this.uriParts.source.indexOf('//') !== -1);
	    } else {
	      return this.hasAuthorityPrefixUserPref;
	    }
	  };

	  Uri.prototype.isColonUri = function (val) {
	    if (typeof val !== 'undefined') {
	      this.uriParts.isColonUri = !!val;
	    } else {
	      return !!this.uriParts.isColonUri;
	    }
	  };

	  /**
	   * Serializes the internal state of the query pairs
	   * @param  {string} [val]   set a new query string
	   * @return {string}         query string
	   */
	  Uri.prototype.query = function(val) {
	    var s = '', i, param, l;

	    if (typeof val !== 'undefined') {
	      this.queryPairs = parseQuery(val);
	    }

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (s.length > 0) {
	        s += '&';
	      }
	      if (param[1] === null) {
	        s += param[0];
	      } else {
	        s += param[0];
	        s += '=';
	        if (typeof param[1] !== 'undefined') {
	          s += encodeURIComponent(param[1]);
	        }
	      }
	    }
	    return s.length > 0 ? '?' + s : s;
	  };

	  /**
	   * returns the first query param value found for the key
	   * @param  {string} key query key
	   * @return {string}     first value found for key
	   */
	  Uri.prototype.getQueryParamValue = function (key) {
	    var param, i, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        return param[1];
	      }
	    }
	  };

	  /**
	   * returns an array of query param values for the key
	   * @param  {string} key query key
	   * @return {array}      array of values
	   */
	  Uri.prototype.getQueryParamValues = function (key) {
	    var arr = [], i, param, l;
	    for (i = 0, l = this.queryPairs.length; i < l; i++) {
	      param = this.queryPairs[i];
	      if (key === param[0]) {
	        arr.push(param[1]);
	      }
	    }
	    return arr;
	  };

	  /**
	   * removes query parameters
	   * @param  {string} key     remove values for key
	   * @param  {val}    [val]   remove a specific value, otherwise removes all
	   * @return {Uri}            returns self for fluent chaining
	   */
	  Uri.prototype.deleteQueryParam = function (key, val) {
	    var arr = [], i, param, keyMatchesFilter, valMatchesFilter, l;

	    for (i = 0, l = this.queryPairs.length; i < l; i++) {

	      param = this.queryPairs[i];
	      keyMatchesFilter = decode(param[0]) === decode(key);
	      valMatchesFilter = param[1] === val;

	      if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
	        arr.push(param);
	      }
	    }

	    this.queryPairs = arr;

	    return this;
	  };

	  /**
	   * adds a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.addQueryParam = function (key, val, index) {
	    if (arguments.length === 3 && index !== -1) {
	      index = Math.min(index, this.queryPairs.length);
	      this.queryPairs.splice(index, 0, [key, val]);
	    } else if (arguments.length > 0) {
	      this.queryPairs.push([key, val]);
	    }
	    return this;
	  };

	  /**
	   * test for the existence of a query parameter
	   * @param  {string}  key        add values for key
	   * @param  {string}  val        value to add
	   * @param  {integer} [index]    specific index to add the value at
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.hasQueryParam = function (key) {
	    var i, len = this.queryPairs.length;
	    for (i = 0; i < len; i++) {
	      if (this.queryPairs[i][0] == key)
	        return true;
	    }
	    return false;
	  };

	  /**
	   * replaces query param values
	   * @param  {string} key         key to replace value for
	   * @param  {string} newVal      new value
	   * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
	   * @return {Uri}                returns self for fluent chaining
	   */
	  Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
	    var index = -1, len = this.queryPairs.length, i, param;

	    if (arguments.length === 3) {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
	          index = i;
	          break;
	        }
	      }
	      if (index >= 0) {
	        this.deleteQueryParam(key, decode(oldVal)).addQueryParam(key, newVal, index);
	      }
	    } else {
	      for (i = 0; i < len; i++) {
	        param = this.queryPairs[i];
	        if (decode(param[0]) === decode(key)) {
	          index = i;
	          break;
	        }
	      }
	      this.deleteQueryParam(key);
	      this.addQueryParam(key, newVal, index);
	    }
	    return this;
	  };

	  /**
	   * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
	   */
	  ['protocol', 'hasAuthorityPrefix', 'isColonUri', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
	    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
	    Uri.prototype[method] = function(val) {
	      this[key](val);
	      return this;
	    };
	  });

	  /**
	   * Scheme name, colon and doubleslash, as required
	   * @return {string} http:// or possibly just //
	   */
	  Uri.prototype.scheme = function() {
	    var s = '';

	    if (this.protocol()) {
	      s += this.protocol();
	      if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
	        s += ':';
	      }
	      s += '//';
	    } else {
	      if (this.hasAuthorityPrefix() && this.host()) {
	        s += '//';
	      }
	    }

	    return s;
	  };

	  /**
	   * Same as Mozilla nsIURI.prePath
	   * @return {string} scheme://user:password@host:port
	   * @see  https://developer.mozilla.org/en/nsIURI
	   */
	  Uri.prototype.origin = function() {
	    var s = this.scheme();

	    if (this.userInfo() && this.host()) {
	      s += this.userInfo();
	      if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
	        s += '@';
	      }
	    }

	    if (this.host()) {
	      s += this.host();
	      if (this.port() || (this.path() && this.path().substr(0, 1).match(/[0-9]/))) {
	        s += ':' + this.port();
	      }
	    }

	    return s;
	  };

	  /**
	   * Adds a trailing slash to the path
	   */
	  Uri.prototype.addTrailingSlash = function() {
	    var path = this.path() || '';

	    if (path.substr(-1) !== '/') {
	      this.path(path + '/');
	    }

	    return this;
	  };

	  /**
	   * Serializes the internal state of the Uri object
	   * @return {string}
	   */
	  Uri.prototype.toString = function() {
	    var path, s = this.origin();

	    if (this.isColonUri()) {
	      if (this.path()) {
	        s += ':'+this.path();
	      }
	    } else if (this.path()) {
	      path = this.path();
	      if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
	        s += '/';
	      } else {
	        if (s) {
	          s.replace(re.ends_with_slashes, '/');
	        }
	        path = path.replace(re.starts_with_slashes, '/');
	      }
	      s += path;
	    } else {
	      if (this.host() && (this.query().toString() || this.anchor())) {
	        s += '/';
	      }
	    }
	    if (this.query().toString()) {
	      s += this.query().toString();
	    }

	    if (this.anchor()) {
	      if (this.anchor().indexOf('#') !== 0) {
	        s += '#';
	      }
	      s += this.anchor();
	    }

	    return s;
	  };

	  /**
	   * Clone a Uri object
	   * @return {Uri} duplicate copy of the Uri
	   */
	  Uri.prototype.clone = function() {
	    return new Uri(this.toString());
	  };

	  /**
	   * export via AMD or CommonJS, otherwise leak a global
	   */
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Uri;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = Uri;
	  } else {
	    global.Uri = Uri;
	  }
	}(this));


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Utilities = __webpack_require__(7);
	var Shared = __webpack_require__(4);
	var NativeDispatcher = __webpack_require__(3);
	var SimulatorDispatcher = __webpack_require__(5);
	var qwebchannel = __webpack_require__(18);

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
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.2.1"));
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
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.2.1"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGRjOGVjYTVhYjgyMTFiZTIzNzJiIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0FwcHJvdmVkT3JpZ2lucy5qcyIsIndlYnBhY2s6Ly8vLi9FbnVtcy5qcyIsIndlYnBhY2s6Ly8vLi9OYXRpdmVEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1RhYmxlLmpzIiwid2VicGFjazovLy8uL1V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nvb2tpZXMtanMvZGlzdC9jb29raWVzLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24iLCJ3ZWJwYWNrOi8vLy4vfi9qc3VyaS9VcmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi90YWJsZWF1d2RjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRjOGVjYTVhYjgyMTFiZTIzNzJiIiwiLy8gTWFpbiBlbnRyeSBwb2ludCB0byBwdWxsIHRvZ2V0aGVyIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvciB0aGUgV0RDIHNoaW0gbGlicmFyeVxyXG4vLyBUaGlzIGZpbGUgd2lsbCBiZSBleHBvcnRlZCBhcyBhIGJ1bmRsZWQganMgZmlsZSBieSB3ZWJwYWNrIHNvIGl0IGNhbiBiZSBpbmNsdWRlZFxyXG4vLyBpbiBhIDxzY3JpcHQ+IHRhZyBpbiBhbiBodG1sIGRvY3VtZW50LiBBbGVybmF0aXZlbHksIGEgY29ubmVjdG9yIG1heSBpbmNsdWRlXHJcbi8vIHRoaXMgd2hvbGUgcGFja2FnZSBpbiB0aGVpciBjb2RlIGFuZCB3b3VsZCBuZWVkIHRvIGNhbGwgaW5pdCBsaWtlIHRoaXNcclxudmFyIHRhYmxlYXV3ZGMgPSByZXF1aXJlKCcuL3RhYmxlYXV3ZGMuanMnKTtcclxudGFibGVhdXdkYy5pbml0KCk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEFQUFJPVkVEX09SSUdJTlNfS0VZID0gXCJ3ZGNfYXBwcm92ZWRfb3JpZ2luc1wiO1xyXG52YXIgU0VQQVJBVE9SID0gXCIsXCI7XHJcbnZhciBDb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpO1xyXG5cclxuZnVuY3Rpb24gX2dldEFwcHJvdmVkT3JpZ2luc1ZhbHVlKCkge1xyXG4gIHZhciByZXN1bHQgPSBDb29raWVzLmdldChBUFBST1ZFRF9PUklHSU5TX0tFWSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gX3NhdmVBcHByb3ZlZE9yaWdpbnMob3JpZ2luQXJyYXkpIHtcclxuICB2YXIgbmV3T3JpZ2luU3RyaW5nID0gb3JpZ2luQXJyYXkuam9pbihTRVBBUkFUT1IpO1xyXG4gIGNvbnNvbGUubG9nKFwiU2F2aW5nIGFwcHJvdmVkIG9yaWdpbnMgJ1wiICsgbmV3T3JpZ2luU3RyaW5nICsgXCInXCIpO1xyXG4gIFxyXG4gIC8vIFdlIGNvdWxkIHBvdGVudGlhbGx5IG1ha2UgdGhpcyBhIGxvbmdlciB0ZXJtIGNvb2tpZSBpbnN0ZWFkIG9mIGp1c3QgZm9yIHRoZSBjdXJyZW50IHNlc3Npb25cclxuICB2YXIgcmVzdWx0ID0gQ29va2llcy5zZXQoQVBQUk9WRURfT1JJR0lOU19LRVksIG5ld09yaWdpblN0cmluZyk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLy8gQWRkcyBhbiBhcHByb3ZlZCBvcmlnaW5zIHRvIHRoZSBsaXN0IGFscmVhZHkgc2F2ZWQgaW4gYSBzZXNzaW9uIGNvb2tpZVxyXG5mdW5jdGlvbiBhZGRBcHByb3ZlZE9yaWdpbihvcmlnaW4pIHtcclxuICBpZiAob3JpZ2luKSB7XHJcbiAgICB2YXIgb3JpZ2lucyA9IGdldEFwcHJvdmVkT3JpZ2lucygpO1xyXG4gICAgb3JpZ2lucy5wdXNoKG9yaWdpbik7XHJcbiAgICBfc2F2ZUFwcHJvdmVkT3JpZ2lucyhvcmlnaW5zKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFJldHJpZXZlcyB0aGUgb3JpZ2lucyB3aGljaCBoYXZlIGFscmVhZHkgYmVlbiBhcHByb3ZlZCBieSB0aGUgdXNlclxyXG5mdW5jdGlvbiBnZXRBcHByb3ZlZE9yaWdpbnMoKSB7XHJcbiAgdmFyIG9yaWdpbnNTdHJpbmcgPSBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKTtcclxuICBpZiAoIW9yaWdpbnNTdHJpbmcgfHwgMCA9PT0gb3JpZ2luc1N0cmluZy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHZhciBvcmlnaW5zID0gb3JpZ2luc1N0cmluZy5zcGxpdChTRVBBUkFUT1IpO1xyXG4gIHJldHVybiBvcmlnaW5zO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRBcHByb3ZlZE9yaWdpbiA9IGFkZEFwcHJvdmVkT3JpZ2luO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRBcHByb3ZlZE9yaWdpbnMgPSBnZXRBcHByb3ZlZE9yaWdpbnM7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQXBwcm92ZWRPcmlnaW5zLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBUaGlzIGZpbGUgbGlzdHMgYWxsIG9mIHRoZSBlbnVtcyB3aGljaCBzaG91bGQgYXZhaWxhYmxlIGZvciB0aGUgV0RDICovXHJcbnZhciBhbGxFbnVtcyA9IHtcclxuICBwaGFzZUVudW0gOiB7XHJcbiAgICBpbnRlcmFjdGl2ZVBoYXNlOiBcImludGVyYWN0aXZlXCIsXHJcbiAgICBhdXRoUGhhc2U6IFwiYXV0aFwiLFxyXG4gICAgZ2F0aGVyRGF0YVBoYXNlOiBcImdhdGhlckRhdGFcIlxyXG4gIH0sXHJcblxyXG4gIGF1dGhQdXJwb3NlRW51bSA6IHtcclxuICAgIGVwaGVtZXJhbDogXCJlcGhlbWVyYWxcIixcclxuICAgIGVuZHVyaW5nOiBcImVuZHVyaW5nXCJcclxuICB9LFxyXG5cclxuICBhdXRoVHlwZUVudW0gOiB7XHJcbiAgICBub25lOiBcIm5vbmVcIixcclxuICAgIGJhc2ljOiBcImJhc2ljXCIsXHJcbiAgICBjdXN0b206IFwiY3VzdG9tXCJcclxuICB9LFxyXG5cclxuICBkYXRhVHlwZUVudW0gOiB7XHJcbiAgICBib29sOiBcImJvb2xcIixcclxuICAgIGRhdGU6IFwiZGF0ZVwiLFxyXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZXRpbWVcIixcclxuICAgIGZsb2F0OiBcImZsb2F0XCIsXHJcbiAgICBpbnQ6IFwiaW50XCIsXHJcbiAgICBzdHJpbmc6IFwic3RyaW5nXCIsXHJcbiAgICBnZW9tZXRyeTogXCJnZW9tZXRyeVwiXHJcbiAgfSxcclxuXHJcbiAgY29sdW1uUm9sZUVudW0gOiB7XHJcbiAgICAgIGRpbWVuc2lvbjogXCJkaW1lbnNpb25cIixcclxuICAgICAgbWVhc3VyZTogXCJtZWFzdXJlXCJcclxuICB9LFxyXG5cclxuICBjb2x1bW5UeXBlRW51bSA6IHtcclxuICAgICAgY29udGludW91czogXCJjb250aW51b3VzXCIsXHJcbiAgICAgIGRpc2NyZXRlOiBcImRpc2NyZXRlXCJcclxuICB9LFxyXG5cclxuICBhZ2dUeXBlRW51bSA6IHtcclxuICAgICAgc3VtOiBcInN1bVwiLFxyXG4gICAgICBhdmc6IFwiYXZnXCIsXHJcbiAgICAgIG1lZGlhbjogXCJtZWRpYW5cIixcclxuICAgICAgY291bnQ6IFwiY291bnRcIixcclxuICAgICAgY291bnRkOiBcImNvdW50X2Rpc3RcIlxyXG4gIH0sXHJcblxyXG4gIGdlb2dyYXBoaWNSb2xlRW51bSA6IHtcclxuICAgICAgYXJlYV9jb2RlOiBcImFyZWFfY29kZVwiLFxyXG4gICAgICBjYnNhX21zYTogXCJjYnNhX21zYVwiLFxyXG4gICAgICBjaXR5OiBcImNpdHlcIixcclxuICAgICAgY29uZ3Jlc3Npb25hbF9kaXN0cmljdDogXCJjb25ncmVzc2lvbmFsX2Rpc3RyaWN0XCIsXHJcbiAgICAgIGNvdW50cnlfcmVnaW9uOiBcImNvdW50cnlfcmVnaW9uXCIsXHJcbiAgICAgIGNvdW50eTogXCJjb3VudHlcIixcclxuICAgICAgc3RhdGVfcHJvdmluY2U6IFwic3RhdGVfcHJvdmluY2VcIixcclxuICAgICAgemlwX2NvZGVfcG9zdGNvZGU6IFwiemlwX2NvZGVfcG9zdGNvZGVcIixcclxuICAgICAgbGF0aXR1ZGU6IFwibGF0aXR1ZGVcIixcclxuICAgICAgbG9uZ2l0dWRlOiBcImxvbmdpdHVkZVwiXHJcbiAgfSxcclxuXHJcbiAgdW5pdHNGb3JtYXRFbnVtIDoge1xyXG4gICAgICB0aG91c2FuZHM6IFwidGhvdXNhbmRzXCIsXHJcbiAgICAgIG1pbGxpb25zOiBcIm1pbGxpb25zXCIsXHJcbiAgICAgIGJpbGxpb25zX2VuZ2xpc2g6IFwiYmlsbGlvbnNfZW5nbGlzaFwiLFxyXG4gICAgICBiaWxsaW9uc19zdGFuZGFyZDogXCJiaWxsaW9uc19zdGFuZGFyZFwiXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyRm9ybWF0RW51bSA6IHtcclxuICAgICAgbnVtYmVyOiBcIm51bWJlclwiLFxyXG4gICAgICBjdXJyZW5jeTogXCJjdXJyZW5jeVwiLFxyXG4gICAgICBzY2llbnRpZmljOiBcInNjaWVudGlmaWNcIixcclxuICAgICAgcGVyY2VudGFnZTogXCJwZXJjZW50YWdlXCJcclxuICB9LFxyXG5cclxuICBsb2NhbGVFbnVtIDoge1xyXG4gICAgICBhbWVyaWNhOiBcImVuLXVzXCIsXHJcbiAgICAgIGJyYXppbDogIFwicHQtYnJcIixcclxuICAgICAgY2hpbmE6ICAgXCJ6aC1jblwiLFxyXG4gICAgICBmcmFuY2U6ICBcImZyLWZyXCIsXHJcbiAgICAgIGdlcm1hbnk6IFwiZGUtZGVcIixcclxuICAgICAgamFwYW46ICAgXCJqYS1qcFwiLFxyXG4gICAgICBrb3JlYTogICBcImtvLWtyXCIsXHJcbiAgICAgIHNwYWluOiAgIFwiZXMtZXNcIlxyXG4gIH0sXHJcblxyXG4gIGpvaW5FbnVtIDoge1xyXG4gICAgICBpbm5lcjogXCJpbm5lclwiLFxyXG4gICAgICBsZWZ0OiBcImxlZnRcIlxyXG4gIH1cclxufVxyXG5cclxuLy8gQXBwbGllcyB0aGUgZW51bXMgYXMgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0IG9iamVjdFxyXG5mdW5jdGlvbiBhcHBseSh0YXJnZXQpIHtcclxuICBmb3IodmFyIGtleSBpbiBhbGxFbnVtcykge1xyXG4gICAgdGFyZ2V0W2tleV0gPSBhbGxFbnVtc1trZXldO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYXBwbHkgPSBhcHBseTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9FbnVtcy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogQGNsYXNzIFVzZWQgZm9yIGNvbW11bmljYXRpbmcgYmV0d2VlbiBUYWJsZWF1IGRlc2t0b3Avc2VydmVyIGFuZCB0aGUgV0RDJ3NcclxuKiBKYXZhc2NyaXB0LiBpcyBwcmVkb21pbmFudGx5IGEgcGFzcy10aHJvdWdoIHRvIHRoZSBRdCBXZWJCcmlkZ2UgbWV0aG9kc1xyXG4qIEBwYXJhbSBuYXRpdmVBcGlSb290T2JqIHtPYmplY3R9IC0gVGhlIHJvb3Qgb2JqZWN0IHdoZXJlIHRoZSBuYXRpdmUgQXBpIG1ldGhvZHNcclxuKiBhcmUgYXZhaWxhYmxlLiBGb3IgV2ViS2l0LCB0aGlzIGlzIHdpbmRvdy5cclxuKi9cclxuZnVuY3Rpb24gTmF0aXZlRGlzcGF0Y2hlciAobmF0aXZlQXBpUm9vdE9iaikge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iaiA9IG5hdGl2ZUFwaVJvb3RPYmo7XHJcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xyXG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZSBmb3IgTmF0aXZlRGlzcGF0Y2hlclwiKTtcclxuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcclxuXHJcbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XHJcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5zdWJtaXQgPSB0aGlzLl9zdWJtaXQuYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UucmVwb3J0UHJvZ3Jlc3MgPSB0aGlzLl9yZXBvcnRQcm9ncmVzcy5iaW5kKHRoaXMpO1xyXG5cclxuICB0aGlzLnB1YmxpY0ludGVyZmFjZSA9IHB1YmxpY0ludGVyZmFjZTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0Rm9yQXV0aCA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2Fib3J0Rm9yQXV0aC5hcGkobXNnKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0V2l0aEVycm9yID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRXaXRoRXJyb3IuYXBpKG1zZyk7XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYXBpKGRlc3RPcmlnaW5MaXN0KTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2xvZy5hcGkobXNnKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9zdWJtaXRDYWxsZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwic3VibWl0IGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc3VibWl0LmFwaSgpO1xyXG59O1xyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHJpdmF0ZSBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XHJcblxyXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xyXG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcclxuXHJcbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHJcbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5pdENhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfaW5pdENhbGxiYWNrLmFwaSgpO1xyXG59XHJcblxyXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInNodXRkb3duQ2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fc2h1dGRvd25DYWxsYmFja0NhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2h1dGRvd25DYWxsYmFjay5hcGkoKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XHJcbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHdlIGFyZSB1c2luZyBhIHZlcnNpb24gb2YgZGVza3RvcCB3aGljaCBoYXMgdGhlIFdEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCBkZWZpbmVkXHJcbiAgaWYgKCEhdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCkge1xyXG4gICAgLy8gUHJvdmlkaW5nIHN0YW5kYXJkQ29ubmVjdGlvbnMgaXMgb3B0aW9uYWwgYnV0IHdlIGNhbid0IHBhc3MgdW5kZWZpbmVkIGJhY2sgYmVjYXVzZSBRdCB3aWxsIGNob2tlXHJcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4LmFwaShzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW10pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFjay5hcGkoc2NoZW1hKTtcclxuICB9XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3RhYmxlRGF0YUNhbGxiYWNrLmFwaSh0YWJsZU5hbWUsIGRhdGEpO1xyXG59XHJcblxyXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVwb3J0UHJvZ3Jlc3MgPSBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcclxuICAvLyBSZXBvcnQgcHJvZ3Jlc3Mgd2FzIGFkZGVkIGluIDIuMSBzbyBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZSBpZiBUYWJsZWF1IG9ubHkga25vd3MgMi4wXHJcbiAgaWYgKCEhdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MpIHtcclxuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3JlcG9ydFByb2dyZXNzLmFwaShwcm9ncmVzcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUubG9nKFwicmVwb3J0UHJvZ3Jlc3Mgbm90IGF2YWlsYWJsZSBmcm9tIHRoaXMgVGFibGVhdSB2ZXJzaW9uXCIpO1xyXG4gIH1cclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9kYXRhRG9uZUNhbGxiYWNrLmFwaSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdGl2ZURpc3BhdGNoZXI7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vTmF0aXZlRGlzcGF0Y2hlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgVGFibGUgPSByZXF1aXJlKCcuL1RhYmxlLmpzJyk7XHJcbnZhciBFbnVtcyA9IHJlcXVpcmUoJy4vRW51bXMuanMnKTtcclxuXHJcbi8qKiBAY2xhc3MgVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBzaGFyZWQgcGFydHMgb2YgdGhlIGphdmFzY3JpcHRcclxuKiBsaWJyYXJ5IHdoaWNoIGRvIG5vdCBoYXZlIGFueSBkZXBlbmRlbmNlIG9uIHdoZXRoZXIgd2UgYXJlIHJ1bm5pbmcgaW5cclxuKiB0aGUgc2ltdWxhdG9yLCBpbiBUYWJsZWF1LCBvciBhbnl3aGVyZSBlbHNlXHJcbiogQHBhcmFtIHRhYmxlYXVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHRhYmxlYXUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cudGFibGVhdSlcclxuKiBAcGFyYW0gcHJpdmF0ZUFwaU9iaiB7T2JqZWN0fSAtIFRoZSBhbHJlYWR5IGNyZWF0ZWQgcHJpdmF0ZSBBUEkgb2JqZWN0ICh1c3VhbGx5IHdpbmRvdy5fdGFibGVhdSlcclxuKiBAcGFyYW0gZ2xvYmFsT2JqIHtPYmplY3R9IC0gVGhlIGdsb2JhbCBvYmplY3QgdG8gYXR0YWNoIHRoaW5ncyB0byAodXN1YWxseSB3aW5kb3cpXHJcbiovXHJcbmZ1bmN0aW9uIFNoYXJlZCAodGFibGVhdUFwaU9iaiwgcHJpdmF0ZUFwaU9iaiwgZ2xvYmFsT2JqKSB7XHJcbiAgdGhpcy5wcml2YXRlQXBpT2JqID0gcHJpdmF0ZUFwaU9iajtcclxuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcclxuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gZmFsc2U7XHJcblxyXG4gIHRoaXMuY2hhbmdlVGFibGVhdUFwaU9iaih0YWJsZWF1QXBpT2JqKTtcclxufVxyXG5cclxuXHJcblNoYXJlZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHNoYXJlZCBXRENcIik7XHJcbiAgdGhpcy5nbG9iYWxPYmoub25lcnJvciA9IHRoaXMuX2Vycm9ySGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxuICAvLyBJbml0aWFsaXplIHRoZSBmdW5jdGlvbnMgd2hpY2ggd2lsbCBiZSBpbnZva2VkIGJ5IHRoZSBuYXRpdmUgY29kZVxyXG4gIHRoaXMuX2luaXRUcmlnZ2VyRnVuY3Rpb25zKCk7XHJcblxyXG4gIC8vIEFzc2lnbiB0aGUgZGVwcmVjYXRlZCBmdW5jdGlvbnMgd2hpY2ggYXJlbid0IGF2YWlsaWJsZSBpbiB0aGlzIHZlcnNpb24gb2YgdGhlIEFQSVxyXG4gIHRoaXMuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zKCk7XHJcbn1cclxuXHJcblNoYXJlZC5wcm90b3R5cGUuY2hhbmdlVGFibGVhdUFwaU9iaiA9IGZ1bmN0aW9uKHRhYmxlYXVBcGlPYmopIHtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmogPSB0YWJsZWF1QXBpT2JqO1xyXG5cclxuICAvLyBBc3NpZ24gb3VyIG1ha2UgJiByZWdpc3RlciBmdW5jdGlvbnMgcmlnaHQgYXdheSBiZWNhdXNlIGEgY29ubmVjdG9yIGNhbiB1c2VcclxuICAvLyB0aGVtIGltbWVkaWF0ZWx5LCBldmVuIGJlZm9yZSBib290c3RyYXBwaW5nIGhhcyBjb21wbGV0ZWRcclxuICB0aGlzLnRhYmxlYXVBcGlPYmoubWFrZUNvbm5lY3RvciA9IHRoaXMuX21ha2VDb25uZWN0b3IuYmluZCh0aGlzKTtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmoucmVnaXN0ZXJDb25uZWN0b3IgPSB0aGlzLl9yZWdpc3RlckNvbm5lY3Rvci5iaW5kKHRoaXMpO1xyXG5cclxuICBFbnVtcy5hcHBseSh0aGlzLnRhYmxlYXVBcGlPYmopO1xyXG59XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLl9lcnJvckhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlLCBmaWxlLCBsaW5lLCBjb2x1bW4sIGVycm9yT2JqKSB7XHJcbiAgY29uc29sZS5lcnJvcihlcnJvck9iaik7IC8vIHByaW50IGVycm9yIGZvciBkZWJ1Z2dpbmcgaW4gdGhlIGJyb3dzZXJcclxuICBpZiAodGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2Fpbikge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICB2YXIgbXNnID0gbWVzc2FnZTtcclxuICBpZihlcnJvck9iaikge1xyXG4gICAgbXNnICs9IFwiICAgc3RhY2s6XCIgKyBlcnJvck9iai5zdGFjaztcclxuICB9IGVsc2Uge1xyXG4gICAgbXNnICs9IFwiICAgZmlsZTogXCIgKyBmaWxlO1xyXG4gICAgbXNnICs9IFwiICAgbGluZTogXCIgKyBsaW5lO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMudGFibGVhdUFwaU9iaiAmJiB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IpIHtcclxuICAgIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihtc2cpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBtc2c7XHJcbiAgfVxyXG5cclxuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gdHJ1ZTtcclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5fbWFrZUNvbm5lY3RvciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBkZWZhdWx0SW1wbHMgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihjYikgeyBjYigpOyB9LFxyXG4gICAgc2h1dGRvd246IGZ1bmN0aW9uKGNiKSB7IGNiKCk7IH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gZGVmYXVsdEltcGxzO1xyXG59XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLl9yZWdpc3RlckNvbm5lY3RvciA9IGZ1bmN0aW9uICh3ZGMpIHtcclxuXHJcbiAgLy8gZG8gc29tZSBlcnJvciBjaGVja2luZyBvbiB0aGUgd2RjXHJcbiAgdmFyIGZ1bmN0aW9uTmFtZXMgPSBbXCJpbml0XCIsIFwic2h1dGRvd25cIiwgXCJnZXRTY2hlbWFcIiwgXCJnZXREYXRhXCJdO1xyXG4gIGZvciAodmFyIGlpID0gZnVuY3Rpb25OYW1lcy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XHJcbiAgICBpZiAodHlwZW9mKHdkY1tmdW5jdGlvbk5hbWVzW2lpXV0pICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgdGhyb3cgXCJUaGUgY29ubmVjdG9yIGRpZCBub3QgZGVmaW5lIHRoZSByZXF1aXJlZCBmdW5jdGlvbjogXCIgKyBmdW5jdGlvbk5hbWVzW2lpXTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zb2xlLmxvZyhcIkNvbm5lY3RvciByZWdpc3RlcmVkXCIpO1xyXG5cclxuICB0aGlzLmdsb2JhbE9iai5fd2RjID0gd2RjO1xyXG4gIHRoaXMuX3dkYyA9IHdkYztcclxufVxyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5faW5pdFRyaWdnZXJGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlckluaXRpYWxpemF0aW9uID0gdGhpcy5fdHJpZ2dlckluaXRpYWxpemF0aW9uLmJpbmQodGhpcyk7XHJcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSB0aGlzLl90cmlnZ2VyU2NoZW1hR2F0aGVyaW5nLmJpbmQodGhpcyk7XHJcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJEYXRhR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlckRhdGFHYXRoZXJpbmcuYmluZCh0aGlzKTtcclxuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlclNodXRkb3duID0gdGhpcy5fdHJpZ2dlclNodXRkb3duLmJpbmQodGhpcyk7XHJcbn1cclxuXHJcbi8vIFN0YXJ0cyB0aGUgV0RDXHJcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJJbml0aWFsaXphdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3dkYy5pbml0KHRoaXMucHJpdmF0ZUFwaU9iai5faW5pdENhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gU3RhcnRzIHRoZSBzY2hlbWEgZ2F0aGVyaW5nIHByb2Nlc3NcclxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZyA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3dkYy5nZXRTY2hlbWEodGhpcy5wcml2YXRlQXBpT2JqLl9zY2hlbWFDYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIFN0YXJ0cyB0aGUgZGF0YSBnYXRoZXJpbmcgcHJvY2Vzc1xyXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VyRGF0YUdhdGhlcmluZyA9IGZ1bmN0aW9uKHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcykge1xyXG4gIGlmICh0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoICE9IDEpIHtcclxuICAgIHRocm93IChcIlVuZXhwZWN0ZWQgbnVtYmVyIG9mIHRhYmxlcyBzcGVjaWZpZWQuIEV4cGVjdGVkIDEsIGFjdHVhbCBcIiArIHRhYmxlc0FuZEluY3JlbWVudFZhbHVlcy5sZW5ndGgudG9TdHJpbmcoKSk7XHJcbiAgfVxyXG5cclxuICB2YXIgdGFibGVBbmRJbmNyZW1udFZhbHVlID0gdGFibGVzQW5kSW5jcmVtZW50VmFsdWVzWzBdO1xyXG4gIHZhciBpc0pvaW5GaWx0ZXJlZCA9ICEhdGFibGVBbmRJbmNyZW1udFZhbHVlLmZpbHRlckNvbHVtbklkO1xyXG4gIHZhciB0YWJsZSA9IG5ldyBUYWJsZShcclxuICAgIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZS50YWJsZUluZm8sIFxyXG4gICAgdGFibGVBbmRJbmNyZW1udFZhbHVlLmluY3JlbWVudFZhbHVlLCBcclxuICAgIGlzSm9pbkZpbHRlcmVkLCBcclxuICAgIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZS5maWx0ZXJDb2x1bW5JZCB8fCAnJywgXHJcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUuZmlsdGVyVmFsdWVzIHx8IFtdLFxyXG4gICAgdGhpcy5wcml2YXRlQXBpT2JqLl90YWJsZURhdGFDYWxsYmFjayk7XHJcblxyXG4gIHRoaXMuX3dkYy5nZXREYXRhKHRhYmxlLCB0aGlzLnByaXZhdGVBcGlPYmouX2RhdGFEb25lQ2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBUZWxscyB0aGUgV0RDIGl0J3MgdGltZSB0byBzaHV0IGRvd25cclxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNodXRkb3duID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5fd2RjLnNodXRkb3duKHRoaXMucHJpdmF0ZUFwaU9iai5fc2h1dGRvd25DYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIEluaXRpYWxpemVzIGEgc2VyaWVzIG9mIGdsb2JhbCBjYWxsYmFja3Mgd2hpY2ggaGF2ZSBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMFxyXG5TaGFyZWQucHJvdG90eXBlLl9pbml0RGVwcmVjYXRlZEZ1bmN0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmouaGVhZGVyc0NhbGxiYWNrID0gdGhpcy5faGVhZGVyc0NhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmRhdGFDYWxsYmFjayA9IHRoaXMuX2RhdGFDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xyXG59XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5pbml0Q2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gaW5pdFwiKTtcclxufTtcclxuXHJcblNoYXJlZC5wcm90b3R5cGUuX2hlYWRlcnNDYWxsYmFjayA9IGZ1bmN0aW9uIChmaWVsZE5hbWVzLCB0eXBlcykge1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaGVhZGVyc0NhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMFwiKTtcclxufTtcclxuXHJcblNoYXJlZC5wcm90b3R5cGUuX2RhdGFDYWxsYmFjayA9IGZ1bmN0aW9uIChkYXRhLCBsYXN0UmVjb3JkVG9rZW4sIG1vcmVEYXRhKSB7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5kYXRhQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xyXG59O1xyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LnNodXRkb3duQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wLiBQbGVhc2UgdXNlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBwYXNzZWQgdG8gc2h1dGRvd25cIik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlZDtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9TaGFyZWQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEFwcHJvdmVkT3JpZ2lucyA9IHJlcXVpcmUoJy4vQXBwcm92ZWRPcmlnaW5zLmpzJyk7XHJcblxyXG4vLyBSZXF1aXJlZCBmb3IgSUUgJiBFZGdlIHdoaWNoIGRvbid0IHN1cHBvcnQgZW5kc1dpdGhcclxucmVxdWlyZSgnU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCcpO1xyXG5cclxuLyoqIEBjbGFzcyBVc2VkIGZvciBjb21tdW5pY2F0aW5nIGJldHdlZW4gdGhlIHNpbXVsYXRvciBhbmQgd2ViIGRhdGEgY29ubmVjdG9yLiBJdCBkb2VzXHJcbiogdGhpcyBieSBwYXNzaW5nIG1lc3NhZ2VzIGJldHdlZW4gdGhlIFdEQyB3aW5kb3cgYW5kIGl0cyBwYXJlbnQgd2luZG93XHJcbiogQHBhcmFtIGdsb2JhbE9iaiB7T2JqZWN0fSAtIHRoZSBnbG9iYWwgb2JqZWN0IHRvIGZpbmQgdGFibGVhdSBpbnRlcmZhY2VzIGFzIHdlbGxcclxuKiBhcyByZWdpc3RlciBldmVudHMgKHVzdWFsbHkgd2luZG93KVxyXG4qL1xyXG5mdW5jdGlvbiBTaW11bGF0b3JEaXNwYXRjaGVyIChnbG9iYWxPYmopIHtcclxuICB0aGlzLmdsb2JhbE9iaiA9IGdsb2JhbE9iajtcclxuICB0aGlzLl9pbml0TWVzc2FnZUhhbmRsaW5nKCk7XHJcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xyXG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0TWVzc2FnZUhhbmRsaW5nID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgbWVzc2FnZSBoYW5kbGluZ1wiKTtcclxuICB0aGlzLmdsb2JhbE9iai5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fcmVjZWl2ZU1lc3NhZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG4gIHRoaXMuZ2xvYmFsT2JqLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHRoaXMuX29uRG9tQ29udGVudExvYWRlZC5iaW5kKHRoaXMpKTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX29uRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEF0dGVtcHQgdG8gbm90aWZ5IHRoZSBzaW11bGF0b3Igd2luZG93IHRoYXQgdGhlIFdEQyBoYXMgbG9hZGVkXHJcbiAgaWYodGhpcy5nbG9iYWxPYmoucGFyZW50ICE9PSB3aW5kb3cpIHtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnBhcmVudC5wb3N0TWVzc2FnZSh0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKCdsb2FkZWQnKSwgJyonKTtcclxuICB9XHJcblxyXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLm9wZW5lcikge1xyXG4gICAgdHJ5IHsgLy8gV3JhcCBpbiB0cnkvY2F0Y2ggZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFXHJcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLm9wZW5lci5wb3N0TWVzc2FnZSh0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKCdsb2FkZWQnKSwgJyonKTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1NvbWUgdmVyc2lvbnMgb2YgSUUgbWF5IG5vdCBhY2N1cmF0ZWx5IHNpbXVsYXRlIHRoZSBXZWIgRGF0YSBDb25uZWN0b3IuIFBsZWFzZSByZXRyeSBvbiBhIFdlYmtpdCBiYXNlZCBicm93c2VyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcGFja2FnZVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHByb3BWYWx1ZXMgPSB7XHJcbiAgICBcImNvbm5lY3Rpb25OYW1lXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbk5hbWUsXHJcbiAgICBcImNvbm5lY3Rpb25EYXRhXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEsXHJcbiAgICBcInBhc3N3b3JkXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQsXHJcbiAgICBcInVzZXJuYW1lXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWUsXHJcbiAgICBcInVzZXJuYW1lQWxpYXNcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZUFsaWFzLFxyXG4gICAgXCJpbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW5cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4sXHJcbiAgICBcInZlcnNpb25OdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS52ZXJzaW9uTnVtYmVyLFxyXG4gICAgXCJsb2NhbGVcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUsXHJcbiAgICBcImF1dGhQdXJwb3NlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UsXHJcbiAgICBcInBsYXRmb3JtT1NcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TLFxyXG4gICAgXCJwbGF0Zm9ybVZlcnNpb25cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybVZlcnNpb24sXHJcbiAgICBcInBsYXRmb3JtRWRpdGlvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbixcclxuICAgIFwicGxhdGZvcm1CdWlsZE51bWJlclwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXJcclxuICB9O1xyXG5cclxuICByZXR1cm4gcHJvcFZhbHVlcztcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FwcGx5UHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbihwcm9wcykge1xyXG4gIGlmIChwcm9wcykge1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSA9IHByb3BzLmNvbm5lY3Rpb25OYW1lO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uRGF0YSA9IHByb3BzLmNvbm5lY3Rpb25EYXRhO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wYXNzd29yZCA9IHByb3BzLnBhc3N3b3JkO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSA9IHByb3BzLnVzZXJuYW1lO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZUFsaWFzID0gcHJvcHMudXNlcm5hbWVBbGlhcztcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uID0gcHJvcHMuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUgPSBwcm9wcy5sb2NhbGU7XHJcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1Lmxhbmd1YWdlID0gcHJvcHMubG9jYWxlO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5hdXRoUHVycG9zZSA9IHByb3BzLmF1dGhQdXJwb3NlO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TID0gcHJvcHMucGxhdGZvcm1PUztcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1WZXJzaW9uID0gcHJvcHMucGxhdGZvcm1WZXJzaW9uO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUVkaXRpb24gPSBwcm9wcy5wbGF0Zm9ybUVkaXRpb247XHJcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXIgPSBwcm9wcy5wbGF0Zm9ybUJ1aWxkTnVtYmVyO1xyXG4gIH1cclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2J1aWxkTWVzc2FnZVBheWxvYWQgPSBmdW5jdGlvbihtc2dOYW1lLCBtc2dEYXRhLCBwcm9wcykge1xyXG4gIHZhciBtc2dPYmogPSB7XCJtc2dOYW1lXCI6IG1zZ05hbWUsIFwibXNnRGF0YVwiOiBtc2dEYXRhLCBcInByb3BzXCI6IHByb3BzLCBcInZlcnNpb25cIjogQlVJTERfTlVNQkVSIH07XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1zZ09iaik7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEpIHtcclxuICB2YXIgbWVzc2FnZVBheWxvYWQgPSB0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKG1zZ05hbWUsIG1zZ0RhdGEsIHRoaXMuX3BhY2thZ2VQcm9wZXJ0eVZhbHVlcygpKTtcclxuXHJcbiAgLy8gQ2hlY2sgZmlyc3QgdG8gc2VlIGlmIHdlIGhhdmUgYSBtZXNzYWdlSGFuZGxlciBkZWZpbmVkIHRvIHBvc3QgdGhlIG1lc3NhZ2UgdG9cclxuICBpZiAodHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdCAhPSAndW5kZWZpbmVkJyAmJlxyXG4gICAgdHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMgIT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMud2RjSGFuZGxlci5wb3N0TWVzc2FnZShtZXNzYWdlUGF5bG9hZCk7XHJcbiAgfSBlbHNlIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XHJcbiAgICB0aHJvdyBcIkxvb2tzIGxpa2UgdGhlIFdEQyBpcyBjYWxsaW5nIGEgdGFibGVhdSBmdW5jdGlvbiBiZWZvcmUgdGFibGVhdS5pbml0KCkgaGFzIGJlZW4gY2FsbGVkLlwiXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IHBvc3QgdGhpcyBpbmZvIGJhY2sgdG8gdGhlIHNvdXJjZSBvcmlnaW4gdGhlIHVzZXIgYXBwcm92ZWQgaW4gX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm1cclxuICAgIHRoaXMuX3NvdXJjZVdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlUGF5bG9hZCwgdGhpcy5fc291cmNlT3JpZ2luKTtcclxuICB9XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRQYXlsb2FkT2JqID0gZnVuY3Rpb24ocGF5bG9hZFN0cmluZykge1xyXG4gIHZhciBwYXlsb2FkID0gbnVsbDtcclxuICB0cnkge1xyXG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZFN0cmluZyk7XHJcbiAgfSBjYXRjaChlKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHJldHVybiBwYXlsb2FkO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybSA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIER1ZSB0byBjcm9zcy1vcmlnaW4gc2VjdXJpdHkgaXNzdWVzIG92ZXIgaHR0cHMsIHdlIG1heSBub3QgYmUgYWJsZSB0byByZXRyaWV2ZSBfc291cmNlV2luZG93LlxyXG4gIC8vIFVzZSBzb3VyY2VPcmlnaW4gaW5zdGVhZC5cclxuICB2YXIgb3JpZ2luID0gdGhpcy5fc291cmNlT3JpZ2luO1xyXG5cclxuICB2YXIgVXJpID0gcmVxdWlyZSgnanN1cmknKTtcclxuICB2YXIgcGFyc2VkT3JpZ2luID0gbmV3IFVyaShvcmlnaW4pO1xyXG4gIHZhciBob3N0TmFtZSA9IHBhcnNlZE9yaWdpbi5ob3N0KCk7XHJcblxyXG4gIHZhciBzdXBwb3J0ZWRIb3N0cyA9IFtcImxvY2FsaG9zdFwiLCBcInRhYmxlYXUuZ2l0aHViLmlvXCJdO1xyXG4gIGlmIChzdXBwb3J0ZWRIb3N0cy5pbmRleE9mKGhvc3ROYW1lKSA+PSAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLy8gV2hpdGVsaXN0IFRhYmxlYXUgZG9tYWluc1xyXG4gIGlmIChob3N0TmFtZSAmJiBob3N0TmFtZS5lbmRzV2l0aChcIm9ubGluZS50YWJsZWF1LmNvbVwiKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHZhciBhbHJlYWR5QXBwcm92ZWRPcmlnaW5zID0gQXBwcm92ZWRPcmlnaW5zLmdldEFwcHJvdmVkT3JpZ2lucygpO1xyXG4gIGlmIChhbHJlYWR5QXBwcm92ZWRPcmlnaW5zLmluZGV4T2Yob3JpZ2luKSA+PSAwKSB7XHJcbiAgICAvLyBUaGUgdXNlciBoYXMgYWxyZWFkeSBhcHByb3ZlZCB0aGlzIG9yaWdpbiwgbm8gbmVlZCB0byBhc2sgYWdhaW5cclxuICAgIGNvbnNvbGUubG9nKFwiQWxyZWFkeSBhcHByb3ZlZCB0aGUgb3JpZ2luJ1wiICsgb3JpZ2luICsgXCInLCBub3QgYXNraW5nIGFnYWluXCIpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICB2YXIgbG9jYWxpemVkV2FybmluZ1RpdGxlID0gdGhpcy5fZ2V0TG9jYWxpemVkU3RyaW5nKFwid2ViU2VjdXJpdHlXYXJuaW5nXCIpO1xyXG4gIHZhciBjb21wbGV0ZVdhcm5pbmdNc2cgID0gbG9jYWxpemVkV2FybmluZ1RpdGxlICsgXCJcXG5cXG5cIiArIGhvc3ROYW1lICsgXCJcXG5cIjtcclxuICB2YXIgaXNDb25maXJtZWQgPSBjb25maXJtKGNvbXBsZXRlV2FybmluZ01zZyk7XHJcblxyXG4gIGlmIChpc0NvbmZpcm1lZCkge1xyXG4gICAgLy8gU2V0IGEgc2Vzc2lvbiBjb29raWUgdG8gbWFyayB0aGF0IHdlJ3ZlIGFwcHJvdmVkIHRoaXMgYWxyZWFkeVxyXG4gICAgQXBwcm92ZWRPcmlnaW5zLmFkZEFwcHJvdmVkT3JpZ2luKG9yaWdpbik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNDb25maXJtZWQ7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRDdXJyZW50TG9jYWxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBVc2UgY3VycmVudCBicm93c2VyJ3MgbG9jYWxlIHRvIGdldCBhIGxvY2FsaXplZCB3YXJuaW5nIG1lc3NhZ2VcclxuICAgIHZhciBjdXJyZW50QnJvd3Nlckxhbmd1YWdlID0gKG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IudXNlckxhbmd1YWdlKTtcclxuICAgIHZhciBsb2NhbGUgPSBjdXJyZW50QnJvd3Nlckxhbmd1YWdlPyBjdXJyZW50QnJvd3Nlckxhbmd1YWdlLnN1YnN0cmluZygwLCAyKTogXCJlblwiO1xyXG5cclxuICAgIHZhciBzdXBwb3J0ZWRMb2NhbGVzID0gW1wiZGVcIiwgXCJlblwiLCBcImVzXCIsIFwiZnJcIiwgXCJqYVwiLCBcImtvXCIsIFwicHRcIiwgXCJ6aFwiXTtcclxuICAgIC8vIEZhbGwgYmFjayB0byBFbmdsaXNoIGZvciBvdGhlciB1bnN1cHBvcnRlZCBsYW5hZ3VhZ2VzXHJcbiAgICBpZiAoc3VwcG9ydGVkTG9jYWxlcy5pbmRleE9mKGxvY2FsZSkgPCAwKSB7XHJcbiAgICAgICAgbG9jYWxlID0gJ2VuJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbG9jYWxlO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0TG9jYWxpemVkU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nS2V5KSB7XHJcbiAgICB2YXIgbG9jYWxlID0gdGhpcy5fZ2V0Q3VycmVudExvY2FsZSgpO1xyXG5cclxuICAgIC8vIFVzZSBzdGF0aWMgcmVxdWlyZSBoZXJlLCBvdGhlcndpc2Ugd2VicGFjayB3b3VsZCBnZW5lcmF0ZSBhIG11Y2ggYmlnZ2VyIEpTIGZpbGVcclxuICAgIHZhciBkZVN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19kZS1ERS5qc29uJyk7XHJcbiAgICB2YXIgZW5TdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZW4tVVMuanNvbicpO1xyXG4gICAgdmFyIGVzU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VzLUVTLmpzb24nKTtcclxuICAgIHZhciBqYVN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uJyk7XHJcbiAgICB2YXIgZnJTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbicpO1xyXG4gICAgdmFyIGtvU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2tvLUtSLmpzb24nKTtcclxuICAgIHZhciBwdFN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19wdC1CUi5qc29uJyk7XHJcbiAgICB2YXIgemhTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfemgtQ04uanNvbicpO1xyXG5cclxuICAgIHZhciBzdHJpbmdKc29uTWFwQnlMb2NhbGUgPVxyXG4gICAge1xyXG4gICAgICAgIFwiZGVcIjogZGVTdHJpbmdzTWFwLFxyXG4gICAgICAgIFwiZW5cIjogZW5TdHJpbmdzTWFwLFxyXG4gICAgICAgIFwiZXNcIjogZXNTdHJpbmdzTWFwLFxyXG4gICAgICAgIFwiZnJcIjogZnJTdHJpbmdzTWFwLFxyXG4gICAgICAgIFwiamFcIjogamFTdHJpbmdzTWFwLFxyXG4gICAgICAgIFwia29cIjoga29TdHJpbmdzTWFwLFxyXG4gICAgICAgIFwicHRcIjogcHRTdHJpbmdzTWFwLFxyXG4gICAgICAgIFwiemhcIjogemhTdHJpbmdzTWFwXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsb2NhbGl6ZWRTdHJpbmdzSnNvbiA9IHN0cmluZ0pzb25NYXBCeUxvY2FsZVtsb2NhbGVdO1xyXG4gICAgcmV0dXJuIGxvY2FsaXplZFN0cmluZ3NKc29uW3N0cmluZ0tleV07XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xyXG4gIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgbWVzc2FnZSFcIik7XHJcblxyXG4gIHZhciB3ZGMgPSB0aGlzLmdsb2JhbE9iai5fd2RjO1xyXG4gIGlmICghd2RjKSB7XHJcbiAgICB0aHJvdyBcIk5vIFdEQyByZWdpc3RlcmVkLiBEaWQgeW91IGZvcmdldCB0byBjYWxsIHRhYmxlYXUucmVnaXN0ZXJDb25uZWN0b3I/XCI7XHJcbiAgfVxyXG5cclxuICB2YXIgcGF5bG9hZE9iaiA9IHRoaXMuX2dldFBheWxvYWRPYmooZXZ0LmRhdGEpO1xyXG4gIGlmKCFwYXlsb2FkT2JqKSByZXR1cm47IC8vIFRoaXMgbWVzc2FnZSBpcyBub3QgbmVlZGVkIGZvciBXRENcclxuXHJcbiAgaWYgKCF0aGlzLl9zb3VyY2VXaW5kb3cpIHtcclxuICAgIHRoaXMuX3NvdXJjZVdpbmRvdyA9IGV2dC5zb3VyY2U7XHJcbiAgICB0aGlzLl9zb3VyY2VPcmlnaW4gPSBldnQub3JpZ2luO1xyXG4gIH1cclxuXHJcbiAgdmFyIG1zZ0RhdGEgPSBwYXlsb2FkT2JqLm1zZ0RhdGE7XHJcbiAgdGhpcy5fYXBwbHlQcm9wZXJ0eVZhbHVlcyhwYXlsb2FkT2JqLnByb3BzKTtcclxuXHJcbiAgc3dpdGNoKHBheWxvYWRPYmoubXNnTmFtZSkge1xyXG4gICAgY2FzZSBcImluaXRcIjpcclxuICAgICAgLy8gV2FybiB1c2VycyBhYm91dCBwb3NzaWJsZSBwaGluaXNoaW5nIGF0dGFja3NcclxuICAgICAgdmFyIGNvbmZpcm1SZXN1bHQgPSB0aGlzLl9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtKCk7XHJcbiAgICAgIGlmICghY29uZmlybVJlc3VsdCkge1xyXG4gICAgICAgIHdpbmRvdy5jbG9zZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGhhc2UgPSBtc2dEYXRhLnBoYXNlO1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJJbml0aWFsaXphdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCJzaHV0ZG93blwiOlxyXG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2h1dGRvd24oKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiZ2V0U2NoZW1hXCI6XHJcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJTY2hlbWFHYXRoZXJpbmcoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiZ2V0RGF0YVwiOlxyXG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyRGF0YUdhdGhlcmluZyhtc2dEYXRhLnRhYmxlc0FuZEluY3JlbWVudFZhbHVlcyk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKioqIFBVQkxJQyBJTlRFUkZBQ0UgKioqKiovXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZVwiKTtcclxuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcclxuXHJcbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XHJcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5yZXBvcnRQcm9ncmVzcyA9IHRoaXMuX3JlcG9ydFByb2dyZXNzLmJpbmQodGhpcyk7XHJcbiAgcHVibGljSW50ZXJmYWNlLnN1Ym1pdCA9IHRoaXMuX3N1Ym1pdC5iaW5kKHRoaXMpO1xyXG5cclxuICAvLyBBc3NpZ24gdGhlIHB1YmxpYyBpbnRlcmZhY2UgdG8gdGhpc1xyXG4gIHRoaXMucHVibGljSW50ZXJmYWNlID0gcHVibGljSW50ZXJmYWNlO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRGb3JBdXRoID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydEZvckF1dGhcIiwge1wibXNnXCI6IG1zZ30pO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcImFib3J0V2l0aEVycm9yXCIsIHtcImVycm9yTXNnXCI6IG1zZ30pO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSBmdW5jdGlvbihkZXN0T3JpZ2luTGlzdCkge1xyXG4gIC8vIERvbid0IGJvdGhlciBwYXNzaW5nIHRoaXMgYmFjayB0byB0aGUgc2ltdWxhdG9yIHNpbmNlIHRoZXJlJ3Mgbm90aGluZyBpdCBjYW5cclxuICAvLyBkby4gSnVzdCBjYWxsIGJhY2sgdG8gdGhlIFdEQyBpbmRpY2F0aW5nIHRoYXQgaXQgd29ya2VkXHJcbiAgY29uc29sZS5sb2coXCJDcm9zcyBPcmlnaW4gRXhjZXB0aW9uIHJlcXVlc3RlZCBpbiB0aGUgc2ltdWxhdG9yLiBQcmV0ZW5kaW5nIHRvIHdvcmsuXCIpXHJcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLl93ZGMuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb25Db21wbGV0ZWQoZGVzdE9yaWdpbkxpc3QpO1xyXG4gIH0uYmluZCh0aGlzKSwgMCk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcImxvZ1wiLCB7XCJsb2dNc2dcIjogbXNnfSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZXBvcnRQcm9ncmVzcyA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwicmVwb3J0UHJvZ3Jlc3NcIiwge1wicHJvZ3Jlc3NNc2dcIjogbXNnfSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcInN1Ym1pdFwiKTtcclxufTtcclxuXHJcbi8qKioqIFBSSVZBVEUgSU5URVJGQUNFICoqKioqL1xyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFByaXZhdGVJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcclxuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwcml2YXRlIGludGVyZmFjZVwiKTtcclxuXHJcbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHJcbiAgLy8gQXNzaWduIHRoZSBwcml2YXRlIGludGVyZmFjZSB0byB0aGlzXHJcbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiaW5pdENhbGxiYWNrXCIpO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic2h1dGRvd25DYWxsYmFja1wiKTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XHJcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfc2NoZW1hQ2FsbGJhY2tcIiwge1wic2NoZW1hXCI6IHNjaGVtYSwgXCJzdGFuZGFyZENvbm5lY3Rpb25zXCIgOiBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdfSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX3RhYmxlRGF0YUNhbGxiYWNrXCIsIHsgXCJ0YWJsZU5hbWVcIjogdGFibGVOYW1lLCBcImRhdGFcIjogZGF0YSB9KTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9kYXRhRG9uZUNhbGxiYWNrXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRvckRpc3BhdGNoZXI7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcclxuKiBAY2xhc3MgUmVwcmVzZW50cyBhIHNpbmdsZSB0YWJsZSB3aGljaCBUYWJsZWF1IGhhcyByZXF1ZXN0ZWRcclxuKiBAcGFyYW0gdGFibGVJbmZvIHtPYmplY3R9IC0gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYmxlXHJcbiogQHBhcmFtIGluY3JlbWVudFZhbHVlIHtzdHJpbmc9fSAtIEluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZVxyXG4qL1xyXG5mdW5jdGlvbiBUYWJsZSh0YWJsZUluZm8sIGluY3JlbWVudFZhbHVlLCBpc0pvaW5GaWx0ZXJlZCwgZmlsdGVyQ29sdW1uSWQsIGZpbHRlclZhbHVlcywgZGF0YUNhbGxiYWNrRm4pIHtcclxuICAvKiogQG1lbWJlciB7T2JqZWN0fSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGUgd2hpY2ggaGFzIGJlZW4gcmVxdWVzdGVkLiBUaGlzIGlzXHJcbiAgZ3VhcmFudGVlZCB0byBiZSBvbmUgb2YgdGhlIHRhYmxlcyB0aGUgY29ubmVjdG9yIHJldHVybmVkIGluIHRoZSBjYWxsIHRvIGdldFNjaGVtYS4gKi9cclxuICB0aGlzLnRhYmxlSW5mbyA9IHRhYmxlSW5mbztcclxuXHJcbiAgLyoqIEBtZW1iZXIge3N0cmluZ30gRGVmaW5lcyB0aGUgaW5jcmVtZW50YWwgdXBkYXRlIHZhbHVlIGZvciB0aGlzIHRhYmxlLiBFbXB0eSBzdHJpbmcgaWZcclxuICB0aGVyZSBpcyBub3QgYW4gaW5jcmVtZW50YWwgdXBkYXRlIHJlcXVlc3RlZC4gKi9cclxuICB0aGlzLmluY3JlbWVudFZhbHVlID0gaW5jcmVtZW50VmFsdWUgfHwgXCJcIjtcclxuXHJcbiAgLyoqIEBtZW1iZXIge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoaXMgdGFibGUgaXMgbWVhbnQgdG8gYmUgZmlsdGVyZWQgdXNpbmcgZmlsdGVyVmFsdWVzLiAqL1xyXG4gIHRoaXMuaXNKb2luRmlsdGVyZWQgPSBpc0pvaW5GaWx0ZXJlZDtcclxuXHJcbiAgLyoqIEBtZW1iZXIge3N0cmluZ30gSWYgdGhpcyB0YWJsZSBpcyBmaWx0ZXJlZCwgdGhpcyBpcyB0aGUgY29sdW1uIHdoZXJlIHRoZSBmaWx0ZXIgdmFsdWVzXHJcbiAgICogc2hvdWxkIGJlIGZvdW5kLiAqL1xyXG4gIHRoaXMuZmlsdGVyQ29sdW1uSWQgPSBmaWx0ZXJDb2x1bW5JZDtcclxuXHJcbiAgLyoqIEBtZW1iZXIge2FycmF5fSBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIHNwZWNpZmllcyB0aGUgdmFsdWVzIHdlIHdhbnQgdG8gcmV0cmlldmUuIEZvclxyXG4gICAqIGV4YW1wbGUsIGlmIGFuIElEIGNvbHVtbiB3YXMgdGhlIGZpbHRlciBjb2x1bW4sIHRoaXMgd291bGQgYmUgYSBjb2xsZWN0aW9uIG9mIElEcyB0byByZXRyaWV2ZS4gKi9cclxuICB0aGlzLmZpbHRlclZhbHVlcyA9IGZpbHRlclZhbHVlcztcclxuXHJcbiAgLyoqIEBwcml2YXRlICovXHJcbiAgdGhpcy5fZGF0YUNhbGxiYWNrRm4gPSBkYXRhQ2FsbGJhY2tGbjtcclxuXHJcbiAgLy8gYmluZCB0aGUgcHVibGljIGZhY2luZyB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24gc28gaXQgY2FuIGJlIHBhc3NlZCBhcm91bmRcclxuICB0aGlzLmFwcGVuZFJvd3MgPSB0aGlzLl9hcHBlbmRSb3dzLmJpbmQodGhpcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4qIEBtZXRob2QgYXBwZW5kcyB0aGUgZ2l2ZW4gcm93cyB0byB0aGUgc2V0IG9mIGRhdGEgY29udGFpbmVkIGluIHRoaXMgdGFibGVcclxuKiBAcGFyYW0gZGF0YSB7YXJyYXl9IC0gRWl0aGVyIGFuIGFycmF5IG9mIGFycmF5cyBvciBhbiBhcnJheSBvZiBvYmplY3RzIHdoaWNoIHJlcHJlc2VudFxyXG4qIHRoZSBpbmRpdmlkdWFsIHJvd3Mgb2YgZGF0YSB0byBhcHBlbmQgdG8gdGhpcyB0YWJsZVxyXG4qL1xyXG5UYWJsZS5wcm90b3R5cGUuX2FwcGVuZFJvd3MgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgLy8gRG8gc29tZSBxdWljayB2YWxpZGF0aW9uIHRoYXQgdGhpcyBkYXRhIGlzIHRoZSBmb3JtYXQgd2UgZXhwZWN0XHJcbiAgaWYgKCFkYXRhKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJyb3dzIGRhdGEgaXMgbnVsbCBvciB1bmRlZmluZWRcIik7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxyXG4gICAgY29uc29sZS53YXJuKFwiVGFibGUuYXBwZW5kUm93cyBtdXN0IHRha2UgYW4gYXJyYXkgb2YgYXJyYXlzIG9yIGFycmF5IG9mIG9iamVjdHNcIik7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBDYWxsIGJhY2sgd2l0aCB0aGUgcm93cyBmb3IgdGhpcyB0YWJsZVxyXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9UYWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBjb3B5RnVuY3Rpb25zKHNyYywgZGVzdCkge1xyXG4gIGZvcih2YXIga2V5IGluIHNyYykge1xyXG4gICAgaWYgKHR5cGVvZiBzcmNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNvcHlGdW5jdGlvbnMgPSBjb3B5RnVuY3Rpb25zO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1V0aWxpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBDb29raWVzLmpzIC0gMS4yLjNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1Njb3R0SGFtcGVyL0Nvb2tpZXNcclxuICpcclxuICogVGhpcyBpcyBmcmVlIGFuZCB1bmVuY3VtYmVyZWQgc29mdHdhcmUgcmVsZWFzZWQgaW50byB0aGUgcHVibGljIGRvbWFpbi5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVzLmpzIHJlcXVpcmVzIGEgYHdpbmRvd2Agd2l0aCBhIGBkb2N1bWVudGAgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQ29va2llcyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cclxuICAgICAgICAgICAgICAgIENvb2tpZXMuZ2V0KGtleSkgOiBDb29raWVzLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xyXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAvLyBVc2VkIHRvIGVuc3VyZSBjb29raWUga2V5cyBkbyBub3QgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgLy8gYnVpbHQtaW4gYE9iamVjdGAgcHJvcGVydGllc1xyXG4gICAgICAgIENvb2tpZXMuX2NhY2hlS2V5UHJlZml4ID0gJ2Nvb2tleS4nOyAvLyBIdXJyIGh1cnIsIDopXHJcbiAgICAgICAgXHJcbiAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCdGcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IFVUQycpO1xyXG5cclxuICAgICAgICBDb29raWVzLmRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBwYXRoOiAnLycsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKENvb2tpZXMuX2NhY2hlZERvY3VtZW50Q29va2llICE9PSBDb29raWVzLl9kb2N1bWVudC5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuX3JlbmV3Q2FjaGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gQ29va2llcy5fY2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBrZXldO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcclxuXHJcbiAgICAgICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcclxuICAgICAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9pc1ZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAhaXNOYU4oZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xyXG4gICAgICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXMgPSBleHBpcmVzID09PSBJbmZpbml0eSA/XHJcbiAgICAgICAgICAgICAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA6IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChleHBpcmVzICYmICFDb29raWVzLl9pc1ZhbGlkRGF0ZShleHBpcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZXhwaXJlc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBEYXRlIGluc3RhbmNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teIyQmK1xcXmB8XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFwoL2csICclMjgnKS5yZXBsYWNlKC9cXCkvZywgJyUyOScpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSArICcnKS5yZXBsYWNlKC9bXiEjJCYtK1xcLS06PC1cXFtcXF0tfl0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgICAgICB2YXIgY29va2llU3RyaW5nID0ga2V5ICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnBhdGggPyAnO3BhdGg9JyArIG9wdGlvbnMucGF0aCA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5kb21haW4gPyAnO2RvbWFpbj0nICsgb3B0aW9ucy5kb21haW4gOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZXhwaXJlcyA/ICc7ZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuc2VjdXJlID8gJztzZWN1cmUnIDogJyc7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llU3RyaW5nO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyA9IGZ1bmN0aW9uIChkb2N1bWVudENvb2tpZSkge1xyXG4gICAgICAgICAgICB2YXIgY29va2llQ2FjaGUgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXNBcnJheSA9IGRvY3VtZW50Q29va2llID8gZG9jdW1lbnRDb29raWUuc3BsaXQoJzsgJykgOiBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29va2llS3ZwID0gQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyhjb29raWVzQXJyYXlbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID0gY29va2llS3ZwLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llQ2FjaGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChjb29raWVTdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8gXCI9XCIgaXMgYSB2YWxpZCBjaGFyYWN0ZXIgaW4gYSBjb29raWUgdmFsdWUgYWNjb3JkaW5nIHRvIFJGQzYyNjUsIHNvIGNhbm5vdCBgc3BsaXQoJz0nKWBcclxuICAgICAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gY29va2llU3RyaW5nLmluZGV4T2YoJz0nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElFIG9taXRzIHRoZSBcIj1cIiB3aGVuIHRoZSBjb29raWUgdmFsdWUgaXMgYW4gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgICAgIHNlcGFyYXRvckluZGV4ID0gc2VwYXJhdG9ySW5kZXggPCAwID8gY29va2llU3RyaW5nLmxlbmd0aCA6IHNlcGFyYXRvckluZGV4O1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleSA9IGNvb2tpZVN0cmluZy5zdWJzdHIoMCwgc2VwYXJhdG9ySW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgZGVjb2RlZEtleTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRlY29kZWRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgZGVjb2RlIGNvb2tpZSB3aXRoIGtleSBcIicgKyBrZXkgKyAnXCInLCBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGtleTogZGVjb2RlZEtleSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkgLy8gRGVmZXIgZGVjb2RpbmcgdmFsdWUgdW50aWwgYWNjZXNzZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9hcmVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVzdEtleSA9ICdjb29raWVzLmpzJztcclxuICAgICAgICAgICAgdmFyIGFyZUVuYWJsZWQgPSBDb29raWVzLnNldCh0ZXN0S2V5LCAxKS5nZXQodGVzdEtleSkgPT09ICcxJztcclxuICAgICAgICAgICAgQ29va2llcy5leHBpcmUodGVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmVFbmFibGVkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNvb2tpZXNFeHBvcnQgPSAoZ2xvYmFsICYmIHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnKSA/IGZhY3RvcnkoZ2xvYmFsKSA6IGZhY3Rvcnk7XHJcblxyXG4gICAgLy8gQU1EIHN1cHBvcnRcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29va2llc0V4cG9ydDsgfSk7XHJcbiAgICAvLyBDb21tb25KUy9Ob2RlLmpzIHN1cHBvcnRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBOb2RlLmpzIHNwZWNpZmljIGBtb2R1bGUuZXhwb3J0c2AgKHdoaWNoIGNhbiBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEJ1dCBhbHdheXMgc3VwcG9ydCBDb21tb25KUyBtb2R1bGUgMS4xLjEgc3BlYyAoYGV4cG9ydHNgIGNhbm5vdCBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGV4cG9ydHMuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdsb2JhbC5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH1cclxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29va2llcy1qcy9kaXN0L2Nvb2tpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvblxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19mci1GUi5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19wdC1CUi5qc29uXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJ3d1RvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb25cbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICoganNVcmlcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXJlay13YXRzb24vanNVcmlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgRGVyZWsgV2F0c29uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogSW5jbHVkZXMgcGFyc2VVcmkgcmVndWxhciBleHByZXNzaW9uc1xuICogaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL3BhcnNldXJpXG4gKiBDb3B5cmlnaHQgMjAwNywgU3RldmVuIExldml0aGFuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG5cbiAgdmFyIHJlID0ge1xuICAgIHN0YXJ0c193aXRoX3NsYXNoZXM6IC9eXFwvKy8sXG4gICAgZW5kc193aXRoX3NsYXNoZXM6IC9cXC8rJC8sXG4gICAgcGx1c2VzOiAvXFwrL2csXG4gICAgcXVlcnlfc2VwYXJhdG9yOiAvWyY7XS8sXG4gICAgdXJpX3BhcnNlcjogL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXFwvXSopKD86OihbXjpAXSopKT8pP0ApPyhcXFtbMC05YS1mQS1GOi5dK1xcXXxbXjpcXC8/I10qKSg/OjooXFxkK3woPz06KSkpPyg6KT8pKCgoKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pL1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWZpbmUgZm9yRWFjaCBmb3Igb2xkZXIganMgZW52aXJvbm1lbnRzXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoI0NvbXBhdGliaWxpdHlcbiAgICovXG4gIGlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgVCwgaztcblxuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIFQgPSB0aGlzQXJnO1xuICAgICAgfVxuXG4gICAgICBrID0gMDtcblxuICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgdmFyIGtWYWx1ZTtcbiAgICAgICAgaWYgKGsgaW4gTykge1xuICAgICAgICAgIGtWYWx1ZSA9IE9ba107XG4gICAgICAgICAgY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuICAgICAgICB9XG4gICAgICAgIGsrKztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIHVuZXNjYXBlIGEgcXVlcnkgcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzIGVuY29kZWQgdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfSAgIGRlY29kZWQgdmFsdWVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZShzKSB7XG4gICAgaWYgKHMpIHtcbiAgICAgICAgcyA9IHMudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnBsdXNlcywgJyUyMCcpO1xuICAgICAgICBzID0gZGVjb2RlVVJJQ29tcG9uZW50KHMpO1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIC8qKlxuICAgKiBCcmVha3MgYSB1cmkgc3RyaW5nIGRvd24gaW50byBpdHMgaW5kaXZpZHVhbCBwYXJ0c1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciB1cmlcbiAgICogQHJldHVybiB7b2JqZWN0fSAgICAgcGFydHNcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICAgIHZhciBwYXJzZXIgPSByZS51cmlfcGFyc2VyO1xuICAgIHZhciBwYXJzZXJLZXlzID0gW1wic291cmNlXCIsIFwicHJvdG9jb2xcIiwgXCJhdXRob3JpdHlcIiwgXCJ1c2VySW5mb1wiLCBcInVzZXJcIiwgXCJwYXNzd29yZFwiLCBcImhvc3RcIiwgXCJwb3J0XCIsIFwiaXNDb2xvblVyaVwiLCBcInJlbGF0aXZlXCIsIFwicGF0aFwiLCBcImRpcmVjdG9yeVwiLCBcImZpbGVcIiwgXCJxdWVyeVwiLCBcImFuY2hvclwiXTtcbiAgICB2YXIgbSA9IHBhcnNlci5leGVjKHN0ciB8fCAnJyk7XG4gICAgdmFyIHBhcnRzID0ge307XG5cbiAgICBwYXJzZXJLZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpKSB7XG4gICAgICBwYXJ0c1trZXldID0gbVtpXSB8fCAnJztcbiAgICB9KTtcblxuICAgIHJldHVybiBwYXJ0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBCcmVha3MgYSBxdWVyeSBzdHJpbmcgZG93biBpbnRvIGFuIGFycmF5IG9mIGtleS92YWx1ZSBwYWlyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciBxdWVyeVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICBhcnJheSBvZiBhcnJheXMgKGtleS92YWx1ZSBwYWlycylcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlUXVlcnkoc3RyKSB7XG4gICAgdmFyIGksIHBzLCBwLCBuLCBrLCB2LCBsO1xuICAgIHZhciBwYWlycyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZihzdHIpID09PSAndW5kZWZpbmVkJyB8fCBzdHIgPT09IG51bGwgfHwgc3RyID09PSAnJykge1xuICAgICAgcmV0dXJuIHBhaXJzO1xuICAgIH1cblxuICAgIGlmIChzdHIuaW5kZXhPZignPycpID09PSAwKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHBzID0gc3RyLnRvU3RyaW5nKCkuc3BsaXQocmUucXVlcnlfc2VwYXJhdG9yKTtcblxuICAgIGZvciAoaSA9IDAsIGwgPSBwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHAgPSBwc1tpXTtcbiAgICAgIG4gPSBwLmluZGV4T2YoJz0nKTtcblxuICAgICAgaWYgKG4gIT09IDApIHtcbiAgICAgICAgayA9IGRlY29kZShwLnN1YnN0cmluZygwLCBuKSk7XG4gICAgICAgIHYgPSBkZWNvZGUocC5zdWJzdHJpbmcobiArIDEpKTtcbiAgICAgICAgcGFpcnMucHVzaChuID09PSAtMSA/IFtwLCBudWxsXSA6IFtrLCB2XSk7XG4gICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVXJpIG9iamVjdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKi9cbiAgZnVuY3Rpb24gVXJpKHN0cikge1xuICAgIHRoaXMudXJpUGFydHMgPSBwYXJzZVVyaShzdHIpO1xuICAgIHRoaXMucXVlcnlQYWlycyA9IHBhcnNlUXVlcnkodGhpcy51cmlQYXJ0cy5xdWVyeSk7XG4gICAgdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGdldHRlci9zZXR0ZXIgbWV0aG9kc1xuICAgKi9cbiAgWydwcm90b2NvbCcsICd1c2VySW5mbycsICdob3N0JywgJ3BvcnQnLCAncGF0aCcsICdhbmNob3InXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIFVyaS5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMudXJpUGFydHNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnVyaVBhcnRzW2tleV07XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIGlmIHRoZXJlIGlzIG5vIHByb3RvY29sLCB0aGUgbGVhZGluZyAvLyBjYW4gYmUgZW5hYmxlZCBvciBkaXNhYmxlZFxuICAgKiBAcGFyYW0gIHtCb29sZWFufSAgdmFsXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBVcmkucHJvdG90eXBlLmhhc0F1dGhvcml0eVByZWZpeCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9IHZhbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICh0aGlzLnVyaVBhcnRzLnNvdXJjZS5pbmRleE9mKCcvLycpICE9PSAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F1dGhvcml0eVByZWZpeFVzZXJQcmVmO1xuICAgIH1cbiAgfTtcblxuICBVcmkucHJvdG90eXBlLmlzQ29sb25VcmkgPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnVyaVBhcnRzLmlzQ29sb25VcmkgPSAhIXZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhdGhpcy51cmlQYXJ0cy5pc0NvbG9uVXJpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHF1ZXJ5IHBhaXJzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW3ZhbF0gICBzZXQgYSBuZXcgcXVlcnkgc3RyaW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICBxdWVyeSBzdHJpbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpIHtcbiAgICB2YXIgcyA9ICcnLCBpLCBwYXJhbSwgbDtcblxuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5xdWVyeVBhaXJzID0gcGFyc2VRdWVyeSh2YWwpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcyArPSAnJic7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1bMV0gPT09IG51bGwpIHtcbiAgICAgICAgcyArPSBwYXJhbVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMgKz0gcGFyYW1bMF07XG4gICAgICAgIHMgKz0gJz0nO1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtWzFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHMgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtWzFdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcy5sZW5ndGggPiAwID8gJz8nICsgcyA6IHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGZpcnN0IHF1ZXJ5IHBhcmFtIHZhbHVlIGZvdW5kIGZvciB0aGUga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5IHF1ZXJ5IGtleVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICBmaXJzdCB2YWx1ZSBmb3VuZCBmb3Iga2V5XG4gICAqL1xuICBVcmkucHJvdG90eXBlLmdldFF1ZXJ5UGFyYW1WYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcGFyYW0sIGksIGw7XG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gcGFyYW1bMF0pIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtWzFdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBxdWVyeSBwYXJhbSB2YWx1ZXMgZm9yIHRoZSBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgcXVlcnkga2V5XG4gICAqIEByZXR1cm4ge2FycmF5fSAgICAgIGFycmF5IG9mIHZhbHVlc1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5nZXRRdWVyeVBhcmFtVmFsdWVzID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBhcnIgPSBbXSwgaSwgcGFyYW0sIGw7XG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gcGFyYW1bMF0pIHtcbiAgICAgICAgYXJyLnB1c2gocGFyYW1bMV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZW1vdmVzIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgICAgIHJlbW92ZSB2YWx1ZXMgZm9yIGtleVxuICAgKiBAcGFyYW0gIHt2YWx9ICAgIFt2YWxdICAgcmVtb3ZlIGEgc3BlY2lmaWMgdmFsdWUsIG90aGVyd2lzZSByZW1vdmVzIGFsbFxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuZGVsZXRlUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHZhciBhcnIgPSBbXSwgaSwgcGFyYW0sIGtleU1hdGNoZXNGaWx0ZXIsIHZhbE1hdGNoZXNGaWx0ZXIsIGw7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGtleU1hdGNoZXNGaWx0ZXIgPSBkZWNvZGUocGFyYW1bMF0pID09PSBkZWNvZGUoa2V5KTtcbiAgICAgIHZhbE1hdGNoZXNGaWx0ZXIgPSBwYXJhbVsxXSA9PT0gdmFsO1xuXG4gICAgICBpZiAoKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgIWtleU1hdGNoZXNGaWx0ZXIpIHx8IChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmICgha2V5TWF0Y2hlc0ZpbHRlciB8fCAhdmFsTWF0Y2hlc0ZpbHRlcikpKSB7XG4gICAgICAgIGFyci5wdXNoKHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJ5UGFpcnMgPSBhcnI7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogYWRkcyBhIHF1ZXJ5IHBhcmFtZXRlclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBrZXkgICAgICAgIGFkZCB2YWx1ZXMgZm9yIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB2YWwgICAgICAgIHZhbHVlIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtpbnRlZ2VyfSBbaW5kZXhdICAgIHNwZWNpZmljIGluZGV4IHRvIGFkZCB0aGUgdmFsdWUgYXRcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5hZGRRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSwgdmFsLCBpbmRleCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGluZGV4ICE9PSAtMSkge1xuICAgICAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgdGhpcy5xdWVyeVBhaXJzLmxlbmd0aCk7XG4gICAgICB0aGlzLnF1ZXJ5UGFpcnMuc3BsaWNlKGluZGV4LCAwLCBba2V5LCB2YWxdKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnF1ZXJ5UGFpcnMucHVzaChba2V5LCB2YWxdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIHRlc3QgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYSBxdWVyeSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSAga2V5ICAgICAgICBhZGQgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgdmFsICAgICAgICB2YWx1ZSB0byBhZGRcbiAgICogQHBhcmFtICB7aW50ZWdlcn0gW2luZGV4XSAgICBzcGVjaWZpYyBpbmRleCB0byBhZGQgdGhlIHZhbHVlIGF0XG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuaGFzUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgaSwgbGVuID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnF1ZXJ5UGFpcnNbaV1bMF0gPT0ga2V5KVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXBsYWNlcyBxdWVyeSBwYXJhbSB2YWx1ZXNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgICAgICAgICBrZXkgdG8gcmVwbGFjZSB2YWx1ZSBmb3JcbiAgICogQHBhcmFtICB7c3RyaW5nfSBuZXdWYWwgICAgICBuZXcgdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBbb2xkVmFsXSAgICByZXBsYWNlIG9ubHkgb25lIHNwZWNpZmljIHZhbHVlIChvdGhlcndpc2UgcmVwbGFjZXMgYWxsKVxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnJlcGxhY2VRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSwgbmV3VmFsLCBvbGRWYWwpIHtcbiAgICB2YXIgaW5kZXggPSAtMSwgbGVuID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aCwgaSwgcGFyYW07XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgICBpZiAoZGVjb2RlKHBhcmFtWzBdKSA9PT0gZGVjb2RlKGtleSkgJiYgZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtWzFdKSA9PT0gZGVjb2RlKG9sZFZhbCkpIHtcbiAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlUXVlcnlQYXJhbShrZXksIGRlY29kZShvbGRWYWwpKS5hZGRRdWVyeVBhcmFtKGtleSwgbmV3VmFsLCBpbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgICAgaWYgKGRlY29kZShwYXJhbVswXSkgPT09IGRlY29kZShrZXkpKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRlbGV0ZVF1ZXJ5UGFyYW0oa2V5KTtcbiAgICAgIHRoaXMuYWRkUXVlcnlQYXJhbShrZXksIG5ld1ZhbCwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRGVmaW5lIGZsdWVudCBzZXR0ZXIgbWV0aG9kcyAoc2V0UHJvdG9jb2wsIHNldEhhc0F1dGhvcml0eVByZWZpeCwgZXRjKVxuICAgKi9cbiAgWydwcm90b2NvbCcsICdoYXNBdXRob3JpdHlQcmVmaXgnLCAnaXNDb2xvblVyaScsICd1c2VySW5mbycsICdob3N0JywgJ3BvcnQnLCAncGF0aCcsICdxdWVyeScsICdhbmNob3InXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBtZXRob2QgPSAnc2V0JyArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKTtcbiAgICBVcmkucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHRoaXNba2V5XSh2YWwpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNjaGVtZSBuYW1lLCBjb2xvbiBhbmQgZG91Ymxlc2xhc2gsIGFzIHJlcXVpcmVkXG4gICAqIEByZXR1cm4ge3N0cmluZ30gaHR0cDovLyBvciBwb3NzaWJseSBqdXN0IC8vXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnNjaGVtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gJyc7XG5cbiAgICBpZiAodGhpcy5wcm90b2NvbCgpKSB7XG4gICAgICBzICs9IHRoaXMucHJvdG9jb2woKTtcbiAgICAgIGlmICh0aGlzLnByb3RvY29sKCkuaW5kZXhPZignOicpICE9PSB0aGlzLnByb3RvY29sKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICBzICs9ICc6JztcbiAgICAgIH1cbiAgICAgIHMgKz0gJy8vJztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4KCkgJiYgdGhpcy5ob3N0KCkpIHtcbiAgICAgICAgcyArPSAnLy8nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYW1lIGFzIE1vemlsbGEgbnNJVVJJLnByZVBhdGhcbiAgICogQHJldHVybiB7c3RyaW5nfSBzY2hlbWU6Ly91c2VyOnBhc3N3b3JkQGhvc3Q6cG9ydFxuICAgKiBAc2VlICBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9uc0lVUklcbiAgICovXG4gIFVyaS5wcm90b3R5cGUub3JpZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHMgPSB0aGlzLnNjaGVtZSgpO1xuXG4gICAgaWYgKHRoaXMudXNlckluZm8oKSAmJiB0aGlzLmhvc3QoKSkge1xuICAgICAgcyArPSB0aGlzLnVzZXJJbmZvKCk7XG4gICAgICBpZiAodGhpcy51c2VySW5mbygpLmluZGV4T2YoJ0AnKSAhPT0gdGhpcy51c2VySW5mbygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcyArPSAnQCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdCgpKSB7XG4gICAgICBzICs9IHRoaXMuaG9zdCgpO1xuICAgICAgaWYgKHRoaXMucG9ydCgpIHx8ICh0aGlzLnBhdGgoKSAmJiB0aGlzLnBhdGgoKS5zdWJzdHIoMCwgMSkubWF0Y2goL1swLTldLykpKSB7XG4gICAgICAgIHMgKz0gJzonICsgdGhpcy5wb3J0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0cmFpbGluZyBzbGFzaCB0byB0aGUgcGF0aFxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5hZGRUcmFpbGluZ1NsYXNoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGggPSB0aGlzLnBhdGgoKSB8fCAnJztcblxuICAgIGlmIChwYXRoLnN1YnN0cigtMSkgIT09ICcvJykge1xuICAgICAgdGhpcy5wYXRoKHBhdGggKyAnLycpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgVXJpIG9iamVjdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBVcmkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGgsIHMgPSB0aGlzLm9yaWdpbigpO1xuXG4gICAgaWYgKHRoaXMuaXNDb2xvblVyaSgpKSB7XG4gICAgICBpZiAodGhpcy5wYXRoKCkpIHtcbiAgICAgICAgcyArPSAnOicrdGhpcy5wYXRoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhdGgoKSkge1xuICAgICAgcGF0aCA9IHRoaXMucGF0aCgpO1xuICAgICAgaWYgKCEocmUuZW5kc193aXRoX3NsYXNoZXMudGVzdChzKSB8fCByZS5zdGFydHNfd2l0aF9zbGFzaGVzLnRlc3QocGF0aCkpKSB7XG4gICAgICAgIHMgKz0gJy8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICBzLnJlcGxhY2UocmUuZW5kc193aXRoX3NsYXNoZXMsICcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZShyZS5zdGFydHNfd2l0aF9zbGFzaGVzLCAnLycpO1xuICAgICAgfVxuICAgICAgcyArPSBwYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5ob3N0KCkgJiYgKHRoaXMucXVlcnkoKS50b1N0cmluZygpIHx8IHRoaXMuYW5jaG9yKCkpKSB7XG4gICAgICAgIHMgKz0gJy8nO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeSgpLnRvU3RyaW5nKCkpIHtcbiAgICAgIHMgKz0gdGhpcy5xdWVyeSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5jaG9yKCkpIHtcbiAgICAgIGlmICh0aGlzLmFuY2hvcigpLmluZGV4T2YoJyMnKSAhPT0gMCkge1xuICAgICAgICBzICs9ICcjJztcbiAgICAgIH1cbiAgICAgIHMgKz0gdGhpcy5hbmNob3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogQ2xvbmUgYSBVcmkgb2JqZWN0XG4gICAqIEByZXR1cm4ge1VyaX0gZHVwbGljYXRlIGNvcHkgb2YgdGhlIFVyaVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVXJpKHRoaXMudG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGV4cG9ydCB2aWEgQU1EIG9yIENvbW1vbkpTLCBvdGhlcndpc2UgbGVhayBhIGdsb2JhbFxuICAgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBVcmk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gVXJpO1xuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5VcmkgPSBVcmk7XG4gIH1cbn0odGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzdXJpL1VyaS5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTUgVGhlIFF0IENvbXBhbnkgTHRkLlxuKiogQ29weXJpZ2h0IChDKSAyMDE0IEtsYXLDpGx2ZGFsZW5zIERhdGFrb25zdWx0IEFCLCBhIEtEQUIgR3JvdXAgY29tcGFueSwgaW5mb0BrZGFiLmNvbSwgYXV0aG9yIE1pbGlhbiBXb2xmZiA8bWlsaWFuLndvbGZmQGtkYWIuY29tPlxuKiogQ29udGFjdDogaHR0cDovL3d3dy5xdC5pby9saWNlbnNpbmcvXG4qKlxuKiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIFF0V2ViQ2hhbm5lbCBtb2R1bGUgb2YgdGhlIFF0IFRvb2xraXQuXG4qKlxuKiogJFFUX0JFR0lOX0xJQ0VOU0U6TEdQTDIxJFxuKiogQ29tbWVyY2lhbCBMaWNlbnNlIFVzYWdlXG4qKiBMaWNlbnNlZXMgaG9sZGluZyB2YWxpZCBjb21tZXJjaWFsIFF0IGxpY2Vuc2VzIG1heSB1c2UgdGhpcyBmaWxlIGluXG4qKiBhY2NvcmRhbmNlIHdpdGggdGhlIGNvbW1lcmNpYWwgbGljZW5zZSBhZ3JlZW1lbnQgcHJvdmlkZWQgd2l0aCB0aGVcbioqIFNvZnR3YXJlIG9yLCBhbHRlcm5hdGl2ZWx5LCBpbiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIGNvbnRhaW5lZCBpblxuKiogYSB3cml0dGVuIGFncmVlbWVudCBiZXR3ZWVuIHlvdSBhbmQgVGhlIFF0IENvbXBhbnkuIEZvciBsaWNlbnNpbmcgdGVybXNcbioqIGFuZCBjb25kaXRpb25zIHNlZSBodHRwOi8vd3d3LnF0LmlvL3Rlcm1zLWNvbmRpdGlvbnMuIEZvciBmdXJ0aGVyXG4qKiBpbmZvcm1hdGlvbiB1c2UgdGhlIGNvbnRhY3QgZm9ybSBhdCBodHRwOi8vd3d3LnF0LmlvL2NvbnRhY3QtdXMuXG4qKlxuKiogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIFVzYWdlXG4qKiBBbHRlcm5hdGl2ZWx5LCB0aGlzIGZpbGUgbWF5IGJlIHVzZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyXG4qKiBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMi4xIG9yIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWVcbioqIFNvZnR3YXJlIEZvdW5kYXRpb24gYW5kIGFwcGVhcmluZyBpbiB0aGUgZmlsZSBMSUNFTlNFLkxHUEx2MjEgYW5kXG4qKiBMSUNFTlNFLkxHUEx2MyBpbmNsdWRlZCBpbiB0aGUgcGFja2FnaW5nIG9mIHRoaXMgZmlsZS4gUGxlYXNlIHJldmlldyB0aGVcbioqIGZvbGxvd2luZyBpbmZvcm1hdGlvbiB0byBlbnN1cmUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiogcmVxdWlyZW1lbnRzIHdpbGwgYmUgbWV0OiBodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2xncGwuaHRtbCBhbmRcbioqIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9vbGQtbGljZW5zZXMvbGdwbC0yLjEuaHRtbC5cbioqXG4qKiBBcyBhIHNwZWNpYWwgZXhjZXB0aW9uLCBUaGUgUXQgQ29tcGFueSBnaXZlcyB5b3UgY2VydGFpbiBhZGRpdGlvbmFsXG4qKiByaWdodHMuIFRoZXNlIHJpZ2h0cyBhcmUgZGVzY3JpYmVkIGluIFRoZSBRdCBDb21wYW55IExHUEwgRXhjZXB0aW9uXG4qKiB2ZXJzaW9uIDEuMSwgaW5jbHVkZWQgaW4gdGhlIGZpbGUgTEdQTF9FWENFUFRJT04udHh0IGluIHRoaXMgcGFja2FnZS5cbioqXG4qKiAkUVRfRU5EX0xJQ0VOU0UkXG4qKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcyA9IHtcbiAgICBzaWduYWw6IDEsXG4gICAgcHJvcGVydHlVcGRhdGU6IDIsXG4gICAgaW5pdDogMyxcbiAgICBpZGxlOiA0LFxuICAgIGRlYnVnOiA1LFxuICAgIGludm9rZU1ldGhvZDogNixcbiAgICBjb25uZWN0VG9TaWduYWw6IDcsXG4gICAgZGlzY29ubmVjdEZyb21TaWduYWw6IDgsXG4gICAgc2V0UHJvcGVydHk6IDksXG4gICAgcmVzcG9uc2U6IDEwLFxufTtcblxudmFyIFFXZWJDaGFubmVsID0gZnVuY3Rpb24odHJhbnNwb3J0LCBpbml0Q2FsbGJhY2spXG57XG4gICAgaWYgKHR5cGVvZiB0cmFuc3BvcnQgIT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRyYW5zcG9ydC5zZW5kICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBRV2ViQ2hhbm5lbCBleHBlY3RzIGEgdHJhbnNwb3J0IG9iamVjdCB3aXRoIGEgc2VuZCBmdW5jdGlvbiBhbmQgb25tZXNzYWdlIGNhbGxiYWNrIHByb3BlcnR5LlwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcIiBHaXZlbiBpczogdHJhbnNwb3J0OiBcIiArIHR5cGVvZih0cmFuc3BvcnQpICsgXCIsIHRyYW5zcG9ydC5zZW5kOiBcIiArIHR5cGVvZih0cmFuc3BvcnQuc2VuZCkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzO1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuXG4gICAgdGhpcy5zZW5kID0gZnVuY3Rpb24oZGF0YSlcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLnRyYW5zcG9ydC5zZW5kKGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMudHJhbnNwb3J0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zaWduYWw6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVTaWduYWwoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnJlc3BvbnNlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUmVzcG9uc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnByb3BlcnR5VXBkYXRlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUHJvcGVydHlVcGRhdGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJpbnZhbGlkIG1lc3NhZ2UgcmVjZWl2ZWQ6XCIsIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmV4ZWNDYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLmV4ZWNJZCA9IDA7XG4gICAgdGhpcy5leGVjID0gZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXG4gICAge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBpZiBubyBjYWxsYmFjayBpcyBnaXZlbiwgc2VuZCBkaXJlY3RseVxuICAgICAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFubmVsLmV4ZWNJZCA9PT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgICAgICAgLy8gd3JhcFxuICAgICAgICAgICAgY2hhbm5lbC5leGVjSWQgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZXhlYyBtZXNzYWdlIHdpdGggcHJvcGVydHkgaWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuaWQgPSBjaGFubmVsLmV4ZWNJZCsrO1xuICAgICAgICBjaGFubmVsLmV4ZWNDYWxsYmFja3NbZGF0YS5pZF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLm9iamVjdHMgPSB7fTtcblxuICAgIHRoaXMuaGFuZGxlU2lnbmFsID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBvYmplY3QgPSBjaGFubmVsLm9iamVjdHNbbWVzc2FnZS5vYmplY3RdO1xuICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3Quc2lnbmFsRW1pdHRlZChtZXNzYWdlLnNpZ25hbCwgbWVzc2FnZS5hcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuaGFuZGxlZCBzaWduYWw6IFwiICsgbWVzc2FnZS5vYmplY3QgKyBcIjo6XCIgKyBtZXNzYWdlLnNpZ25hbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGlmICghbWVzc2FnZS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCByZXNwb25zZSBtZXNzYWdlIHJlY2VpdmVkOiBcIiwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1ttZXNzYWdlLmlkXShtZXNzYWdlLmRhdGEpO1xuICAgICAgICBkZWxldGUgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlLmRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhW2ldO1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1tkYXRhLm9iamVjdF07XG4gICAgICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnByb3BlcnR5VXBkYXRlKGRhdGEuc2lnbmFscywgZGF0YS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHByb3BlcnR5IHVwZGF0ZTogXCIgKyBkYXRhLm9iamVjdCArIFwiOjpcIiArIGRhdGEuc2lnbmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmlkbGV9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGNoYW5uZWwuc2VuZCh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGVidWcsIGRhdGE6IG1lc3NhZ2V9KTtcbiAgICB9O1xuXG4gICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbml0fSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgUU9iamVjdChvYmplY3ROYW1lLCBkYXRhW29iamVjdE5hbWVdLCBjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3cgdW53cmFwIHByb3BlcnRpZXMsIHdoaWNoIG1pZ2h0IHJlZmVyZW5jZSBvdGhlciByZWdpc3RlcmVkIG9iamVjdHNcbiAgICAgICAgZm9yICh2YXIgb2JqZWN0TmFtZSBpbiBjaGFubmVsLm9iamVjdHMpIHtcbiAgICAgICAgICAgIGNoYW5uZWwub2JqZWN0c1tvYmplY3ROYW1lXS51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluaXRDYWxsYmFjaykge1xuICAgICAgICAgICAgaW5pdENhbGxiYWNrKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gUU9iamVjdChuYW1lLCBkYXRhLCB3ZWJDaGFubmVsKVxue1xuICAgIHRoaXMuX19pZF9fID0gbmFtZTtcbiAgICB3ZWJDaGFubmVsLm9iamVjdHNbbmFtZV0gPSB0aGlzO1xuXG4gICAgLy8gTGlzdCBvZiBjYWxsYmFja3MgdGhhdCBnZXQgaW52b2tlZCB1cG9uIHNpZ25hbCBlbWlzc2lvblxuICAgIHRoaXMuX19vYmplY3RTaWduYWxzX18gPSB7fTtcblxuICAgIC8vIENhY2hlIG9mIGFsbCBwcm9wZXJ0aWVzLCB1cGRhdGVkIHdoZW4gYSBub3RpZnkgc2lnbmFsIGlzIGVtaXR0ZWRcbiAgICB0aGlzLl9fcHJvcGVydHlDYWNoZV9fID0ge307XG5cbiAgICB2YXIgb2JqZWN0ID0gdGhpcztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRoaXMudW53cmFwUU9iamVjdCA9IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgbGlzdCBvZiBvYmplY3RzXG4gICAgICAgICAgICB2YXIgcmV0ID0gbmV3IEFycmF5KHJlc3BvbnNlLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcmV0W2ldID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2VbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3BvbnNlXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2VbXCJfX1FPYmplY3QqX19cIl1cbiAgICAgICAgICAgIHx8IHJlc3BvbnNlW1wiaWRcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iamVjdElkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgIGlmICh3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdKVxuICAgICAgICAgICAgcmV0dXJuIHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF07XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHVud3JhcCB1bmtub3duIFFPYmplY3QgXCIgKyBvYmplY3RJZCArIFwiIHdpdGhvdXQgZGF0YS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcU9iamVjdCA9IG5ldyBRT2JqZWN0KCBvYmplY3RJZCwgcmVzcG9uc2UuZGF0YSwgd2ViQ2hhbm5lbCApO1xuICAgICAgICBxT2JqZWN0LmRlc3Ryb3llZC5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0gPT09IHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgbm93IGRlbGV0ZWQgUU9iamVjdCB0byBhbiBlbXB0eSB7fSBvYmplY3RcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGFzc2lnbmluZyB7fSB0aG91Z2ggd291bGQgbm90IGhhdmUgdGhlIGRlc2lyZWQgZWZmZWN0LCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gYmVsb3cgYWxzbyBlbnN1cmVzIGFsbCBleHRlcm5hbCByZWZlcmVuY2VzIHdpbGwgc2VlIHRoZSBlbXB0eSBtYXBcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB0aGlzIGRldG91ciBpcyBuZWNlc3NhcnkgdG8gd29ya2Fyb3VuZCBRVEJVRy00MDAyMVxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lcy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCBpbiBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxT2JqZWN0W3Byb3BlcnR5TmFtZXNbaWR4XV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gaGVyZSB3ZSBhcmUgYWxyZWFkeSBpbml0aWFsaXplZCwgYW5kIHRodXMgbXVzdCBkaXJlY3RseSB1bndyYXAgdGhlIHByb3BlcnRpZXNcbiAgICAgICAgcU9iamVjdC51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHJldHVybiBxT2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudW53cmFwUHJvcGVydGllcyA9IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5SWR4IGluIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfXykge1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSA9IG9iamVjdC51bndyYXBRT2JqZWN0KG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUlkeF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU2lnbmFsKHNpZ25hbERhdGEsIGlzUHJvcGVydHlOb3RpZnlTaWduYWwpXG4gICAge1xuICAgICAgICB2YXIgc2lnbmFsTmFtZSA9IHNpZ25hbERhdGFbMF07XG4gICAgICAgIHZhciBzaWduYWxJbmRleCA9IHNpZ25hbERhdGFbMV07XG4gICAgICAgIG9iamVjdFtzaWduYWxOYW1lXSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGNvbm5lY3QgdG8gc2lnbmFsIFwiICsgc2lnbmFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnB1c2goY2FsbGJhY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIHNpZ25hbE5hbWUgIT09IFwiZGVzdHJveWVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSByZXF1aXJlZCBmb3IgXCJwdXJlXCIgc2lnbmFscywgaGFuZGxlZCBzZXBhcmF0ZWx5IGZvciBwcm9wZXJ0aWVzIGluIHByb3BlcnR5VXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsc28gbm90ZSB0aGF0IHdlIGFsd2F5cyBnZXQgbm90aWZpZWQgYWJvdXQgdGhlIGRlc3Ryb3llZCBzaWduYWxcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmNvbm5lY3RUb1NpZ25hbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogc2lnbmFsSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGRpc2Nvbm5lY3QgZnJvbSBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGZpbmQgY29ubmVjdGlvbiBvZiBzaWduYWwgXCIgKyBzaWduYWxOYW1lICsgXCIgdG8gXCIgKyBjYWxsYmFjay5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIGlmICghaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbCAmJiBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmRpc2Nvbm5lY3RGcm9tU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGUgZ2l2ZW4gc2lnbmFsbmFtZS4gQWxzbyB3b3JrcyBmb3IgcHJvcGVydHkgbm90aWZ5IGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncylcbiAgICB7XG4gICAgICAgIHZhciBjb25uZWN0aW9ucyA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxOYW1lXTtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb25zKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIHNpZ25hbEFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb3BlcnR5VXBkYXRlID0gZnVuY3Rpb24oc2lnbmFscywgcHJvcGVydHlNYXApXG4gICAge1xuICAgICAgICAvLyB1cGRhdGUgcHJvcGVydHkgY2FjaGVcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJbmRleCBpbiBwcm9wZXJ0eU1hcCkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eU1hcFtwcm9wZXJ0eUluZGV4XTtcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBzaWduYWxOYW1lIGluIHNpZ25hbHMpIHtcbiAgICAgICAgICAgIC8vIEludm9rZSBhbGwgY2FsbGJhY2tzLCBhcyBzaWduYWxFbWl0dGVkKCkgZG9lcyBub3QuIFRoaXMgZW5zdXJlcyB0aGVcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGNhY2hlIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFja3MgYXJlIGludm9rZWQuXG4gICAgICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsc1tzaWduYWxOYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbEVtaXR0ZWQgPSBmdW5jdGlvbihzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgaW52b2tlU2lnbmFsQ2FsbGJhY2tzKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1ldGhvZChtZXRob2REYXRhKVxuICAgIHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXRob2REYXRhWzBdO1xuICAgICAgICB2YXIgbWV0aG9kSWR4ID0gbWV0aG9kRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbnZva2VNZXRob2QsXG4gICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBtZXRob2RJZHgsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG9iamVjdC51bndyYXBRT2JqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FsbGJhY2spKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kR2V0dGVyU2V0dGVyKHByb3BlcnR5SW5mbylcbiAgICB7XG4gICAgICAgIHZhciBwcm9wZXJ0eUluZGV4ID0gcHJvcGVydHlJbmZvWzBdO1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHlJbmZvWzFdO1xuICAgICAgICB2YXIgbm90aWZ5U2lnbmFsRGF0YSA9IHByb3BlcnR5SW5mb1syXTtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBwcm9wZXJ0eSBjYWNoZSB3aXRoIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgLy8gTk9URTogaWYgdGhpcyBpcyBhbiBvYmplY3QsIGl0IGlzIG5vdCBkaXJlY3RseSB1bndyYXBwZWQgYXMgaXQgbWlnaHRcbiAgICAgICAgLy8gcmVmZXJlbmNlIG90aGVyIFFPYmplY3QgdGhhdCB3ZSBkbyBub3Qga25vdyB5ZXRcbiAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlJbmZvWzNdO1xuXG4gICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm90aWZ5U2lnbmFsRGF0YVswXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBuYW1lIGlzIG9wdGltaXplZCBhd2F5LCByZWNvbnN0cnVjdCB0aGUgYWN0dWFsIG5hbWVcbiAgICAgICAgICAgICAgICBub3RpZnlTaWduYWxEYXRhWzBdID0gcHJvcGVydHlOYW1lICsgXCJDaGFuZ2VkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRTaWduYWwobm90aWZ5U2lnbmFsRGF0YSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGRuJ3QgaGFwcGVuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuZGVmaW5lZCB2YWx1ZSBpbiBwcm9wZXJ0eSBjYWNoZSBmb3IgcHJvcGVydHkgXFxcIlwiICsgcHJvcGVydHlOYW1lICsgXCJcXFwiIGluIG9iamVjdCBcIiArIG9iamVjdC5fX2lkX18pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQcm9wZXJ0eSBzZXR0ZXIgZm9yIFwiICsgcHJvcGVydHlOYW1lICsgXCIgY2FsbGVkIHdpdGggdW5kZWZpbmVkIHZhbHVlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2V0UHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogcHJvcGVydHlJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRhdGEubWV0aG9kcy5mb3JFYWNoKGFkZE1ldGhvZCk7XG5cbiAgICBkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChiaW5kR2V0dGVyU2V0dGVyKTtcblxuICAgIGRhdGEuc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uKHNpZ25hbCkgeyBhZGRTaWduYWwoc2lnbmFsLCBmYWxzZSk7IH0pO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLmVudW1zKSB7XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IGRhdGEuZW51bXNbbmFtZV07XG4gICAgfVxufVxuXG4vL3JlcXVpcmVkIGZvciB1c2Ugd2l0aCBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBRV2ViQ2hhbm5lbDogUVdlYkNoYW5uZWxcbiAgICB9O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3F3ZWJjaGFubmVsL3F3ZWJjaGFubmVsLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL1V0aWxpdGllcy5qcycpO1xyXG52YXIgU2hhcmVkID0gcmVxdWlyZSgnLi9TaGFyZWQuanMnKTtcclxudmFyIE5hdGl2ZURpc3BhdGNoZXIgPSByZXF1aXJlKCcuL05hdGl2ZURpc3BhdGNoZXIuanMnKTtcclxudmFyIFNpbXVsYXRvckRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL1NpbXVsYXRvckRpc3BhdGNoZXIuanMnKTtcclxudmFyIHF3ZWJjaGFubmVsID0gcmVxdWlyZSgncXdlYmNoYW5uZWwnKTtcclxuXHJcbi8qKiBAbW9kdWxlIFNoaW1MaWJyYXJ5IC0gVGhpcyBtb2R1bGUgZGVmaW5lcyB0aGUgV0RDJ3Mgc2hpbSBsaWJyYXJ5IHdoaWNoIGlzIHVzZWRcclxudG8gYnJpZGdlIHRoZSBnYXAgYmV0d2VlbiB0aGUgamF2YXNjcmlwdCBjb2RlIG9mIHRoZSBXREMgYW5kIHRoZSBkcml2aW5nIGNvbnRleHRcclxub2YgdGhlIFdEQyAoVGFibGVhdSBkZXNrdG9wLCB0aGUgc2ltdWxhdG9yLCBldGMuKSAqL1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIG9uY2UgYm9vdHN0cmFwcGluZyBoYXMgYmVlbiBjb21wbGV0ZWQgYW5kIHRoZVxyXG4vLyBkaXNwYXRjaGVyIGFuZCBzaGFyZWQgV0RDIG9iamVjdHMgYXJlIGJvdGggY3JlYXRlZCBhbmQgYXZhaWxhYmxlXHJcbmZ1bmN0aW9uIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChfZGlzcGF0Y2hlciwgX3NoYXJlZCkge1xyXG4gIFV0aWxpdGllcy5jb3B5RnVuY3Rpb25zKF9kaXNwYXRjaGVyLnB1YmxpY0ludGVyZmFjZSwgd2luZG93LnRhYmxlYXUpO1xyXG4gIFV0aWxpdGllcy5jb3B5RnVuY3Rpb25zKF9kaXNwYXRjaGVyLnByaXZhdGVJbnRlcmZhY2UsIHdpbmRvdy5fdGFibGVhdSk7XHJcbiAgX3NoYXJlZC5pbml0KCk7XHJcbn1cclxuXHJcbi8vIEluaXRpYWxpemVzIHRoZSB3ZGMgc2hpbSBsaWJyYXJ5LiBZb3UgbXVzdCBjYWxsIHRoaXMgYmVmb3JlIGRvaW5nIGFueXRoaW5nIHdpdGggV0RDXHJcbm1vZHVsZS5leHBvcnRzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgLy8gVGhlIGluaXRpYWwgY29kZSBoZXJlIGlzIHRoZSBvbmx5IHBsYWNlIGluIG91ciBtb2R1bGUgd2hpY2ggc2hvdWxkIGhhdmUgZ2xvYmFsXHJcbiAgLy8ga25vd2xlZGdlIG9mIGhvdyBhbGwgdGhlIFdEQyBjb21wb25lbnRzIGFyZSBnbHVlZCB0b2dldGhlci4gVGhpcyBpcyB0aGUgb25seSBwbGFjZVxyXG4gIC8vIHdoaWNoIHdpbGwga25vdyBhYm91dCB0aGUgd2luZG93IG9iamVjdCBvciBvdGhlciBnbG9iYWwgb2JqZWN0cy4gVGhpcyBjb2RlIHdpbGwgYmUgcnVuXHJcbiAgLy8gaW1tZWRpYXRlbHkgd2hlbiB0aGUgc2hpbSBsaWJyYXJ5IGxvYWRzIGFuZCBpcyByZXNwb25zaWJsZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIGNvbnRleHRcclxuICAvLyB3aGljaCBpdCBpcyBydW5uaW5nIGl0IGFuZCBzZXR1cCBhIGNvbW11bmljYXRpb25zIGNoYW5uZWwgYmV0d2VlbiB0aGUganMgJiBydW5uaW5nIGNvZGVcclxuICB2YXIgZGlzcGF0Y2hlciA9IG51bGw7XHJcbiAgdmFyIHNoYXJlZCA9IG51bGw7XHJcblxyXG4gIC8vIEFsd2F5cyBkZWZpbmUgdGhlIHByaXZhdGUgX3RhYmxlYXUgb2JqZWN0IGF0IHRoZSBzdGFydFxyXG4gIHdpbmRvdy5fdGFibGVhdSA9IHt9O1xyXG5cclxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIHRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwIGlzIGRlZmluZWQgYXMgYSBnbG9iYWwgb2JqZWN0LiBJZiBzbyxcclxuICAvLyB3ZSBhcmUgcnVubmluZyBpbiB0aGUgVGFibGVhdSBkZXNrdG9wL3NlcnZlciBjb250ZXh0LiBJZiBub3QsIHdlJ3JlIHJ1bm5pbmcgaW4gdGhlIHNpbXVsYXRvclxyXG4gIGlmICghIXdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCkge1xyXG4gICAgLy8gV2UgaGF2ZSB0aGUgdGFibGVhdSBvYmplY3QgZGVmaW5lZFxyXG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciwgUmVwb3J0aW5nIHZlcnNpb24gbnVtYmVyXCIpO1xyXG4gICAgd2luZG93LnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwLlJlcG9ydFZlcnNpb25OdW1iZXIoQlVJTERfTlVNQkVSKTtcclxuICAgIGRpc3BhdGNoZXIgPSBuZXcgTmF0aXZlRGlzcGF0Y2hlcih3aW5kb3cpO1xyXG4gIH0gZWxzZSBpZiAoISF3aW5kb3cucXQgJiYgISF3aW5kb3cucXQud2ViQ2hhbm5lbFRyYW5zcG9ydCkge1xyXG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciBmb3IgcXdlYmNoYW5uZWxcIik7XHJcbiAgICB3aW5kb3cudGFibGVhdSA9IHt9O1xyXG5cclxuICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gYSBjb250ZXh0IHdoZXJlIHRoZSB3ZWJDaGFubmVsVHJhbnNwb3J0IGlzIGF2YWlsYWJsZS4gVGhpcyBtZWFucyBRV2ViRW5naW5lIGlzIGluIHVzZVxyXG4gICAgd2luZG93LmNoYW5uZWwgPSBuZXcgcXdlYmNoYW5uZWwuUVdlYkNoYW5uZWwocXQud2ViQ2hhbm5lbFRyYW5zcG9ydCwgZnVuY3Rpb24oY2hhbm5lbCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlFXZWJDaGFubmVsIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG5cclxuICAgICAgLy8gRGVmaW5lIHRoZSBmdW5jdGlvbiB3aGljaCB0YWJsZWF1IHdpbGwgY2FsbCBhZnRlciBpdCBoYXMgaW5zZXJ0ZWQgYWxsIHRoZSByZXF1aXJlZCBvYmplY3RzIGludG8gdGhlIGphdmFzY3JpcHQgZnJhbWVcclxuICAgICAgd2luZG93Ll90YWJsZWF1Ll9uYXRpdmVTZXR1cENvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIE9uY2UgdGhlIG5hdGl2ZSBjb2RlIHRlbGxzIHVzIGV2ZXJ5dGhpbmcgaGVyZSBpcyBkb25lLCB3ZSBzaG91bGQgaGF2ZSBhbGwgdGhlIGV4cGVjdGVkIG9iamVjdHMgaW5zZXJ0ZWQgaW50byBqc1xyXG4gICAgICAgIGRpc3BhdGNoZXIgPSBuZXcgTmF0aXZlRGlzcGF0Y2hlcihjaGFubmVsLm9iamVjdHMpO1xyXG4gICAgICAgIHdpbmRvdy50YWJsZWF1ID0gY2hhbm5lbC5vYmplY3RzLnRhYmxlYXU7XHJcbiAgICAgICAgc2hhcmVkLmNoYW5nZVRhYmxlYXVBcGlPYmood2luZG93LnRhYmxlYXUpO1xyXG4gICAgICAgIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChkaXNwYXRjaGVyLCBzaGFyZWQpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gQWN0dWFsbHkgY2FsbCBpbnRvIHRoZSB2ZXJzaW9uIGJvb3RzdHJhcHBlciB0byByZXBvcnQgb3VyIHZlcnNpb24gbnVtYmVyXHJcbiAgICAgIGNoYW5uZWwub2JqZWN0cy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5sb2coXCJWZXJzaW9uIEJvb3RzdHJhcCBpcyBub3QgZGVmaW5lZCwgSW5pdGlhbGl6aW5nIFNpbXVsYXRvckRpc3BhdGNoZXJcIik7XHJcbiAgICB3aW5kb3cudGFibGVhdSA9IHt9O1xyXG4gICAgZGlzcGF0Y2hlciA9IG5ldyBTaW11bGF0b3JEaXNwYXRjaGVyKHdpbmRvdyk7XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXplIHRoZSBzaGFyZWQgV0RDIG9iamVjdCBhbmQgYWRkIGluIG91ciBlbnVtIHZhbHVlc1xyXG4gIHNoYXJlZCA9IG5ldyBTaGFyZWQod2luZG93LnRhYmxlYXUsIHdpbmRvdy5fdGFibGVhdSwgd2luZG93KTtcclxuXHJcbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkaXNwYXRjaGVyIGlzIGFscmVhZHkgZGVmaW5lZCBhbmQgaW1tZWRpYXRlbHkgY2FsbCB0aGVcclxuICAvLyBjYWxsYmFjayBpZiBzb1xyXG4gIGlmIChkaXNwYXRjaGVyKSB7XHJcbiAgICBib290c3RyYXBwaW5nRmluaXNoZWQoZGlzcGF0Y2hlciwgc2hhcmVkKTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdGFibGVhdXdkYy5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDM0tBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzsiLCJzb3VyY2VSb290IjoiIn0=
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
	var tableauwdc = __webpack_require__(20);
	tableauwdc.init();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var APPROVED_ORIGINS_KEY = "wdc_approved_origins";
	var SEPARATOR = ",";
	var Cookies = __webpack_require__(9);

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
	__webpack_require__(8);

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

	  var Uri = __webpack_require__(18);
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
	    var deStringsMap = __webpack_require__(10);
	    var enStringsMap = __webpack_require__(11);
	    var esStringsMap = __webpack_require__(12);
	    var jaStringsMap = __webpack_require__(14);
	    var frStringsMap = __webpack_require__(13);
	    var koStringsMap = __webpack_require__(15);
	    var ptStringsMap = __webpack_require__(16);
	    var zhStringsMap = __webpack_require__(17);

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
/***/ function(module, exports) {

	/*! http://mths.be/endswith v0.2.0 by @mathias */
	if (!String.prototype.endsWith) {
		(function() {
			'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var toString = {}.toString;
			var endsWith = function(search) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				if (search && toString.call(search) == '[object RegExp]') {
					throw TypeError();
				}
				var stringLength = string.length;
				var searchString = String(search);
				var searchLength = searchString.length;
				var pos = stringLength;
				if (arguments.length > 1) {
					var position = arguments[1];
					if (position !== undefined) {
						// `ToInteger`
						pos = position ? Number(position) : 0;
						if (pos != pos) { // better `isNaN`
							pos = 0;
						}
					}
				}
				var end = Math.min(Math.max(pos, 0), stringLength);
				var start = end - searchLength;
				if (start < 0) {
					return false;
				}
				var index = -1;
				while (++index < searchLength) {
					if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
						return false;
					}
				}
				return true;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'endsWith', {
					'value': endsWith,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.endsWith = endsWith;
			}
		}());
	}


/***/ },
/* 9 */
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
		"webSecurityWarning": "To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {
		"webSecurityWarning": "wwTo help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"
	};

/***/ },
/* 18 */
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Utilities = __webpack_require__(7);
	var Shared = __webpack_require__(4);
	var NativeDispatcher = __webpack_require__(3);
	var SimulatorDispatcher = __webpack_require__(5);
	var qwebchannel = __webpack_require__(19);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDFjNDlmODVhMGEyZWI0MTYyZTE0Iiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0FwcHJvdmVkT3JpZ2lucy5qcyIsIndlYnBhY2s6Ly8vLi9FbnVtcy5qcyIsIndlYnBhY2s6Ly8vLi9OYXRpdmVEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1RhYmxlLmpzIiwid2VicGFjazovLy8uL1V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9+L1N0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgvZW5kc3dpdGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb29raWVzLWpzL2Rpc3QvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc196aC1DTi5qc29uIiwid2VicGFjazovLy8uL34vanN1cmkvVXJpLmpzIiwid2VicGFjazovLy8uL34vcXdlYmNoYW5uZWwvcXdlYmNoYW5uZWwuanMiLCJ3ZWJwYWNrOi8vLy4vdGFibGVhdXdkYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDFjNDlmODVhMGEyZWI0MTYyZTE0XG4gKiovIiwiLy8gTWFpbiBlbnRyeSBwb2ludCB0byBwdWxsIHRvZ2V0aGVyIGV2ZXJ5dGhpbmcgbmVlZGVkIGZvciB0aGUgV0RDIHNoaW0gbGlicmFyeVxuLy8gVGhpcyBmaWxlIHdpbGwgYmUgZXhwb3J0ZWQgYXMgYSBidW5kbGVkIGpzIGZpbGUgYnkgd2VicGFjayBzbyBpdCBjYW4gYmUgaW5jbHVkZWRcbi8vIGluIGEgPHNjcmlwdD4gdGFnIGluIGFuIGh0bWwgZG9jdW1lbnQuIEFsZXJuYXRpdmVseSwgYSBjb25uZWN0b3IgbWF5IGluY2x1ZGVcbi8vIHRoaXMgd2hvbGUgcGFja2FnZSBpbiB0aGVpciBjb2RlIGFuZCB3b3VsZCBuZWVkIHRvIGNhbGwgaW5pdCBsaWtlIHRoaXNcbnZhciB0YWJsZWF1d2RjID0gcmVxdWlyZSgnLi90YWJsZWF1d2RjLmpzJyk7XG50YWJsZWF1d2RjLmluaXQoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9pbmRleC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBBUFBST1ZFRF9PUklHSU5TX0tFWSA9IFwid2RjX2FwcHJvdmVkX29yaWdpbnNcIjtcbnZhciBTRVBBUkFUT1IgPSBcIixcIjtcbnZhciBDb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpO1xuXG5mdW5jdGlvbiBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKSB7XG4gIHZhciByZXN1bHQgPSBDb29raWVzLmdldChBUFBST1ZFRF9PUklHSU5TX0tFWSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlQXBwcm92ZWRPcmlnaW5zKG9yaWdpbkFycmF5KSB7XG4gIHZhciBuZXdPcmlnaW5TdHJpbmcgPSBvcmlnaW5BcnJheS5qb2luKFNFUEFSQVRPUik7XG4gIGNvbnNvbGUubG9nKFwiU2F2aW5nIGFwcHJvdmVkIG9yaWdpbnMgJ1wiICsgbmV3T3JpZ2luU3RyaW5nICsgXCInXCIpO1xuICBcbiAgLy8gV2UgY291bGQgcG90ZW50aWFsbHkgbWFrZSB0aGlzIGEgbG9uZ2VyIHRlcm0gY29va2llIGluc3RlYWQgb2YganVzdCBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvblxuICB2YXIgcmVzdWx0ID0gQ29va2llcy5zZXQoQVBQUk9WRURfT1JJR0lOU19LRVksIG5ld09yaWdpblN0cmluZyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEFkZHMgYW4gYXBwcm92ZWQgb3JpZ2lucyB0byB0aGUgbGlzdCBhbHJlYWR5IHNhdmVkIGluIGEgc2Vzc2lvbiBjb29raWVcbmZ1bmN0aW9uIGFkZEFwcHJvdmVkT3JpZ2luKG9yaWdpbikge1xuICBpZiAob3JpZ2luKSB7XG4gICAgdmFyIG9yaWdpbnMgPSBnZXRBcHByb3ZlZE9yaWdpbnMoKTtcbiAgICBvcmlnaW5zLnB1c2gob3JpZ2luKTtcbiAgICBfc2F2ZUFwcHJvdmVkT3JpZ2lucyhvcmlnaW5zKTtcbiAgfVxufVxuXG4vLyBSZXRyaWV2ZXMgdGhlIG9yaWdpbnMgd2hpY2ggaGF2ZSBhbHJlYWR5IGJlZW4gYXBwcm92ZWQgYnkgdGhlIHVzZXJcbmZ1bmN0aW9uIGdldEFwcHJvdmVkT3JpZ2lucygpIHtcbiAgdmFyIG9yaWdpbnNTdHJpbmcgPSBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKTtcbiAgaWYgKCFvcmlnaW5zU3RyaW5nIHx8IDAgPT09IG9yaWdpbnNTdHJpbmcubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9yaWdpbnMgPSBvcmlnaW5zU3RyaW5nLnNwbGl0KFNFUEFSQVRPUik7XG4gIHJldHVybiBvcmlnaW5zO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5hZGRBcHByb3ZlZE9yaWdpbiA9IGFkZEFwcHJvdmVkT3JpZ2luO1xubW9kdWxlLmV4cG9ydHMuZ2V0QXBwcm92ZWRPcmlnaW5zID0gZ2V0QXBwcm92ZWRPcmlnaW5zO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL0FwcHJvdmVkT3JpZ2lucy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBUaGlzIGZpbGUgbGlzdHMgYWxsIG9mIHRoZSBlbnVtcyB3aGljaCBzaG91bGQgYXZhaWxhYmxlIGZvciB0aGUgV0RDICovXG52YXIgYWxsRW51bXMgPSB7XG4gIHBoYXNlRW51bSA6IHtcbiAgICBpbnRlcmFjdGl2ZVBoYXNlOiBcImludGVyYWN0aXZlXCIsXG4gICAgYXV0aFBoYXNlOiBcImF1dGhcIixcbiAgICBnYXRoZXJEYXRhUGhhc2U6IFwiZ2F0aGVyRGF0YVwiXG4gIH0sXG5cbiAgYXV0aFB1cnBvc2VFbnVtIDoge1xuICAgIGVwaGVtZXJhbDogXCJlcGhlbWVyYWxcIixcbiAgICBlbmR1cmluZzogXCJlbmR1cmluZ1wiXG4gIH0sXG5cbiAgYXV0aFR5cGVFbnVtIDoge1xuICAgIG5vbmU6IFwibm9uZVwiLFxuICAgIGJhc2ljOiBcImJhc2ljXCIsXG4gICAgY3VzdG9tOiBcImN1c3RvbVwiXG4gIH0sXG5cbiAgZGF0YVR5cGVFbnVtIDoge1xuICAgIGJvb2w6IFwiYm9vbFwiLFxuICAgIGRhdGU6IFwiZGF0ZVwiLFxuICAgIGRhdGV0aW1lOiBcImRhdGV0aW1lXCIsXG4gICAgZmxvYXQ6IFwiZmxvYXRcIixcbiAgICBpbnQ6IFwiaW50XCIsXG4gICAgc3RyaW5nOiBcInN0cmluZ1wiXG4gIH0sXG5cbiAgY29sdW1uUm9sZUVudW0gOiB7XG4gICAgICBkaW1lbnNpb246IFwiZGltZW5zaW9uXCIsXG4gICAgICBtZWFzdXJlOiBcIm1lYXN1cmVcIlxuICB9LFxuXG4gIGNvbHVtblR5cGVFbnVtIDoge1xuICAgICAgY29udGludW91czogXCJjb250aW51b3VzXCIsXG4gICAgICBkaXNjcmV0ZTogXCJkaXNjcmV0ZVwiXG4gIH0sXG5cbiAgYWdnVHlwZUVudW0gOiB7XG4gICAgICBzdW06IFwic3VtXCIsXG4gICAgICBhdmc6IFwiYXZnXCIsXG4gICAgICBtZWRpYW46IFwibWVkaWFuXCIsXG4gICAgICBjb3VudDogXCJjb3VudFwiLFxuICAgICAgY291bnRkOiBcImNvdW50X2Rpc3RcIlxuICB9LFxuXG4gIGdlb2dyYXBoaWNSb2xlRW51bSA6IHtcbiAgICAgIGFyZWFfY29kZTogXCJhcmVhX2NvZGVcIixcbiAgICAgIGNic2FfbXNhOiBcImNic2FfbXNhXCIsXG4gICAgICBjaXR5OiBcImNpdHlcIixcbiAgICAgIGNvbmdyZXNzaW9uYWxfZGlzdHJpY3Q6IFwiY29uZ3Jlc3Npb25hbF9kaXN0cmljdFwiLFxuICAgICAgY291bnRyeV9yZWdpb246IFwiY291bnRyeV9yZWdpb25cIixcbiAgICAgIGNvdW50eTogXCJjb3VudHlcIixcbiAgICAgIHN0YXRlX3Byb3ZpbmNlOiBcInN0YXRlX3Byb3ZpbmNlXCIsXG4gICAgICB6aXBfY29kZV9wb3N0Y29kZTogXCJ6aXBfY29kZV9wb3N0Y29kZVwiLFxuICAgICAgbGF0aXR1ZGU6IFwibGF0aXR1ZGVcIixcbiAgICAgIGxvbmdpdHVkZTogXCJsb25naXR1ZGVcIlxuICB9LFxuXG4gIHVuaXRzRm9ybWF0RW51bSA6IHtcbiAgICAgIHRob3VzYW5kczogXCJ0aG91c2FuZHNcIixcbiAgICAgIG1pbGxpb25zOiBcIm1pbGxpb25zXCIsXG4gICAgICBiaWxsaW9uc19lbmdsaXNoOiBcImJpbGxpb25zX2VuZ2xpc2hcIixcbiAgICAgIGJpbGxpb25zX3N0YW5kYXJkOiBcImJpbGxpb25zX3N0YW5kYXJkXCJcbiAgfSxcblxuICBudW1iZXJGb3JtYXRFbnVtIDoge1xuICAgICAgbnVtYmVyOiBcIm51bWJlclwiLFxuICAgICAgY3VycmVuY3k6IFwiY3VycmVuY3lcIixcbiAgICAgIHNjaWVudGlmaWM6IFwic2NpZW50aWZpY1wiLFxuICAgICAgcGVyY2VudGFnZTogXCJwZXJjZW50YWdlXCJcbiAgfSxcblxuICBsb2NhbGVFbnVtIDoge1xuICAgICAgYW1lcmljYTogXCJlbi11c1wiLFxuICAgICAgYnJhemlsOiAgXCJwdC1iclwiLFxuICAgICAgY2hpbmE6ICAgXCJ6aC1jblwiLFxuICAgICAgZnJhbmNlOiAgXCJmci1mclwiLFxuICAgICAgZ2VybWFueTogXCJkZS1kZVwiLFxuICAgICAgamFwYW46ICAgXCJqYS1qcFwiLFxuICAgICAga29yZWE6ICAgXCJrby1rclwiLFxuICAgICAgc3BhaW46ICAgXCJlcy1lc1wiXG4gIH0sXG5cbiAgam9pbkVudW0gOiB7XG4gICAgICBpbm5lcjogXCJpbm5lclwiLFxuICAgICAgbGVmdDogXCJsZWZ0XCJcbiAgfVxufVxuXG4vLyBBcHBsaWVzIHRoZSBlbnVtcyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG5mdW5jdGlvbiBhcHBseSh0YXJnZXQpIHtcbiAgZm9yKHZhciBrZXkgaW4gYWxsRW51bXMpIHtcbiAgICB0YXJnZXRba2V5XSA9IGFsbEVudW1zW2tleV07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuYXBwbHkgPSBhcHBseTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9FbnVtcy5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgYW5kIHRoZSBXREMnc1xuKiBKYXZhc2NyaXB0LiBpcyBwcmVkb21pbmFudGx5IGEgcGFzcy10aHJvdWdoIHRvIHRoZSBRdCBXZWJCcmlkZ2UgbWV0aG9kc1xuKiBAcGFyYW0gbmF0aXZlQXBpUm9vdE9iaiB7T2JqZWN0fSAtIFRoZSByb290IG9iamVjdCB3aGVyZSB0aGUgbmF0aXZlIEFwaSBtZXRob2RzXG4qIGFyZSBhdmFpbGFibGUuIEZvciBXZWJLaXQsIHRoaXMgaXMgd2luZG93LlxuKi9cbmZ1bmN0aW9uIE5hdGl2ZURpc3BhdGNoZXIgKG5hdGl2ZUFwaVJvb3RPYmopIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqID0gbmF0aXZlQXBpUm9vdE9iajtcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xuICB0aGlzLl9pbml0UHJpdmF0ZUludGVyZmFjZSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5yZXBvcnRQcm9ncmVzcyA9IHRoaXMuX3JlcG9ydFByb2dyZXNzLmJpbmQodGhpcyk7XG5cbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRGb3JBdXRoLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRXaXRoRXJyb3IuYXBpKG1zZyk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmFwaShkZXN0T3JpZ2luTGlzdCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfbG9nLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zdWJtaXRDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcInN1Ym1pdCBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc3VibWl0LmFwaSgpO1xufTtcblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlIGZvciBOYXRpdmVEaXNwYXRjaGVyXCIpO1xuXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcbiAgcHJpdmF0ZUludGVyZmFjZS5faW5pdENhbGxiYWNrID0gdGhpcy5faW5pdENhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSB0aGlzLl90YWJsZURhdGFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9kYXRhRG9uZUNhbGxiYWNrID0gdGhpcy5fZGF0YURvbmVDYWxsYmFjay5iaW5kKHRoaXMpO1xuXG4gIHRoaXMucHJpdmF0ZUludGVyZmFjZSA9IHByaXZhdGVJbnRlcmZhY2U7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwiaW5pdENhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQgPSB0cnVlO1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9pbml0Q2FsbGJhY2suYXBpKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJzaHV0ZG93bkNhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2h1dGRvd25DYWxsYmFjay5hcGkoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XG4gIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB3ZSBhcmUgdXNpbmcgYSB2ZXJzaW9uIG9mIGRlc2t0b3Agd2hpY2ggaGFzIHRoZSBXRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXggZGVmaW5lZFxuICBpZiAoISF0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4KSB7XG4gICAgLy8gUHJvdmlkaW5nIHN0YW5kYXJkQ29ubmVjdGlvbnMgaXMgb3B0aW9uYWwgYnV0IHdlIGNhbid0IHBhc3MgdW5kZWZpbmVkIGJhY2sgYmVjYXVzZSBRdCB3aWxsIGNob2tlXG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeC5hcGkoc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFjay5hcGkoc2NoZW1hKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbih0YWJsZU5hbWUsIGRhdGEpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfdGFibGVEYXRhQ2FsbGJhY2suYXBpKHRhYmxlTmFtZSwgZGF0YSk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9yZXBvcnRQcm9ncmVzcyA9IGZ1bmN0aW9uIChwcm9ncmVzcykge1xuICAvLyBSZXBvcnQgcHJvZ3Jlc3Mgd2FzIGFkZGVkIGluIDIuMSBzbyBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZSBpZiBUYWJsZWF1IG9ubHkga25vd3MgMi4wXG4gIGlmICghIXRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3JlcG9ydFByb2dyZXNzKSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MuYXBpKHByb2dyZXNzKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcInJlcG9ydFByb2dyZXNzIG5vdCBhdmFpbGFibGUgZnJvbSB0aGlzIFRhYmxlYXUgdmVyc2lvblwiKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9kYXRhRG9uZUNhbGxiYWNrLmFwaSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdGl2ZURpc3BhdGNoZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vTmF0aXZlRGlzcGF0Y2hlci5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBUYWJsZSA9IHJlcXVpcmUoJy4vVGFibGUuanMnKTtcbnZhciBFbnVtcyA9IHJlcXVpcmUoJy4vRW51bXMuanMnKTtcblxuLyoqIEBjbGFzcyBUaGlzIGNsYXNzIHJlcHJlc2VudHMgdGhlIHNoYXJlZCBwYXJ0cyBvZiB0aGUgamF2YXNjcmlwdFxuKiBsaWJyYXJ5IHdoaWNoIGRvIG5vdCBoYXZlIGFueSBkZXBlbmRlbmNlIG9uIHdoZXRoZXIgd2UgYXJlIHJ1bm5pbmcgaW5cbiogdGhlIHNpbXVsYXRvciwgaW4gVGFibGVhdSwgb3IgYW55d2hlcmUgZWxzZVxuKiBAcGFyYW0gdGFibGVhdUFwaU9iaiB7T2JqZWN0fSAtIFRoZSBhbHJlYWR5IGNyZWF0ZWQgdGFibGVhdSBBUEkgb2JqZWN0ICh1c3VhbGx5IHdpbmRvdy50YWJsZWF1KVxuKiBAcGFyYW0gcHJpdmF0ZUFwaU9iaiB7T2JqZWN0fSAtIFRoZSBhbHJlYWR5IGNyZWF0ZWQgcHJpdmF0ZSBBUEkgb2JqZWN0ICh1c3VhbGx5IHdpbmRvdy5fdGFibGVhdSlcbiogQHBhcmFtIGdsb2JhbE9iaiB7T2JqZWN0fSAtIFRoZSBnbG9iYWwgb2JqZWN0IHRvIGF0dGFjaCB0aGluZ3MgdG8gKHVzdWFsbHkgd2luZG93KVxuKi9cbmZ1bmN0aW9uIFNoYXJlZCAodGFibGVhdUFwaU9iaiwgcHJpdmF0ZUFwaU9iaiwgZ2xvYmFsT2JqKSB7XG4gIHRoaXMucHJpdmF0ZUFwaU9iaiA9IHByaXZhdGVBcGlPYmo7XG4gIHRoaXMuZ2xvYmFsT2JqID0gZ2xvYmFsT2JqO1xuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gZmFsc2U7XG5cbiAgdGhpcy5jaGFuZ2VUYWJsZWF1QXBpT2JqKHRhYmxlYXVBcGlPYmopO1xufVxuXG5cblNoYXJlZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBzaGFyZWQgV0RDXCIpO1xuICB0aGlzLmdsb2JhbE9iai5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgaW52b2tlZCBieSB0aGUgbmF0aXZlIGNvZGVcbiAgdGhpcy5faW5pdFRyaWdnZXJGdW5jdGlvbnMoKTtcblxuICAvLyBBc3NpZ24gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb25zIHdoaWNoIGFyZW4ndCBhdmFpbGlibGUgaW4gdGhpcyB2ZXJzaW9uIG9mIHRoZSBBUElcbiAgdGhpcy5faW5pdERlcHJlY2F0ZWRGdW5jdGlvbnMoKTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5jaGFuZ2VUYWJsZWF1QXBpT2JqID0gZnVuY3Rpb24odGFibGVhdUFwaU9iaikge1xuICB0aGlzLnRhYmxlYXVBcGlPYmogPSB0YWJsZWF1QXBpT2JqO1xuXG4gIC8vIEFzc2lnbiBvdXIgbWFrZSAmIHJlZ2lzdGVyIGZ1bmN0aW9ucyByaWdodCBhd2F5IGJlY2F1c2UgYSBjb25uZWN0b3IgY2FuIHVzZVxuICAvLyB0aGVtIGltbWVkaWF0ZWx5LCBldmVuIGJlZm9yZSBib290c3RyYXBwaW5nIGhhcyBjb21wbGV0ZWRcbiAgdGhpcy50YWJsZWF1QXBpT2JqLm1ha2VDb25uZWN0b3IgPSB0aGlzLl9tYWtlQ29ubmVjdG9yLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5yZWdpc3RlckNvbm5lY3RvciA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdG9yLmJpbmQodGhpcyk7XG5cbiAgRW51bXMuYXBwbHkodGhpcy50YWJsZWF1QXBpT2JqKTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24obWVzc2FnZSwgZmlsZSwgbGluZSwgY29sdW1uLCBlcnJvck9iaikge1xuICBjb25zb2xlLmVycm9yKGVycm9yT2JqKTsgLy8gcHJpbnQgZXJyb3IgZm9yIGRlYnVnZ2luZyBpbiB0aGUgYnJvd3NlclxuICBpZiAodGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2Fpbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG1zZyA9IG1lc3NhZ2U7XG4gIGlmKGVycm9yT2JqKSB7XG4gICAgbXNnICs9IFwiICAgc3RhY2s6XCIgKyBlcnJvck9iai5zdGFjaztcbiAgfSBlbHNlIHtcbiAgICBtc2cgKz0gXCIgICBmaWxlOiBcIiArIGZpbGU7XG4gICAgbXNnICs9IFwiICAgbGluZTogXCIgKyBsaW5lO1xuICB9XG5cbiAgaWYgKHRoaXMudGFibGVhdUFwaU9iaiAmJiB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IpIHtcbiAgICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IobXNnKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBtc2c7XG4gIH1cblxuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gdHJ1ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX21ha2VDb25uZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmF1bHRJbXBscyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihjYikgeyBjYigpOyB9LFxuICAgIHNodXRkb3duOiBmdW5jdGlvbihjYikgeyBjYigpOyB9XG4gIH07XG5cbiAgcmV0dXJuIGRlZmF1bHRJbXBscztcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fcmVnaXN0ZXJDb25uZWN0b3IgPSBmdW5jdGlvbiAod2RjKSB7XG5cbiAgLy8gZG8gc29tZSBlcnJvciBjaGVja2luZyBvbiB0aGUgd2RjXG4gIHZhciBmdW5jdGlvbk5hbWVzID0gW1wiaW5pdFwiLCBcInNodXRkb3duXCIsIFwiZ2V0U2NoZW1hXCIsIFwiZ2V0RGF0YVwiXTtcbiAgZm9yICh2YXIgaWkgPSBmdW5jdGlvbk5hbWVzLmxlbmd0aCAtIDE7IGlpID49IDA7IGlpLS0pIHtcbiAgICBpZiAodHlwZW9mKHdkY1tmdW5jdGlvbk5hbWVzW2lpXV0pICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IFwiVGhlIGNvbm5lY3RvciBkaWQgbm90IGRlZmluZSB0aGUgcmVxdWlyZWQgZnVuY3Rpb246IFwiICsgZnVuY3Rpb25OYW1lc1tpaV07XG4gICAgfVxuICB9O1xuXG4gIGNvbnNvbGUubG9nKFwiQ29ubmVjdG9yIHJlZ2lzdGVyZWRcIik7XG5cbiAgdGhpcy5nbG9iYWxPYmouX3dkYyA9IHdkYztcbiAgdGhpcy5fd2RjID0gd2RjO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0VHJpZ2dlckZ1bmN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlckluaXRpYWxpemF0aW9uID0gdGhpcy5fdHJpZ2dlckluaXRpYWxpemF0aW9uLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZy5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlckRhdGFHYXRoZXJpbmcgPSB0aGlzLl90cmlnZ2VyRGF0YUdhdGhlcmluZy5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlclNodXRkb3duID0gdGhpcy5fdHJpZ2dlclNodXRkb3duLmJpbmQodGhpcyk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgV0RDXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VySW5pdGlhbGl6YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLmluaXQodGhpcy5wcml2YXRlQXBpT2JqLl9pbml0Q2FsbGJhY2spO1xufVxuXG4vLyBTdGFydHMgdGhlIHNjaGVtYSBnYXRoZXJpbmcgcHJvY2Vzc1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl93ZGMuZ2V0U2NoZW1hKHRoaXMucHJpdmF0ZUFwaU9iai5fc2NoZW1hQ2FsbGJhY2spO1xufVxuXG4vLyBTdGFydHMgdGhlIGRhdGEgZ2F0aGVyaW5nIHByb2Nlc3NcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJEYXRhR2F0aGVyaW5nID0gZnVuY3Rpb24odGFibGVzQW5kSW5jcmVtZW50VmFsdWVzKSB7XG4gIGlmICh0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoICE9IDEpIHtcbiAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIG51bWJlciBvZiB0YWJsZXMgc3BlY2lmaWVkLiBFeHBlY3RlZCAxLCBhY3R1YWwgXCIgKyB0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgdmFyIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZSA9IHRhYmxlc0FuZEluY3JlbWVudFZhbHVlc1swXTtcbiAgdmFyIGlzSm9pbkZpbHRlcmVkID0gISF0YWJsZUFuZEluY3JlbW50VmFsdWUuZmlsdGVyQ29sdW1uSWQ7XG4gIHZhciB0YWJsZSA9IG5ldyBUYWJsZShcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUudGFibGVJbmZvLCBcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUuaW5jcmVtZW50VmFsdWUsIFxuICAgIGlzSm9pbkZpbHRlcmVkLCBcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUuZmlsdGVyQ29sdW1uSWQgfHwgJycsIFxuICAgIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZS5maWx0ZXJWYWx1ZXMgfHwgW10sXG4gICAgdGhpcy5wcml2YXRlQXBpT2JqLl90YWJsZURhdGFDYWxsYmFjayk7XG5cbiAgdGhpcy5fd2RjLmdldERhdGEodGFibGUsIHRoaXMucHJpdmF0ZUFwaU9iai5fZGF0YURvbmVDYWxsYmFjayk7XG59XG5cbi8vIFRlbGxzIHRoZSBXREMgaXQncyB0aW1lIHRvIHNodXQgZG93blxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNodXRkb3duID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5zaHV0ZG93bih0aGlzLnByaXZhdGVBcGlPYmouX3NodXRkb3duQ2FsbGJhY2spO1xufVxuXG4vLyBJbml0aWFsaXplcyBhIHNlcmllcyBvZiBnbG9iYWwgY2FsbGJhY2tzIHdoaWNoIGhhdmUgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcblNoYXJlZC5wcm90b3R5cGUuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmhlYWRlcnNDYWxsYmFjayA9IHRoaXMuX2hlYWRlcnNDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouZGF0YUNhbGxiYWNrID0gdGhpcy5fZGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaW5pdENhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGluaXRcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9oZWFkZXJzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGROYW1lcywgdHlwZXMpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5oZWFkZXJzQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fZGF0YUNhbGxiYWNrID0gZnVuY3Rpb24gKGRhdGEsIGxhc3RSZWNvcmRUb2tlbiwgbW9yZURhdGEpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5kYXRhQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5zaHV0ZG93bkNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIHNodXRkb3duXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vU2hhcmVkLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIEFwcHJvdmVkT3JpZ2lucyA9IHJlcXVpcmUoJy4vQXBwcm92ZWRPcmlnaW5zLmpzJyk7XG5cbi8vIFJlcXVpcmVkIGZvciBJRSAmIEVkZ2Ugd2hpY2ggZG9uJ3Qgc3VwcG9ydCBlbmRzV2l0aFxucmVxdWlyZSgnU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCcpO1xuXG4vKiogQGNsYXNzIFVzZWQgZm9yIGNvbW11bmljYXRpbmcgYmV0d2VlbiB0aGUgc2ltdWxhdG9yIGFuZCB3ZWIgZGF0YSBjb25uZWN0b3IuIEl0IGRvZXNcbiogdGhpcyBieSBwYXNzaW5nIG1lc3NhZ2VzIGJldHdlZW4gdGhlIFdEQyB3aW5kb3cgYW5kIGl0cyBwYXJlbnQgd2luZG93XG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSB0aGUgZ2xvYmFsIG9iamVjdCB0byBmaW5kIHRhYmxlYXUgaW50ZXJmYWNlcyBhcyB3ZWxsXG4qIGFzIHJlZ2lzdGVyIGV2ZW50cyAodXN1YWxseSB3aW5kb3cpXG4qL1xuZnVuY3Rpb24gU2ltdWxhdG9yRGlzcGF0Y2hlciAoZ2xvYmFsT2JqKSB7XG4gIHRoaXMuZ2xvYmFsT2JqID0gZ2xvYmFsT2JqO1xuICB0aGlzLl9pbml0TWVzc2FnZUhhbmRsaW5nKCk7XG4gIHRoaXMuX2luaXRQdWJsaWNJbnRlcmZhY2UoKTtcbiAgdGhpcy5faW5pdFByaXZhdGVJbnRlcmZhY2UoKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRNZXNzYWdlSGFuZGxpbmcgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgbWVzc2FnZSBoYW5kbGluZ1wiKTtcbiAgdGhpcy5nbG9iYWxPYmouYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX3JlY2VpdmVNZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy5nbG9iYWxPYmouZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgdGhpcy5fb25Eb21Db250ZW50TG9hZGVkLmJpbmQodGhpcykpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fb25Eb21Db250ZW50TG9hZGVkID0gZnVuY3Rpb24oKSB7XG4gIC8vIEF0dGVtcHQgdG8gbm90aWZ5IHRoZSBzaW11bGF0b3Igd2luZG93IHRoYXQgdGhlIFdEQyBoYXMgbG9hZGVkXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLnBhcmVudCAhPT0gd2luZG93KSB7XG4gICAgdGhpcy5nbG9iYWxPYmoucGFyZW50LnBvc3RNZXNzYWdlKHRoaXMuX2J1aWxkTWVzc2FnZVBheWxvYWQoJ2xvYWRlZCcpLCAnKicpO1xuICB9XG5cbiAgaWYodGhpcy5nbG9iYWxPYmoub3BlbmVyKSB7XG4gICAgdHJ5IHsgLy8gV3JhcCBpbiB0cnkvY2F0Y2ggZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFXG4gICAgICB0aGlzLmdsb2JhbE9iai5vcGVuZXIucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NvbWUgdmVyc2lvbnMgb2YgSUUgbWF5IG5vdCBhY2N1cmF0ZWx5IHNpbXVsYXRlIHRoZSBXZWIgRGF0YSBDb25uZWN0b3IuIFBsZWFzZSByZXRyeSBvbiBhIFdlYmtpdCBiYXNlZCBicm93c2VyJyk7XG4gICAgfVxuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByb3BWYWx1ZXMgPSB7XG4gICAgXCJjb25uZWN0aW9uTmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25OYW1lLFxuICAgIFwiY29ubmVjdGlvbkRhdGFcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uRGF0YSxcbiAgICBcInBhc3N3b3JkXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQsXG4gICAgXCJ1c2VybmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lLFxuICAgIFwidXNlcm5hbWVBbGlhc1wiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lQWxpYXMsXG4gICAgXCJpbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW5cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4sXG4gICAgXCJ2ZXJzaW9uTnVtYmVyXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudmVyc2lvbk51bWJlcixcbiAgICBcImxvY2FsZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmxvY2FsZSxcbiAgICBcImF1dGhQdXJwb3NlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UsXG4gICAgXCJwbGF0Zm9ybU9TXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyxcbiAgICBcInBsYXRmb3JtVmVyc2lvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbixcbiAgICBcInBsYXRmb3JtRWRpdGlvblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbixcbiAgICBcInBsYXRmb3JtQnVpbGROdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyXG4gIH07XG5cbiAgcmV0dXJuIHByb3BWYWx1ZXM7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hcHBseVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgaWYgKHByb3BzKSB7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uTmFtZSA9IHByb3BzLmNvbm5lY3Rpb25OYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEgPSBwcm9wcy5jb25uZWN0aW9uRGF0YTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkID0gcHJvcHMucGFzc3dvcmQ7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZSA9IHByb3BzLnVzZXJuYW1lO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyA9IHByb3BzLnVzZXJuYW1lQWxpYXM7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW4gPSBwcm9wcy5pbmNyZW1lbnRhbEV4dHJhY3RDb2x1bW47XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sb2NhbGUgPSBwcm9wcy5sb2NhbGU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sYW5ndWFnZSA9IHByb3BzLmxvY2FsZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmF1dGhQdXJwb3NlID0gcHJvcHMuYXV0aFB1cnBvc2U7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TID0gcHJvcHMucGxhdGZvcm1PUztcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbiA9IHByb3BzLnBsYXRmb3JtVmVyc2lvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtRWRpdGlvbiA9IHByb3BzLnBsYXRmb3JtRWRpdGlvbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXIgPSBwcm9wcy5wbGF0Zm9ybUJ1aWxkTnVtYmVyO1xuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9idWlsZE1lc3NhZ2VQYXlsb2FkID0gZnVuY3Rpb24obXNnTmFtZSwgbXNnRGF0YSwgcHJvcHMpIHtcbiAgdmFyIG1zZ09iaiA9IHtcIm1zZ05hbWVcIjogbXNnTmFtZSwgXCJtc2dEYXRhXCI6IG1zZ0RhdGEsIFwicHJvcHNcIjogcHJvcHMsIFwidmVyc2lvblwiOiBCVUlMRF9OVU1CRVIgfTtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG1zZ09iaik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKG1zZ05hbWUsIG1zZ0RhdGEpIHtcbiAgdmFyIG1lc3NhZ2VQYXlsb2FkID0gdGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZChtc2dOYW1lLCBtc2dEYXRhLCB0aGlzLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMoKSk7XG5cbiAgLy8gQ2hlY2sgZmlyc3QgdG8gc2VlIGlmIHdlIGhhdmUgYSBtZXNzYWdlSGFuZGxlciBkZWZpbmVkIHRvIHBvc3QgdGhlIG1lc3NhZ2UgdG9cbiAgaWYgKHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQgIT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycyAhPSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQpO1xuICB9IGVsc2UgaWYgKCF0aGlzLl9zb3VyY2VXaW5kb3cpIHtcbiAgICB0aHJvdyBcIkxvb2tzIGxpa2UgdGhlIFdEQyBpcyBjYWxsaW5nIGEgdGFibGVhdSBmdW5jdGlvbiBiZWZvcmUgdGFibGVhdS5pbml0KCkgaGFzIGJlZW4gY2FsbGVkLlwiXG4gIH0gZWxzZSB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcG9zdCB0aGlzIGluZm8gYmFjayB0byB0aGUgc291cmNlIG9yaWdpbiB0aGUgdXNlciBhcHByb3ZlZCBpbiBfZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybVxuICAgIHRoaXMuX3NvdXJjZVdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlUGF5bG9hZCwgdGhpcy5fc291cmNlT3JpZ2luKTtcbiAgfVxufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0UGF5bG9hZE9iaiA9IGZ1bmN0aW9uKHBheWxvYWRTdHJpbmcpIHtcbiAgdmFyIHBheWxvYWQgPSBudWxsO1xuICB0cnkge1xuICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKHBheWxvYWRTdHJpbmcpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBwYXlsb2FkO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybSA9IGZ1bmN0aW9uKCkge1xuICAvLyBEdWUgdG8gY3Jvc3Mtb3JpZ2luIHNlY3VyaXR5IGlzc3VlcyBvdmVyIGh0dHBzLCB3ZSBtYXkgbm90IGJlIGFibGUgdG8gcmV0cmlldmUgX3NvdXJjZVdpbmRvdy5cbiAgLy8gVXNlIHNvdXJjZU9yaWdpbiBpbnN0ZWFkLlxuICB2YXIgb3JpZ2luID0gdGhpcy5fc291cmNlT3JpZ2luO1xuXG4gIHZhciBVcmkgPSByZXF1aXJlKCdqc3VyaScpO1xuICB2YXIgcGFyc2VkT3JpZ2luID0gbmV3IFVyaShvcmlnaW4pO1xuICB2YXIgaG9zdE5hbWUgPSBwYXJzZWRPcmlnaW4uaG9zdCgpO1xuXG4gIHZhciBzdXBwb3J0ZWRIb3N0cyA9IFtcImxvY2FsaG9zdFwiLCBcInRhYmxlYXUuZ2l0aHViLmlvXCJdO1xuICBpZiAoc3VwcG9ydGVkSG9zdHMuaW5kZXhPZihob3N0TmFtZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBXaGl0ZWxpc3QgVGFibGVhdSBkb21haW5zXG4gIGlmIChob3N0TmFtZSAmJiBob3N0TmFtZS5lbmRzV2l0aChcIm9ubGluZS50YWJsZWF1LmNvbVwiKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgYWxyZWFkeUFwcHJvdmVkT3JpZ2lucyA9IEFwcHJvdmVkT3JpZ2lucy5nZXRBcHByb3ZlZE9yaWdpbnMoKTtcbiAgaWYgKGFscmVhZHlBcHByb3ZlZE9yaWdpbnMuaW5kZXhPZihvcmlnaW4pID49IDApIHtcbiAgICAvLyBUaGUgdXNlciBoYXMgYWxyZWFkeSBhcHByb3ZlZCB0aGlzIG9yaWdpbiwgbm8gbmVlZCB0byBhc2sgYWdhaW5cbiAgICBjb25zb2xlLmxvZyhcIkFscmVhZHkgYXBwcm92ZWQgdGhlIG9yaWdpbidcIiArIG9yaWdpbiArIFwiJywgbm90IGFza2luZyBhZ2FpblwiKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBsb2NhbGl6ZWRXYXJuaW5nVGl0bGUgPSB0aGlzLl9nZXRMb2NhbGl6ZWRTdHJpbmcoXCJ3ZWJTZWN1cml0eVdhcm5pbmdcIik7XG4gIHZhciBjb21wbGV0ZVdhcm5pbmdNc2cgID0gbG9jYWxpemVkV2FybmluZ1RpdGxlICsgXCJcXG5cXG5cIiArIGhvc3ROYW1lICsgXCJcXG5cIjtcbiAgdmFyIGlzQ29uZmlybWVkID0gY29uZmlybShjb21wbGV0ZVdhcm5pbmdNc2cpO1xuXG4gIGlmIChpc0NvbmZpcm1lZCkge1xuICAgIC8vIFNldCBhIHNlc3Npb24gY29va2llIHRvIG1hcmsgdGhhdCB3ZSd2ZSBhcHByb3ZlZCB0aGlzIGFscmVhZHlcbiAgICBBcHByb3ZlZE9yaWdpbnMuYWRkQXBwcm92ZWRPcmlnaW4ob3JpZ2luKTtcbiAgfVxuXG4gIHJldHVybiBpc0NvbmZpcm1lZDtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldEN1cnJlbnRMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBVc2UgY3VycmVudCBicm93c2VyJ3MgbG9jYWxlIHRvIGdldCBhIGxvY2FsaXplZCB3YXJuaW5nIG1lc3NhZ2VcbiAgICB2YXIgY3VycmVudEJyb3dzZXJMYW5ndWFnZSA9IChuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZSk7XG4gICAgdmFyIGxvY2FsZSA9IGN1cnJlbnRCcm93c2VyTGFuZ3VhZ2U/IGN1cnJlbnRCcm93c2VyTGFuZ3VhZ2Uuc3Vic3RyaW5nKDAsIDIpOiBcImVuXCI7XG5cbiAgICB2YXIgc3VwcG9ydGVkTG9jYWxlcyA9IFtcImRlXCIsIFwiZW5cIiwgXCJlc1wiLCBcImZyXCIsIFwiamFcIiwgXCJrb1wiLCBcInB0XCIsIFwiemhcIl07XG4gICAgLy8gRmFsbCBiYWNrIHRvIEVuZ2xpc2ggZm9yIG90aGVyIHVuc3VwcG9ydGVkIGxhbmFndWFnZXNcbiAgICBpZiAoc3VwcG9ydGVkTG9jYWxlcy5pbmRleE9mKGxvY2FsZSkgPCAwKSB7XG4gICAgICAgIGxvY2FsZSA9ICdlbic7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvY2FsZTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldExvY2FsaXplZFN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZ0tleSkge1xuICAgIHZhciBsb2NhbGUgPSB0aGlzLl9nZXRDdXJyZW50TG9jYWxlKCk7XG5cbiAgICAvLyBVc2Ugc3RhdGljIHJlcXVpcmUgaGVyZSwgb3RoZXJ3aXNlIHdlYnBhY2sgd291bGQgZ2VuZXJhdGUgYSBtdWNoIGJpZ2dlciBKUyBmaWxlXG4gICAgdmFyIGRlU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb24nKTtcbiAgICB2YXIgZW5TdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZW4tVVMuanNvbicpO1xuICAgIHZhciBlc1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uJyk7XG4gICAgdmFyIGphU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24nKTtcbiAgICB2YXIgZnJTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbicpO1xuICAgIHZhciBrb1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uJyk7XG4gICAgdmFyIHB0U3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb24nKTtcbiAgICB2YXIgemhTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfemgtQ04uanNvbicpO1xuXG4gICAgdmFyIHN0cmluZ0pzb25NYXBCeUxvY2FsZSA9XG4gICAge1xuICAgICAgICBcImRlXCI6IGRlU3RyaW5nc01hcCxcbiAgICAgICAgXCJlblwiOiBlblN0cmluZ3NNYXAsXG4gICAgICAgIFwiZXNcIjogZXNTdHJpbmdzTWFwLFxuICAgICAgICBcImZyXCI6IGZyU3RyaW5nc01hcCxcbiAgICAgICAgXCJqYVwiOiBqYVN0cmluZ3NNYXAsXG4gICAgICAgIFwia29cIjoga29TdHJpbmdzTWFwLFxuICAgICAgICBcInB0XCI6IHB0U3RyaW5nc01hcCxcbiAgICAgICAgXCJ6aFwiOiB6aFN0cmluZ3NNYXBcbiAgICB9O1xuXG4gICAgdmFyIGxvY2FsaXplZFN0cmluZ3NKc29uID0gc3RyaW5nSnNvbk1hcEJ5TG9jYWxlW2xvY2FsZV07XG4gICAgcmV0dXJuIGxvY2FsaXplZFN0cmluZ3NKc29uW3N0cmluZ0tleV07XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIG1lc3NhZ2UhXCIpO1xuXG4gIHZhciB3ZGMgPSB0aGlzLmdsb2JhbE9iai5fd2RjO1xuICBpZiAoIXdkYykge1xuICAgIHRocm93IFwiTm8gV0RDIHJlZ2lzdGVyZWQuIERpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgdGFibGVhdS5yZWdpc3RlckNvbm5lY3Rvcj9cIjtcbiAgfVxuXG4gIHZhciBwYXlsb2FkT2JqID0gdGhpcy5fZ2V0UGF5bG9hZE9iaihldnQuZGF0YSk7XG4gIGlmKCFwYXlsb2FkT2JqKSByZXR1cm47IC8vIFRoaXMgbWVzc2FnZSBpcyBub3QgbmVlZGVkIGZvciBXRENcblxuICBpZiAoIXRoaXMuX3NvdXJjZVdpbmRvdykge1xuICAgIHRoaXMuX3NvdXJjZVdpbmRvdyA9IGV2dC5zb3VyY2U7XG4gICAgdGhpcy5fc291cmNlT3JpZ2luID0gZXZ0Lm9yaWdpbjtcbiAgfVxuXG4gIHZhciBtc2dEYXRhID0gcGF5bG9hZE9iai5tc2dEYXRhO1xuICB0aGlzLl9hcHBseVByb3BlcnR5VmFsdWVzKHBheWxvYWRPYmoucHJvcHMpO1xuXG4gIHN3aXRjaChwYXlsb2FkT2JqLm1zZ05hbWUpIHtcbiAgICBjYXNlIFwiaW5pdFwiOlxuICAgICAgLy8gV2FybiB1c2VycyBhYm91dCBwb3NzaWJsZSBwaGluaXNoaW5nIGF0dGFja3NcbiAgICAgIHZhciBjb25maXJtUmVzdWx0ID0gdGhpcy5fZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybSgpO1xuICAgICAgaWYgKCFjb25maXJtUmVzdWx0KSB7XG4gICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5waGFzZSA9IG1zZ0RhdGEucGhhc2U7XG4gICAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJJbml0aWFsaXphdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic2h1dGRvd25cIjpcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJTaHV0ZG93bigpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImdldFNjaGVtYVwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNjaGVtYUdhdGhlcmluZygpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImdldERhdGFcIjpcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl90YWJsZWF1LnRyaWdnZXJEYXRhR2F0aGVyaW5nKG1zZ0RhdGEudGFibGVzQW5kSW5jcmVtZW50VmFsdWVzKTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG4vKioqKiBQVUJMSUMgSU5URVJGQUNFICoqKioqL1xuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQdWJsaWNJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZVwiKTtcbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRGb3JBdXRoID0gdGhpcy5fYWJvcnRGb3JBdXRoLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydFdpdGhFcnJvciA9IHRoaXMuX2Fib3J0V2l0aEVycm9yLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5sb2cgPSB0aGlzLl9sb2cuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnJlcG9ydFByb2dyZXNzID0gdGhpcy5fcmVwb3J0UHJvZ3Jlc3MuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnN1Ym1pdCA9IHRoaXMuX3N1Ym1pdC5iaW5kKHRoaXMpO1xuXG4gIC8vIEFzc2lnbiB0aGUgcHVibGljIGludGVyZmFjZSB0byB0aGlzXG4gIHRoaXMucHVibGljSW50ZXJmYWNlID0gcHVibGljSW50ZXJmYWNlO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRGb3JBdXRoID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiYWJvcnRGb3JBdXRoXCIsIHtcIm1zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0V2l0aEVycm9yID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiYWJvcnRXaXRoRXJyb3JcIiwge1wiZXJyb3JNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XG4gIC8vIERvbid0IGJvdGhlciBwYXNzaW5nIHRoaXMgYmFjayB0byB0aGUgc2ltdWxhdG9yIHNpbmNlIHRoZXJlJ3Mgbm90aGluZyBpdCBjYW5cbiAgLy8gZG8uIEp1c3QgY2FsbCBiYWNrIHRvIHRoZSBXREMgaW5kaWNhdGluZyB0aGF0IGl0IHdvcmtlZFxuICBjb25zb2xlLmxvZyhcIkNyb3NzIE9yaWdpbiBFeGNlcHRpb24gcmVxdWVzdGVkIGluIHRoZSBzaW11bGF0b3IuIFByZXRlbmRpbmcgdG8gd29yay5cIilcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdsb2JhbE9iai5fd2RjLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uQ29tcGxldGVkKGRlc3RPcmlnaW5MaXN0KTtcbiAgfS5iaW5kKHRoaXMpLCAwKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImxvZ1wiLCB7XCJsb2dNc2dcIjogbXNnfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9yZXBvcnRQcm9ncmVzcyA9IGZ1bmN0aW9uKG1zZykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcInJlcG9ydFByb2dyZXNzXCIsIHtcInByb2dyZXNzTXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic3VibWl0XCIpO1xufTtcblxuLyoqKiogUFJJVkFURSBJTlRFUkZBQ0UgKioqKiovXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFByaXZhdGVJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHJpdmF0ZSBpbnRlcmZhY2VcIik7XG5cbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcbiAgcHJpdmF0ZUludGVyZmFjZS5faW5pdENhbGxiYWNrID0gdGhpcy5faW5pdENhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fdGFibGVEYXRhQ2FsbGJhY2sgPSB0aGlzLl90YWJsZURhdGFDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9kYXRhRG9uZUNhbGxiYWNrID0gdGhpcy5fZGF0YURvbmVDYWxsYmFjay5iaW5kKHRoaXMpO1xuXG4gIC8vIEFzc2lnbiB0aGUgcHJpdmF0ZSBpbnRlcmZhY2UgdG8gdGhpc1xuICB0aGlzLnByaXZhdGVJbnRlcmZhY2UgPSBwcml2YXRlSW50ZXJmYWNlO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiaW5pdENhbGxiYWNrXCIpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcInNodXRkb3duQ2FsbGJhY2tcIik7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zY2hlbWFDYWxsYmFjayA9IGZ1bmN0aW9uKHNjaGVtYSwgc3RhbmRhcmRDb25uZWN0aW9ucykge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9zY2hlbWFDYWxsYmFja1wiLCB7XCJzY2hlbWFcIjogc2NoZW1hLCBcInN0YW5kYXJkQ29ubmVjdGlvbnNcIiA6IHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW119KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3RhYmxlRGF0YUNhbGxiYWNrID0gZnVuY3Rpb24odGFibGVOYW1lLCBkYXRhKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX3RhYmxlRGF0YUNhbGxiYWNrXCIsIHsgXCJ0YWJsZU5hbWVcIjogdGFibGVOYW1lLCBcImRhdGFcIjogZGF0YSB9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfZGF0YURvbmVDYWxsYmFja1wiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaW11bGF0b3JEaXNwYXRjaGVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL1NpbXVsYXRvckRpc3BhdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiogQGNsYXNzIFJlcHJlc2VudHMgYSBzaW5nbGUgdGFibGUgd2hpY2ggVGFibGVhdSBoYXMgcmVxdWVzdGVkXG4qIEBwYXJhbSB0YWJsZUluZm8ge09iamVjdH0gLSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGVcbiogQHBhcmFtIGluY3JlbWVudFZhbHVlIHtzdHJpbmc9fSAtIEluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZVxuKi9cbmZ1bmN0aW9uIFRhYmxlKHRhYmxlSW5mbywgaW5jcmVtZW50VmFsdWUsIGlzSm9pbkZpbHRlcmVkLCBmaWx0ZXJDb2x1bW5JZCwgZmlsdGVyVmFsdWVzLCBkYXRhQ2FsbGJhY2tGbikge1xuICAvKiogQG1lbWJlciB7T2JqZWN0fSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGUgd2hpY2ggaGFzIGJlZW4gcmVxdWVzdGVkLiBUaGlzIGlzXG4gIGd1YXJhbnRlZWQgdG8gYmUgb25lIG9mIHRoZSB0YWJsZXMgdGhlIGNvbm5lY3RvciByZXR1cm5lZCBpbiB0aGUgY2FsbCB0byBnZXRTY2hlbWEuICovXG4gIHRoaXMudGFibGVJbmZvID0gdGFibGVJbmZvO1xuXG4gIC8qKiBAbWVtYmVyIHtzdHJpbmd9IERlZmluZXMgdGhlIGluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZSBmb3IgdGhpcyB0YWJsZS4gRW1wdHkgc3RyaW5nIGlmXG4gIHRoZXJlIGlzIG5vdCBhbiBpbmNyZW1lbnRhbCB1cGRhdGUgcmVxdWVzdGVkLiAqL1xuICB0aGlzLmluY3JlbWVudFZhbHVlID0gaW5jcmVtZW50VmFsdWUgfHwgXCJcIjtcblxuICAvKiogQG1lbWJlciB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhpcyB0YWJsZSBpcyBtZWFudCB0byBiZSBmaWx0ZXJlZCB1c2luZyBmaWx0ZXJWYWx1ZXMuICovXG4gIHRoaXMuaXNKb2luRmlsdGVyZWQgPSBpc0pvaW5GaWx0ZXJlZDtcblxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBJZiB0aGlzIHRhYmxlIGlzIGZpbHRlcmVkLCB0aGlzIGlzIHRoZSBjb2x1bW4gd2hlcmUgdGhlIGZpbHRlciB2YWx1ZXNcbiAgICogc2hvdWxkIGJlIGZvdW5kLiAqL1xuICB0aGlzLmZpbHRlckNvbHVtbklkID0gZmlsdGVyQ29sdW1uSWQ7XG5cbiAgLyoqIEBtZW1iZXIge2FycmF5fSBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIHNwZWNpZmllcyB0aGUgdmFsdWVzIHdlIHdhbnQgdG8gcmV0cmlldmUuIEZvclxuICAgKiBleGFtcGxlLCBpZiBhbiBJRCBjb2x1bW4gd2FzIHRoZSBmaWx0ZXIgY29sdW1uLCB0aGlzIHdvdWxkIGJlIGEgY29sbGVjdGlvbiBvZiBJRHMgdG8gcmV0cmlldmUuICovXG4gIHRoaXMuZmlsdGVyVmFsdWVzID0gZmlsdGVyVmFsdWVzO1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICB0aGlzLl9kYXRhQ2FsbGJhY2tGbiA9IGRhdGFDYWxsYmFja0ZuO1xuXG4gIC8vIGJpbmQgdGhlIHB1YmxpYyBmYWNpbmcgdmVyc2lvbiBvZiB0aGlzIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBwYXNzZWQgYXJvdW5kXG4gIHRoaXMuYXBwZW5kUm93cyA9IHRoaXMuX2FwcGVuZFJvd3MuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4qIEBtZXRob2QgYXBwZW5kcyB0aGUgZ2l2ZW4gcm93cyB0byB0aGUgc2V0IG9mIGRhdGEgY29udGFpbmVkIGluIHRoaXMgdGFibGVcbiogQHBhcmFtIGRhdGEge2FycmF5fSAtIEVpdGhlciBhbiBhcnJheSBvZiBhcnJheXMgb3IgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCByZXByZXNlbnRcbiogdGhlIGluZGl2aWR1YWwgcm93cyBvZiBkYXRhIHRvIGFwcGVuZCB0byB0aGlzIHRhYmxlXG4qL1xuVGFibGUucHJvdG90eXBlLl9hcHBlbmRSb3dzID0gZnVuY3Rpb24oZGF0YSkge1xuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcbiAgaWYgKCFkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKFwicm93cyBkYXRhIGlzIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxuICAgIGNvbnNvbGUud2FybihcIlRhYmxlLmFwcGVuZFJvd3MgbXVzdCB0YWtlIGFuIGFycmF5IG9mIGFycmF5cyBvciBhcnJheSBvZiBvYmplY3RzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9UYWJsZS5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImZ1bmN0aW9uIGNvcHlGdW5jdGlvbnMoc3JjLCBkZXN0KSB7XG4gIGZvcih2YXIga2V5IGluIHNyYykge1xuICAgIGlmICh0eXBlb2Ygc3JjW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb3B5RnVuY3Rpb25zID0gY29weUZ1bmN0aW9ucztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9VdGlsaXRpZXMuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiEgaHR0cDovL210aHMuYmUvZW5kc3dpdGggdjAuMi4wIGJ5IEBtYXRoaWFzICovXG5pZiAoIVN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgpIHtcblx0KGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0JzsgLy8gbmVlZGVkIHRvIHN1cHBvcnQgYGFwcGx5YC9gY2FsbGAgd2l0aCBgdW5kZWZpbmVkYC9gbnVsbGBcblx0XHR2YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBJRSA4IG9ubHkgc3VwcG9ydHMgYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgb24gRE9NIGVsZW1lbnRzXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YXIgb2JqZWN0ID0ge307XG5cdFx0XHRcdHZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBvYmplY3QsIG9iamVjdCkgJiYgJGRlZmluZVByb3BlcnR5O1xuXHRcdFx0fSBjYXRjaChlcnJvcikge31cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSgpKTtcblx0XHR2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblx0XHR2YXIgZW5kc1dpdGggPSBmdW5jdGlvbihzZWFyY2gpIHtcblx0XHRcdGlmICh0aGlzID09IG51bGwpIHtcblx0XHRcdFx0dGhyb3cgVHlwZUVycm9yKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuXHRcdFx0aWYgKHNlYXJjaCAmJiB0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcblx0XHRcdFx0dGhyb3cgVHlwZUVycm9yKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcblx0XHRcdHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcblx0XHRcdHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuXHRcdFx0dmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHR2YXIgcG9zaXRpb24gPSBhcmd1bWVudHNbMV07XG5cdFx0XHRcdGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Ly8gYFRvSW50ZWdlcmBcblx0XHRcdFx0XHRwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuXHRcdFx0XHRcdGlmIChwb3MgIT0gcG9zKSB7IC8vIGJldHRlciBgaXNOYU5gXG5cdFx0XHRcdFx0XHRwb3MgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dmFyIGVuZCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG5cdFx0XHR2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG5cdFx0XHRpZiAoc3RhcnQgPCAwKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0d2hpbGUgKCsraW5kZXggPCBzZWFyY2hMZW5ndGgpIHtcblx0XHRcdFx0aWYgKHN0cmluZy5jaGFyQ29kZUF0KHN0YXJ0ICsgaW5kZXgpICE9IHNlYXJjaFN0cmluZy5jaGFyQ29kZUF0KGluZGV4KSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblx0XHRpZiAoZGVmaW5lUHJvcGVydHkpIHtcblx0XHRcdGRlZmluZVByb3BlcnR5KFN0cmluZy5wcm90b3R5cGUsICdlbmRzV2l0aCcsIHtcblx0XHRcdFx0J3ZhbHVlJzogZW5kc1dpdGgsXG5cdFx0XHRcdCdjb25maWd1cmFibGUnOiB0cnVlLFxuXHRcdFx0XHQnd3JpdGFibGUnOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0U3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aCA9IGVuZHNXaXRoO1xuXHRcdH1cblx0fSgpKTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L1N0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgvZW5kc3dpdGguanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiBDb29raWVzLmpzIC0gMS4yLjNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1Njb3R0SGFtcGVyL0Nvb2tpZXNcclxuICpcclxuICogVGhpcyBpcyBmcmVlIGFuZCB1bmVuY3VtYmVyZWQgc29mdHdhcmUgcmVsZWFzZWQgaW50byB0aGUgcHVibGljIGRvbWFpbi5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVzLmpzIHJlcXVpcmVzIGEgYHdpbmRvd2Agd2l0aCBhIGBkb2N1bWVudGAgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQ29va2llcyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cclxuICAgICAgICAgICAgICAgIENvb2tpZXMuZ2V0KGtleSkgOiBDb29raWVzLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xyXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAvLyBVc2VkIHRvIGVuc3VyZSBjb29raWUga2V5cyBkbyBub3QgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgLy8gYnVpbHQtaW4gYE9iamVjdGAgcHJvcGVydGllc1xyXG4gICAgICAgIENvb2tpZXMuX2NhY2hlS2V5UHJlZml4ID0gJ2Nvb2tleS4nOyAvLyBIdXJyIGh1cnIsIDopXHJcbiAgICAgICAgXHJcbiAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCdGcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IFVUQycpO1xyXG5cclxuICAgICAgICBDb29raWVzLmRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBwYXRoOiAnLycsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKENvb2tpZXMuX2NhY2hlZERvY3VtZW50Q29va2llICE9PSBDb29raWVzLl9kb2N1bWVudC5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuX3JlbmV3Q2FjaGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gQ29va2llcy5fY2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBrZXldO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcclxuXHJcbiAgICAgICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcclxuICAgICAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9pc1ZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAhaXNOYU4oZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xyXG4gICAgICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXMgPSBleHBpcmVzID09PSBJbmZpbml0eSA/XHJcbiAgICAgICAgICAgICAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA6IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChleHBpcmVzICYmICFDb29raWVzLl9pc1ZhbGlkRGF0ZShleHBpcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZXhwaXJlc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBEYXRlIGluc3RhbmNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teIyQmK1xcXmB8XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFwoL2csICclMjgnKS5yZXBsYWNlKC9cXCkvZywgJyUyOScpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSArICcnKS5yZXBsYWNlKC9bXiEjJCYtK1xcLS06PC1cXFtcXF0tfl0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgICAgICB2YXIgY29va2llU3RyaW5nID0ga2V5ICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnBhdGggPyAnO3BhdGg9JyArIG9wdGlvbnMucGF0aCA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5kb21haW4gPyAnO2RvbWFpbj0nICsgb3B0aW9ucy5kb21haW4gOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZXhwaXJlcyA/ICc7ZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuc2VjdXJlID8gJztzZWN1cmUnIDogJyc7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llU3RyaW5nO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyA9IGZ1bmN0aW9uIChkb2N1bWVudENvb2tpZSkge1xyXG4gICAgICAgICAgICB2YXIgY29va2llQ2FjaGUgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXNBcnJheSA9IGRvY3VtZW50Q29va2llID8gZG9jdW1lbnRDb29raWUuc3BsaXQoJzsgJykgOiBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29va2llS3ZwID0gQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyhjb29raWVzQXJyYXlbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID0gY29va2llS3ZwLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llQ2FjaGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChjb29raWVTdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8gXCI9XCIgaXMgYSB2YWxpZCBjaGFyYWN0ZXIgaW4gYSBjb29raWUgdmFsdWUgYWNjb3JkaW5nIHRvIFJGQzYyNjUsIHNvIGNhbm5vdCBgc3BsaXQoJz0nKWBcclxuICAgICAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gY29va2llU3RyaW5nLmluZGV4T2YoJz0nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElFIG9taXRzIHRoZSBcIj1cIiB3aGVuIHRoZSBjb29raWUgdmFsdWUgaXMgYW4gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgICAgIHNlcGFyYXRvckluZGV4ID0gc2VwYXJhdG9ySW5kZXggPCAwID8gY29va2llU3RyaW5nLmxlbmd0aCA6IHNlcGFyYXRvckluZGV4O1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleSA9IGNvb2tpZVN0cmluZy5zdWJzdHIoMCwgc2VwYXJhdG9ySW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgZGVjb2RlZEtleTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRlY29kZWRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgZGVjb2RlIGNvb2tpZSB3aXRoIGtleSBcIicgKyBrZXkgKyAnXCInLCBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGtleTogZGVjb2RlZEtleSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkgLy8gRGVmZXIgZGVjb2RpbmcgdmFsdWUgdW50aWwgYWNjZXNzZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9hcmVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVzdEtleSA9ICdjb29raWVzLmpzJztcclxuICAgICAgICAgICAgdmFyIGFyZUVuYWJsZWQgPSBDb29raWVzLnNldCh0ZXN0S2V5LCAxKS5nZXQodGVzdEtleSkgPT09ICcxJztcclxuICAgICAgICAgICAgQ29va2llcy5leHBpcmUodGVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmVFbmFibGVkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNvb2tpZXNFeHBvcnQgPSAoZ2xvYmFsICYmIHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnKSA/IGZhY3RvcnkoZ2xvYmFsKSA6IGZhY3Rvcnk7XHJcblxyXG4gICAgLy8gQU1EIHN1cHBvcnRcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29va2llc0V4cG9ydDsgfSk7XHJcbiAgICAvLyBDb21tb25KUy9Ob2RlLmpzIHN1cHBvcnRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBOb2RlLmpzIHNwZWNpZmljIGBtb2R1bGUuZXhwb3J0c2AgKHdoaWNoIGNhbiBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEJ1dCBhbHdheXMgc3VwcG9ydCBDb21tb25KUyBtb2R1bGUgMS4xLjEgc3BlYyAoYGV4cG9ydHNgIGNhbm5vdCBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGV4cG9ydHMuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdsb2JhbC5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH1cclxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93KTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jb29raWVzLWpzL2Rpc3QvY29va2llcy5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvblxuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvblxuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvblxuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJ3d1RvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfemgtQ04uanNvblxuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiFcbiAqIGpzVXJpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGVyZWstd2F0c29uL2pzVXJpXG4gKlxuICogQ29weXJpZ2h0IDIwMTMsIERlcmVrIFdhdHNvblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqIEluY2x1ZGVzIHBhcnNlVXJpIHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAqIGh0dHA6Ly9ibG9nLnN0ZXZlbmxldml0aGFuLmNvbS9hcmNoaXZlcy9wYXJzZXVyaVxuICogQ29weXJpZ2h0IDIwMDcsIFN0ZXZlbiBMZXZpdGhhblxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbiAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuXG4gIHZhciByZSA9IHtcbiAgICBzdGFydHNfd2l0aF9zbGFzaGVzOiAvXlxcLysvLFxuICAgIGVuZHNfd2l0aF9zbGFzaGVzOiAvXFwvKyQvLFxuICAgIHBsdXNlczogL1xcKy9nLFxuICAgIHF1ZXJ5X3NlcGFyYXRvcjogL1smO10vLFxuICAgIHVyaV9wYXJzZXI6IC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QFxcL10qKSg/OjooW146QF0qKSk/KT9AKT8oXFxbWzAtOWEtZkEtRjouXStcXF18W146XFwvPyNdKikoPzo6KFxcZCt8KD89OikpKT8oOik/KSgoKCg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS9cbiAgfTtcblxuICAvKipcbiAgICogRGVmaW5lIGZvckVhY2ggZm9yIG9sZGVyIGpzIGVudmlyb25tZW50c1xuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaCNDb21wYXRpYmlsaXR5XG4gICAqL1xuICBpZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIFQsIGs7XG5cbiAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignIHRoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBUID0gdGhpc0FyZztcbiAgICAgIH1cblxuICAgICAgayA9IDA7XG5cbiAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgIHZhciBrVmFsdWU7XG4gICAgICAgIGlmIChrIGluIE8pIHtcbiAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcbiAgICAgICAgfVxuICAgICAgICBrKys7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1bmVzY2FwZSBhIHF1ZXJ5IHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gcyBlbmNvZGVkIHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICBkZWNvZGVkIHZhbHVlXG4gICAqL1xuICBmdW5jdGlvbiBkZWNvZGUocykge1xuICAgIGlmIChzKSB7XG4gICAgICAgIHMgPSBzLnRvU3RyaW5nKCkucmVwbGFjZShyZS5wbHVzZXMsICclMjAnKTtcbiAgICAgICAgcyA9IGRlY29kZVVSSUNvbXBvbmVudChzKTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICAvKipcbiAgICogQnJlYWtzIGEgdXJpIHN0cmluZyBkb3duIGludG8gaXRzIGluZGl2aWR1YWwgcGFydHNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHIgdXJpXG4gICAqIEByZXR1cm4ge29iamVjdH0gICAgIHBhcnRzXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgICB2YXIgcGFyc2VyID0gcmUudXJpX3BhcnNlcjtcbiAgICB2YXIgcGFyc2VyS2V5cyA9IFtcInNvdXJjZVwiLCBcInByb3RvY29sXCIsIFwiYXV0aG9yaXR5XCIsIFwidXNlckluZm9cIiwgXCJ1c2VyXCIsIFwicGFzc3dvcmRcIiwgXCJob3N0XCIsIFwicG9ydFwiLCBcImlzQ29sb25VcmlcIiwgXCJyZWxhdGl2ZVwiLCBcInBhdGhcIiwgXCJkaXJlY3RvcnlcIiwgXCJmaWxlXCIsIFwicXVlcnlcIiwgXCJhbmNob3JcIl07XG4gICAgdmFyIG0gPSBwYXJzZXIuZXhlYyhzdHIgfHwgJycpO1xuICAgIHZhciBwYXJ0cyA9IHt9O1xuXG4gICAgcGFyc2VyS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaSkge1xuICAgICAgcGFydHNba2V5XSA9IG1baV0gfHwgJyc7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGFydHM7XG4gIH1cblxuICAvKipcbiAgICogQnJlYWtzIGEgcXVlcnkgc3RyaW5nIGRvd24gaW50byBhbiBhcnJheSBvZiBrZXkvdmFsdWUgcGFpcnNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHIgcXVlcnlcbiAgICogQHJldHVybiB7YXJyYXl9ICAgICAgYXJyYXkgb2YgYXJyYXlzIChrZXkvdmFsdWUgcGFpcnMpXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVF1ZXJ5KHN0cikge1xuICAgIHZhciBpLCBwcywgcCwgbiwgaywgdiwgbDtcbiAgICB2YXIgcGFpcnMgPSBbXTtcblxuICAgIGlmICh0eXBlb2Yoc3RyKSA9PT0gJ3VuZGVmaW5lZCcgfHwgc3RyID09PSBudWxsIHx8IHN0ciA9PT0gJycpIHtcbiAgICAgIHJldHVybiBwYWlycztcbiAgICB9XG5cbiAgICBpZiAoc3RyLmluZGV4T2YoJz8nKSA9PT0gMCkge1xuICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBwcyA9IHN0ci50b1N0cmluZygpLnNwbGl0KHJlLnF1ZXJ5X3NlcGFyYXRvcik7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwID0gcHNbaV07XG4gICAgICBuID0gcC5pbmRleE9mKCc9Jyk7XG5cbiAgICAgIGlmIChuICE9PSAwKSB7XG4gICAgICAgIGsgPSBkZWNvZGUocC5zdWJzdHJpbmcoMCwgbikpO1xuICAgICAgICB2ID0gZGVjb2RlKHAuc3Vic3RyaW5nKG4gKyAxKSk7XG4gICAgICAgIHBhaXJzLnB1c2gobiA9PT0gLTEgPyBbcCwgbnVsbF0gOiBbaywgdl0pO1xuICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFVyaSBvYmplY3RcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICovXG4gIGZ1bmN0aW9uIFVyaShzdHIpIHtcbiAgICB0aGlzLnVyaVBhcnRzID0gcGFyc2VVcmkoc3RyKTtcbiAgICB0aGlzLnF1ZXJ5UGFpcnMgPSBwYXJzZVF1ZXJ5KHRoaXMudXJpUGFydHMucXVlcnkpO1xuICAgIHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBnZXR0ZXIvc2V0dGVyIG1ldGhvZHNcbiAgICovXG4gIFsncHJvdG9jb2wnLCAndXNlckluZm8nLCAnaG9zdCcsICdwb3J0JywgJ3BhdGgnLCAnYW5jaG9yJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBVcmkucHJvdG90eXBlW2tleV0gPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLnVyaVBhcnRzW2tleV0gPSB2YWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy51cmlQYXJ0c1trZXldO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBpZiB0aGVyZSBpcyBubyBwcm90b2NvbCwgdGhlIGxlYWRpbmcgLy8gY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWRcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gIHZhbFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5oYXNBdXRob3JpdHlQcmVmaXggPSBmdW5jdGlvbih2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPSB2YWw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWYgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAodGhpcy51cmlQYXJ0cy5zb3VyY2UuaW5kZXhPZignLy8nKSAhPT0gLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZjtcbiAgICB9XG4gIH07XG5cbiAgVXJpLnByb3RvdHlwZS5pc0NvbG9uVXJpID0gZnVuY3Rpb24gKHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy51cmlQYXJ0cy5pc0NvbG9uVXJpID0gISF2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIXRoaXMudXJpUGFydHMuaXNDb2xvblVyaTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBxdWVyeSBwYWlyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFt2YWxdICAgc2V0IGEgbmV3IHF1ZXJ5IHN0cmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgcXVlcnkgc3RyaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKSB7XG4gICAgdmFyIHMgPSAnJywgaSwgcGFyYW0sIGw7XG5cbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMucXVlcnlQYWlycyA9IHBhcnNlUXVlcnkodmFsKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBpZiAocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHMgKz0gJyYnO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtWzFdID09PSBudWxsKSB7XG4gICAgICAgIHMgKz0gcGFyYW1bMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzICs9IHBhcmFtWzBdO1xuICAgICAgICBzICs9ICc9JztcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbVsxXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBzICs9IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHMubGVuZ3RoID4gMCA/ICc/JyArIHMgOiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBmaXJzdCBxdWVyeSBwYXJhbSB2YWx1ZSBmb3VuZCBmb3IgdGhlIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSBxdWVyeSBrZXlcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgZmlyc3QgdmFsdWUgZm91bmQgZm9yIGtleVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5nZXRRdWVyeVBhcmFtVmFsdWUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHBhcmFtLCBpLCBsO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChrZXkgPT09IHBhcmFtWzBdKSB7XG4gICAgICAgIHJldHVybiBwYXJhbVsxXTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgcXVlcnkgcGFyYW0gdmFsdWVzIGZvciB0aGUga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5IHF1ZXJ5IGtleVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICBhcnJheSBvZiB2YWx1ZXNcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuZ2V0UXVlcnlQYXJhbVZhbHVlcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgYXJyID0gW10sIGksIHBhcmFtLCBsO1xuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChrZXkgPT09IHBhcmFtWzBdKSB7XG4gICAgICAgIGFyci5wdXNoKHBhcmFtWzFdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcblxuICAvKipcbiAgICogcmVtb3ZlcyBxdWVyeSBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5ICAgICByZW1vdmUgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7dmFsfSAgICBbdmFsXSAgIHJlbW92ZSBhIHNwZWNpZmljIHZhbHVlLCBvdGhlcndpc2UgcmVtb3ZlcyBhbGxcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmRlbGV0ZVF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICB2YXIgYXJyID0gW10sIGksIHBhcmFtLCBrZXlNYXRjaGVzRmlsdGVyLCB2YWxNYXRjaGVzRmlsdGVyLCBsO1xuXG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblxuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBrZXlNYXRjaGVzRmlsdGVyID0gZGVjb2RlKHBhcmFtWzBdKSA9PT0gZGVjb2RlKGtleSk7XG4gICAgICB2YWxNYXRjaGVzRmlsdGVyID0gcGFyYW1bMV0gPT09IHZhbDtcblxuICAgICAgaWYgKChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmICFrZXlNYXRjaGVzRmlsdGVyKSB8fCAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiAoIWtleU1hdGNoZXNGaWx0ZXIgfHwgIXZhbE1hdGNoZXNGaWx0ZXIpKSkge1xuICAgICAgICBhcnIucHVzaChwYXJhbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5xdWVyeVBhaXJzID0gYXJyO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIGFkZHMgYSBxdWVyeSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSAga2V5ICAgICAgICBhZGQgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgdmFsICAgICAgICB2YWx1ZSB0byBhZGRcbiAgICogQHBhcmFtICB7aW50ZWdlcn0gW2luZGV4XSAgICBzcGVjaWZpYyBpbmRleCB0byBhZGQgdGhlIHZhbHVlIGF0XG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuYWRkUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIHZhbCwgaW5kZXgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiBpbmRleCAhPT0gLTEpIHtcbiAgICAgIGluZGV4ID0gTWF0aC5taW4oaW5kZXgsIHRoaXMucXVlcnlQYWlycy5sZW5ndGgpO1xuICAgICAgdGhpcy5xdWVyeVBhaXJzLnNwbGljZShpbmRleCwgMCwgW2tleSwgdmFsXSk7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5xdWVyeVBhaXJzLnB1c2goW2tleSwgdmFsXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiB0ZXN0IGZvciB0aGUgZXhpc3RlbmNlIG9mIGEgcXVlcnkgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIGtleSAgICAgICAgYWRkIHZhbHVlcyBmb3Iga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHZhbCAgICAgICAgdmFsdWUgdG8gYWRkXG4gICAqIEBwYXJhbSAge2ludGVnZXJ9IFtpbmRleF0gICAgc3BlY2lmaWMgaW5kZXggdG8gYWRkIHRoZSB2YWx1ZSBhdFxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmhhc1F1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGksIGxlbiA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5xdWVyeVBhaXJzW2ldWzBdID09IGtleSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogcmVwbGFjZXMgcXVlcnkgcGFyYW0gdmFsdWVzXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5ICAgICAgICAga2V5IHRvIHJlcGxhY2UgdmFsdWUgZm9yXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbmV3VmFsICAgICAgbmV3IHZhbHVlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW29sZFZhbF0gICAgcmVwbGFjZSBvbmx5IG9uZSBzcGVjaWZpYyB2YWx1ZSAob3RoZXJ3aXNlIHJlcGxhY2VzIGFsbClcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5yZXBsYWNlUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsIGxlbiA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGgsIGksIHBhcmFtO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgICAgaWYgKGRlY29kZShwYXJhbVswXSkgPT09IGRlY29kZShrZXkpICYmIGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSkgPT09IGRlY29kZShvbGRWYWwpKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLmRlbGV0ZVF1ZXJ5UGFyYW0oa2V5LCBkZWNvZGUob2xkVmFsKSkuYWRkUXVlcnlQYXJhbShrZXksIG5ld1ZhbCwgaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICAgIGlmIChkZWNvZGUocGFyYW1bMF0pID09PSBkZWNvZGUoa2V5KSkge1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kZWxldGVRdWVyeVBhcmFtKGtleSk7XG4gICAgICB0aGlzLmFkZFF1ZXJ5UGFyYW0oa2V5LCBuZXdWYWwsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIERlZmluZSBmbHVlbnQgc2V0dGVyIG1ldGhvZHMgKHNldFByb3RvY29sLCBzZXRIYXNBdXRob3JpdHlQcmVmaXgsIGV0YylcbiAgICovXG4gIFsncHJvdG9jb2wnLCAnaGFzQXV0aG9yaXR5UHJlZml4JywgJ2lzQ29sb25VcmknLCAndXNlckluZm8nLCAnaG9zdCcsICdwb3J0JywgJ3BhdGgnLCAncXVlcnknLCAnYW5jaG9yJ10uZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgbWV0aG9kID0gJ3NldCcgKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSk7XG4gICAgVXJpLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICB0aGlzW2tleV0odmFsKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTY2hlbWUgbmFtZSwgY29sb24gYW5kIGRvdWJsZXNsYXNoLCBhcyByZXF1aXJlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGh0dHA6Ly8gb3IgcG9zc2libHkganVzdCAvL1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5zY2hlbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcyA9ICcnO1xuXG4gICAgaWYgKHRoaXMucHJvdG9jb2woKSkge1xuICAgICAgcyArPSB0aGlzLnByb3RvY29sKCk7XG4gICAgICBpZiAodGhpcy5wcm90b2NvbCgpLmluZGV4T2YoJzonKSAhPT0gdGhpcy5wcm90b2NvbCgpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcyArPSAnOic7XG4gICAgICB9XG4gICAgICBzICs9ICcvLyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhhc0F1dGhvcml0eVByZWZpeCgpICYmIHRoaXMuaG9zdCgpKSB7XG4gICAgICAgIHMgKz0gJy8vJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogU2FtZSBhcyBNb3ppbGxhIG5zSVVSSS5wcmVQYXRoXG4gICAqIEByZXR1cm4ge3N0cmluZ30gc2NoZW1lOi8vdXNlcjpwYXNzd29yZEBob3N0OnBvcnRcbiAgICogQHNlZSAgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vbnNJVVJJXG4gICAqL1xuICBVcmkucHJvdG90eXBlLm9yaWdpbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gdGhpcy5zY2hlbWUoKTtcblxuICAgIGlmICh0aGlzLnVzZXJJbmZvKCkgJiYgdGhpcy5ob3N0KCkpIHtcbiAgICAgIHMgKz0gdGhpcy51c2VySW5mbygpO1xuICAgICAgaWYgKHRoaXMudXNlckluZm8oKS5pbmRleE9mKCdAJykgIT09IHRoaXMudXNlckluZm8oKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHMgKz0gJ0AnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3QoKSkge1xuICAgICAgcyArPSB0aGlzLmhvc3QoKTtcbiAgICAgIGlmICh0aGlzLnBvcnQoKSB8fCAodGhpcy5wYXRoKCkgJiYgdGhpcy5wYXRoKCkuc3Vic3RyKDAsIDEpLm1hdGNoKC9bMC05XS8pKSkge1xuICAgICAgICBzICs9ICc6JyArIHRoaXMucG9ydCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgdHJhaWxpbmcgc2xhc2ggdG8gdGhlIHBhdGhcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuYWRkVHJhaWxpbmdTbGFzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCkgfHwgJyc7XG5cbiAgICBpZiAocGF0aC5zdWJzdHIoLTEpICE9PSAnLycpIHtcbiAgICAgIHRoaXMucGF0aChwYXRoICsgJy8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIFVyaSBvYmplY3RcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoLCBzID0gdGhpcy5vcmlnaW4oKTtcblxuICAgIGlmICh0aGlzLmlzQ29sb25VcmkoKSkge1xuICAgICAgaWYgKHRoaXMucGF0aCgpKSB7XG4gICAgICAgIHMgKz0gJzonK3RoaXMucGF0aCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYXRoKCkpIHtcbiAgICAgIHBhdGggPSB0aGlzLnBhdGgoKTtcbiAgICAgIGlmICghKHJlLmVuZHNfd2l0aF9zbGFzaGVzLnRlc3QocykgfHwgcmUuc3RhcnRzX3dpdGhfc2xhc2hlcy50ZXN0KHBhdGgpKSkge1xuICAgICAgICBzICs9ICcvJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgcy5yZXBsYWNlKHJlLmVuZHNfd2l0aF9zbGFzaGVzLCAnLycpO1xuICAgICAgICB9XG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UocmUuc3RhcnRzX3dpdGhfc2xhc2hlcywgJy8nKTtcbiAgICAgIH1cbiAgICAgIHMgKz0gcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaG9zdCgpICYmICh0aGlzLnF1ZXJ5KCkudG9TdHJpbmcoKSB8fCB0aGlzLmFuY2hvcigpKSkge1xuICAgICAgICBzICs9ICcvJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnkoKS50b1N0cmluZygpKSB7XG4gICAgICBzICs9IHRoaXMucXVlcnkoKS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFuY2hvcigpKSB7XG4gICAgICBpZiAodGhpcy5hbmNob3IoKS5pbmRleE9mKCcjJykgIT09IDApIHtcbiAgICAgICAgcyArPSAnIyc7XG4gICAgICB9XG4gICAgICBzICs9IHRoaXMuYW5jaG9yKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsb25lIGEgVXJpIG9iamVjdFxuICAgKiBAcmV0dXJuIHtVcml9IGR1cGxpY2F0ZSBjb3B5IG9mIHRoZSBVcmlcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFVyaSh0aGlzLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBleHBvcnQgdmlhIEFNRCBvciBDb21tb25KUywgb3RoZXJ3aXNlIGxlYWsgYSBnbG9iYWxcbiAgICovXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gVXJpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFVyaTtcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuVXJpID0gVXJpO1xuICB9XG59KHRoaXMpKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzdXJpL1VyaS5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKipcbioqIENvcHlyaWdodCAoQykgMjAxNSBUaGUgUXQgQ29tcGFueSBMdGQuXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTQgS2xhcsOkbHZkYWxlbnMgRGF0YWtvbnN1bHQgQUIsIGEgS0RBQiBHcm91cCBjb21wYW55LCBpbmZvQGtkYWIuY29tLCBhdXRob3IgTWlsaWFuIFdvbGZmIDxtaWxpYW4ud29sZmZAa2RhYi5jb20+XG4qKiBDb250YWN0OiBodHRwOi8vd3d3LnF0LmlvL2xpY2Vuc2luZy9cbioqXG4qKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgUXRXZWJDaGFubmVsIG1vZHVsZSBvZiB0aGUgUXQgVG9vbGtpdC5cbioqXG4qKiAkUVRfQkVHSU5fTElDRU5TRTpMR1BMMjEkXG4qKiBDb21tZXJjaWFsIExpY2Vuc2UgVXNhZ2VcbioqIExpY2Vuc2VlcyBob2xkaW5nIHZhbGlkIGNvbW1lcmNpYWwgUXQgbGljZW5zZXMgbWF5IHVzZSB0aGlzIGZpbGUgaW5cbioqIGFjY29yZGFuY2Ugd2l0aCB0aGUgY29tbWVyY2lhbCBsaWNlbnNlIGFncmVlbWVudCBwcm92aWRlZCB3aXRoIHRoZVxuKiogU29mdHdhcmUgb3IsIGFsdGVybmF0aXZlbHksIGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgY29udGFpbmVkIGluXG4qKiBhIHdyaXR0ZW4gYWdyZWVtZW50IGJldHdlZW4geW91IGFuZCBUaGUgUXQgQ29tcGFueS4gRm9yIGxpY2Vuc2luZyB0ZXJtc1xuKiogYW5kIGNvbmRpdGlvbnMgc2VlIGh0dHA6Ly93d3cucXQuaW8vdGVybXMtY29uZGl0aW9ucy4gRm9yIGZ1cnRoZXJcbioqIGluZm9ybWF0aW9uIHVzZSB0aGUgY29udGFjdCBmb3JtIGF0IGh0dHA6Ly93d3cucXQuaW8vY29udGFjdC11cy5cbioqXG4qKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgVXNhZ2VcbioqIEFsdGVybmF0aXZlbHksIHRoaXMgZmlsZSBtYXkgYmUgdXNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXJcbioqIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyLjEgb3IgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZVxuKiogU29mdHdhcmUgRm91bmRhdGlvbiBhbmQgYXBwZWFyaW5nIGluIHRoZSBmaWxlIExJQ0VOU0UuTEdQTHYyMSBhbmRcbioqIExJQ0VOU0UuTEdQTHYzIGluY2x1ZGVkIGluIHRoZSBwYWNrYWdpbmcgb2YgdGhpcyBmaWxlLiBQbGVhc2UgcmV2aWV3IHRoZVxuKiogZm9sbG93aW5nIGluZm9ybWF0aW9uIHRvIGVuc3VyZSB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qKiByZXF1aXJlbWVudHMgd2lsbCBiZSBtZXQ6IGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvbGdwbC5odG1sIGFuZFxuKiogaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL29sZC1saWNlbnNlcy9sZ3BsLTIuMS5odG1sLlxuKipcbioqIEFzIGEgc3BlY2lhbCBleGNlcHRpb24sIFRoZSBRdCBDb21wYW55IGdpdmVzIHlvdSBjZXJ0YWluIGFkZGl0aW9uYWxcbioqIHJpZ2h0cy4gVGhlc2UgcmlnaHRzIGFyZSBkZXNjcmliZWQgaW4gVGhlIFF0IENvbXBhbnkgTEdQTCBFeGNlcHRpb25cbioqIHZlcnNpb24gMS4xLCBpbmNsdWRlZCBpbiB0aGUgZmlsZSBMR1BMX0VYQ0VQVElPTi50eHQgaW4gdGhpcyBwYWNrYWdlLlxuKipcbioqICRRVF9FTkRfTElDRU5TRSRcbioqXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzID0ge1xuICAgIHNpZ25hbDogMSxcbiAgICBwcm9wZXJ0eVVwZGF0ZTogMixcbiAgICBpbml0OiAzLFxuICAgIGlkbGU6IDQsXG4gICAgZGVidWc6IDUsXG4gICAgaW52b2tlTWV0aG9kOiA2LFxuICAgIGNvbm5lY3RUb1NpZ25hbDogNyxcbiAgICBkaXNjb25uZWN0RnJvbVNpZ25hbDogOCxcbiAgICBzZXRQcm9wZXJ0eTogOSxcbiAgICByZXNwb25zZTogMTAsXG59O1xuXG52YXIgUVdlYkNoYW5uZWwgPSBmdW5jdGlvbih0cmFuc3BvcnQsIGluaXRDYWxsYmFjaylcbntcbiAgICBpZiAodHlwZW9mIHRyYW5zcG9ydCAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdHJhbnNwb3J0LnNlbmQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVGhlIFFXZWJDaGFubmVsIGV4cGVjdHMgYSB0cmFuc3BvcnQgb2JqZWN0IHdpdGggYSBzZW5kIGZ1bmN0aW9uIGFuZCBvbm1lc3NhZ2UgY2FsbGJhY2sgcHJvcGVydHkuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiIEdpdmVuIGlzOiB0cmFuc3BvcnQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydCkgKyBcIiwgdHJhbnNwb3J0LnNlbmQ6IFwiICsgdHlwZW9mKHRyYW5zcG9ydC5zZW5kKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2hhbm5lbCA9IHRoaXM7XG4gICAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbihkYXRhKVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZihkYXRhKSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwudHJhbnNwb3J0LnNlbmQoZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmFuc3BvcnQub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZGF0YS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnNpZ25hbDpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVNpZ25hbChkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVSZXNwb25zZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMucHJvcGVydHlVcGRhdGU6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVQcm9wZXJ0eVVwZGF0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImludmFsaWQgbWVzc2FnZSByZWNlaXZlZDpcIiwgbWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZXhlY0NhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuZXhlY0lkID0gMDtcbiAgICB0aGlzLmV4ZWMgPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcbiAgICB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIGlmIG5vIGNhbGxiYWNrIGlzIGdpdmVuLCBzZW5kIGRpcmVjdGx5XG4gICAgICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5uZWwuZXhlY0lkID09PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICAgICAgICAvLyB3cmFwXG4gICAgICAgICAgICBjaGFubmVsLmV4ZWNJZCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBleGVjIG1lc3NhZ2Ugd2l0aCBwcm9wZXJ0eSBpZDogXCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5pZCA9IGNoYW5uZWwuZXhlY0lkKys7XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1tkYXRhLmlkXSA9IGNhbGxiYWNrO1xuICAgICAgICBjaGFubmVsLnNlbmQoZGF0YSk7XG4gICAgfTtcblxuICAgIHRoaXMub2JqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5oYW5kbGVTaWduYWwgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1ttZXNzYWdlLm9iamVjdF07XG4gICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgIG9iamVjdC5zaWduYWxFbWl0dGVkKG1lc3NhZ2Uuc2lnbmFsLCBtZXNzYWdlLmFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHNpZ25hbDogXCIgKyBtZXNzYWdlLm9iamVjdCArIFwiOjpcIiArIG1lc3NhZ2Uuc2lnbmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgaWYgKCFtZXNzYWdlLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHJlc3BvbnNlIG1lc3NhZ2UgcmVjZWl2ZWQ6IFwiLCBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGRlbGV0ZSBjaGFubmVsLmV4ZWNDYWxsYmFja3NbbWVzc2FnZS5pZF07XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVQcm9wZXJ0eVVwZGF0ZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2UuZGF0YSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGFbaV07XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gY2hhbm5lbC5vYmplY3RzW2RhdGEub2JqZWN0XTtcbiAgICAgICAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QucHJvcGVydHlVcGRhdGUoZGF0YS5zaWduYWxzLCBkYXRhLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcHJvcGVydHkgdXBkYXRlOiBcIiArIGRhdGEub2JqZWN0ICsgXCI6OlwiICsgZGF0YS5zaWduYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWcgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgY2hhbm5lbC5zZW5kKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5kZWJ1ZywgZGF0YTogbWVzc2FnZX0pO1xuICAgIH07XG5cbiAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmluaXR9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIG9iamVjdE5hbWUgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBRT2JqZWN0KG9iamVjdE5hbWUsIGRhdGFbb2JqZWN0TmFtZV0sIGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyB1bndyYXAgcHJvcGVydGllcywgd2hpY2ggbWlnaHQgcmVmZXJlbmNlIG90aGVyIHJlZ2lzdGVyZWQgb2JqZWN0c1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGNoYW5uZWwub2JqZWN0cykge1xuICAgICAgICAgICAgY2hhbm5lbC5vYmplY3RzW29iamVjdE5hbWVdLnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5pdENhbGxiYWNrKSB7XG4gICAgICAgICAgICBpbml0Q2FsbGJhY2soY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pZGxlfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBRT2JqZWN0KG5hbWUsIGRhdGEsIHdlYkNoYW5uZWwpXG57XG4gICAgdGhpcy5fX2lkX18gPSBuYW1lO1xuICAgIHdlYkNoYW5uZWwub2JqZWN0c1tuYW1lXSA9IHRoaXM7XG5cbiAgICAvLyBMaXN0IG9mIGNhbGxiYWNrcyB0aGF0IGdldCBpbnZva2VkIHVwb24gc2lnbmFsIGVtaXNzaW9uXG4gICAgdGhpcy5fX29iamVjdFNpZ25hbHNfXyA9IHt9O1xuXG4gICAgLy8gQ2FjaGUgb2YgYWxsIHByb3BlcnRpZXMsIHVwZGF0ZWQgd2hlbiBhIG5vdGlmeSBzaWduYWwgaXMgZW1pdHRlZFxuICAgIHRoaXMuX19wcm9wZXJ0eUNhY2hlX18gPSB7fTtcblxuICAgIHZhciBvYmplY3QgPSB0aGlzO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgdGhpcy51bndyYXBRT2JqZWN0ID0gZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAge1xuICAgICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgLy8gc3VwcG9ydCBsaXN0IG9mIG9iamVjdHNcbiAgICAgICAgICAgIHZhciByZXQgPSBuZXcgQXJyYXkocmVzcG9uc2UubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICByZXRbaV0gPSBvYmplY3QudW53cmFwUU9iamVjdChyZXNwb25zZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzcG9uc2VcbiAgICAgICAgICAgIHx8ICFyZXNwb25zZVtcIl9fUU9iamVjdCpfX1wiXVxuICAgICAgICAgICAgfHwgcmVzcG9uc2VbXCJpZFwiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JqZWN0SWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0pXG4gICAgICAgICAgICByZXR1cm4gd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgdW53cmFwIHVua25vd24gUU9iamVjdCBcIiArIG9iamVjdElkICsgXCIgd2l0aG91dCBkYXRhLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxT2JqZWN0ID0gbmV3IFFPYmplY3QoIG9iamVjdElkLCByZXNwb25zZS5kYXRhLCB3ZWJDaGFubmVsICk7XG4gICAgICAgIHFPYmplY3QuZGVzdHJveWVkLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXSA9PT0gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdO1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBub3cgZGVsZXRlZCBRT2JqZWN0IHRvIGFuIGVtcHR5IHt9IG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGp1c3QgYXNzaWduaW5nIHt9IHRob3VnaCB3b3VsZCBub3QgaGF2ZSB0aGUgZGVzaXJlZCBlZmZlY3QsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBiZWxvdyBhbHNvIGVuc3VyZXMgYWxsIGV4dGVybmFsIHJlZmVyZW5jZXMgd2lsbCBzZWUgdGhlIGVtcHR5IG1hcFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHRoaXMgZGV0b3VyIGlzIG5lY2Vzc2FyeSB0byB3b3JrYXJvdW5kIFFUQlVHLTQwMDIxXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4IGluIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHFPYmplY3RbcHJvcGVydHlOYW1lc1tpZHhdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBoZXJlIHdlIGFyZSBhbHJlYWR5IGluaXRpYWxpemVkLCBhbmQgdGh1cyBtdXN0IGRpcmVjdGx5IHVud3JhcCB0aGUgcHJvcGVydGllc1xuICAgICAgICBxT2JqZWN0LnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgcmV0dXJuIHFPYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy51bndyYXBQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJZHggaW4gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fKSB7XG4gICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJZHhdID0gb2JqZWN0LnVud3JhcFFPYmplY3Qob2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTaWduYWwoc2lnbmFsRGF0YSwgaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbClcbiAgICB7XG4gICAgICAgIHZhciBzaWduYWxOYW1lID0gc2lnbmFsRGF0YVswXTtcbiAgICAgICAgdmFyIHNpZ25hbEluZGV4ID0gc2lnbmFsRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W3NpZ25hbE5hbWVdID0ge1xuICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gY29ubmVjdCB0byBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlOb3RpZnlTaWduYWwgJiYgc2lnbmFsTmFtZSAhPT0gXCJkZXN0cm95ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBub3RlIHRoYXQgd2UgYWx3YXlzIGdldCBub3RpZmllZCBhYm91dCB0aGUgZGVzdHJveWVkIHNpZ25hbFxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuY29ubmVjdFRvU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gZGlzY29ubmVjdCBmcm9tIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZmluZCBjb25uZWN0aW9uIG9mIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUgKyBcIiB0byBcIiArIGNhbGxiYWNrLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVxdWlyZWQgZm9yIFwicHVyZVwiIHNpZ25hbHMsIGhhbmRsZWQgc2VwYXJhdGVseSBmb3IgcHJvcGVydGllcyBpbiBwcm9wZXJ0eVVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGlzY29ubmVjdEZyb21TaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IHNpZ25hbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGFsbCBjYWxsYmFja3MgZm9yIHRoZSBnaXZlbiBzaWduYWxuYW1lLiBBbHNvIHdvcmtzIGZvciBwcm9wZXJ0eSBub3RpZnkgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb25zID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbE5hbWVdO1xuICAgICAgICBpZiAoY29ubmVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgc2lnbmFsQXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihzaWduYWxzLCBwcm9wZXJ0eU1hcClcbiAgICB7XG4gICAgICAgIC8vIHVwZGF0ZSBwcm9wZXJ0eSBjYWNoZVxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eUluZGV4IGluIHByb3BlcnR5TWFwKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5TWFwW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHNpZ25hbE5hbWUgaW4gc2lnbmFscykge1xuICAgICAgICAgICAgLy8gSW52b2tlIGFsbCBjYWxsYmFja3MsIGFzIHNpZ25hbEVtaXR0ZWQoKSBkb2VzIG5vdC4gVGhpcyBlbnN1cmVzIHRoZVxuICAgICAgICAgICAgLy8gcHJvcGVydHkgY2FjaGUgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrcyBhcmUgaW52b2tlZC5cbiAgICAgICAgICAgIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxzW3NpZ25hbE5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsRW1pdHRlZCA9IGZ1bmN0aW9uKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpXG4gICAge1xuICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWV0aG9kKG1ldGhvZERhdGEpXG4gICAge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG1ldGhvZERhdGFbMF07XG4gICAgICAgIHZhciBtZXRob2RJZHggPSBtZXRob2REYXRhWzFdO1xuICAgICAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmludm9rZU1ldGhvZCxcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiOiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IG1ldGhvZElkeCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWxsYmFjaykocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRHZXR0ZXJTZXR0ZXIocHJvcGVydHlJbmZvKVxuICAgIHtcbiAgICAgICAgdmFyIHByb3BlcnR5SW5kZXggPSBwcm9wZXJ0eUluZm9bMF07XG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eUluZm9bMV07XG4gICAgICAgIHZhciBub3RpZnlTaWduYWxEYXRhID0gcHJvcGVydHlJbmZvWzJdO1xuICAgICAgICAvLyBpbml0aWFsaXplIHByb3BlcnR5IGNhY2hlIHdpdGggY3VycmVudCB2YWx1ZVxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzIGlzIGFuIG9iamVjdCwgaXQgaXMgbm90IGRpcmVjdGx5IHVud3JhcHBlZCBhcyBpdCBtaWdodFxuICAgICAgICAvLyByZWZlcmVuY2Ugb3RoZXIgUU9iamVjdCB0aGF0IHdlIGRvIG5vdCBrbm93IHlldFxuICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSBwcm9wZXJ0eUluZm9bM107XG5cbiAgICAgICAgaWYgKG5vdGlmeVNpZ25hbERhdGEpIHtcbiAgICAgICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhWzBdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIG5hbWUgaXMgb3B0aW1pemVkIGF3YXksIHJlY29uc3RydWN0IHRoZSBhY3R1YWwgbmFtZVxuICAgICAgICAgICAgICAgIG5vdGlmeVNpZ25hbERhdGFbMF0gPSBwcm9wZXJ0eU5hbWUgKyBcIkNoYW5nZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZFNpZ25hbChub3RpZnlTaWduYWxEYXRhLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZG4ndCBoYXBwZW5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5kZWZpbmVkIHZhbHVlIGluIHByb3BlcnR5IGNhY2hlIGZvciBwcm9wZXJ0eSBcXFwiXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIlxcXCIgaW4gb2JqZWN0IFwiICsgb2JqZWN0Ll9faWRfXyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlByb3BlcnR5IHNldHRlciBmb3IgXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIiBjYWxsZWQgd2l0aCB1bmRlZmluZWQgdmFsdWUhXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHdlYkNoYW5uZWwuZXhlYyh7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zZXRQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBwcm9wZXJ0eUluZGV4LFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZGF0YS5tZXRob2RzLmZvckVhY2goYWRkTWV0aG9kKTtcblxuICAgIGRhdGEucHJvcGVydGllcy5mb3JFYWNoKGJpbmRHZXR0ZXJTZXR0ZXIpO1xuXG4gICAgZGF0YS5zaWduYWxzLmZvckVhY2goZnVuY3Rpb24oc2lnbmFsKSB7IGFkZFNpZ25hbChzaWduYWwsIGZhbHNlKTsgfSk7XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEuZW51bXMpIHtcbiAgICAgICAgb2JqZWN0W25hbWVdID0gZGF0YS5lbnVtc1tuYW1lXTtcbiAgICB9XG59XG5cbi8vcmVxdWlyZWQgZm9yIHVzZSB3aXRoIG5vZGVqc1xuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgIFFXZWJDaGFubmVsOiBRV2ViQ2hhbm5lbFxuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFV0aWxpdGllcyA9IHJlcXVpcmUoJy4vVXRpbGl0aWVzLmpzJyk7XG52YXIgU2hhcmVkID0gcmVxdWlyZSgnLi9TaGFyZWQuanMnKTtcbnZhciBOYXRpdmVEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9OYXRpdmVEaXNwYXRjaGVyLmpzJyk7XG52YXIgU2ltdWxhdG9yRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qcycpO1xudmFyIHF3ZWJjaGFubmVsID0gcmVxdWlyZSgncXdlYmNoYW5uZWwnKTtcblxuLyoqIEBtb2R1bGUgU2hpbUxpYnJhcnkgLSBUaGlzIG1vZHVsZSBkZWZpbmVzIHRoZSBXREMncyBzaGltIGxpYnJhcnkgd2hpY2ggaXMgdXNlZFxudG8gYnJpZGdlIHRoZSBnYXAgYmV0d2VlbiB0aGUgamF2YXNjcmlwdCBjb2RlIG9mIHRoZSBXREMgYW5kIHRoZSBkcml2aW5nIGNvbnRleHRcbm9mIHRoZSBXREMgKFRhYmxlYXUgZGVza3RvcCwgdGhlIHNpbXVsYXRvciwgZXRjLikgKi9cblxuLy8gVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkIG9uY2UgYm9vdHN0cmFwcGluZyBoYXMgYmVlbiBjb21wbGV0ZWQgYW5kIHRoZVxuLy8gZGlzcGF0Y2hlciBhbmQgc2hhcmVkIFdEQyBvYmplY3RzIGFyZSBib3RoIGNyZWF0ZWQgYW5kIGF2YWlsYWJsZVxuZnVuY3Rpb24gYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKF9kaXNwYXRjaGVyLCBfc2hhcmVkKSB7XG4gIFV0aWxpdGllcy5jb3B5RnVuY3Rpb25zKF9kaXNwYXRjaGVyLnB1YmxpY0ludGVyZmFjZSwgd2luZG93LnRhYmxlYXUpO1xuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wcml2YXRlSW50ZXJmYWNlLCB3aW5kb3cuX3RhYmxlYXUpO1xuICBfc2hhcmVkLmluaXQoKTtcbn1cblxuLy8gSW5pdGlhbGl6ZXMgdGhlIHdkYyBzaGltIGxpYnJhcnkuIFlvdSBtdXN0IGNhbGwgdGhpcyBiZWZvcmUgZG9pbmcgYW55dGhpbmcgd2l0aCBXRENcbm1vZHVsZS5leHBvcnRzLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICAvLyBUaGUgaW5pdGlhbCBjb2RlIGhlcmUgaXMgdGhlIG9ubHkgcGxhY2UgaW4gb3VyIG1vZHVsZSB3aGljaCBzaG91bGQgaGF2ZSBnbG9iYWxcbiAgLy8ga25vd2xlZGdlIG9mIGhvdyBhbGwgdGhlIFdEQyBjb21wb25lbnRzIGFyZSBnbHVlZCB0b2dldGhlci4gVGhpcyBpcyB0aGUgb25seSBwbGFjZVxuICAvLyB3aGljaCB3aWxsIGtub3cgYWJvdXQgdGhlIHdpbmRvdyBvYmplY3Qgb3Igb3RoZXIgZ2xvYmFsIG9iamVjdHMuIFRoaXMgY29kZSB3aWxsIGJlIHJ1blxuICAvLyBpbW1lZGlhdGVseSB3aGVuIHRoZSBzaGltIGxpYnJhcnkgbG9hZHMgYW5kIGlzIHJlc3BvbnNpYmxlIGZvciBkZXRlcm1pbmluZyB0aGUgY29udGV4dFxuICAvLyB3aGljaCBpdCBpcyBydW5uaW5nIGl0IGFuZCBzZXR1cCBhIGNvbW11bmljYXRpb25zIGNoYW5uZWwgYmV0d2VlbiB0aGUganMgJiBydW5uaW5nIGNvZGVcbiAgdmFyIGRpc3BhdGNoZXIgPSBudWxsO1xuICB2YXIgc2hhcmVkID0gbnVsbDtcblxuICAvLyBBbHdheXMgZGVmaW5lIHRoZSBwcml2YXRlIF90YWJsZWF1IG9iamVjdCBhdCB0aGUgc3RhcnRcbiAgd2luZG93Ll90YWJsZWF1ID0ge307XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSB0YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCBpcyBkZWZpbmVkIGFzIGEgZ2xvYmFsIG9iamVjdC4gSWYgc28sXG4gIC8vIHdlIGFyZSBydW5uaW5nIGluIHRoZSBUYWJsZWF1IGRlc2t0b3Avc2VydmVyIGNvbnRleHQuIElmIG5vdCwgd2UncmUgcnVubmluZyBpbiB0aGUgc2ltdWxhdG9yXG4gIGlmICghIXdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCkge1xuICAgIC8vIFdlIGhhdmUgdGhlIHRhYmxlYXUgb2JqZWN0IGRlZmluZWRcbiAgICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBOYXRpdmVEaXNwYXRjaGVyLCBSZXBvcnRpbmcgdmVyc2lvbiBudW1iZXJcIik7XG4gICAgd2luZG93LnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwLlJlcG9ydFZlcnNpb25OdW1iZXIoQlVJTERfTlVNQkVSKTtcbiAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIod2luZG93KTtcbiAgfSBlbHNlIGlmICghIXdpbmRvdy5xdCAmJiAhIXdpbmRvdy5xdC53ZWJDaGFubmVsVHJhbnNwb3J0KSB7XG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciBmb3IgcXdlYmNoYW5uZWxcIik7XG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcblxuICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gYSBjb250ZXh0IHdoZXJlIHRoZSB3ZWJDaGFubmVsVHJhbnNwb3J0IGlzIGF2YWlsYWJsZS4gVGhpcyBtZWFucyBRV2ViRW5naW5lIGlzIGluIHVzZVxuICAgIHdpbmRvdy5jaGFubmVsID0gbmV3IHF3ZWJjaGFubmVsLlFXZWJDaGFubmVsKHF0LndlYkNoYW5uZWxUcmFuc3BvcnQsIGZ1bmN0aW9uKGNoYW5uZWwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUVdlYkNoYW5uZWwgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIik7XG5cbiAgICAgIC8vIERlZmluZSB0aGUgZnVuY3Rpb24gd2hpY2ggdGFibGVhdSB3aWxsIGNhbGwgYWZ0ZXIgaXQgaGFzIGluc2VydGVkIGFsbCB0aGUgcmVxdWlyZWQgb2JqZWN0cyBpbnRvIHRoZSBqYXZhc2NyaXB0IGZyYW1lXG4gICAgICB3aW5kb3cuX3RhYmxlYXUuX25hdGl2ZVNldHVwQ29tcGxldGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIE9uY2UgdGhlIG5hdGl2ZSBjb2RlIHRlbGxzIHVzIGV2ZXJ5dGhpbmcgaGVyZSBpcyBkb25lLCB3ZSBzaG91bGQgaGF2ZSBhbGwgdGhlIGV4cGVjdGVkIG9iamVjdHMgaW5zZXJ0ZWQgaW50byBqc1xuICAgICAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIoY2hhbm5lbC5vYmplY3RzKTtcbiAgICAgICAgd2luZG93LnRhYmxlYXUgPSBjaGFubmVsLm9iamVjdHMudGFibGVhdTtcbiAgICAgICAgc2hhcmVkLmNoYW5nZVRhYmxlYXVBcGlPYmood2luZG93LnRhYmxlYXUpO1xuICAgICAgICBib290c3RyYXBwaW5nRmluaXNoZWQoZGlzcGF0Y2hlciwgc2hhcmVkKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEFjdHVhbGx5IGNhbGwgaW50byB0aGUgdmVyc2lvbiBib290c3RyYXBwZXIgdG8gcmVwb3J0IG91ciB2ZXJzaW9uIG51bWJlclxuICAgICAgY2hhbm5lbC5vYmplY3RzLnRhYmxlYXVWZXJzaW9uQm9vdHN0cmFwLlJlcG9ydFZlcnNpb25OdW1iZXIoQlVJTERfTlVNQkVSKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIlZlcnNpb24gQm9vdHN0cmFwIGlzIG5vdCBkZWZpbmVkLCBJbml0aWFsaXppbmcgU2ltdWxhdG9yRGlzcGF0Y2hlclwiKTtcbiAgICB3aW5kb3cudGFibGVhdSA9IHt9O1xuICAgIGRpc3BhdGNoZXIgPSBuZXcgU2ltdWxhdG9yRGlzcGF0Y2hlcih3aW5kb3cpO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIFdEQyBvYmplY3QgYW5kIGFkZCBpbiBvdXIgZW51bSB2YWx1ZXNcbiAgc2hhcmVkID0gbmV3IFNoYXJlZCh3aW5kb3cudGFibGVhdSwgd2luZG93Ll90YWJsZWF1LCB3aW5kb3cpO1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGlzcGF0Y2hlciBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIGltbWVkaWF0ZWx5IGNhbGwgdGhlXG4gIC8vIGNhbGxiYWNrIGlmIHNvXG4gIGlmIChkaXNwYXRjaGVyKSB7XG4gICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGFibGVhdXdkYy5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNLQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9
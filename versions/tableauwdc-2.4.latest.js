/*! Build Number: 2.4.0 */
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
/***/ (function(module, exports, __webpack_require__) {

	// Main entry point to pull together everything needed for the WDC shim library
	// This file will be exported as a bundled js file by webpack so it can be included
	// in a <script> tag in an html document. Alernatively, a connector may include
	// this whole package in their code and would need to call init like this
	var tableauwdc = __webpack_require__(20);
	tableauwdc.init();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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


/***/ }),
/* 3 */
/***/ (function(module, exports) {

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
	  publicInterface.enableCookiePersistence = this._enableCookiePersistence.bind(this);
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

	NativeDispatcher.prototype._enableCookiePersistence = function() {
	  // Cookie persistence was added in wdclib 2.4, Tableau 2021.1.2
	  if (!!this.nativeApiRootObj.WDCBridge_Api_enableCookiePersistence) {
	    this.nativeApiRootObj.WDCBridge_Api_enableCookiePersistence.api();
	  } else {
	    console.log("enableCookiePersistence requires Tableau 2021.1.2+");
	  }
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
	  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": ("2.4.0") };
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
	  publicInterface.enableCookiePersistence = this._enableCookiePersistence.bind(this);
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

	SimulatorDispatcher.prototype._enableCookiePersistence = function() {
	  // Don't bother passing this back to the simulator since there's nothing it can
	  // do. Just call back to the WDC indicating that it worked
	  console.log("Shared Cookies Exception requested in the simulator. Pretending to work.")
	  setTimeout(function() {
	    if (typeof this.globalObj._wdc.enableCookiePersistenceCompleted === "function") {
	      this.globalObj._wdc.enableCookiePersistenceCompleted();
	    }
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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

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


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	function copyFunctions(src, dest) {
	  for(var key in src) {
	    if (typeof src[key] === 'function') {
	      dest[key] = src[key];
	    }
	  }
	}

	module.exports.copyFunctions = copyFunctions;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"To help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = {"webSecurityWarning":"wwTo help prevent malicious sites from getting access to your confidential data, confirm that you trust the following site:"}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/****************************************************************************
	**
	** Copyright (C) 2016 The Qt Company Ltd.
	** Copyright (C) 2016 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
	** Contact: https://www.qt.io/licensing/
	**
	** This file is part of the QtWebChannel module of the Qt Toolkit.
	**
	** $QT_BEGIN_LICENSE:LGPL$
	** Commercial License Usage
	** Licensees holding valid commercial Qt licenses may use this file in
	** accordance with the commercial license agreement provided with the
	** Software or, alternatively, in accordance with the terms contained in
	** a written agreement between you and The Qt Company. For licensing terms
	** and conditions see https://www.qt.io/terms-conditions. For further
	** information use the contact form at https://www.qt.io/contact-us.
	**
	** GNU Lesser General Public License Usage
	** Alternatively, this file may be used under the terms of the GNU Lesser
	** General Public License version 3 as published by the Free Software
	** Foundation and appearing in the file LICENSE.LGPL3 included in the
	** packaging of this file. Please review the following information to
	** ensure the GNU Lesser General Public License version 3 requirements
	** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
	**
	** GNU General Public License Usage
	** Alternatively, this file may be used under the terms of the GNU
	** General Public License version 2.0 or (at your option) the GNU General
	** Public license version 3 or any later version approved by the KDE Free
	** Qt Foundation. The licenses are as published by the Free Software
	** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
	** included in the packaging of this file. Please review the following
	** information to ensure the GNU General Public License requirements will
	** be met: https://www.gnu.org/licenses/gpl-2.0.html and
	** https://www.gnu.org/licenses/gpl-3.0.html.
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
	            || response.id === undefined) {
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
	        invokeSignalCallbacks(signalName, this.unwrapQObject(signalArgs));
	    }

	    function addMethod(methodData)
	    {
	        var methodName = methodData[0];
	        var methodIdx = methodData[1];
	        object[methodName] = function() {
	            var args = [];
	            var callback;
	            for (var i = 0; i < arguments.length; ++i) {
	                var argument = arguments[i];
	                if (typeof argument === "function")
	                    callback = argument;
	                else if (argument instanceof QObject && webChannel.objects[argument.__id__] !== undefined)
	                    args.push({
	                        "id": argument.__id__
	                    });
	                else
	                    args.push(argument);
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
	            configurable: true,
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
	                var valueToSend = value;
	                if (valueToSend instanceof QObject && webChannel.objects[valueToSend.__id__] !== undefined)
	                    valueToSend = { "id": valueToSend.__id__ };
	                webChannel.exec({
	                    "type": QWebChannelMessageTypes.setProperty,
	                    "object": object.__id__,
	                    "property": propertyIndex,
	                    "value": valueToSend
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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

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
	    window.tableauVersionBootstrap.ReportVersionNumber(("2.4.0"));
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
	      channel.objects.tableauVersionBootstrap.ReportVersionNumber(("2.4.0"));
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDNlMWExMzcxYTJmZTFjNWE3OWY0Iiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0FwcHJvdmVkT3JpZ2lucy5qcyIsIndlYnBhY2s6Ly8vLi9FbnVtcy5qcyIsIndlYnBhY2s6Ly8vLi9OYXRpdmVEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1RhYmxlLmpzIiwid2VicGFjazovLy8uL1V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9+L1N0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgvZW5kc3dpdGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb29raWVzLWpzL2Rpc3QvY29va2llcy5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc196aC1DTi5qc29uIiwid2VicGFjazovLy8uL34vanN1cmkvVXJpLmpzIiwid2VicGFjazovLy8uL34vcXdlYmNoYW5uZWwvcXdlYmNoYW5uZWwuanMiLCJ3ZWJwYWNrOi8vLy4vdGFibGVhdXdkYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzZTFhMTM3MWEyZmUxYzVhNzlmNCIsIi8vIE1haW4gZW50cnkgcG9pbnQgdG8gcHVsbCB0b2dldGhlciBldmVyeXRoaW5nIG5lZWRlZCBmb3IgdGhlIFdEQyBzaGltIGxpYnJhcnlcbi8vIFRoaXMgZmlsZSB3aWxsIGJlIGV4cG9ydGVkIGFzIGEgYnVuZGxlZCBqcyBmaWxlIGJ5IHdlYnBhY2sgc28gaXQgY2FuIGJlIGluY2x1ZGVkXG4vLyBpbiBhIDxzY3JpcHQ+IHRhZyBpbiBhbiBodG1sIGRvY3VtZW50LiBBbGVybmF0aXZlbHksIGEgY29ubmVjdG9yIG1heSBpbmNsdWRlXG4vLyB0aGlzIHdob2xlIHBhY2thZ2UgaW4gdGhlaXIgY29kZSBhbmQgd291bGQgbmVlZCB0byBjYWxsIGluaXQgbGlrZSB0aGlzXG52YXIgdGFibGVhdXdkYyA9IHJlcXVpcmUoJy4vdGFibGVhdXdkYy5qcycpO1xudGFibGVhdXdkYy5pbml0KCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBBUFBST1ZFRF9PUklHSU5TX0tFWSA9IFwid2RjX2FwcHJvdmVkX29yaWdpbnNcIjtcbnZhciBTRVBBUkFUT1IgPSBcIixcIjtcbnZhciBDb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpO1xuXG5mdW5jdGlvbiBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKSB7XG4gIHZhciByZXN1bHQgPSBDb29raWVzLmdldChBUFBST1ZFRF9PUklHSU5TX0tFWSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIF9zYXZlQXBwcm92ZWRPcmlnaW5zKG9yaWdpbkFycmF5KSB7XG4gIHZhciBuZXdPcmlnaW5TdHJpbmcgPSBvcmlnaW5BcnJheS5qb2luKFNFUEFSQVRPUik7XG4gIGNvbnNvbGUubG9nKFwiU2F2aW5nIGFwcHJvdmVkIG9yaWdpbnMgJ1wiICsgbmV3T3JpZ2luU3RyaW5nICsgXCInXCIpO1xuICBcbiAgLy8gV2UgY291bGQgcG90ZW50aWFsbHkgbWFrZSB0aGlzIGEgbG9uZ2VyIHRlcm0gY29va2llIGluc3RlYWQgb2YganVzdCBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvblxuICB2YXIgcmVzdWx0ID0gQ29va2llcy5zZXQoQVBQUk9WRURfT1JJR0lOU19LRVksIG5ld09yaWdpblN0cmluZyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEFkZHMgYW4gYXBwcm92ZWQgb3JpZ2lucyB0byB0aGUgbGlzdCBhbHJlYWR5IHNhdmVkIGluIGEgc2Vzc2lvbiBjb29raWVcbmZ1bmN0aW9uIGFkZEFwcHJvdmVkT3JpZ2luKG9yaWdpbikge1xuICBpZiAob3JpZ2luKSB7XG4gICAgdmFyIG9yaWdpbnMgPSBnZXRBcHByb3ZlZE9yaWdpbnMoKTtcbiAgICBvcmlnaW5zLnB1c2gob3JpZ2luKTtcbiAgICBfc2F2ZUFwcHJvdmVkT3JpZ2lucyhvcmlnaW5zKTtcbiAgfVxufVxuXG4vLyBSZXRyaWV2ZXMgdGhlIG9yaWdpbnMgd2hpY2ggaGF2ZSBhbHJlYWR5IGJlZW4gYXBwcm92ZWQgYnkgdGhlIHVzZXJcbmZ1bmN0aW9uIGdldEFwcHJvdmVkT3JpZ2lucygpIHtcbiAgdmFyIG9yaWdpbnNTdHJpbmcgPSBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKTtcbiAgaWYgKCFvcmlnaW5zU3RyaW5nIHx8IDAgPT09IG9yaWdpbnNTdHJpbmcubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9yaWdpbnMgPSBvcmlnaW5zU3RyaW5nLnNwbGl0KFNFUEFSQVRPUik7XG4gIHJldHVybiBvcmlnaW5zO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5hZGRBcHByb3ZlZE9yaWdpbiA9IGFkZEFwcHJvdmVkT3JpZ2luO1xubW9kdWxlLmV4cG9ydHMuZ2V0QXBwcm92ZWRPcmlnaW5zID0gZ2V0QXBwcm92ZWRPcmlnaW5zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9BcHByb3ZlZE9yaWdpbnMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFRoaXMgZmlsZSBsaXN0cyBhbGwgb2YgdGhlIGVudW1zIHdoaWNoIHNob3VsZCBhdmFpbGFibGUgZm9yIHRoZSBXREMgKi9cbnZhciBhbGxFbnVtcyA9IHtcbiAgcGhhc2VFbnVtIDoge1xuICAgIGludGVyYWN0aXZlUGhhc2U6IFwiaW50ZXJhY3RpdmVcIixcbiAgICBhdXRoUGhhc2U6IFwiYXV0aFwiLFxuICAgIGdhdGhlckRhdGFQaGFzZTogXCJnYXRoZXJEYXRhXCJcbiAgfSxcblxuICBhdXRoUHVycG9zZUVudW0gOiB7XG4gICAgZXBoZW1lcmFsOiBcImVwaGVtZXJhbFwiLFxuICAgIGVuZHVyaW5nOiBcImVuZHVyaW5nXCJcbiAgfSxcblxuICBhdXRoVHlwZUVudW0gOiB7XG4gICAgbm9uZTogXCJub25lXCIsXG4gICAgYmFzaWM6IFwiYmFzaWNcIixcbiAgICBjdXN0b206IFwiY3VzdG9tXCJcbiAgfSxcblxuICBkYXRhVHlwZUVudW0gOiB7XG4gICAgYm9vbDogXCJib29sXCIsXG4gICAgZGF0ZTogXCJkYXRlXCIsXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZXRpbWVcIixcbiAgICBmbG9hdDogXCJmbG9hdFwiLFxuICAgIGludDogXCJpbnRcIixcbiAgICBzdHJpbmc6IFwic3RyaW5nXCIsXG4gICAgZ2VvbWV0cnk6IFwiZ2VvbWV0cnlcIlxuICB9LFxuXG4gIGNvbHVtblJvbGVFbnVtIDoge1xuICAgICAgZGltZW5zaW9uOiBcImRpbWVuc2lvblwiLFxuICAgICAgbWVhc3VyZTogXCJtZWFzdXJlXCJcbiAgfSxcblxuICBjb2x1bW5UeXBlRW51bSA6IHtcbiAgICAgIGNvbnRpbnVvdXM6IFwiY29udGludW91c1wiLFxuICAgICAgZGlzY3JldGU6IFwiZGlzY3JldGVcIlxuICB9LFxuXG4gIGFnZ1R5cGVFbnVtIDoge1xuICAgICAgc3VtOiBcInN1bVwiLFxuICAgICAgYXZnOiBcImF2Z1wiLFxuICAgICAgbWVkaWFuOiBcIm1lZGlhblwiLFxuICAgICAgY291bnQ6IFwiY291bnRcIixcbiAgICAgIGNvdW50ZDogXCJjb3VudF9kaXN0XCJcbiAgfSxcblxuICBnZW9ncmFwaGljUm9sZUVudW0gOiB7XG4gICAgICBhcmVhX2NvZGU6IFwiYXJlYV9jb2RlXCIsXG4gICAgICBjYnNhX21zYTogXCJjYnNhX21zYVwiLFxuICAgICAgY2l0eTogXCJjaXR5XCIsXG4gICAgICBjb25ncmVzc2lvbmFsX2Rpc3RyaWN0OiBcImNvbmdyZXNzaW9uYWxfZGlzdHJpY3RcIixcbiAgICAgIGNvdW50cnlfcmVnaW9uOiBcImNvdW50cnlfcmVnaW9uXCIsXG4gICAgICBjb3VudHk6IFwiY291bnR5XCIsXG4gICAgICBzdGF0ZV9wcm92aW5jZTogXCJzdGF0ZV9wcm92aW5jZVwiLFxuICAgICAgemlwX2NvZGVfcG9zdGNvZGU6IFwiemlwX2NvZGVfcG9zdGNvZGVcIixcbiAgICAgIGxhdGl0dWRlOiBcImxhdGl0dWRlXCIsXG4gICAgICBsb25naXR1ZGU6IFwibG9uZ2l0dWRlXCJcbiAgfSxcblxuICB1bml0c0Zvcm1hdEVudW0gOiB7XG4gICAgICB0aG91c2FuZHM6IFwidGhvdXNhbmRzXCIsXG4gICAgICBtaWxsaW9uczogXCJtaWxsaW9uc1wiLFxuICAgICAgYmlsbGlvbnNfZW5nbGlzaDogXCJiaWxsaW9uc19lbmdsaXNoXCIsXG4gICAgICBiaWxsaW9uc19zdGFuZGFyZDogXCJiaWxsaW9uc19zdGFuZGFyZFwiXG4gIH0sXG5cbiAgbnVtYmVyRm9ybWF0RW51bSA6IHtcbiAgICAgIG51bWJlcjogXCJudW1iZXJcIixcbiAgICAgIGN1cnJlbmN5OiBcImN1cnJlbmN5XCIsXG4gICAgICBzY2llbnRpZmljOiBcInNjaWVudGlmaWNcIixcbiAgICAgIHBlcmNlbnRhZ2U6IFwicGVyY2VudGFnZVwiXG4gIH0sXG5cbiAgbG9jYWxlRW51bSA6IHtcbiAgICAgIGFtZXJpY2E6IFwiZW4tdXNcIixcbiAgICAgIGJyYXppbDogIFwicHQtYnJcIixcbiAgICAgIGNoaW5hOiAgIFwiemgtY25cIixcbiAgICAgIGZyYW5jZTogIFwiZnItZnJcIixcbiAgICAgIGdlcm1hbnk6IFwiZGUtZGVcIixcbiAgICAgIGphcGFuOiAgIFwiamEtanBcIixcbiAgICAgIGtvcmVhOiAgIFwia28ta3JcIixcbiAgICAgIHNwYWluOiAgIFwiZXMtZXNcIlxuICB9LFxuXG4gIGpvaW5FbnVtIDoge1xuICAgICAgaW5uZXI6IFwiaW5uZXJcIixcbiAgICAgIGxlZnQ6IFwibGVmdFwiXG4gIH1cbn1cblxuLy8gQXBwbGllcyB0aGUgZW51bXMgYXMgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0IG9iamVjdFxuZnVuY3Rpb24gYXBwbHkodGFyZ2V0KSB7XG4gIGZvcih2YXIga2V5IGluIGFsbEVudW1zKSB7XG4gICAgdGFyZ2V0W2tleV0gPSBhbGxFbnVtc1trZXldO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmFwcGx5ID0gYXBwbHk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL0VudW1zLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgYW5kIHRoZSBXREMnc1xuICogSmF2YXNjcmlwdC4gaXMgcHJlZG9taW5hbnRseSBhIHBhc3MtdGhyb3VnaCB0byB0aGUgUXQgV2ViQnJpZGdlIG1ldGhvZHNcbiAqIEBwYXJhbSBuYXRpdmVBcGlSb290T2JqIHtPYmplY3R9IC0gVGhlIHJvb3Qgb2JqZWN0IHdoZXJlIHRoZSBuYXRpdmUgQXBpIG1ldGhvZHNcbiAqIGFyZSBhdmFpbGFibGUuIEZvciBXZWJLaXQsIHRoaXMgaXMgd2luZG93LlxuICovXG5mdW5jdGlvbiBOYXRpdmVEaXNwYXRjaGVyIChuYXRpdmVBcGlSb290T2JqKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iaiA9IG5hdGl2ZUFwaVJvb3RPYmo7XG4gIHRoaXMuX2luaXRQdWJsaWNJbnRlcmZhY2UoKTtcbiAgdGhpcy5faW5pdFByaXZhdGVJbnRlcmZhY2UoKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQdWJsaWNJbnRlcmZhY2UgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZSBmb3IgTmF0aXZlRGlzcGF0Y2hlclwiKTtcbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gZmFsc2U7XG5cbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRGb3JBdXRoID0gdGhpcy5fYWJvcnRGb3JBdXRoLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydFdpdGhFcnJvciA9IHRoaXMuX2Fib3J0V2l0aEVycm9yLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5lbmFibGVDb29raWVQZXJzaXN0ZW5jZSA9IHRoaXMuX2VuYWJsZUNvb2tpZVBlcnNpc3RlbmNlLmJpbmQodGhpcyk7XG4gIHB1YmxpY0ludGVyZmFjZS5sb2cgPSB0aGlzLl9sb2cuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLnN1Ym1pdCA9IHRoaXMuX3N1Ym1pdC5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UucmVwb3J0UHJvZ3Jlc3MgPSB0aGlzLl9yZXBvcnRQcm9ncmVzcy5iaW5kKHRoaXMpO1xuXG4gIHRoaXMucHVibGljSW50ZXJmYWNlID0gcHVibGljSW50ZXJmYWNlO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRGb3JBdXRoID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2Fib3J0Rm9yQXV0aC5hcGkobXNnKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0V2l0aEVycm9yID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2Fib3J0V2l0aEVycm9yLmFwaShtc2cpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSBmdW5jdGlvbihkZXN0T3JpZ2luTGlzdCkge1xuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbi5hcGkoZGVzdE9yaWdpbkxpc3QpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fZW5hYmxlQ29va2llUGVyc2lzdGVuY2UgPSBmdW5jdGlvbigpIHtcbiAgLy8gQ29va2llIHBlcnNpc3RlbmNlIHdhcyBhZGRlZCBpbiB3ZGNsaWIgMi40LCBUYWJsZWF1IDIwMjEuMS4yXG4gIGlmICghIXRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2VuYWJsZUNvb2tpZVBlcnNpc3RlbmNlKSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfZW5hYmxlQ29va2llUGVyc2lzdGVuY2UuYXBpKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJlbmFibGVDb29raWVQZXJzaXN0ZW5jZSByZXF1aXJlcyBUYWJsZWF1IDIwMjEuMS4yK1wiKTtcbiAgfVxufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24obXNnKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2xvZy5hcGkobXNnKTtcbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5fc3VibWl0Q2FsbGVkKSB7XG4gICAgY29uc29sZS5sb2coXCJzdWJtaXQgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IHRydWU7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3N1Ym1pdC5hcGkoKTtcbn07XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHJpdmF0ZUludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwcml2YXRlIGludGVyZmFjZSBmb3IgTmF0aXZlRGlzcGF0Y2hlclwiKTtcblxuICB0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcbiAgdGhpcy5fc2h1dGRvd25DYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xuXG4gIHZhciBwcml2YXRlSW50ZXJmYWNlID0ge307XG4gIHByaXZhdGVJbnRlcmZhY2UuX2luaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zY2hlbWFDYWxsYmFjayA9IHRoaXMuX3NjaGVtYUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3RhYmxlRGF0YUNhbGxiYWNrID0gdGhpcy5fdGFibGVEYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcblxuICB0aGlzLnByaXZhdGVJbnRlcmZhY2UgPSBwcml2YXRlSW50ZXJmYWNlO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQpIHtcbiAgICBjb25zb2xlLmxvZyhcImluaXRDYWxsYmFjayBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5faW5pdENhbGxiYWNrQ2FsbGVkID0gdHJ1ZTtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfaW5pdENhbGxiYWNrLmFwaSgpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5fc2h1dGRvd25DYWxsYmFja0NhbGxlZCkge1xuICAgIGNvbnNvbGUubG9nKFwic2h1dGRvd25DYWxsYmFjayBjYWxsZWQgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fc2h1dGRvd25DYWxsYmFja0NhbGxlZCA9IHRydWU7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NodXRkb3duQ2FsbGJhY2suYXBpKCk7XG59XG5cbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9zY2hlbWFDYWxsYmFjayA9IGZ1bmN0aW9uKHNjaGVtYSwgc3RhbmRhcmRDb25uZWN0aW9ucykge1xuICAvLyBDaGVjayB0byBtYWtlIHN1cmUgd2UgYXJlIHVzaW5nIGEgdmVyc2lvbiBvZiBkZXNrdG9wIHdoaWNoIGhhcyB0aGUgV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4IGRlZmluZWRcbiAgaWYgKCEhdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCkge1xuICAgIC8vIFByb3ZpZGluZyBzdGFuZGFyZENvbm5lY3Rpb25zIGlzIG9wdGlvbmFsIGJ1dCB3ZSBjYW4ndCBwYXNzIHVuZGVmaW5lZCBiYWNrIGJlY2F1c2UgUXQgd2lsbCBjaG9rZVxuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3NjaGVtYUNhbGxiYWNrRXguYXBpKHNjaGVtYSwgc3RhbmRhcmRDb25uZWN0aW9ucyB8fCBbXSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2suYXBpKHNjaGVtYSk7XG4gIH1cbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3RhYmxlRGF0YUNhbGxiYWNrID0gZnVuY3Rpb24odGFibGVOYW1lLCBkYXRhKSB7XG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3RhYmxlRGF0YUNhbGxiYWNrLmFwaSh0YWJsZU5hbWUsIGRhdGEpO1xufVxuXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVwb3J0UHJvZ3Jlc3MgPSBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcbiAgLy8gUmVwb3J0IHByb2dyZXNzIHdhcyBhZGRlZCBpbiAyLjEgc28gaXQgbWF5IG5vdCBiZSBhdmFpbGFibGUgaWYgVGFibGVhdSBvbmx5IGtub3dzIDIuMFxuICBpZiAoISF0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9yZXBvcnRQcm9ncmVzcykge1xuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3JlcG9ydFByb2dyZXNzLmFwaShwcm9ncmVzcyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJyZXBvcnRQcm9ncmVzcyBub3QgYXZhaWxhYmxlIGZyb20gdGhpcyBUYWJsZWF1IHZlcnNpb25cIik7XG4gIH1cbn1cblxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfZGF0YURvbmVDYWxsYmFjay5hcGkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOYXRpdmVEaXNwYXRjaGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9OYXRpdmVEaXNwYXRjaGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBUYWJsZSA9IHJlcXVpcmUoJy4vVGFibGUuanMnKTtcbnZhciBFbnVtcyA9IHJlcXVpcmUoJy4vRW51bXMuanMnKTtcblxuLyoqIEBjbGFzcyBUaGlzIGNsYXNzIHJlcHJlc2VudHMgdGhlIHNoYXJlZCBwYXJ0cyBvZiB0aGUgamF2YXNjcmlwdFxuKiBsaWJyYXJ5IHdoaWNoIGRvIG5vdCBoYXZlIGFueSBkZXBlbmRlbmNlIG9uIHdoZXRoZXIgd2UgYXJlIHJ1bm5pbmcgaW5cbiogdGhlIHNpbXVsYXRvciwgaW4gVGFibGVhdSwgb3IgYW55d2hlcmUgZWxzZVxuKiBAcGFyYW0gdGFibGVhdUFwaU9iaiB7T2JqZWN0fSAtIFRoZSBhbHJlYWR5IGNyZWF0ZWQgdGFibGVhdSBBUEkgb2JqZWN0ICh1c3VhbGx5IHdpbmRvdy50YWJsZWF1KVxuKiBAcGFyYW0gcHJpdmF0ZUFwaU9iaiB7T2JqZWN0fSAtIFRoZSBhbHJlYWR5IGNyZWF0ZWQgcHJpdmF0ZSBBUEkgb2JqZWN0ICh1c3VhbGx5IHdpbmRvdy5fdGFibGVhdSlcbiogQHBhcmFtIGdsb2JhbE9iaiB7T2JqZWN0fSAtIFRoZSBnbG9iYWwgb2JqZWN0IHRvIGF0dGFjaCB0aGluZ3MgdG8gKHVzdWFsbHkgd2luZG93KVxuKi9cbmZ1bmN0aW9uIFNoYXJlZCAodGFibGVhdUFwaU9iaiwgcHJpdmF0ZUFwaU9iaiwgZ2xvYmFsT2JqKSB7XG4gIHRoaXMucHJpdmF0ZUFwaU9iaiA9IHByaXZhdGVBcGlPYmo7XG4gIHRoaXMuZ2xvYmFsT2JqID0gZ2xvYmFsT2JqO1xuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gZmFsc2U7XG5cbiAgdGhpcy5jaGFuZ2VUYWJsZWF1QXBpT2JqKHRhYmxlYXVBcGlPYmopO1xufVxuXG5cblNoYXJlZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBzaGFyZWQgV0RDXCIpO1xuICB0aGlzLmdsb2JhbE9iai5vbmVycm9yID0gdGhpcy5fZXJyb3JIYW5kbGVyLmJpbmQodGhpcyk7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgaW52b2tlZCBieSB0aGUgbmF0aXZlIGNvZGVcbiAgdGhpcy5faW5pdFRyaWdnZXJGdW5jdGlvbnMoKTtcblxuICAvLyBBc3NpZ24gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb25zIHdoaWNoIGFyZW4ndCBhdmFpbGlibGUgaW4gdGhpcyB2ZXJzaW9uIG9mIHRoZSBBUElcbiAgdGhpcy5faW5pdERlcHJlY2F0ZWRGdW5jdGlvbnMoKTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5jaGFuZ2VUYWJsZWF1QXBpT2JqID0gZnVuY3Rpb24odGFibGVhdUFwaU9iaikge1xuICB0aGlzLnRhYmxlYXVBcGlPYmogPSB0YWJsZWF1QXBpT2JqO1xuXG4gIC8vIEFzc2lnbiBvdXIgbWFrZSAmIHJlZ2lzdGVyIGZ1bmN0aW9ucyByaWdodCBhd2F5IGJlY2F1c2UgYSBjb25uZWN0b3IgY2FuIHVzZVxuICAvLyB0aGVtIGltbWVkaWF0ZWx5LCBldmVuIGJlZm9yZSBib290c3RyYXBwaW5nIGhhcyBjb21wbGV0ZWRcbiAgdGhpcy50YWJsZWF1QXBpT2JqLm1ha2VDb25uZWN0b3IgPSB0aGlzLl9tYWtlQ29ubmVjdG9yLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5yZWdpc3RlckNvbm5lY3RvciA9IHRoaXMuX3JlZ2lzdGVyQ29ubmVjdG9yLmJpbmQodGhpcyk7XG5cbiAgRW51bXMuYXBwbHkodGhpcy50YWJsZWF1QXBpT2JqKTtcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24obWVzc2FnZSwgZmlsZSwgbGluZSwgY29sdW1uLCBlcnJvck9iaikge1xuICBjb25zb2xlLmVycm9yKGVycm9yT2JqKTsgLy8gcHJpbnQgZXJyb3IgZm9yIGRlYnVnZ2luZyBpbiB0aGUgYnJvd3NlclxuICBpZiAodGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2Fpbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG1zZyA9IG1lc3NhZ2U7XG4gIGlmKGVycm9yT2JqKSB7XG4gICAgbXNnICs9IFwiICAgc3RhY2s6XCIgKyBlcnJvck9iai5zdGFjaztcbiAgfSBlbHNlIHtcbiAgICBtc2cgKz0gXCIgICBmaWxlOiBcIiArIGZpbGU7XG4gICAgbXNnICs9IFwiICAgbGluZTogXCIgKyBsaW5lO1xuICB9XG5cbiAgaWYgKHRoaXMudGFibGVhdUFwaU9iaiAmJiB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IpIHtcbiAgICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IobXNnKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBtc2c7XG4gIH1cblxuICB0aGlzLl9oYXNBbHJlYWR5VGhyb3duRXJyb3JTb0RvbnRUaHJvd0FnYWluID0gdHJ1ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cblNoYXJlZC5wcm90b3R5cGUuX21ha2VDb25uZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlZmF1bHRJbXBscyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihjYikgeyBjYigpOyB9LFxuICAgIHNodXRkb3duOiBmdW5jdGlvbihjYikgeyBjYigpOyB9XG4gIH07XG5cbiAgcmV0dXJuIGRlZmF1bHRJbXBscztcbn1cblxuU2hhcmVkLnByb3RvdHlwZS5fcmVnaXN0ZXJDb25uZWN0b3IgPSBmdW5jdGlvbiAod2RjKSB7XG5cbiAgLy8gZG8gc29tZSBlcnJvciBjaGVja2luZyBvbiB0aGUgd2RjXG4gIHZhciBmdW5jdGlvbk5hbWVzID0gW1wiaW5pdFwiLCBcInNodXRkb3duXCIsIFwiZ2V0U2NoZW1hXCIsIFwiZ2V0RGF0YVwiXTtcbiAgZm9yICh2YXIgaWkgPSBmdW5jdGlvbk5hbWVzLmxlbmd0aCAtIDE7IGlpID49IDA7IGlpLS0pIHtcbiAgICBpZiAodHlwZW9mKHdkY1tmdW5jdGlvbk5hbWVzW2lpXV0pICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IFwiVGhlIGNvbm5lY3RvciBkaWQgbm90IGRlZmluZSB0aGUgcmVxdWlyZWQgZnVuY3Rpb246IFwiICsgZnVuY3Rpb25OYW1lc1tpaV07XG4gICAgfVxuICB9O1xuXG4gIGNvbnNvbGUubG9nKFwiQ29ubmVjdG9yIHJlZ2lzdGVyZWRcIik7XG5cbiAgdGhpcy5nbG9iYWxPYmouX3dkYyA9IHdkYztcbiAgdGhpcy5fd2RjID0gd2RjO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0VHJpZ2dlckZ1bmN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlckluaXRpYWxpemF0aW9uID0gdGhpcy5fdHJpZ2dlckluaXRpYWxpemF0aW9uLmJpbmQodGhpcyk7XG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZy5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlckRhdGFHYXRoZXJpbmcgPSB0aGlzLl90cmlnZ2VyRGF0YUdhdGhlcmluZy5iaW5kKHRoaXMpO1xuICB0aGlzLnByaXZhdGVBcGlPYmoudHJpZ2dlclNodXRkb3duID0gdGhpcy5fdHJpZ2dlclNodXRkb3duLmJpbmQodGhpcyk7XG59XG5cbi8vIFN0YXJ0cyB0aGUgV0RDXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VySW5pdGlhbGl6YXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fd2RjLmluaXQodGhpcy5wcml2YXRlQXBpT2JqLl9pbml0Q2FsbGJhY2spO1xufVxuXG4vLyBTdGFydHMgdGhlIHNjaGVtYSBnYXRoZXJpbmcgcHJvY2Vzc1xuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl93ZGMuZ2V0U2NoZW1hKHRoaXMucHJpdmF0ZUFwaU9iai5fc2NoZW1hQ2FsbGJhY2spO1xufVxuXG4vLyBTdGFydHMgdGhlIGRhdGEgZ2F0aGVyaW5nIHByb2Nlc3NcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJEYXRhR2F0aGVyaW5nID0gZnVuY3Rpb24odGFibGVzQW5kSW5jcmVtZW50VmFsdWVzKSB7XG4gIGlmICh0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoICE9IDEpIHtcbiAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIG51bWJlciBvZiB0YWJsZXMgc3BlY2lmaWVkLiBFeHBlY3RlZCAxLCBhY3R1YWwgXCIgKyB0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgdmFyIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZSA9IHRhYmxlc0FuZEluY3JlbWVudFZhbHVlc1swXTtcbiAgdmFyIGlzSm9pbkZpbHRlcmVkID0gISF0YWJsZUFuZEluY3JlbW50VmFsdWUuZmlsdGVyQ29sdW1uSWQ7XG4gIHZhciB0YWJsZSA9IG5ldyBUYWJsZShcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUudGFibGVJbmZvLCBcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUuaW5jcmVtZW50VmFsdWUsIFxuICAgIGlzSm9pbkZpbHRlcmVkLCBcbiAgICB0YWJsZUFuZEluY3JlbW50VmFsdWUuZmlsdGVyQ29sdW1uSWQgfHwgJycsIFxuICAgIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZS5maWx0ZXJWYWx1ZXMgfHwgW10sXG4gICAgdGhpcy5wcml2YXRlQXBpT2JqLl90YWJsZURhdGFDYWxsYmFjayk7XG5cbiAgdGhpcy5fd2RjLmdldERhdGEodGFibGUsIHRoaXMucHJpdmF0ZUFwaU9iai5fZGF0YURvbmVDYWxsYmFjayk7XG59XG5cbi8vIFRlbGxzIHRoZSBXREMgaXQncyB0aW1lIHRvIHNodXQgZG93blxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlclNodXRkb3duID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3dkYy5zaHV0ZG93bih0aGlzLnByaXZhdGVBcGlPYmouX3NodXRkb3duQ2FsbGJhY2spO1xufVxuXG4vLyBJbml0aWFsaXplcyBhIHNlcmllcyBvZiBnbG9iYWwgY2FsbGJhY2tzIHdoaWNoIGhhdmUgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcblNoYXJlZC5wcm90b3R5cGUuX2luaXREZXByZWNhdGVkRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmhlYWRlcnNDYWxsYmFjayA9IHRoaXMuX2hlYWRlcnNDYWxsYmFjay5iaW5kKHRoaXMpO1xuICB0aGlzLnRhYmxlYXVBcGlPYmouZGF0YUNhbGxiYWNrID0gdGhpcy5fZGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHRoaXMudGFibGVhdUFwaU9iai5zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xufVxuXG5TaGFyZWQucHJvdG90eXBlLl9pbml0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaW5pdENhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGluaXRcIik7XG59O1xuXG5TaGFyZWQucHJvdG90eXBlLl9oZWFkZXJzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGROYW1lcywgdHlwZXMpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5oZWFkZXJzQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fZGF0YUNhbGxiYWNrID0gZnVuY3Rpb24gKGRhdGEsIGxhc3RSZWNvcmRUb2tlbiwgbW9yZURhdGEpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5kYXRhQ2FsbGJhY2sgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiB2ZXJzaW9uIDIuMC4wXCIpO1xufTtcblxuU2hhcmVkLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5zaHV0ZG93bkNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIHNodXRkb3duXCIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1NoYXJlZC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgQXBwcm92ZWRPcmlnaW5zID0gcmVxdWlyZSgnLi9BcHByb3ZlZE9yaWdpbnMuanMnKTtcblxuLy8gUmVxdWlyZWQgZm9yIElFICYgRWRnZSB3aGljaCBkb24ndCBzdXBwb3J0IGVuZHNXaXRoXG5yZXF1aXJlKCdTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoJyk7XG5cbi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIHRoZSBzaW11bGF0b3IgYW5kIHdlYiBkYXRhIGNvbm5lY3Rvci4gSXQgZG9lc1xuKiB0aGlzIGJ5IHBhc3NpbmcgbWVzc2FnZXMgYmV0d2VlbiB0aGUgV0RDIHdpbmRvdyBhbmQgaXRzIHBhcmVudCB3aW5kb3dcbiogQHBhcmFtIGdsb2JhbE9iaiB7T2JqZWN0fSAtIHRoZSBnbG9iYWwgb2JqZWN0IHRvIGZpbmQgdGFibGVhdSBpbnRlcmZhY2VzIGFzIHdlbGxcbiogYXMgcmVnaXN0ZXIgZXZlbnRzICh1c3VhbGx5IHdpbmRvdylcbiovXG5mdW5jdGlvbiBTaW11bGF0b3JEaXNwYXRjaGVyIChnbG9iYWxPYmopIHtcbiAgdGhpcy5nbG9iYWxPYmogPSBnbG9iYWxPYmo7XG4gIHRoaXMuX2luaXRNZXNzYWdlSGFuZGxpbmcoKTtcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xuICB0aGlzLl9pbml0UHJpdmF0ZUludGVyZmFjZSgpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdE1lc3NhZ2VIYW5kbGluZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBtZXNzYWdlIGhhbmRsaW5nXCIpO1xuICB0aGlzLmdsb2JhbE9iai5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fcmVjZWl2ZU1lc3NhZ2UuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB0aGlzLmdsb2JhbE9iai5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCB0aGlzLl9vbkRvbUNvbnRlbnRMb2FkZWQuYmluZCh0aGlzKSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9vbkRvbUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgLy8gQXR0ZW1wdCB0byBub3RpZnkgdGhlIHNpbXVsYXRvciB3aW5kb3cgdGhhdCB0aGUgV0RDIGhhcyBsb2FkZWRcbiAgaWYodGhpcy5nbG9iYWxPYmoucGFyZW50ICE9PSB3aW5kb3cpIHtcbiAgICB0aGlzLmdsb2JhbE9iai5wYXJlbnQucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XG4gIH1cblxuICBpZih0aGlzLmdsb2JhbE9iai5vcGVuZXIpIHtcbiAgICB0cnkgeyAvLyBXcmFwIGluIHRyeS9jYXRjaCBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgSUVcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLm9wZW5lci5wb3N0TWVzc2FnZSh0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKCdsb2FkZWQnKSwgJyonKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignU29tZSB2ZXJzaW9ucyBvZiBJRSBtYXkgbm90IGFjY3VyYXRlbHkgc2ltdWxhdGUgdGhlIFdlYiBEYXRhIENvbm5lY3Rvci4gUGxlYXNlIHJldHJ5IG9uIGEgV2Via2l0IGJhc2VkIGJyb3dzZXInKTtcbiAgICB9XG4gIH1cbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3BhY2thZ2VQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcHJvcFZhbHVlcyA9IHtcbiAgICBcImNvbm5lY3Rpb25OYW1lXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbk5hbWUsXG4gICAgXCJjb25uZWN0aW9uRGF0YVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25EYXRhLFxuICAgIFwicGFzc3dvcmRcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wYXNzd29yZCxcbiAgICBcInVzZXJuYW1lXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWUsXG4gICAgXCJ1c2VybmFtZUFsaWFzXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyxcbiAgICBcImluY3JlbWVudGFsRXh0cmFjdENvbHVtblwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmluY3JlbWVudGFsRXh0cmFjdENvbHVtbixcbiAgICBcInZlcnNpb25OdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS52ZXJzaW9uTnVtYmVyLFxuICAgIFwibG9jYWxlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubG9jYWxlLFxuICAgIFwiYXV0aFB1cnBvc2VcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5hdXRoUHVycG9zZSxcbiAgICBcInBsYXRmb3JtT1NcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybU9TLFxuICAgIFwicGxhdGZvcm1WZXJzaW9uXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1WZXJzaW9uLFxuICAgIFwicGxhdGZvcm1FZGl0aW9uXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1FZGl0aW9uLFxuICAgIFwicGxhdGZvcm1CdWlsZE51bWJlclwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtQnVpbGROdW1iZXJcbiAgfTtcblxuICByZXR1cm4gcHJvcFZhbHVlcztcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FwcGx5UHJvcGVydHlWYWx1ZXMgPSBmdW5jdGlvbihwcm9wcykge1xuICBpZiAocHJvcHMpIHtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25OYW1lID0gcHJvcHMuY29ubmVjdGlvbk5hbWU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5jb25uZWN0aW9uRGF0YSA9IHByb3BzLmNvbm5lY3Rpb25EYXRhO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQgPSBwcm9wcy5wYXNzd29yZDtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lID0gcHJvcHMudXNlcm5hbWU7XG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS51c2VybmFtZUFsaWFzID0gcHJvcHMudXNlcm5hbWVBbGlhcztcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmluY3JlbWVudGFsRXh0cmFjdENvbHVtbiA9IHByb3BzLmluY3JlbWVudGFsRXh0cmFjdENvbHVtbjtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmxvY2FsZSA9IHByb3BzLmxvY2FsZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1Lmxhbmd1YWdlID0gcHJvcHMubG9jYWxlO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UgPSBwcm9wcy5hdXRoUHVycG9zZTtcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtT1MgPSBwcm9wcy5wbGF0Zm9ybU9TO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1WZXJzaW9uID0gcHJvcHMucGxhdGZvcm1WZXJzaW9uO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1FZGl0aW9uID0gcHJvcHMucGxhdGZvcm1FZGl0aW9uO1xuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1CdWlsZE51bWJlciA9IHByb3BzLnBsYXRmb3JtQnVpbGROdW1iZXI7XG4gIH1cbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2J1aWxkTWVzc2FnZVBheWxvYWQgPSBmdW5jdGlvbihtc2dOYW1lLCBtc2dEYXRhLCBwcm9wcykge1xuICB2YXIgbXNnT2JqID0ge1wibXNnTmFtZVwiOiBtc2dOYW1lLCBcIm1zZ0RhdGFcIjogbXNnRGF0YSwgXCJwcm9wc1wiOiBwcm9wcywgXCJ2ZXJzaW9uXCI6IEJVSUxEX05VTUJFUiB9O1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobXNnT2JqKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NlbmRNZXNzYWdlID0gZnVuY3Rpb24obXNnTmFtZSwgbXNnRGF0YSkge1xuICB2YXIgbWVzc2FnZVBheWxvYWQgPSB0aGlzLl9idWlsZE1lc3NhZ2VQYXlsb2FkKG1zZ05hbWUsIG1zZ0RhdGEsIHRoaXMuX3BhY2thZ2VQcm9wZXJ0eVZhbHVlcygpKTtcblxuICAvLyBDaGVjayBmaXJzdCB0byBzZWUgaWYgd2UgaGF2ZSBhIG1lc3NhZ2VIYW5kbGVyIGRlZmluZWQgdG8gcG9zdCB0aGUgbWVzc2FnZSB0b1xuICBpZiAodHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdCAhPSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzICE9ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMud2RjSGFuZGxlciAhPSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuZ2xvYmFsT2JqLndlYmtpdC5tZXNzYWdlSGFuZGxlcnMud2RjSGFuZGxlci5wb3N0TWVzc2FnZShtZXNzYWdlUGF5bG9hZCk7XG4gIH0gZWxzZSBpZiAoIXRoaXMuX3NvdXJjZVdpbmRvdykge1xuICAgIHRocm93IFwiTG9va3MgbGlrZSB0aGUgV0RDIGlzIGNhbGxpbmcgYSB0YWJsZWF1IGZ1bmN0aW9uIGJlZm9yZSB0YWJsZWF1LmluaXQoKSBoYXMgYmVlbiBjYWxsZWQuXCJcbiAgfSBlbHNlIHtcbiAgICAvLyBNYWtlIHN1cmUgd2Ugb25seSBwb3N0IHRoaXMgaW5mbyBiYWNrIHRvIHRoZSBzb3VyY2Ugb3JpZ2luIHRoZSB1c2VyIGFwcHJvdmVkIGluIF9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtXG4gICAgdGhpcy5fc291cmNlV2luZG93LnBvc3RNZXNzYWdlKG1lc3NhZ2VQYXlsb2FkLCB0aGlzLl9zb3VyY2VPcmlnaW4pO1xuICB9XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRQYXlsb2FkT2JqID0gZnVuY3Rpb24ocGF5bG9hZFN0cmluZykge1xuICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gIHRyeSB7XG4gICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZFN0cmluZyk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHBheWxvYWQ7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtID0gZnVuY3Rpb24oKSB7XG4gIC8vIER1ZSB0byBjcm9zcy1vcmlnaW4gc2VjdXJpdHkgaXNzdWVzIG92ZXIgaHR0cHMsIHdlIG1heSBub3QgYmUgYWJsZSB0byByZXRyaWV2ZSBfc291cmNlV2luZG93LlxuICAvLyBVc2Ugc291cmNlT3JpZ2luIGluc3RlYWQuXG4gIHZhciBvcmlnaW4gPSB0aGlzLl9zb3VyY2VPcmlnaW47XG5cbiAgdmFyIFVyaSA9IHJlcXVpcmUoJ2pzdXJpJyk7XG4gIHZhciBwYXJzZWRPcmlnaW4gPSBuZXcgVXJpKG9yaWdpbik7XG4gIHZhciBob3N0TmFtZSA9IHBhcnNlZE9yaWdpbi5ob3N0KCk7XG5cbiAgdmFyIHN1cHBvcnRlZEhvc3RzID0gW1wibG9jYWxob3N0XCIsIFwidGFibGVhdS5naXRodWIuaW9cIl07XG4gIGlmIChzdXBwb3J0ZWRIb3N0cy5pbmRleE9mKGhvc3ROYW1lKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFdoaXRlbGlzdCBUYWJsZWF1IGRvbWFpbnNcbiAgaWYgKGhvc3ROYW1lICYmIGhvc3ROYW1lLmVuZHNXaXRoKFwib25saW5lLnRhYmxlYXUuY29tXCIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBhbHJlYWR5QXBwcm92ZWRPcmlnaW5zID0gQXBwcm92ZWRPcmlnaW5zLmdldEFwcHJvdmVkT3JpZ2lucygpO1xuICBpZiAoYWxyZWFkeUFwcHJvdmVkT3JpZ2lucy5pbmRleE9mKG9yaWdpbikgPj0gMCkge1xuICAgIC8vIFRoZSB1c2VyIGhhcyBhbHJlYWR5IGFwcHJvdmVkIHRoaXMgb3JpZ2luLCBubyBuZWVkIHRvIGFzayBhZ2FpblxuICAgIGNvbnNvbGUubG9nKFwiQWxyZWFkeSBhcHByb3ZlZCB0aGUgb3JpZ2luJ1wiICsgb3JpZ2luICsgXCInLCBub3QgYXNraW5nIGFnYWluXCIpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGxvY2FsaXplZFdhcm5pbmdUaXRsZSA9IHRoaXMuX2dldExvY2FsaXplZFN0cmluZyhcIndlYlNlY3VyaXR5V2FybmluZ1wiKTtcbiAgdmFyIGNvbXBsZXRlV2FybmluZ01zZyAgPSBsb2NhbGl6ZWRXYXJuaW5nVGl0bGUgKyBcIlxcblxcblwiICsgaG9zdE5hbWUgKyBcIlxcblwiO1xuICB2YXIgaXNDb25maXJtZWQgPSBjb25maXJtKGNvbXBsZXRlV2FybmluZ01zZyk7XG5cbiAgaWYgKGlzQ29uZmlybWVkKSB7XG4gICAgLy8gU2V0IGEgc2Vzc2lvbiBjb29raWUgdG8gbWFyayB0aGF0IHdlJ3ZlIGFwcHJvdmVkIHRoaXMgYWxyZWFkeVxuICAgIEFwcHJvdmVkT3JpZ2lucy5hZGRBcHByb3ZlZE9yaWdpbihvcmlnaW4pO1xuICB9XG5cbiAgcmV0dXJuIGlzQ29uZmlybWVkO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0Q3VycmVudExvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFVzZSBjdXJyZW50IGJyb3dzZXIncyBsb2NhbGUgdG8gZ2V0IGEgbG9jYWxpemVkIHdhcm5pbmcgbWVzc2FnZVxuICAgIHZhciBjdXJyZW50QnJvd3Nlckxhbmd1YWdlID0gKG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IudXNlckxhbmd1YWdlKTtcbiAgICB2YXIgbG9jYWxlID0gY3VycmVudEJyb3dzZXJMYW5ndWFnZT8gY3VycmVudEJyb3dzZXJMYW5ndWFnZS5zdWJzdHJpbmcoMCwgMik6IFwiZW5cIjtcblxuICAgIHZhciBzdXBwb3J0ZWRMb2NhbGVzID0gW1wiZGVcIiwgXCJlblwiLCBcImVzXCIsIFwiZnJcIiwgXCJqYVwiLCBcImtvXCIsIFwicHRcIiwgXCJ6aFwiXTtcbiAgICAvLyBGYWxsIGJhY2sgdG8gRW5nbGlzaCBmb3Igb3RoZXIgdW5zdXBwb3J0ZWQgbGFuYWd1YWdlc1xuICAgIGlmIChzdXBwb3J0ZWRMb2NhbGVzLmluZGV4T2YobG9jYWxlKSA8IDApIHtcbiAgICAgICAgbG9jYWxlID0gJ2VuJztcbiAgICB9XG5cbiAgICByZXR1cm4gbG9jYWxlO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0TG9jYWxpemVkU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nS2V5KSB7XG4gICAgdmFyIGxvY2FsZSA9IHRoaXMuX2dldEN1cnJlbnRMb2NhbGUoKTtcblxuICAgIC8vIFVzZSBzdGF0aWMgcmVxdWlyZSBoZXJlLCBvdGhlcndpc2Ugd2VicGFjayB3b3VsZCBnZW5lcmF0ZSBhIG11Y2ggYmlnZ2VyIEpTIGZpbGVcbiAgICB2YXIgZGVTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbicpO1xuICAgIHZhciBlblN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uJyk7XG4gICAgdmFyIGVzU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VzLUVTLmpzb24nKTtcbiAgICB2YXIgamFTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfamEtSlAuanNvbicpO1xuICAgIHZhciBmclN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19mci1GUi5qc29uJyk7XG4gICAgdmFyIGtvU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2tvLUtSLmpzb24nKTtcbiAgICB2YXIgcHRTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbicpO1xuICAgIHZhciB6aFN0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc196aC1DTi5qc29uJyk7XG5cbiAgICB2YXIgc3RyaW5nSnNvbk1hcEJ5TG9jYWxlID1cbiAgICB7XG4gICAgICAgIFwiZGVcIjogZGVTdHJpbmdzTWFwLFxuICAgICAgICBcImVuXCI6IGVuU3RyaW5nc01hcCxcbiAgICAgICAgXCJlc1wiOiBlc1N0cmluZ3NNYXAsXG4gICAgICAgIFwiZnJcIjogZnJTdHJpbmdzTWFwLFxuICAgICAgICBcImphXCI6IGphU3RyaW5nc01hcCxcbiAgICAgICAgXCJrb1wiOiBrb1N0cmluZ3NNYXAsXG4gICAgICAgIFwicHRcIjogcHRTdHJpbmdzTWFwLFxuICAgICAgICBcInpoXCI6IHpoU3RyaW5nc01hcFxuICAgIH07XG5cbiAgICB2YXIgbG9jYWxpemVkU3RyaW5nc0pzb24gPSBzdHJpbmdKc29uTWFwQnlMb2NhbGVbbG9jYWxlXTtcbiAgICByZXR1cm4gbG9jYWxpemVkU3RyaW5nc0pzb25bc3RyaW5nS2V5XTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3JlY2VpdmVNZXNzYWdlID0gZnVuY3Rpb24oZXZ0KSB7XG4gIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgbWVzc2FnZSFcIik7XG5cbiAgdmFyIHdkYyA9IHRoaXMuZ2xvYmFsT2JqLl93ZGM7XG4gIGlmICghd2RjKSB7XG4gICAgdGhyb3cgXCJObyBXREMgcmVnaXN0ZXJlZC4gRGlkIHlvdSBmb3JnZXQgdG8gY2FsbCB0YWJsZWF1LnJlZ2lzdGVyQ29ubmVjdG9yP1wiO1xuICB9XG5cbiAgdmFyIHBheWxvYWRPYmogPSB0aGlzLl9nZXRQYXlsb2FkT2JqKGV2dC5kYXRhKTtcbiAgaWYoIXBheWxvYWRPYmopIHJldHVybjsgLy8gVGhpcyBtZXNzYWdlIGlzIG5vdCBuZWVkZWQgZm9yIFdEQ1xuXG4gIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XG4gICAgdGhpcy5fc291cmNlV2luZG93ID0gZXZ0LnNvdXJjZTtcbiAgICB0aGlzLl9zb3VyY2VPcmlnaW4gPSBldnQub3JpZ2luO1xuICB9XG5cbiAgdmFyIG1zZ0RhdGEgPSBwYXlsb2FkT2JqLm1zZ0RhdGE7XG4gIHRoaXMuX2FwcGx5UHJvcGVydHlWYWx1ZXMocGF5bG9hZE9iai5wcm9wcyk7XG5cbiAgc3dpdGNoKHBheWxvYWRPYmoubXNnTmFtZSkge1xuICAgIGNhc2UgXCJpbml0XCI6XG4gICAgICAvLyBXYXJuIHVzZXJzIGFib3V0IHBvc3NpYmxlIHBoaW5pc2hpbmcgYXR0YWNrc1xuICAgICAgdmFyIGNvbmZpcm1SZXN1bHQgPSB0aGlzLl9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtKCk7XG4gICAgICBpZiAoIWNvbmZpcm1SZXN1bHQpIHtcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBoYXNlID0gbXNnRGF0YS5waGFzZTtcbiAgICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckluaXRpYWxpemF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzaHV0ZG93blwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNodXRkb3duKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0U2NoZW1hXCI6XG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nKCk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZ2V0RGF0YVwiOlxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckRhdGFHYXRoZXJpbmcobXNnRGF0YS50YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8qKioqIFBVQkxJQyBJTlRFUkZBQ0UgKioqKiovXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBwdWJsaWMgaW50ZXJmYWNlXCIpO1xuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcblxuICB2YXIgcHVibGljSW50ZXJmYWNlID0ge307XG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmFkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gdGhpcy5fYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmVuYWJsZUNvb2tpZVBlcnNpc3RlbmNlID0gdGhpcy5fZW5hYmxlQ29va2llUGVyc2lzdGVuY2UuYmluZCh0aGlzKTtcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2UucmVwb3J0UHJvZ3Jlc3MgPSB0aGlzLl9yZXBvcnRQcm9ncmVzcy5iaW5kKHRoaXMpO1xuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XG5cbiAgLy8gQXNzaWduIHRoZSBwdWJsaWMgaW50ZXJmYWNlIHRvIHRoaXNcbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydEZvckF1dGhcIiwge1wibXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fYWJvcnRXaXRoRXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJhYm9ydFdpdGhFcnJvclwiLCB7XCJlcnJvck1zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uID0gZnVuY3Rpb24oZGVzdE9yaWdpbkxpc3QpIHtcbiAgLy8gRG9uJ3QgYm90aGVyIHBhc3NpbmcgdGhpcyBiYWNrIHRvIHRoZSBzaW11bGF0b3Igc2luY2UgdGhlcmUncyBub3RoaW5nIGl0IGNhblxuICAvLyBkby4gSnVzdCBjYWxsIGJhY2sgdG8gdGhlIFdEQyBpbmRpY2F0aW5nIHRoYXQgaXQgd29ya2VkXG4gIGNvbnNvbGUubG9nKFwiQ3Jvc3MgT3JpZ2luIEV4Y2VwdGlvbiByZXF1ZXN0ZWQgaW4gdGhlIHNpbXVsYXRvci4gUHJldGVuZGluZyB0byB3b3JrLlwiKVxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2xvYmFsT2JqLl93ZGMuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb25Db21wbGV0ZWQoZGVzdE9yaWdpbkxpc3QpO1xuICB9LmJpbmQodGhpcyksIDApO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZW5hYmxlQ29va2llUGVyc2lzdGVuY2UgPSBmdW5jdGlvbigpIHtcbiAgLy8gRG9uJ3QgYm90aGVyIHBhc3NpbmcgdGhpcyBiYWNrIHRvIHRoZSBzaW11bGF0b3Igc2luY2UgdGhlcmUncyBub3RoaW5nIGl0IGNhblxuICAvLyBkby4gSnVzdCBjYWxsIGJhY2sgdG8gdGhlIFdEQyBpbmRpY2F0aW5nIHRoYXQgaXQgd29ya2VkXG4gIGNvbnNvbGUubG9nKFwiU2hhcmVkIENvb2tpZXMgRXhjZXB0aW9uIHJlcXVlc3RlZCBpbiB0aGUgc2ltdWxhdG9yLiBQcmV0ZW5kaW5nIHRvIHdvcmsuXCIpXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmdsb2JhbE9iai5fd2RjLmVuYWJsZUNvb2tpZVBlcnNpc3RlbmNlQ29tcGxldGVkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuZ2xvYmFsT2JqLl93ZGMuZW5hYmxlQ29va2llUGVyc2lzdGVuY2VDb21wbGV0ZWQoKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSwgMCk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJsb2dcIiwge1wibG9nTXNnXCI6IG1zZ30pO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVwb3J0UHJvZ3Jlc3MgPSBmdW5jdGlvbihtc2cpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJyZXBvcnRQcm9ncmVzc1wiLCB7XCJwcm9ncmVzc01zZ1wiOiBtc2d9KTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcInN1Ym1pdFwiKTtcbn07XG5cbi8qKioqIFBSSVZBVEUgSU5URVJGQUNFICoqKioqL1xuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlXCIpO1xuXG4gIHZhciBwcml2YXRlSW50ZXJmYWNlID0ge307XG4gIHByaXZhdGVJbnRlcmZhY2UuX2luaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xuICBwcml2YXRlSW50ZXJmYWNlLl9zY2hlbWFDYWxsYmFjayA9IHRoaXMuX3NjaGVtYUNhbGxiYWNrLmJpbmQodGhpcyk7XG4gIHByaXZhdGVJbnRlcmZhY2UuX3RhYmxlRGF0YUNhbGxiYWNrID0gdGhpcy5fdGFibGVEYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcblxuICAvLyBBc3NpZ24gdGhlIHByaXZhdGUgaW50ZXJmYWNlIHRvIHRoaXNcbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcImluaXRDYWxsYmFja1wiKTtcbn1cblxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NodXRkb3duQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzaHV0ZG93bkNhbGxiYWNrXCIpO1xufVxuXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2NoZW1hQ2FsbGJhY2sgPSBmdW5jdGlvbihzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMpIHtcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfc2NoZW1hQ2FsbGJhY2tcIiwge1wic2NoZW1hXCI6IHNjaGVtYSwgXCJzdGFuZGFyZENvbm5lY3Rpb25zXCIgOiBzdGFuZGFyZENvbm5lY3Rpb25zIHx8IFtdfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xuICB0aGlzLl9zZW5kTWVzc2FnZShcIl90YWJsZURhdGFDYWxsYmFja1wiLCB7IFwidGFibGVOYW1lXCI6IHRhYmxlTmFtZSwgXCJkYXRhXCI6IGRhdGEgfSk7XG59XG5cblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9kYXRhRG9uZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX2RhdGFEb25lQ2FsbGJhY2tcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2ltdWxhdG9yRGlzcGF0Y2hlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vU2ltdWxhdG9yRGlzcGF0Y2hlci5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiogQGNsYXNzIFJlcHJlc2VudHMgYSBzaW5nbGUgdGFibGUgd2hpY2ggVGFibGVhdSBoYXMgcmVxdWVzdGVkXG4qIEBwYXJhbSB0YWJsZUluZm8ge09iamVjdH0gLSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGVcbiogQHBhcmFtIGluY3JlbWVudFZhbHVlIHtzdHJpbmc9fSAtIEluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZVxuKi9cbmZ1bmN0aW9uIFRhYmxlKHRhYmxlSW5mbywgaW5jcmVtZW50VmFsdWUsIGlzSm9pbkZpbHRlcmVkLCBmaWx0ZXJDb2x1bW5JZCwgZmlsdGVyVmFsdWVzLCBkYXRhQ2FsbGJhY2tGbikge1xuICAvKiogQG1lbWJlciB7T2JqZWN0fSBJbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFibGUgd2hpY2ggaGFzIGJlZW4gcmVxdWVzdGVkLiBUaGlzIGlzXG4gIGd1YXJhbnRlZWQgdG8gYmUgb25lIG9mIHRoZSB0YWJsZXMgdGhlIGNvbm5lY3RvciByZXR1cm5lZCBpbiB0aGUgY2FsbCB0byBnZXRTY2hlbWEuICovXG4gIHRoaXMudGFibGVJbmZvID0gdGFibGVJbmZvO1xuXG4gIC8qKiBAbWVtYmVyIHtzdHJpbmd9IERlZmluZXMgdGhlIGluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZSBmb3IgdGhpcyB0YWJsZS4gRW1wdHkgc3RyaW5nIGlmXG4gIHRoZXJlIGlzIG5vdCBhbiBpbmNyZW1lbnRhbCB1cGRhdGUgcmVxdWVzdGVkLiAqL1xuICB0aGlzLmluY3JlbWVudFZhbHVlID0gaW5jcmVtZW50VmFsdWUgfHwgXCJcIjtcblxuICAvKiogQG1lbWJlciB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhpcyB0YWJsZSBpcyBtZWFudCB0byBiZSBmaWx0ZXJlZCB1c2luZyBmaWx0ZXJWYWx1ZXMuICovXG4gIHRoaXMuaXNKb2luRmlsdGVyZWQgPSBpc0pvaW5GaWx0ZXJlZDtcblxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBJZiB0aGlzIHRhYmxlIGlzIGZpbHRlcmVkLCB0aGlzIGlzIHRoZSBjb2x1bW4gd2hlcmUgdGhlIGZpbHRlciB2YWx1ZXNcbiAgICogc2hvdWxkIGJlIGZvdW5kLiAqL1xuICB0aGlzLmZpbHRlckNvbHVtbklkID0gZmlsdGVyQ29sdW1uSWQ7XG5cbiAgLyoqIEBtZW1iZXIge2FycmF5fSBBbiBhcnJheSBvZiBzdHJpbmdzIHdoaWNoIHNwZWNpZmllcyB0aGUgdmFsdWVzIHdlIHdhbnQgdG8gcmV0cmlldmUuIEZvclxuICAgKiBleGFtcGxlLCBpZiBhbiBJRCBjb2x1bW4gd2FzIHRoZSBmaWx0ZXIgY29sdW1uLCB0aGlzIHdvdWxkIGJlIGEgY29sbGVjdGlvbiBvZiBJRHMgdG8gcmV0cmlldmUuICovXG4gIHRoaXMuZmlsdGVyVmFsdWVzID0gZmlsdGVyVmFsdWVzO1xuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICB0aGlzLl9kYXRhQ2FsbGJhY2tGbiA9IGRhdGFDYWxsYmFja0ZuO1xuXG4gIC8vIGJpbmQgdGhlIHB1YmxpYyBmYWNpbmcgdmVyc2lvbiBvZiB0aGlzIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBwYXNzZWQgYXJvdW5kXG4gIHRoaXMuYXBwZW5kUm93cyA9IHRoaXMuX2FwcGVuZFJvd3MuYmluZCh0aGlzKTtcbn1cblxuLyoqXG4qIEBtZXRob2QgYXBwZW5kcyB0aGUgZ2l2ZW4gcm93cyB0byB0aGUgc2V0IG9mIGRhdGEgY29udGFpbmVkIGluIHRoaXMgdGFibGVcbiogQHBhcmFtIGRhdGEge2FycmF5fSAtIEVpdGhlciBhbiBhcnJheSBvZiBhcnJheXMgb3IgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGljaCByZXByZXNlbnRcbiogdGhlIGluZGl2aWR1YWwgcm93cyBvZiBkYXRhIHRvIGFwcGVuZCB0byB0aGlzIHRhYmxlXG4qL1xuVGFibGUucHJvdG90eXBlLl9hcHBlbmRSb3dzID0gZnVuY3Rpb24oZGF0YSkge1xuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcbiAgaWYgKCFkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKFwicm93cyBkYXRhIGlzIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgIC8vIExvZyBhIHdhcm5pbmcgYmVjYXVzZSB0aGUgZGF0YSBpcyBub3QgYW4gYXJyYXkgbGlrZSB3ZSBleHBlY3RlZFxuICAgIGNvbnNvbGUud2FybihcIlRhYmxlLmFwcGVuZFJvd3MgbXVzdCB0YWtlIGFuIGFycmF5IG9mIGFycmF5cyBvciBhcnJheSBvZiBvYmplY3RzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXG4gIHRoaXMuX2RhdGFDYWxsYmFja0ZuKHRoaXMudGFibGVJbmZvLmlkLCBkYXRhKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vVGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gY29weUZ1bmN0aW9ucyhzcmMsIGRlc3QpIHtcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgaWYgKHR5cGVvZiBzcmNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvcHlGdW5jdGlvbnMgPSBjb3B5RnVuY3Rpb25zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9VdGlsaXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohIGh0dHA6Ly9tdGhzLmJlL2VuZHN3aXRoIHYwLjIuMCBieSBAbWF0aGlhcyAqL1xuaWYgKCFTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKSB7XG5cdChmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7IC8vIG5lZWRlZCB0byBzdXBwb3J0IGBhcHBseWAvYGNhbGxgIHdpdGggYHVuZGVmaW5lZGAvYG51bGxgXG5cdFx0dmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gSUUgOCBvbmx5IHN1cHBvcnRzIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG9uIERPTSBlbGVtZW50c1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIG9iamVjdCA9IHt9O1xuXHRcdFx0XHR2YXIgJGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcblx0XHRcdH0gY2F0Y2goZXJyb3IpIHt9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0oKSk7XG5cdFx0dmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cdFx0dmFyIGVuZHNXaXRoID0gZnVuY3Rpb24oc2VhcmNoKSB7XG5cdFx0XHRpZiAodGhpcyA9PSBudWxsKSB7XG5cdFx0XHRcdHRocm93IFR5cGVFcnJvcigpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcblx0XHRcdGlmIChzZWFyY2ggJiYgdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG5cdFx0XHRcdHRocm93IFR5cGVFcnJvcigpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cdFx0XHR2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG5cdFx0XHR2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcblx0XHRcdHZhciBwb3MgPSBzdHJpbmdMZW5ndGg7XG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0dmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuXHRcdFx0XHRpZiAocG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIGBUb0ludGVnZXJgXG5cdFx0XHRcdFx0cG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcblx0XHRcdFx0XHRpZiAocG9zICE9IHBvcykgeyAvLyBiZXR0ZXIgYGlzTmFOYFxuXHRcdFx0XHRcdFx0cG9zID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuXHRcdFx0dmFyIHN0YXJ0ID0gZW5kIC0gc2VhcmNoTGVuZ3RoO1xuXHRcdFx0aWYgKHN0YXJ0IDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdHdoaWxlICgrK2luZGV4IDwgc2VhcmNoTGVuZ3RoKSB7XG5cdFx0XHRcdGlmIChzdHJpbmcuY2hhckNvZGVBdChzdGFydCArIGluZGV4KSAhPSBzZWFyY2hTdHJpbmcuY2hhckNvZGVBdChpbmRleCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cdFx0aWYgKGRlZmluZVByb3BlcnR5KSB7XG5cdFx0XHRkZWZpbmVQcm9wZXJ0eShTdHJpbmcucHJvdG90eXBlLCAnZW5kc1dpdGgnLCB7XG5cdFx0XHRcdCd2YWx1ZSc6IGVuZHNXaXRoLFxuXHRcdFx0XHQnY29uZmlndXJhYmxlJzogdHJ1ZSxcblx0XHRcdFx0J3dyaXRhYmxlJzogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGggPSBlbmRzV2l0aDtcblx0XHR9XG5cdH0oKSk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aC9lbmRzd2l0aC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBDb29raWVzLmpzIC0gMS4yLjNcclxuICogaHR0cHM6Ly9naXRodWIuY29tL1Njb3R0SGFtcGVyL0Nvb2tpZXNcclxuICpcclxuICogVGhpcyBpcyBmcmVlIGFuZCB1bmVuY3VtYmVyZWQgc29mdHdhcmUgcmVsZWFzZWQgaW50byB0aGUgcHVibGljIGRvbWFpbi5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgZmFjdG9yeSA9IGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29raWVzLmpzIHJlcXVpcmVzIGEgYHdpbmRvd2Agd2l0aCBhIGBkb2N1bWVudGAgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgQ29va2llcyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cclxuICAgICAgICAgICAgICAgIENvb2tpZXMuZ2V0KGtleSkgOiBDb29raWVzLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgZm9yIHNldHRlciBpbmplY3Rpb24gaW4gdW5pdCB0ZXN0c1xyXG4gICAgICAgIENvb2tpZXMuX2RvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuICAgICAgICAvLyBVc2VkIHRvIGVuc3VyZSBjb29raWUga2V5cyBkbyBub3QgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgLy8gYnVpbHQtaW4gYE9iamVjdGAgcHJvcGVydGllc1xyXG4gICAgICAgIENvb2tpZXMuX2NhY2hlS2V5UHJlZml4ID0gJ2Nvb2tleS4nOyAvLyBIdXJyIGh1cnIsIDopXHJcbiAgICAgICAgXHJcbiAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCdGcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IFVUQycpO1xyXG5cclxuICAgICAgICBDb29raWVzLmRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBwYXRoOiAnLycsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKENvb2tpZXMuX2NhY2hlZERvY3VtZW50Q29va2llICE9PSBDb29raWVzLl9kb2N1bWVudC5jb29raWUpIHtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuX3JlbmV3Q2FjaGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gQ29va2llcy5fY2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBrZXldO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHBpcmVzID0gQ29va2llcy5fZ2V0RXhwaXJlc0RhdGUodmFsdWUgPT09IHVuZGVmaW5lZCA/IC0xIDogb3B0aW9ucy5leHBpcmVzKTtcclxuXHJcbiAgICAgICAgICAgIENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZSA9IENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nKGtleSwgdmFsdWUsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5leHBpcmUgPSBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzLnNldChrZXksIHVuZGVmaW5lZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0RXh0ZW5kZWRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IG9wdGlvbnMgJiYgb3B0aW9ucy5wYXRoIHx8IENvb2tpZXMuZGVmYXVsdHMucGF0aCxcclxuICAgICAgICAgICAgICAgIGRvbWFpbjogb3B0aW9ucyAmJiBvcHRpb25zLmRvbWFpbiB8fCBDb29raWVzLmRlZmF1bHRzLmRvbWFpbixcclxuICAgICAgICAgICAgICAgIGV4cGlyZXM6IG9wdGlvbnMgJiYgb3B0aW9ucy5leHBpcmVzIHx8IENvb2tpZXMuZGVmYXVsdHMuZXhwaXJlcyxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogb3B0aW9ucyAmJiBvcHRpb25zLnNlY3VyZSAhPT0gdW5kZWZpbmVkID8gIG9wdGlvbnMuc2VjdXJlIDogQ29va2llcy5kZWZhdWx0cy5zZWN1cmVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9pc1ZhbGlkRGF0ZSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZSkgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAhaXNOYU4oZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4cGlyZXNEYXRlID0gZnVuY3Rpb24gKGV4cGlyZXMsIG5vdykge1xyXG4gICAgICAgICAgICBub3cgPSBub3cgfHwgbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIGV4cGlyZXMgPSBleHBpcmVzID09PSBJbmZpbml0eSA/XHJcbiAgICAgICAgICAgICAgICAgICAgQ29va2llcy5fbWF4RXhwaXJlRGF0ZSA6IG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyBleHBpcmVzICogMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gbmV3IERhdGUoZXhwaXJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChleHBpcmVzICYmICFDb29raWVzLl9pc1ZhbGlkRGF0ZShleHBpcmVzKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZXhwaXJlc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBEYXRlIGluc3RhbmNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBleHBpcmVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dlbmVyYXRlQ29va2llU3RyaW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1teIyQmK1xcXmB8XS9nLCBlbmNvZGVVUklDb21wb25lbnQpO1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFwoL2csICclMjgnKS5yZXBsYWNlKC9cXCkvZywgJyUyOScpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSArICcnKS5yZXBsYWNlKC9bXiEjJCYtK1xcLS06PC1cXFtcXF0tfl0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgICAgICB2YXIgY29va2llU3RyaW5nID0ga2V5ICsgJz0nICsgdmFsdWU7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnBhdGggPyAnO3BhdGg9JyArIG9wdGlvbnMucGF0aCA6ICcnO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5kb21haW4gPyAnO2RvbWFpbj0nICsgb3B0aW9ucy5kb21haW4gOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZXhwaXJlcyA/ICc7ZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuc2VjdXJlID8gJztzZWN1cmUnIDogJyc7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llU3RyaW5nO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyA9IGZ1bmN0aW9uIChkb2N1bWVudENvb2tpZSkge1xyXG4gICAgICAgICAgICB2YXIgY29va2llQ2FjaGUgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXNBcnJheSA9IGRvY3VtZW50Q29va2llID8gZG9jdW1lbnRDb29raWUuc3BsaXQoJzsgJykgOiBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29va2llS3ZwID0gQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyhjb29raWVzQXJyYXlbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb29raWVDYWNoZVtDb29raWVzLl9jYWNoZUtleVByZWZpeCArIGNvb2tpZUt2cC5rZXldID0gY29va2llS3ZwLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29va2llQ2FjaGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fZ2V0S2V5VmFsdWVQYWlyRnJvbUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChjb29raWVTdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8gXCI9XCIgaXMgYSB2YWxpZCBjaGFyYWN0ZXIgaW4gYSBjb29raWUgdmFsdWUgYWNjb3JkaW5nIHRvIFJGQzYyNjUsIHNvIGNhbm5vdCBgc3BsaXQoJz0nKWBcclxuICAgICAgICAgICAgdmFyIHNlcGFyYXRvckluZGV4ID0gY29va2llU3RyaW5nLmluZGV4T2YoJz0nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElFIG9taXRzIHRoZSBcIj1cIiB3aGVuIHRoZSBjb29raWUgdmFsdWUgaXMgYW4gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgICAgIHNlcGFyYXRvckluZGV4ID0gc2VwYXJhdG9ySW5kZXggPCAwID8gY29va2llU3RyaW5nLmxlbmd0aCA6IHNlcGFyYXRvckluZGV4O1xyXG5cclxuICAgICAgICAgICAgdmFyIGtleSA9IGNvb2tpZVN0cmluZy5zdWJzdHIoMCwgc2VwYXJhdG9ySW5kZXgpO1xyXG4gICAgICAgICAgICB2YXIgZGVjb2RlZEtleTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRlY29kZWRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgZGVjb2RlIGNvb2tpZSB3aXRoIGtleSBcIicgKyBrZXkgKyAnXCInLCBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGtleTogZGVjb2RlZEtleSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBjb29raWVTdHJpbmcuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkgLy8gRGVmZXIgZGVjb2RpbmcgdmFsdWUgdW50aWwgYWNjZXNzZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZSA9IENvb2tpZXMuX2dldENhY2hlRnJvbVN0cmluZyhDb29raWVzLl9kb2N1bWVudC5jb29raWUpO1xyXG4gICAgICAgICAgICBDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSA9IENvb2tpZXMuX2RvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9hcmVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVzdEtleSA9ICdjb29raWVzLmpzJztcclxuICAgICAgICAgICAgdmFyIGFyZUVuYWJsZWQgPSBDb29raWVzLnNldCh0ZXN0S2V5LCAxKS5nZXQodGVzdEtleSkgPT09ICcxJztcclxuICAgICAgICAgICAgQ29va2llcy5leHBpcmUodGVzdEtleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmVFbmFibGVkO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZW5hYmxlZCA9IENvb2tpZXMuX2FyZUVuYWJsZWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvb2tpZXM7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNvb2tpZXNFeHBvcnQgPSAoZ2xvYmFsICYmIHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnKSA/IGZhY3RvcnkoZ2xvYmFsKSA6IGZhY3Rvcnk7XHJcblxyXG4gICAgLy8gQU1EIHN1cHBvcnRcclxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gY29va2llc0V4cG9ydDsgfSk7XHJcbiAgICAvLyBDb21tb25KUy9Ob2RlLmpzIHN1cHBvcnRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBOb2RlLmpzIHNwZWNpZmljIGBtb2R1bGUuZXhwb3J0c2AgKHdoaWNoIGNhbiBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEJ1dCBhbHdheXMgc3VwcG9ydCBDb21tb25KUyBtb2R1bGUgMS4xLjEgc3BlYyAoYGV4cG9ydHNgIGNhbm5vdCBiZSBhIGZ1bmN0aW9uKVxyXG4gICAgICAgIGV4cG9ydHMuQ29va2llcyA9IGNvb2tpZXNFeHBvcnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdsb2JhbC5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH1cclxufSkodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY29va2llcy1qcy9kaXN0L2Nvb2tpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjpcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2RlLURFLmpzb25cbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1wid2ViU2VjdXJpdHlXYXJuaW5nXCI6XCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJ9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcIndlYlNlY3VyaXR5V2FybmluZ1wiOlwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwifVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvblxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjpcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb25cbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1wid2ViU2VjdXJpdHlXYXJuaW5nXCI6XCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJ9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcIndlYlNlY3VyaXR5V2FybmluZ1wiOlwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwifVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvblxuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjpcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb25cbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1wid2ViU2VjdXJpdHlXYXJuaW5nXCI6XCJ3d1RvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb25cbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICoganNVcmlcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXJlay13YXRzb24vanNVcmlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMywgRGVyZWsgV2F0c29uXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKlxuICogSW5jbHVkZXMgcGFyc2VVcmkgcmVndWxhciBleHByZXNzaW9uc1xuICogaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL3BhcnNldXJpXG4gKiBDb3B5cmlnaHQgMjAwNywgU3RldmVuIExldml0aGFuXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG5cbiAgdmFyIHJlID0ge1xuICAgIHN0YXJ0c193aXRoX3NsYXNoZXM6IC9eXFwvKy8sXG4gICAgZW5kc193aXRoX3NsYXNoZXM6IC9cXC8rJC8sXG4gICAgcGx1c2VzOiAvXFwrL2csXG4gICAgcXVlcnlfc2VwYXJhdG9yOiAvWyY7XS8sXG4gICAgdXJpX3BhcnNlcjogL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXFwvXSopKD86OihbXjpAXSopKT8pP0ApPyhcXFtbMC05YS1mQS1GOi5dK1xcXXxbXjpcXC8/I10qKSg/OjooXFxkK3woPz06KSkpPyg6KT8pKCgoKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pL1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWZpbmUgZm9yRWFjaCBmb3Igb2xkZXIganMgZW52aXJvbm1lbnRzXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoI0NvbXBhdGliaWxpdHlcbiAgICovXG4gIGlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgVCwgaztcblxuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCcgdGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIFQgPSB0aGlzQXJnO1xuICAgICAgfVxuXG4gICAgICBrID0gMDtcblxuICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgICAgdmFyIGtWYWx1ZTtcbiAgICAgICAgaWYgKGsgaW4gTykge1xuICAgICAgICAgIGtWYWx1ZSA9IE9ba107XG4gICAgICAgICAgY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuICAgICAgICB9XG4gICAgICAgIGsrKztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIHVuZXNjYXBlIGEgcXVlcnkgcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzIGVuY29kZWQgdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfSAgIGRlY29kZWQgdmFsdWVcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29kZShzKSB7XG4gICAgaWYgKHMpIHtcbiAgICAgICAgcyA9IHMudG9TdHJpbmcoKS5yZXBsYWNlKHJlLnBsdXNlcywgJyUyMCcpO1xuICAgICAgICBzID0gZGVjb2RlVVJJQ29tcG9uZW50KHMpO1xuICAgIH1cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIC8qKlxuICAgKiBCcmVha3MgYSB1cmkgc3RyaW5nIGRvd24gaW50byBpdHMgaW5kaXZpZHVhbCBwYXJ0c1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciB1cmlcbiAgICogQHJldHVybiB7b2JqZWN0fSAgICAgcGFydHNcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICAgIHZhciBwYXJzZXIgPSByZS51cmlfcGFyc2VyO1xuICAgIHZhciBwYXJzZXJLZXlzID0gW1wic291cmNlXCIsIFwicHJvdG9jb2xcIiwgXCJhdXRob3JpdHlcIiwgXCJ1c2VySW5mb1wiLCBcInVzZXJcIiwgXCJwYXNzd29yZFwiLCBcImhvc3RcIiwgXCJwb3J0XCIsIFwiaXNDb2xvblVyaVwiLCBcInJlbGF0aXZlXCIsIFwicGF0aFwiLCBcImRpcmVjdG9yeVwiLCBcImZpbGVcIiwgXCJxdWVyeVwiLCBcImFuY2hvclwiXTtcbiAgICB2YXIgbSA9IHBhcnNlci5leGVjKHN0ciB8fCAnJyk7XG4gICAgdmFyIHBhcnRzID0ge307XG5cbiAgICBwYXJzZXJLZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpKSB7XG4gICAgICBwYXJ0c1trZXldID0gbVtpXSB8fCAnJztcbiAgICB9KTtcblxuICAgIHJldHVybiBwYXJ0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBCcmVha3MgYSBxdWVyeSBzdHJpbmcgZG93biBpbnRvIGFuIGFycmF5IG9mIGtleS92YWx1ZSBwYWlyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciBxdWVyeVxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICBhcnJheSBvZiBhcnJheXMgKGtleS92YWx1ZSBwYWlycylcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlUXVlcnkoc3RyKSB7XG4gICAgdmFyIGksIHBzLCBwLCBuLCBrLCB2LCBsO1xuICAgIHZhciBwYWlycyA9IFtdO1xuXG4gICAgaWYgKHR5cGVvZihzdHIpID09PSAndW5kZWZpbmVkJyB8fCBzdHIgPT09IG51bGwgfHwgc3RyID09PSAnJykge1xuICAgICAgcmV0dXJuIHBhaXJzO1xuICAgIH1cblxuICAgIGlmIChzdHIuaW5kZXhPZignPycpID09PSAwKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHBzID0gc3RyLnRvU3RyaW5nKCkuc3BsaXQocmUucXVlcnlfc2VwYXJhdG9yKTtcblxuICAgIGZvciAoaSA9IDAsIGwgPSBwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHAgPSBwc1tpXTtcbiAgICAgIG4gPSBwLmluZGV4T2YoJz0nKTtcblxuICAgICAgaWYgKG4gIT09IDApIHtcbiAgICAgICAgayA9IGRlY29kZShwLnN1YnN0cmluZygwLCBuKSk7XG4gICAgICAgIHYgPSBkZWNvZGUocC5zdWJzdHJpbmcobiArIDEpKTtcbiAgICAgICAgcGFpcnMucHVzaChuID09PSAtMSA/IFtwLCBudWxsXSA6IFtrLCB2XSk7XG4gICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVXJpIG9iamVjdFxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKi9cbiAgZnVuY3Rpb24gVXJpKHN0cikge1xuICAgIHRoaXMudXJpUGFydHMgPSBwYXJzZVVyaShzdHIpO1xuICAgIHRoaXMucXVlcnlQYWlycyA9IHBhcnNlUXVlcnkodGhpcy51cmlQYXJ0cy5xdWVyeSk7XG4gICAgdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGdldHRlci9zZXR0ZXIgbWV0aG9kc1xuICAgKi9cbiAgWydwcm90b2NvbCcsICd1c2VySW5mbycsICdob3N0JywgJ3BvcnQnLCAncGF0aCcsICdhbmNob3InXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIFVyaS5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMudXJpUGFydHNba2V5XSA9IHZhbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnVyaVBhcnRzW2tleV07XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIGlmIHRoZXJlIGlzIG5vIHByb3RvY29sLCB0aGUgbGVhZGluZyAvLyBjYW4gYmUgZW5hYmxlZCBvciBkaXNhYmxlZFxuICAgKiBAcGFyYW0gIHtCb29sZWFufSAgdmFsXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBVcmkucHJvdG90eXBlLmhhc0F1dGhvcml0eVByZWZpeCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9IHZhbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNBdXRob3JpdHlQcmVmaXhVc2VyUHJlZiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICh0aGlzLnVyaVBhcnRzLnNvdXJjZS5pbmRleE9mKCcvLycpICE9PSAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0F1dGhvcml0eVByZWZpeFVzZXJQcmVmO1xuICAgIH1cbiAgfTtcblxuICBVcmkucHJvdG90eXBlLmlzQ29sb25VcmkgPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnVyaVBhcnRzLmlzQ29sb25VcmkgPSAhIXZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhdGhpcy51cmlQYXJ0cy5pc0NvbG9uVXJpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2VyaWFsaXplcyB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHF1ZXJ5IHBhaXJzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gW3ZhbF0gICBzZXQgYSBuZXcgcXVlcnkgc3RyaW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICBxdWVyeSBzdHJpbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpIHtcbiAgICB2YXIgcyA9ICcnLCBpLCBwYXJhbSwgbDtcblxuICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5xdWVyeVBhaXJzID0gcGFyc2VRdWVyeSh2YWwpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGlmIChzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcyArPSAnJic7XG4gICAgICB9XG4gICAgICBpZiAocGFyYW1bMV0gPT09IG51bGwpIHtcbiAgICAgICAgcyArPSBwYXJhbVswXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHMgKz0gcGFyYW1bMF07XG4gICAgICAgIHMgKz0gJz0nO1xuICAgICAgICBpZiAodHlwZW9mIHBhcmFtWzFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHMgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtWzFdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcy5sZW5ndGggPiAwID8gJz8nICsgcyA6IHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGZpcnN0IHF1ZXJ5IHBhcmFtIHZhbHVlIGZvdW5kIGZvciB0aGUga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5IHF1ZXJ5IGtleVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICBmaXJzdCB2YWx1ZSBmb3VuZCBmb3Iga2V5XG4gICAqL1xuICBVcmkucHJvdG90eXBlLmdldFF1ZXJ5UGFyYW1WYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgcGFyYW0sIGksIGw7XG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gcGFyYW1bMF0pIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtWzFdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJucyBhbiBhcnJheSBvZiBxdWVyeSBwYXJhbSB2YWx1ZXMgZm9yIHRoZSBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgcXVlcnkga2V5XG4gICAqIEByZXR1cm4ge2FycmF5fSAgICAgIGFycmF5IG9mIHZhbHVlc1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5nZXRRdWVyeVBhcmFtVmFsdWVzID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBhcnIgPSBbXSwgaSwgcGFyYW0sIGw7XG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgaWYgKGtleSA9PT0gcGFyYW1bMF0pIHtcbiAgICAgICAgYXJyLnB1c2gocGFyYW1bMV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZW1vdmVzIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgICAgIHJlbW92ZSB2YWx1ZXMgZm9yIGtleVxuICAgKiBAcGFyYW0gIHt2YWx9ICAgIFt2YWxdICAgcmVtb3ZlIGEgc3BlY2lmaWMgdmFsdWUsIG90aGVyd2lzZSByZW1vdmVzIGFsbFxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuZGVsZXRlUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHZhciBhcnIgPSBbXSwgaSwgcGFyYW0sIGtleU1hdGNoZXNGaWx0ZXIsIHZhbE1hdGNoZXNGaWx0ZXIsIGw7XG5cbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXG4gICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgIGtleU1hdGNoZXNGaWx0ZXIgPSBkZWNvZGUocGFyYW1bMF0pID09PSBkZWNvZGUoa2V5KTtcbiAgICAgIHZhbE1hdGNoZXNGaWx0ZXIgPSBwYXJhbVsxXSA9PT0gdmFsO1xuXG4gICAgICBpZiAoKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgIWtleU1hdGNoZXNGaWx0ZXIpIHx8IChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmICgha2V5TWF0Y2hlc0ZpbHRlciB8fCAhdmFsTWF0Y2hlc0ZpbHRlcikpKSB7XG4gICAgICAgIGFyci5wdXNoKHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJ5UGFpcnMgPSBhcnI7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogYWRkcyBhIHF1ZXJ5IHBhcmFtZXRlclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBrZXkgICAgICAgIGFkZCB2YWx1ZXMgZm9yIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB2YWwgICAgICAgIHZhbHVlIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtpbnRlZ2VyfSBbaW5kZXhdICAgIHNwZWNpZmljIGluZGV4IHRvIGFkZCB0aGUgdmFsdWUgYXRcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5hZGRRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSwgdmFsLCBpbmRleCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGluZGV4ICE9PSAtMSkge1xuICAgICAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgdGhpcy5xdWVyeVBhaXJzLmxlbmd0aCk7XG4gICAgICB0aGlzLnF1ZXJ5UGFpcnMuc3BsaWNlKGluZGV4LCAwLCBba2V5LCB2YWxdKTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnF1ZXJ5UGFpcnMucHVzaChba2V5LCB2YWxdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIHRlc3QgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYSBxdWVyeSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSAga2V5ICAgICAgICBhZGQgdmFsdWVzIGZvciBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgdmFsICAgICAgICB2YWx1ZSB0byBhZGRcbiAgICogQHBhcmFtICB7aW50ZWdlcn0gW2luZGV4XSAgICBzcGVjaWZpYyBpbmRleCB0byBhZGQgdGhlIHZhbHVlIGF0XG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuaGFzUXVlcnlQYXJhbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgaSwgbGVuID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnF1ZXJ5UGFpcnNbaV1bMF0gPT0ga2V5KVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXBsYWNlcyBxdWVyeSBwYXJhbSB2YWx1ZXNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgICAgICAgICBrZXkgdG8gcmVwbGFjZSB2YWx1ZSBmb3JcbiAgICogQHBhcmFtICB7c3RyaW5nfSBuZXdWYWwgICAgICBuZXcgdmFsdWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBbb2xkVmFsXSAgICByZXBsYWNlIG9ubHkgb25lIHNwZWNpZmljIHZhbHVlIChvdGhlcndpc2UgcmVwbGFjZXMgYWxsKVxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnJlcGxhY2VRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSwgbmV3VmFsLCBvbGRWYWwpIHtcbiAgICB2YXIgaW5kZXggPSAtMSwgbGVuID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aCwgaSwgcGFyYW07XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgICBpZiAoZGVjb2RlKHBhcmFtWzBdKSA9PT0gZGVjb2RlKGtleSkgJiYgZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtWzFdKSA9PT0gZGVjb2RlKG9sZFZhbCkpIHtcbiAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlUXVlcnlQYXJhbShrZXksIGRlY29kZShvbGRWYWwpKS5hZGRRdWVyeVBhcmFtKGtleSwgbmV3VmFsLCBpbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJhbSA9IHRoaXMucXVlcnlQYWlyc1tpXTtcbiAgICAgICAgaWYgKGRlY29kZShwYXJhbVswXSkgPT09IGRlY29kZShrZXkpKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRlbGV0ZVF1ZXJ5UGFyYW0oa2V5KTtcbiAgICAgIHRoaXMuYWRkUXVlcnlQYXJhbShrZXksIG5ld1ZhbCwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRGVmaW5lIGZsdWVudCBzZXR0ZXIgbWV0aG9kcyAoc2V0UHJvdG9jb2wsIHNldEhhc0F1dGhvcml0eVByZWZpeCwgZXRjKVxuICAgKi9cbiAgWydwcm90b2NvbCcsICdoYXNBdXRob3JpdHlQcmVmaXgnLCAnaXNDb2xvblVyaScsICd1c2VySW5mbycsICdob3N0JywgJ3BvcnQnLCAncGF0aCcsICdxdWVyeScsICdhbmNob3InXS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBtZXRob2QgPSAnc2V0JyArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKTtcbiAgICBVcmkucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHRoaXNba2V5XSh2YWwpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNjaGVtZSBuYW1lLCBjb2xvbiBhbmQgZG91Ymxlc2xhc2gsIGFzIHJlcXVpcmVkXG4gICAqIEByZXR1cm4ge3N0cmluZ30gaHR0cDovLyBvciBwb3NzaWJseSBqdXN0IC8vXG4gICAqL1xuICBVcmkucHJvdG90eXBlLnNjaGVtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzID0gJyc7XG5cbiAgICBpZiAodGhpcy5wcm90b2NvbCgpKSB7XG4gICAgICBzICs9IHRoaXMucHJvdG9jb2woKTtcbiAgICAgIGlmICh0aGlzLnByb3RvY29sKCkuaW5kZXhPZignOicpICE9PSB0aGlzLnByb3RvY29sKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICBzICs9ICc6JztcbiAgICAgIH1cbiAgICAgIHMgKz0gJy8vJztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4KCkgJiYgdGhpcy5ob3N0KCkpIHtcbiAgICAgICAgcyArPSAnLy8nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTYW1lIGFzIE1vemlsbGEgbnNJVVJJLnByZVBhdGhcbiAgICogQHJldHVybiB7c3RyaW5nfSBzY2hlbWU6Ly91c2VyOnBhc3N3b3JkQGhvc3Q6cG9ydFxuICAgKiBAc2VlICBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9uc0lVUklcbiAgICovXG4gIFVyaS5wcm90b3R5cGUub3JpZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHMgPSB0aGlzLnNjaGVtZSgpO1xuXG4gICAgaWYgKHRoaXMudXNlckluZm8oKSAmJiB0aGlzLmhvc3QoKSkge1xuICAgICAgcyArPSB0aGlzLnVzZXJJbmZvKCk7XG4gICAgICBpZiAodGhpcy51c2VySW5mbygpLmluZGV4T2YoJ0AnKSAhPT0gdGhpcy51c2VySW5mbygpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcyArPSAnQCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdCgpKSB7XG4gICAgICBzICs9IHRoaXMuaG9zdCgpO1xuICAgICAgaWYgKHRoaXMucG9ydCgpIHx8ICh0aGlzLnBhdGgoKSAmJiB0aGlzLnBhdGgoKS5zdWJzdHIoMCwgMSkubWF0Y2goL1swLTldLykpKSB7XG4gICAgICAgIHMgKz0gJzonICsgdGhpcy5wb3J0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0cmFpbGluZyBzbGFzaCB0byB0aGUgcGF0aFxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5hZGRUcmFpbGluZ1NsYXNoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGggPSB0aGlzLnBhdGgoKSB8fCAnJztcblxuICAgIGlmIChwYXRoLnN1YnN0cigtMSkgIT09ICcvJykge1xuICAgICAgdGhpcy5wYXRoKHBhdGggKyAnLycpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgVXJpIG9iamVjdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBVcmkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGgsIHMgPSB0aGlzLm9yaWdpbigpO1xuXG4gICAgaWYgKHRoaXMuaXNDb2xvblVyaSgpKSB7XG4gICAgICBpZiAodGhpcy5wYXRoKCkpIHtcbiAgICAgICAgcyArPSAnOicrdGhpcy5wYXRoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnBhdGgoKSkge1xuICAgICAgcGF0aCA9IHRoaXMucGF0aCgpO1xuICAgICAgaWYgKCEocmUuZW5kc193aXRoX3NsYXNoZXMudGVzdChzKSB8fCByZS5zdGFydHNfd2l0aF9zbGFzaGVzLnRlc3QocGF0aCkpKSB7XG4gICAgICAgIHMgKz0gJy8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICBzLnJlcGxhY2UocmUuZW5kc193aXRoX3NsYXNoZXMsICcvJyk7XG4gICAgICAgIH1cbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZShyZS5zdGFydHNfd2l0aF9zbGFzaGVzLCAnLycpO1xuICAgICAgfVxuICAgICAgcyArPSBwYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5ob3N0KCkgJiYgKHRoaXMucXVlcnkoKS50b1N0cmluZygpIHx8IHRoaXMuYW5jaG9yKCkpKSB7XG4gICAgICAgIHMgKz0gJy8nO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeSgpLnRvU3RyaW5nKCkpIHtcbiAgICAgIHMgKz0gdGhpcy5xdWVyeSgpLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5jaG9yKCkpIHtcbiAgICAgIGlmICh0aGlzLmFuY2hvcigpLmluZGV4T2YoJyMnKSAhPT0gMCkge1xuICAgICAgICBzICs9ICcjJztcbiAgICAgIH1cbiAgICAgIHMgKz0gdGhpcy5hbmNob3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogQ2xvbmUgYSBVcmkgb2JqZWN0XG4gICAqIEByZXR1cm4ge1VyaX0gZHVwbGljYXRlIGNvcHkgb2YgdGhlIFVyaVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVXJpKHRoaXMudG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIGV4cG9ydCB2aWEgQU1EIG9yIENvbW1vbkpTLCBvdGhlcndpc2UgbGVhayBhIGdsb2JhbFxuICAgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBVcmk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gVXJpO1xuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5VcmkgPSBVcmk7XG4gIH1cbn0odGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2pzdXJpL1VyaS5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTYgVGhlIFF0IENvbXBhbnkgTHRkLlxuKiogQ29weXJpZ2h0IChDKSAyMDE2IEtsYXLDpGx2ZGFsZW5zIERhdGFrb25zdWx0IEFCLCBhIEtEQUIgR3JvdXAgY29tcGFueSwgaW5mb0BrZGFiLmNvbSwgYXV0aG9yIE1pbGlhbiBXb2xmZiA8bWlsaWFuLndvbGZmQGtkYWIuY29tPlxuKiogQ29udGFjdDogaHR0cHM6Ly93d3cucXQuaW8vbGljZW5zaW5nL1xuKipcbioqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBRdFdlYkNoYW5uZWwgbW9kdWxlIG9mIHRoZSBRdCBUb29sa2l0LlxuKipcbioqICRRVF9CRUdJTl9MSUNFTlNFOkxHUEwkXG4qKiBDb21tZXJjaWFsIExpY2Vuc2UgVXNhZ2VcbioqIExpY2Vuc2VlcyBob2xkaW5nIHZhbGlkIGNvbW1lcmNpYWwgUXQgbGljZW5zZXMgbWF5IHVzZSB0aGlzIGZpbGUgaW5cbioqIGFjY29yZGFuY2Ugd2l0aCB0aGUgY29tbWVyY2lhbCBsaWNlbnNlIGFncmVlbWVudCBwcm92aWRlZCB3aXRoIHRoZVxuKiogU29mdHdhcmUgb3IsIGFsdGVybmF0aXZlbHksIGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgdGVybXMgY29udGFpbmVkIGluXG4qKiBhIHdyaXR0ZW4gYWdyZWVtZW50IGJldHdlZW4geW91IGFuZCBUaGUgUXQgQ29tcGFueS4gRm9yIGxpY2Vuc2luZyB0ZXJtc1xuKiogYW5kIGNvbmRpdGlvbnMgc2VlIGh0dHBzOi8vd3d3LnF0LmlvL3Rlcm1zLWNvbmRpdGlvbnMuIEZvciBmdXJ0aGVyXG4qKiBpbmZvcm1hdGlvbiB1c2UgdGhlIGNvbnRhY3QgZm9ybSBhdCBodHRwczovL3d3dy5xdC5pby9jb250YWN0LXVzLlxuKipcbioqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBVc2FnZVxuKiogQWx0ZXJuYXRpdmVseSwgdGhpcyBmaWxlIG1heSBiZSB1c2VkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlclxuKiogR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlXG4qKiBGb3VuZGF0aW9uIGFuZCBhcHBlYXJpbmcgaW4gdGhlIGZpbGUgTElDRU5TRS5MR1BMMyBpbmNsdWRlZCBpbiB0aGVcbioqIHBhY2thZ2luZyBvZiB0aGlzIGZpbGUuIFBsZWFzZSByZXZpZXcgdGhlIGZvbGxvd2luZyBpbmZvcm1hdGlvbiB0b1xuKiogZW5zdXJlIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIHJlcXVpcmVtZW50c1xuKiogd2lsbCBiZSBtZXQ6IGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvbGdwbC0zLjAuaHRtbC5cbioqXG4qKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBVc2FnZVxuKiogQWx0ZXJuYXRpdmVseSwgdGhpcyBmaWxlIG1heSBiZSB1c2VkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VXG4qKiBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMi4wIG9yIChhdCB5b3VyIG9wdGlvbikgdGhlIEdOVSBHZW5lcmFsXG4qKiBQdWJsaWMgbGljZW5zZSB2ZXJzaW9uIDMgb3IgYW55IGxhdGVyIHZlcnNpb24gYXBwcm92ZWQgYnkgdGhlIEtERSBGcmVlXG4qKiBRdCBGb3VuZGF0aW9uLiBUaGUgbGljZW5zZXMgYXJlIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZVxuKiogRm91bmRhdGlvbiBhbmQgYXBwZWFyaW5nIGluIHRoZSBmaWxlIExJQ0VOU0UuR1BMMiBhbmQgTElDRU5TRS5HUEwzXG4qKiBpbmNsdWRlZCBpbiB0aGUgcGFja2FnaW5nIG9mIHRoaXMgZmlsZS4gUGxlYXNlIHJldmlldyB0aGUgZm9sbG93aW5nXG4qKiBpbmZvcm1hdGlvbiB0byBlbnN1cmUgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHJlcXVpcmVtZW50cyB3aWxsXG4qKiBiZSBtZXQ6IGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sIGFuZFxuKiogaHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMy4wLmh0bWwuXG4qKlxuKiogJFFUX0VORF9MSUNFTlNFJFxuKipcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMgPSB7XG4gICAgc2lnbmFsOiAxLFxuICAgIHByb3BlcnR5VXBkYXRlOiAyLFxuICAgIGluaXQ6IDMsXG4gICAgaWRsZTogNCxcbiAgICBkZWJ1ZzogNSxcbiAgICBpbnZva2VNZXRob2Q6IDYsXG4gICAgY29ubmVjdFRvU2lnbmFsOiA3LFxuICAgIGRpc2Nvbm5lY3RGcm9tU2lnbmFsOiA4LFxuICAgIHNldFByb3BlcnR5OiA5LFxuICAgIHJlc3BvbnNlOiAxMCxcbn07XG5cbnZhciBRV2ViQ2hhbm5lbCA9IGZ1bmN0aW9uKHRyYW5zcG9ydCwgaW5pdENhbGxiYWNrKVxue1xuICAgIGlmICh0eXBlb2YgdHJhbnNwb3J0ICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB0cmFuc3BvcnQuc2VuZCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgUVdlYkNoYW5uZWwgZXhwZWN0cyBhIHRyYW5zcG9ydCBvYmplY3Qgd2l0aCBhIHNlbmQgZnVuY3Rpb24gYW5kIG9ubWVzc2FnZSBjYWxsYmFjayBwcm9wZXJ0eS5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgXCIgR2l2ZW4gaXM6IHRyYW5zcG9ydDogXCIgKyB0eXBlb2YodHJhbnNwb3J0KSArIFwiLCB0cmFuc3BvcnQuc2VuZDogXCIgKyB0eXBlb2YodHJhbnNwb3J0LnNlbmQpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjaGFubmVsID0gdGhpcztcbiAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcblxuICAgIHRoaXMuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEpICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC50cmFuc3BvcnQuc2VuZChkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLnRyYW5zcG9ydC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2lnbmFsOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlU2lnbmFsKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5yZXNwb25zZTpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVJlc3BvbnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5wcm9wZXJ0eVVwZGF0ZTpcbiAgICAgICAgICAgICAgICBjaGFubmVsLmhhbmRsZVByb3BlcnR5VXBkYXRlKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiaW52YWxpZCBtZXNzYWdlIHJlY2VpdmVkOlwiLCBtZXNzYWdlLmRhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5leGVjQ2FsbGJhY2tzID0ge307XG4gICAgdGhpcy5leGVjSWQgPSAwO1xuICAgIHRoaXMuZXhlYyA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxuICAgIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gaWYgbm8gY2FsbGJhY2sgaXMgZ2l2ZW4sIHNlbmQgZGlyZWN0bHlcbiAgICAgICAgICAgIGNoYW5uZWwuc2VuZChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbm5lbC5leGVjSWQgPT09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgICAgICAgIC8vIHdyYXBcbiAgICAgICAgICAgIGNoYW5uZWwuZXhlY0lkID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGV4ZWMgbWVzc2FnZSB3aXRoIHByb3BlcnR5IGlkOiBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLmlkID0gY2hhbm5lbC5leGVjSWQrKztcbiAgICAgICAgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW2RhdGEuaWRdID0gY2FsbGJhY2s7XG4gICAgICAgIGNoYW5uZWwuc2VuZChkYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vYmplY3RzID0ge307XG5cbiAgICB0aGlzLmhhbmRsZVNpZ25hbCA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgb2JqZWN0ID0gY2hhbm5lbC5vYmplY3RzW21lc3NhZ2Uub2JqZWN0XTtcbiAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgb2JqZWN0LnNpZ25hbEVtaXR0ZWQobWVzc2FnZS5zaWduYWwsIG1lc3NhZ2UuYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgc2lnbmFsOiBcIiArIG1lc3NhZ2Uub2JqZWN0ICsgXCI6OlwiICsgbWVzc2FnZS5zaWduYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBpZiAoIW1lc3NhZ2UuaGFzT3duUHJvcGVydHkoXCJpZFwiKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcmVzcG9uc2UgbWVzc2FnZSByZWNlaXZlZDogXCIsIEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWNDYWxsYmFja3NbbWVzc2FnZS5pZF0obWVzc2FnZS5kYXRhKTtcbiAgICAgICAgZGVsZXRlIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1ttZXNzYWdlLmlkXTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVByb3BlcnR5VXBkYXRlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gbWVzc2FnZS5kYXRhKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YVtpXTtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBjaGFubmVsLm9iamVjdHNbZGF0YS5vYmplY3RdO1xuICAgICAgICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIG9iamVjdC5wcm9wZXJ0eVVwZGF0ZShkYXRhLnNpZ25hbHMsIGRhdGEucHJvcGVydGllcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuaGFuZGxlZCBwcm9wZXJ0eSB1cGRhdGU6IFwiICsgZGF0YS5vYmplY3QgKyBcIjo6XCIgKyBkYXRhLnNpZ25hbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pZGxlfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1ZyA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICBjaGFubmVsLnNlbmQoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmRlYnVnLCBkYXRhOiBtZXNzYWdlfSk7XG4gICAgfTtcblxuICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaW5pdH0sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZm9yICh2YXIgb2JqZWN0TmFtZSBpbiBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gbmV3IFFPYmplY3Qob2JqZWN0TmFtZSwgZGF0YVtvYmplY3ROYW1lXSwgY2hhbm5lbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm93IHVud3JhcCBwcm9wZXJ0aWVzLCB3aGljaCBtaWdodCByZWZlcmVuY2Ugb3RoZXIgcmVnaXN0ZXJlZCBvYmplY3RzXG4gICAgICAgIGZvciAodmFyIG9iamVjdE5hbWUgaW4gY2hhbm5lbC5vYmplY3RzKSB7XG4gICAgICAgICAgICBjaGFubmVsLm9iamVjdHNbb2JqZWN0TmFtZV0udW53cmFwUHJvcGVydGllcygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbml0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgIGluaXRDYWxsYmFjayhjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmlkbGV9KTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIFFPYmplY3QobmFtZSwgZGF0YSwgd2ViQ2hhbm5lbClcbntcbiAgICB0aGlzLl9faWRfXyA9IG5hbWU7XG4gICAgd2ViQ2hhbm5lbC5vYmplY3RzW25hbWVdID0gdGhpcztcblxuICAgIC8vIExpc3Qgb2YgY2FsbGJhY2tzIHRoYXQgZ2V0IGludm9rZWQgdXBvbiBzaWduYWwgZW1pc3Npb25cbiAgICB0aGlzLl9fb2JqZWN0U2lnbmFsc19fID0ge307XG5cbiAgICAvLyBDYWNoZSBvZiBhbGwgcHJvcGVydGllcywgdXBkYXRlZCB3aGVuIGEgbm90aWZ5IHNpZ25hbCBpcyBlbWl0dGVkXG4gICAgdGhpcy5fX3Byb3BlcnR5Q2FjaGVfXyA9IHt9O1xuXG4gICAgdmFyIG9iamVjdCA9IHRoaXM7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICB0aGlzLnVud3JhcFFPYmplY3QgPSBmdW5jdGlvbihyZXNwb25zZSlcbiAgICB7XG4gICAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0IGxpc3Qgb2Ygb2JqZWN0c1xuICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBBcnJheShyZXNwb25zZS5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHJldFtpXSA9IG9iamVjdC51bndyYXBRT2JqZWN0KHJlc3BvbnNlW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXNwb25zZVxuICAgICAgICAgICAgfHwgIXJlc3BvbnNlW1wiX19RT2JqZWN0Kl9fXCJdXG4gICAgICAgICAgICB8fCByZXNwb25zZS5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2JqZWN0SWQgPSByZXNwb25zZS5pZDtcbiAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0pXG4gICAgICAgICAgICByZXR1cm4gd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgdW53cmFwIHVua25vd24gUU9iamVjdCBcIiArIG9iamVjdElkICsgXCIgd2l0aG91dCBkYXRhLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxT2JqZWN0ID0gbmV3IFFPYmplY3QoIG9iamVjdElkLCByZXNwb25zZS5kYXRhLCB3ZWJDaGFubmVsICk7XG4gICAgICAgIHFPYmplY3QuZGVzdHJveWVkLmNvbm5lY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXSA9PT0gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdO1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBub3cgZGVsZXRlZCBRT2JqZWN0IHRvIGFuIGVtcHR5IHt9IG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGp1c3QgYXNzaWduaW5nIHt9IHRob3VnaCB3b3VsZCBub3QgaGF2ZSB0aGUgZGVzaXJlZCBlZmZlY3QsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBiZWxvdyBhbHNvIGVuc3VyZXMgYWxsIGV4dGVybmFsIHJlZmVyZW5jZXMgd2lsbCBzZWUgdGhlIGVtcHR5IG1hcFxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IHRoaXMgZGV0b3VyIGlzIG5lY2Vzc2FyeSB0byB3b3JrYXJvdW5kIFFUQlVHLTQwMDIxXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcU9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVzLnB1c2gocHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaWR4IGluIHByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHFPYmplY3RbcHJvcGVydHlOYW1lc1tpZHhdXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBoZXJlIHdlIGFyZSBhbHJlYWR5IGluaXRpYWxpemVkLCBhbmQgdGh1cyBtdXN0IGRpcmVjdGx5IHVud3JhcCB0aGUgcHJvcGVydGllc1xuICAgICAgICBxT2JqZWN0LnVud3JhcFByb3BlcnRpZXMoKTtcbiAgICAgICAgcmV0dXJuIHFPYmplY3Q7XG4gICAgfVxuXG4gICAgdGhpcy51bndyYXBQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJZHggaW4gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fKSB7XG4gICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJZHhdID0gb2JqZWN0LnVud3JhcFFPYmplY3Qob2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTaWduYWwoc2lnbmFsRGF0YSwgaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbClcbiAgICB7XG4gICAgICAgIHZhciBzaWduYWxOYW1lID0gc2lnbmFsRGF0YVswXTtcbiAgICAgICAgdmFyIHNpZ25hbEluZGV4ID0gc2lnbmFsRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W3NpZ25hbE5hbWVdID0ge1xuICAgICAgICAgICAgY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gY29ubmVjdCB0byBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ucHVzaChjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzUHJvcGVydHlOb3RpZnlTaWduYWwgJiYgc2lnbmFsTmFtZSAhPT0gXCJkZXN0cm95ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBub3RlIHRoYXQgd2UgYWx3YXlzIGdldCBub3RpZmllZCBhYm91dCB0aGUgZGVzdHJveWVkIHNpZ25hbFxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuY29ubmVjdFRvU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNhbGxiYWNrKSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYWQgY2FsbGJhY2sgZ2l2ZW4gdG8gZGlzY29ubmVjdCBmcm9tIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0gPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZmluZCBjb25uZWN0aW9uIG9mIHNpZ25hbCBcIiArIHNpZ25hbE5hbWUgKyBcIiB0byBcIiArIGNhbGxiYWNrLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxJbmRleF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVxdWlyZWQgZm9yIFwicHVyZVwiIHNpZ25hbHMsIGhhbmRsZWQgc2VwYXJhdGVseSBmb3IgcHJvcGVydGllcyBpbiBwcm9wZXJ0eVVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGlzY29ubmVjdEZyb21TaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduYWw6IHNpZ25hbEluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGFsbCBjYWxsYmFja3MgZm9yIHRoZSBnaXZlbiBzaWduYWxuYW1lLiBBbHNvIHdvcmtzIGZvciBwcm9wZXJ0eSBub3RpZnkgY2FsbGJhY2tzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgdmFyIGNvbm5lY3Rpb25zID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbE5hbWVdO1xuICAgICAgICBpZiAoY29ubmVjdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgc2lnbmFsQXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihzaWduYWxzLCBwcm9wZXJ0eU1hcClcbiAgICB7XG4gICAgICAgIC8vIHVwZGF0ZSBwcm9wZXJ0eSBjYWNoZVxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eUluZGV4IGluIHByb3BlcnR5TWFwKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5TWFwW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIHNpZ25hbE5hbWUgaW4gc2lnbmFscykge1xuICAgICAgICAgICAgLy8gSW52b2tlIGFsbCBjYWxsYmFja3MsIGFzIHNpZ25hbEVtaXR0ZWQoKSBkb2VzIG5vdC4gVGhpcyBlbnN1cmVzIHRoZVxuICAgICAgICAgICAgLy8gcHJvcGVydHkgY2FjaGUgaXMgdXBkYXRlZCBiZWZvcmUgdGhlIGNhbGxiYWNrcyBhcmUgaW52b2tlZC5cbiAgICAgICAgICAgIGludm9rZVNpZ25hbENhbGxiYWNrcyhzaWduYWxOYW1lLCBzaWduYWxzW3NpZ25hbE5hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsRW1pdHRlZCA9IGZ1bmN0aW9uKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpXG4gICAge1xuICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgdGhpcy51bndyYXBRT2JqZWN0KHNpZ25hbEFyZ3MpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRNZXRob2QobWV0aG9kRGF0YSlcbiAgICB7XG4gICAgICAgIHZhciBtZXRob2ROYW1lID0gbWV0aG9kRGF0YVswXTtcbiAgICAgICAgdmFyIG1ldGhvZElkeCA9IG1ldGhvZERhdGFbMV07XG4gICAgICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnQgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBhcmd1bWVudDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhcmd1bWVudCBpbnN0YW5jZW9mIFFPYmplY3QgJiYgd2ViQ2hhbm5lbC5vYmplY3RzW2FyZ3VtZW50Ll9faWRfX10gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogYXJndW1lbnQuX19pZF9fXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZ3VtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaW52b2tlTWV0aG9kLFxuICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogbWV0aG9kSWR4LFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBvYmplY3QudW53cmFwUU9iamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGNhbGxiYWNrKShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmluZEdldHRlclNldHRlcihwcm9wZXJ0eUluZm8pXG4gICAge1xuICAgICAgICB2YXIgcHJvcGVydHlJbmRleCA9IHByb3BlcnR5SW5mb1swXTtcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5SW5mb1sxXTtcbiAgICAgICAgdmFyIG5vdGlmeVNpZ25hbERhdGEgPSBwcm9wZXJ0eUluZm9bMl07XG4gICAgICAgIC8vIGluaXRpYWxpemUgcHJvcGVydHkgY2FjaGUgd2l0aCBjdXJyZW50IHZhbHVlXG4gICAgICAgIC8vIE5PVEU6IGlmIHRoaXMgaXMgYW4gb2JqZWN0LCBpdCBpcyBub3QgZGlyZWN0bHkgdW53cmFwcGVkIGFzIGl0IG1pZ2h0XG4gICAgICAgIC8vIHJlZmVyZW5jZSBvdGhlciBRT2JqZWN0IHRoYXQgd2UgZG8gbm90IGtub3cgeWV0XG4gICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHByb3BlcnR5SW5mb1szXTtcblxuICAgICAgICBpZiAobm90aWZ5U2lnbmFsRGF0YSkge1xuICAgICAgICAgICAgaWYgKG5vdGlmeVNpZ25hbERhdGFbMF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBzaWduYWwgbmFtZSBpcyBvcHRpbWl6ZWQgYXdheSwgcmVjb25zdHJ1Y3QgdGhlIGFjdHVhbCBuYW1lXG4gICAgICAgICAgICAgICAgbm90aWZ5U2lnbmFsRGF0YVswXSA9IHByb3BlcnR5TmFtZSArIFwiQ2hhbmdlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkU2lnbmFsKG5vdGlmeVNpZ25hbERhdGEsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHlOYW1lLCB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkbid0IGhhcHBlblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJVbmRlZmluZWQgdmFsdWUgaW4gcHJvcGVydHkgY2FjaGUgZm9yIHByb3BlcnR5IFxcXCJcIiArIHByb3BlcnR5TmFtZSArIFwiXFxcIiBpbiBvYmplY3QgXCIgKyBvYmplY3QuX19pZF9fKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUHJvcGVydHkgc2V0dGVyIGZvciBcIiArIHByb3BlcnR5TmFtZSArIFwiIGNhbGxlZCB3aXRoIHVuZGVmaW5lZCB2YWx1ZSFcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlVG9TZW5kID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlVG9TZW5kIGluc3RhbmNlb2YgUU9iamVjdCAmJiB3ZWJDaGFubmVsLm9iamVjdHNbdmFsdWVUb1NlbmQuX19pZF9fXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVRvU2VuZCA9IHsgXCJpZFwiOiB2YWx1ZVRvU2VuZC5fX2lkX18gfTtcbiAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2V0UHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogcHJvcGVydHlJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVRvU2VuZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRhdGEubWV0aG9kcy5mb3JFYWNoKGFkZE1ldGhvZCk7XG5cbiAgICBkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChiaW5kR2V0dGVyU2V0dGVyKTtcblxuICAgIGRhdGEuc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uKHNpZ25hbCkgeyBhZGRTaWduYWwoc2lnbmFsLCBmYWxzZSk7IH0pO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLmVudW1zKSB7XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IGRhdGEuZW51bXNbbmFtZV07XG4gICAgfVxufVxuXG4vL3JlcXVpcmVkIGZvciB1c2Ugd2l0aCBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBRV2ViQ2hhbm5lbDogUVdlYkNoYW5uZWxcbiAgICB9O1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBVdGlsaXRpZXMgPSByZXF1aXJlKCcuL1V0aWxpdGllcy5qcycpO1xudmFyIFNoYXJlZCA9IHJlcXVpcmUoJy4vU2hhcmVkLmpzJyk7XG52YXIgTmF0aXZlRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4vTmF0aXZlRGlzcGF0Y2hlci5qcycpO1xudmFyIFNpbXVsYXRvckRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL1NpbXVsYXRvckRpc3BhdGNoZXIuanMnKTtcbnZhciBxd2ViY2hhbm5lbCA9IHJlcXVpcmUoJ3F3ZWJjaGFubmVsJyk7XG5cbi8qKiBAbW9kdWxlIFNoaW1MaWJyYXJ5IC0gVGhpcyBtb2R1bGUgZGVmaW5lcyB0aGUgV0RDJ3Mgc2hpbSBsaWJyYXJ5IHdoaWNoIGlzIHVzZWRcbnRvIGJyaWRnZSB0aGUgZ2FwIGJldHdlZW4gdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgV0RDIGFuZCB0aGUgZHJpdmluZyBjb250ZXh0XG5vZiB0aGUgV0RDIChUYWJsZWF1IGRlc2t0b3AsIHRoZSBzaW11bGF0b3IsIGV0Yy4pICovXG5cbi8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBvbmNlIGJvb3RzdHJhcHBpbmcgaGFzIGJlZW4gY29tcGxldGVkIGFuZCB0aGVcbi8vIGRpc3BhdGNoZXIgYW5kIHNoYXJlZCBXREMgb2JqZWN0cyBhcmUgYm90aCBjcmVhdGVkIGFuZCBhdmFpbGFibGVcbmZ1bmN0aW9uIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChfZGlzcGF0Y2hlciwgX3NoYXJlZCkge1xuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wdWJsaWNJbnRlcmZhY2UsIHdpbmRvdy50YWJsZWF1KTtcbiAgVXRpbGl0aWVzLmNvcHlGdW5jdGlvbnMoX2Rpc3BhdGNoZXIucHJpdmF0ZUludGVyZmFjZSwgd2luZG93Ll90YWJsZWF1KTtcbiAgX3NoYXJlZC5pbml0KCk7XG59XG5cbi8vIEluaXRpYWxpemVzIHRoZSB3ZGMgc2hpbSBsaWJyYXJ5LiBZb3UgbXVzdCBjYWxsIHRoaXMgYmVmb3JlIGRvaW5nIGFueXRoaW5nIHdpdGggV0RDXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gVGhlIGluaXRpYWwgY29kZSBoZXJlIGlzIHRoZSBvbmx5IHBsYWNlIGluIG91ciBtb2R1bGUgd2hpY2ggc2hvdWxkIGhhdmUgZ2xvYmFsXG4gIC8vIGtub3dsZWRnZSBvZiBob3cgYWxsIHRoZSBXREMgY29tcG9uZW50cyBhcmUgZ2x1ZWQgdG9nZXRoZXIuIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2VcbiAgLy8gd2hpY2ggd2lsbCBrbm93IGFib3V0IHRoZSB3aW5kb3cgb2JqZWN0IG9yIG90aGVyIGdsb2JhbCBvYmplY3RzLiBUaGlzIGNvZGUgd2lsbCBiZSBydW5cbiAgLy8gaW1tZWRpYXRlbHkgd2hlbiB0aGUgc2hpbSBsaWJyYXJ5IGxvYWRzIGFuZCBpcyByZXNwb25zaWJsZSBmb3IgZGV0ZXJtaW5pbmcgdGhlIGNvbnRleHRcbiAgLy8gd2hpY2ggaXQgaXMgcnVubmluZyBpdCBhbmQgc2V0dXAgYSBjb21tdW5pY2F0aW9ucyBjaGFubmVsIGJldHdlZW4gdGhlIGpzICYgcnVubmluZyBjb2RlXG4gIHZhciBkaXNwYXRjaGVyID0gbnVsbDtcbiAgdmFyIHNoYXJlZCA9IG51bGw7XG5cbiAgLy8gQWx3YXlzIGRlZmluZSB0aGUgcHJpdmF0ZSBfdGFibGVhdSBvYmplY3QgYXQgdGhlIHN0YXJ0XG4gIHdpbmRvdy5fdGFibGVhdSA9IHt9O1xuXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgdGFibGVhdVZlcnNpb25Cb290c3RyYXAgaXMgZGVmaW5lZCBhcyBhIGdsb2JhbCBvYmplY3QuIElmIHNvLFxuICAvLyB3ZSBhcmUgcnVubmluZyBpbiB0aGUgVGFibGVhdSBkZXNrdG9wL3NlcnZlciBjb250ZXh0LiBJZiBub3QsIHdlJ3JlIHJ1bm5pbmcgaW4gdGhlIHNpbXVsYXRvclxuICBpZiAoISF3aW5kb3cudGFibGVhdVZlcnNpb25Cb290c3RyYXApIHtcbiAgICAvLyBXZSBoYXZlIHRoZSB0YWJsZWF1IG9iamVjdCBkZWZpbmVkXG4gICAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgTmF0aXZlRGlzcGF0Y2hlciwgUmVwb3J0aW5nIHZlcnNpb24gbnVtYmVyXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKHdpbmRvdyk7XG4gIH0gZWxzZSBpZiAoISF3aW5kb3cucXQgJiYgISF3aW5kb3cucXQud2ViQ2hhbm5lbFRyYW5zcG9ydCkge1xuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIgZm9yIHF3ZWJjaGFubmVsXCIpO1xuICAgIHdpbmRvdy50YWJsZWF1ID0ge307XG5cbiAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgY29udGV4dCB3aGVyZSB0aGUgd2ViQ2hhbm5lbFRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFRoaXMgbWVhbnMgUVdlYkVuZ2luZSBpcyBpbiB1c2VcbiAgICB3aW5kb3cuY2hhbm5lbCA9IG5ldyBxd2ViY2hhbm5lbC5RV2ViQ2hhbm5lbChxdC53ZWJDaGFubmVsVHJhbnNwb3J0LCBmdW5jdGlvbihjaGFubmVsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlFXZWJDaGFubmVsIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xuXG4gICAgICAvLyBEZWZpbmUgdGhlIGZ1bmN0aW9uIHdoaWNoIHRhYmxlYXUgd2lsbCBjYWxsIGFmdGVyIGl0IGhhcyBpbnNlcnRlZCBhbGwgdGhlIHJlcXVpcmVkIG9iamVjdHMgaW50byB0aGUgamF2YXNjcmlwdCBmcmFtZVxuICAgICAgd2luZG93Ll90YWJsZWF1Ll9uYXRpdmVTZXR1cENvbXBsZXRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBPbmNlIHRoZSBuYXRpdmUgY29kZSB0ZWxscyB1cyBldmVyeXRoaW5nIGhlcmUgaXMgZG9uZSwgd2Ugc2hvdWxkIGhhdmUgYWxsIHRoZSBleHBlY3RlZCBvYmplY3RzIGluc2VydGVkIGludG8ganNcbiAgICAgICAgZGlzcGF0Y2hlciA9IG5ldyBOYXRpdmVEaXNwYXRjaGVyKGNoYW5uZWwub2JqZWN0cyk7XG4gICAgICAgIHdpbmRvdy50YWJsZWF1ID0gY2hhbm5lbC5vYmplY3RzLnRhYmxlYXU7XG4gICAgICAgIHNoYXJlZC5jaGFuZ2VUYWJsZWF1QXBpT2JqKHdpbmRvdy50YWJsZWF1KTtcbiAgICAgICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBBY3R1YWxseSBjYWxsIGludG8gdGhlIHZlcnNpb24gYm9vdHN0cmFwcGVyIHRvIHJlcG9ydCBvdXIgdmVyc2lvbiBudW1iZXJcbiAgICAgIGNoYW5uZWwub2JqZWN0cy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJWZXJzaW9uIEJvb3RzdHJhcCBpcyBub3QgZGVmaW5lZCwgSW5pdGlhbGl6aW5nIFNpbXVsYXRvckRpc3BhdGNoZXJcIik7XG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcbiAgICBkaXNwYXRjaGVyID0gbmV3IFNpbXVsYXRvckRpc3BhdGNoZXIod2luZG93KTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNoYXJlZCBXREMgb2JqZWN0IGFuZCBhZGQgaW4gb3VyIGVudW0gdmFsdWVzXG4gIHNoYXJlZCA9IG5ldyBTaGFyZWQod2luZG93LnRhYmxlYXUsIHdpbmRvdy5fdGFibGVhdSwgd2luZG93KTtcblxuICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRpc3BhdGNoZXIgaXMgYWxyZWFkeSBkZWZpbmVkIGFuZCBpbW1lZGlhdGVseSBjYWxsIHRoZVxuICAvLyBjYWxsYmFjayBpZiBzb1xuICBpZiAoZGlzcGF0Y2hlcikge1xuICAgIGJvb3RzdHJhcHBpbmdGaW5pc2hlZChkaXNwYXRjaGVyLCBzaGFyZWQpO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90YWJsZWF1d2RjLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNyVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUMzS0E7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDMWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ApprovedOrigins = __webpack_require__(1);

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
/* 6 */
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
	 * Cookies.js - 1.2.2
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

	    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGNiM2NiODI2ZTI0ZDNhOGNhMTUzIiwid2VicGFjazovLy8uL2luZGV4LmpzIiwid2VicGFjazovLy8uL0FwcHJvdmVkT3JpZ2lucy5qcyIsIndlYnBhY2s6Ly8vLi9FbnVtcy5qcyIsIndlYnBhY2s6Ly8vLi9OYXRpdmVEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzIiwid2VicGFjazovLy8uL1RhYmxlLmpzIiwid2VicGFjazovLy8uL1V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nvb2tpZXMtanMvZGlzdC9jb29raWVzLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZnItRlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2phLUpQLmpzb24iLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbiIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24iLCJ3ZWJwYWNrOi8vLy4vfi9qc3VyaS9VcmkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9xd2ViY2hhbm5lbC9xd2ViY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly8vLi90YWJsZWF1d2RjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgY2IzY2I4MjZlMjRkM2E4Y2ExNTNcbiAqKi8iLCIvLyBNYWluIGVudHJ5IHBvaW50IHRvIHB1bGwgdG9nZXRoZXIgZXZlcnl0aGluZyBuZWVkZWQgZm9yIHRoZSBXREMgc2hpbSBsaWJyYXJ5XHJcbi8vIFRoaXMgZmlsZSB3aWxsIGJlIGV4cG9ydGVkIGFzIGEgYnVuZGxlZCBqcyBmaWxlIGJ5IHdlYnBhY2sgc28gaXQgY2FuIGJlIGluY2x1ZGVkXHJcbi8vIGluIGEgPHNjcmlwdD4gdGFnIGluIGFuIGh0bWwgZG9jdW1lbnQuIEFsZXJuYXRpdmVseSwgYSBjb25uZWN0b3IgbWF5IGluY2x1ZGVcclxuLy8gdGhpcyB3aG9sZSBwYWNrYWdlIGluIHRoZWlyIGNvZGUgYW5kIHdvdWxkIG5lZWQgdG8gY2FsbCBpbml0IGxpa2UgdGhpc1xyXG52YXIgdGFibGVhdXdkYyA9IHJlcXVpcmUoJy4vdGFibGVhdXdkYy5qcycpO1xyXG50YWJsZWF1d2RjLmluaXQoKTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIEFQUFJPVkVEX09SSUdJTlNfS0VZID0gXCJ3ZGNfYXBwcm92ZWRfb3JpZ2luc1wiO1xyXG52YXIgU0VQQVJBVE9SID0gXCIsXCI7XHJcbnZhciBDb29raWVzID0gcmVxdWlyZSgnY29va2llcy1qcycpO1xyXG5cclxuZnVuY3Rpb24gX2dldEFwcHJvdmVkT3JpZ2luc1ZhbHVlKCkge1xyXG4gIHZhciByZXN1bHQgPSBDb29raWVzLmdldChBUFBST1ZFRF9PUklHSU5TX0tFWSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gX3NhdmVBcHByb3ZlZE9yaWdpbnMob3JpZ2luQXJyYXkpIHtcclxuICB2YXIgbmV3T3JpZ2luU3RyaW5nID0gb3JpZ2luQXJyYXkuam9pbihTRVBBUkFUT1IpO1xyXG4gIGNvbnNvbGUubG9nKFwiU2F2aW5nIGFwcHJvdmVkIG9yaWdpbnMgJ1wiICsgbmV3T3JpZ2luU3RyaW5nICsgXCInXCIpO1xyXG4gIFxyXG4gIC8vIFdlIGNvdWxkIHBvdGVudGlhbGx5IG1ha2UgdGhpcyBhIGxvbmdlciB0ZXJtIGNvb2tpZSBpbnN0ZWFkIG9mIGp1c3QgZm9yIHRoZSBjdXJyZW50IHNlc3Npb25cclxuICB2YXIgcmVzdWx0ID0gQ29va2llcy5zZXQoQVBQUk9WRURfT1JJR0lOU19LRVksIG5ld09yaWdpblN0cmluZyk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLy8gQWRkcyBhbiBhcHByb3ZlZCBvcmlnaW5zIHRvIHRoZSBsaXN0IGFscmVhZHkgc2F2ZWQgaW4gYSBzZXNzaW9uIGNvb2tpZVxyXG5mdW5jdGlvbiBhZGRBcHByb3ZlZE9yaWdpbihvcmlnaW4pIHtcclxuICBpZiAob3JpZ2luKSB7XHJcbiAgICB2YXIgb3JpZ2lucyA9IGdldEFwcHJvdmVkT3JpZ2lucygpO1xyXG4gICAgb3JpZ2lucy5wdXNoKG9yaWdpbik7XHJcbiAgICBfc2F2ZUFwcHJvdmVkT3JpZ2lucyhvcmlnaW5zKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFJldHJpZXZlcyB0aGUgb3JpZ2lucyB3aGljaCBoYXZlIGFscmVhZHkgYmVlbiBhcHByb3ZlZCBieSB0aGUgdXNlclxyXG5mdW5jdGlvbiBnZXRBcHByb3ZlZE9yaWdpbnMoKSB7XHJcbiAgdmFyIG9yaWdpbnNTdHJpbmcgPSBfZ2V0QXBwcm92ZWRPcmlnaW5zVmFsdWUoKTtcclxuICBpZiAoIW9yaWdpbnNTdHJpbmcgfHwgMCA9PT0gb3JpZ2luc1N0cmluZy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHZhciBvcmlnaW5zID0gb3JpZ2luc1N0cmluZy5zcGxpdChTRVBBUkFUT1IpO1xyXG4gIHJldHVybiBvcmlnaW5zO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRBcHByb3ZlZE9yaWdpbiA9IGFkZEFwcHJvdmVkT3JpZ2luO1xyXG5tb2R1bGUuZXhwb3J0cy5nZXRBcHByb3ZlZE9yaWdpbnMgPSBnZXRBcHByb3ZlZE9yaWdpbnM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL0FwcHJvdmVkT3JpZ2lucy5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiBUaGlzIGZpbGUgbGlzdHMgYWxsIG9mIHRoZSBlbnVtcyB3aGljaCBzaG91bGQgYXZhaWxhYmxlIGZvciB0aGUgV0RDICovXHJcbnZhciBhbGxFbnVtcyA9IHtcclxuICBwaGFzZUVudW0gOiB7XHJcbiAgICBpbnRlcmFjdGl2ZVBoYXNlOiBcImludGVyYWN0aXZlXCIsXHJcbiAgICBhdXRoUGhhc2U6IFwiYXV0aFwiLFxyXG4gICAgZ2F0aGVyRGF0YVBoYXNlOiBcImdhdGhlckRhdGFcIlxyXG4gIH0sXHJcblxyXG4gIGF1dGhQdXJwb3NlRW51bSA6IHtcclxuICAgIGVwaGVtZXJhbDogXCJlcGhlbWVyYWxcIixcclxuICAgIGVuZHVyaW5nOiBcImVuZHVyaW5nXCJcclxuICB9LFxyXG5cclxuICBhdXRoVHlwZUVudW0gOiB7XHJcbiAgICBub25lOiBcIm5vbmVcIixcclxuICAgIGJhc2ljOiBcImJhc2ljXCIsXHJcbiAgICBjdXN0b206IFwiY3VzdG9tXCJcclxuICB9LFxyXG5cclxuICBkYXRhVHlwZUVudW0gOiB7XHJcbiAgICBib29sOiBcImJvb2xcIixcclxuICAgIGRhdGU6IFwiZGF0ZVwiLFxyXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZXRpbWVcIixcclxuICAgIGZsb2F0OiBcImZsb2F0XCIsXHJcbiAgICBpbnQ6IFwiaW50XCIsXHJcbiAgICBzdHJpbmc6IFwic3RyaW5nXCJcclxuICB9LFxyXG5cclxuICBjb2x1bW5Sb2xlRW51bSA6IHtcclxuICAgICAgZGltZW5zaW9uOiBcImRpbWVuc2lvblwiLFxyXG4gICAgICBtZWFzdXJlOiBcIm1lYXN1cmVcIlxyXG4gIH0sXHJcblxyXG4gIGNvbHVtblR5cGVFbnVtIDoge1xyXG4gICAgICBjb250aW51b3VzOiBcImNvbnRpbnVvdXNcIixcclxuICAgICAgZGlzY3JldGU6IFwiZGlzY3JldGVcIlxyXG4gIH0sXHJcblxyXG4gIGFnZ1R5cGVFbnVtIDoge1xyXG4gICAgICBzdW06IFwic3VtXCIsXHJcbiAgICAgIGF2ZzogXCJhdmdcIixcclxuICAgICAgbWVkaWFuOiBcIm1lZGlhblwiLFxyXG4gICAgICBjb3VudDogXCJjb3VudFwiLFxyXG4gICAgICBjb3VudGQ6IFwiY291bnRfZGlzdFwiXHJcbiAgfSxcclxuXHJcbiAgZ2VvZ3JhcGhpY1JvbGVFbnVtIDoge1xyXG4gICAgICBhcmVhX2NvZGU6IFwiYXJlYV9jb2RlXCIsXHJcbiAgICAgIGNic2FfbXNhOiBcImNic2FfbXNhXCIsXHJcbiAgICAgIGNpdHk6IFwiY2l0eVwiLFxyXG4gICAgICBjb25ncmVzc2lvbmFsX2Rpc3RyaWN0OiBcImNvbmdyZXNzaW9uYWxfZGlzdHJpY3RcIixcclxuICAgICAgY291bnRyeV9yZWdpb246IFwiY291bnRyeV9yZWdpb25cIixcclxuICAgICAgY291bnR5OiBcImNvdW50eVwiLFxyXG4gICAgICBzdGF0ZV9wcm92aW5jZTogXCJzdGF0ZV9wcm92aW5jZVwiLFxyXG4gICAgICB6aXBfY29kZV9wb3N0Y29kZTogXCJ6aXBfY29kZV9wb3N0Y29kZVwiLFxyXG4gICAgICBsYXRpdHVkZTogXCJsYXRpdHVkZVwiLFxyXG4gICAgICBsb25naXR1ZGU6IFwibG9uZ2l0dWRlXCJcclxuICB9LFxyXG5cclxuICB1bml0c0Zvcm1hdEVudW0gOiB7XHJcbiAgICAgIHRob3VzYW5kczogXCJ0aG91c2FuZHNcIixcclxuICAgICAgbWlsbGlvbnM6IFwibWlsbGlvbnNcIixcclxuICAgICAgYmlsbGlvbnNfZW5nbGlzaDogXCJiaWxsaW9uc19lbmdsaXNoXCIsXHJcbiAgICAgIGJpbGxpb25zX3N0YW5kYXJkOiBcImJpbGxpb25zX3N0YW5kYXJkXCJcclxuICB9LFxyXG5cclxuICBudW1iZXJGb3JtYXRFbnVtIDoge1xyXG4gICAgICBudW1iZXI6IFwibnVtYmVyXCIsXHJcbiAgICAgIGN1cnJlbmN5OiBcImN1cnJlbmN5XCIsXHJcbiAgICAgIHNjaWVudGlmaWM6IFwic2NpZW50aWZpY1wiLFxyXG4gICAgICBwZXJjZW50YWdlOiBcInBlcmNlbnRhZ2VcIlxyXG4gIH0sXHJcblxyXG4gIGxvY2FsZUVudW0gOiB7XHJcbiAgICAgIGFtZXJpY2E6IFwiZW4tdXNcIixcclxuICAgICAgYnJhemlsOiAgXCJwdC1iclwiLFxyXG4gICAgICBjaGluYTogICBcInpoLWNuXCIsXHJcbiAgICAgIGZyYW5jZTogIFwiZnItZnJcIixcclxuICAgICAgZ2VybWFueTogXCJkZS1kZVwiLFxyXG4gICAgICBqYXBhbjogICBcImphLWpwXCIsXHJcbiAgICAgIGtvcmVhOiAgIFwia28ta3JcIixcclxuICAgICAgc3BhaW46ICAgXCJlcy1lc1wiXHJcbiAgfSxcclxuXHJcbiAgam9pbkVudW0gOiB7XHJcbiAgICAgIGlubmVyOiBcImlubmVyXCIsXHJcbiAgICAgIGxlZnQ6IFwibGVmdFwiXHJcbiAgfVxyXG59XHJcblxyXG4vLyBBcHBsaWVzIHRoZSBlbnVtcyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgb2JqZWN0XHJcbmZ1bmN0aW9uIGFwcGx5KHRhcmdldCkge1xyXG4gIGZvcih2YXIga2V5IGluIGFsbEVudW1zKSB7XHJcbiAgICB0YXJnZXRba2V5XSA9IGFsbEVudW1zW2tleV07XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hcHBseSA9IGFwcGx5O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vRW51bXMuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKiogQGNsYXNzIFVzZWQgZm9yIGNvbW11bmljYXRpbmcgYmV0d2VlbiBUYWJsZWF1IGRlc2t0b3Avc2VydmVyIGFuZCB0aGUgV0RDJ3NcclxuKiBKYXZhc2NyaXB0LiBpcyBwcmVkb21pbmFudGx5IGEgcGFzcy10aHJvdWdoIHRvIHRoZSBRdCBXZWJCcmlkZ2UgbWV0aG9kc1xyXG4qIEBwYXJhbSBuYXRpdmVBcGlSb290T2JqIHtPYmplY3R9IC0gVGhlIHJvb3Qgb2JqZWN0IHdoZXJlIHRoZSBuYXRpdmUgQXBpIG1ldGhvZHNcclxuKiBhcmUgYXZhaWxhYmxlLiBGb3IgV2ViS2l0LCB0aGlzIGlzIHdpbmRvdy5cclxuKi9cclxuZnVuY3Rpb24gTmF0aXZlRGlzcGF0Y2hlciAobmF0aXZlQXBpUm9vdE9iaikge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iaiA9IG5hdGl2ZUFwaVJvb3RPYmo7XHJcbiAgdGhpcy5faW5pdFB1YmxpY0ludGVyZmFjZSgpO1xyXG4gIHRoaXMuX2luaXRQcml2YXRlSW50ZXJmYWNlKCk7XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHVibGljSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHVibGljIGludGVyZmFjZSBmb3IgTmF0aXZlRGlzcGF0Y2hlclwiKTtcclxuICB0aGlzLl9zdWJtaXRDYWxsZWQgPSBmYWxzZTtcclxuXHJcbiAgdmFyIHB1YmxpY0ludGVyZmFjZSA9IHt9O1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hYm9ydEZvckF1dGggPSB0aGlzLl9hYm9ydEZvckF1dGguYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRXaXRoRXJyb3IgPSB0aGlzLl9hYm9ydFdpdGhFcnJvci5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IHRoaXMuX2FkZENyb3NzT3JpZ2luRXhjZXB0aW9uLmJpbmQodGhpcyk7XHJcbiAgcHVibGljSW50ZXJmYWNlLmxvZyA9IHRoaXMuX2xvZy5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5zdWJtaXQgPSB0aGlzLl9zdWJtaXQuYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UucmVwb3J0UHJvZ3Jlc3MgPSB0aGlzLl9yZXBvcnRQcm9ncmVzcy5iaW5kKHRoaXMpO1xyXG5cclxuICB0aGlzLnB1YmxpY0ludGVyZmFjZSA9IHB1YmxpY0ludGVyZmFjZTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0Rm9yQXV0aCA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2Fib3J0Rm9yQXV0aC5hcGkobXNnKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2Fib3J0V2l0aEVycm9yID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWJvcnRXaXRoRXJyb3IuYXBpKG1zZyk7XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24uYXBpKGRlc3RPcmlnaW5MaXN0KTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX2xvZy5hcGkobXNnKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9zdWJtaXRDYWxsZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwic3VibWl0IGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX3N1Ym1pdENhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc3VibWl0LmFwaSgpO1xyXG59O1xyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRQcml2YXRlSW50ZXJmYWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgY29uc29sZS5sb2coXCJJbml0aWFsaXppbmcgcHJpdmF0ZSBpbnRlcmZhY2UgZm9yIE5hdGl2ZURpc3BhdGNoZXJcIik7XHJcblxyXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xyXG4gIHRoaXMuX3NodXRkb3duQ2FsbGJhY2tDYWxsZWQgPSBmYWxzZTtcclxuXHJcbiAgdmFyIHByaXZhdGVJbnRlcmZhY2UgPSB7fTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9pbml0Q2FsbGJhY2sgPSB0aGlzLl9pbml0Q2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9zaHV0ZG93bkNhbGxiYWNrID0gdGhpcy5fc2h1dGRvd25DYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX3NjaGVtYUNhbGxiYWNrID0gdGhpcy5fc2NoZW1hQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl90YWJsZURhdGFDYWxsYmFjayA9IHRoaXMuX3RhYmxlRGF0YUNhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgcHJpdmF0ZUludGVyZmFjZS5fZGF0YURvbmVDYWxsYmFjayA9IHRoaXMuX2RhdGFEb25lQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuXHJcbiAgdGhpcy5wcml2YXRlSW50ZXJmYWNlID0gcHJpdmF0ZUludGVyZmFjZTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2luaXRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9pbml0Q2FsbGJhY2tDYWxsZWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5pdENhbGxiYWNrIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuX2luaXRDYWxsYmFja0NhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfaW5pdENhbGxiYWNrLmFwaSgpO1xyXG59XHJcblxyXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2h1dGRvd25DYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLl9zaHV0ZG93bkNhbGxiYWNrQ2FsbGVkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInNodXRkb3duQ2FsbGJhY2sgY2FsbGVkIG1vcmUgdGhhbiBvbmNlXCIpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fc2h1dGRvd25DYWxsYmFja0NhbGxlZCA9IHRydWU7XHJcbiAgdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2h1dGRvd25DYWxsYmFjay5hcGkoKTtcclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX3NjaGVtYUNhbGxiYWNrID0gZnVuY3Rpb24oc2NoZW1hLCBzdGFuZGFyZENvbm5lY3Rpb25zKSB7XHJcbiAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHdlIGFyZSB1c2luZyBhIHZlcnNpb24gb2YgZGVza3RvcCB3aGljaCBoYXMgdGhlIFdEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCBkZWZpbmVkXHJcbiAgaWYgKCEhdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfc2NoZW1hQ2FsbGJhY2tFeCkge1xyXG4gICAgLy8gUHJvdmlkaW5nIHN0YW5kYXJkQ29ubmVjdGlvbnMgaXMgb3B0aW9uYWwgYnV0IHdlIGNhbid0IHBhc3MgdW5kZWZpbmVkIGJhY2sgYmVjYXVzZSBRdCB3aWxsIGNob2tlXHJcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFja0V4LmFwaShzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW10pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9zY2hlbWFDYWxsYmFjay5hcGkoc2NoZW1hKTtcclxuICB9XHJcbn1cclxuXHJcbk5hdGl2ZURpc3BhdGNoZXIucHJvdG90eXBlLl90YWJsZURhdGFDYWxsYmFjayA9IGZ1bmN0aW9uKHRhYmxlTmFtZSwgZGF0YSkge1xyXG4gIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3RhYmxlRGF0YUNhbGxiYWNrLmFwaSh0YWJsZU5hbWUsIGRhdGEpO1xyXG59XHJcblxyXG5OYXRpdmVEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVwb3J0UHJvZ3Jlc3MgPSBmdW5jdGlvbiAocHJvZ3Jlc3MpIHtcclxuICAvLyBSZXBvcnQgcHJvZ3Jlc3Mgd2FzIGFkZGVkIGluIDIuMSBzbyBpdCBtYXkgbm90IGJlIGF2YWlsYWJsZSBpZiBUYWJsZWF1IG9ubHkga25vd3MgMi4wXHJcbiAgaWYgKCEhdGhpcy5uYXRpdmVBcGlSb290T2JqLldEQ0JyaWRnZV9BcGlfcmVwb3J0UHJvZ3Jlc3MpIHtcclxuICAgIHRoaXMubmF0aXZlQXBpUm9vdE9iai5XRENCcmlkZ2VfQXBpX3JlcG9ydFByb2dyZXNzLmFwaShwcm9ncmVzcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUubG9nKFwicmVwb3J0UHJvZ3Jlc3Mgbm90IGF2YWlsYWJsZSBmcm9tIHRoaXMgVGFibGVhdSB2ZXJzaW9uXCIpO1xyXG4gIH1cclxufVxyXG5cclxuTmF0aXZlRGlzcGF0Y2hlci5wcm90b3R5cGUuX2RhdGFEb25lQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLm5hdGl2ZUFwaVJvb3RPYmouV0RDQnJpZGdlX0FwaV9kYXRhRG9uZUNhbGxiYWNrLmFwaSgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5hdGl2ZURpc3BhdGNoZXI7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9OYXRpdmVEaXNwYXRjaGVyLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIFRhYmxlID0gcmVxdWlyZSgnLi9UYWJsZS5qcycpO1xyXG52YXIgRW51bXMgPSByZXF1aXJlKCcuL0VudW1zLmpzJyk7XHJcblxyXG4vKiogQGNsYXNzIFRoaXMgY2xhc3MgcmVwcmVzZW50cyB0aGUgc2hhcmVkIHBhcnRzIG9mIHRoZSBqYXZhc2NyaXB0XHJcbiogbGlicmFyeSB3aGljaCBkbyBub3QgaGF2ZSBhbnkgZGVwZW5kZW5jZSBvbiB3aGV0aGVyIHdlIGFyZSBydW5uaW5nIGluXHJcbiogdGhlIHNpbXVsYXRvciwgaW4gVGFibGVhdSwgb3IgYW55d2hlcmUgZWxzZVxyXG4qIEBwYXJhbSB0YWJsZWF1QXBpT2JqIHtPYmplY3R9IC0gVGhlIGFscmVhZHkgY3JlYXRlZCB0YWJsZWF1IEFQSSBvYmplY3QgKHVzdWFsbHkgd2luZG93LnRhYmxlYXUpXHJcbiogQHBhcmFtIHByaXZhdGVBcGlPYmoge09iamVjdH0gLSBUaGUgYWxyZWFkeSBjcmVhdGVkIHByaXZhdGUgQVBJIG9iamVjdCAodXN1YWxseSB3aW5kb3cuX3RhYmxlYXUpXHJcbiogQHBhcmFtIGdsb2JhbE9iaiB7T2JqZWN0fSAtIFRoZSBnbG9iYWwgb2JqZWN0IHRvIGF0dGFjaCB0aGluZ3MgdG8gKHVzdWFsbHkgd2luZG93KVxyXG4qL1xyXG5mdW5jdGlvbiBTaGFyZWQgKHRhYmxlYXVBcGlPYmosIHByaXZhdGVBcGlPYmosIGdsb2JhbE9iaikge1xyXG4gIHRoaXMucHJpdmF0ZUFwaU9iaiA9IHByaXZhdGVBcGlPYmo7XHJcbiAgdGhpcy5nbG9iYWxPYmogPSBnbG9iYWxPYmo7XHJcbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IGZhbHNlO1xyXG5cclxuICB0aGlzLmNoYW5nZVRhYmxlYXVBcGlPYmoodGFibGVhdUFwaU9iaik7XHJcbn1cclxuXHJcblxyXG5TaGFyZWQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICBjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBzaGFyZWQgV0RDXCIpO1xyXG4gIHRoaXMuZ2xvYmFsT2JqLm9uZXJyb3IgPSB0aGlzLl9lcnJvckhhbmRsZXIuYmluZCh0aGlzKTtcclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgZnVuY3Rpb25zIHdoaWNoIHdpbGwgYmUgaW52b2tlZCBieSB0aGUgbmF0aXZlIGNvZGVcclxuICB0aGlzLl9pbml0VHJpZ2dlckZ1bmN0aW9ucygpO1xyXG5cclxuICAvLyBBc3NpZ24gdGhlIGRlcHJlY2F0ZWQgZnVuY3Rpb25zIHdoaWNoIGFyZW4ndCBhdmFpbGlibGUgaW4gdGhpcyB2ZXJzaW9uIG9mIHRoZSBBUElcclxuICB0aGlzLl9pbml0RGVwcmVjYXRlZEZ1bmN0aW9ucygpO1xyXG59XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLmNoYW5nZVRhYmxlYXVBcGlPYmogPSBmdW5jdGlvbih0YWJsZWF1QXBpT2JqKSB7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqID0gdGFibGVhdUFwaU9iajtcclxuXHJcbiAgLy8gQXNzaWduIG91ciBtYWtlICYgcmVnaXN0ZXIgZnVuY3Rpb25zIHJpZ2h0IGF3YXkgYmVjYXVzZSBhIGNvbm5lY3RvciBjYW4gdXNlXHJcbiAgLy8gdGhlbSBpbW1lZGlhdGVseSwgZXZlbiBiZWZvcmUgYm9vdHN0cmFwcGluZyBoYXMgY29tcGxldGVkXHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLm1ha2VDb25uZWN0b3IgPSB0aGlzLl9tYWtlQ29ubmVjdG9yLmJpbmQodGhpcyk7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLnJlZ2lzdGVyQ29ubmVjdG9yID0gdGhpcy5fcmVnaXN0ZXJDb25uZWN0b3IuYmluZCh0aGlzKTtcclxuXHJcbiAgRW51bXMuYXBwbHkodGhpcy50YWJsZWF1QXBpT2JqKTtcclxufVxyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5fZXJyb3JIYW5kbGVyID0gZnVuY3Rpb24obWVzc2FnZSwgZmlsZSwgbGluZSwgY29sdW1uLCBlcnJvck9iaikge1xyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3JPYmopOyAvLyBwcmludCBlcnJvciBmb3IgZGVidWdnaW5nIGluIHRoZSBicm93c2VyXHJcbiAgaWYgKHRoaXMuX2hhc0FscmVhZHlUaHJvd25FcnJvclNvRG9udFRocm93QWdhaW4pIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdmFyIG1zZyA9IG1lc3NhZ2U7XHJcbiAgaWYoZXJyb3JPYmopIHtcclxuICAgIG1zZyArPSBcIiAgIHN0YWNrOlwiICsgZXJyb3JPYmouc3RhY2s7XHJcbiAgfSBlbHNlIHtcclxuICAgIG1zZyArPSBcIiAgIGZpbGU6IFwiICsgZmlsZTtcclxuICAgIG1zZyArPSBcIiAgIGxpbmU6IFwiICsgbGluZTtcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLnRhYmxlYXVBcGlPYmogJiYgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKSB7XHJcbiAgICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IobXNnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbXNnO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5faGFzQWxyZWFkeVRocm93bkVycm9yU29Eb250VGhyb3dBZ2FpbiA9IHRydWU7XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblNoYXJlZC5wcm90b3R5cGUuX21ha2VDb25uZWN0b3IgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgZGVmYXVsdEltcGxzID0ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24oY2IpIHsgY2IoKTsgfSxcclxuICAgIHNodXRkb3duOiBmdW5jdGlvbihjYikgeyBjYigpOyB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGRlZmF1bHRJbXBscztcclxufVxyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5fcmVnaXN0ZXJDb25uZWN0b3IgPSBmdW5jdGlvbiAod2RjKSB7XHJcblxyXG4gIC8vIGRvIHNvbWUgZXJyb3IgY2hlY2tpbmcgb24gdGhlIHdkY1xyXG4gIHZhciBmdW5jdGlvbk5hbWVzID0gW1wiaW5pdFwiLCBcInNodXRkb3duXCIsIFwiZ2V0U2NoZW1hXCIsIFwiZ2V0RGF0YVwiXTtcclxuICBmb3IgKHZhciBpaSA9IGZ1bmN0aW9uTmFtZXMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xyXG4gICAgaWYgKHR5cGVvZih3ZGNbZnVuY3Rpb25OYW1lc1tpaV1dKSAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIHRocm93IFwiVGhlIGNvbm5lY3RvciBkaWQgbm90IGRlZmluZSB0aGUgcmVxdWlyZWQgZnVuY3Rpb246IFwiICsgZnVuY3Rpb25OYW1lc1tpaV07XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJDb25uZWN0b3IgcmVnaXN0ZXJlZFwiKTtcclxuXHJcbiAgdGhpcy5nbG9iYWxPYmouX3dkYyA9IHdkYztcclxuICB0aGlzLl93ZGMgPSB3ZGM7XHJcbn1cclxuXHJcblNoYXJlZC5wcm90b3R5cGUuX2luaXRUcmlnZ2VyRnVuY3Rpb25zID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJJbml0aWFsaXphdGlvbiA9IHRoaXMuX3RyaWdnZXJJbml0aWFsaXphdGlvbi5iaW5kKHRoaXMpO1xyXG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nID0gdGhpcy5fdHJpZ2dlclNjaGVtYUdhdGhlcmluZy5iaW5kKHRoaXMpO1xyXG4gIHRoaXMucHJpdmF0ZUFwaU9iai50cmlnZ2VyRGF0YUdhdGhlcmluZyA9IHRoaXMuX3RyaWdnZXJEYXRhR2F0aGVyaW5nLmJpbmQodGhpcyk7XHJcbiAgdGhpcy5wcml2YXRlQXBpT2JqLnRyaWdnZXJTaHV0ZG93biA9IHRoaXMuX3RyaWdnZXJTaHV0ZG93bi5iaW5kKHRoaXMpO1xyXG59XHJcblxyXG4vLyBTdGFydHMgdGhlIFdEQ1xyXG5TaGFyZWQucHJvdG90eXBlLl90cmlnZ2VySW5pdGlhbGl6YXRpb24gPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLl93ZGMuaW5pdCh0aGlzLnByaXZhdGVBcGlPYmouX2luaXRDYWxsYmFjayk7XHJcbn1cclxuXHJcbi8vIFN0YXJ0cyB0aGUgc2NoZW1hIGdhdGhlcmluZyBwcm9jZXNzXHJcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJTY2hlbWFHYXRoZXJpbmcgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLl93ZGMuZ2V0U2NoZW1hKHRoaXMucHJpdmF0ZUFwaU9iai5fc2NoZW1hQ2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBTdGFydHMgdGhlIGRhdGEgZ2F0aGVyaW5nIHByb2Nlc3NcclxuU2hhcmVkLnByb3RvdHlwZS5fdHJpZ2dlckRhdGFHYXRoZXJpbmcgPSBmdW5jdGlvbih0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpIHtcclxuICBpZiAodGFibGVzQW5kSW5jcmVtZW50VmFsdWVzLmxlbmd0aCAhPSAxKSB7XHJcbiAgICB0aHJvdyAoXCJVbmV4cGVjdGVkIG51bWJlciBvZiB0YWJsZXMgc3BlY2lmaWVkLiBFeHBlY3RlZCAxLCBhY3R1YWwgXCIgKyB0YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHRhYmxlQW5kSW5jcmVtbnRWYWx1ZSA9IHRhYmxlc0FuZEluY3JlbWVudFZhbHVlc1swXTtcclxuICB2YXIgdGFibGUgPSBuZXcgVGFibGUodGFibGVBbmRJbmNyZW1udFZhbHVlLnRhYmxlSW5mbywgdGFibGVBbmRJbmNyZW1udFZhbHVlLmluY3JlbWVudFZhbHVlLCB0aGlzLnByaXZhdGVBcGlPYmouX3RhYmxlRGF0YUNhbGxiYWNrKTtcclxuICB0aGlzLl93ZGMuZ2V0RGF0YSh0YWJsZSwgdGhpcy5wcml2YXRlQXBpT2JqLl9kYXRhRG9uZUNhbGxiYWNrKTtcclxufVxyXG5cclxuLy8gVGVsbHMgdGhlIFdEQyBpdCdzIHRpbWUgdG8gc2h1dCBkb3duXHJcblNoYXJlZC5wcm90b3R5cGUuX3RyaWdnZXJTaHV0ZG93biA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3dkYy5zaHV0ZG93bih0aGlzLnByaXZhdGVBcGlPYmouX3NodXRkb3duQ2FsbGJhY2spO1xyXG59XHJcblxyXG4vLyBJbml0aWFsaXplcyBhIHNlcmllcyBvZiBnbG9iYWwgY2FsbGJhY2tzIHdoaWNoIGhhdmUgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcclxuU2hhcmVkLnByb3RvdHlwZS5faW5pdERlcHJlY2F0ZWRGdW5jdGlvbnMgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmouaW5pdENhbGxiYWNrID0gdGhpcy5faW5pdENhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmhlYWRlcnNDYWxsYmFjayA9IHRoaXMuX2hlYWRlcnNDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5kYXRhQ2FsbGJhY2sgPSB0aGlzLl9kYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmouc2h1dGRvd25DYWxsYmFjayA9IHRoaXMuX3NodXRkb3duQ2FsbGJhY2suYmluZCh0aGlzKTtcclxufVxyXG5cclxuU2hhcmVkLnByb3RvdHlwZS5faW5pdENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuaW5pdENhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIGluaXRcIik7XHJcbn07XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLl9oZWFkZXJzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGROYW1lcywgdHlwZXMpIHtcclxuICB0aGlzLnRhYmxlYXVBcGlPYmouYWJvcnRXaXRoRXJyb3IoXCJ0YWJsZWF1LmhlYWRlcnNDYWxsYmFjayBoYXMgYmVlbiBkZXByZWNhdGVkIGluIHZlcnNpb24gMi4wLjBcIik7XHJcbn07XHJcblxyXG5TaGFyZWQucHJvdG90eXBlLl9kYXRhQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0YSwgbGFzdFJlY29yZFRva2VuLCBtb3JlRGF0YSkge1xyXG4gIHRoaXMudGFibGVhdUFwaU9iai5hYm9ydFdpdGhFcnJvcihcInRhYmxlYXUuZGF0YUNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMFwiKTtcclxufTtcclxuXHJcblNoYXJlZC5wcm90b3R5cGUuX3NodXRkb3duQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50YWJsZWF1QXBpT2JqLmFib3J0V2l0aEVycm9yKFwidGFibGVhdS5zaHV0ZG93bkNhbGxiYWNrIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gdmVyc2lvbiAyLjAuMC4gUGxlYXNlIHVzZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcGFzc2VkIHRvIHNodXRkb3duXCIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZWQ7XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9TaGFyZWQuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgQXBwcm92ZWRPcmlnaW5zID0gcmVxdWlyZSgnLi9BcHByb3ZlZE9yaWdpbnMuanMnKTtcclxuXHJcbi8qKiBAY2xhc3MgVXNlZCBmb3IgY29tbXVuaWNhdGluZyBiZXR3ZWVuIHRoZSBzaW11bGF0b3IgYW5kIHdlYiBkYXRhIGNvbm5lY3Rvci4gSXQgZG9lc1xyXG4qIHRoaXMgYnkgcGFzc2luZyBtZXNzYWdlcyBiZXR3ZWVuIHRoZSBXREMgd2luZG93IGFuZCBpdHMgcGFyZW50IHdpbmRvd1xyXG4qIEBwYXJhbSBnbG9iYWxPYmoge09iamVjdH0gLSB0aGUgZ2xvYmFsIG9iamVjdCB0byBmaW5kIHRhYmxlYXUgaW50ZXJmYWNlcyBhcyB3ZWxsXHJcbiogYXMgcmVnaXN0ZXIgZXZlbnRzICh1c3VhbGx5IHdpbmRvdylcclxuKi9cclxuZnVuY3Rpb24gU2ltdWxhdG9yRGlzcGF0Y2hlciAoZ2xvYmFsT2JqKSB7XHJcbiAgdGhpcy5nbG9iYWxPYmogPSBnbG9iYWxPYmo7XHJcbiAgdGhpcy5faW5pdE1lc3NhZ2VIYW5kbGluZygpO1xyXG4gIHRoaXMuX2luaXRQdWJsaWNJbnRlcmZhY2UoKTtcclxuICB0aGlzLl9pbml0UHJpdmF0ZUludGVyZmFjZSgpO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdE1lc3NhZ2VIYW5kbGluZyA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIG1lc3NhZ2UgaGFuZGxpbmdcIik7XHJcbiAgdGhpcy5nbG9iYWxPYmouYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX3JlY2VpdmVNZXNzYWdlLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICB0aGlzLmdsb2JhbE9iai5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCB0aGlzLl9vbkRvbUNvbnRlbnRMb2FkZWQuYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9vbkRvbUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbigpIHtcclxuICAvLyBBdHRlbXB0IHRvIG5vdGlmeSB0aGUgc2ltdWxhdG9yIHdpbmRvdyB0aGF0IHRoZSBXREMgaGFzIGxvYWRlZFxyXG4gIGlmKHRoaXMuZ2xvYmFsT2JqLnBhcmVudCAhPT0gd2luZG93KSB7XHJcbiAgICB0aGlzLmdsb2JhbE9iai5wYXJlbnQucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XHJcbiAgfVxyXG5cclxuICBpZih0aGlzLmdsb2JhbE9iai5vcGVuZXIpIHtcclxuICAgIHRyeSB7IC8vIFdyYXAgaW4gdHJ5L2NhdGNoIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRVxyXG4gICAgICB0aGlzLmdsb2JhbE9iai5vcGVuZXIucG9zdE1lc3NhZ2UodGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZCgnbG9hZGVkJyksICcqJyk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdTb21lIHZlcnNpb25zIG9mIElFIG1heSBub3QgYWNjdXJhdGVseSBzaW11bGF0ZSB0aGUgV2ViIERhdGEgQ29ubmVjdG9yLiBQbGVhc2UgcmV0cnkgb24gYSBXZWJraXQgYmFzZWQgYnJvd3NlcicpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3BhY2thZ2VQcm9wZXJ0eVZhbHVlcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBwcm9wVmFsdWVzID0ge1xyXG4gICAgXCJjb25uZWN0aW9uTmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25OYW1lLFxyXG4gICAgXCJjb25uZWN0aW9uRGF0YVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmNvbm5lY3Rpb25EYXRhLFxyXG4gICAgXCJwYXNzd29yZFwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBhc3N3b3JkLFxyXG4gICAgXCJ1c2VybmFtZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnVzZXJuYW1lLFxyXG4gICAgXCJ1c2VybmFtZUFsaWFzXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyxcclxuICAgIFwiaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuaW5jcmVtZW50YWxFeHRyYWN0Q29sdW1uLFxyXG4gICAgXCJ2ZXJzaW9uTnVtYmVyXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudmVyc2lvbk51bWJlcixcclxuICAgIFwibG9jYWxlXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubG9jYWxlLFxyXG4gICAgXCJhdXRoUHVycG9zZVwiOiB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmF1dGhQdXJwb3NlLFxyXG4gICAgXCJwbGF0Zm9ybU9TXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyxcclxuICAgIFwicGxhdGZvcm1WZXJzaW9uXCI6IHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1WZXJzaW9uLFxyXG4gICAgXCJwbGF0Zm9ybUVkaXRpb25cIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUVkaXRpb24sXHJcbiAgICBcInBsYXRmb3JtQnVpbGROdW1iZXJcIjogdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHByb3BWYWx1ZXM7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hcHBseVByb3BlcnR5VmFsdWVzID0gZnVuY3Rpb24ocHJvcHMpIHtcclxuICBpZiAocHJvcHMpIHtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbk5hbWUgPSBwcm9wcy5jb25uZWN0aW9uTmFtZTtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuY29ubmVjdGlvbkRhdGEgPSBwcm9wcy5jb25uZWN0aW9uRGF0YTtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGFzc3dvcmQgPSBwcm9wcy5wYXNzd29yZDtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWUgPSBwcm9wcy51c2VybmFtZTtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUudXNlcm5hbWVBbGlhcyA9IHByb3BzLnVzZXJuYW1lQWxpYXM7XHJcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LmluY3JlbWVudGFsRXh0cmFjdENvbHVtbiA9IHByb3BzLmluY3JlbWVudGFsRXh0cmFjdENvbHVtbjtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUubG9jYWxlID0gcHJvcHMubG9jYWxlO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5sYW5ndWFnZSA9IHByb3BzLmxvY2FsZTtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUuYXV0aFB1cnBvc2UgPSBwcm9wcy5hdXRoUHVycG9zZTtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1PUyA9IHByb3BzLnBsYXRmb3JtT1M7XHJcbiAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBsYXRmb3JtVmVyc2lvbiA9IHByb3BzLnBsYXRmb3JtVmVyc2lvbjtcclxuICAgIHRoaXMuZ2xvYmFsT2JqLnRhYmxlYXUucGxhdGZvcm1FZGl0aW9uID0gcHJvcHMucGxhdGZvcm1FZGl0aW9uO1xyXG4gICAgdGhpcy5nbG9iYWxPYmoudGFibGVhdS5wbGF0Zm9ybUJ1aWxkTnVtYmVyID0gcHJvcHMucGxhdGZvcm1CdWlsZE51bWJlcjtcclxuICB9XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9idWlsZE1lc3NhZ2VQYXlsb2FkID0gZnVuY3Rpb24obXNnTmFtZSwgbXNnRGF0YSwgcHJvcHMpIHtcclxuICB2YXIgbXNnT2JqID0ge1wibXNnTmFtZVwiOiBtc2dOYW1lLCBcIm1zZ0RhdGFcIjogbXNnRGF0YSwgXCJwcm9wc1wiOiBwcm9wcywgXCJ2ZXJzaW9uXCI6IEJVSUxEX05VTUJFUiB9O1xyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShtc2dPYmopO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2VuZE1lc3NhZ2UgPSBmdW5jdGlvbihtc2dOYW1lLCBtc2dEYXRhKSB7XHJcbiAgdmFyIG1lc3NhZ2VQYXlsb2FkID0gdGhpcy5fYnVpbGRNZXNzYWdlUGF5bG9hZChtc2dOYW1lLCBtc2dEYXRhLCB0aGlzLl9wYWNrYWdlUHJvcGVydHlWYWx1ZXMoKSk7XHJcblxyXG4gIC8vIENoZWNrIGZpcnN0IHRvIHNlZSBpZiB3ZSBoYXZlIGEgbWVzc2FnZUhhbmRsZXIgZGVmaW5lZCB0byBwb3N0IHRoZSBtZXNzYWdlIHRvXHJcbiAgaWYgKHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQgIT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgIHR5cGVvZiB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzICE9ICd1bmRlZmluZWQnICYmXHJcbiAgICB0eXBlb2YgdGhpcy5nbG9iYWxPYmoud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy53ZGNIYW5kbGVyICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0aGlzLmdsb2JhbE9iai53ZWJraXQubWVzc2FnZUhhbmRsZXJzLndkY0hhbmRsZXIucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQpO1xyXG4gIH0gZWxzZSBpZiAoIXRoaXMuX3NvdXJjZVdpbmRvdykge1xyXG4gICAgdGhyb3cgXCJMb29rcyBsaWtlIHRoZSBXREMgaXMgY2FsbGluZyBhIHRhYmxlYXUgZnVuY3Rpb24gYmVmb3JlIHRhYmxlYXUuaW5pdCgpIGhhcyBiZWVuIGNhbGxlZC5cIlxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBNYWtlIHN1cmUgd2Ugb25seSBwb3N0IHRoaXMgaW5mbyBiYWNrIHRvIHRoZSBzb3VyY2Ugb3JpZ2luIHRoZSB1c2VyIGFwcHJvdmVkIGluIF9nZXRXZWJTZWN1cml0eVdhcm5pbmdDb25maXJtXHJcbiAgICB0aGlzLl9zb3VyY2VXaW5kb3cucG9zdE1lc3NhZ2UobWVzc2FnZVBheWxvYWQsIHRoaXMuX3NvdXJjZU9yaWdpbik7XHJcbiAgfVxyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0UGF5bG9hZE9iaiA9IGZ1bmN0aW9uKHBheWxvYWRTdHJpbmcpIHtcclxuICB2YXIgcGF5bG9hZCA9IG51bGw7XHJcbiAgdHJ5IHtcclxuICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKHBheWxvYWRTdHJpbmcpO1xyXG4gIH0gY2F0Y2goZSkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcGF5bG9hZDtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldFdlYlNlY3VyaXR5V2FybmluZ0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcclxuICAvLyBEdWUgdG8gY3Jvc3Mtb3JpZ2luIHNlY3VyaXR5IGlzc3VlcyBvdmVyIGh0dHBzLCB3ZSBtYXkgbm90IGJlIGFibGUgdG8gcmV0cmlldmUgX3NvdXJjZVdpbmRvdy5cclxuICAvLyBVc2Ugc291cmNlT3JpZ2luIGluc3RlYWQuXHJcbiAgdmFyIG9yaWdpbiA9IHRoaXMuX3NvdXJjZU9yaWdpbjtcclxuXHJcbiAgdmFyIFVyaSA9IHJlcXVpcmUoJ2pzdXJpJyk7XHJcbiAgdmFyIHBhcnNlZE9yaWdpbiA9IG5ldyBVcmkob3JpZ2luKTtcclxuICB2YXIgaG9zdE5hbWUgPSBwYXJzZWRPcmlnaW4uaG9zdCgpO1xyXG5cclxuICB2YXIgc3VwcG9ydGVkSG9zdHMgPSBbXCJsb2NhbGhvc3RcIiwgXCJ0YWJsZWF1LmdpdGh1Yi5pb1wiXTtcclxuICBpZiAoc3VwcG9ydGVkSG9zdHMuaW5kZXhPZihob3N0TmFtZSkgPj0gMCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIFdoaXRlbGlzdCBUYWJsZWF1IGRvbWFpbnNcclxuICBpZiAoaG9zdE5hbWUgJiYgaG9zdE5hbWUuZW5kc1dpdGgoXCJvbmxpbmUudGFibGVhdS5jb21cIikpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICB2YXIgYWxyZWFkeUFwcHJvdmVkT3JpZ2lucyA9IEFwcHJvdmVkT3JpZ2lucy5nZXRBcHByb3ZlZE9yaWdpbnMoKTtcclxuICBpZiAoYWxyZWFkeUFwcHJvdmVkT3JpZ2lucy5pbmRleE9mKG9yaWdpbikgPj0gMCkge1xyXG4gICAgLy8gVGhlIHVzZXIgaGFzIGFscmVhZHkgYXBwcm92ZWQgdGhpcyBvcmlnaW4sIG5vIG5lZWQgdG8gYXNrIGFnYWluXHJcbiAgICBjb25zb2xlLmxvZyhcIkFscmVhZHkgYXBwcm92ZWQgdGhlIG9yaWdpbidcIiArIG9yaWdpbiArIFwiJywgbm90IGFza2luZyBhZ2FpblwiKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdmFyIGxvY2FsaXplZFdhcm5pbmdUaXRsZSA9IHRoaXMuX2dldExvY2FsaXplZFN0cmluZyhcIndlYlNlY3VyaXR5V2FybmluZ1wiKTtcclxuICB2YXIgY29tcGxldGVXYXJuaW5nTXNnICA9IGxvY2FsaXplZFdhcm5pbmdUaXRsZSArIFwiXFxuXFxuXCIgKyBob3N0TmFtZSArIFwiXFxuXCI7XHJcbiAgdmFyIGlzQ29uZmlybWVkID0gY29uZmlybShjb21wbGV0ZVdhcm5pbmdNc2cpO1xyXG5cclxuICBpZiAoaXNDb25maXJtZWQpIHtcclxuICAgIC8vIFNldCBhIHNlc3Npb24gY29va2llIHRvIG1hcmsgdGhhdCB3ZSd2ZSBhcHByb3ZlZCB0aGlzIGFscmVhZHlcclxuICAgIEFwcHJvdmVkT3JpZ2lucy5hZGRBcHByb3ZlZE9yaWdpbihvcmlnaW4pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzQ29uZmlybWVkO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZ2V0Q3VycmVudExvY2FsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gVXNlIGN1cnJlbnQgYnJvd3NlcidzIGxvY2FsZSB0byBnZXQgYSBsb2NhbGl6ZWQgd2FybmluZyBtZXNzYWdlXHJcbiAgICB2YXIgY3VycmVudEJyb3dzZXJMYW5ndWFnZSA9IChuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZSk7XHJcbiAgICB2YXIgbG9jYWxlID0gY3VycmVudEJyb3dzZXJMYW5ndWFnZT8gY3VycmVudEJyb3dzZXJMYW5ndWFnZS5zdWJzdHJpbmcoMCwgMik6IFwiZW5cIjtcclxuXHJcbiAgICB2YXIgc3VwcG9ydGVkTG9jYWxlcyA9IFtcImRlXCIsIFwiZW5cIiwgXCJlc1wiLCBcImZyXCIsIFwiamFcIiwgXCJrb1wiLCBcInB0XCIsIFwiemhcIl07XHJcbiAgICAvLyBGYWxsIGJhY2sgdG8gRW5nbGlzaCBmb3Igb3RoZXIgdW5zdXBwb3J0ZWQgbGFuYWd1YWdlc1xyXG4gICAgaWYgKHN1cHBvcnRlZExvY2FsZXMuaW5kZXhPZihsb2NhbGUpIDwgMCkge1xyXG4gICAgICAgIGxvY2FsZSA9ICdlbic7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxvY2FsZTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2dldExvY2FsaXplZFN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZ0tleSkge1xyXG4gICAgdmFyIGxvY2FsZSA9IHRoaXMuX2dldEN1cnJlbnRMb2NhbGUoKTtcclxuXHJcbiAgICAvLyBVc2Ugc3RhdGljIHJlcXVpcmUgaGVyZSwgb3RoZXJ3aXNlIHdlYnBhY2sgd291bGQgZ2VuZXJhdGUgYSBtdWNoIGJpZ2dlciBKUyBmaWxlXHJcbiAgICB2YXIgZGVTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZGUtREUuanNvbicpO1xyXG4gICAgdmFyIGVuU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2VuLVVTLmpzb24nKTtcclxuICAgIHZhciBlc1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lcy1FUy5qc29uJyk7XHJcbiAgICB2YXIgamFTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfamEtSlAuanNvbicpO1xyXG4gICAgdmFyIGZyU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb24nKTtcclxuICAgIHZhciBrb1N0cmluZ3NNYXAgPSByZXF1aXJlKCdqc29uIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19rby1LUi5qc29uJyk7XHJcbiAgICB2YXIgcHRTdHJpbmdzTWFwID0gcmVxdWlyZSgnanNvbiEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfcHQtQlIuanNvbicpO1xyXG4gICAgdmFyIHpoU3RyaW5nc01hcCA9IHJlcXVpcmUoJ2pzb24hLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb24nKTtcclxuXHJcbiAgICB2YXIgc3RyaW5nSnNvbk1hcEJ5TG9jYWxlID1cclxuICAgIHtcclxuICAgICAgICBcImRlXCI6IGRlU3RyaW5nc01hcCxcclxuICAgICAgICBcImVuXCI6IGVuU3RyaW5nc01hcCxcclxuICAgICAgICBcImVzXCI6IGVzU3RyaW5nc01hcCxcclxuICAgICAgICBcImZyXCI6IGZyU3RyaW5nc01hcCxcclxuICAgICAgICBcImphXCI6IGphU3RyaW5nc01hcCxcclxuICAgICAgICBcImtvXCI6IGtvU3RyaW5nc01hcCxcclxuICAgICAgICBcInB0XCI6IHB0U3RyaW5nc01hcCxcclxuICAgICAgICBcInpoXCI6IHpoU3RyaW5nc01hcFxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbG9jYWxpemVkU3RyaW5nc0pzb24gPSBzdHJpbmdKc29uTWFwQnlMb2NhbGVbbG9jYWxlXTtcclxuICAgIHJldHVybiBsb2NhbGl6ZWRTdHJpbmdzSnNvbltzdHJpbmdLZXldO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fcmVjZWl2ZU1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcclxuICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIG1lc3NhZ2UhXCIpO1xyXG5cclxuICB2YXIgd2RjID0gdGhpcy5nbG9iYWxPYmouX3dkYztcclxuICBpZiAoIXdkYykge1xyXG4gICAgdGhyb3cgXCJObyBXREMgcmVnaXN0ZXJlZC4gRGlkIHlvdSBmb3JnZXQgdG8gY2FsbCB0YWJsZWF1LnJlZ2lzdGVyQ29ubmVjdG9yP1wiO1xyXG4gIH1cclxuXHJcbiAgdmFyIHBheWxvYWRPYmogPSB0aGlzLl9nZXRQYXlsb2FkT2JqKGV2dC5kYXRhKTtcclxuICBpZighcGF5bG9hZE9iaikgcmV0dXJuOyAvLyBUaGlzIG1lc3NhZ2UgaXMgbm90IG5lZWRlZCBmb3IgV0RDXHJcblxyXG4gIGlmICghdGhpcy5fc291cmNlV2luZG93KSB7XHJcbiAgICB0aGlzLl9zb3VyY2VXaW5kb3cgPSBldnQuc291cmNlO1xyXG4gICAgdGhpcy5fc291cmNlT3JpZ2luID0gZXZ0Lm9yaWdpbjtcclxuICB9XHJcblxyXG4gIHZhciBtc2dEYXRhID0gcGF5bG9hZE9iai5tc2dEYXRhO1xyXG4gIHRoaXMuX2FwcGx5UHJvcGVydHlWYWx1ZXMocGF5bG9hZE9iai5wcm9wcyk7XHJcblxyXG4gIHN3aXRjaChwYXlsb2FkT2JqLm1zZ05hbWUpIHtcclxuICAgIGNhc2UgXCJpbml0XCI6XHJcbiAgICAgIC8vIFdhcm4gdXNlcnMgYWJvdXQgcG9zc2libGUgcGhpbmlzaGluZyBhdHRhY2tzXHJcbiAgICAgIHZhciBjb25maXJtUmVzdWx0ID0gdGhpcy5fZ2V0V2ViU2VjdXJpdHlXYXJuaW5nQ29uZmlybSgpO1xyXG4gICAgICBpZiAoIWNvbmZpcm1SZXN1bHQpIHtcclxuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdsb2JhbE9iai50YWJsZWF1LnBoYXNlID0gbXNnRGF0YS5waGFzZTtcclxuICAgICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VySW5pdGlhbGl6YXRpb24oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwic2h1dGRvd25cIjpcclxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlclNodXRkb3duKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcImdldFNjaGVtYVwiOlxyXG4gICAgICB0aGlzLmdsb2JhbE9iai5fdGFibGVhdS50cmlnZ2VyU2NoZW1hR2F0aGVyaW5nKCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcImdldERhdGFcIjpcclxuICAgICAgdGhpcy5nbG9iYWxPYmouX3RhYmxlYXUudHJpZ2dlckRhdGFHYXRoZXJpbmcobXNnRGF0YS50YWJsZXNBbmRJbmNyZW1lbnRWYWx1ZXMpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn07XHJcblxyXG4vKioqKiBQVUJMSUMgSU5URVJGQUNFICoqKioqL1xyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdFB1YmxpY0ludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHB1YmxpYyBpbnRlcmZhY2VcIik7XHJcbiAgdGhpcy5fc3VibWl0Q2FsbGVkID0gZmFsc2U7XHJcblxyXG4gIHZhciBwdWJsaWNJbnRlcmZhY2UgPSB7fTtcclxuICBwdWJsaWNJbnRlcmZhY2UuYWJvcnRGb3JBdXRoID0gdGhpcy5fYWJvcnRGb3JBdXRoLmJpbmQodGhpcyk7XHJcbiAgcHVibGljSW50ZXJmYWNlLmFib3J0V2l0aEVycm9yID0gdGhpcy5fYWJvcnRXaXRoRXJyb3IuYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2UuYWRkQ3Jvc3NPcmlnaW5FeGNlcHRpb24gPSB0aGlzLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbi5iaW5kKHRoaXMpO1xyXG4gIHB1YmxpY0ludGVyZmFjZS5sb2cgPSB0aGlzLl9sb2cuYmluZCh0aGlzKTtcclxuICBwdWJsaWNJbnRlcmZhY2Uuc3VibWl0ID0gdGhpcy5fc3VibWl0LmJpbmQodGhpcyk7XHJcblxyXG4gIC8vIEFzc2lnbiB0aGUgcHVibGljIGludGVyZmFjZSB0byB0aGlzXHJcbiAgdGhpcy5wdWJsaWNJbnRlcmZhY2UgPSBwdWJsaWNJbnRlcmZhY2U7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydEZvckF1dGggPSBmdW5jdGlvbihtc2cpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcImFib3J0Rm9yQXV0aFwiLCB7XCJtc2dcIjogbXNnfSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hYm9ydFdpdGhFcnJvciA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiYWJvcnRXaXRoRXJyb3JcIiwge1wiZXJyb3JNc2dcIjogbXNnfSk7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGRlc3RPcmlnaW5MaXN0KSB7XHJcbiAgLy8gRG9uJ3QgYm90aGVyIHBhc3NpbmcgdGhpcyBiYWNrIHRvIHRoZSBzaW11bGF0b3Igc2luY2UgdGhlcmUncyBub3RoaW5nIGl0IGNhblxyXG4gIC8vIGRvLiBKdXN0IGNhbGwgYmFjayB0byB0aGUgV0RDIGluZGljYXRpbmcgdGhhdCBpdCB3b3JrZWRcclxuICBjb25zb2xlLmxvZyhcIkNyb3NzIE9yaWdpbiBFeGNlcHRpb24gcmVxdWVzdGVkIGluIHRoZSBzaW11bGF0b3IuIFByZXRlbmRpbmcgdG8gd29yay5cIilcclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5nbG9iYWxPYmouX3dkYy5hZGRDcm9zc09yaWdpbkV4Y2VwdGlvbkNvbXBsZXRlZChkZXN0T3JpZ2luTGlzdCk7XHJcbiAgfS5iaW5kKHRoaXMpLCAwKTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uKG1zZykge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwibG9nXCIsIHtcImxvZ01zZ1wiOiBtc2d9KTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3N1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwic3VibWl0XCIpO1xyXG59O1xyXG5cclxuLyoqKiogUFJJVkFURSBJTlRFUkZBQ0UgKioqKiovXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9pbml0UHJpdmF0ZUludGVyZmFjZSA9IGZ1bmN0aW9uKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIHByaXZhdGUgaW50ZXJmYWNlXCIpO1xyXG5cclxuICB2YXIgcHJpdmF0ZUludGVyZmFjZSA9IHt9O1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX2luaXRDYWxsYmFjayA9IHRoaXMuX2luaXRDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX3NodXRkb3duQ2FsbGJhY2sgPSB0aGlzLl9zaHV0ZG93bkNhbGxiYWNrLmJpbmQodGhpcyk7XHJcbiAgcHJpdmF0ZUludGVyZmFjZS5fc2NoZW1hQ2FsbGJhY2sgPSB0aGlzLl9zY2hlbWFDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gIHByaXZhdGVJbnRlcmZhY2UuX3RhYmxlRGF0YUNhbGxiYWNrID0gdGhpcy5fdGFibGVEYXRhQ2FsbGJhY2suYmluZCh0aGlzKTtcclxuICBwcml2YXRlSW50ZXJmYWNlLl9kYXRhRG9uZUNhbGxiYWNrID0gdGhpcy5fZGF0YURvbmVDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG5cclxuICAvLyBBc3NpZ24gdGhlIHByaXZhdGUgaW50ZXJmYWNlIHRvIHRoaXNcclxuICB0aGlzLnByaXZhdGVJbnRlcmZhY2UgPSBwcml2YXRlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5faW5pdENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJpbml0Q2FsbGJhY2tcIik7XHJcbn1cclxuXHJcblNpbXVsYXRvckRpc3BhdGNoZXIucHJvdG90eXBlLl9zaHV0ZG93bkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJzaHV0ZG93bkNhbGxiYWNrXCIpO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fc2NoZW1hQ2FsbGJhY2sgPSBmdW5jdGlvbihzY2hlbWEsIHN0YW5kYXJkQ29ubmVjdGlvbnMpIHtcclxuICB0aGlzLl9zZW5kTWVzc2FnZShcIl9zY2hlbWFDYWxsYmFja1wiLCB7XCJzY2hlbWFcIjogc2NoZW1hLCBcInN0YW5kYXJkQ29ubmVjdGlvbnNcIiA6IHN0YW5kYXJkQ29ubmVjdGlvbnMgfHwgW119KTtcclxufVxyXG5cclxuU2ltdWxhdG9yRGlzcGF0Y2hlci5wcm90b3R5cGUuX3RhYmxlRGF0YUNhbGxiYWNrID0gZnVuY3Rpb24odGFibGVOYW1lLCBkYXRhKSB7XHJcbiAgdGhpcy5fc2VuZE1lc3NhZ2UoXCJfdGFibGVEYXRhQ2FsbGJhY2tcIiwgeyBcInRhYmxlTmFtZVwiOiB0YWJsZU5hbWUsIFwiZGF0YVwiOiBkYXRhIH0pO1xyXG59XHJcblxyXG5TaW11bGF0b3JEaXNwYXRjaGVyLnByb3RvdHlwZS5fZGF0YURvbmVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMuX3NlbmRNZXNzYWdlKFwiX2RhdGFEb25lQ2FsbGJhY2tcIik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2ltdWxhdG9yRGlzcGF0Y2hlcjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL1NpbXVsYXRvckRpc3BhdGNoZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcclxuKiBAY2xhc3MgUmVwcmVzZW50cyBhIHNpbmdsZSB0YWJsZSB3aGljaCBUYWJsZWF1IGhhcyByZXF1ZXN0ZWRcclxuKiBAcGFyYW0gdGFibGVJbmZvIHtPYmplY3R9IC0gSW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYmxlXHJcbiogQHBhcmFtIGluY3JlbWVudFZhbHVlIHtzdHJpbmc9fSAtIEluY3JlbWVudGFsIHVwZGF0ZSB2YWx1ZVxyXG4qL1xyXG5mdW5jdGlvbiBUYWJsZSh0YWJsZUluZm8sIGluY3JlbWVudFZhbHVlLCBkYXRhQ2FsbGJhY2tGbikge1xyXG4gIC8qKiBAbWVtYmVyIHtPYmplY3R9IEluZm9ybWF0aW9uIGFib3V0IHRoZSB0YWJsZSB3aGljaCBoYXMgYmVlbiByZXF1ZXN0ZWQuIFRoaXMgaXNcclxuICBndWFyYW50ZWVkIHRvIGJlIG9uZSBvZiB0aGUgdGFibGVzIHRoZSBjb25uZWN0b3IgcmV0dXJuZWQgaW4gdGhlIGNhbGwgdG8gZ2V0U2NoZW1hLiAqL1xyXG4gIHRoaXMudGFibGVJbmZvID0gdGFibGVJbmZvO1xyXG5cclxuICAvKiogQG1lbWJlciB7c3RyaW5nfSBEZWZpbmVzIHRoZSBpbmNyZW1lbnRhbCB1cGRhdGUgdmFsdWUgZm9yIHRoaXMgdGFibGUuIEVtcHR5IHN0cmluZyBpZlxyXG4gIHRoZXJlIGlzIG5vdCBhbiBpbmNyZW1lbnRhbCB1cGRhdGUgcmVxdWVzdGVkLiAqL1xyXG4gIHRoaXMuaW5jcmVtZW50VmFsdWUgPSBpbmNyZW1lbnRWYWx1ZSB8fCBcIlwiO1xyXG5cclxuICAvKiogQHByaXZhdGUgKi9cclxuICB0aGlzLl9kYXRhQ2FsbGJhY2tGbiA9IGRhdGFDYWxsYmFja0ZuO1xyXG5cclxuICAvLyBiaW5kIHRoZSBwdWJsaWMgZmFjaW5nIHZlcnNpb24gb2YgdGhpcyBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgcGFzc2VkIGFyb3VuZFxyXG4gIHRoaXMuYXBwZW5kUm93cyA9IHRoaXMuX2FwcGVuZFJvd3MuYmluZCh0aGlzKTtcclxufVxyXG5cclxuLyoqXHJcbiogQG1ldGhvZCBhcHBlbmRzIHRoZSBnaXZlbiByb3dzIHRvIHRoZSBzZXQgb2YgZGF0YSBjb250YWluZWQgaW4gdGhpcyB0YWJsZVxyXG4qIEBwYXJhbSBkYXRhIHthcnJheX0gLSBFaXRoZXIgYW4gYXJyYXkgb2YgYXJyYXlzIG9yIGFuIGFycmF5IG9mIG9iamVjdHMgd2hpY2ggcmVwcmVzZW50XHJcbiogdGhlIGluZGl2aWR1YWwgcm93cyBvZiBkYXRhIHRvIGFwcGVuZCB0byB0aGlzIHRhYmxlXHJcbiovXHJcblRhYmxlLnByb3RvdHlwZS5fYXBwZW5kUm93cyA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAvLyBEbyBzb21lIHF1aWNrIHZhbGlkYXRpb24gdGhhdCB0aGlzIGRhdGEgaXMgdGhlIGZvcm1hdCB3ZSBleHBlY3RcclxuICBpZiAoIWRhdGEpIHtcclxuICAgIGNvbnNvbGUud2FybihcInJvd3MgZGF0YSBpcyBudWxsIG9yIHVuZGVmaW5lZFwiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG4gICAgLy8gTG9nIGEgd2FybmluZyBiZWNhdXNlIHRoZSBkYXRhIGlzIG5vdCBhbiBhcnJheSBsaWtlIHdlIGV4cGVjdGVkXHJcbiAgICBjb25zb2xlLndhcm4oXCJUYWJsZS5hcHBlbmRSb3dzIG11c3QgdGFrZSBhbiBhcnJheSBvZiBhcnJheXMgb3IgYXJyYXkgb2Ygb2JqZWN0c1wiKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIENhbGwgYmFjayB3aXRoIHRoZSByb3dzIGZvciB0aGlzIHRhYmxlXHJcbiAgdGhpcy5fZGF0YUNhbGxiYWNrRm4odGhpcy50YWJsZUluZm8uaWQsIGRhdGEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vVGFibGUuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBjb3B5RnVuY3Rpb25zKHNyYywgZGVzdCkge1xyXG4gIGZvcih2YXIga2V5IGluIHNyYykge1xyXG4gICAgaWYgKHR5cGVvZiBzcmNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNvcHlGdW5jdGlvbnMgPSBjb3B5RnVuY3Rpb25zO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vVXRpbGl0aWVzLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcclxuICogQ29va2llcy5qcyAtIDEuMi4yXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TY290dEhhbXBlci9Db29raWVzXHJcbiAqXHJcbiAqIFRoaXMgaXMgZnJlZSBhbmQgdW5lbmN1bWJlcmVkIHNvZnR3YXJlIHJlbGVhc2VkIGludG8gdGhlIHB1YmxpYyBkb21haW4uXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGZhY3RvcnkgPSBmdW5jdGlvbiAod2luZG93KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29va2llcy5qcyByZXF1aXJlcyBhIGB3aW5kb3dgIHdpdGggYSBgZG9jdW1lbnRgIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLmdldChrZXkpIDogQ29va2llcy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsb3dzIGZvciBzZXR0ZXIgaW5qZWN0aW9uIGluIHVuaXQgdGVzdHNcclxuICAgICAgICBDb29raWVzLl9kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHJcbiAgICAgICAgLy8gVXNlZCB0byBlbnN1cmUgY29va2llIGtleXMgZG8gbm90IGNvbGxpZGUgd2l0aFxyXG4gICAgICAgIC8vIGJ1aWx0LWluIGBPYmplY3RgIHByb3BlcnRpZXNcclxuICAgICAgICBDb29raWVzLl9jYWNoZUtleVByZWZpeCA9ICdjb29rZXkuJzsgLy8gSHVyciBodXJyLCA6KVxyXG4gICAgICAgIFxyXG4gICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgPSBuZXcgRGF0ZSgnRnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBVVEMnKTtcclxuXHJcbiAgICAgICAgQ29va2llcy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChDb29raWVzLl9jYWNoZWREb2N1bWVudENvb2tpZSAhPT0gQ29va2llcy5fZG9jdW1lbnQuY29va2llKSB7XHJcbiAgICAgICAgICAgICAgICBDb29raWVzLl9yZW5ld0NhY2hlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IENvb2tpZXMuX2NhY2hlW0Nvb2tpZXMuX2NhY2hlS2V5UHJlZml4ICsga2V5XTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBDb29raWVzLl9nZXRFeHRlbmRlZE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZXhwaXJlcyA9IENvb2tpZXMuX2dldEV4cGlyZXNEYXRlKHZhbHVlID09PSB1bmRlZmluZWQgPyAtMSA6IG9wdGlvbnMuZXhwaXJlcyk7XHJcblxyXG4gICAgICAgICAgICBDb29raWVzLl9kb2N1bWVudC5jb29raWUgPSBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyhrZXksIHZhbHVlLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuZXhwaXJlID0gZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5zZXQoa2V5LCB1bmRlZmluZWQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEV4dGVuZGVkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwYXRoOiBvcHRpb25zICYmIG9wdGlvbnMucGF0aCB8fCBDb29raWVzLmRlZmF1bHRzLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBkb21haW46IG9wdGlvbnMgJiYgb3B0aW9ucy5kb21haW4gfHwgQ29va2llcy5kZWZhdWx0cy5kb21haW4sXHJcbiAgICAgICAgICAgICAgICBleHBpcmVzOiBvcHRpb25zICYmIG9wdGlvbnMuZXhwaXJlcyB8fCBDb29raWVzLmRlZmF1bHRzLmV4cGlyZXMsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zZWN1cmUgIT09IHVuZGVmaW5lZCA/ICBvcHRpb25zLnNlY3VyZSA6IENvb2tpZXMuZGVmYXVsdHMuc2VjdXJlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5faXNWYWxpZERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRhdGUpID09PSAnW29iamVjdCBEYXRlXScgJiYgIWlzTmFOKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRFeHBpcmVzRGF0ZSA9IGZ1bmN0aW9uIChleHBpcmVzLCBub3cpIHtcclxuICAgICAgICAgICAgbm93ID0gbm93IHx8IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cGlyZXMgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBleHBpcmVzID0gZXhwaXJlcyA9PT0gSW5maW5pdHkgP1xyXG4gICAgICAgICAgICAgICAgICAgIENvb2tpZXMuX21heEV4cGlyZURhdGUgOiBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBpcmVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZXhwaXJlcyA9IG5ldyBEYXRlKGV4cGlyZXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZXhwaXJlcyAmJiAhQ29va2llcy5faXNWYWxpZERhdGUoZXhwaXJlcykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYGV4cGlyZXNgIHBhcmFtZXRlciBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgdmFsaWQgRGF0ZSBpbnN0YW5jZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwaXJlcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZW5lcmF0ZUNvb2tpZVN0cmluZyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXiMkJitcXF5gfF0vZywgZW5jb2RlVVJJQ29tcG9uZW50KTtcclxuICAgICAgICAgICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcKC9nLCAnJTI4JykucmVwbGFjZSgvXFwpL2csICclMjknKTtcclxuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14hIyQmLStcXC0tOjwtXFxbXFxdLX5dL2csIGVuY29kZVVSSUNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvb2tpZVN0cmluZyA9IGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgICAgICAgICBjb29raWVTdHJpbmcgKz0gb3B0aW9ucy5wYXRoID8gJztwYXRoPScgKyBvcHRpb25zLnBhdGggOiAnJztcclxuICAgICAgICAgICAgY29va2llU3RyaW5nICs9IG9wdGlvbnMuZG9tYWluID8gJztkb21haW49JyArIG9wdGlvbnMuZG9tYWluIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLmV4cGlyZXMgPyAnO2V4cGlyZXM9JyArIG9wdGlvbnMuZXhwaXJlcy50b1VUQ1N0cmluZygpIDogJyc7XHJcbiAgICAgICAgICAgIGNvb2tpZVN0cmluZyArPSBvcHRpb25zLnNlY3VyZSA/ICc7c2VjdXJlJyA6ICcnO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVN0cmluZztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoZG9jdW1lbnRDb29raWUpIHtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZUNhY2hlID0ge307XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzQXJyYXkgPSBkb2N1bWVudENvb2tpZSA/IGRvY3VtZW50Q29va2llLnNwbGl0KCc7ICcpIDogW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb2tpZUt2cCA9IENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcoY29va2llc0FycmF5W2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29va2llQ2FjaGVbQ29va2llcy5fY2FjaGVLZXlQcmVmaXggKyBjb29raWVLdnAua2V5XSA9IGNvb2tpZUt2cC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvb2tpZUNhY2hlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIENvb2tpZXMuX2dldEtleVZhbHVlUGFpckZyb21Db29raWVTdHJpbmcgPSBmdW5jdGlvbiAoY29va2llU3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIFwiPVwiIGlzIGEgdmFsaWQgY2hhcmFjdGVyIGluIGEgY29va2llIHZhbHVlIGFjY29yZGluZyB0byBSRkM2MjY1LCBzbyBjYW5ub3QgYHNwbGl0KCc9JylgXHJcbiAgICAgICAgICAgIHZhciBzZXBhcmF0b3JJbmRleCA9IGNvb2tpZVN0cmluZy5pbmRleE9mKCc9Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBJRSBvbWl0cyB0aGUgXCI9XCIgd2hlbiB0aGUgY29va2llIHZhbHVlIGlzIGFuIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBzZXBhcmF0b3JJbmRleCA9IHNlcGFyYXRvckluZGV4IDwgMCA/IGNvb2tpZVN0cmluZy5sZW5ndGggOiBzZXBhcmF0b3JJbmRleDtcclxuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBjb29raWVTdHJpbmcuc3Vic3RyKDAsIHNlcGFyYXRvckluZGV4KTtcclxuICAgICAgICAgICAgdmFyIGRlY29kZWRLZXk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvZGVkS2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIHR5cGVvZiBjb25zb2xlLmVycm9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGRlY29kZSBjb29raWUgd2l0aCBrZXkgXCInICsga2V5ICsgJ1wiJywgZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGRlY29kZWRLZXksXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogY29va2llU3RyaW5nLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpIC8vIERlZmVyIGRlY29kaW5nIHZhbHVlIHVudGlsIGFjY2Vzc2VkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fcmVuZXdDYWNoZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGUgPSBDb29raWVzLl9nZXRDYWNoZUZyb21TdHJpbmcoQ29va2llcy5fZG9jdW1lbnQuY29va2llKTtcclxuICAgICAgICAgICAgQ29va2llcy5fY2FjaGVkRG9jdW1lbnRDb29raWUgPSBDb29raWVzLl9kb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgQ29va2llcy5fYXJlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRlc3RLZXkgPSAnY29va2llcy5qcyc7XHJcbiAgICAgICAgICAgIHZhciBhcmVFbmFibGVkID0gQ29va2llcy5zZXQodGVzdEtleSwgMSkuZ2V0KHRlc3RLZXkpID09PSAnMSc7XHJcbiAgICAgICAgICAgIENvb2tpZXMuZXhwaXJlKHRlc3RLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJlRW5hYmxlZDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBDb29raWVzLmVuYWJsZWQgPSBDb29raWVzLl9hcmVFbmFibGVkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb29raWVzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29va2llc0V4cG9ydCA9IHR5cGVvZiBnbG9iYWwuZG9jdW1lbnQgPT09ICdvYmplY3QnID8gZmFjdG9yeShnbG9iYWwpIDogZmFjdG9yeTtcclxuXHJcbiAgICAvLyBBTUQgc3VwcG9ydFxyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBjb29raWVzRXhwb3J0OyB9KTtcclxuICAgIC8vIENvbW1vbkpTL05vZGUuanMgc3VwcG9ydFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBTdXBwb3J0IE5vZGUuanMgc3BlY2lmaWMgYG1vZHVsZS5leHBvcnRzYCAod2hpY2ggY2FuIGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29va2llc0V4cG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQnV0IGFsd2F5cyBzdXBwb3J0IENvbW1vbkpTIG1vZHVsZSAxLjEuMSBzcGVjIChgZXhwb3J0c2AgY2Fubm90IGJlIGEgZnVuY3Rpb24pXHJcbiAgICAgICAgZXhwb3J0cy5Db29raWVzID0gY29va2llc0V4cG9ydDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2xvYmFsLkNvb2tpZXMgPSBjb29raWVzRXhwb3J0O1xyXG4gICAgfVxyXG59KSh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3cpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nvb2tpZXMtanMvZGlzdC9jb29raWVzLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19kZS1ERS5qc29uXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19lbi1VUy5qc29uXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfZXMtRVMuanNvblxuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX2ZyLUZSLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwiVG8gaGVscCBwcmV2ZW50IG1hbGljaW91cyBzaXRlcyBmcm9tIGdldHRpbmcgYWNjZXNzIHRvIHlvdXIgY29uZmlkZW50aWFsIGRhdGEsIGNvbmZpcm0gdGhhdCB5b3UgdHJ1c3QgdGhlIGZvbGxvd2luZyBzaXRlOlwiXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2pzb24tbG9hZGVyIS4vcmVzb3VyY2VzL1NoaW1fbGliX3Jlc291cmNlc19qYS1KUC5qc29uXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIndlYlNlY3VyaXR5V2FybmluZ1wiOiBcIlRvIGhlbHAgcHJldmVudCBtYWxpY2lvdXMgc2l0ZXMgZnJvbSBnZXR0aW5nIGFjY2VzcyB0byB5b3VyIGNvbmZpZGVudGlhbCBkYXRhLCBjb25maXJtIHRoYXQgeW91IHRydXN0IHRoZSBmb2xsb3dpbmcgc2l0ZTpcIlxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc29uLWxvYWRlciEuL3Jlc291cmNlcy9TaGltX2xpYl9yZXNvdXJjZXNfa28tS1IuanNvblxuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJ3ZWJTZWN1cml0eVdhcm5pbmdcIjogXCJUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3B0LUJSLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwid2ViU2VjdXJpdHlXYXJuaW5nXCI6IFwid3dUbyBoZWxwIHByZXZlbnQgbWFsaWNpb3VzIHNpdGVzIGZyb20gZ2V0dGluZyBhY2Nlc3MgdG8geW91ciBjb25maWRlbnRpYWwgZGF0YSwgY29uZmlybSB0aGF0IHlvdSB0cnVzdCB0aGUgZm9sbG93aW5nIHNpdGU6XCJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vanNvbi1sb2FkZXIhLi9yZXNvdXJjZXMvU2hpbV9saWJfcmVzb3VyY2VzX3poLUNOLmpzb25cbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyohXG4gKiBqc1VyaVxuICogaHR0cHM6Ly9naXRodWIuY29tL2RlcmVrLXdhdHNvbi9qc1VyaVxuICpcbiAqIENvcHlyaWdodCAyMDEzLCBEZXJlayBXYXRzb25cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqXG4gKiBJbmNsdWRlcyBwYXJzZVVyaSByZWd1bGFyIGV4cHJlc3Npb25zXG4gKiBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvcGFyc2V1cmlcbiAqIENvcHlyaWdodCAyMDA3LCBTdGV2ZW4gTGV2aXRoYW5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlICovXG5cbihmdW5jdGlvbihnbG9iYWwpIHtcblxuICB2YXIgcmUgPSB7XG4gICAgc3RhcnRzX3dpdGhfc2xhc2hlczogL15cXC8rLyxcbiAgICBlbmRzX3dpdGhfc2xhc2hlczogL1xcLyskLyxcbiAgICBwbHVzZXM6IC9cXCsvZyxcbiAgICBxdWVyeV9zZXBhcmF0b3I6IC9bJjtdLyxcbiAgICB1cmlfcGFyc2VyOiAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBcXC9dKikoPzo6KFteOkBdKikpPyk/QCk/KFxcW1swLTlhLWZBLUY6Ll0rXFxdfFteOlxcLz8jXSopKD86OihcXGQrfCg/PTopKSk/KDopPykoKCgoPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvXG4gIH07XG5cbiAgLyoqXG4gICAqIERlZmluZSBmb3JFYWNoIGZvciBvbGRlciBqcyBlbnZpcm9ubWVudHNcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZvckVhY2gjQ29tcGF0aWJpbGl0eVxuICAgKi9cbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBULCBrO1xuXG4gICAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJyB0aGlzIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgVCA9IHRoaXNBcmc7XG4gICAgICB9XG5cbiAgICAgIGsgPSAwO1xuXG4gICAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgICB2YXIga1ZhbHVlO1xuICAgICAgICBpZiAoayBpbiBPKSB7XG4gICAgICAgICAga1ZhbHVlID0gT1trXTtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG4gICAgICAgIH1cbiAgICAgICAgaysrO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogdW5lc2NhcGUgYSBxdWVyeSBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHMgZW5jb2RlZCB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgZGVjb2RlZCB2YWx1ZVxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb2RlKHMpIHtcbiAgICBpZiAocykge1xuICAgICAgICBzID0gcy50b1N0cmluZygpLnJlcGxhY2UocmUucGx1c2VzLCAnJTIwJyk7XG4gICAgICAgIHMgPSBkZWNvZGVVUklDb21wb25lbnQocyk7XG4gICAgfVxuICAgIHJldHVybiBzO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyZWFrcyBhIHVyaSBzdHJpbmcgZG93biBpbnRvIGl0cyBpbmRpdmlkdWFsIHBhcnRzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyIHVyaVxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICAgICBwYXJ0c1xuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VVcmkoc3RyKSB7XG4gICAgdmFyIHBhcnNlciA9IHJlLnVyaV9wYXJzZXI7XG4gICAgdmFyIHBhcnNlcktleXMgPSBbXCJzb3VyY2VcIiwgXCJwcm90b2NvbFwiLCBcImF1dGhvcml0eVwiLCBcInVzZXJJbmZvXCIsIFwidXNlclwiLCBcInBhc3N3b3JkXCIsIFwiaG9zdFwiLCBcInBvcnRcIiwgXCJpc0NvbG9uVXJpXCIsIFwicmVsYXRpdmVcIiwgXCJwYXRoXCIsIFwiZGlyZWN0b3J5XCIsIFwiZmlsZVwiLCBcInF1ZXJ5XCIsIFwiYW5jaG9yXCJdO1xuICAgIHZhciBtID0gcGFyc2VyLmV4ZWMoc3RyIHx8ICcnKTtcbiAgICB2YXIgcGFydHMgPSB7fTtcblxuICAgIHBhcnNlcktleXMuZm9yRWFjaChmdW5jdGlvbihrZXksIGkpIHtcbiAgICAgIHBhcnRzW2tleV0gPSBtW2ldIHx8ICcnO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBhcnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEJyZWFrcyBhIHF1ZXJ5IHN0cmluZyBkb3duIGludG8gYW4gYXJyYXkgb2Yga2V5L3ZhbHVlIHBhaXJzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyIHF1ZXJ5XG4gICAqIEByZXR1cm4ge2FycmF5fSAgICAgIGFycmF5IG9mIGFycmF5cyAoa2V5L3ZhbHVlIHBhaXJzKVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VRdWVyeShzdHIpIHtcbiAgICB2YXIgaSwgcHMsIHAsIG4sIGssIHYsIGw7XG4gICAgdmFyIHBhaXJzID0gW107XG5cbiAgICBpZiAodHlwZW9mKHN0cikgPT09ICd1bmRlZmluZWQnIHx8IHN0ciA9PT0gbnVsbCB8fCBzdHIgPT09ICcnKSB7XG4gICAgICByZXR1cm4gcGFpcnM7XG4gICAgfVxuXG4gICAgaWYgKHN0ci5pbmRleE9mKCc/JykgPT09IDApIHtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgcHMgPSBzdHIudG9TdHJpbmcoKS5zcGxpdChyZS5xdWVyeV9zZXBhcmF0b3IpO1xuXG4gICAgZm9yIChpID0gMCwgbCA9IHBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcCA9IHBzW2ldO1xuICAgICAgbiA9IHAuaW5kZXhPZignPScpO1xuXG4gICAgICBpZiAobiAhPT0gMCkge1xuICAgICAgICBrID0gZGVjb2RlKHAuc3Vic3RyaW5nKDAsIG4pKTtcbiAgICAgICAgdiA9IGRlY29kZShwLnN1YnN0cmluZyhuICsgMSkpO1xuICAgICAgICBwYWlycy5wdXNoKG4gPT09IC0xID8gW3AsIG51bGxdIDogW2ssIHZdKTtcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBVcmkgb2JqZWN0XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqL1xuICBmdW5jdGlvbiBVcmkoc3RyKSB7XG4gICAgdGhpcy51cmlQYXJ0cyA9IHBhcnNlVXJpKHN0cik7XG4gICAgdGhpcy5xdWVyeVBhaXJzID0gcGFyc2VRdWVyeSh0aGlzLnVyaVBhcnRzLnF1ZXJ5KTtcbiAgICB0aGlzLmhhc0F1dGhvcml0eVByZWZpeFVzZXJQcmVmID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgZ2V0dGVyL3NldHRlciBtZXRob2RzXG4gICAqL1xuICBbJ3Byb3RvY29sJywgJ3VzZXJJbmZvJywgJ2hvc3QnLCAncG9ydCcsICdwYXRoJywgJ2FuY2hvciddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgVXJpLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy51cmlQYXJ0c1trZXldID0gdmFsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudXJpUGFydHNba2V5XTtcbiAgICB9O1xuICB9KTtcblxuICAvKipcbiAgICogaWYgdGhlcmUgaXMgbm8gcHJvdG9jb2wsIHRoZSBsZWFkaW5nIC8vIGNhbiBiZSBlbmFibGVkIG9yIGRpc2FibGVkXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59ICB2YWxcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIFVyaS5wcm90b3R5cGUuaGFzQXV0aG9yaXR5UHJlZml4ID0gZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmhhc0F1dGhvcml0eVByZWZpeFVzZXJQcmVmID0gdmFsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0F1dGhvcml0eVByZWZpeFVzZXJQcmVmID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gKHRoaXMudXJpUGFydHMuc291cmNlLmluZGV4T2YoJy8vJykgIT09IC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXV0aG9yaXR5UHJlZml4VXNlclByZWY7XG4gICAgfVxuICB9O1xuXG4gIFVyaS5wcm90b3R5cGUuaXNDb2xvblVyaSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMudXJpUGFydHMuaXNDb2xvblVyaSA9ICEhdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISF0aGlzLnVyaVBhcnRzLmlzQ29sb25Vcmk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgcXVlcnkgcGFpcnNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBbdmFsXSAgIHNldCBhIG5ldyBxdWVyeSBzdHJpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgIHF1ZXJ5IHN0cmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHZhciBzID0gJycsIGksIHBhcmFtLCBsO1xuXG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnF1ZXJ5UGFpcnMgPSBwYXJzZVF1ZXJ5KHZhbCk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbCA9IHRoaXMucXVlcnlQYWlycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgaWYgKHMubGVuZ3RoID4gMCkge1xuICAgICAgICBzICs9ICcmJztcbiAgICAgIH1cbiAgICAgIGlmIChwYXJhbVsxXSA9PT0gbnVsbCkge1xuICAgICAgICBzICs9IHBhcmFtWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcyArPSBwYXJhbVswXTtcbiAgICAgICAgcyArPSAnPSc7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1bMV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcyArPSBlbmNvZGVVUklDb21wb25lbnQocGFyYW1bMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzLmxlbmd0aCA+IDAgPyAnPycgKyBzIDogcztcbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgZmlyc3QgcXVlcnkgcGFyYW0gdmFsdWUgZm91bmQgZm9yIHRoZSBrZXlcbiAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgcXVlcnkga2V5XG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgIGZpcnN0IHZhbHVlIGZvdW5kIGZvciBrZXlcbiAgICovXG4gIFVyaS5wcm90b3R5cGUuZ2V0UXVlcnlQYXJhbVZhbHVlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBwYXJhbSwgaSwgbDtcbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBpZiAoa2V5ID09PSBwYXJhbVswXSkge1xuICAgICAgICByZXR1cm4gcGFyYW1bMV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm5zIGFuIGFycmF5IG9mIHF1ZXJ5IHBhcmFtIHZhbHVlcyBmb3IgdGhlIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSBxdWVyeSBrZXlcbiAgICogQHJldHVybiB7YXJyYXl9ICAgICAgYXJyYXkgb2YgdmFsdWVzXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmdldFF1ZXJ5UGFyYW1WYWx1ZXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGFyciA9IFtdLCBpLCBwYXJhbSwgbDtcbiAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5xdWVyeVBhaXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICBpZiAoa2V5ID09PSBwYXJhbVswXSkge1xuICAgICAgICBhcnIucHVzaChwYXJhbVsxXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJlbW92ZXMgcXVlcnkgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSAgICAgcmVtb3ZlIHZhbHVlcyBmb3Iga2V5XG4gICAqIEBwYXJhbSAge3ZhbH0gICAgW3ZhbF0gICByZW1vdmUgYSBzcGVjaWZpYyB2YWx1ZSwgb3RoZXJ3aXNlIHJlbW92ZXMgYWxsXG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5kZWxldGVRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgdmFyIGFyciA9IFtdLCBpLCBwYXJhbSwga2V5TWF0Y2hlc0ZpbHRlciwgdmFsTWF0Y2hlc0ZpbHRlciwgbDtcblxuICAgIGZvciAoaSA9IDAsIGwgPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cbiAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAga2V5TWF0Y2hlc0ZpbHRlciA9IGRlY29kZShwYXJhbVswXSkgPT09IGRlY29kZShrZXkpO1xuICAgICAgdmFsTWF0Y2hlc0ZpbHRlciA9IHBhcmFtWzFdID09PSB2YWw7XG5cbiAgICAgIGlmICgoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiAha2V5TWF0Y2hlc0ZpbHRlcikgfHwgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgKCFrZXlNYXRjaGVzRmlsdGVyIHx8ICF2YWxNYXRjaGVzRmlsdGVyKSkpIHtcbiAgICAgICAgYXJyLnB1c2gocGFyYW0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucXVlcnlQYWlycyA9IGFycjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBhZGRzIGEgcXVlcnkgcGFyYW1ldGVyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIGtleSAgICAgICAgYWRkIHZhbHVlcyBmb3Iga2V5XG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHZhbCAgICAgICAgdmFsdWUgdG8gYWRkXG4gICAqIEBwYXJhbSAge2ludGVnZXJ9IFtpbmRleF0gICAgc3BlY2lmaWMgaW5kZXggdG8gYWRkIHRoZSB2YWx1ZSBhdFxuICAgKiBAcmV0dXJuIHtVcml9ICAgICAgICAgICAgICAgIHJldHVybnMgc2VsZiBmb3IgZmx1ZW50IGNoYWluaW5nXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmFkZFF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5LCB2YWwsIGluZGV4KSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgaW5kZXggIT09IC0xKSB7XG4gICAgICBpbmRleCA9IE1hdGgubWluKGluZGV4LCB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoKTtcbiAgICAgIHRoaXMucXVlcnlQYWlycy5zcGxpY2UoaW5kZXgsIDAsIFtrZXksIHZhbF0pO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucXVlcnlQYWlycy5wdXNoKFtrZXksIHZhbF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogdGVzdCBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBhIHF1ZXJ5IHBhcmFtZXRlclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBrZXkgICAgICAgIGFkZCB2YWx1ZXMgZm9yIGtleVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB2YWwgICAgICAgIHZhbHVlIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtpbnRlZ2VyfSBbaW5kZXhdICAgIHNwZWNpZmljIGluZGV4IHRvIGFkZCB0aGUgdmFsdWUgYXRcbiAgICogQHJldHVybiB7VXJpfSAgICAgICAgICAgICAgICByZXR1cm5zIHNlbGYgZm9yIGZsdWVudCBjaGFpbmluZ1xuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5oYXNRdWVyeVBhcmFtID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBpLCBsZW4gPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMucXVlcnlQYWlyc1tpXVswXSA9PSBrZXkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJlcGxhY2VzIHF1ZXJ5IHBhcmFtIHZhbHVlc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSAgICAgICAgIGtleSB0byByZXBsYWNlIHZhbHVlIGZvclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5ld1ZhbCAgICAgIG5ldyB2YWx1ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFtvbGRWYWxdICAgIHJlcGxhY2Ugb25seSBvbmUgc3BlY2lmaWMgdmFsdWUgKG90aGVyd2lzZSByZXBsYWNlcyBhbGwpXG4gICAqIEByZXR1cm4ge1VyaX0gICAgICAgICAgICAgICAgcmV0dXJucyBzZWxmIGZvciBmbHVlbnQgY2hhaW5pbmdcbiAgICovXG4gIFVyaS5wcm90b3R5cGUucmVwbGFjZVF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5LCBuZXdWYWwsIG9sZFZhbCkge1xuICAgIHZhciBpbmRleCA9IC0xLCBsZW4gPSB0aGlzLnF1ZXJ5UGFpcnMubGVuZ3RoLCBpLCBwYXJhbTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFyYW0gPSB0aGlzLnF1ZXJ5UGFpcnNbaV07XG4gICAgICAgIGlmIChkZWNvZGUocGFyYW1bMF0pID09PSBkZWNvZGUoa2V5KSAmJiBkZWNvZGVVUklDb21wb25lbnQocGFyYW1bMV0pID09PSBkZWNvZGUob2xkVmFsKSkge1xuICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgdGhpcy5kZWxldGVRdWVyeVBhcmFtKGtleSwgZGVjb2RlKG9sZFZhbCkpLmFkZFF1ZXJ5UGFyYW0oa2V5LCBuZXdWYWwsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhcmFtID0gdGhpcy5xdWVyeVBhaXJzW2ldO1xuICAgICAgICBpZiAoZGVjb2RlKHBhcmFtWzBdKSA9PT0gZGVjb2RlKGtleSkpIHtcbiAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVsZXRlUXVlcnlQYXJhbShrZXkpO1xuICAgICAgdGhpcy5hZGRRdWVyeVBhcmFtKGtleSwgbmV3VmFsLCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEZWZpbmUgZmx1ZW50IHNldHRlciBtZXRob2RzIChzZXRQcm90b2NvbCwgc2V0SGFzQXV0aG9yaXR5UHJlZml4LCBldGMpXG4gICAqL1xuICBbJ3Byb3RvY29sJywgJ2hhc0F1dGhvcml0eVByZWZpeCcsICdpc0NvbG9uVXJpJywgJ3VzZXJJbmZvJywgJ2hvc3QnLCAncG9ydCcsICdwYXRoJywgJ3F1ZXJ5JywgJ2FuY2hvciddLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIG1ldGhvZCA9ICdzZXQnICsga2V5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpO1xuICAgIFVyaS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgdGhpc1trZXldKHZhbCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9KTtcblxuICAvKipcbiAgICogU2NoZW1lIG5hbWUsIGNvbG9uIGFuZCBkb3VibGVzbGFzaCwgYXMgcmVxdWlyZWRcbiAgICogQHJldHVybiB7c3RyaW5nfSBodHRwOi8vIG9yIHBvc3NpYmx5IGp1c3QgLy9cbiAgICovXG4gIFVyaS5wcm90b3R5cGUuc2NoZW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHMgPSAnJztcblxuICAgIGlmICh0aGlzLnByb3RvY29sKCkpIHtcbiAgICAgIHMgKz0gdGhpcy5wcm90b2NvbCgpO1xuICAgICAgaWYgKHRoaXMucHJvdG9jb2woKS5pbmRleE9mKCc6JykgIT09IHRoaXMucHJvdG9jb2woKS5sZW5ndGggLSAxKSB7XG4gICAgICAgIHMgKz0gJzonO1xuICAgICAgfVxuICAgICAgcyArPSAnLy8nO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5oYXNBdXRob3JpdHlQcmVmaXgoKSAmJiB0aGlzLmhvc3QoKSkge1xuICAgICAgICBzICs9ICcvLyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhbWUgYXMgTW96aWxsYSBuc0lVUkkucHJlUGF0aFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHNjaGVtZTovL3VzZXI6cGFzc3dvcmRAaG9zdDpwb3J0XG4gICAqIEBzZWUgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL25zSVVSSVxuICAgKi9cbiAgVXJpLnByb3RvdHlwZS5vcmlnaW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcyA9IHRoaXMuc2NoZW1lKCk7XG5cbiAgICBpZiAodGhpcy51c2VySW5mbygpICYmIHRoaXMuaG9zdCgpKSB7XG4gICAgICBzICs9IHRoaXMudXNlckluZm8oKTtcbiAgICAgIGlmICh0aGlzLnVzZXJJbmZvKCkuaW5kZXhPZignQCcpICE9PSB0aGlzLnVzZXJJbmZvKCkubGVuZ3RoIC0gMSkge1xuICAgICAgICBzICs9ICdAJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0KCkpIHtcbiAgICAgIHMgKz0gdGhpcy5ob3N0KCk7XG4gICAgICBpZiAodGhpcy5wb3J0KCkgfHwgKHRoaXMucGF0aCgpICYmIHRoaXMucGF0aCgpLnN1YnN0cigwLCAxKS5tYXRjaCgvWzAtOV0vKSkpIHtcbiAgICAgICAgcyArPSAnOicgKyB0aGlzLnBvcnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyBhIHRyYWlsaW5nIHNsYXNoIHRvIHRoZSBwYXRoXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmFkZFRyYWlsaW5nU2xhc2ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0aCA9IHRoaXMucGF0aCgpIHx8ICcnO1xuXG4gICAgaWYgKHBhdGguc3Vic3RyKC0xKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLnBhdGgocGF0aCArICcvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNlcmlhbGl6ZXMgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBVcmkgb2JqZWN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIFVyaS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0aCwgcyA9IHRoaXMub3JpZ2luKCk7XG5cbiAgICBpZiAodGhpcy5pc0NvbG9uVXJpKCkpIHtcbiAgICAgIGlmICh0aGlzLnBhdGgoKSkge1xuICAgICAgICBzICs9ICc6Jyt0aGlzLnBhdGgoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMucGF0aCgpKSB7XG4gICAgICBwYXRoID0gdGhpcy5wYXRoKCk7XG4gICAgICBpZiAoIShyZS5lbmRzX3dpdGhfc2xhc2hlcy50ZXN0KHMpIHx8IHJlLnN0YXJ0c193aXRoX3NsYXNoZXMudGVzdChwYXRoKSkpIHtcbiAgICAgICAgcyArPSAnLyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocykge1xuICAgICAgICAgIHMucmVwbGFjZShyZS5lbmRzX3dpdGhfc2xhc2hlcywgJy8nKTtcbiAgICAgICAgfVxuICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKHJlLnN0YXJ0c193aXRoX3NsYXNoZXMsICcvJyk7XG4gICAgICB9XG4gICAgICBzICs9IHBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhvc3QoKSAmJiAodGhpcy5xdWVyeSgpLnRvU3RyaW5nKCkgfHwgdGhpcy5hbmNob3IoKSkpIHtcbiAgICAgICAgcyArPSAnLyc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5KCkudG9TdHJpbmcoKSkge1xuICAgICAgcyArPSB0aGlzLnF1ZXJ5KCkudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hbmNob3IoKSkge1xuICAgICAgaWYgKHRoaXMuYW5jaG9yKCkuaW5kZXhPZignIycpICE9PSAwKSB7XG4gICAgICAgIHMgKz0gJyMnO1xuICAgICAgfVxuICAgICAgcyArPSB0aGlzLmFuY2hvcigpO1xuICAgIH1cblxuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbG9uZSBhIFVyaSBvYmplY3RcbiAgICogQHJldHVybiB7VXJpfSBkdXBsaWNhdGUgY29weSBvZiB0aGUgVXJpXG4gICAqL1xuICBVcmkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBVcmkodGhpcy50b1N0cmluZygpKTtcbiAgfTtcblxuICAvKipcbiAgICogZXhwb3J0IHZpYSBBTUQgb3IgQ29tbW9uSlMsIG90aGVyd2lzZSBsZWFrIGEgZ2xvYmFsXG4gICAqL1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFVyaTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBVcmk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLlVyaSA9IFVyaTtcbiAgfVxufSh0aGlzKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9qc3VyaS9VcmkuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbioqXG4qKiBDb3B5cmlnaHQgKEMpIDIwMTUgVGhlIFF0IENvbXBhbnkgTHRkLlxuKiogQ29weXJpZ2h0IChDKSAyMDE0IEtsYXLDpGx2ZGFsZW5zIERhdGFrb25zdWx0IEFCLCBhIEtEQUIgR3JvdXAgY29tcGFueSwgaW5mb0BrZGFiLmNvbSwgYXV0aG9yIE1pbGlhbiBXb2xmZiA8bWlsaWFuLndvbGZmQGtkYWIuY29tPlxuKiogQ29udGFjdDogaHR0cDovL3d3dy5xdC5pby9saWNlbnNpbmcvXG4qKlxuKiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIFF0V2ViQ2hhbm5lbCBtb2R1bGUgb2YgdGhlIFF0IFRvb2xraXQuXG4qKlxuKiogJFFUX0JFR0lOX0xJQ0VOU0U6TEdQTDIxJFxuKiogQ29tbWVyY2lhbCBMaWNlbnNlIFVzYWdlXG4qKiBMaWNlbnNlZXMgaG9sZGluZyB2YWxpZCBjb21tZXJjaWFsIFF0IGxpY2Vuc2VzIG1heSB1c2UgdGhpcyBmaWxlIGluXG4qKiBhY2NvcmRhbmNlIHdpdGggdGhlIGNvbW1lcmNpYWwgbGljZW5zZSBhZ3JlZW1lbnQgcHJvdmlkZWQgd2l0aCB0aGVcbioqIFNvZnR3YXJlIG9yLCBhbHRlcm5hdGl2ZWx5LCBpbiBhY2NvcmRhbmNlIHdpdGggdGhlIHRlcm1zIGNvbnRhaW5lZCBpblxuKiogYSB3cml0dGVuIGFncmVlbWVudCBiZXR3ZWVuIHlvdSBhbmQgVGhlIFF0IENvbXBhbnkuIEZvciBsaWNlbnNpbmcgdGVybXNcbioqIGFuZCBjb25kaXRpb25zIHNlZSBodHRwOi8vd3d3LnF0LmlvL3Rlcm1zLWNvbmRpdGlvbnMuIEZvciBmdXJ0aGVyXG4qKiBpbmZvcm1hdGlvbiB1c2UgdGhlIGNvbnRhY3QgZm9ybSBhdCBodHRwOi8vd3d3LnF0LmlvL2NvbnRhY3QtdXMuXG4qKlxuKiogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIFVzYWdlXG4qKiBBbHRlcm5hdGl2ZWx5LCB0aGlzIGZpbGUgbWF5IGJlIHVzZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyXG4qKiBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMi4xIG9yIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWVcbioqIFNvZnR3YXJlIEZvdW5kYXRpb24gYW5kIGFwcGVhcmluZyBpbiB0aGUgZmlsZSBMSUNFTlNFLkxHUEx2MjEgYW5kXG4qKiBMSUNFTlNFLkxHUEx2MyBpbmNsdWRlZCBpbiB0aGUgcGFja2FnaW5nIG9mIHRoaXMgZmlsZS4gUGxlYXNlIHJldmlldyB0aGVcbioqIGZvbGxvd2luZyBpbmZvcm1hdGlvbiB0byBlbnN1cmUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiogcmVxdWlyZW1lbnRzIHdpbGwgYmUgbWV0OiBodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2xncGwuaHRtbCBhbmRcbioqIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9vbGQtbGljZW5zZXMvbGdwbC0yLjEuaHRtbC5cbioqXG4qKiBBcyBhIHNwZWNpYWwgZXhjZXB0aW9uLCBUaGUgUXQgQ29tcGFueSBnaXZlcyB5b3UgY2VydGFpbiBhZGRpdGlvbmFsXG4qKiByaWdodHMuIFRoZXNlIHJpZ2h0cyBhcmUgZGVzY3JpYmVkIGluIFRoZSBRdCBDb21wYW55IExHUEwgRXhjZXB0aW9uXG4qKiB2ZXJzaW9uIDEuMSwgaW5jbHVkZWQgaW4gdGhlIGZpbGUgTEdQTF9FWENFUFRJT04udHh0IGluIHRoaXMgcGFja2FnZS5cbioqXG4qKiAkUVRfRU5EX0xJQ0VOU0UkXG4qKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcyA9IHtcbiAgICBzaWduYWw6IDEsXG4gICAgcHJvcGVydHlVcGRhdGU6IDIsXG4gICAgaW5pdDogMyxcbiAgICBpZGxlOiA0LFxuICAgIGRlYnVnOiA1LFxuICAgIGludm9rZU1ldGhvZDogNixcbiAgICBjb25uZWN0VG9TaWduYWw6IDcsXG4gICAgZGlzY29ubmVjdEZyb21TaWduYWw6IDgsXG4gICAgc2V0UHJvcGVydHk6IDksXG4gICAgcmVzcG9uc2U6IDEwLFxufTtcblxudmFyIFFXZWJDaGFubmVsID0gZnVuY3Rpb24odHJhbnNwb3J0LCBpbml0Q2FsbGJhY2spXG57XG4gICAgaWYgKHR5cGVvZiB0cmFuc3BvcnQgIT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRyYW5zcG9ydC5zZW5kICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZSBRV2ViQ2hhbm5lbCBleHBlY3RzIGEgdHJhbnNwb3J0IG9iamVjdCB3aXRoIGEgc2VuZCBmdW5jdGlvbiBhbmQgb25tZXNzYWdlIGNhbGxiYWNrIHByb3BlcnR5LlwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcIiBHaXZlbiBpczogdHJhbnNwb3J0OiBcIiArIHR5cGVvZih0cmFuc3BvcnQpICsgXCIsIHRyYW5zcG9ydC5zZW5kOiBcIiArIHR5cGVvZih0cmFuc3BvcnQuc2VuZCkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzO1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuXG4gICAgdGhpcy5zZW5kID0gZnVuY3Rpb24oZGF0YSlcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YoZGF0YSkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLnRyYW5zcG9ydC5zZW5kKGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMudHJhbnNwb3J0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2UpXG4gICAge1xuICAgICAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5zaWduYWw6XG4gICAgICAgICAgICAgICAgY2hhbm5lbC5oYW5kbGVTaWduYWwoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnJlc3BvbnNlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUmVzcG9uc2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLnByb3BlcnR5VXBkYXRlOlxuICAgICAgICAgICAgICAgIGNoYW5uZWwuaGFuZGxlUHJvcGVydHlVcGRhdGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJpbnZhbGlkIG1lc3NhZ2UgcmVjZWl2ZWQ6XCIsIG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmV4ZWNDYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLmV4ZWNJZCA9IDA7XG4gICAgdGhpcy5leGVjID0gZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXG4gICAge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBpZiBubyBjYWxsYmFjayBpcyBnaXZlbiwgc2VuZCBkaXJlY3RseVxuICAgICAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFubmVsLmV4ZWNJZCA9PT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgICAgICAgLy8gd3JhcFxuICAgICAgICAgICAgY2hhbm5lbC5leGVjSWQgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiaWRcIikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgZXhlYyBtZXNzYWdlIHdpdGggcHJvcGVydHkgaWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuaWQgPSBjaGFubmVsLmV4ZWNJZCsrO1xuICAgICAgICBjaGFubmVsLmV4ZWNDYWxsYmFja3NbZGF0YS5pZF0gPSBjYWxsYmFjaztcbiAgICAgICAgY2hhbm5lbC5zZW5kKGRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLm9iamVjdHMgPSB7fTtcblxuICAgIHRoaXMuaGFuZGxlU2lnbmFsID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIHZhciBvYmplY3QgPSBjaGFubmVsLm9iamVjdHNbbWVzc2FnZS5vYmplY3RdO1xuICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICBvYmplY3Quc2lnbmFsRW1pdHRlZChtZXNzYWdlLnNpZ25hbCwgbWVzc2FnZS5hcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuaGFuZGxlZCBzaWduYWw6IFwiICsgbWVzc2FnZS5vYmplY3QgKyBcIjo6XCIgKyBtZXNzYWdlLnNpZ25hbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGlmICghbWVzc2FnZS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCByZXNwb25zZSBtZXNzYWdlIHJlY2VpdmVkOiBcIiwgSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlY0NhbGxiYWNrc1ttZXNzYWdlLmlkXShtZXNzYWdlLmRhdGEpO1xuICAgICAgICBkZWxldGUgY2hhbm5lbC5leGVjQ2FsbGJhY2tzW21lc3NhZ2UuaWRdO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlUHJvcGVydHlVcGRhdGUgPSBmdW5jdGlvbihtZXNzYWdlKVxuICAgIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlLmRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhW2ldO1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IGNoYW5uZWwub2JqZWN0c1tkYXRhLm9iamVjdF07XG4gICAgICAgICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnByb3BlcnR5VXBkYXRlKGRhdGEuc2lnbmFscywgZGF0YS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVW5oYW5kbGVkIHByb3BlcnR5IHVwZGF0ZTogXCIgKyBkYXRhLm9iamVjdCArIFwiOjpcIiArIGRhdGEuc2lnbmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjaGFubmVsLmV4ZWMoe3R5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmlkbGV9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnID0gZnVuY3Rpb24obWVzc2FnZSlcbiAgICB7XG4gICAgICAgIGNoYW5uZWwuc2VuZCh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuZGVidWcsIGRhdGE6IG1lc3NhZ2V9KTtcbiAgICB9O1xuXG4gICAgY2hhbm5lbC5leGVjKHt0eXBlOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbml0fSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBmb3IgKHZhciBvYmplY3ROYW1lIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBuZXcgUU9iamVjdChvYmplY3ROYW1lLCBkYXRhW29iamVjdE5hbWVdLCBjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3cgdW53cmFwIHByb3BlcnRpZXMsIHdoaWNoIG1pZ2h0IHJlZmVyZW5jZSBvdGhlciByZWdpc3RlcmVkIG9iamVjdHNcbiAgICAgICAgZm9yICh2YXIgb2JqZWN0TmFtZSBpbiBjaGFubmVsLm9iamVjdHMpIHtcbiAgICAgICAgICAgIGNoYW5uZWwub2JqZWN0c1tvYmplY3ROYW1lXS51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluaXRDYWxsYmFjaykge1xuICAgICAgICAgICAgaW5pdENhbGxiYWNrKGNoYW5uZWwpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5uZWwuZXhlYyh7dHlwZTogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuaWRsZX0pO1xuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gUU9iamVjdChuYW1lLCBkYXRhLCB3ZWJDaGFubmVsKVxue1xuICAgIHRoaXMuX19pZF9fID0gbmFtZTtcbiAgICB3ZWJDaGFubmVsLm9iamVjdHNbbmFtZV0gPSB0aGlzO1xuXG4gICAgLy8gTGlzdCBvZiBjYWxsYmFja3MgdGhhdCBnZXQgaW52b2tlZCB1cG9uIHNpZ25hbCBlbWlzc2lvblxuICAgIHRoaXMuX19vYmplY3RTaWduYWxzX18gPSB7fTtcblxuICAgIC8vIENhY2hlIG9mIGFsbCBwcm9wZXJ0aWVzLCB1cGRhdGVkIHdoZW4gYSBub3RpZnkgc2lnbmFsIGlzIGVtaXR0ZWRcbiAgICB0aGlzLl9fcHJvcGVydHlDYWNoZV9fID0ge307XG5cbiAgICB2YXIgb2JqZWN0ID0gdGhpcztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRoaXMudW53cmFwUU9iamVjdCA9IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgbGlzdCBvZiBvYmplY3RzXG4gICAgICAgICAgICB2YXIgcmV0ID0gbmV3IEFycmF5KHJlc3BvbnNlLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcmV0W2ldID0gb2JqZWN0LnVud3JhcFFPYmplY3QocmVzcG9uc2VbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3BvbnNlXG4gICAgICAgICAgICB8fCAhcmVzcG9uc2VbXCJfX1FPYmplY3QqX19cIl1cbiAgICAgICAgICAgIHx8IHJlc3BvbnNlW1wiaWRcIl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iamVjdElkID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgIGlmICh3ZWJDaGFubmVsLm9iamVjdHNbb2JqZWN0SWRdKVxuICAgICAgICAgICAgcmV0dXJuIHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF07XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHVud3JhcCB1bmtub3duIFFPYmplY3QgXCIgKyBvYmplY3RJZCArIFwiIHdpdGhvdXQgZGF0YS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcU9iamVjdCA9IG5ldyBRT2JqZWN0KCBvYmplY3RJZCwgcmVzcG9uc2UuZGF0YSwgd2ViQ2hhbm5lbCApO1xuICAgICAgICBxT2JqZWN0LmRlc3Ryb3llZC5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHdlYkNoYW5uZWwub2JqZWN0c1tvYmplY3RJZF0gPT09IHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgd2ViQ2hhbm5lbC5vYmplY3RzW29iamVjdElkXTtcbiAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgbm93IGRlbGV0ZWQgUU9iamVjdCB0byBhbiBlbXB0eSB7fSBvYmplY3RcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGFzc2lnbmluZyB7fSB0aG91Z2ggd291bGQgbm90IGhhdmUgdGhlIGRlc2lyZWQgZWZmZWN0LCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gYmVsb3cgYWxzbyBlbnN1cmVzIGFsbCBleHRlcm5hbCByZWZlcmVuY2VzIHdpbGwgc2VlIHRoZSBlbXB0eSBtYXBcbiAgICAgICAgICAgICAgICAvLyBOT1RFOiB0aGlzIGRldG91ciBpcyBuZWNlc3NhcnkgdG8gd29ya2Fyb3VuZCBRVEJVRy00MDAyMVxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHFPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lcy5wdXNoKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkeCBpbiBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxT2JqZWN0W3Byb3BlcnR5TmFtZXNbaWR4XV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gaGVyZSB3ZSBhcmUgYWxyZWFkeSBpbml0aWFsaXplZCwgYW5kIHRodXMgbXVzdCBkaXJlY3RseSB1bndyYXAgdGhlIHByb3BlcnRpZXNcbiAgICAgICAgcU9iamVjdC51bndyYXBQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHJldHVybiBxT2JqZWN0O1xuICAgIH1cblxuICAgIHRoaXMudW53cmFwUHJvcGVydGllcyA9IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5SWR4IGluIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfXykge1xuICAgICAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SWR4XSA9IG9iamVjdC51bndyYXBRT2JqZWN0KG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUlkeF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU2lnbmFsKHNpZ25hbERhdGEsIGlzUHJvcGVydHlOb3RpZnlTaWduYWwpXG4gICAge1xuICAgICAgICB2YXIgc2lnbmFsTmFtZSA9IHNpZ25hbERhdGFbMF07XG4gICAgICAgIHZhciBzaWduYWxJbmRleCA9IHNpZ25hbERhdGFbMV07XG4gICAgICAgIG9iamVjdFtzaWduYWxOYW1lXSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGNvbm5lY3QgdG8gc2lnbmFsIFwiICsgc2lnbmFsTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnB1c2goY2FsbGJhY2spO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc1Byb3BlcnR5Tm90aWZ5U2lnbmFsICYmIHNpZ25hbE5hbWUgIT09IFwiZGVzdHJveWVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSByZXF1aXJlZCBmb3IgXCJwdXJlXCIgc2lnbmFscywgaGFuZGxlZCBzZXBhcmF0ZWx5IGZvciBwcm9wZXJ0aWVzIGluIHByb3BlcnR5VXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsc28gbm90ZSB0aGF0IHdlIGFsd2F5cyBnZXQgbm90aWZpZWQgYWJvdXQgdGhlIGRlc3Ryb3llZCBzaWduYWxcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmNvbm5lY3RUb1NpZ25hbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogc2lnbmFsSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2Nvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYWxsYmFjaykgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQmFkIGNhbGxiYWNrIGdpdmVuIHRvIGRpc2Nvbm5lY3QgZnJvbSBzaWduYWwgXCIgKyBzaWduYWxOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gb2JqZWN0Ll9fb2JqZWN0U2lnbmFsc19fW3NpZ25hbEluZGV4XS5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGZpbmQgY29ubmVjdGlvbiBvZiBzaWduYWwgXCIgKyBzaWduYWxOYW1lICsgXCIgdG8gXCIgKyBjYWxsYmFjay5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIGlmICghaXNQcm9wZXJ0eU5vdGlmeVNpZ25hbCAmJiBvYmplY3QuX19vYmplY3RTaWduYWxzX19bc2lnbmFsSW5kZXhdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHJlcXVpcmVkIGZvciBcInB1cmVcIiBzaWduYWxzLCBoYW5kbGVkIHNlcGFyYXRlbHkgZm9yIHByb3BlcnRpZXMgaW4gcHJvcGVydHlVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgd2ViQ2hhbm5lbC5leGVjKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFFXZWJDaGFubmVsTWVzc2FnZVR5cGVzLmRpc2Nvbm5lY3RGcm9tU2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QuX19pZF9fLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBzaWduYWxJbmRleFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhbGwgY2FsbGJhY2tzIGZvciB0aGUgZ2l2ZW4gc2lnbmFsbmFtZS4gQWxzbyB3b3JrcyBmb3IgcHJvcGVydHkgbm90aWZ5IGNhbGxiYWNrcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsQXJncylcbiAgICB7XG4gICAgICAgIHZhciBjb25uZWN0aW9ucyA9IG9iamVjdC5fX29iamVjdFNpZ25hbHNfX1tzaWduYWxOYW1lXTtcbiAgICAgICAgaWYgKGNvbm5lY3Rpb25zKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIHNpZ25hbEFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb3BlcnR5VXBkYXRlID0gZnVuY3Rpb24oc2lnbmFscywgcHJvcGVydHlNYXApXG4gICAge1xuICAgICAgICAvLyB1cGRhdGUgcHJvcGVydHkgY2FjaGVcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHlJbmRleCBpbiBwcm9wZXJ0eU1hcCkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eU1hcFtwcm9wZXJ0eUluZGV4XTtcbiAgICAgICAgICAgIG9iamVjdC5fX3Byb3BlcnR5Q2FjaGVfX1twcm9wZXJ0eUluZGV4XSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBzaWduYWxOYW1lIGluIHNpZ25hbHMpIHtcbiAgICAgICAgICAgIC8vIEludm9rZSBhbGwgY2FsbGJhY2tzLCBhcyBzaWduYWxFbWl0dGVkKCkgZG9lcyBub3QuIFRoaXMgZW5zdXJlcyB0aGVcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGNhY2hlIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFja3MgYXJlIGludm9rZWQuXG4gICAgICAgICAgICBpbnZva2VTaWduYWxDYWxsYmFja3Moc2lnbmFsTmFtZSwgc2lnbmFsc1tzaWduYWxOYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbEVtaXR0ZWQgPSBmdW5jdGlvbihzaWduYWxOYW1lLCBzaWduYWxBcmdzKVxuICAgIHtcbiAgICAgICAgaW52b2tlU2lnbmFsQ2FsbGJhY2tzKHNpZ25hbE5hbWUsIHNpZ25hbEFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1ldGhvZChtZXRob2REYXRhKVxuICAgIHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBtZXRob2REYXRhWzBdO1xuICAgICAgICB2YXIgbWV0aG9kSWR4ID0gbWV0aG9kRGF0YVsxXTtcbiAgICAgICAgb2JqZWN0W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBRV2ViQ2hhbm5lbE1lc3NhZ2VUeXBlcy5pbnZva2VNZXRob2QsXG4gICAgICAgICAgICAgICAgXCJvYmplY3RcIjogb2JqZWN0Ll9faWRfXyxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBtZXRob2RJZHgsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG9iamVjdC51bndyYXBRT2JqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FsbGJhY2spKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5kR2V0dGVyU2V0dGVyKHByb3BlcnR5SW5mbylcbiAgICB7XG4gICAgICAgIHZhciBwcm9wZXJ0eUluZGV4ID0gcHJvcGVydHlJbmZvWzBdO1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHlJbmZvWzFdO1xuICAgICAgICB2YXIgbm90aWZ5U2lnbmFsRGF0YSA9IHByb3BlcnR5SW5mb1syXTtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBwcm9wZXJ0eSBjYWNoZSB3aXRoIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgLy8gTk9URTogaWYgdGhpcyBpcyBhbiBvYmplY3QsIGl0IGlzIG5vdCBkaXJlY3RseSB1bndyYXBwZWQgYXMgaXQgbWlnaHRcbiAgICAgICAgLy8gcmVmZXJlbmNlIG90aGVyIFFPYmplY3QgdGhhdCB3ZSBkbyBub3Qga25vdyB5ZXRcbiAgICAgICAgb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdID0gcHJvcGVydHlJbmZvWzNdO1xuXG4gICAgICAgIGlmIChub3RpZnlTaWduYWxEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm90aWZ5U2lnbmFsRGF0YVswXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCBuYW1lIGlzIG9wdGltaXplZCBhd2F5LCByZWNvbnN0cnVjdCB0aGUgYWN0dWFsIG5hbWVcbiAgICAgICAgICAgICAgICBub3RpZnlTaWduYWxEYXRhWzBdID0gcHJvcGVydHlOYW1lICsgXCJDaGFuZ2VkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRTaWduYWwobm90aWZ5U2lnbmFsRGF0YSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gb2JqZWN0Ll9fcHJvcGVydHlDYWNoZV9fW3Byb3BlcnR5SW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGRuJ3QgaGFwcGVuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVuZGVmaW5lZCB2YWx1ZSBpbiBwcm9wZXJ0eSBjYWNoZSBmb3IgcHJvcGVydHkgXFxcIlwiICsgcHJvcGVydHlOYW1lICsgXCJcXFwiIGluIG9iamVjdCBcIiArIG9iamVjdC5fX2lkX18pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJQcm9wZXJ0eSBzZXR0ZXIgZm9yIFwiICsgcHJvcGVydHlOYW1lICsgXCIgY2FsbGVkIHdpdGggdW5kZWZpbmVkIHZhbHVlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3QuX19wcm9wZXJ0eUNhY2hlX19bcHJvcGVydHlJbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB3ZWJDaGFubmVsLmV4ZWMoe1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogUVdlYkNoYW5uZWxNZXNzYWdlVHlwZXMuc2V0UHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIFwib2JqZWN0XCI6IG9iamVjdC5fX2lkX18sXG4gICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIjogcHJvcGVydHlJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGRhdGEubWV0aG9kcy5mb3JFYWNoKGFkZE1ldGhvZCk7XG5cbiAgICBkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChiaW5kR2V0dGVyU2V0dGVyKTtcblxuICAgIGRhdGEuc2lnbmFscy5mb3JFYWNoKGZ1bmN0aW9uKHNpZ25hbCkgeyBhZGRTaWduYWwoc2lnbmFsLCBmYWxzZSk7IH0pO1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhLmVudW1zKSB7XG4gICAgICAgIG9iamVjdFtuYW1lXSA9IGRhdGEuZW51bXNbbmFtZV07XG4gICAgfVxufVxuXG4vL3JlcXVpcmVkIGZvciB1c2Ugd2l0aCBub2RlanNcbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBRV2ViQ2hhbm5lbDogUVdlYkNoYW5uZWxcbiAgICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcXdlYmNoYW5uZWwvcXdlYmNoYW5uZWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi9VdGlsaXRpZXMuanMnKTtcclxudmFyIFNoYXJlZCA9IHJlcXVpcmUoJy4vU2hhcmVkLmpzJyk7XHJcbnZhciBOYXRpdmVEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9OYXRpdmVEaXNwYXRjaGVyLmpzJyk7XHJcbnZhciBTaW11bGF0b3JEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9TaW11bGF0b3JEaXNwYXRjaGVyLmpzJyk7XHJcbnZhciBxd2ViY2hhbm5lbCA9IHJlcXVpcmUoJ3F3ZWJjaGFubmVsJyk7XHJcblxyXG4vKiogQG1vZHVsZSBTaGltTGlicmFyeSAtIFRoaXMgbW9kdWxlIGRlZmluZXMgdGhlIFdEQydzIHNoaW0gbGlicmFyeSB3aGljaCBpcyB1c2VkXHJcbnRvIGJyaWRnZSB0aGUgZ2FwIGJldHdlZW4gdGhlIGphdmFzY3JpcHQgY29kZSBvZiB0aGUgV0RDIGFuZCB0aGUgZHJpdmluZyBjb250ZXh0XHJcbm9mIHRoZSBXREMgKFRhYmxlYXUgZGVza3RvcCwgdGhlIHNpbXVsYXRvciwgZXRjLikgKi9cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBvbmNlIGJvb3RzdHJhcHBpbmcgaGFzIGJlZW4gY29tcGxldGVkIGFuZCB0aGVcclxuLy8gZGlzcGF0Y2hlciBhbmQgc2hhcmVkIFdEQyBvYmplY3RzIGFyZSBib3RoIGNyZWF0ZWQgYW5kIGF2YWlsYWJsZVxyXG5mdW5jdGlvbiBib290c3RyYXBwaW5nRmluaXNoZWQoX2Rpc3BhdGNoZXIsIF9zaGFyZWQpIHtcclxuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wdWJsaWNJbnRlcmZhY2UsIHdpbmRvdy50YWJsZWF1KTtcclxuICBVdGlsaXRpZXMuY29weUZ1bmN0aW9ucyhfZGlzcGF0Y2hlci5wcml2YXRlSW50ZXJmYWNlLCB3aW5kb3cuX3RhYmxlYXUpO1xyXG4gIF9zaGFyZWQuaW5pdCgpO1xyXG59XHJcblxyXG4vLyBJbml0aWFsaXplcyB0aGUgd2RjIHNoaW0gbGlicmFyeS4gWW91IG11c3QgY2FsbCB0aGlzIGJlZm9yZSBkb2luZyBhbnl0aGluZyB3aXRoIFdEQ1xyXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8vIFRoZSBpbml0aWFsIGNvZGUgaGVyZSBpcyB0aGUgb25seSBwbGFjZSBpbiBvdXIgbW9kdWxlIHdoaWNoIHNob3VsZCBoYXZlIGdsb2JhbFxyXG4gIC8vIGtub3dsZWRnZSBvZiBob3cgYWxsIHRoZSBXREMgY29tcG9uZW50cyBhcmUgZ2x1ZWQgdG9nZXRoZXIuIFRoaXMgaXMgdGhlIG9ubHkgcGxhY2VcclxuICAvLyB3aGljaCB3aWxsIGtub3cgYWJvdXQgdGhlIHdpbmRvdyBvYmplY3Qgb3Igb3RoZXIgZ2xvYmFsIG9iamVjdHMuIFRoaXMgY29kZSB3aWxsIGJlIHJ1blxyXG4gIC8vIGltbWVkaWF0ZWx5IHdoZW4gdGhlIHNoaW0gbGlicmFyeSBsb2FkcyBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGRldGVybWluaW5nIHRoZSBjb250ZXh0XHJcbiAgLy8gd2hpY2ggaXQgaXMgcnVubmluZyBpdCBhbmQgc2V0dXAgYSBjb21tdW5pY2F0aW9ucyBjaGFubmVsIGJldHdlZW4gdGhlIGpzICYgcnVubmluZyBjb2RlXHJcbiAgdmFyIGRpc3BhdGNoZXIgPSBudWxsO1xyXG4gIHZhciBzaGFyZWQgPSBudWxsO1xyXG5cclxuICAvLyBBbHdheXMgZGVmaW5lIHRoZSBwcml2YXRlIF90YWJsZWF1IG9iamVjdCBhdCB0aGUgc3RhcnRcclxuICB3aW5kb3cuX3RhYmxlYXUgPSB7fTtcclxuXHJcbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSB0YWJsZWF1VmVyc2lvbkJvb3RzdHJhcCBpcyBkZWZpbmVkIGFzIGEgZ2xvYmFsIG9iamVjdC4gSWYgc28sXHJcbiAgLy8gd2UgYXJlIHJ1bm5pbmcgaW4gdGhlIFRhYmxlYXUgZGVza3RvcC9zZXJ2ZXIgY29udGV4dC4gSWYgbm90LCB3ZSdyZSBydW5uaW5nIGluIHRoZSBzaW11bGF0b3JcclxuICBpZiAoISF3aW5kb3cudGFibGVhdVZlcnNpb25Cb290c3RyYXApIHtcclxuICAgIC8vIFdlIGhhdmUgdGhlIHRhYmxlYXUgb2JqZWN0IGRlZmluZWRcclxuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIsIFJlcG9ydGluZyB2ZXJzaW9uIG51bWJlclwiKTtcclxuICAgIHdpbmRvdy50YWJsZWF1VmVyc2lvbkJvb3RzdHJhcC5SZXBvcnRWZXJzaW9uTnVtYmVyKEJVSUxEX05VTUJFUik7XHJcbiAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIod2luZG93KTtcclxuICB9IGVsc2UgaWYgKCEhd2luZG93LnF0ICYmICEhd2luZG93LnF0LndlYkNoYW5uZWxUcmFuc3BvcnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIE5hdGl2ZURpc3BhdGNoZXIgZm9yIHF3ZWJjaGFubmVsXCIpO1xyXG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcclxuXHJcbiAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgY29udGV4dCB3aGVyZSB0aGUgd2ViQ2hhbm5lbFRyYW5zcG9ydCBpcyBhdmFpbGFibGUuIFRoaXMgbWVhbnMgUVdlYkVuZ2luZSBpcyBpbiB1c2VcclxuICAgIHdpbmRvdy5jaGFubmVsID0gbmV3IHF3ZWJjaGFubmVsLlFXZWJDaGFubmVsKHF0LndlYkNoYW5uZWxUcmFuc3BvcnQsIGZ1bmN0aW9uKGNoYW5uZWwpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJRV2ViQ2hhbm5lbCBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuXHJcbiAgICAgIC8vIERlZmluZSB0aGUgZnVuY3Rpb24gd2hpY2ggdGFibGVhdSB3aWxsIGNhbGwgYWZ0ZXIgaXQgaGFzIGluc2VydGVkIGFsbCB0aGUgcmVxdWlyZWQgb2JqZWN0cyBpbnRvIHRoZSBqYXZhc2NyaXB0IGZyYW1lXHJcbiAgICAgIHdpbmRvdy5fdGFibGVhdS5fbmF0aXZlU2V0dXBDb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBPbmNlIHRoZSBuYXRpdmUgY29kZSB0ZWxscyB1cyBldmVyeXRoaW5nIGhlcmUgaXMgZG9uZSwgd2Ugc2hvdWxkIGhhdmUgYWxsIHRoZSBleHBlY3RlZCBvYmplY3RzIGluc2VydGVkIGludG8ganNcclxuICAgICAgICBkaXNwYXRjaGVyID0gbmV3IE5hdGl2ZURpc3BhdGNoZXIoY2hhbm5lbC5vYmplY3RzKTtcclxuICAgICAgICB3aW5kb3cudGFibGVhdSA9IGNoYW5uZWwub2JqZWN0cy50YWJsZWF1O1xyXG4gICAgICAgIHNoYXJlZC5jaGFuZ2VUYWJsZWF1QXBpT2JqKHdpbmRvdy50YWJsZWF1KTtcclxuICAgICAgICBib290c3RyYXBwaW5nRmluaXNoZWQoZGlzcGF0Y2hlciwgc2hhcmVkKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEFjdHVhbGx5IGNhbGwgaW50byB0aGUgdmVyc2lvbiBib290c3RyYXBwZXIgdG8gcmVwb3J0IG91ciB2ZXJzaW9uIG51bWJlclxyXG4gICAgICBjaGFubmVsLm9iamVjdHMudGFibGVhdVZlcnNpb25Cb290c3RyYXAuUmVwb3J0VmVyc2lvbk51bWJlcihCVUlMRF9OVU1CRVIpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnNvbGUubG9nKFwiVmVyc2lvbiBCb290c3RyYXAgaXMgbm90IGRlZmluZWQsIEluaXRpYWxpemluZyBTaW11bGF0b3JEaXNwYXRjaGVyXCIpO1xyXG4gICAgd2luZG93LnRhYmxlYXUgPSB7fTtcclxuICAgIGRpc3BhdGNoZXIgPSBuZXcgU2ltdWxhdG9yRGlzcGF0Y2hlcih3aW5kb3cpO1xyXG4gIH1cclxuXHJcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIFdEQyBvYmplY3QgYW5kIGFkZCBpbiBvdXIgZW51bSB2YWx1ZXNcclxuICBzaGFyZWQgPSBuZXcgU2hhcmVkKHdpbmRvdy50YWJsZWF1LCB3aW5kb3cuX3RhYmxlYXUsIHdpbmRvdyk7XHJcblxyXG4gIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGlzcGF0Y2hlciBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIGltbWVkaWF0ZWx5IGNhbGwgdGhlXHJcbiAgLy8gY2FsbGJhY2sgaWYgc29cclxuICBpZiAoZGlzcGF0Y2hlcikge1xyXG4gICAgYm9vdHN0cmFwcGluZ0ZpbmlzaGVkKGRpc3BhdGNoZXIsIHNoYXJlZCk7XHJcbiAgfVxyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGFibGVhdXdkYy5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzVLQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBOzs7Ozs7QUNGQTtBQUNBO0FBQ0E7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMzWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9
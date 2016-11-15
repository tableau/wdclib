var ApprovedOrigins = require('./ApprovedOrigins.js');

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
  var msgObj = {"msgName": msgName, "msgData": msgData, "props": props, "version": BUILD_NUMBER };
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

  var Uri = require('jsuri');
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
    var deStringsMap = require('json!./resources/Shim_lib_resources_de-DE.json');
    var enStringsMap = require('json!./resources/Shim_lib_resources_en-US.json');
    var esStringsMap = require('json!./resources/Shim_lib_resources_es-ES.json');
    var jaStringsMap = require('json!./resources/Shim_lib_resources_ja-JP.json');
    var frStringsMap = require('json!./resources/Shim_lib_resources_fr-FR.json');
    var koStringsMap = require('json!./resources/Shim_lib_resources_ko-KR.json');
    var ptStringsMap = require('json!./resources/Shim_lib_resources_pt-BR.json');
    var zhStringsMap = require('json!./resources/Shim_lib_resources_zh-CN.json');

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

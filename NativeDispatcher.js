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

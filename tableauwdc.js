"use strict";

var Utilities = require('./Utilities.js');
var Shared = require('./Shared.js');
var NativeDispatcher = require('./NativeDispatcher.js');
var SimulatorDispatcher = require('./SimulatorDispatcher.js');
var qwebchannel = require('qwebchannel');

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
    window.tableauVersionBootstrap.ReportVersionNumber(BUILD_NUMBER);
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
        Utilities.linkObjectProperties(channel.objects.tableau, window.tableau, Utilities.tableauProperties);
        shared.changeTableauApiObj(window.tableau);
        bootstrappingFinished(dispatcher, shared);
      };

      // Actually call into the version bootstrapper to report our version number
      channel.objects.tableauVersionBootstrap.ReportVersionNumber(BUILD_NUMBER);
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

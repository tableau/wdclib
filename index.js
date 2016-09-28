// Main entry point to pull together everything needed for the WDC shim library
// This file will be exported as a bundled js file by webpack so it can be included
// in a <script> tag in an html document. Alernatively, a connector may include
// this whole package in their code and would need to call init like this
var tableauwdc = require('./tableauwdc.js');
tableauwdc.init();

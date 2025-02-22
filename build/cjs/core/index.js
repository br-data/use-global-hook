'use strict';

var associateActions = require('./associateActions.js');
var setState = require('./setState.js');
var customHook = require('./customHook.js');
var runListeners = require('./runListeners.js');
var setupOptions = require('./setupOptions.js');

var useStore = function useStore(initialState, actions, options) {
  var store = {
    state: initialState,
    listeners: []
  };
  store.setState = setState.setState.bind(null, store);
  store.runListeners = runListeners.runListeners.bind(null, store);
  store.actions = associateActions.associateActions(store, actions);
  setupOptions.setupOptions(store, options);
  return customHook.customHook.bind(null, store);
};

module.exports = useStore;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cleanUpListener = require('./cleanUpListener.js');

var newListenerEffect = function newListenerEffect(store, oldState, mapState, originalHook) {
  var newListener = {
    oldState: oldState
  };
  newListener.run = mapState ? function (newState) {
    var mappedState = mapState(newState);

    if (JSON.stringify(mappedState) !== JSON.stringify(newListener.oldState)) {
      newListener.oldState = mappedState;
      originalHook(newState);
    }
  } : originalHook;
  store.listeners.push(newListener);
  return cleanUpListener.cleanUpListener(store, newListener);
};

exports.newListenerEffect = newListenerEffect;

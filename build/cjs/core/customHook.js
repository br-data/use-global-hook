'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var newListenerEffect = require('./newListenerEffect.js');

function customHook(store, mapState, mapActions) {
  var state = mapState ? mapState(store.state) : store.state;
  var actions = mapActions ? mapActions(store.actions) : store.actions;
  var originalHook = React.useState(state)[1];
  React.useEffect(function () {
    return newListenerEffect.newListenerEffect(store, state, mapState, originalHook);
  }, []); // eslint-disable-line

  return [state, actions];
}

exports.customHook = customHook;

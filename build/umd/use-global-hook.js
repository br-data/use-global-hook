/** @license UseGlobalHook v0.3.1
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */
/** @license UseGlobalHook v0.3.1
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UseGlobalHook = factory(global.React));
}(this, (function (React) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function associateActions(store, actions) {
    var associatedActions = {};
    Object.keys(actions).forEach(function (key) {
      if (typeof actions[key] === "function") {
        associatedActions[key] = actions[key].bind(null, store);
      }

      if (_typeof(actions[key]) === "object") {
        associatedActions[key] = associateActions(store, actions[key]);
      }
    });
    return associatedActions;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function setState(store, newState, afterUpdateCallback) {
    store.state = _extends({}, store.state, newState);
    store.runListeners();
    afterUpdateCallback && afterUpdateCallback();
  }

  var cleanUpListener = function cleanUpListener(store, newListener) {
    return function () {
      store.listeners = store.listeners.filter(function (listener) {
        return listener !== newListener;
      });
    };
  };

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
    return cleanUpListener(store, newListener);
  };

  function customHook(store, mapState, mapActions) {
    var state = mapState ? mapState(store.state) : store.state;
    var actions = mapActions ? mapActions(store.actions) : store.actions;
    var originalHook = React.useState(state)[1];
    React.useEffect(function () {
      return newListenerEffect(store, state, mapState, originalHook);
    }, []); // eslint-disable-line

    return [state, actions];
  }

  var runListeners = function runListeners(store) {
    store.listeners.forEach(function (listener) {
      listener.run(store.state);
    });
  };

  var immerAction = function immerAction(store, originalFunction) {
    return function () {
      var result = originalFunction.apply(void 0, arguments);
      if (typeof result === "function") store.setState(result);
    };
  };

  function wrapActions(store, actions) {
    var wrappedActions = {};
    Object.keys(actions).forEach(function (key) {
      if (typeof actions[key] === "function") {
        var originalFunction = actions[key];
        actions[key] = immerAction(store, originalFunction);
      }

      if (_typeof(actions[key]) === "object") {
        wrappedActions[key] = wrapActions(store, actions[key]);
      }
    });
    return wrappedActions;
  }

  var immerPlugin = function immerPlugin(Immer, store) {
    var _setState = store.setState;

    store.setState = function (input) {
      if (input instanceof Function) {
        store.state = Immer(store.state, input);
        store.runListeners();
      } else {
        _setState(input);
      }
    };

    wrapActions(store, store.actions);
  };

  var setupOptions = function setupOptions(store) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    //Backward compatibility with 0.1.2
    if (options instanceof Function) {
      options(store);
      return;
    }

    var Immer = options.Immer,
        initializer = options.initializer;
    Immer && immerPlugin(Immer, store);
    initializer && initializer(store);
  };

  var useStore = function useStore(initialState, actions, options) {
    var store = {
      state: initialState,
      listeners: []
    };
    store.setState = setState.bind(null, store);
    store.runListeners = runListeners.bind(null, store);
    store.actions = associateActions(store, actions);
    setupOptions(store, options);
    return customHook.bind(null, store);
  };

  return useStore;

})));

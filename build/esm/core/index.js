import { associateActions as associateActions$1 } from './associateActions.js';
import { setState as setState$1 } from './setState.js';
import { customHook as customHook$1 } from './customHook.js';
import { runListeners as runListeners$1 } from './runListeners.js';
import { setupOptions as setupOptions$1 } from './setupOptions.js';

const useStore = (initialState, actions, options) => {
  const store = {
    state: initialState,
    listeners: []
  };
  store.setState = setState$1.bind(null, store);
  store.runListeners = runListeners$1.bind(null, store);
  store.actions = associateActions$1(store, actions);
  setupOptions$1(store, options);
  return customHook$1.bind(null, store);
};

export default useStore;

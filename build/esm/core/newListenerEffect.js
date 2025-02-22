import { cleanUpListener as cleanUpListener$1 } from './cleanUpListener.js';

const newListenerEffect = (store, oldState, mapState, originalHook) => {
  const newListener = {
    oldState
  };
  newListener.run = mapState ? newState => {
    const mappedState = mapState(newState);

    if (JSON.stringify(mappedState) !== JSON.stringify(newListener.oldState)) {
      newListener.oldState = mappedState;
      originalHook(newState);
    }
  } : originalHook;
  store.listeners.push(newListener);
  return cleanUpListener$1(store, newListener);
};

export { newListenerEffect };

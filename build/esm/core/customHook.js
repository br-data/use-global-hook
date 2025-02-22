import { useState, useEffect } from 'react';
import { newListenerEffect as newListenerEffect$1 } from './newListenerEffect.js';

function customHook(store, mapState, mapActions) {
  const state = mapState ? mapState(store.state) : store.state;
  const actions = mapActions ? mapActions(store.actions) : store.actions;
  const originalHook = useState(state)[1];
  useEffect(() => newListenerEffect$1(store, state, mapState, originalHook), []); // eslint-disable-line

  return [state, actions];
}

export { customHook };

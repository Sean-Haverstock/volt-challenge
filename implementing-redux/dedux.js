export default {
  createStore,
  applyMiddleware,
}

function createStore(reducer) {
  let listeners = []
  let currentState = reducer(undefined, {})

  function getState() {
    return currentState
  }
  function dispatch(action) {
    currentState = reducer(currentState, action)

    listeners.forEach(listener => {
      listener()
    })
  }
  function subscribe(listener) {
    listeners.push(listener)
    const unsubscribe = () => {
      listeners = listeners.filter(l => l !== newListener)
    }
    return unsubscribe
  }
  const store = {
    getState,
    dispatch,
    subscribe,
  }
  return store
}

function applyMiddleware() {}

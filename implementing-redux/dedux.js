export default {
  createStore,
}

function createStore(reducer) {
  let listeners = []
  let currentState = reducer(undefined, {})

  function getState() {
    return currentState
  }
  function dispatch(action) {
    if (typeof action !== 'object' || action === null) {
      throw new Error(
        'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
      )
    }
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }
    currentState = reducer(currentState, action)

    listeners.forEach(listener => {
      listener()
    })
    return action
  }

  function subscribe(newListener) {
    listeners.push(newListener)
    const unsubscribe = () => {
      listeners = listeners.filter(listener => listener !== newListener)
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

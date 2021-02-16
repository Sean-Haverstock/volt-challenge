export default {
  createStore,
  applyMiddleware,
}

function createStore(reducer, enhancer) {
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer)
  }

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
      // to get original test to pass call each listener with currentState
      // listener(getState())
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

function applyMiddleware(...middleware) {
  return createStore => reducer => {
    const store = createStore(reducer)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    }
    const chain = middleware.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args) =>
    rest.reduceRight((composed, f) => f(composed), last(...args))
}

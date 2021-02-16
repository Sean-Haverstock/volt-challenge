/* 
  ===== ACTION TYPES ===== 
  convention to prevent typos
*/

const actionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
}

/* ===== ACTION CREATORS ===== */

export function increment() {
  return {
    type: actionTypes.INCREMENT,
  }
}

export function decrement() {
  return {
    type: actionTypes.DECREMENT,
  }
}

export function reset() {
  return {
    type: actionTypes.RESET,
  }
}

const initialState = {
  count: parseInt(localStorage.getItem('count')),
}

/* ===== REDUCER ===== */

export function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: (state.count += 1),
      }
    case 'DECREMENT':
      return {
        count: (state.count -= 1),
      }
    case 'RESET':
      return {
        count: (state.count = 0),
      }
    default:
      return state
  }
}

/* ==== MIDDLEWARE FUNCTIONS ==== */

export function logger({ getState }) {
  return next => action => {
    console.log('LOGGER MIDDLEWARE - will dispatch', action)
    // Call the next dispatch method in the middleware chain.
    const result = next(action)
    console.log('LOGGER MIDDLEWARE - state after dispatch', getState())
    return result
  }
}

export function updateStorage() {
  return next => action => {
    let localState = parseInt(localStorage.getItem('count'))
    switch (action.type) {
      case 'INCREMENT':
        localStorage.setItem('count', (localState += 1))
        return next(action)
      case 'DECREMENT':
        localStorage.setItem('count', (localState -= 1))
        return next(action)
      case 'RESET':
        localStorage.setItem('count', 0)
        return next(action)
      default:
        return next(action)
    }
  }
}

const actionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
}

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

export function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      console.log('in increment', state.count)
      return {
        count: (state.count += 1),
      }
    case 'DECREMENT':
      console.log('in decrement')
      return {
        count: (state.count -= 1),
      }
    case 'RESET':
      console.log('in reset')
      return {
        count: (state.count = 0),
      }
    default:
      return state
  }
}

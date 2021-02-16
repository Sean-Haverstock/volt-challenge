import Dedux from './dedux.js'
import {
  counterReducer,
  increment,
  decrement,
  reset,
  logger,
  updateStorage,
} from './index.js'

const { createStore, applyMiddleware } = Dedux

const store = createStore(
  counterReducer,
  applyMiddleware(logger, updateStorage)
)
const { dispatch, getState, subscribe } = store

// grab dom nodes
const ids = ['up', 'down', 'reset', 'count']
const [incrementButton, decrementButton, resetButton, counter] = ids.map(id => {
  return document.getElementById(id)
})

// set counter to current state
counter.innerHTML = getState().count

// adding event handlers
incrementButton.addEventListener('click', incrementCount)
decrementButton.addEventListener('click', decrementCount)
resetButton.addEventListener('click', resetCount)

// define event handlers
function incrementCount() {
  dispatch(increment())
}

function decrementCount() {
  dispatch(decrement())
}

function resetCount() {
  dispatch(reset())
}

// subscribe counter DOM node to changes (called anytime an action is dispatched)
subscribe(() => {
  let currentState = getState()
  counter.innerHTML = currentState.count
})

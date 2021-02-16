import Dedux from './dedux.js'
import { counterReducer, increment, decrement, reset } from './index.js'

const { createStore } = Dedux

const store = createStore(counterReducer)
const { dispatch, getState, subscribe } = store

console.log('store', store)
localStorage.setItem('count', 5)
const counter = document.getElementById('count')
counter.innerHTML = getState().count

// grab dom nodes
const incrementButton = document.getElementById('up')
const decrementButton = document.getElementById('down')
const resetButton = document.getElementById('reset')
const count = document.getElementById('count')

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
  console.log('in reset count', reset())
  dispatch(reset())
}

subscribe(() => {
  let currentState = getState()
  counter.innerHTML = currentState.count
  console.log('subscribe', currentState)
})

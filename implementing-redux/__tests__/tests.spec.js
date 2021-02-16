import Dedux from '../dedux.js'
const { createStore, applyMiddleware } = Dedux

function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: (state.count += 1),
      }
    default:
      return state
  }
}
/*======================================================
                          TESTS
======================================================*/
describe('dedux', () => {
  describe('createStore', () => {
    it('errors if no reducer function is passed in', () => {
      expect(() => createStore()).toThrow()
      expect(() => createStore({})).toThrow()
      expect(() => createStore('foo')).toThrow()
      expect(() => createStore(() => ({}))).not.toThrow()
    })

    it('Dedux store should have getState, dispatch, and subscribe methods', () => {
      const reducer = jest.fn()
      const store = createStore(reducer)
      const methods = Object.keys(store)
      expect(methods.length).toBe(3)
      expect(methods).toContain('getState')
      expect(methods).toContain('dispatch')
      expect(methods).toContain('subscribe')
    })

    it('applies the reducer to the previous state', () => {
      const store = createStore(reducer)
      console.log('store', store)
      expect(store.getState()).toEqual({ count: 0 })

      store.dispatch({ type: 'UNKNOWN' })
      expect(store.getState()).toEqual({ count: 0 })

      store.dispatch({ type: 'INCREMENT' })
      expect(store.getState()).toEqual({ count: 1 })
    })

    it('adds multiple listener callbacks to subscriber array', () => {
      const store = createStore(reducer)
      const firstListener = jest.fn()
      const secondListener = jest.fn()

      const unsubscribeFirst = store.subscribe(firstListener)
      store.dispatch({ type: 'N/A' })
      expect(firstListener.mock.calls.length).toBe(1)

      store.dispatch({ type: 'N/A' })
      expect(firstListener.mock.calls.length).toBe(2)
      expect(secondListener.mock.calls.length).toBe(0)

      store.subscribe(secondListener)
      store.dispatch({ type: 'N/A' })
      expect(firstListener.mock.calls.length).toBe(3)
      expect(secondListener.mock.calls.length).toBe(1)

      unsubscribeFirst()
      store.dispatch({ type: 'N/A' })
      expect(firstListener.mock.calls.length).toBe(3)
      expect(secondListener.mock.calls.length).toBe(2)
    })
  })

  describe('the store', () => {
    describe('getState', () => {
      it(`returns the reducer's return value`, () => {
        const reducer = () => ({ foo: 'bar' })
        const store = createStore(reducer)
        expect(store.getState().foo).toBe('bar')
      })
    })

    describe('dispatch', () => {
      it('takes an action that conforms to { type: string, ...any }', () => {
        const store = createStore(() => {})

        expect(() => {
          store.dispatch({ randomKey: 'randomValue' })
        }).toThrow()

        expect(() => {
          store.dispatch({ type: 'TEST_ACTION', randomKey: 'randomValue' })
        }).not.toThrow()
      })

      it(`dispatch should take any dispatched action and run it 
          through the reducer function to produce a new state.`, () => {
        const reducer = (state = { foo: 'bar' }, action = {}) => {
          switch (action.type) {
            case 'BAZIFY':
              return {
                foo: (state.foo = 'baz'),
              }
            default:
              return state
          }
        } // Your reducer function here!

        const store = createStore(reducer)

        expect(store.getState().foo).toBe('bar')

        store.dispatch({ type: 'BAZIFY' })

        expect(store.getState().foo).toBe('baz')
      })
    })

    describe('subscribe', () => {
      it(`has a subscribe method that receives updates on any state change`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalled()
      })

      it(`will return a function that allows you to unsubscribe`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        const unsubscribe = store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalledTimes(1)

        unsubscribe()

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })
        expect(subscriber).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('applyMiddleware', () => {
    // Don't start this until you've completed part 2 of the challenge
    it('can apply middleware to dispatched actions', () => {
      const reducer = () => null
      const spyA = jest.fn()
      const spyB = jest.fn()

      const middleWareMocker = spy => () => next => action => {
        spy(action)
        // Middleware must call 'next'
        next(action)
      }

      const store = createStore(
        reducer,
        applyMiddleware(middleWareMocker(spyA), middleWareMocker(spyB))
      )

      const action = { type: 'ZAP' }

      store.dispatch(action)

      expect(spyA).toHaveBeenCalledWith(action)
      expect(spyB).toHaveBeenCalledWith(action)
    })
  })
})

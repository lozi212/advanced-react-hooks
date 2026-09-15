// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(state, action) {
  // Extra 4: traditional action object with type
  if (typeof action === 'object' && action !== null && action.type) {
    switch (action.type) {
      case 'INCREMENT':
        return {...state, count: state.count + action.step}
      case 'DECREMENT':
        return {...state, count: state.count - action.step}
      default:
        throw new Error(`Unknown action type: ${action.type}`)
    }
  }

  // Extra 3: action can be a function
  if (typeof action === 'function') {
    return action(state)
  }

  // Extra 2: action can be an object that merges with state
  if (typeof action === 'object' && action !== null) {
    return {...state, ...action}
  }

  // Extra 1: action can be a number
  return {
    ...state,
    count: state.count + action,
  }
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const {count} = state

  // Extra 4: traditional dispatch object
  const increment = () => dispatch({type: 'INCREMENT', step})

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
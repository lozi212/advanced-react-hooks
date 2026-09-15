// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 Create the CountContext
const CountContext = React.createContext()

// 🐨 Create the CountProvider
function CountProvider({children}) {
  // Get the count state and setCount updater
  const [count, setCount] = React.useState(0)

  // Create the value array
  const value = [count, setCount]

  // Provide the value to all children
  return (
    <CountContext.Provider value={value}>
      {children}
    </CountContext.Provider>
  )
}

// 💰 Extra Credit #1:
// Create a custom hook for consuming CountContext
function useCount() {
  const context = React.useContext(CountContext)

  if (!context) {
    throw new Error(
      'useCount may only be used within a CountProvider',
    )
  }

  return context
}

function CountDisplay() {
  // 🐨 Get the count from useContext
  const [count] = useCount()

  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 Get the setCount from useContext
  const [, setCount] = useCount()

  const increment = () => setCount(c => c + 1)

  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      {/*
        🐨 Wrap the components in CountProvider
      */}
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
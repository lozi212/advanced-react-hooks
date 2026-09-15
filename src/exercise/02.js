// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// Generic async reducer
function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {
        status: 'pending',
        data: null,
        error: null,
      }
    }

    case 'resolved': {
      return {
        status: 'resolved',
        data: action.data,
        error: null,
      }
    }

    case 'rejected': {
      return {
        status: 'rejected',
        data: null,
        error: action.error,
      }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// useAsync with all 3 extra credits
function useAsync(initialState) {
  const [state, dispatch] = React.useReducer(
    asyncReducer,
    initialState,
  )

  // Extra Credit #3:
  // Keep track of whether the component is mounted.
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  // Extra Credit #3:
  // Only dispatch when the component is still mounted.
  const safeDispatch = React.useCallback(
    action => {
      if (mountedRef.current) {
        dispatch(action)
      }
    },
    [],
  )

  // Extra Credit #2:
  // Return a memoized run function.
  const run = React.useCallback(
    promise => {
      safeDispatch({type: 'pending'})

      promise.then(
        data => {
          safeDispatch({
            type: 'resolved',
            data,
          })
        },
        error => {
          safeDispatch({
            type: 'rejected',
            error,
          })
        },
      )
    },
    [safeDispatch],
  )

  return {
    ...state,
    run,
  }
}

function PokemonInfo({pokemonName}) {
  // Extra Credit #1:
  // Memoize the async callback.
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) {
      return
    }

    return fetchPokemon(pokemonName)
  }, [pokemonName])

  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({
    status: pokemonName ? 'pending' : 'idle',
    data: null,
    error: null,
  })

  // Extra Credit #2:
  // Pass the promise to the memoized run function.
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    const promise = asyncCallback()

    if (!promise) {
      return
    }

    run(promise)
  }, [pokemonName, asyncCallback, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>

    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />

    case 'rejected':
      throw error

    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />

    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm
        pokemonName={pokemonName}
        onSubmit={handleSubmit}
      />

      <hr />

      <div className="pokemon-info">
        <PokemonErrorBoundary
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>

      <hr />

      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
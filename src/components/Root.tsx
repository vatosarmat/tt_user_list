import { useState, useEffect, useReducer } from 'react'

import { reducer, initialState, State, StateContext, DispatchContext, UserInfo } from 'state'

import App from 'components/App'

const Root: React.FC = () => {
  const [storedState, setStoredState] = useState<State | undefined>(undefined)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('state')
    if (stored) {
      const state: State = JSON.parse(stored)
      setStoredState(state)
    }
    setDone(true)
  }, [])

  if (done) {
    return <StateProvider storedState={storedState} />
  }

  return null
}

type StateProviderProps = {
  storedState?: State
}

const StateProvider: React.FC<StateProviderProps> = ({ storedState }) => {
  const [state, dispatch] = useReducer(reducer, storedState ?? initialState)
  useEffect(() => {
    if (!storedState) {
      fetch('fake-data.json')
        .then(resp => resp.json())
        .then((data: UserInfo[]) => {
          dispatch({ type: 'UserInfo/add_bulk', payload: { userInfoDataArray: data } })
        })
        .catch(e => console.log('yyy'))
    }
  }, [storedState])
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  }, [state])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <App />
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default Root

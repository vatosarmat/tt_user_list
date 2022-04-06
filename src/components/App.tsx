import { useReducer, useEffect } from 'react'
import { useParams, useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom'

import { reducer, initialState, StateContext, DispatchContext, UserInfo } from 'state'
import Sort from 'components/Sort'
import List from 'components/List'
import UserForm from 'components/UserForm'
import IconButton from 'components/IconButton'
import './App.css'

const ListSideRoute: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Sort />
      <IconButton icon={'+'} label={'Add new'} onClick={() => navigate('/add')} />
    </>
  )
}

const BackButton: React.FC = () => {
  const navigate = useNavigate()
  return <IconButton icon={'<='} label={'Back'} onClick={() => navigate(-1)} />
}

const UserFormWithId: React.FC = () => {
  const params = useParams()
  const id = params['id']

  if (!id) {
    return null
  }

  return <UserForm id={id} />
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    fetch('fake-data.json')
      .then(resp => resp.json())
      .then((data: UserInfo[]) => {
        dispatch({ type: 'UserInfo/add_bulk', payload: { userInfoDataArray: data } })
      })
      .catch(e => console.log('yyy'))
  }, [])

  if (!Object.keys(state.userInfoTable).length) {
    return null
  }

  return (
    <div className="app">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <div className="app__side">
              <div className="app__side-content">
                <Routes>
                  <Route path="/:id" element={<BackButton />} />
                  <Route path="/add" element={<BackButton />} />
                  <Route path="*" element={<ListSideRoute />} />
                </Routes>
              </div>
            </div>
            <div className="app__content">
              <Routes>
                <Route path="/:id" element={<UserFormWithId />} />
                <Route path="/add" element={<UserForm />} />
                <Route path="*" element={<List />} />
              </Routes>
            </div>
          </BrowserRouter>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

export default App

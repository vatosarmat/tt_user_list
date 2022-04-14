import { useParams, useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom'

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
  return <IconButton icon={'<='} label={'Back'} onClick={() => navigate('/')} />
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
  return (
    <div className="app">
      <BrowserRouter>
        <div className="app__side">
          <div className="app__side-content">
            <Routes>
              <Route path=":id" element={<BackButton />} />
              <Route path="add" element={<BackButton />} />
              <Route index element={<ListSideRoute />} />
              <Route path="*" element={<ListSideRoute />} />
            </Routes>
          </div>
        </div>
        <div className="app__content">
          <Routes>
            <Route path=":id" element={<UserFormWithId />} />
            <Route path="add" element={<UserForm />} />
            <Route index element={<List />} />
            <Route path="*" element={<List />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

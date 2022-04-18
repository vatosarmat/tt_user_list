import { useParams, useNavigate, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Sort from 'components/Sort'
import List from 'components/List'
import UserForm from 'components/UserForm'
import IconButton from 'components/utils/IconButton'
import CenterBlock from 'components/utils/CenterBlock'
import MainTitle from 'components/MainTitle'
import { ReactComponent as ArrowCircleLeft } from 'icons/arrow-circle-left.svg'
import { ReactComponent as PlusCircle } from 'icons/plus-circle.svg'
import './App.css'

const BackButton: React.FC = () => {
  const navigate = useNavigate()
  return <IconButton Icon={ArrowCircleLeft} label="Back" onClick={() => navigate('/')} />
}

const ListSideRoute: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Sort />
      <CenterBlock>
        <IconButton Icon={PlusCircle} label="Add new" onClick={() => navigate('/add')} />
      </CenterBlock>
    </>
  )
}

const BackButtonRoute: React.FC = () => (
  <CenterBlock>
    <BackButton />
  </CenterBlock>
)

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
        <div className="app__side-title"></div>
        <div className="app__main-title">
          <Routes>
            <Route path=":id" element={<MainTitle text="User profile" />} />
            <Route path="add" element={<MainTitle text="New user" />} />
            <Route index element={<MainTitle text="User list" />} />
            <Route path="*" element={null} />
          </Routes>
        </div>
        <div className="app__side-content">
          <div className="app__side-content-inner">
            <Routes>
              <Route path=":id" element={<BackButtonRoute />} />
              <Route path="add" element={<BackButtonRoute />} />
              <Route index element={<ListSideRoute />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
        <main className="app__main-content">
          <Routes>
            <Route path=":id" element={<UserFormWithId />} />
            <Route path="add" element={<UserForm />} />
            <Route index element={<List />} />
            <Route path="*" element={null} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App

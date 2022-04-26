import { useState } from 'react'
import { useParams, useNavigate, useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import Sort from 'components/Sort'
import List from 'components/List'
import UserForm from 'components/UserForm'
import IconButton from 'components/utils/IconButton'
import CenterBlock from 'components/utils/CenterBlock'
import MainTitle from 'components/MainTitle'
import Snackbar, { SnackbarContext } from 'components/Snackbar'
import { ReactComponent as ArrowCircleLeft } from 'icons/arrow-circle-left.svg'
import { ReactComponent as PlusCircle } from 'icons/plus-circle.svg'
import './App.css'

const BackButton: React.FC = () => {
  const navigate = useNavigate()
  return <IconButton icon={ArrowCircleLeft} label="Back" onClick={() => navigate('/')} />
}

const ListSideRoute: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="app__side-content-inner">
      <Sort />
      <CenterBlock>
        <IconButton icon={PlusCircle} label="Add new" onClick={() => navigate('/add')} />
      </CenterBlock>
    </div>
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

const AppInner: React.FC = () => {
  const [notification, setNotification] = useState<string | undefined>(undefined)
  const location = useLocation()
  const onNotificationTimeout = () => {
    setNotification(undefined)
  }
  const transitionTimeout = 500

  return (
    <div className="app">
      <SnackbarContext.Provider value={setNotification}>
        <div className="app__side-title"></div>
        <div className="app__main-title">
          <SwitchTransition>
            <CSSTransition key={location.key} classNames="fade" timeout={transitionTimeout}>
              <Routes location={location}>
                <Route path=":id" element={<MainTitle text="User profile" />} />
                <Route path="add" element={<MainTitle text="New user" />} />
                <Route index element={<MainTitle text="User list" />} />
                <Route path="*" element={null} />
              </Routes>
            </CSSTransition>
          </SwitchTransition>
        </div>
        <div className="app__side-content">
          <div className="app__side-content-sticky">
            <SwitchTransition>
              <CSSTransition key={location.key} classNames="fade" timeout={transitionTimeout}>
                <Routes location={location}>
                  <Route path=":id" element={<BackButtonRoute />} />
                  <Route path="add" element={<BackButtonRoute />} />
                  <Route index element={<ListSideRoute />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </CSSTransition>
            </SwitchTransition>
          </div>
        </div>
        <main className="app__main-content">
          <SwitchTransition>
            <CSSTransition key={location.key} classNames="slide" timeout={transitionTimeout}>
              <Routes location={location}>
                <Route path=":id" element={<UserFormWithId />} />
                <Route path="add" element={<UserForm />} />
                <Route index element={<List />} />
                <Route path="*" element={null} />
              </Routes>
            </CSSTransition>
          </SwitchTransition>
        </main>
      </SnackbarContext.Provider>
      <Snackbar timeout={3000} text={notification} onTimeout={onNotificationTimeout} />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

export default App

import { Route, Routes } from 'react-router'
import Home from './pages/home/home'
import Layout from './hoc/layout'
import { AudioProvider } from './context/audio-context'
import Playlist from './pages/playlist/playlist'
import Auth from './pages/auth/auth'
import Profile from './pages/profile/profile'
import ProfileEdit from './pages/profile-edit/profile-edit'

const App = () => {
  return (
    <AudioProvider>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/edit' element={<ProfileEdit />} />
        </Route>
      </Routes>
    </AudioProvider>
  )
}

export default App

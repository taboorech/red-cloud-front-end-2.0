import { Route, Routes } from 'react-router'
import Home from './pages/home/home'
import Layout from './hoc/layout'
import { AudioProvider } from './context/audio-context'
import Playlist from './pages/playlist/playlist'
import Auth from './pages/auth/auth'
import Profile from './pages/profile/profile'

const App = () => {
  return (
    <AudioProvider>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </AudioProvider>
  )
}

export default App

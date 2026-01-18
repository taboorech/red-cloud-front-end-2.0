import { Route, Routes } from 'react-router'
import Home from './pages/home/home'
import Layout from './hoc/layout'
import { AudioProvider } from './context/audio-context'
import Playlist from './pages/playlist/playlist'
import Auth from './pages/auth/auth'
import Profile from './pages/profile/profile'
import ProfileEdit from './pages/profile-edit/profile-edit'
import Subscriptions from './pages/subscriptions/subscriptions'
import Lyrics from './pages/lyrics/lyrics'
import LyricsTranslation from './pages/lyrics-translation/lyrics-translation'
import SongEditor from './pages/song-editor/song-editor'
import Playlists from './pages/playlists/playlists'

const App = () => {
  return (
    <AudioProvider>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/playlists' element={<Playlists />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/edit' element={<ProfileEdit />} />
          <Route path='/subscriptions' element={<Subscriptions />} />
          <Route path='/lyrics' element={<Lyrics />} />
          <Route path='/lyrics/translation' element={<LyricsTranslation />} />
          <Route path='/songs/new' element={<SongEditor />} />
          <Route path='/songs/:songId/edit' element={<SongEditor />} />
        </Route>
      </Routes>
    </AudioProvider>
  )
}

export default App

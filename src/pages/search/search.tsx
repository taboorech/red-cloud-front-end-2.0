import { useState } from 'react'
import SearchInput from './components/search-input'
import SearchTabs from './components/search-tabs'
import type { SearchTab } from './components/search-tabs'
import Song from '../../components/song/song'
import AvatarBlock from '../../components/avatar-block/avatar-block'
import type { User } from '../../types/user.types'
import type { Song as SongType } from '../../types/song.types'
import type { Playlist } from '../../types/playlist.types'
import { formatDuration } from '../../utils/format'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')

  const mockUsers: User[] = [
    {
      id: 1, username: 'Author', avatar: undefined,
      email: ''
    },
    { id: 2, username: 'Author', avatar: undefined, email: '' },
    { id: 3, username: 'Author', avatar: undefined, email: '' },
    { id: 4, username: 'Author', avatar: undefined, email: '' },
    { id: 5, username: 'Author', avatar: undefined, email: '' },
    { id: 6, username: 'Author', avatar: undefined, email: '' }
  ]

  const mockSongs: SongType[] = [
    { id: '1', title: 'Song title', duration_seconds: 192, image_url: 'http://localhost:8080/1768745524657-coca-cola.png', url: '', is_public: true, created_at: '', updated_at: '' },
    {
      id: '2', title: 'Song title', duration_seconds: 192, image_url: 'http://localhost:8080/1768745524657-coca-cola.png',
      url: '',
      is_public: true,
      created_at: '',
      updated_at: ''
    },
    { id: '3', title: 'Song title', duration_seconds: 192, image_url: 'http://localhost:8080/1768745524657-coca-cola.png', url: '', is_public: true, created_at: '', updated_at: '' },
    { id: '4', title: 'Song title', duration_seconds: 192, image_url: 'http://localhost:8080/1768745524657-coca-cola.png', url: '', is_public: true, created_at: '', updated_at: '' },
    { id: '5', title: 'Song title', duration_seconds: 192, image_url: 'http://localhost:8080/1768745524657-coca-cola.png', url: '', is_public: true, created_at: '', updated_at: '' }
  ]

  const mockPlaylists: Playlist[] = [
    {
      id: 1, title: 'Playlist name', image_url: 'http://localhost:8080/1768745524657-coca-cola.png',
      owner_id: 0,
      is_public: true,
      created_at: '',
      updated_at: ''
    },
    { id: 2, title: 'Playlist name', image_url: 'http://localhost:8080/1768745524657-coca-cola.png', owner_id: 0, is_public: true, created_at: '', updated_at: '' },
    { id: 3, title: 'Playlist name', image_url: 'http://localhost:8080/1768745524657-coca-cola.png', owner_id: 0, is_public: true, created_at: '', updated_at: '' },
    { id: 4, title: 'Playlist name', image_url: 'http://localhost:8080/1768745524657-coca-cola.png', owner_id: 0, is_public: true, created_at: '', updated_at: '' },
    { id: 5, title: 'Playlist name', image_url: 'http://localhost:8080/1768745524657-coca-cola.png', owner_id: 0, is_public: true, created_at: '', updated_at: '' }
  ]

  const renderUsers = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
      {mockUsers.map((user) => (
        <AvatarBlock
          key={user.id}
          userName={user.username}
          isStatic={true}
        />
      ))}
    </div>
  )

  const renderSongs = () => (
    <div className="space-y-2">
      {mockSongs.map((song) => (
        <Song
          key={song.id}
          title={song.title}
          image={song.image_url || ''}
          duration={formatDuration(song.duration_seconds)}
          variant="expanded"
          onClick={() => console.log('Song clicked:', song)}
        />
      ))}
    </div>
  )

  const renderPlaylists = () => (
    <div className="space-y-2">
      {mockPlaylists.map((playlist) => (
        <Song
          key={playlist.id}
          title={playlist.title}
          image={playlist.image_url || ''}
          variant="expanded"
          onClick={() => console.log('Playlist clicked:', playlist)}
        />
      ))}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return renderUsers()
      case 'songs':
        return renderSongs()
      case 'playlists':
        return renderPlaylists()
      case 'all':
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
              {renderUsers()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Songs</h2>
              {renderSongs()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Playlists</h2>
              {renderPlaylists()}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-black text-white h-full min-h-0 flex flex-col p-6">
      <div className="shrink-0">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Request"
        />
        <SearchTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full">
        {renderContent()}
      </div>
    </div>
  )
}

export default Search
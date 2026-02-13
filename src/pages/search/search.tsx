import { useState } from 'react'
import SearchInput from './components/search-input'
import SearchTabs from './components/search-tabs'
import type { SearchTab } from './components/search-tabs'
import Song from '../../components/song/song'
import AvatarBlock from '../../components/avatar-block/avatar-block'
import { formatDuration } from '../../utils/format'
import { useSearchQuery } from '../../store/api/search.api'
import { SearchType } from '../../types/search.types'

const tabToSearchType: Record<SearchTab, SearchType> = {
  all: SearchType.ALL,
  songs: SearchType.SONGS,
  users: SearchType.USERS,
  playlists: SearchType.PLAYLISTS,
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')

  const { data, isFetching } = useSearchQuery(
    { query: searchQuery, type: tabToSearchType[activeTab] },
    { skip: searchQuery.trim().length === 0 }
  )

  const users = data?.users ?? []
  const songs = data?.songs ?? []
  const playlists = data?.playlists ?? []

  const renderUsers = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
      {users.map((user) => (
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
      {songs.map((song) => (
        <Song
          key={song.id}
          title={song.title}
          image={song.image_url || ''}
          duration={formatDuration(song.duration_seconds)}
          variant="expanded"
          song={song}
        />
      ))}
    </div>
  )

  const renderPlaylists = () => (
    <div className="space-y-2">
      {playlists.map((playlist) => (
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
    if (searchQuery.trim().length === 0) {
      return (
        <p className="text-white text-center mt-12">Enter a search query to find songs, users, and playlists</p>
      )
    }

    if (isFetching) {
      return (
        <p className="text-gray-400 text-center mt-12">Searching...</p>
      )
    }

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
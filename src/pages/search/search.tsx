import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import SearchInput from './components/search-input'
import SearchTabs from './components/search-tabs'
import type { SearchTab } from './components/search-tabs'
import Song from '../../components/song/song'
import { formatDuration } from '../../utils/format'
import { useSearchQuery } from '../../store/api/search.api'
import { SearchType } from '../../types/search.types'
import { useAudio } from '../../context/audio-context'
import { Helmet } from 'react-helmet-async'
import { useContextMenu } from '../../hooks/use-context-menu'
import UserContextMenu from '../../components/context-menu/menus/user-context-menu'
import PageLayout from '../../components/page-layout/page-layout'
import type { User } from '../../types/user.types'

const tabToSearchType: Record<SearchTab, SearchType> = {
  all: SearchType.ALL,
  songs: SearchType.SONGS,
  users: SearchType.USERS,
  playlists: SearchType.PLAYLISTS,
}

const Search = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentSong } = useAudio()
  const searchQuery = searchParams.get('q') ?? ''
  const setSearchQuery = (value: string) => {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const userMenu = useContextMenu()
  const [menuUser, setMenuUser] = useState<User | null>(null)

  const { data, isFetching } = useSearchQuery(
    { query: searchQuery, type: tabToSearchType[activeTab] },
    { skip: searchQuery.trim().length === 0 }
  )

  const users = data?.users ?? []
  const songs = data?.songs ?? []
  const playlists = data?.playlists ?? []

  const handleUserContextMenu = (e: React.MouseEvent, user: User) => {
    setMenuUser(user)
    userMenu.open(e)
  }

  const renderUsers = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {users.map((user) => (
        <button
          type="button"
          key={user.id}
          onClick={() => navigate(`/profile/${user.id}`)}
          onContextMenu={(e) => handleUserContextMenu(e, user)}
          className="flex flex-col items-center gap-3 bg-app-soft hover:bg-app-elev rounded-xl p-4 transition-colors cursor-pointer text-left"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden bg-app-elev grid place-items-center text-app-text-muted text-2xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span>{user.username?.[0]?.toUpperCase() ?? '?'}</span>
            )}
          </div>
          <span className="text-app-text text-sm font-medium truncate w-full text-center">{user.username}</span>
        </button>
      ))}
    </div>
  )

  const renderSongs = () => (
    <div className="space-y-1">
      {songs.map((song) => (
        <Song
          key={song.id}
          title={song.title}
          image={song.image_url || ''}
          duration={formatDuration(song.duration_seconds)}
          variant="expanded"
          song={song}
          isActive={currentSong?.id === song.id}
        />
      ))}
    </div>
  )

  const renderPlaylists = () => (
    <div className="space-y-1">
      {playlists.map((playlist) => (
        <Song
          key={playlist.id}
          title={playlist.title}
          image={playlist.image_url || ''}
          variant="expanded"
        />
      ))}
    </div>
  )

  const renderResults = () => {
    if (isFetching) {
      return <p className="text-app-text-muted text-center mt-12">{t('common.loading')}</p>
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
            {songs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-app-text mb-4">{t('search.tabs.songs')}</h2>
                {renderSongs()}
              </div>
            )}
            {users.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-app-text mb-4">{t('search.tabs.users')}</h2>
                {renderUsers()}
              </div>
            )}
            {playlists.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-app-text mb-4">{t('search.tabs.playlists')}</h2>
                {renderPlaylists()}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.search')}</title>
      </Helmet>
      <PageLayout className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-app-text">{t('navigation.search')}</h1>
          <p className="text-app-text-muted text-sm mt-1">
            Знаходь пісні, виконавців, плейлисти й користувачів
          </p>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('search.placeholder')}
        />

        <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {searchQuery.trim().length > 0 && renderResults()}

        {userMenu.isOpen && menuUser && (
          <UserContextMenu
            user={menuUser}
            position={userMenu.position}
            onClose={userMenu.close}
          />
        )}
      </PageLayout>
    </>
  )
}

export default Search

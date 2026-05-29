import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useListSongsForModerationQuery,
  useModerateDeleteSongMutation,
} from '../../../store/api/songs.api'
import Input from '../../../components/input/input'
import ConfirmModal from '../../../components/confirm-modal/confirm-modal'
import SongRow from './song-row'
import SongEditModal from './song-edit-modal'
import type { Song } from '../../../types/song.types'

type PublicFilter = 'all' | 'public' | 'hidden'

const SongsTab = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [publicFilter, setPublicFilter] = useState<PublicFilter>('all')
  const [editing, setEditing] = useState<Song | null>(null)
  const [deleting, setDeleting] = useState<Song | null>(null)
  const [deleteSong, { isLoading: isDeleting }] = useModerateDeleteSongMutation()

  const { data: songs = [], isLoading, error } = useListSongsForModerationQuery({
    search: debouncedSearch || undefined,
    isPublic:
      publicFilter === 'all' ? undefined : publicFilter === 'public',
    limit: 100,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => setDebouncedSearch(value), 400)
    setDebounceTimer(timer)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    await deleteSong(Number(deleting.id))
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-4">
        <div className="max-w-md flex-1">
          <Input
            placeholder={t('management.songs.searchPlaceholder')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select
          value={publicFilter}
          onChange={(e) => setPublicFilter(e.target.value as PublicFilter)}
          className="bg-app-elev border border-app-line text-app-text text-xs rounded-lg px-3 py-2 outline-none hover:border-app-text-muted focus:border-brand-500 transition-colors cursor-pointer"
        >
          <option value="all">{t('management.filter.all')}</option>
          <option value="public">{t('management.songs.filterPublic')}</option>
          <option value="hidden">{t('management.songs.filterHidden')}</option>
        </select>
      </div>

      {isLoading && (
        <p className="text-sm text-app-text-muted">{t('common.loading')}</p>
      )}
      {!!error && (
        <p className="text-sm text-red-500">{t('management.loadError')}</p>
      )}
      {!isLoading && !error && songs.length === 0 && (
        <p className="text-sm text-app-text-muted">
          {t('management.songs.noSongs')}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {songs.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            onEdit={() => setEditing(song)}
            onDelete={() => setDeleting(song)}
            deleting={isDeleting && deleting?.id === song.id}
          />
        ))}
      </div>

      {editing && (
        <SongEditModal song={editing} onClose={() => setEditing(null)} />
      )}

      {deleting && (
        <ConfirmModal
          title={t('management.songs.confirmDelete')}
          message={deleting.title}
          confirmLabel={t('common.delete')}
          loading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default SongsTab

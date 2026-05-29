import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/button'
import type { Song } from '../../../types/song.types'

interface SongRowProps {
  song: Song
  onEdit: () => void
  onDelete: () => void
  deleting?: boolean
}

const SongRow = ({ song, onEdit, onDelete, deleting }: SongRowProps) => {
  const { t } = useTranslation()
  const authorsLine = song.authors
    ?.map((a) => a.user?.username ?? a.name ?? `ID ${a.user_id}`)
    .filter(Boolean)
    .join(', ')
  const genresLine = song.genres?.map((g) => g.title).join(', ')

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-4 bg-app-soft border border-app-line rounded-2xl">
      <div className="flex items-center gap-4 min-w-0">
        {song.image_url ? (
          <img
            src={song.image_url}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-app-elev shrink-0" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{song.title}</p>
            {!song.is_public && (
              <span className="text-[10px] font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                {t('management.songs.hidden')}
              </span>
            )}
          </div>
          <p className="text-xs text-app-text-muted truncate">
            {authorsLine || t('management.songs.noAuthor')}
            {genresLine ? ` · ${genresLine}` : ''}
          </p>
        </div>
      </div>

      <Button variant="outline" size="sm" rounded="lg" onClick={onEdit}>
        {t('common.edit')}
      </Button>

      <Button
        variant="danger"
        size="sm"
        rounded="lg"
        onClick={onDelete}
        loading={deleting}
        disabled={deleting}
      >
        {t('common.delete')}
      </Button>
    </div>
  )
}

export default SongRow

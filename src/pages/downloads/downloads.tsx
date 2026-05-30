import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'
import { MdDownloadForOffline, MdPlayArrow, MdDelete } from 'react-icons/md'
import PageLayout from '../../components/page-layout/page-layout'
import PageHeader from '../../components/page-header/page-header'
import List from '../../components/list/list'
import EmptyState from '../../components/empty-state/empty-state'
import StripedCover from '../../components/striped-cover/striped-cover'
import { BRAND_BUTTON_BASE } from '../../utils/tailwind-classes'
import { useAudio } from '../../context/audio-context'
import { useDownloadedSongs, useDownloadAction } from '../../hooks/use-downloads'
import { formatBytes, formatDuration } from '../../utils/format'
import type { DownloadedSong } from '../../utils/downloads-db'
import { SongAuthorsRole, type Song } from '../../types/song.types'

const toSong = (record: DownloadedSong, fallbackImageUrl?: string): Song => ({
  id: record.id,
  title: record.title,
  duration_seconds: record.durationSeconds,
  url: '',
  image_url: fallbackImageUrl,
  is_public: true,
  created_at: new Date(record.downloadedAt).toISOString(),
  updated_at: new Date(record.downloadedAt).toISOString(),
  authors: record.authorName
    ? [{ role: SongAuthorsRole.Singer, user_id: '', name: record.authorName }]
    : undefined,
})

const DownloadedRow = ({
  record,
  onPlay,
  onRemove,
  isActive,
}: {
  record: DownloadedSong
  onPlay: () => void
  onRemove: () => void
  isActive: boolean
}) => {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!record.imageBlob) return
    const url = URL.createObjectURL(record.imageBlob)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [record.imageBlob])

  return (
    <div
      onClick={onPlay}
      className="group cursor-pointer select-none flex items-center w-full px-2 py-2 rounded-lg hover:bg-app-soft transition"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <StripedCover
          src={imageUrl}
          alt={record.title}
          seed={record.id}
          rounded="rounded-md"
          className="w-12 h-12 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isActive ? 'text-brand-400' : 'text-app-text'
            }`}
          >
            {record.title}
          </p>
          {record.authorName && (
            <p className="text-xs text-app-text-muted truncate">{record.authorName}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-2">
        <span className="text-xs text-app-text-muted tabular-nums hidden sm:inline">
          {formatBytes(record.audioSize + record.imageSize)}
        </span>
        <span className="text-xs text-app-text-muted tabular-nums">
          {formatDuration(record.durationSeconds)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={t('downloads.remove')}
          className="w-8 h-8 grid place-items-center rounded-full text-app-text-muted hover:text-red-500 hover:bg-app-soft transition opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <MdDelete className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const Downloads = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const audio = useAudio()
  const { songs, isLoading } = useDownloadedSongs()
  const { remove } = useDownloadAction()

  const totalBytes = useMemo(
    () => songs.reduce((sum, s) => sum + s.audioSize + s.imageSize, 0),
    [songs],
  )

  const handlePlayAll = () => {
    if (!songs.length) return
    const queue = songs.map((s, i) => ({ song: toSong(s), index: i, isActive: i > 0 }))
    audio.setQueue(queue)
    audio.setCurrentIndex(0)
    audio.setCurrentPlaylist('downloads')
    audio.setPlayMode('normal')
    audio.playSong(toSong(songs[0]))
    audio.setPlaying(true)
  }

  const handlePlay = (record: DownloadedSong, index: number) => {
    const song = toSong(record)
    const queue = songs.map((s, i) => ({
      song: toSong(s),
      index: i,
      isActive: i > index,
    }))
    audio.setQueue(queue)
    audio.setCurrentIndex(index)
    audio.setCurrentPlaylist('downloads')
    audio.playSong(song)
    audio.setPlaying(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-app-text text-lg">{t('common.loading')}</div>
      </div>
    )
  }

  const isEmpty = songs.length === 0

  return (
    <>
      <Helmet>
        <title>{t('downloads.pageTitle')}</title>
      </Helmet>
      <div className="flex flex-col">
        <PageHeader
          gradientClassName="bg-gradient-to-b from-emerald-900/40 via-teal-900/20 to-transparent"
          icon={
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 grid place-items-center">
              <MdDownloadForOffline className="text-white w-20 h-20" />
            </div>
          }
          eyebrow={t('downloads.eyebrow')}
          title={t('downloads.title')}
          meta={
            <>
              {songs.length} {songs.length === 1 ? t('common.song') : t('common.songs')} ·{' '}
              {formatBytes(totalBytes)}
            </>
          }
          actions={
            <button
              onClick={handlePlayAll}
              disabled={isEmpty}
              aria-label={t('common.play')}
              className="w-14 h-14 rounded-full bg-brand-500 shadow-[0_0_24px_-2px_rgba(239,54,54,0.7)] grid place-items-center text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <MdPlayArrow className="text-3xl" />
            </button>
          }
        />

        <PageLayout padded={false} className="pb-10">
          {isEmpty ? (
            <EmptyState
              icon={<MdDownloadForOffline className="w-8 h-8" />}
              title={t('downloads.emptyTitle')}
              description={t('downloads.emptyHint')}
              actions={
                <button
                  onClick={() => navigate('/')}
                  className={`${BRAND_BUTTON_BASE} px-6 h-11 rounded-full`}
                >
                  {t('downloads.browse')}
                </button>
              }
            />
          ) : (
            <List gap={1}>
              {songs.map((record, index) => (
                <DownloadedRow
                  key={record.id}
                  record={record}
                  isActive={audio.currentSong?.id === record.id}
                  onPlay={() => handlePlay(record, index)}
                  onRemove={() => remove(record.id)}
                />
              ))}
            </List>
          )}
        </PageLayout>
      </div>
    </>
  )
}

export default Downloads

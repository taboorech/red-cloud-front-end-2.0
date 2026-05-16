import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { MdAdd, MdEdit, MdDelete, MdMusicNote, MdPlayArrow } from "react-icons/md"
import { CiShuffle } from "react-icons/ci"
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2"
import Song from "../../components/song/song"
import List from "../../components/list/list"
import { Button } from "../../components/button/button"
import { useGetSongsQuery, useDeleteSongMutation } from "../../store/api/songs.api"
import { useAudio } from "../../context/audio-context"
import { formatDuration } from "../../utils/format"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet-async"

const MySongs = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: songs, isLoading, error } = useGetSongsQuery({ offset: 0, limit: 100, owned: true })
  const [deleteSong] = useDeleteSongMutation()
  const audio = useAudio()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totals = useMemo(() => {
    if (!songs?.length) return { plays: 0, duration: "0:00" }
    const totalSeconds = songs.reduce((acc, s) => acc + (s.duration_seconds || 0), 0)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const duration = hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`
    return { duration }
  }, [songs])

  const handleDelete = async (songId: string) => {
    setDeletingId(songId)
    try {
      await deleteSong(songId).unwrap()
    } finally {
      setDeletingId(null)
    }
  }

  const handlePlayAll = () => {
    if (!songs?.length) return
    const queue = songs.map((song, index) => ({ song, index, isActive: index > 0 }))
    audio.setQueue(queue)
    audio.setCurrentIndex(0)
    audio.setCurrentPlaylist("my-songs")
    audio.setPlayMode("normal")
    audio.playSong(songs[0])
    audio.setPlaying(true)
  }

  const handleShuffle = () => {
    if (!songs?.length) return
    audio.setPlayMode("shuffle")
    handlePlayAll()
  }

  if (isLoading) {
    return (
      <div className="px-6 md:px-10 pt-8 pb-10 text-app-text">{t('common.loading')}</div>
    )
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 pt-8 pb-10 text-brand-400">{t('home.loadingError')}</div>
    )
  }

  const isEmpty = !songs || songs.length === 0

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.mySongs')}</title>
      </Helmet>
      <div className="flex flex-col">
        <header className="relative px-6 md:px-10 pt-8 pb-6 bg-gradient-to-b from-indigo-900/40 via-blue-900/20 to-transparent">
          <div className="flex items-end gap-6 flex-wrap">
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 grid place-items-center shrink-0 shadow-2xl relative overflow-hidden">
              <MdMusicNote className="text-white w-20 h-20" />
              <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.07)_0_2px,transparent_2px_8px)]" />
            </div>
            <div className="flex flex-col gap-3 min-w-0 pb-2">
              <span className="text-[11px] tracking-[0.18em] font-semibold text-app-text-soft uppercase">
                {t('mySongs.collection')}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-app-text truncate">
                {t('mySongs.title')}
              </h1>
              <p className="text-sm text-app-text-soft">
                {songs?.length ?? 0} {songs?.length === 1 ? t('common.song') : t('common.songs')}
                {!isEmpty && ` · ${totals.duration}`}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              disabled={isEmpty}
              className="w-14 h-14 rounded-full bg-brand-500 shadow-[0_0_24px_-2px_rgba(239,54,54,0.7)] grid place-items-center text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label={t('common.play')}
            >
              <MdPlayArrow className="text-3xl" />
            </button>
            <button
              onClick={handleShuffle}
              disabled={isEmpty}
              className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft disabled:opacity-50 transition cursor-pointer"
              aria-label="Shuffle"
            >
              <CiShuffle className="w-6 h-6" />
            </button>
            <button
              className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft transition cursor-pointer"
              aria-label="More"
            >
              <HiOutlineEllipsisHorizontal className="w-6 h-6" />
            </button>

            <div className="ml-auto">
              <button
                onClick={() => navigate("/songs/new")}
                className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
              >
                <MdAdd className="text-xl" /> {t('mySongs.createSong')}
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {!isEmpty ? (
            <List gap={1}>
              {songs!.map((song, index) => {
                const isActive = audio.currentSong?.id === song.id && audio.currentPlaylist === "my-songs"

                return (
                  <div key={song.id} className="flex items-center gap-2 group">
                    <div className="flex-1 min-w-0">
                      <Song
                        title={song.title}
                        image={song.image_url ?? ""}
                        variant="expanded"
                        duration={formatDuration(song.duration_seconds)}
                        song={song}
                        isActive={isActive}
                        onClick={() => {
                          const queue = songs!.map((s, i) => ({ song: s, index: i, isActive: i > index }))
                          audio.setQueue(queue)
                          audio.setCurrentPlaylist("my-songs")
                          audio.playFromQueue(index)
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="circle"
                        rounded="full"
                        onClick={() => navigate(`/songs/${song.id}/edit`)}
                      >
                        <MdEdit className="text-lg text-app-text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="circle"
                        rounded="full"
                        disabled={deletingId === song.id}
                        onClick={() => handleDelete(song.id)}
                      >
                        <MdDelete className="text-lg text-brand-400" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </List>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-16 h-16 grid place-items-center rounded-full bg-app-soft mb-2">
                <MdMusicNote className="text-app-text-muted w-8 h-8" />
              </div>
              <p className="text-app-text text-xl font-semibold">{t('mySongs.noSongs')}</p>
              <p className="text-app-text-muted text-sm">{t('mySongs.noSongsDescription')}</p>
              <button
                onClick={() => navigate("/songs/new")}
                className="mt-4 inline-flex items-center gap-2 px-5 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
              >
                <MdAdd className="text-xl" /> {t('mySongs.createSong')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MySongs

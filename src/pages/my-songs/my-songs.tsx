import { useState } from "react"
import { useNavigate } from "react-router"
import { MdAdd, MdEdit, MdDelete, MdMusicNote } from "react-icons/md"
import Song from "../../components/song/song"
import List from "../../components/list/list"
import { Button } from "../../components/button/button"
import { useGetSongsQuery, useDeleteSongMutation } from "../../store/api/songs.api"
import { useAudio } from "../../context/audio-context"
import { formatDuration } from "../../utils/format"
import { useTranslation } from "react-i18next"

const MySongs = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: songs, isLoading, error } = useGetSongsQuery({ page: 1, limit: 100 })
  const [deleteSong] = useDeleteSongMutation()
  const audio = useAudio()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (songId: string) => {
    setDeletingId(songId)
    try {
      await deleteSong(songId).unwrap()
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-900 dark:text-white text-lg">{t('common.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">{t('home.loadingError')}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="bg-gradient-to-b from-indigo-100 dark:from-indigo-900/40 to-white dark:to-black p-6 rounded-md flex items-center justify-between border border-gray-200 dark:border-transparent">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('mySongs.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {songs?.length ?? 0} {t('common.songs')}
          </p>
        </div>
        <Button
          variant="snow"
          size="md"
          rounded="full"
          leftIcon={<MdAdd className="text-xl" />}
          onClick={() => navigate("/songs/new")}
        >
          {t('mySongs.createSong')}
        </Button>
      </div>

      <div className="bg-white dark:bg-black p-4 rounded-md flex-1 min-h-0 overflow-hidden border border-gray-200 dark:border-transparent">
        {songs && songs.length > 0 ? (
          <List gap={1}>
            {songs.map((song, index) => {
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
                        if (!songs.length) return
                        const queue = songs.map((s, i) => ({ song: s, index: i, isActive: i > index }))
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
                      <MdEdit className="text-lg text-gray-500 dark:text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="circle"
                      rounded="full"
                      disabled={deletingId === song.id}
                      onClick={() => handleDelete(song.id)}
                    >
                      <MdDelete className="text-lg text-red-500" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </List>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <MdMusicNote className="text-gray-300 dark:text-gray-600 text-5xl" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('mySongs.noSongs')}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t('mySongs.noSongsDescription')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MySongs

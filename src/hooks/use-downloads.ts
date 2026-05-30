import { useCallback, useEffect, useState } from 'react'
import {
  DOWNLOADS_CHANGED,
  downloadSong,
  listDownloaded,
  removeDownload,
} from '../utils/downloads'
import { downloadsDB, type DownloadedSong } from '../utils/downloads-db'
import type { Song } from '../types/song.types'

export const useDownloadedIds = (): Set<string> => {
  const [ids, setIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      const keys = await downloadsDB.songs.toCollection().primaryKeys()
      if (!cancelled) setIds(new Set(keys))
    }
    refresh()
    window.addEventListener(DOWNLOADS_CHANGED, refresh)
    return () => {
      cancelled = true
      window.removeEventListener(DOWNLOADS_CHANGED, refresh)
    }
  }, [])

  return ids
}

/** Full list of downloaded songs, ordered newest-first. For the Downloads page. */
export const useDownloadedSongs = (): { songs: DownloadedSong[]; isLoading: boolean } => {
  const [songs, setSongs] = useState<DownloadedSong[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const refresh = async () => {
      const result = await listDownloaded()
      if (!cancelled) {
        setSongs(result)
        setIsLoading(false)
      }
    }
    refresh()
    window.addEventListener(DOWNLOADS_CHANGED, refresh)
    return () => {
      cancelled = true
      window.removeEventListener(DOWNLOADS_CHANGED, refresh)
    }
  }, [])

  return { songs, isLoading }
}

/**
 * Per-song download action. Tracks in-flight state so the UI can show
 * a spinner while bytes are being fetched.
 */
export const useDownloadAction = () => {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const download = useCallback(async (song: Song) => {
    setPendingIds((prev) => new Set(prev).add(song.id))
    try {
      await downloadSong(song)
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(song.id)
        return next
      })
    }
  }, [])

  const remove = useCallback(async (songId: string) => {
    await removeDownload(songId)
  }, [])

  return { download, remove, isPending: (id: string) => pendingIds.has(id) }
}

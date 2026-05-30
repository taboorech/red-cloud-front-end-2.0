import { downloadsDB, type DownloadedSong } from './downloads-db'
import type { Song } from '../types/song.types'

const blobUrlCache = new Map<string, string>()

const resolveAuthorName = (song: Song): string => {
  const first = song.authors?.[0]
  return first?.name ?? first?.user?.username ?? ''
}

const fetchAsBlob = async (url: string): Promise<Blob> => {
  const res = await fetch(url, { credentials: 'omit' })
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`)
  return res.blob()
}

export const downloadSong = async (song: Song): Promise<void> => {
  const [audioBlob, imageBlob] = await Promise.all([
    fetchAsBlob(song.url),
    song.image_url ? fetchAsBlob(song.image_url).catch(() => undefined) : undefined,
  ])
  const record: DownloadedSong = {
    id: song.id,
    title: song.title,
    authorName: resolveAuthorName(song),
    durationSeconds: song.duration_seconds,
    audioBlob,
    imageBlob,
    audioMime: audioBlob.type || 'audio/mpeg',
    audioSize: audioBlob.size,
    imageSize: imageBlob?.size ?? 0,
    downloadedAt: Date.now(),
  }
  await downloadsDB.songs.put(record)
  notifyDownloadsChanged()
}

export const removeDownload = async (songId: string): Promise<void> => {
  const cached = blobUrlCache.get(songId)
  if (cached) {
    URL.revokeObjectURL(cached)
    blobUrlCache.delete(songId)
  }
  await downloadsDB.songs.delete(songId)
  notifyDownloadsChanged()
}

export const isDownloaded = async (songId: string): Promise<boolean> => {
  const record = await downloadsDB.songs.get(songId)
  return !!record
}

export const getDownloadedAudioUrl = async (songId: string): Promise<string | null> => {
  const cached = blobUrlCache.get(songId)
  if (cached) return cached
  const record = await downloadsDB.songs.get(songId)
  if (!record) return null
  const url = URL.createObjectURL(record.audioBlob)
  blobUrlCache.set(songId, url)
  return url
}

export const listDownloaded = async (): Promise<DownloadedSong[]> => {
  return downloadsDB.songs.orderBy('downloadedAt').reverse().toArray()
}

export const totalDownloadedBytes = async (): Promise<number> => {
  const records = await downloadsDB.songs.toArray()
  return records.reduce((sum, r) => sum + r.audioSize + r.imageSize, 0)
}

export const DOWNLOADS_CHANGED = 'downloads:changed'

export const notifyDownloadsChanged = () => {
  window.dispatchEvent(new CustomEvent(DOWNLOADS_CHANGED))
}

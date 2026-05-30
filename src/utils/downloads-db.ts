import Dexie, { type Table } from 'dexie'

export interface DownloadedSong {
  id: string
  title: string
  authorName: string
  durationSeconds: number
  audioBlob: Blob
  imageBlob?: Blob
  audioMime: string
  audioSize: number
  imageSize: number
  downloadedAt: number
}

class DownloadsDB extends Dexie {
  songs!: Table<DownloadedSong, string>

  constructor() {
    super('redcloud-downloads')
    this.version(1).stores({
      songs: 'id, downloadedAt',
    })
  }
}

export const downloadsDB = new DownloadsDB()

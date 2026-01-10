interface Playlist {
  id: string
  title: string
  duration: string
  image: string
}

interface RecentPlaylistsProps {
  playlists: Playlist[]
}

const RecentPlaylists = ({ playlists }: RecentPlaylistsProps) => {
  return (
    <div className="lg:col-span-8 bg-black p-6 rounded-2xl flex flex-col gap-4 shadow-md">
      <div className="flex flex-col gap-1">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="flex items-center justify-between group hover:bg-white/5 p-3 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                <img src={playlist.image} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                {playlist.title}
              </span>
            </div>
            <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
              {playlist.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentPlaylists

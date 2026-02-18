import { useNavigate } from "react-router"
import type { Playlist } from "../../../types/playlist.types"

interface RecentPlaylistsProps {
  playlists: Playlist[]
}

const RecentPlaylists = ({ playlists }: RecentPlaylistsProps) => {
  const navigate = useNavigate()

  return (
    <div className="lg:col-span-8 bg-black p-6 rounded-2xl flex flex-col gap-4 shadow-md">
      <div className="flex flex-col gap-1">
        {playlists.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No playlists yet</p>
        ) : (
          playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="flex items-center justify-between group hover:bg-white/5 p-3 rounded-xl transition-colors cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md bg-white/5">
                  {playlist.image_url && (
                    <img src={playlist.image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                  {playlist.title}
                </span>
              </div>
              <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                {playlist.songs?.length ?? 0} songs
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentPlaylists

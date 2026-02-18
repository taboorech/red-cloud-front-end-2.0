import { useEffect } from "react"
import ProfileHeader from "./components/profile-header"
import RecentPlaylists from "./components/recent-playlists"
import ProfileStats from "./components/profile-stats"
import { useGetProfileQuery, useGetProfileStatsQuery } from "../../store/api/profile.api"
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api"

const Profile = () => {
  const { data: profile, isLoading } = useGetProfileQuery()
  const { data: stats, isLoading: statsLoading } = useGetProfileStatsQuery()
  const [getPlaylists, { data: playlists, isLoading: playlistsLoading }] = useLazyGetPlaylistsQuery()

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 5 })
  }, [getPlaylists])

  if (isLoading || statsLoading || playlistsLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 h-full text-white overflow-y-auto">
      <ProfileHeader 
        avatar={profile?.avatar ?? ""}
        username={profile?.username ?? "Unknown"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RecentPlaylists playlists={playlists ?? []} />
        <ProfileStats 
          listeningsCount={String(stats?.listeningsCount ?? 0)}
          dislikedCount={String(stats?.dislikedCount ?? 0)}
          likedCount={String(stats?.likedCount ?? 0)}
          playlistsCount={String(stats?.playlistsCount ?? 0)}
        />
      </div>
    </div>
  )
}

export default Profile
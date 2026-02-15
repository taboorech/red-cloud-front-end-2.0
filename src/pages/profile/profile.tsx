import { faker } from "@faker-js/faker"
import ProfileHeader from "./components/profile-header"
import RecentPlaylists from "./components/recent-playlists"
import ProfileStats from "./components/profile-stats"
import { useGetProfileQuery } from "../../store/api/profile.api"

const Profile = () => {
  const { data: profile, isLoading } = useGetProfileQuery()

  const playlists = Array.from({ length: 4 }).map(() => ({
    id: faker.string.uuid(),
    title: "Playlist title",
    duration: "3:12:10",
    image: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 h-full text-white overflow-y-auto">
      <ProfileHeader 
        avatar={profile?.avatar ?? faker.image.avatar()}
        username={profile?.username ?? "Unknown"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RecentPlaylists playlists={playlists} />
        <ProfileStats 
          songsListened="17"
          songsFound="101"
          songsLiked="20"
          playlistsCreated="20"
        />
      </div>
    </div>
  )
}

export default Profile
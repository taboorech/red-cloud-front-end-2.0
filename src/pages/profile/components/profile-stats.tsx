import { IoMusicalNotes, IoThumbsDown, IoThumbsUp, IoList } from "react-icons/io5"
import StatCard from "./stat-card"

interface ProfileStatsProps {
  listeningsCount: string
  dislikedCount: string
  likedCount: string
  playlistsCount: string
}

const ProfileStats = ({ listeningsCount, dislikedCount, likedCount, playlistsCount }: ProfileStatsProps) => {
  return (
    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
      <StatCard icon={<IoMusicalNotes />} value={listeningsCount} label="Songs listened" />
      <StatCard icon={<IoThumbsDown />} value={dislikedCount} label="Songs disliked" />
      <StatCard icon={<IoThumbsUp />} value={likedCount} label="Songs liked" />
      <StatCard icon={<IoList />} value={playlistsCount} label="Playlists created" />
    </div>
  )
}

export default ProfileStats

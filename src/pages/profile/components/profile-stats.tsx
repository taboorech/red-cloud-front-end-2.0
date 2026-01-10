import { IoMusicalNotes, IoSearch, IoThumbsUp, IoList } from "react-icons/io5"
import StatCard from "./stat-card"

interface ProfileStatsProps {
  songsListened: string
  songsFound: string
  songsLiked: string
  playlistsCreated: string
}

const ProfileStats = ({ songsListened, songsFound, songsLiked, playlistsCreated }: ProfileStatsProps) => {
  return (
    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
      <StatCard icon={<IoMusicalNotes />} value={songsListened} label="Songs listened" />
      <StatCard icon={<IoSearch />} value={songsFound} label="Songs found" />
      <StatCard icon={<IoThumbsUp />} value={songsLiked} label="Songs liked" />
      <StatCard icon={<IoList />} value={playlistsCreated} label="Playlists created" />
    </div>
  )
}

export default ProfileStats

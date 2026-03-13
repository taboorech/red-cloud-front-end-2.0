import { IoMusicalNotes, IoThumbsDown, IoThumbsUp, IoList } from "react-icons/io5"
import StatCard from "./stat-card"
import { useTranslation } from "react-i18next"

interface ProfileStatsProps {
  listeningsCount: string
  dislikedCount: string
  likedCount: string
  playlistsCount: string
}

const ProfileStats = ({ listeningsCount, dislikedCount, likedCount, playlistsCount }: ProfileStatsProps) => {
  const { t } = useTranslation()
  
  return (
    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
      <StatCard icon={<IoMusicalNotes />} value={listeningsCount} label={t('profile.songsListened')} />
      <StatCard icon={<IoThumbsDown />} value={dislikedCount} label={t('profile.songsDisliked')} />
      <StatCard icon={<IoThumbsUp />} value={likedCount} label={t('profile.songsLiked')} />
      <StatCard icon={<IoList />} value={playlistsCount} label={t('profile.playlistsCreated')} />
    </div>
  )
}

export default ProfileStats

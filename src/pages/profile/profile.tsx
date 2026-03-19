import { useEffect } from "react"
import { useNavigate } from "react-router"
import { MdMusicNote, MdChevronRight } from "react-icons/md"
import ProfileHeader from "./components/profile-header"
import RecentPlaylists from "./components/recent-playlists"
import ProfileStats from "./components/profile-stats"
import { useGetProfileQuery, useGetProfileStatsQuery } from "../../store/api/profile.api"
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet-async"

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useGetProfileQuery()
  const { data: stats, isLoading: statsLoading } = useGetProfileStatsQuery()
  const [getPlaylists, { data: playlists, isLoading: playlistsLoading }] = useLazyGetPlaylistsQuery()

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 5 })
  }, [getPlaylists])

  if (isLoading || statsLoading || playlistsLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        {t('common.loading')}
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.profile')}</title>
      </Helmet>
      <div className="flex flex-col gap-6 h-full text-gray-900 dark:text-white overflow-y-auto">
        <ProfileHeader
          avatar={profile?.avatar ?? ""}
          username={profile?.username ?? "Unknown"}
        />

        <div
          onClick={() => navigate("/songs")}
          className="flex items-center justify-between bg-white dark:bg-black px-6 py-4 rounded-2xl shadow-md border border-gray-200 dark:border-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MdMusicNote className="text-2xl text-indigo-500" />
            <span className="font-medium text-gray-900 dark:text-white">{t('mySongs.title')}</span>
          </div>
          <MdChevronRight className="text-2xl text-gray-400" />
        </div>

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
    </>
  )
}

export default Profile
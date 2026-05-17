import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import classNames from "classnames"
import { IoSettingsSharp, IoLogOut } from "react-icons/io5"
import { useGetProfileQuery, useGetProfileStatsQuery } from "../../store/api/profile.api"
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api"
import { useGetSongsQuery } from "../../store/api/songs.api"
import { useSubscription } from "../../hooks/use-subscription"
import { useLogoutMutation } from "../../store/api/auth.api"
import PageLayout from "../../components/page-layout/page-layout"
import StatCard from "../../components/stat-card/stat-card"
import { BRAND_BUTTON_BASE, PAGE_LABEL_BASE } from "../../utils/tailwind-classes"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet-async"

type ProfileTab = "playlists" | "songs" | "activity"

const GRADIENTS = [
  "linear-gradient(135deg, #c2776c, #d29b7a)",
  "linear-gradient(135deg, #8a7035, #b59465)",
  "linear-gradient(135deg, #5a7a4f, #80a17d)",
  "linear-gradient(135deg, #5a8589, #82a9a6)",
  "linear-gradient(135deg, #8094b5, #6b81a8)",
  "linear-gradient(135deg, #9b80b5, #b09bc7)",
]

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useGetProfileQuery()
  const { data: stats } = useGetProfileStatsQuery()
  const [getPlaylists, { data: playlists }] = useLazyGetPlaylistsQuery()
  const { data: ownSongs } = useGetSongsQuery({ offset: 0, limit: 50, owned: true })
  const { isPremium, currentPlan } = useSubscription()
  const [logout] = useLogoutMutation()
  const [activeTab, setActiveTab] = useState<ProfileTab>("playlists")

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 20 })
  }, [getPlaylists])

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      localStorage.clear()
      navigate("/auth")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading) {
    return (
      <PageLayout className="text-app-text-muted">
        {t("common.loading")}
      </PageLayout>
    )
  }

  const playlistsList = playlists ?? []
  const songsList = ownSongs ?? []

  const tabs: { key: ProfileTab; label: string; count: number }[] = [
    { key: "playlists", label: t("profile.tabs.playlists"), count: playlistsList.length },
    { key: "songs", label: t("profile.tabs.mySongs"), count: songsList.length },
    { key: "activity", label: t("profile.tabs.activity"), count: 0 },
  ]

  return (
    <>
      <Helmet>
        <title>{t("pageTitles.profile")}</title>
      </Helmet>
      <div className="bg-app-base text-app-text">
        <PageLayout padded={false} className="max-w-5xl mx-auto py-10">
          <header className="flex items-start gap-6 flex-wrap">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-neutral-200 relative shrink-0">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-full h-full" style={{ background: GRADIENTS[0] }} />
                  <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_2px,transparent_2px_8px)] rounded-full" />
                </>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <span className={classNames(PAGE_LABEL_BASE, "text-app-text-muted")}>
                {t("profile.profile")}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight truncate text-app-text">
                {profile?.username ?? "Unknown"}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {isPremium && (
                  <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-bold tracking-wider rounded-full uppercase">
                    {currentPlan}
                  </span>
                )}
                <span className="text-app-text-soft text-sm">
                  {playlistsList.length} {t("profile.tabs.playlists").toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/profile/edit")}
                className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-app-elev border border-app-line text-app-text font-semibold text-sm hover:bg-app-soft transition cursor-pointer"
              >
                {t("profile.editProfile")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="w-11 h-11 grid place-items-center rounded-full bg-app-elev border border-app-line text-app-text-soft hover:bg-app-soft transition cursor-pointer"
                aria-label="Settings"
              >
                <IoSettingsSharp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-11 h-11 grid place-items-center rounded-full bg-app-elev border border-app-line text-brand-500 hover:bg-app-soft transition cursor-pointer"
                aria-label="Logout"
              >
                <IoLogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard value={String(stats?.listeningsCount ?? 0)} label="Songs listened" highlight />
            <StatCard value="47h" label="This month" />
            <StatCard value={String(stats?.dislikedCount ?? 0)} label="Disliked" />
          </div>

          <div className="mt-10 border-b border-app-line">
            <div className="flex items-end gap-6 flex-wrap">
              {tabs.map((tab) => {
                const active = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={classNames(
                      "pb-3 flex items-baseline gap-2 transition-colors whitespace-nowrap cursor-pointer relative",
                      active ? "text-app-text" : "text-app-text-muted hover:text-app-text-soft"
                    )}
                  >
                    <span className="font-semibold">{tab.label}</span>
                    <span className={classNames("text-xs", active ? "text-app-text-muted" : "text-app-text-muted opacity-70")}>
                      {tab.count}
                    </span>
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "playlists" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {playlistsList.length === 0 ? (
                  <p className="col-span-full text-app-text-muted text-sm py-8 text-center">
                    {t("profile.noPlaylistsYet")}
                  </p>
                ) : (
                  playlistsList.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/playlist/${p.id}`)}
                      className="text-left flex flex-col gap-3 cursor-pointer group"
                    >
                      <div
                        className="aspect-[3/2] w-full rounded-xl overflow-hidden relative shadow-sm"
                        style={!p.image_url ? { background: GRADIENTS[idx % GRADIENTS.length] } : undefined}
                      >
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_2px,transparent_2px_8px)]" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold truncate text-app-text">{p.title}</p>
                        <p className="text-xs text-app-text-muted">
                          {p.songs?.length ?? 0} songs
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {activeTab === "songs" && (
              <>
                <div className="flex items-center justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => navigate("/songs/new")}
                    className={classNames(BRAND_BUTTON_BASE, "inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full")}
                  >
                    <span className="text-lg leading-none">+</span> {t("mySongs.createSong")}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {songsList.length === 0 ? (
                    <p className="col-span-full text-app-text-muted text-sm py-8 text-center">
                      {t("mySongs.noSongs")}
                    </p>
                  ) : (
                    songsList.map((song, idx) => (
                      <button
                        key={song.id}
                        onClick={() => navigate(`/songs/${song.id}/edit`)}
                        className="text-left flex flex-col gap-3 cursor-pointer group"
                      >
                        <div
                          className="aspect-square w-full rounded-xl overflow-hidden relative shadow-sm"
                          style={!song.image_url ? { background: GRADIENTS[idx % GRADIENTS.length] } : undefined}
                        >
                          {song.image_url ? (
                            <img src={song.image_url} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_2px,transparent_2px_8px)]" />
                          )}
                        </div>
                        <p className="font-semibold truncate text-app-text">{song.title}</p>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "activity" && (
              <p className="text-app-text-muted text-sm py-8 text-center">No recent activity.</p>
            )}
          </div>
        </PageLayout>
      </div>
    </>
  )
}

export default Profile

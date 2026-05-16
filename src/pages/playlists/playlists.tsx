import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { HiOutlineQueueList } from "react-icons/hi2";
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import StripedCover from "../../components/striped-cover/striped-cover";
import PageLayout from "../../components/page-layout/page-layout";
import EmptyState from "../../components/empty-state/empty-state";
import SearchInput from "../../components/search-input/search-input";

const Playlists = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [getPlaylists, { data, error, isLoading }] = useLazyGetPlaylistsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 50, search: searchTerm || undefined });
  }, [searchTerm, getPlaylists]);

  const playlists = data || [];

  if (isLoading) {
    return (
      <PageLayout className="text-app-text">{t("playlists.loadingPlaylists")}</PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout className="text-brand-400">{t("playlists.failedToLoadPlaylists")}</PageLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("pageTitles.playlists")}</title>
      </Helmet>
      <PageLayout className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] tracking-[0.18em] font-semibold text-app-text-muted uppercase">
              {t("navigation.library")}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-app-text">
              {t("navigation.playlists")}
            </h1>
          </div>
          <button
            onClick={() => navigate("/playlists/new")}
            className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
          >
            <IoAdd className="w-5 h-5" /> {t("common.create")}
          </button>
        </div>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("playlists.searchPlaylists")}
          className="max-w-md"
        />

        {playlists.length === 0 ? (
          <EmptyState
            icon={<HiOutlineQueueList className="w-8 h-8" />}
            title={t("playlists.noPlaylists")}
            actions={
              <button
                onClick={() => navigate("/playlists/new")}
                className="px-6 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
              >
                {t("common.create")}
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="group flex flex-col gap-3 text-left bg-app-soft hover:bg-app-soft-2 border border-app-line rounded-xl p-3 transition cursor-pointer"
              >
                <StripedCover
                  src={playlist.image_url}
                  alt={playlist.title}
                  seed={playlist.id}
                  rounded="rounded-md"
                  className="aspect-square w-full shadow-lg"
                />
                <div className="px-1">
                  <p className="text-app-text font-semibold truncate">{playlist.title}</p>
                  <p className="text-xs text-app-text-muted truncate">
                    {playlist.is_public ? "Публічний" : "Приватний"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default Playlists;

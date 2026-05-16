import { useState, useEffect } from "react";
import { IoSearch, IoAdd } from "react-icons/io5";
import { HiOutlineQueueList } from "react-icons/hi2";
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import StripedCover from "../../components/striped-cover/striped-cover";

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
      <div className="px-6 md:px-10 py-8 text-app-text">{t("playlists.loadingPlaylists")}</div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 py-8 text-brand-400">{t("playlists.failedToLoadPlaylists")}</div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("pageTitles.playlists")}</title>
      </Helmet>
      <div className="px-6 md:px-10 pt-8 pb-10 flex flex-col gap-6">
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

        <div className="relative max-w-md">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-muted" />
          <input
            type="text"
            placeholder={t("playlists.searchPlaylists")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-app-soft border border-app-line text-app-text placeholder:text-app-text-muted focus:outline-none focus:border-app-line transition-colors"
          />
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 grid place-items-center rounded-full bg-app-soft mb-2">
              <HiOutlineQueueList className="text-app-text-muted w-8 h-8" />
            </div>
            <p className="text-app-text text-xl font-semibold">
              {t("playlists.noPlaylists")}
            </p>
            <button
              onClick={() => navigate("/playlists/new")}
              className="mt-2 px-6 h-11 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
            >
              {t("common.create")}
            </button>
          </div>
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
      </div>
    </>
  );
};

export default Playlists;

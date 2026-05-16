import { useMemo } from "react";
import { MdFavorite, MdPlayArrow } from "react-icons/md";
import { CiShuffle } from "react-icons/ci";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { useNavigate } from "react-router";
import classNames from "classnames";
import Song from "../../components/song/song";
import List from "../../components/list/list";
import PageLayout from "../../components/page-layout/page-layout";
import PageHeader from "../../components/page-header/page-header";
import EmptyState from "../../components/empty-state/empty-state";
import { useGetFavoriteSongsQuery } from "../../store/api/songs.api";
import { useAudio } from "../../context/audio-context";
import { formatDuration } from "../../utils/format";
import { BRAND_BUTTON_BASE } from "../../utils/tailwind-classes";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Favorites = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: favorites, isLoading, error } = useGetFavoriteSongsQuery();
  const audio = useAudio();

  const totalDuration = useMemo(() => {
    const totalSeconds = favorites?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) ?? 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const min = t('favorites.unitMin');
    const hr = t('favorites.unitHour');
    return hours > 0 ? `${hours} ${hr} ${minutes} ${min}` : `${minutes} ${min}`;
  }, [favorites, t]);

  const handlePlayAll = () => {
    if (!favorites?.length) return;
    const queue = favorites.map((song, index) => ({ song, index, isActive: index > 0 }));
    audio.setQueue(queue);
    audio.setCurrentIndex(0);
    audio.setCurrentPlaylist("favorites");
    audio.setPlayMode("normal");
    audio.playSong(favorites[0]);
    audio.setPlaying(true);
  };

  const handleShuffle = () => {
    if (!favorites?.length) return;
    audio.setPlayMode("shuffle");
    handlePlayAll();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-app-text text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-brand-400 text-lg">{t('home.loadingError')}</div>
      </div>
    );
  }

  const isEmpty = !favorites || favorites.length === 0;

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.favorites')}</title>
      </Helmet>
      <div className="flex flex-col">
        <PageHeader
          gradientClassName="bg-gradient-to-b from-fuchsia-900/40 via-purple-900/20 to-transparent"
          icon={
            <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 to-purple-700 grid place-items-center">
              <MdFavorite className="text-white w-20 h-20" />
            </div>
          }
          eyebrow={t('favorites.playlist')}
          title={t('favorites.title')}
          meta={
            <>
              {favorites?.length ?? 0} {favorites?.length === 1 ? t('common.song') : t('common.songs')} · {totalDuration}
            </>
          }
          actions={
            <>
              <button
                onClick={handlePlayAll}
                disabled={isEmpty}
                className="w-14 h-14 rounded-full bg-brand-500 shadow-[0_0_24px_-2px_rgba(239,54,54,0.7)] grid place-items-center text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label={t('common.play')}
              >
                <MdPlayArrow className="text-3xl" />
              </button>
              <button
                onClick={handleShuffle}
                disabled={isEmpty}
                className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft disabled:opacity-50 transition cursor-pointer"
                aria-label="Shuffle"
              >
                <CiShuffle className="w-6 h-6" />
              </button>
              <button
                className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft transition cursor-pointer"
                aria-label="More"
              >
                <HiOutlineEllipsisHorizontal className="w-6 h-6" />
              </button>
            </>
          }
        />

        <PageLayout padded={false} className="pb-10">
          {!isEmpty ? (
            <List gap={1}>
              {favorites!.map((song, index) => {
                const isActive = audio.currentSong?.id === song.id && audio.currentPlaylist === "favorites";

                return (
                  <Song
                    key={song.id}
                    title={song.title}
                    image={song.image_url ?? ""}
                    variant="expanded"
                    duration={formatDuration(song.duration_seconds)}
                    song={song}
                    isActive={isActive}
                    onClick={() => {
                      const queue = favorites!.map((s, i) => ({ song: s, index: i, isActive: i > index }));
                      audio.setQueue(queue);
                      audio.setCurrentPlaylist("favorites");
                      audio.playFromQueue(index);
                    }}
                  />
                );
              })}
            </List>
          ) : (
            <EmptyState
              icon={<MdFavorite className="w-8 h-8" />}
              title={t('favorites.emptyTitle')}
              description={
                <>
                  {t('favorites.emptyHintBefore')}
                  <MdFavorite className="inline text-brand-500 align-middle mx-1" />
                  {t('favorites.emptyHintAfter')}
                </>
              }
              actions={
                <>
                  <button
                    onClick={() => navigate("/search")}
                    className={classNames(BRAND_BUTTON_BASE, "px-6 h-11 rounded-full")}
                  >
                    {t('favorites.findMusic')}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 h-11 rounded-full border border-app-line text-app-text font-semibold hover:bg-app-soft transition cursor-pointer"
                  >
                    {t('favorites.browseTops')}
                  </button>
                </>
              }
            />
          )}
        </PageLayout>
      </div>
    </>
  );
};

export default Favorites;

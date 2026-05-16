import { useParams, useNavigate } from "react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdPlayArrow, MdPause } from "react-icons/md";
import { CiShuffle } from "react-icons/ci";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import List from "../../components/list/list";
import Song from "../../components/song/song";
import StripedCover from "../../components/striped-cover/striped-cover";
import { useGetPlaylistQuery } from "../../store/api/playlist.api";
import { formatDuration } from "../../utils/format";
import { useAudio } from "../../context/audio-context";
import { Helmet } from "react-helmet-async";

const Playlist = () => {
  const audio = useAudio();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { playlistId } = useParams<{ playlistId: string }>();

  const { data: playlist, isLoading: isPlaylistLoading, error: playlistError } = useGetPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  const isPlayingThisPlaylist = !!(playlist?.songs && playlist.songs.length > 0 &&
    playlist.songs.some(song => song.id === audio.currentSong?.id) &&
    audio.currentPlaylist === playlistId);
  const isPlaying = isPlayingThisPlaylist && audio.playing;

  const totals = useMemo(() => {
    const totalSeconds = playlist?.songs?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const duration = hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return { duration };
  }, [playlist]);

  const handlePlay = () => {
    if (!playlist?.songs || playlist.songs.length === 0) return;
    if (isPlayingThisPlaylist) {
      audio.toggle();
    } else {
      audio.setQueue(playlist.songs.map((song, index) => ({ song, index, isActive: index > 0 })));
      audio.setCurrentIndex(0);
      audio.setCurrentPlaylist(playlistId!);
      audio.setCurrentSong(playlist.songs[0]);
      audio.play();
    }
  };

  const handleShuffle = () => {
    if (!playlist?.songs?.length) return;
    audio.setPlayMode("shuffle");
    handlePlay();
  };

  if (isPlaylistLoading) {
    return (
      <>
        <Helmet>
          <title>{t('common.loading')}</title>
        </Helmet>
        <div className="px-6 md:px-10 pt-8 pb-10 text-app-text">{t('common.loading')}</div>
      </>
    );
  }

  if (playlistError || !playlist) {
    return (
      <>
        <Helmet>
          <title>{t('navigation.playlists')}</title>
        </Helmet>
        <div className="px-6 md:px-10 pt-8 pb-10 text-brand-400">
          {t('playlist.failedToLoad')}
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{playlist.title}</title>
      </Helmet>
      <div className="flex flex-col">
        <header className="relative px-6 md:px-10 pt-8 pb-6 bg-gradient-to-b from-indigo-900/40 via-blue-900/20 to-transparent">
          <div className="flex items-end gap-6 flex-wrap">
            <StripedCover
              src={playlist.image_url}
              alt={playlist.title}
              seed={playlist.id}
              rounded="rounded-xl"
              className="w-44 h-44 md:w-52 md:h-52 shrink-0 shadow-2xl"
            />
            <div className="flex flex-col gap-3 min-w-0 pb-2">
              <span className="text-[11px] tracking-[0.18em] font-semibold text-app-text-soft uppercase">
                {t('navigation.playlists')}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-app-text truncate">
                {playlist.title}
              </h1>
              <p className="text-sm text-app-text-soft">
                {playlist.songs?.length ?? 0} {(playlist.songs?.length ?? 0) === 1 ? t('common.song') : t('common.songs')} · {totals.duration}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePlay}
              disabled={!playlist.songs || playlist.songs.length === 0}
              className="w-14 h-14 rounded-full bg-brand-500 shadow-[0_0_24px_-2px_rgba(239,54,54,0.7)] grid place-items-center text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label={t('common.play')}
            >
              {isPlaying ? <MdPause className="text-3xl" /> : <MdPlayArrow className="text-3xl" />}
            </button>
            <button
              onClick={handleShuffle}
              disabled={!playlist.songs?.length}
              className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft disabled:opacity-50 transition cursor-pointer"
              aria-label="Shuffle"
            >
              <CiShuffle className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(`/playlists/${playlist.id}/edit`)}
              className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft transition cursor-pointer"
              aria-label="Edit"
            >
              <IoSettingsOutline className="w-5 h-5" />
            </button>
            <button
              className="w-10 h-10 grid place-items-center rounded-full text-app-text-soft hover:text-app-text hover:bg-app-soft transition cursor-pointer"
              aria-label="More"
            >
              <HiOutlineEllipsisHorizontal className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="px-6 md:px-10 pb-10">
          {playlist.songs && playlist.songs.length > 0 ? (
            <List gap={1}>
              {playlist.songs.map((song) => {
                const isActive = audio.currentSong?.id === song.id && audio.currentPlaylist === playlistId;
                return (
                  <Song
                    key={song.id}
                    title={song.title}
                    image={song.image_url || ""}
                    variant="expanded"
                    duration={formatDuration(song.duration_seconds)}
                    song={song}
                    isActive={isActive}
                    playlistId={playlist.id}
                    onClick={() => {
                      const songIndex = playlist.songs!.findIndex(s => s.id === song.id);
                      audio.setCurrentPlaylist(playlistId!);
                      audio.setQueue(playlist.songs!.map((s, idx) => ({ song: s, index: idx, isActive: idx > songIndex })));
                      audio.playFromQueue(songIndex);
                    }}
                  />
                );
              })}
            </List>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-app-text-muted text-lg">
                {t('playlist.empty')}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Playlist;

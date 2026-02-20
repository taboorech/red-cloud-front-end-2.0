import { useMemo } from "react";
import { MdFavorite, MdPlayArrow } from "react-icons/md";
import Song from "../../components/song/song";
import List from "../../components/list/list";
import { Button } from "../../components/button/button";
import { useGetFavoriteSongsQuery } from "../../store/api/songs.api";
import { useAudio } from "../../context/audio-context";
import { formatDuration } from "../../utils/format";

const Favorites = () => {
  const { data: favorites, isLoading, error } = useGetFavoriteSongsQuery();
  const audio = useAudio();

  const totalDuration = useMemo(() => {
    if (!favorites?.length) return "0 min";
    const totalSeconds = favorites.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  }, [favorites]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading favorites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">Error loading favorites</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="bg-gradient-to-b from-pink-900/40 to-black p-6 rounded-md flex items-end gap-6">
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Playlist</span>
          <h1 className="text-4xl font-bold text-white truncate">Favorite Songs</h1>
          <p className="text-sm text-gray-400">
            {favorites?.length ?? 0} {favorites?.length === 1 ? "song" : "songs"} · {totalDuration}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Button
              variant="snow"
              size="md"
              rounded="full"
              leftIcon={<MdPlayArrow className="text-xl" />}
              onClick={handlePlayAll}
              disabled={!favorites?.length}
            >
              Play
            </Button>
          </div>
        </div>
      </div>

      {/* Song list */}
      <div className="bg-black p-4 rounded-md flex-1 min-h-0 overflow-hidden">
        {favorites && favorites.length > 0 ? (
          <List gap={1}>
            {favorites.map((song, index) => {
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
                    const queue = favorites.map((s, i) => ({ song: s, index: i, isActive: i > index }));
                    audio.setQueue(queue);
                    audio.setCurrentPlaylist("favorites");
                    audio.playFromQueue(index);
                  }}
                />
              );
            })}
          </List>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <MdFavorite className="text-gray-600 text-5xl" />
            <p className="text-gray-400 text-lg font-medium">No favorites yet</p>
            <p className="text-gray-500 text-sm">Songs you like will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAudio } from "../../../context/audio-context";
import { useToggleFavoriteSongMutation } from "../../../store/api/songs.api";
import StripedCover from "../../striped-cover/striped-cover";

const CurrentSong = () => {
  const { currentSong, setCurrentSong } = useAudio();
  const [toggleFavorite] = useToggleFavoriteSongMutation();

  if (!currentSong) {
    return <div className="flex items-center gap-3 min-w-0 w-[220px]" aria-hidden />;
  }

  const handleToggleFavorite = async () => {
    const previous = currentSong.is_favorite;
    setCurrentSong({ ...currentSong, is_favorite: !previous });
    try {
      await toggleFavorite(String(currentSong.id)).unwrap();
    } catch {
      setCurrentSong({ ...currentSong, is_favorite: previous });
    }
  };

  return (
    <div className="flex items-center gap-3 min-w-0 w-full">
      <StripedCover
        src={currentSong.image_url}
        alt={currentSong.title}
        seed={currentSong.id}
        rounded="rounded-md"
        className="w-14 h-14 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-app-text font-medium truncate">
          {currentSong.title}
        </div>
        <div className="text-xs text-app-text-muted truncate">
          {currentSong.authors?.[0]?.name ?? currentSong.authors?.[0]?.user?.username ?? ""}
        </div>
      </div>
      <button
        type="button"
        onClick={handleToggleFavorite}
        className="w-8 h-8 grid place-items-center rounded-full text-brand-500 hover:bg-app-soft transition-colors cursor-pointer shrink-0"
        aria-label="Like"
      >
        {currentSong.is_favorite ? (
          <FaHeart className="w-4 h-4" />
        ) : (
          <FaRegHeart className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default CurrentSong;

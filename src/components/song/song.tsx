import classNames from "classnames";
import { BsSoundwave } from "react-icons/bs";
import { useAudio } from "../../context/audio-context";
import type { Song as SongType } from "../../types/song.types";

type SongVariant = "small" | "expanded";

interface SongProps {
  title: string;
  image: string;
  duration?: string;
  variant?: SongVariant;
  onClick?: () => void;
  song?: SongType;
  isActive?: boolean;
}

const Song = ({
  title,
  image,
  duration,
  variant = "small",
  onClick,
  song,
  isActive = false
}: SongProps) => {
  const audio = useAudio()
  
  const handleClick = () => {
    if(song) {
      audio.playSong(song)
    }

    if (onClick) {
      onClick();
    }
  }

  return (
    <div
      onClick={handleClick}
      className={classNames(
        "group cursor-pointer select-none transition relative",
        variant === "small"
          ? "flex flex-col items-center w-full"
          : "flex items-center gap-3 w-full"
      )}
    >
      {isActive && variant === "expanded" && (
        <BsSoundwave className="text-green-400 text-2xl flex-shrink-0 mr-2" />
      )}
      <span className="relative">
        { isActive && variant === "small" && (
          <div className="absolute inset-0 bg-black/50">
            <BsSoundwave className="text-green-400 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
        <img
          src={image}
          alt={title}
          className={classNames(
            "object-cover rounded-md bg-gray-800",
            variant === "small"
              ? "w-full aspect-square"
              : "w-14 h-14"
          )}
        />
      </span>

      <div
        className={classNames(
          variant === "small"
            ? "mt-2 text-center"
            : "flex-1 min-w-0 flex items-center gap-2"
        )}
      >
        <p className="text-white text-sm font-medium truncate">
          {title}
        </p>
      </div>

      {variant === "expanded" && duration && (
        <span className="text-gray-400 text-xs tabular-nums">
          {duration}
        </span>
      )}
    </div>
  );
};

export default Song;
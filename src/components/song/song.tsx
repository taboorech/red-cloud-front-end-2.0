import classNames from "classnames";
import { BsSoundwave } from "react-icons/bs";
import { useAudio } from "../../context/audio-context";
import type { Song as SongType } from "../../types/song.types";
import { useContextMenu } from "../../hooks/use-context-menu";
import SongContextMenu from "../context-menu/menus/song-context-menu";
import StripedCover from "../striped-cover/striped-cover";

type SongVariant = "small" | "expanded";

interface SongProps {
  title: string;
  image: string;
  duration?: string;
  variant?: SongVariant;
  onClick?: () => void;
  song?: SongType;
  isActive?: boolean;
  playlistId?: number;
  onRemoveFromPlaylist?: (songId: string) => void;
}

const Song = ({
  title,
  image,
  duration,
  variant = "small",
  onClick,
  song,
  isActive = false,
  playlistId,
  onRemoveFromPlaylist,
}: SongProps) => {
  const audio = useAudio();
  const contextMenu = useContextMenu();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (song) {
      audio.playSong(song);
      audio.setPlaying(true);
    }
  };

  const artist =
    song?.authors?.[0]?.name ?? song?.authors?.[0]?.user?.username ?? "";

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={(e) => song && contextMenu.open(e)}
        className={classNames(
          "group cursor-pointer select-none transition relative",
          variant === "small"
            ? "flex flex-col items-stretch w-full"
            : "flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-app-soft",
        )}
      >
        {isActive && variant === "expanded" && (
          <BsSoundwave className="text-brand-400 text-2xl flex-shrink-0" />
        )}
        <StripedCover
          src={image || null}
          alt={title}
          seed={song?.id ?? title}
          rounded={variant === "small" ? "rounded-lg" : "rounded-md"}
          className={classNames(
            variant === "small" ? "w-full aspect-square" : "w-12 h-12 shrink-0",
          )}
        >
          {isActive && variant === "small" && (
            <div className="absolute inset-0 bg-black/50 grid place-items-center">
              <BsSoundwave className="text-brand-400 text-3xl" />
            </div>
          )}
        </StripedCover>

        <div
          className={classNames(
            variant === "small"
              ? "mt-2"
              : "flex-1 min-w-0",
          )}
        >
          <p
            className={classNames(
              "text-sm font-semibold truncate",
              isActive ? "text-brand-400" : "text-app-text",
            )}
          >
            {title}
          </p>
          {variant === "expanded" && artist && (
            <p className="text-xs text-neutral-400 truncate">{artist}</p>
          )}
        </div>

        {variant === "expanded" && duration && (
          <span className="text-neutral-400 text-xs tabular-nums ml-auto pl-2">
            {duration}
          </span>
        )}
      </div>

      {contextMenu.isOpen && song && (
        <SongContextMenu
          song={song}
          position={contextMenu.position}
          onClose={contextMenu.close}
          playlistId={playlistId}
          onRemoveFromPlaylist={onRemoveFromPlaylist}
        />
      )}
    </>
  );
};

export default Song;

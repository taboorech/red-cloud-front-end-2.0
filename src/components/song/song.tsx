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

  const contextMenuNode = contextMenu.isOpen && song && (
    <SongContextMenu
      song={song}
      position={contextMenu.position}
      onClose={contextMenu.close}
      playlistId={playlistId}
      onRemoveFromPlaylist={onRemoveFromPlaylist}
    />
  );

  if (variant === "expanded") {
    return (
      <>
        <div
          onClick={handleClick}
          onContextMenu={(e) => song && contextMenu.open(e)}
          className="group cursor-pointer select-none flex items-center w-full px-2 py-2 rounded-lg hover:bg-app-soft transition relative"
        >
          <BsSoundwave
            aria-hidden
            className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-400 text-2xl pointer-events-none z-0"
          />
          <div
            className={classNames(
              "flex items-center gap-3 flex-1 min-w-0 transition-transform duration-300 ease-out relative z-10",
              isActive ? "translate-x-8" : "translate-x-0"
            )}
          >
            <StripedCover
              src={image || null}
              alt={title}
              seed={song?.id ?? title}
              rounded="rounded-md"
              className="w-12 h-12 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p
                className={classNames(
                  "text-sm font-semibold truncate transition-colors",
                  isActive ? "text-brand-400" : "text-app-text"
                )}
              >
                {title}
              </p>
              {artist && (
                <p className="text-xs text-app-text-muted truncate">{artist}</p>
              )}
            </div>
          </div>
          {duration && (
            <span className="text-app-text-muted text-xs tabular-nums ml-auto pl-2 relative z-10">
              {duration}
            </span>
          )}
        </div>
        {contextMenuNode}
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={(e) => song && contextMenu.open(e)}
        className="group cursor-pointer select-none flex flex-col items-stretch w-full relative transition"
      >
        <StripedCover
          src={image || null}
          alt={title}
          seed={song?.id ?? title}
          rounded="rounded-lg"
          className="w-full aspect-square"
        >
          {isActive && (
            <div className="absolute inset-0 bg-black/50 grid place-items-center">
              <BsSoundwave className="text-brand-400 text-3xl" />
            </div>
          )}
        </StripedCover>
        <div className="mt-2">
          <p
            className={classNames(
              "text-sm font-semibold truncate",
              isActive ? "text-brand-400" : "text-app-text"
            )}
          >
            {title}
          </p>
        </div>
      </div>
      {contextMenuNode}
    </>
  );
};

export default Song;

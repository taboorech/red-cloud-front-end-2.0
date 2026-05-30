import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { MdFavoriteBorder, MdQueueMusic, MdPerson, MdMusicNote, MdPlaylistAdd, MdShare, MdHeadphones, MdDownloadForOffline, MdDownloadDone } from "react-icons/md";
import ContextMenu, { type ContextMenuPosition } from "../context-menu";
import ContextMenuItem from "../context-menu-item";
import ContextMenuSubmenu from "../context-menu-submenu";
import ContextMenuDivider from "../context-menu-divider";
import type { Song } from "../../../types/song.types";
import { useToggleFavoriteSongMutation, useGetFavoriteSongsQuery } from "../../../store/api/songs.api";
import { PiHeartBreakFill } from "react-icons/pi";
import { useLazyGetPlaylistsQuery } from "../../../store/api/playlist.api";
import { useAudio } from "../../../context/audio-context";
import { useFriends } from "../../../hooks/use-friends";
import { useDownloadAction, useDownloadedIds } from "../../../hooks/use-downloads";
import { useOnlineStatus } from "../../../hooks/use-online-status";

interface SongContextMenuProps {
  song: Song;
  position: ContextMenuPosition;
  onClose: () => void;
  playlistId?: number;
  onRemoveFromPlaylist?: (songId: string) => void;
}

const SongContextMenu = ({ song, position, onClose, playlistId, onRemoveFromPlaylist }: SongContextMenuProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const audio = useAudio();
  const isOnline = useOnlineStatus();
  const [toggleFavorite] = useToggleFavoriteSongMutation();
  const { data: favorites } = useGetFavoriteSongsQuery();
  const [getPlaylists, { data: playlists }] = useLazyGetPlaylistsQuery();
  const { friends } = useFriends();
  const downloadedIds = useDownloadedIds();
  const { download, remove, isPending } = useDownloadAction();

  const isFavorite = favorites?.some((s) => s.id === song.id) ?? false;
  const isDownloaded = downloadedIds.has(song.id);
  const isDownloading = isPending(song.id);

  const handleToggleDownload = async () => {
    if (isDownloaded) {
      await remove(song.id);
    } else {
      await download(song);
    }
    onClose();
  };

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 50 });
  }, [getPlaylists]);

  const handleAddToFavorites = () => {
    toggleFavorite(song.id);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/song/${song.id}`);
    onClose();
  };

  const handleAddToQueue = () => {
    const newItem = {
      song,
      index: audio.queue.length,
      isActive: true,
    };
    audio.setQueue([...audio.queue, newItem]);
    onClose();
  };

  const handleAuthorInfo = () => {
    const primaryAuthor = song.authors?.[0];
    if (primaryAuthor?.user_id) {
      navigate(`/profile/${primaryAuthor.user_id}`);
    }
    onClose();
  };

  const handleSongInfo = () => {
    navigate(`/song/${song.id}`);
    onClose();
  };

  const handleRemoveFromPlaylist = () => {
    if (onRemoveFromPlaylist) {
      onRemoveFromPlaylist(song.id);
    }
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuSubmenu label="Add to playlist" icon={<MdPlaylistAdd />}>
        {playlists && playlists.length > 0 ? (
          playlists.map((pl) => (
            <ContextMenuItem
              key={pl.id}
              label={pl.title}
              onClick={() => {
                onClose();
              }}
            />
          ))
        ) : (
          <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500">No playlists</div>
        )}
      </ContextMenuSubmenu>
      <ContextMenuItem
        label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        icon={isFavorite ? <PiHeartBreakFill /> : <MdFavoriteBorder />}
        danger={isFavorite}
        onClick={handleAddToFavorites}
        disabled={!isOnline}
      />
      <ContextMenuItem
        label={
          isDownloading
            ? t('downloads.downloading')
            : isDownloaded
              ? t('downloads.remove')
              : t('downloads.download')
        }
        icon={isDownloaded ? <MdDownloadDone /> : <MdDownloadForOffline />}
        onClick={handleToggleDownload}
        disabled={isDownloading || (!isOnline && !isDownloaded)}
      />
      <ContextMenuSubmenu label="Share" icon={<MdShare />}>
        <ContextMenuItem label="Copy link" onClick={handleCopyLink} />
      </ContextMenuSubmenu>
      <ContextMenuItem label="Add to queue" icon={<MdQueueMusic />} onClick={handleAddToQueue} />
      <ContextMenuSubmenu label="Listen together" icon={<MdHeadphones />}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ContextMenuItem
              key={friend.id}
              label={friend.username}
              onClick={() => {
                onClose();
              }}
            />
          ))
        ) : (
          <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500">No friends online</div>
        )}
      </ContextMenuSubmenu>
      <ContextMenuItem label="Author info" icon={<MdPerson />} onClick={handleAuthorInfo} />
      <ContextMenuItem label="Song info" icon={<MdMusicNote />} onClick={handleSongInfo} />
      {playlistId && onRemoveFromPlaylist && (
        <>
          <ContextMenuDivider />
          <ContextMenuItem label="Remove from playlist" danger onClick={handleRemoveFromPlaylist} />
        </>
      )}
    </ContextMenu>
  );
};

export default SongContextMenu;

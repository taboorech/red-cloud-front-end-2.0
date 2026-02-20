import { useEffect } from "react";
import { useNavigate } from "react-router";
import { MdPlayArrow, MdQueueMusic, MdShare, MdHeadphones, MdPlaylistAdd, MdCreateNewFolder, MdInfo, MdEdit } from "react-icons/md";
import ContextMenu, { type ContextMenuPosition } from "../context-menu";
import ContextMenuItem from "../context-menu-item";
import ContextMenuSubmenu from "../context-menu-submenu";
import ContextMenuDivider from "../context-menu-divider";
import type { Playlist } from "../../../types/playlist.types";
import { useAudio } from "../../../context/audio-context";
import { useLazyGetPlaylistsQuery } from "../../../store/api/playlist.api";
import { useFriends } from "../../../hooks/use-friends";

interface PlaylistContextMenuProps {
  playlist: Playlist;
  position: ContextMenuPosition;
  onClose: () => void;
  onRemovePlaylist?: (playlistId: number) => void;
}

const PlaylistContextMenu = ({ playlist, position, onClose, onRemovePlaylist }: PlaylistContextMenuProps) => {
  const navigate = useNavigate();
  const audio = useAudio();
  const [getPlaylists, { data: playlists }] = useLazyGetPlaylistsQuery();
  const { friends } = useFriends();

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 50 });
  }, [getPlaylists]);

  const handlePlay = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const queueItems = playlist.songs.map((song, index) => ({
        song,
        index,
        isActive: index > 0,
      }));
      audio.setQueue(queueItems);
      audio.setCurrentIndex(0);
      audio.playSong(playlist.songs[0]);
      audio.setPlaying(true);
      audio.setCurrentPlaylist(String(playlist.id));
    }
    onClose();
  };

  const handleAddToQueue = () => {
    if (playlist.songs) {
      const currentLength = audio.queue.length;
      const newItems = playlist.songs.map((song, index) => ({
        song,
        index: currentLength + index,
        isActive: true,
      }));
      audio.setQueue([...audio.queue, ...newItems]);
    }
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/playlist/${playlist.id}`);
    onClose();
  };

  const handleInfo = () => {
    navigate(`/playlist/${playlist.id}`);
    onClose();
  };

  const handleEdit = () => {
    navigate(`/playlists/${playlist.id}/edit`);
    onClose();
  };

  const handleRemovePlaylist = () => {
    if (onRemovePlaylist) {
      onRemovePlaylist(playlist.id);
    }
    onClose();
  };

  return (
    <ContextMenu position={position} onClose={onClose}>
      <ContextMenuItem label="Play" icon={<MdPlayArrow />} onClick={handlePlay} />
      <ContextMenuItem label="Add to queue" icon={<MdQueueMusic />} onClick={handleAddToQueue} />
      <ContextMenuSubmenu label="Share" icon={<MdShare />}>
        <ContextMenuItem label="Copy link" onClick={handleCopyLink} />
      </ContextMenuSubmenu>
      <ContextMenuSubmenu label="Listen together" icon={<MdHeadphones />}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ContextMenuItem
              key={friend.id}
              label={friend.username}
              onClick={() => onClose()}
            />
          ))
        ) : (
          <div className="px-4 py-2 text-xs text-gray-500">No friends online</div>
        )}
      </ContextMenuSubmenu>
      <ContextMenuSubmenu label="Add to playlist" icon={<MdPlaylistAdd />}>
        {playlists && playlists.length > 0 ? (
          playlists.filter((pl) => pl.id !== playlist.id).map((pl) => (
            <ContextMenuItem
              key={pl.id}
              label={pl.title}
              onClick={() => onClose()}
            />
          ))
        ) : (
          <div className="px-4 py-2 text-xs text-gray-500">No playlists</div>
        )}
      </ContextMenuSubmenu>
      <ContextMenuSubmenu label="Add to folder" icon={<MdCreateNewFolder />}>
        <div className="px-4 py-2 text-xs text-gray-500">No folders</div>
      </ContextMenuSubmenu>
      <ContextMenuItem label="Info" icon={<MdInfo />} onClick={handleInfo} />
      <ContextMenuItem label="Edit" icon={<MdEdit />} onClick={handleEdit} />
      <ContextMenuDivider />
      <ContextMenuItem label="Remove playlist" danger onClick={handleRemovePlaylist} />
    </ContextMenu>
  );
};

export default PlaylistContextMenu;

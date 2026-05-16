import classNames from "classnames";
import { NavLink } from "react-router";
import { useContextMenu } from "../../hooks/use-context-menu";
import PlaylistContextMenu from "../context-menu/menus/playlist-context-menu";
import StripedCover from "../striped-cover/striped-cover";
import type { Playlist as PlaylistType } from "../../types/playlist.types";

interface PlaylistItemProps {
  id: number;
  title: string;
  image?: string | null;
}

const PlaylistItem = ({ id, title, image }: PlaylistItemProps) => {
  const contextMenu = useContextMenu();

  const playlistData: PlaylistType = {
    id,
    title,
    image_url: image ?? undefined,
    owner_id: 0,
    is_public: true,
    created_at: "",
    updated_at: "",
  };

  return (
    <>
      <NavLink
        to={`/playlist/${id}`}
        onContextMenu={contextMenu.open}
        className={({ isActive }) =>
          classNames(
            "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
            isActive ? "bg-app-soft" : "hover:bg-app-soft"
          )
        }
      >
        <StripedCover
          src={image}
          alt={title}
          seed={id}
          rounded="rounded-md"
          className="w-9 h-9 shrink-0"
        />
        <span className="text-[14px] text-app-text-soft truncate">{title}</span>
      </NavLink>

      {contextMenu.isOpen && (
        <PlaylistContextMenu
          playlist={playlistData}
          position={contextMenu.position}
          onClose={contextMenu.close}
        />
      )}
    </>
  );
};

export default PlaylistItem;

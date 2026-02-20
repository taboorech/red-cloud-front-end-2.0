import { useNavigate } from "react-router";
import { useContextMenu } from "../../../hooks/use-context-menu";
import PlaylistContextMenu from "../../context-menu/menus/playlist-context-menu";
import type { Playlist as PlaylistType } from "../../../types/playlist.types";

interface PlaylistProps {
  id: number;
  title: string;
  image?: string | null;
}

const Playlist = ({ id, title, image }: PlaylistProps) => {
  const navigate = useNavigate();
  const contextMenu = useContextMenu();

  const handleClick = () => {
    navigate(`/playlist/${id}`);
  };

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
      <div 
        className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
        onClick={handleClick}
        onContextMenu={contextMenu.open}
        title={title}
      >
        <img 
          src={image || ''} 
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {contextMenu.isOpen && (
        <PlaylistContextMenu
          playlist={playlistData}
          position={contextMenu.position}
          onClose={contextMenu.close}
        />
      )}
    </>
  );
}

export default Playlist;
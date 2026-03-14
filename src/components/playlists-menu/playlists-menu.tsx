import { IoAdd } from "react-icons/io5";
import Playlist from "./playlist/playlist";
import { IoIosSettings } from "react-icons/io";
import { Button } from "../button/button";
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PlaylistMenuTitle from "./playlist-menu-title/playlist-menu-title";

const PlaylistsMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [getPlaylists, { data: playlists, isLoading }] = useLazyGetPlaylistsQuery();

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 20 });
  }, [getPlaylists]);

  const handleCreatePlaylist = () => {
    navigate('/playlists/new');
  };

  const handleSettings = () => {
    navigate('/playlists');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <PlaylistMenuTitle/>

        <div className="relative flex bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 h-16 w-full rounded-md gap-2 items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm">{t('playlists.loadingPlaylists')}</div>
        </div>
      </div>
    );
  }

  const playlistsCount = playlists?.length || 0;

  return (
    <div className="flex flex-col">
      <PlaylistMenuTitle/>

      <div className="relative flex bg-white dark:bg-black border border-gray-200 border-t-0 dark:border-white/10 p-2 h-16 w-full rounded-b-md gap-2 items-center">
      { playlistsCount !== 0 && (
        <div className="absolute left-1/2 top-full -translate-y-1/2 -translate-x-1/2 z-10 flex gap-2">
          <Button variant="snow" size="circle" rounded="full" onClick={handleCreatePlaylist}>
            <IoAdd className="w-4 h-4" />
          </Button>

          <Button variant="snow" size="circle" rounded="full" onClick={handleSettings}>
            <IoIosSettings className="w-4 h-4" />
          </Button>
        </div>
      )}

      { playlistsCount === 0 ? (
        <div className="flex justify-center items-center w-full h-full">
          <Button variant="snow" size="md" rounded="full" onClick={handleCreatePlaylist}>
            Create
          </Button>
        </div>
      ) : (
        <div className="flex overflow-x-hidden hover:overflow-x-auto h-full gap-2 w-full">
          {playlists?.map((playlist) => (
            <Playlist 
              key={playlist.id} 
              id={playlist.id}
              title={playlist.title}
              image={playlist.image_url}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default PlaylistsMenu;
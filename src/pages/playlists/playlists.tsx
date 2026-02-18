import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import List from "../../components/list/list";
import Song from "../../components/song/song";
import Input from "../../components/input/input";
import { useLazyGetPlaylistsQuery } from "../../store/api/playlist.api";
import { useNavigate } from "react-router";

const Playlists = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [getPlaylists, { data, error, isLoading }] = useLazyGetPlaylistsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getPlaylists({ offset: 0, limit: 20, search: searchTerm || undefined, onlyPublic: true });
  }, [searchTerm, getPlaylists]);

  const playlists = data || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="bg-black p-4 rounded-md h-full flex items-center justify-center">
        <div className="text-white text-lg">Loading playlists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black p-4 rounded-md h-full flex items-center justify-center">
        <div className="text-red-400 text-lg">Failed to load playlists</div>
      </div>
    );
  }

  return (
    <div className="bg-black p-4 rounded-md h-full flex flex-col">
      {/* Search Bar */}
      <div className="mb-4 relative flex-shrink-0">
        <Input
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <List gap={3}>
          {playlists.map((playlist) => (
            <Song 
              key={playlist.id}
              title={playlist.title} 
              variant="expanded"
              image={playlist.image_url || ''}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            />
          ))}
        </List>
      </div>
    </div>
  );
}

export default Playlists;
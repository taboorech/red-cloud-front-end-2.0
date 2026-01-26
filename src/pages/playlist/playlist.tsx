import { useParams } from "react-router";
import { faker } from "@faker-js/faker";
import List from "../../components/list/list";
import Song from "../../components/song/song";
import Banner from "./banner/banner";
import { useGetPlaylistQuery } from "../../store/api/playlist.api";

const Playlist = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  
  const { 
    data: playlist, 
    isLoading: isPlaylistLoading, 
    error: playlistError 
  } = useGetPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  const tmpImage = faker.image.url();  

  if (isPlaylistLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading playlist...</div>
      </div>
    );
  }

  if (playlistError || !playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">
          Failed to load playlist
          <div className="text-sm mt-2">
            {playlistError && typeof playlistError === 'object' && 'data' in playlistError
              ? (playlistError as { data?: { message?: string } }).data?.message || 'Unknown error occurred'
              : 'Unknown error occurred'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="bg-black p-4 rounded-md">
        <Banner playlist={playlist} />
      </div>
      <div className="bg-black p-4 rounded-md flex-1 min-h-0 overflow-hidden">
        <List gap={3}>
          { Array.from({ length: 10 }).map((_, index) => (
            <Song
              key={index}
              title={`Song Title ${index + 1}`}
              image={tmpImage}
              variant="expanded"
              duration="3:45"
            />
          )) }
        </List>
      </div>
    </div>
  )
}

export default Playlist;
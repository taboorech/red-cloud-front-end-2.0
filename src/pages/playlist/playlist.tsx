import { useParams } from "react-router";
import List from "../../components/list/list";
import Song from "../../components/song/song";
import Banner from "./banner/banner";
import { useGetPlaylistQuery } from "../../store/api/playlist.api";
import { formatDuration } from "../../utils/format";
import { useAudio } from "../../context/audio-context";
import { Helmet } from "react-helmet-async";

const Playlist = () => {
  const audio = useAudio();
  const { playlistId } = useParams<{ playlistId: string }>();
  
  const { 
    data: playlist, 
    isLoading: isPlaylistLoading, 
    error: playlistError 
  } = useGetPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  if (isPlaylistLoading) {
    return (
      <>
        <Helmet>
          <title>Loading playlist...</title>
        </Helmet>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-lg">Loading playlist...</div>
        </div>
      </>
    );
  }

  if (playlistError || !playlist) {
    return (
      <>
        <Helmet>
          <title>Playlist</title>
        </Helmet>
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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{playlist.title || 'Playlist'}</title>
      </Helmet>
      <div className="flex flex-col gap-5 h-full">
        <div className="bg-white dark:bg-black p-4 rounded-md border border-gray-200 dark:border-transparent">
          <Banner playlist={playlist} />
        </div>
        <div className="bg-white dark:bg-black p-4 rounded-md border border-gray-200 dark:border-transparent flex-1 min-h-0 overflow-hidden">
          {playlist.songs && playlist.songs.length > 0 ? (
            <List gap={3}>
              {playlist.songs.map((song) => {
                const isActive = audio.currentSong?.id === song.id && (audio.currentPlaylist === playlistId);
                
                return (
                  <Song
                    key={song.id}
                    title={song.title}
                    image={song.image_url || ""}
                    variant="expanded"
                    duration={formatDuration(song.duration_seconds)}
                    song={song}
                    isActive={isActive}
                    onClick={() => {
                      if(!playlist.songs || playlist.songs.length === 0) return;

                      const songIndex = playlist.songs.findIndex(s => s.id === song.id);
                      audio.setCurrentPlaylist(playlistId!);
                      audio.setQueue(playlist.songs.map((s, index) => ({ song: s, index, isActive: index > songIndex })));
                      audio.playFromQueue(songIndex);
                    }}
                  />
                );
              })}
            </List>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                This playlist is empty
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Playlist;
import Banner from "./banner/banner";
import SongSection from "../../components/song-section/song-section";
import { useGetSongsQuery } from "../../store/api/songs.api";

const Home = () => {
  const { data: songsData, isLoading, error } = useGetSongsQuery({ limit: 12 });
  
  // For different sections, you can make separate queries with different parameters
  const { data: popularSongsData } = useGetSongsQuery({ limit: 12, page: 2 });
  const { data: newReleasesData } = useGetSongsQuery({ limit: 12, page: 3 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">Loading songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">Failed to load songs</div>
      </div>
    );
  }

  const recommendedSongs = songsData || [];
  const popularSongs = popularSongsData || [];
  const newReleases = newReleasesData || [];

  return (
    <div className="flex flex-col h-full">
      <section className="flex-shrink-0">
        <Banner 
          text="Discover New Music Everyday"
          btnText="Listen Now"
          image="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000"
        />
      </section>

      <div className="flex-1 overflow-y-auto pb-10 min-h-0">
        <div className="flex flex-col gap-8 pt-8">
          {recommendedSongs.length > 0 && (
            <SongSection title="Recommended for you" songs={recommendedSongs} />
          )}
          {popularSongs.length > 0 && (
            <SongSection title="Popular right now" songs={popularSongs} />
          )}
          {newReleases.length > 0 && (
            <SongSection title="New releases" songs={newReleases} />
          )}
          
          {recommendedSongs.length === 0 && popularSongs.length === 0 && newReleases.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400 text-lg">No songs available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
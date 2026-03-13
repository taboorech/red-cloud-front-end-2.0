import Banner from "./banner/banner";
import SongSection from "../../components/song-section/song-section";
import { useGetSongsQuery } from "../../store/api/songs.api";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const { data: songsData, isLoading, error } = useGetSongsQuery({ limit: 12 });
  
  // For different sections, you can make separate queries with different parameters
  const { data: popularSongsData } = useGetSongsQuery({ limit: 12, page: 2 });
  const { data: newReleasesData } = useGetSongsQuery({ limit: 12, page: 3 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-lg">{t('home.loadingError')}</div>
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
          text={t('banner.title')}
          btnText={t('banner.buttonText')}
          image="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000"
        />
      </section>

      <div className="flex-1 overflow-y-auto pb-10 min-h-0">
        <div className="flex flex-col gap-8 pt-8">
          {recommendedSongs.length > 0 && (
            <SongSection title={t('sections.recommendedForYou')} songs={recommendedSongs} />
          )}
          {popularSongs.length > 0 && (
            <SongSection title={t('sections.popularRightNow')} songs={popularSongs} />
          )}
          {newReleases.length > 0 && (
            <SongSection title={t('sections.newReleases')} songs={newReleases} />
          )}
          
          {recommendedSongs.length === 0 && popularSongs.length === 0 && newReleases.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400 text-lg">{t('home.noSongs')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
import { useState } from "react";
import Banner from "./banner/banner";
import SongSection from "../../components/song-section/song-section";
import Toggle from "../../components/toggle/toggle";
import { useGetSongsQuery } from "../../store/api/songs.api";
import { useGetRecommendationsQuery } from "../../store/api/recommendation.api";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import type { RecommendationStrategy } from "../../types/recommendation.types";

const Home = () => {
  const { t } = useTranslation();
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const strategy: RecommendationStrategy = discoveryMode ? "content" : "mixed";

  const { data: recommendations, isLoading: recLoading } = useGetRecommendationsQuery({ limit: 12, strategy });
  const { data: newReleasesData, isLoading: songsLoading } = useGetSongsQuery({ limit: 12 });

  const isLoading = recLoading || songsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-900 dark:text-white text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.home')}</title>
      </Helmet>
      <div className="flex flex-col h-full">
        <section className="flex-shrink-0">
          <Banner
            text={t('banner.title')}
            btnText={t('banner.buttonText')}
            image="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000"
          />
        </section>

        <div className="flex-1 overflow-y-auto pb-4 md:pb-10 min-h-0">
          <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8">
            {recommendations && recommendations.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-4 md:px-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('sections.recommendedForYou')}
                  </h2>
                  <Toggle
                    checked={discoveryMode}
                    onChange={setDiscoveryMode}
                    labelOff={t('sections.forYou')}
                    labelOn={t('sections.discover')}
                  />
                </div>
                <SongSection songs={recommendations} />
              </div>
            )}
            {newReleasesData && newReleasesData.length > 0 && (
              <SongSection title={t('sections.newReleases')} songs={newReleasesData} />
            )}

            {!recommendations?.length && !newReleasesData?.length && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400 text-lg">{t('home.noSongs')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

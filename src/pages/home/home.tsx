import { faker } from "@faker-js/faker";
import Banner from "./banner/banner";
import SongSection from "../../components/song-section/song-section";

const Home = () => {
  const generateItems = (count: number) => 
    Array.from({ length: count }).map(() => ({
      id: faker.string.uuid(),
      title: "Name",
      image: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
    }));

  const recommendedSongs = generateItems(12);
  const popularSongs = generateItems(12);
  const newReleases = generateItems(12);

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
          <SongSection title="Recommended for you" songs={recommendedSongs} />
          <SongSection title="Popular right now" songs={popularSongs} />
          <SongSection title="New releases" songs={newReleases} />
        </div>
      </div>
    </div>
  );
};

export default Home;
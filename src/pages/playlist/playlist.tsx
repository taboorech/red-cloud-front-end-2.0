import { faker } from "@faker-js/faker";
import List from "../../components/list/list";
import Song from "../../components/song/song";
import Banner from "./banner/banner";

const Playlist = () => {

  // ! DEV ONLY
  const tmpImage = faker.image.url();

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="bg-black p-4 rounded-md">
        <Banner/>
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
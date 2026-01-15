import { faker } from "@faker-js/faker";
import Song from "../../song/song";

const Queue = () => {
  const imageUrl = faker.image.url();

  const fillQueue = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <Song
        key={i}
        title={faker.music.songName()}
        image={imageUrl}
        duration="3:45"
        variant="expanded"
      />
    ));
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0 py-3 gap-3 flex flex-col">
        {fillQueue()}
      </div>
    </div>
  )
}

export default Queue;
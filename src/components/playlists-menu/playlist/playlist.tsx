import { faker } from "@faker-js/faker";

const Playlist = () => {
  return (
    <div className="h-full rounded-md w-20 overflow-hidden flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
      <img src={faker.image.url()} className="h-full w-full object-cover"/>
    </div>
  );
}

export default Playlist;
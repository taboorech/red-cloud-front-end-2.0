import { faker } from "@faker-js/faker"

const SongInfo = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center">
      <div className="h-full w-full">
        <img src={faker.image.url()} className="h-full w-full object-cover rounded-md"/>
      </div>
      <span className="text-white text-lg">Song Title</span>
    </div>
  )
}

export default SongInfo;
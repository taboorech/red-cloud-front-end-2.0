import { faker } from "@faker-js/faker"

const SongInfo = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center overflow-hidden">
      <div className="flex-1 w-full min-h-0">
        <img src={faker.image.url()} className="h-full w-full object-cover rounded-md"/>
      </div>
      <span className="text-white text-lg truncate w-full text-center px-2">Song Title</span>
    </div>
  )
}

export default SongInfo;
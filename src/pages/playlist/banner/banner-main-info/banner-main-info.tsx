import dayjs from "dayjs"

interface BannerMainInfoProps {
  title: string
  image: string
  duration?: {
    songs: number
    time: number
  }
  additionalInfo?: string
}

const BannerMainInfo = ({ title, image, duration, additionalInfo }: BannerMainInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="w-1/3 max-w-32 rounded-md overflow-hidden">
        <img src={ image } alt="Banner Image" className="w-full h-full object-cover"/>
      </div>
      <div className="flex flex-col">
        <h1 className="text-white text-3xl font-bold">{ title }</h1>
        {
          duration && 
          <span className="text-gray-400 text-sm mt-1">
            {duration.songs} songs – {dayjs(duration.time).format("hh:mm:ss")}
          </span>
        }
        <p className="text-gray-400 text-sm mt-2">{ additionalInfo }</p>
      </div>
    </div>
  )
}

export default BannerMainInfo;
import { useAudio } from "../../../context/audio-context";

const SongInfo = () => {
  const audio = useAudio();

  return (
    <div className="w-full h-full flex flex-col gap-2 items-center overflow-hidden">
      <div className="flex-1 w-full min-h-0">
        {audio.currentSong ? (
          <img 
            src={audio.currentSong.image_url || ""} 
            alt={audio.currentSong.title}
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="h-full w-full bg-gray-800 rounded-md flex items-center justify-center">
            <span className="text-gray-500 text-sm">No song playing</span>
          </div>
        )}
      </div>
      <span className="text-white text-lg truncate w-full text-center px-2">
        {audio.currentSong?.title || "No song selected"}
      </span>
    </div>
  )
}

export default SongInfo;
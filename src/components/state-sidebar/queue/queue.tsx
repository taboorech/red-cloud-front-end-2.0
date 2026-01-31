import Song from "../../song/song";
import { useAudio } from "../../../context/audio-context";
import { formatDuration } from "../../../utils/format";

const Queue = () => {
  const audio = useAudio();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0 py-3 gap-3 flex flex-col">
        {audio.queue.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-sm">No songs in queue</div>
          </div>
        ) : (
          audio.queue.map(({ song, isActive }, index) => (
            isActive ? <Song
              key={song.id}
              title={song.title}
              image={song.image_url || ""}
              duration={formatDuration(song.duration_seconds)}
              variant="expanded"
              song={song}
              onClick={() => audio.playFromQueue(index)}
            /> : null
          ))
        )}
      </div>
    </div>
  )
}

export default Queue;
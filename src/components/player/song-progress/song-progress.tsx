import { useAudio } from "../../../context/audio-context";
import ProgressBar from "../progress-bar/progress-bar";
import { formatDuration } from "../../../utils/format";

const SongProgress = () => {
  const audio = useAudio();

  const handleProgressChange = (newTime: number) => {
    audio.setCurrentTime(newTime);
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <span className="text-xs text-app-text-soft w-10 text-right">
        {formatDuration(audio.currentTime)}
      </span>

      <div className="flex-1">
        <ProgressBar
          currentPosition={audio.currentTime}
          totalDuration={audio.duration || 1}
          onProgressChange={handleProgressChange}
        />
      </div>

      <span className="text-xs text-app-text-soft w-10 text-left">
        {formatDuration(audio.duration)}
      </span>
    </div>
  );
};

export default SongProgress;

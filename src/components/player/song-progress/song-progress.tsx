import { useAudio } from "../../../context/audio-context";
import ProgressBar from "../progress-bar/progress-bar";

const SongProgress = () => {
  const audio = useAudio();

  const handleProgressChange = (newTime: number) => {
    audio.setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <span className="text-xs text-white w-10 text-right">
        {formatTime(audio.currentTime)}
      </span>

      <div className="flex-1">
        <ProgressBar
          currentPosition={audio.currentTime}
          totalDuration={audio.duration || 1}
          onProgressChange={handleProgressChange}
        />
      </div>

      <span className="text-xs text-white w-10 text-left">
        {formatTime(audio.duration)}
      </span>
    </div>
  );
};

export default SongProgress;

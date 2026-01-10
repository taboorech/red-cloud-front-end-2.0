import { useAudio } from "../../../context/audio-context";
import ProgressBar from "../progress-bar/progress-bar";
import dayjs from "dayjs";

const SongProgress = () => {
  const audio = useAudio();

  const handleProgressChange = (newTime: number) => {
    audio.setCurrentTime(newTime);
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <span className="text-xs text-white w-10 text-right">
        {dayjs(audio.currentTime).format("mm:ss")}
      </span>

      <div className="flex-1">
        <ProgressBar
          currentPosition={audio.currentTime}
          totalDuration={audio.duration || 1}
          onProgressChange={handleProgressChange}
        />
      </div>

      <span className="text-xs text-white w-10 text-left">
        {dayjs(audio.duration).format("mm:ss")}
      </span>
    </div>
  );
};

export default SongProgress;

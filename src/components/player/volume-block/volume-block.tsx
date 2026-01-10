import React from "react";
import { useAudio } from "../../../context/audio-context";
import ProgressBar from "../progress-bar/progress-bar";
import { Button } from "../../button/button";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import classNames from "classnames";

interface VolumeBlockProps {
  className?: string;
}

const VolumeBlock: React.FC<VolumeBlockProps> = ({ className }) => {
  const audio = useAudio();

  const toggleMute = () => {
    audio.setIsMuted(!audio.isMuted);
  };

  const handleVolumeChange = (newValue: number) => {
    if (audio.isMuted) audio.setIsMuted(false);
    audio.setVolume(newValue);
  };

  return (
    <div className={classNames(`w-full flex items-center gap-3`, className)}>
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="circle"
        rounded="full"
      >
        {audio.isMuted || audio.volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
      </Button>

      <div className="flex-1">
        <ProgressBar
          currentPosition={audio.isMuted ? 0 : audio.volume}
          totalDuration={1}
          onProgressChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default VolumeBlock;
import { CiShuffle } from "react-icons/ci";
import { useAudio } from "../../../context/audio-context";
import { Button } from "../../button/button";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoRepeat, IoRepeatSharp } from "react-icons/io5";

const PlayerControls = () => {
  const audio = useAudio();

  const getPlayModeIcon = () => {
    switch (audio.playMode) {
      case 'repeat':
        return <IoRepeat className="text-blue-400" />;
      case 'repeat-one':
        return <IoRepeatSharp className="text-blue-400" />;
      case 'shuffle':
        return <CiShuffle className="text-blue-400" />;
      default:
        return <IoRepeat className="text-gray-400" />;
    }
  };

  const handlePlayModeToggle = () => {
    const modes: ('normal' | 'repeat' | 'repeat-one' | 'shuffle')[] = ['normal', 'repeat', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(audio.playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    console.log('PLAY MODE TOGGLE', modes[nextIndex]);
    
    audio.setPlayMode(modes[nextIndex]);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="ghost"
        size="circle"
        rounded="full"
        onClick={handlePlayModeToggle}
        disabled={audio.autoReplay}
        title={audio.autoReplay ? "Auto replay is enabled in Settings" : `Play mode: ${audio.playMode}`}
      >
        {getPlayModeIcon()}
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
        onClick={audio.prevSong}
        disabled={audio.queue.length === 0}
      >
        <IoIosSkipBackward />
      </Button>
      
      <Button
        variant="snow"
        size="sm"
        rounded="full"
        className="w-12 h-12 flex items-center justify-center"
        onClick={audio.toggle}
        disabled={!audio.currentSong}
      >
        <span className="w-full flex items-center justify-center">
          {audio.playing ? <FaPause /> : <FaPlay />}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
        onClick={audio.nextSong}
        disabled={audio.queue.length === 0}
      >
        <IoIosSkipForward />
      </Button>
    </div>
  );
};

export default PlayerControls;
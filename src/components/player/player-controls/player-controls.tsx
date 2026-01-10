import { CiShuffle } from "react-icons/ci";
import { useAudio } from "../../../context/audio-context";
import { Button } from "../../button/button";
import { IoIosRepeat, IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa";

const PlayerControls = () => {
  const audio = useAudio();

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="ghost"
        size="circle"
        rounded="full"
      >
        <CiShuffle />
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
      >
        <IoIosSkipBackward />
      </Button>
      
      <Button
        variant="snow"
        size="sm"
        rounded="full"
        className="w-12 h-12 flex items-center justify-center"
        onClick={audio.toggle}
      >
        <span className="w-full flex items-center justify-center">
          {audio.playing ? <FaPause /> : <FaPlay />}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
      >
        <IoIosSkipForward />
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
      >
        <IoIosRepeat />
      </Button>
    </div>
  );
};

export default PlayerControls;
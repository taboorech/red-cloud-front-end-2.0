import classNames from "classnames";
import { Button } from "../../button/button";
import {
  FaBan,
  FaUserPlus,
  FaAlignLeft,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import PremiumFeature from "../../premium-feature/premium-feature";
import { useAudio } from "../../../context/audio-context";

interface PlayerAdditionalButtonsProps {
  className?: string;
}

const PlayerAdditionalButtons = ({
  className,
}: PlayerAdditionalButtonsProps) => {
  const navigate = useNavigate();
  const { currentSong } = useAudio();

  return (
    <div
      className={classNames(
        "flex items-center justify-center gap-2",
        className
      )}
    >
      <Button variant="ghost" size="circle" rounded="full">
        <FaBan />
      </Button>

      <Button variant="ghost" size="circle" rounded="full">
        <FaUserPlus />
      </Button>

      <PremiumFeature>
        <Button
          variant="ghost"
          size="circle"
          rounded="full"
          onClick={() => currentSong && navigate(`/lyrics?id=${currentSong.id}`)}
          disabled={!currentSong}
        >
          <FaAlignLeft />
        </Button>
      </PremiumFeature>

      <PremiumFeature>
        <Button 
          variant="ghost" 
          size="circle" 
          rounded="full"
          onClick={() => currentSong && navigate(`/lyrics/translation?id=${currentSong.id}`)}
          disabled={!currentSong}
        >
          <FaGlobe />
        </Button>
      </PremiumFeature>
    </div>
  );
};

export default PlayerAdditionalButtons;
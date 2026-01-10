import classNames from "classnames";
import { Button } from "../../button/button";
import {
  FaBan,
  FaUserPlus,
  FaAlignLeft,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router";

interface PlayerAdditionalButtonsProps {
  className?: string;
}

const PlayerAdditionalButtons = ({
  className,
}: PlayerAdditionalButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={classNames(
        "mx-auto flex items-center justify-center gap-2",
        className
      )}
    >
      <Button variant="ghost" size="circle" rounded="full">
        <FaBan />
      </Button>

      <Button variant="ghost" size="circle" rounded="full">
        <FaUserPlus />
      </Button>

      <Button
        variant="ghost"
        size="circle"
        rounded="full"
        onClick={() => navigate("/lyrics")}
      >
        <FaAlignLeft />
      </Button>

      <Button variant="ghost" size="circle" rounded="full">
        <FaGlobe />
      </Button>
    </div>
  );
};

export default PlayerAdditionalButtons;
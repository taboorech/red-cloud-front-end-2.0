import classNames from "classnames";
import { IoDownload } from "react-icons/io5";
import { useSubscription } from "../../hooks/use-subscription";
import { useState } from "react";

type SongVariant = "small" | "expanded";

interface SongProps {
  title: string;
  image: string;
  duration?: string;
  variant?: SongVariant;
  onClick?: () => void;
  showDownload?: boolean;
}

const Song = ({
  title,
  image,
  duration,
  variant = "small",
  onClick,
  showDownload = false,
}: SongProps) => {
  const { canDownload } = useSubscription();
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canDownload) {
      console.log("Downloading:", title);
      // Add download logic here
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={classNames(
        "group cursor-pointer select-none transition relative",
        variant === "small"
          ? "flex flex-col items-center w-full"
          : "flex items-center gap-3 w-full"
      )}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={classNames(
            "object-cover rounded-md bg-gray-800",
            variant === "small"
              ? "w-full aspect-square"
              : "w-14 h-14"
          )}
        />
        {showDownload && variant === "expanded" && isHovered && (
          <button
            onClick={handleDownload}
            disabled={!canDownload}
            className={classNames(
              "absolute inset-0 flex items-center justify-center bg-black/60 rounded-md transition-opacity",
              canDownload ? "hover:bg-black/70" : "cursor-not-allowed"
            )}
            title={canDownload ? "Download" : "Premium feature"}
          >
            <IoDownload 
              className={classNames(
                "text-2xl",
                canDownload ? "text-white" : "text-gray-500"
              )} 
            />
          </button>
        )}
      </div>

      <div
        className={classNames(
          variant === "small"
            ? "mt-2 text-center"
            : "flex-1 min-w-0"
        )}
      >
        <p className="text-white text-sm font-medium truncate">
          {title}
        </p>
      </div>

      {variant === "expanded" && duration && (
        <span className="text-gray-400 text-xs tabular-nums">
          {duration}
        </span>
      )}
    </div>
  );
};

export default Song;
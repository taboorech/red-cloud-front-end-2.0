import classNames from "classnames";

type SongVariant = "small" | "expanded";

interface SongProps {
  title: string;
  image: string;
  duration?: string;
  variant?: SongVariant;
  onClick?: () => void;
}

const Song = ({
  title,
  image,
  duration,
  variant = "small",
  onClick,
}: SongProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "group cursor-pointer select-none transition relative",
        variant === "small"
          ? "flex flex-col items-center w-full"
          : "flex items-center gap-3 w-full"
      )}
    >
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
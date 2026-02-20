import classNames from "classnames";
import type { ReactNode } from "react";

interface ContextMenuItemProps {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

const ContextMenuItem = ({
  label,
  onClick,
  icon,
  danger = false,
  disabled = false,
}: ContextMenuItemProps) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={classNames(
        "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer",
        danger
          ? "text-red-400 hover:bg-white/5 hover:text-red-300"
          : "text-gray-200 hover:bg-white/10 hover:text-white",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <span className="flex items-center gap-3">
        {icon && <span className="text-base">{icon}</span>}
        <span>{label}</span>
      </span>
    </button>
  );
};

export default ContextMenuItem;

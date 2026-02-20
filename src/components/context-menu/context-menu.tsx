import { useEffect, useRef, useState, type ReactNode } from "react";
import classNames from "classnames";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const ContextMenu = ({ position, onClose, children, className }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 8;
    }
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 8;
    }
    if (x < 8) x = 8;
    if (y < 8) y = 8;

    setAdjustedPosition({ x, y });
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: adjustedPosition.y, left: adjustedPosition.x }}
      className={classNames(
        "fixed z-[9999] min-w-[200px] py-1 bg-[#282828] rounded-lg shadow-xl shadow-black/50 border border-white/10",
        "animate-[contextMenuFadeIn_0.15s_ease-out]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContextMenu;

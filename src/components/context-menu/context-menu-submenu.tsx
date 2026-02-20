import { useRef, useState, useEffect, type ReactNode } from "react";
import classNames from "classnames";
import { MdChevronRight } from "react-icons/md";

interface ContextMenuSubmenuProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

const ContextMenuSubmenu = ({
  label,
  icon,
  children,
  disabled = false,
}: ContextMenuSubmenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"right" | "left">("right");
  const [verticalAlign, setVerticalAlign] = useState<"top" | "bottom">("top");
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!isOpen || !itemRef.current || !submenuRef.current) return;

    const itemRect = itemRef.current.getBoundingClientRect();
    const submenuRect = submenuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (itemRect.right + submenuRect.width > viewportWidth) {
      setOpenDirection("left");
    } else {
      setOpenDirection("right");
    }

    if (itemRect.top + submenuRect.height > viewportHeight) {
      setVerticalAlign("bottom");
    } else {
      setVerticalAlign("top");
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={classNames(
          "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer",
          "text-gray-200 hover:bg-white/10 hover:text-white",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        <span className="flex items-center gap-3">
          {icon && <span className="text-base">{icon}</span>}
          <span>{label}</span>
        </span>
        <MdChevronRight className="text-gray-400 text-lg" />
      </div>

      {isOpen && (
        <div
          ref={submenuRef}
          className={classNames(
            "absolute z-[10000] min-w-[180px] max-h-[300px] overflow-y-auto py-1",
            "bg-[#282828] rounded-lg shadow-xl shadow-black/50 border border-white/10",
            "animate-[contextMenuFadeIn_0.15s_ease-out] scrollbar-none",
            openDirection === "right" ? "left-full" : "right-full",
            verticalAlign === "top" ? "top-0" : "bottom-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ContextMenuSubmenu;

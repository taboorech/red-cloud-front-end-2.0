import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";

const GRADIENTS = [
  "linear-gradient(135deg, #7f1d1d, #b91c1c)",
  "linear-gradient(135deg, #92400e, #d97706)",
  "linear-gradient(135deg, #14532d, #16a34a)",
  "linear-gradient(135deg, #0c4a6e, #0284c7)",
  "linear-gradient(135deg, #1e3a8a, #3b82f6)",
  "linear-gradient(135deg, #581c87, #a855f7)",
  "linear-gradient(135deg, #134e4a, #0d9488)",
  "linear-gradient(135deg, #7c2d12, #ea580c)",
];

const hashToIndex = (seed: string | number | undefined, length: number) => {
  if (seed === undefined || seed === null) return 0;
  const str = String(seed);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % length;
};

interface StripedCoverProps {
  src?: string | null;
  alt?: string;
  seed?: string | number;
  className?: string;
  rounded?: string;
  imgClassName?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

const StripedCover = ({
  src,
  alt = "",
  seed,
  className,
  rounded = "rounded-md",
  imgClassName,
  children,
  style,
}: StripedCoverProps) => {
  const hasImage = !!src;
  const gradient = GRADIENTS[hashToIndex(seed ?? alt ?? src ?? 0, GRADIENTS.length)];

  return (
    <div
      className={classNames("relative overflow-hidden bg-neutral-800", rounded, className)}
      style={!hasImage ? { background: gradient, ...style } : style}
    >
      {hasImage ? (
        <img
          src={src!}
          alt={alt}
          className={classNames("w-full h-full object-cover", imgClassName)}
        />
      ) : (
        <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_8px)]" />
      )}
      {children}
    </div>
  );
};

export default StripedCover;

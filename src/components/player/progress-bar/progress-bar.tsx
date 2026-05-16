import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  currentPosition: number;
  totalDuration: number;
  onProgressChangeStart?: () => void;
  onProgressChange: (newPosition: number) => void;
  onProgressChangeEnd?: () => void;
}

const ProgressBar = ({
  currentPosition,
  totalDuration,
  onProgressChangeStart,
  onProgressChange,
  onProgressChangeEnd,
}: ProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDraggingRef.current && totalDuration > 0) {
      setProgressPercent((currentPosition / totalDuration) * 100);
    }
  }, [currentPosition, totalDuration]);

  const calculatePercent = (clientX: number) => {
    if (!barRef.current) return 0;

    const { left, width } = barRef.current.getBoundingClientRect();
    const percent = ((clientX - left) / width) * 100;

    return Math.min(100, Math.max(0, percent));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);

    const percent = calculatePercent(e.clientX);
    setProgressPercent(percent);

    const handleMouseMove = (event: MouseEvent) => {
      setProgressPercent(calculatePercent(event.clientX));
    };

    onProgressChangeStart?.();

    const handleMouseUp = (event: MouseEvent) => {
      isDraggingRef.current = false;
      setIsDragging(false);

      const percent = calculatePercent(event.clientX);
      const newValue = (percent / 100) * totalDuration;

      onProgressChange(newValue);
      onProgressChangeEnd?.();

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const transitionClass = isDragging ? "" : "transition-[width,left] duration-300 ease-linear";

  return (
    <div
      ref={barRef}
      onMouseDown={handleMouseDown}
      className="relative w-full h-1 cursor-pointer rounded-full bg-gray-200 dark:bg-neutral-700"
    >
      <div
        className={`absolute left-0 top-0 h-full bg-red-600 rounded-full ${transitionClass}`}
        style={{ width: `${progressPercent}%` }}
      />

      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md hover:scale-110 ${transitionClass}`}
        style={{ left: `${progressPercent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
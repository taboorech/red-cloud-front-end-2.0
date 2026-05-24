import classNames from "classnames";

interface WaveformProps {
  progress: number;
}

const Waveform = ({ progress }: WaveformProps) => {
  const bars = 40;
  return (
    <div className="flex items-center gap-[2px] h-6 mt-1">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 30 + Math.abs(Math.sin(i * 0.4)) * 60 + Math.abs(Math.cos(i * 0.7)) * 10;
        const active = i / bars < progress;
        return (
          <span
            key={i}
            className={classNames(
              "w-[2px] rounded-full transition-colors",
              active ? "bg-brand-500" : "bg-app-soft-2"
            )}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
};

export default Waveform;

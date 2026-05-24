import classNames from "classnames";

interface StatCardProps {
  value: string | number;
  label: string;
  /** Optional icon shown above the value. */
  icon?: React.ReactNode;
  /** Brand-coloured filled variant for the hero stat. */
  highlight?: boolean;
}

/**
 * Compact stat card used on profile and admin pages.
 * Default: bordered card with muted label and prominent value.
 * With `highlight`: brand-filled red card with white text and glow shadow.
 */
const StatCard = ({ value, label, icon, highlight }: StatCardProps) => (
  <div
    className={classNames(
      "rounded-2xl p-5 flex flex-col gap-1 transition shadow-sm",
      highlight
        ? "bg-brand-500 text-white shadow-[0_8px_24px_-6px_rgba(239,54,54,0.45)]"
        : "bg-app-elev border border-app-line text-app-text"
    )}
  >
    {icon && (
      <span
        className={classNames(
          "text-2xl mb-1",
          highlight ? "text-white/90" : "text-app-text-soft"
        )}
      >
        {icon}
      </span>
    )}
    <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
      {value}
    </span>
    <span
      className={classNames(
        "text-[10px] uppercase tracking-[0.16em] font-semibold",
        highlight ? "text-white/80" : "text-app-text-muted"
      )}
    >
      {label}
    </span>
  </div>
);

export default StatCard;

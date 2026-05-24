import classNames from "classnames";
import { IoCheckmark } from "react-icons/io5";

interface CardHeaderProps {
  /** Number shown in the badge when no icon is provided and not done. */
  index: string;
  /** Optional icon shown in the badge instead of the number. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Renders a brand-coloured checkmark badge to indicate completion. */
  done?: boolean;
  /** Small counter shown next to the title — e.g. current "3" of total "5". */
  current?: string;
  total?: string;
}

/**
 * Numbered card header used by settings/song-editor and similar wizard-style pages.
 * Badge can be:
 *   - a checkmark (when `done`)
 *   - an icon (when `icon` passed and not done)
 *   - the `index` number (default)
 */
const CardHeader = ({
  index,
  icon,
  title,
  subtitle,
  done,
  current,
  total,
}: CardHeaderProps) => (
  <div className="flex items-center gap-3">
    <span
      className={classNames(
        "w-8 h-8 rounded-full grid place-items-center shrink-0 transition",
        done ? "bg-brand-500 text-white" : "bg-app-soft text-app-text-muted"
      )}
    >
      {done ? (
        <IoCheckmark className="w-4 h-4" />
      ) : (
        icon ?? <span className="text-sm font-bold">{index}</span>
      )}
    </span>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h2 className="text-app-text text-lg font-bold">{title}</h2>
        {current && total && (
          <span className="text-xs text-app-text-muted font-semibold">
            {current}/{total}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-app-text-muted text-sm mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

export default CardHeader;

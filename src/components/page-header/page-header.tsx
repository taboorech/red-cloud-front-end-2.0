import classNames from "classnames";
import { PAGE_LABEL_CLASS } from "../../utils/tailwind-classes";

interface PageHeaderProps {
  /** The big icon/image plate on the left of the header (rendered at 176x176 desktop). */
  icon: React.ReactNode;
  /** Small uppercase eyebrow above the title (e.g. "PLAYLIST"). */
  eyebrow?: React.ReactNode;
  /** Main page title. */
  title: React.ReactNode;
  /** Meta line under the title (song count, duration, etc.). */
  meta?: React.ReactNode;
  /** Action buttons row under the title block (play / shuffle / more). */
  actions?: React.ReactNode;
  /** Tailwind classes for the background gradient on the wrapper header. */
  gradientClassName?: string;
}

/**
 * Banner-style page header used by playlist / favorites / my-songs pages.
 * Renders icon plate, eyebrow, title, meta and an actions row beneath.
 */
const PageHeader = ({
  icon,
  eyebrow,
  title,
  meta,
  actions,
  gradientClassName,
}: PageHeaderProps) => (
  <header
    className={classNames(
      "relative px-6 md:px-10 pt-8 pb-6",
      gradientClassName
    )}
  >
    <div className="flex items-end gap-6">
      <div className="w-44 h-44 md:w-52 md:h-52 rounded-xl overflow-hidden grid place-items-center shrink-0 shadow-2xl">
        {icon}
      </div>
      <div className="flex flex-col gap-3 min-w-0 pb-2">
        {eyebrow && <span className={PAGE_LABEL_CLASS}>{eyebrow}</span>}
        <h1 className="text-4xl md:text-5xl font-extrabold text-app-text truncate">
          {title}
        </h1>
        {meta && <p className="text-sm text-app-text-soft">{meta}</p>}
      </div>
    </div>
    {actions && <div className="mt-6 flex items-center gap-4">{actions}</div>}
  </header>
);

export default PageHeader;

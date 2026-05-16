import classNames from "classnames";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
  padded?: boolean;
  className?: string;
}

/**
 * Standard page wrapper: applies the `px-6 md:px-10 pt-8 pb-10` shell used
 * across most app pages. Pass `maxWidth` for a Tailwind max-w utility
 * (e.g. "max-w-5xl"). Pass `padded={false}` for pages that handle their own
 * vertical padding (e.g. those with full-bleed header banners).
 */
const PageLayout = ({
  children,
  maxWidth,
  padded = true,
  className,
}: PageLayoutProps) => (
  <div
    className={classNames(
      "px-6 md:px-10",
      padded && "pt-8 pb-10",
      maxWidth,
      className
    )}
  >
    {children}
  </div>
);

export default PageLayout;

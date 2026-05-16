interface LockedCardProps {
  index: string;
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Disabled card variant: same look as a regular card but visually muted and
 * non-interactive. Used for "coming soon" sections.
 */
const LockedCard = ({
  index,
  icon,
  title,
  subtitle,
  badge,
  children,
}: LockedCardProps) => (
  <div className="rounded-2xl bg-app-elev border border-app-line p-5 opacity-70 pointer-events-none relative">
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-full grid place-items-center shrink-0 bg-app-soft text-app-text-muted">
        {icon ?? <span className="text-sm font-bold">{index}</span>}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-app-text text-lg font-bold">{title}</h2>
          {badge && (
            <span className="text-[10px] tracking-widest font-bold uppercase text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-app-text-muted text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

export default LockedCard;

interface EmptyStateProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * Vertical empty-state block: round icon plate, title, optional description and
 * an actions row. Used by my-songs / playlists / favorites etc.
 */
const EmptyState = ({ icon, title, description, actions }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-16 h-16 grid place-items-center rounded-full bg-app-soft mb-2 text-app-text-muted">
      {icon}
    </div>
    <p className="text-app-text text-xl font-semibold">{title}</p>
    {description && (
      <p className="text-app-text-muted text-sm max-w-md text-center">
        {description}
      </p>
    )}
    {actions && <div className="flex items-center gap-3 mt-4">{actions}</div>}
  </div>
);

export default EmptyState;

import { useTranslation } from 'react-i18next';
import { IoCloudOfflineOutline } from 'react-icons/io5';
import { useOnlineStatus } from '../../hooks/use-online-status';

const OfflineBanner = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-amber-500/15 text-amber-500 px-4 py-1.5 text-xs font-medium border-b border-amber-500/20"
    >
      <IoCloudOfflineOutline className="w-4 h-4 shrink-0" />
      <span className="truncate">
        {t('offline.banner')} — {t('offline.cachedOnly')}
      </span>
    </div>
  );
};

export default OfflineBanner;

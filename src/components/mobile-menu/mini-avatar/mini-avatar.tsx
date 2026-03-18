import Avatar from "../../avatar-block/avatar/avatar";
import { useGetProfileQuery } from "../../../store/api/profile.api";
import { useTranslation } from "react-i18next";
import { FaChevronRight } from "react-icons/fa6";

interface MiniAvatarProps {
  onClick?: () => void;
}

const MiniAvatar = ({ onClick }: MiniAvatarProps) => {
  const { data: profile } = useGetProfileQuery();
  const { t } = useTranslation();

  if (!profile) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-neutral-400">{t('auth.authorization')}</p>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Avatar />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{profile.username}</p>
        <p className="text-xs text-gray-500 dark:text-neutral-400">{t('navigation.goToProfile')}</p>
      </div>
      <FaChevronRight />
    </div>
  )
}

export default MiniAvatar;
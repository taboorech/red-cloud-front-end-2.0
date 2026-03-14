import { useTranslation } from "react-i18next";

const PlaylistMenuTitle = () => {
  const { t } = useTranslation();

  return (
    <div className="p-2 mx-auto w-full text-center bg-white dark:bg-black border border-gray-200 border-b-0 dark:border-white/10 rounded-t-md">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('playlistsMenu.yourLibrary')}</h3>
    </div>
  );
}

export default PlaylistMenuTitle;
import { useNavigate } from "react-router";
import { Button } from "../../components/button/button";
import { MdHome, MdArrowBack } from "react-icons/md";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-black rounded-md text-gray-900 dark:text-white px-4">
      <p className="text-[8rem] font-bold leading-none text-gray-100 dark:text-white/10 select-none">
        404
      </p>
      <h1 className="text-2xl font-semibold mt-2">
        {t("notFound.title")}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center max-w-md">
        {t("notFound.description")}
      </p>
      <div className="flex gap-3 mt-8">
        <Button variant="ghost" size="md" rounded="full" onClick={() => navigate(-1)} leftIcon={<MdArrowBack />}>
          {t('common.goBack')}
        </Button>
        <Button variant="snow" size="md" rounded="full" onClick={() => navigate("/")} leftIcon={<MdHome />}>
          {t('common.home')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

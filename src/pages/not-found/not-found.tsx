import { useNavigate } from "react-router";
import { Button } from "../../components/button/button";
import { MdHome, MdArrowBack } from "react-icons/md";
import { useTranslation } from "react-i18next";import { Helmet } from "react-helmet-async";
const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.notFound')}</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center h-full bg-app-base rounded-md text-app-text px-4">
      <p className="text-[8rem] font-bold leading-none text-app-text/5 select-none">
        404
      </p>
      <h1 className="text-2xl font-semibold mt-2">
        {t("notFound.title")}
      </h1>
      <p className="text-app-text-muted text-sm mt-2 text-center max-w-md">
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
    </>
  );
};

export default NotFound;

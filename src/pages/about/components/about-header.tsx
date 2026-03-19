import { useTranslation } from "react-i18next";

const AboutHeader = () => {
  const { t } = useTranslation();

  return (
    <h1 className="text-4xl font-bold mb-8">{t('about.title')}</h1>
  )
}

export default AboutHeader
import { useTranslation } from 'react-i18next';
import AboutHeader from './components/about-header'
import AboutSection from './components/about-section'
import { Helmet } from 'react-helmet-async'

const About = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: "Header1",
      level: 1 as const,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      title: "Header2",
      level: 2 as const,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      title: "Header1",
      level: 1 as const,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  ]

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.about')}</title>
      </Helmet>
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-0 rounded px-8 py-6">
        <div className="mx-auto">
          <AboutHeader />
          
          {sections.map((section, index) => (
            <AboutSection
              key={index}
              title={section.title}
              level={section.level}
              content={section.content}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default About
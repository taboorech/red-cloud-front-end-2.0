import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

export type SearchTab = 'all' | 'songs' | 'users' | 'playlists'

export interface SearchTabsProps {
  activeTab: SearchTab
  onTabChange: (tab: SearchTab) => void
}

const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  const { t } = useTranslation()

  const tabs: { key: SearchTab; label: string }[] = [
    { key: 'all', label: t('search.tabs.all') },
    { key: 'songs', label: t('search.tabs.songs') },
    { key: 'users', label: t('search.tabs.users') },
    { key: 'playlists', label: t('search.tabs.playlists') }
  ]

  return (
    <div className="flex gap-2 overflow-x-auto sidebar-scroll">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={classNames(
            "px-5 h-10 rounded-full whitespace-nowrap text-sm font-semibold transition-colors cursor-pointer",
            activeTab === tab.key
              ? "bg-white text-black"
              : "bg-app-soft text-app-text-soft hover:bg-app-soft-2 hover:text-app-text"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SearchTabs;

import { useTranslation } from 'react-i18next'

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
    <div className="flex gap-2 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-2 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === tab.key
              ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
              : 'bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SearchTabs;
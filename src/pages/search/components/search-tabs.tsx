export type SearchTab = 'all' | 'songs' | 'users' | 'playlists'

export interface SearchTabsProps {
  activeTab: SearchTab
  onTabChange: (tab: SearchTab) => void
}

const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  const tabs: { key: SearchTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'songs', label: 'Songs' },
    { key: 'users', label: 'Users' },
    { key: 'playlists', label: 'Playlists' }
  ]

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-2 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === tab.key
              ? 'bg-white text-black'
              : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SearchTabs;
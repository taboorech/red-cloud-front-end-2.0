import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { IoArrowBack, IoMusicalNotes, IoPricetags, IoShieldCheckmark, IoSparkles } from 'react-icons/io5'
import { Button } from '../../components/button/button'
import UsersTab from './users-tab/users-tab'
import AIUsageTab from './ai-tab/ai-tab'
import SongsTab from './songs-tab/songs-tab'
import GenresTab from './genres-tab/genres-tab'
import { useGetProfileQuery } from '../../store/api/profile.api'
import { UserRole } from '../../types/user.types'

type Tab = 'users' | 'songs' | 'genres' | 'ai'

const Management = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: profile } = useGetProfileQuery()

  const isAdmin =
    profile?.role === UserRole.ADMIN || profile?.role === UserRole.OWNER

  const tabs = useMemo(() => {
    const list: { key: Tab; label: string; icon: React.ReactNode }[] = []
    if (isAdmin) {
      list.push({
        key: 'users',
        label: t('management.tabs.users'),
        icon: <IoShieldCheckmark size={16} />,
      })
    }
    list.push({
      key: 'songs',
      label: t('management.tabs.songs'),
      icon: <IoMusicalNotes size={16} />,
    })
    list.push({
      key: 'genres',
      label: t('management.tabs.genres'),
      icon: <IoPricetags size={16} />,
    })
    if (isAdmin) {
      list.push({
        key: 'ai',
        label: t('management.tabs.aiUsage'),
        icon: <IoSparkles size={16} />,
      })
    }
    return list
  }, [isAdmin, t])

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]?.key ?? 'songs')

  const activeIsVisible = tabs.some((tab) => tab.key === activeTab)
  const effectiveTab: Tab = activeIsVisible ? activeTab : tabs[0]?.key ?? 'songs'

  return (
    <>
      <Helmet>
        <title>{t('management.title')}</title>
      </Helmet>
      <div className="flex flex-col h-full bg-app-base text-app-text overflow-y-auto">
        <div className="sticky top-0 bg-app-base/80 backdrop-blur-xl z-20 border-b border-app-line">
          <div className="mx-auto px-6 py-6 flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="circle"
                onClick={() => navigate(-1)}
                className="bg-app-soft hover:bg-app-soft-2 border-transparent transition-all"
              >
                <IoArrowBack size={20} className="text-app-text" />
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">{t('management.title')}</h1>
            </div>
          </div>

          <div className="flex gap-1 px-6 pb-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  effectiveTab === tab.key
                    ? 'bg-app-text text-app-base'
                    : 'text-app-text-soft hover:bg-app-soft'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full px-6 py-8">
          {effectiveTab === 'users' && isAdmin && <UsersTab />}
          {effectiveTab === 'songs' && <SongsTab />}
          {effectiveTab === 'genres' && <GenresTab />}
          {effectiveTab === 'ai' && isAdmin && <AIUsageTab />}
        </div>
      </div>
    </>
  )
}

export default Management

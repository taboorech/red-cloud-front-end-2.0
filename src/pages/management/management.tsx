import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { IoArrowBack, IoShieldCheckmark, IoSparkles } from 'react-icons/io5'
import { Button } from '../../components/button/button'
import UsersTab from './users-tab/users-tab'
import AIUsageTab from './ai-tab/ai-tab'

type Tab = 'users' | 'ai'

const Management = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('users')

  return (
    <>
      <Helmet>
        <title>{t('management.title')}</title>
      </Helmet>
      <div className="flex flex-col h-full bg-white dark:bg-black text-gray-900 dark:text-white overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20 border-b border-gray-200 dark:border-white/5">
          <div className="mx-auto px-6 py-6 flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="circle"
                onClick={() => navigate(-1)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border-transparent transition-all"
              >
                <IoArrowBack size={20} className="text-gray-900 dark:text-white" />
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">{t('management.title')}</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pb-3">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <IoShieldCheckmark size={16} />
              {t('management.tabs.users')}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <IoSparkles size={16} />
              {t('management.tabs.aiUsage')}
            </button>
          </div>
        </div>

        <div className="mx-auto w-full px-6 py-8">
          {activeTab === 'users' ? <UsersTab /> : <AIUsageTab />}
        </div>
      </div>
    </>
  )
}

export default Management

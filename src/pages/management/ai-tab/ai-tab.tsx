import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useGetAdminAIActivityQuery } from '../../../store/api/ai.api'
import Input from '../../../components/input/input'
import StatCard from './stat-card'
import ActivityRow from './activity-row'

const AIUsageTab = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useGetAdminAIActivityQuery({})

  const totalStats = data?.data?.totalStats
  const activities = data?.data?.activities ?? []
  const userStats = data?.data?.userStats ?? []

  const searchLower = search.toLowerCase()

  const filteredActivities = useMemo(
    () =>
      [...activities]
        .filter((a) => {
          if (!searchLower) return true
          const username = a.user?.username?.toLowerCase() ?? ''
          const email = a.user?.email?.toLowerCase() ?? ''
          const id = String(a.user_id)
          return username.includes(searchLower) || email.includes(searchLower) || id.includes(searchLower)
        })
        .sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()),
    [activities, searchLower],
  )

  const filteredUserStats = useMemo(
    () =>
      userStats.filter((s) => {
        if (!searchLower) return true
        return String(s.userId).includes(searchLower)
      }),
    [userStats, searchLower],
  )

  if (isLoading) {
    return <p className="text-sm text-gray-500">{t('common.loading')}</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">{t('management.loadError')}</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder={t('management.ai.searchUser')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary Cards */}
      {totalStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label={t('management.ai.totalUsers')} value={totalStats.totalUsers} />
          <StatCard label={t('management.ai.totalRequests')} value={totalStats.totalActivities} />
          <StatCard label={t('management.ai.totalCost')} value={`$${totalStats.totalCost.toFixed(4)}`} />
          <StatCard
            label={t('management.ai.totalTokens')}
            value={`${(totalStats.totalTokens.input + totalStats.totalTokens.output).toLocaleString()}`}
          />
        </div>
      )}

      {/* Per-user stats */}
      {filteredUserStats.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">{t('management.ai.byUser')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">{t('management.ai.userId')}</th>
                  <th className="pb-3 pr-4">{t('management.ai.requests')}</th>
                  <th className="pb-3 pr-4">{t('management.ai.cost')}</th>
                  <th className="pb-3">{t('management.ai.tokens')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserStats.map((s) => (
                  <tr key={s.userId} className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-3 pr-4 font-medium">#{s.userId}</td>
                    <td className="py-3 pr-4">{s.activityCount}</td>
                    <td className="py-3 pr-4">${s.totalCost.toFixed(4)}</td>
                    <td className="py-3">{(s.totalTokens.input + s.totalTokens.output).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Activity log */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">{t('management.ai.recentActivity')}</h2>
        {filteredActivities.length === 0 ? (
          <p className="text-sm text-gray-500">{t('management.ai.noActivity')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredActivities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AIUsageTab

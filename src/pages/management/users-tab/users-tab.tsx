import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllUsersQuery } from '../../../store/api/users.api'
import Input from '../../../components/input/input'
import UserRow from './user-row'

type BanFilter = 'all' | 'banned' | 'active'

const UsersTab = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [banFilter, setBanFilter] = useState<BanFilter>('all')

  const { data, isLoading, error } = useGetAllUsersQuery({ search: debouncedSearch || undefined, limit: 50 })
  const users = useMemo(() => {
    const list = data?.data ?? []
    if (banFilter === 'all') return list
    return list.filter((u) => {
      const banned = u.userBans?.some((b) => b.is_banned) ?? false
      return banFilter === 'banned' ? banned : !banned
    })
  }, [data, banFilter])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => setDebouncedSearch(value), 400)
    setDebounceTimer(timer)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search + Filter */}
      <div className="flex items-end gap-4">
        <div className="max-w-md flex-1">
          <Input
            placeholder={t('management.searchUsers')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select
          value={banFilter}
          onChange={(e) => setBanFilter(e.target.value as BanFilter)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-lg px-3 py-2 outline-none hover:border-gray-400 dark:hover:border-gray-600 focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="all">{t('management.filter.all')}</option>
          <option value="active">{t('management.filter.active')}</option>
          <option value="banned">{t('management.filter.banned')}</option>
        </select>
      </div>

      {/* Users list */}
      {isLoading && (
        <p className="text-sm text-gray-500">{t('common.loading')}</p>
      )}

      {!!error && (
        <p className="text-sm text-red-500">{t('management.loadError')}</p>
      )}

      {!isLoading && !error && users.length === 0 && (
        <p className="text-sm text-gray-500">{t('management.noUsers')}</p>
      )}

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

export default UsersTab

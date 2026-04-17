import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/button'
import { useUpdateUserRoleMutation, useChangeUserAccessMutation } from '../../../store/api/users.api'
import { UserRole, type User } from '../../../types/user.types'
import Avatar from '../../../components/avatar-block/avatar/avatar'

const ROLES = Object.values(UserRole)

const UserRow = ({ user }: { user: User }) => {
  const { t } = useTranslation()
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [changeAccess, { isLoading: isChangingAccess }] = useChangeUserAccessMutation()
  const [selectedRole, setSelectedRole] = useState(user.role ?? 'user')

  const isBanned = user.userBans?.some((b) => b.is_banned) ?? false

  const handleRoleChange = async (role: string) => {
    setSelectedRole(role)
    await updateRole({ userId: user.id, role })
  }

  const handleToggleBan = async () => {
    await changeAccess({ userId: user.id, action: isBanned ? 'pardon' : 'ban' })
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl">
      {/* User info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 shrink-0">
          <Avatar src={user.avatar} alt={user.username} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{user.username}</p>
            {isBanned && (
              <span className="text-[10px] font-medium text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                {t('management.banned')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role select */}
      <select
        value={selectedRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={isUpdatingRole}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-lg px-3 py-1.5 outline-none hover:border-gray-400 dark:hover:border-gray-600 focus:border-blue-500 transition-colors appearance-none cursor-pointer disabled:opacity-50 text-center"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {t(`management.roles.${role}`)}
          </option>
        ))}
      </select>

      {/* Ban toggle */}
      <Button
        variant={isBanned ? 'outline' : 'danger'}
        size="sm"
        rounded="lg"
        onClick={handleToggleBan}
        loading={isChangingAccess}
        disabled={isChangingAccess}
      >
        {isBanned ? t('management.pardon') : t('management.ban')}
      </Button>
    </div>
  )
}

export default UserRow

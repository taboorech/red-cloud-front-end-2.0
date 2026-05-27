import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Button } from '../../../components/button/button'
import { useUpdateUserRoleMutation, useChangeUserAccessMutation } from '../../../store/api/users.api'
import { ASSIGNABLE_USER_ROLES, UserRole, type User } from '../../../types/user.types'
import { useGetProfileQuery } from '../../../store/api/profile.api'
import Avatar from '../../../components/avatar-block/avatar/avatar'
import PlanEditorModal from './plan-editor-modal'

const UserRow = ({ user }: { user: User }) => {
  const { t } = useTranslation()
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [changeAccess, { isLoading: isChangingAccess }] = useChangeUserAccessMutation()
  const [selectedRole, setSelectedRole] = useState(user.role ?? 'user')
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const { data: profile } = useGetProfileQuery()

  const isBanned = user.userBans?.some((b) => b.is_banned) ?? false
  const isOwner = user.role === UserRole.OWNER
  const isSelf = profile?.id === user.id
  const viewerCanEditPlan =
    profile?.role === UserRole.ADMIN || profile?.role === UserRole.OWNER
  const canEditThisPlan = viewerCanEditPlan && (!isOwner || isSelf)
  const currentPlanLabel = user.subscription?.plan_title ?? t('management.plan.noPlan')

  const handleRoleChange = async (role: string) => {
    setSelectedRole(role)
    await updateRole({ userId: user.id, role })
  }

  const handleToggleBan = async () => {
    await changeAccess({ userId: user.id, action: isBanned ? 'pardon' : 'ban' })
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 p-4 bg-app-soft border border-app-line rounded-2xl">
      {/* User info */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 shrink-0">
          <Avatar src={user.avatar} alt={user.username} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{user.username}</p>
            {isOwner && (
              <span className="text-[10px] font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                {t('management.roles.owner')}
              </span>
            )}
            {isBanned && (
              <span className="text-[10px] font-medium text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                {t('management.banned')}
              </span>
            )}
          </div>
          <p className="text-xs text-app-text-muted truncate">{user.email}</p>
        </div>
      </div>

      {/* Role select */}
      {isOwner ? (
        <div className="text-app-text-muted text-xs px-3 py-1.5 select-none" title={t('management.ownerImmutable')}>
          —
        </div>
      ) : (
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={isUpdatingRole}
          className="bg-app-elev border border-app-line text-app-text text-xs rounded-lg px-3 py-1.5 outline-none hover:border-app-text-muted focus:border-brand-500 transition-colors appearance-none cursor-pointer disabled:opacity-50 text-center"
        >
          {ASSIGNABLE_USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`management.roles.${role}`)}
            </option>
          ))}
        </select>
      )}

      {/* Plan editor */}
      {canEditThisPlan ? (
        <button
          type="button"
          onClick={() => setPlanModalOpen(true)}
          className={classNames(
            "h-8 px-3 rounded-lg border border-app-line bg-app-elev hover:border-app-text-muted",
            "text-xs font-medium text-app-text-muted hover:text-app-text",
            "transition-colors cursor-pointer flex items-center gap-1.5",
          )}
          title={t('management.plan.title')}
        >
          <span className="uppercase tracking-wide text-[10px]">{currentPlanLabel}</span>
        </button>
      ) : (
        <div className="w-[60px]" />
      )}

      {/* Ban toggle */}
      {isOwner ? (
        <div className="w-[60px]" />
      ) : (
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
      )}

      {planModalOpen && (
        <PlanEditorModal user={user} onClose={() => setPlanModalOpen(false)} />
      )}
    </div>
  )
}

export default UserRow

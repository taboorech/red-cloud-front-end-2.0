import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { AIActivity } from '../../../types/ai.types'
import Avatar from '../../../components/avatar-block/avatar/avatar'

const ActivityRow = ({ activity }: { activity: AIActivity }) => {
  const { t } = useTranslation()
  const contentTypeLabel =
    activity.content_type === 'cover_generation'
      ? t('management.ai.coverGeneration')
      : t('management.ai.lyricsTranscription')

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl">
      <div className="flex items-center gap-4 min-w-0">
        {activity.user && (
          <div className="w-8 h-8 shrink-0">
            <Avatar src={activity.user.avatar} alt={activity.user.username} />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {activity.user?.username ?? `#${activity.user_id}`}
          </p>
          <p className="text-xs text-gray-500">{contentTypeLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 text-xs text-gray-500">
        {activity.cost != null && <span>${Number(activity.cost).toFixed(4)}</span>}
        {activity.metadata?.model && <span>{activity.metadata.model}</span>}
        <span>{dayjs(activity.created_at).format('DD.MM.YYYY')}</span>
      </div>
    </div>
  )
}

export default ActivityRow

import type { ReactNode } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { useNavigate } from 'react-router'
import { useSubscription } from '../../hooks/use-subscription'
import { SubscriptionType } from '../../types/subscription.types'
import { useTranslation } from 'react-i18next'
import { Button } from '../button/button'

interface PremiumOverlayProps {
  children: ReactNode
  requiredPlan?: SubscriptionType[]
}

const PremiumOverlay = ({
  children,
  requiredPlan = [SubscriptionType.PREMIUM, SubscriptionType.FAMILY],
}: PremiumOverlayProps) => {
  const { currentPlan } = useSubscription()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hasAccess = requiredPlan.includes(currentPlan)
  if (hasAccess) return <>{children}</>

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="pointer-events-none opacity-40 select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-black/20 backdrop-blur-[1px] rounded-lg px-4">
        <IoLockClosed className="text-white text-lg shrink-0" />
        <span className="text-white text-sm font-medium text-center">
          {t('common.premiumRequired')}
        </span>
        <Button
          variant="snow"
          onClick={() => navigate('/subscriptions')}
          className="text-xs text-yellow-400 hover:text-yellow-300 shrink-0"
        >
          {t('common.upgradePlan')}
        </Button>
      </div>
    </div>
  )
}

export default PremiumOverlay

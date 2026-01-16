import type { ReactNode } from 'react'
import { useSubscription } from '../../hooks/use-subscription'
import type { SubscriptionType } from '../../types/subscription.types'

interface PremiumFeatureProps {
  children: ReactNode
  requiredPlan?: SubscriptionType[]
  fallback?: ReactNode
}

const PremiumFeature = ({ 
  children, 
  requiredPlan = ['premium', 'family'],
  fallback = null,
}: PremiumFeatureProps) => {
  const { currentPlan } = useSubscription()
  const hasAccess = requiredPlan.includes(currentPlan)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default PremiumFeature

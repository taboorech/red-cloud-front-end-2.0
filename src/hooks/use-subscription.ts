import { useGetCurrentSubscriptionQuery } from '../store/api/subscription.api'
import type { SubscriptionType } from '../store/api/subscription.api'

export const useSubscription = () => {
  const { data, isLoading, error } = useGetCurrentSubscriptionQuery()

  const subscription = data?.subscription
  const features = data?.features

  const isPremium = subscription?.plan === 'premium' || subscription?.plan === 'family'
  const isFree = subscription?.plan === 'free'
  const isFamily = subscription?.plan === 'family'

  const hasFeature = (requiredPlans: SubscriptionType[]) => {
    return subscription ? requiredPlans.includes(subscription.plan) : false
  }

  return {
    // Subscription data
    currentPlan: subscription?.plan || 'free',
    subscription,
    isLoading,
    error,
    
    // Status
    isPremium,
    isFree,
    isFamily,
    isActive: subscription?.status === 'active',
    expiresAt: subscription?.expiresAt,
    
    // Helper
    hasFeature,
    
    // Feature capabilities (from API)
    canDownload: features?.canDownload ?? false,
    canSkipUnlimited: features?.canSkipUnlimited ?? false,
    hasHighQuality: features?.hasHighQuality ?? false,
    hasLyrics: features?.hasLyrics ?? false,
    isAdFree: features?.isAdFree ?? false,
    canShareFamily: features?.canShareFamily ?? false,
    maxDownloads: features?.maxDownloads ?? 0,
    skipLimit: features?.skipLimit ?? 6,
  }
}

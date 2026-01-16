export type SubscriptionType = 'free' | 'premium' | 'family'

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionType
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  expiresAt: string | null
  autoRenew: boolean
}

export interface SubscriptionResponse {
  subscription: Subscription
  features: {
    canDownload: boolean
    canSkipUnlimited: boolean
    hasHighQuality: boolean
    hasLyrics: boolean
    isAdFree: boolean
    canShareFamily: boolean
    maxDownloads: number
    skipLimit: number
  }
}

export interface UpdateSubscriptionRequest {
  plan: SubscriptionType
  period?: 'monthly' | 'yearly'
}
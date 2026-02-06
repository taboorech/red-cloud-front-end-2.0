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

export interface SubscriptionUpdateResponse {
  success: 'OK'
  data: string
}

export interface UpdateSubscriptionRequest {
  subscriptionPlanId: number
  priceId: number
}

export interface GetPaymentUrlRequest {
  subscriptionPlanId: number
  priceId: number
}

export interface GetPaymentUrlResponse {
  url: string
}

export interface ApiSubscriptionResponse {
  status: string
  data: {
    id: number
    user_id: number
    subscription_plan_id: number
    status: string
    started_at: string
    current_period_end: string | null
  }
}

export interface ApiPlanPrice {
  id: number
  amount: string
  currency: string
  billing_interval: 'month' | 'year'
}

export interface ApiPlan {
  id: number
  title: string
  description: string
  sort_order: number
  prices: ApiPlanPrice[]
}

export interface ApiPlansResponse {
  status: string
  data: ApiPlan[]
}

export interface TransformedPlan {
  id: number
  subscriptionPlanId: number
  priceId: number
  yearlyPriceId?: number
  name: string
  description: string
  price: number
  yearlyPrice?: number | null
  period: string
  currency: string
  isPopular: boolean
  unavailable?: boolean
  features: string[]
}
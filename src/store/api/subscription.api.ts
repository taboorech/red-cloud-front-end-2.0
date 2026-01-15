import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'

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

// Helper function to get features based on plan
const getFeaturesByPlan = (plan: SubscriptionType) => {
  const featuresMap = {
    free: {
      canDownload: false,
      canSkipUnlimited: false,
      hasHighQuality: false,
      hasLyrics: false,
      isAdFree: false,
      canShareFamily: false,
      maxDownloads: 0,
      skipLimit: 6,
    },
    premium: {
      canDownload: true,
      canSkipUnlimited: true,
      hasHighQuality: true,
      hasLyrics: true,
      isAdFree: true,
      canShareFamily: false,
      maxDownloads: Infinity,
      skipLimit: Infinity,
    },
    family: {
      canDownload: true,
      canSkipUnlimited: true,
      hasHighQuality: true,
      hasLyrics: true,
      isAdFree: true,
      canShareFamily: true,
      maxDownloads: Infinity,
      skipLimit: Infinity,
    },
  }
  return featuresMap[plan]
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    // Get current subscription
    getCurrentSubscription: builder.query<SubscriptionResponse, void>({
      // Real API endpoint (comment out for production use):
      // query: () => ({ url: '/subscription', method: 'GET' }),
      
      // Mock implementation for development
      async queryFn() {
        const savedPlan = (localStorage.getItem('subscriptionPlan') as SubscriptionType) || 'free'

        const mockSubscription: SubscriptionResponse = {
          subscription: {
            id: '1',
            userId: 'user-1',
            plan: savedPlan,
            status: 'active',
            startDate: new Date().toISOString(),
            expiresAt:
              savedPlan !== 'free'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : null,
            autoRenew: savedPlan !== 'free',
          },
          features: getFeaturesByPlan(savedPlan),
        }

        return { data: mockSubscription }
      },
      providesTags: ['Subscription'],
    }),

    // Update subscription (upgrade/downgrade)
    updateSubscription: builder.mutation<SubscriptionResponse, UpdateSubscriptionRequest>({
      // Real API endpoint (comment out for production use):
      // query: (body) => ({
      //   url: '/subscription',
      //   method: 'PUT',
      //   data: body,
      // }),

      // Mock implementation for development
      async queryFn(arg) {
        localStorage.setItem('subscriptionPlan', arg.plan)

        const mockResponse: SubscriptionResponse = {
          subscription: {
            id: '1',
            userId: 'user-1',
            plan: arg.plan,
            status: 'active',
            startDate: new Date().toISOString(),
            expiresAt:
              arg.plan !== 'free'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : null,
            autoRenew: arg.plan !== 'free',
          },
          features: getFeaturesByPlan(arg.plan),
        }

        return { data: mockResponse }
      },
      invalidatesTags: ['Subscription'],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<SubscriptionResponse, void>({
      // Real API endpoint (comment out for production use):
      // query: () => ({
      //   url: '/subscription/cancel',
      //   method: 'POST',
      // }),

      // Mock implementation for development
      async queryFn() {
        localStorage.setItem('subscriptionPlan', 'free')

        const mockResponse: SubscriptionResponse = {
          subscription: {
            id: '1',
            userId: 'user-1',
            plan: 'free',
            status: 'cancelled',
            startDate: new Date().toISOString(),
            expiresAt: null,
            autoRenew: false,
          },
          features: getFeaturesByPlan('free'),
        }

        return { data: mockResponse }
      },
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetCurrentSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi

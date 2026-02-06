import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type {
  SubscriptionType,
  SubscriptionResponse,
  GetPaymentUrlRequest,
  GetPaymentUrlResponse,
  ApiSubscriptionResponse,
  ApiPlansResponse,
  TransformedPlan
} from '../../types/subscription.types'

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
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    // Get current subscription
    getCurrentSubscription: builder.query<SubscriptionResponse, void>({
      query: () => ({ url: '/v1/payment/current-subscription', method: 'GET' }),
      transformResponse: (response: ApiSubscriptionResponse) => {
        if (response?.status === 'OK' && response?.data) {
          const data = response.data
          
          // Map subscription_plan_id to plan type
          const getPlanType = (subscriptionPlanId: number): SubscriptionType => {
            switch (subscriptionPlanId) {
              case 1: return 'free'
              case 2: return 'premium'
              case 3: return 'family'
              default: return 'free'
            }
          }
          
          const planType = getPlanType(data.subscription_plan_id || 1)
          
          return {
            subscription: {
              id: data.id?.toString() || '1',
              userId: data.user_id?.toString() || 'user-1',
              plan: planType,
              status: (data.status === 'cancelled' || data.status === 'expired') ? data.status as 'cancelled' | 'expired' : 'active',
              startDate: data.started_at || new Date().toISOString(),
              expiresAt: data.current_period_end || null,
              autoRenew: data.status === 'active'
            },
            features: getFeaturesByPlan(planType)
          }
        }
        
        // Fallback for users without subscription
        return {
          subscription: {
            id: '1',
            userId: 'user-1',
            plan: 'free' as SubscriptionType,
            status: 'active' as const,
            startDate: new Date().toISOString(),
            expiresAt: null,
            autoRenew: false
          },
          features: getFeaturesByPlan('free')
        }
      },
      providesTags: ['Subscription'],
    }),

    getPaymentUrl: builder.mutation<GetPaymentUrlResponse, GetPaymentUrlRequest>({
      query: ({ subscriptionPlanId, priceId }) => ({
        url: '/v1/payment/subscription',
        method: 'GET',
        params: { subscriptionPlanId, priceId },
      }),
      transformResponse: (response: { status?: string; data?: string | { url: string } } | { url: string }) => {
        // Handle different response formats from backend
        if ('status' in response && response?.status === 'OK') {
          if (typeof response.data === 'string') {
            return { url: response.data }
          }

          return response.data as { url: string }
        }
        // If response is directly { url: "..." }
        return response as { url: string }
      },
    }),

    // Get subscription plans (public endpoint)
    getPlans: builder.query<TransformedPlan[], void>({
      query: () => ({ url: '/v1/payment/plans', method: 'GET' }),
      transformResponse: (response: ApiPlansResponse) => {
        const plans = response.data || []
        
        // Transform backend plans to frontend format
        const transformedPlans = plans.map(plan => {
          // Handle Free plan separately
          if (plan.id === 1 || plan.title.toLowerCase().includes('free')) {
            return {
              id: plan.id,
              subscriptionPlanId: plan.id,
              priceId: plan.id,
              name: plan.title,
              description: plan.description,
              price: 0,
              period: 'forever',
              currency: 'USD',
              isPopular: false,
              features: [
                'Ad-supported streaming',
                'Standard quality audio',
                'Limited skips',
                'Offline listening',
                'Unlimited downloads', 
                'Ad-free experience',
                'Lyrics support'
              ]
            }
          }

          // Find monthly and yearly prices
          const monthlyPrice = plan.prices?.find(p => p.billing_interval === 'month') || plan.prices?.[0]
          const yearlyPrice = plan.prices?.find(p => p.billing_interval === 'year')
          
          return {
            id: plan.id,
            subscriptionPlanId: plan.id,
            priceId: monthlyPrice?.id || plan.id,
            yearlyPriceId: yearlyPrice?.id,
            name: plan.title,
            description: plan.description,
            price: monthlyPrice?.amount ? parseFloat(monthlyPrice.amount) : 9.99,
            yearlyPrice: yearlyPrice?.amount ? parseFloat(yearlyPrice.amount) : null,
            period: 'monthly',
            currency: monthlyPrice?.currency?.toUpperCase() || 'USD',
            isPopular: plan.sort_order === 2, // Premium plan is popular
            features: [
              'Unlimited skips',
              'High quality audio',
              'Ad-free listening',
              'Offline downloads',
              'Lyrics support'
            ]
          }
        })

        // Add mocked Family plan (blocked)
        const familyPlan: TransformedPlan = {
          id: 999,
          subscriptionPlanId: 999,
          priceId: 999,
          name: 'Family Plan',
          description: 'Premium for up to 6 family members',
          price: 14.99,
          period: 'monthly',
          currency: 'USD',
          isPopular: false,
          unavailable: true,
          features: [
            'All Premium features',
            'Up to 6 accounts',
            'Individual profiles',
            'Kid-safe mode',
            'Family sharing'
          ]
        }

        return [...transformedPlans, familyPlan]
      },
    }),

    // Activate trial premium
    activateTrialPremium: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/v1/payment/trial',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    // Cancel subscription
    cancelSubscription: builder.mutation<SubscriptionResponse, void>({
      query: () => ({
        url: '/v1/payment/subscription',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetCurrentSubscriptionQuery,
  useGetPaymentUrlMutation,
  useCancelSubscriptionMutation,
  useGetPlansQuery,
  useActivateTrialPremiumMutation,
} = subscriptionApi

import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type { User } from '../../types/user.types'

export interface SetUserPlanRequest {
  userId: number
  planId: number
  /** Absolute expiry ISO timestamp; pass null for indefinite. */
  expiresAt: string | null
}

export interface GiftSubscriptionRequest {
  userId: number
  /** Required only if the user has no active subscription. */
  planId?: number
  /** Days to add (positive int); pass null to gift "forever". */
  days: number | null
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<{ data: User[] }, { search?: string; limit?: number; offset?: number; ids?: string[] }>({
      query: (params) => ({
        url: '/v1/users/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation<void, { userId: number; role: string }>({
      query: (data) => ({
        url: '/v1/users/role',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Users'],
    }),
    changeUserAccess: builder.mutation<void, { userId: number; action: string }>({
      query: (data) => ({
        url: '/v1/users/change-access',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Users'],
    }),
    setUserPlan: builder.mutation<void, SetUserPlanRequest>({
      query: ({ userId, planId, expiresAt }) => ({
        url: `/v1/users/${userId}/subscription`,
        method: 'PUT',
        data: { planId, expiresAt },
      }),
      invalidatesTags: ['Users'],
    }),
    giftSubscription: builder.mutation<void, GiftSubscriptionRequest>({
      query: ({ userId, planId, days }) => ({
        url: `/v1/users/${userId}/subscription/gift`,
        method: 'POST',
        data: { planId, days },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useChangeUserAccessMutation,
  useSetUserPlanMutation,
  useGiftSubscriptionMutation,
} = usersApi;
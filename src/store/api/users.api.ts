import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type { User } from '../../types/user.types'

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
  }),
});

export const {
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useChangeUserAccessMutation,
} = usersApi;
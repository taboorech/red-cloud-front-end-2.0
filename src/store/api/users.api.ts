import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type { User } from '../../types/user.types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllUsers: builder.query<{ data: User[] }, { search?: string; limit?: number; offset?: number; ids?: string[] }>({
      query: (params) => ({
        url: '/v1/users/all',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { 
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
} = usersApi;
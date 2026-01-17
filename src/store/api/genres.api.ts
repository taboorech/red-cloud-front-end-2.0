import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axios-base-query';
import type { GetGenresParams, GetGenresResponse } from '../../types/genre.types';

export const genresApi = createApi({
  reducerPath: 'genresApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Genre'],
  endpoints: (builder) => ({
    getGenres: builder.query<GetGenresResponse, GetGenresParams | void>({
      query: (params) => ({
        url: '/v1/genres',
        method: 'GET',
        params: params ? {
          offset: params.offset,
          limit: params.limit,
          search: params.search,
          ids: params.ids?.join(','),
        } : {},
      }),
      providesTags: ['Genre'],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useLazyGetGenresQuery
} = genresApi;
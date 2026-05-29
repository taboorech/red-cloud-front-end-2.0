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
    createGenre: builder.mutation<void, { title: string }>({
      query: (body) => ({
        url: '/v1/genres',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Genre'],
    }),
    updateGenre: builder.mutation<void, { id: number; title: string }>({
      query: ({ id, title }) => ({
        url: `/v1/genres/${id}`,
        method: 'PUT',
        data: { title },
      }),
      invalidatesTags: ['Genre'],
    }),
    deleteGenre: builder.mutation<void, number>({
      query: (id) => ({
        url: `/v1/genres/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Genre'],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useLazyGetGenresQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genresApi;

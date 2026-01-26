import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type { GetPlaylistsRequest, GetPlaylistsResponse } from "../../types/playlist.types";

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    getPlaylists: builder.query({
      query: (params: GetPlaylistsRequest) => ({
        url: '/v1/playlists',
        method: 'GET',
        params,
      }),
      transformResponse: (response: GetPlaylistsResponse) => response.data,
      providesTags: ['Playlist'],
    }),
    getPlaylist: builder.query({
      query: (id: string) => ({
        url: `/v1/playlists/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Playlist', id }],
    }),
    createPlaylist: builder.mutation({
      query: (formData: FormData) => ({
        url: '/v1/playlists',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: builder.mutation({
      query: (formData: FormData) => ({
        url: `/v1/playlists/${formData.get('id')}`,
        method: 'PUT',
        data: formData,
      }),
      invalidatesTags: ['Playlist'],
    }),
  }),
});

export const {
  useLazyGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistApi;
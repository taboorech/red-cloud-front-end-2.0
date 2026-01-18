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
    })
  }),
});

export const {
  useLazyGetPlaylistsQuery
} = playlistApi;
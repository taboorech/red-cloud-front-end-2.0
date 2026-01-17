import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type {
  Song,
  CreateSongRequest,
  CreateSongResponse,
  UpdateSongRequest,
  UpdateSongResponse,
  GetSongsResponse,
  GetSongResponse,
} from '../../types/song.types'

export const songsApi = createApi({
  reducerPath: 'songsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Song'],
  endpoints: (builder) => ({
    // getSongs: builder.query<{ songs: Song[]; total: number; page: number; limit: number }, { page?: number; limit?: number; search?: string }>({
    //   query: ({ page = 1, limit = 20, search }) => ({
    //     url: '/v1/songs',
    //     method: 'GET',
    //     params: { page, limit, search },
    //   }),
    //   transformResponse: (response: GetSongsResponse) => response.data,
    //   providesTags: ['Song'],
    // }),
    getSong: builder.query<Song, string>({
      query: (songId) => ({
        url: `/v1/songs/${songId}`,
        method: 'GET',
      }),
      transformResponse: (response: GetSongResponse) => response.data,
      providesTags: (_, __, songId) => [{ type: 'Song', id: songId }],
    }),
    createSong: builder.mutation<Song, CreateSongRequest>({
      query: ({ title, artist, album, genre, year, song, image }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        if (album) formData.append('album', album);
        if (genre) formData.append('genre', genre);
        if (year) formData.append('year', year.toString());
        formData.append('song', song);
        if (image) formData.append('image', image);

        return {
          url: '/v1/songs',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      transformResponse: (response: CreateSongResponse) => response.data,
      invalidatesTags: ['Song'],
    }),
    updateSong: builder.mutation<Song, { songId: string } & UpdateSongRequest>({
      query: ({ songId, title, artist, album, genre, year, image }) => {
        const formData = new FormData();
        if (title) formData.append('title', title);
        if (artist) formData.append('artist', artist);
        if (album) formData.append('album', album);
        if (genre) formData.append('genre', genre);
        if (year) formData.append('year', year.toString());
        if (image) formData.append('image', image);

        return {
          url: `/v1/songs/${songId}`,
          method: 'PUT',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      transformResponse: (response: UpdateSongResponse) => response.data,
      invalidatesTags: (_, __, { songId }) => [{ type: 'Song', id: songId }, 'Song'],
    }),
    deleteSong: builder.mutation<void, string>({
      query: (songId) => ({
        url: `/v1/songs/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, songId) => [{ type: 'Song', id: songId }, 'Song'],
    }),
    getFavoriteSongs: builder.query<Song[], void>({
      query: () => ({
        url: '/v1/songs/favorites',
        method: 'GET',
      }),
      transformResponse: (response: GetSongsResponse) => response.data.songs,
      providesTags: ['Song'],
    }),
    toggleFavoriteSong: builder.mutation<void, string>({
      query: (songId) => ({
        url: `/v1/songs/${songId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, songId) => [{ type: 'Song', id: songId }, 'Song'],
    }),
    likeSong: builder.mutation<void, string>({
      query: (songId) => ({
        url: `/v1/songs/${songId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, songId) => [{ type: 'Song', id: songId }],
    }),
    dislikeSong: builder.mutation<void, string>({
      query: (songId) => ({
        url: `/v1/songs/${songId}/dislike`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, songId) => [{ type: 'Song', id: songId }],
    }),
  }),
});

export const {
  // useGetSongsQuery,
  useGetSongQuery,
  useCreateSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
  useGetFavoriteSongsQuery,
  useToggleFavoriteSongMutation,
  useLikeSongMutation,
  useDislikeSongMutation,
} = songsApi;
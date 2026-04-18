import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axios-base-query';
import type {
  GenerateImageParams,
  GenerateImageResponse,
  GenerateLyricsParams,
  GenerateLyricsResponse,
  GeneratePlaylistCoverParams,
  GeneratePlaylistCoverResponse,
  AdminAIActivityParams,
  AdminAIActivityResponse,
} from '../../types/ai.types';

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    generateImage: builder.mutation<GenerateImageResponse, GenerateImageParams>({
      query: (params) => ({
        url: '/v1/ai/generate-image',
        method: 'POST',
        data: params,
      }),
    }),
    generateLyrics: builder.mutation<GenerateLyricsResponse, GenerateLyricsParams>({
      query: ({ audioFile, songId }) => {
        const formData = new FormData();

        if (audioFile) {
          formData.append('audioFile', audioFile);
        }
        if (songId) {
          formData.append('songId', songId);
        }

        return {
          url: '/v1/ai/generate-lyrics',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
    generatePlaylistCover: builder.mutation<GeneratePlaylistCoverResponse, GeneratePlaylistCoverParams>({
      query: ({ playlistId, prompt }) => ({
        url: `/v1/ai/playlists/${playlistId}/generate-cover`,
        method: 'POST',
        data: prompt ? { prompt } : {},
      }),
    }),
    getAdminAIActivity: builder.query<AdminAIActivityResponse, AdminAIActivityParams>({
      query: (params) => ({
        url: '/v1/ai/users-activity',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useGenerateImageMutation,
  useGenerateLyricsMutation,
  useGeneratePlaylistCoverMutation,
  useGetAdminAIActivityQuery,
} = aiApi;

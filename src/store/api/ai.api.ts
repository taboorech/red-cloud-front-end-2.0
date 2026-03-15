import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axios-base-query';

export interface GenerateImageParams {
  prompt: string;
}

export interface GenerateImageResponse {
  data: {
    imageUrl: string;
  }
}

export interface GenerateLyricsParams {
  audioFile?: File;
  songId?: string;
  model?: string;
}

export interface GenerateLyricsResponse {
  data: string;
}

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
  }),
});

export const {
  useGenerateImageMutation,
  useGenerateLyricsMutation,
} = aiApi;
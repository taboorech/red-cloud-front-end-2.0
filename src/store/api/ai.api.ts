import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../api/axios-base-query';

export interface GenerateImageParams {
  prompt: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
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
  }),
});

export const {
  useGenerateImageMutation,
} = aiApi;
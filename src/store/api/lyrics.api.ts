import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'

export type SupportedLanguage = 'en-US' | 'uk' | 'es' | 'fr' | 'de' | 'it' | 'pl' | 'pt-PT'

export interface TranslateLyricsRequest {
  songId: string
  targetLanguage: SupportedLanguage
  sourceLanguage: SupportedLanguage
}

export interface TranslateLyricsResponse {
  originalText: string
  translatedText: string
  sourceLanguage: SupportedLanguage
  targetLanguage: SupportedLanguage
}

export const lyricsApi = createApi({
  reducerPath: 'lyricsApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    translateLyrics: builder.query<TranslateLyricsResponse, TranslateLyricsRequest>({
      query: ({ songId, targetLanguage, sourceLanguage }) => ({
        url: `/lyrics/${songId}/translate`,
        method: 'GET',
        params: {
          targetLanguage,
          sourceLanguage,
        },
      }),
    }),
  }),
})

export const { useTranslateLyricsQuery, useLazyTranslateLyricsQuery } = lyricsApi

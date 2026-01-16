import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../../api/axios-base-query'
import type {
  SupportedLanguage,
  LanguageOption,
  LanguagesResponse,
  SongLyricsResponse,
  TranslateLyricsRequest,
  TranslateLyricsResponse
} from '../../types/lyrics.types'

export const lyricsApi = createApi({
  reducerPath: 'lyricsApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getSupportedLanguages: builder.query<LanguageOption[], void>({
      query: () => ({
        url: '/v1/lyrics/languages',
        method: 'GET',
      }),
      transformResponse: (response: LanguagesResponse) => response.data.languages,
    }),
    getSongLyrics: builder.query<{ lyrics: string; language: SupportedLanguage }, string>({
      query: (songId) => ({
        url: `/v1/lyrics/${songId}`,
        method: 'GET',
      }),
      transformResponse: (response: SongLyricsResponse) => ({
        lyrics: response.data.lyrics,
        language: response.data.language,
      }),
    }),
    translateLyrics: builder.query<{ originalText: string; translatedText: string; targetLanguage: string }, TranslateLyricsRequest>({
      query: ({ songId, targetLanguage }) => ({
        url: `/v1/lyrics/${songId}/translate`,
        method: 'GET',
        params: {
          targetLanguage
        },
      }),
      transformResponse: (response: TranslateLyricsResponse) => response.data,
    }),
  }),
})

export const { 
  useGetSupportedLanguagesQuery,
  useGetSongLyricsQuery,
  useLazyGetSongLyricsQuery,
  useTranslateLyricsQuery, 
  useLazyTranslateLyricsQuery 
} = lyricsApi

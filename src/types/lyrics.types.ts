export type SupportedLanguage = 'EN' | 'UK' | 'ES' | 'FR' | 'DE' | 'IT' | 'PL' | 'PT'

export interface LanguageOption {
  code: SupportedLanguage
  name: string
  flag: string
}

export interface LanguagesResponse {
  status: string
  data: {
    languages: LanguageOption[]
    total: number
  }
}

export interface SongLyricsResponse {
  status: string
  data: {
    songId: number
    title: string
    lyrics: string
    language: SupportedLanguage
    duration: number
    imageUrl: string | null
  }
}

export interface TranslateLyricsRequest {
  songId: string
  targetLanguage: SupportedLanguage
  sourceLanguage: SupportedLanguage
}

export interface TranslateLyricsResponse {
  status: string
  data: {
    songId: number
    songTitle: string
    originalText: string
    translatedText: string
    sourceLanguage: SupportedLanguage
    targetLanguage: string
    detectedSourceLang: string
  }
}
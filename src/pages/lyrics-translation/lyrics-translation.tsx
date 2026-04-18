import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '../../hooks/use-subscription'
import { MdTranslate } from 'react-icons/md'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'
import {
  useLazyGetUserTranslationQuery,
  useGetSupportedLanguagesQuery,
  useGetSongLyricsQuery,
} from '../../store/api/lyrics.api'
import type { SupportedLanguage } from '../../types/lyrics.types'
import { Helmet } from 'react-helmet-async'

const LyricsTranslation = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { hasLyrics: hasTranslation } = useSubscription()
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('UK')
  
  const songId = searchParams.get('id') || ''
  
  const { data: languages = [], isLoading: languagesLoading } = useGetSupportedLanguagesQuery()
  const { data: lyricsData } = useGetSongLyricsQuery(songId, { skip: !songId })
  const [translateLyrics, { data, isLoading, error }] = useLazyGetUserTranslationQuery()

  const detectedLangCode = (data?.detectedSourceLang || lyricsData?.language || '') as SupportedLanguage
  const originalLanguage: SupportedLanguage = detectedLangCode || 'EN'
  const originalLanguageDisplay = detectedLangCode
    ? languages.find(l => l.code === detectedLangCode)?.name || detectedLangCode
    : 'Not detected'
  const originalLanguageFlag = detectedLangCode
    ? languages.find(l => l.code === detectedLangCode)?.flag || '🏳️'
    : '?'

  useEffect(() => {
    if (selectedLanguage !== originalLanguage) {
      translateLyrics({
        songId,
        targetLanguage: selectedLanguage,
        sourceLanguage: originalLanguage,
      })
    }
  }, [selectedLanguage, originalLanguage, songId, translateLyrics])

  const originalLyrics = data?.originalText || lyricsData?.lyrics || ''
  const translatedText = data?.translatedText || ''

  if (!hasTranslation) {
    return (
      <>
        <Helmet>
          <title>{t('pageTitles.lyrics')}</title>
        </Helmet>
        <PremiumFeatureLock
          icon={<MdTranslate className="w-24 h-24 mx-auto mb-6 text-gray-400" />}
          title={t('lyrics.premiumTitle')}
          description={t('lyrics.translationPremiumDescription')}
          onUpgrade={() => navigate('/subscriptions')}
          onGoBack={() => navigate(-1)}
        />
      </>
    )
  }

  if (languagesLoading) {
    return (
      <>
        <Helmet>
          <title>{t('pageTitles.lyrics')}</title>
        </Helmet>
        <div className="flex items-center justify-center h-full bg-black">
          <div className="text-gray-400 text-sm">{t('lyrics.loadingLanguages')}</div>
        </div>
      </>
    )
  }


  return (
    <>
      <Helmet>
        <title>{t('pageTitles.lyricsTranslation')}</title>
      </Helmet>
      <div className="flex flex-col h-full bg-white dark:bg-black p-6">
        <div className="flex-shrink-0 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('lyrics.original')}</span>
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700">
              <span>{originalLanguageFlag} {originalLanguageDisplay}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('lyrics.translateTo')}</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col min-h-0">
              <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2 flex-shrink-0">
                <span>{originalLanguageFlag}</span>
                <span>Original ({originalLanguageDisplay})</span>
              </h2>
              <div className="flex-1 min-h-0 rounded-2xl p-6 overflow-y-scroll">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-sm">{t('common.loading')}</div>
                  </div>
                ) : (
                  <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {originalLyrics || t('lyrics.noLyricsAvailable')}
                  </pre>
                )}
              </div>
            </div>

            <div className="flex flex-col min-h-0">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2 flex-shrink-0">
                <span>{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
              </h2>
              <div className="flex-1 min-h-0 bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/20 overflow-y-scroll">
                {selectedLanguage === originalLanguage ? (
                  <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                    {originalLyrics || t('lyrics.noLyricsAvailable')}
                  </pre>
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-sm">Translating...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 text-sm">Translation failed. Please try again.</div>
                  </div>
                ) : (
                  <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                    {translatedText || 'Translation not available'}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LyricsTranslation

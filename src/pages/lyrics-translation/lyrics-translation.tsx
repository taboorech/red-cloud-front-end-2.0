import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useSubscription } from '../../hooks/use-subscription'
import { MdTranslate } from 'react-icons/md'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'
import { NoLyricsAvailable } from '../../components/no-lyrics-available/no-lyrics-available'
import { 
  useLazyTranslateLyricsQuery, 
  useGetSupportedLanguagesQuery,
  useGetSongLyricsQuery,
} from '../../store/api/lyrics.api'
import type { SupportedLanguage } from '../../types/lyrics.types'

const LyricsTranslation = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { hasLyrics: hasTranslation } = useSubscription()
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('UK')
  
  const songId = searchParams.get('id') || ''
  
  const { data: languages = [], isLoading: languagesLoading } = useGetSupportedLanguagesQuery()
  const { data: lyricsData } = useGetSongLyricsQuery(songId)
  const [translateLyrics, { data, isLoading, error }] = useLazyTranslateLyricsQuery()

  const originalLanguage: SupportedLanguage = lyricsData?.language || 'EN'
  const originalLanguageDisplay = lyricsData?.language 
    ? languages.find(l => l.code === lyricsData.language)?.name || 'Unknown'
    : 'Not detected'
  const originalLanguageFlag = lyricsData?.language 
    ? languages.find(l => l.code === lyricsData.language)?.flag || '🏳️'
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
  const hasLyrics = !!(data?.originalText || lyricsData?.lyrics)
  
  const translatedText = data?.translatedText || ''

  if (!hasTranslation) {
    return (
      <PremiumFeatureLock
        icon={<MdTranslate className="w-24 h-24 mx-auto mb-6 text-gray-400" />}
        title="Premium Feature"
        description="Lyrics translation is available only for Premium and Family subscribers. Upgrade your plan to unlock translations."
        onUpgrade={() => navigate('/subscriptions')}
        onGoBack={() => navigate(-1)}
      />
    )
  }

  if (languagesLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-gray-400 text-sm">Loading languages...</div>
      </div>
    )
  }

  if (!hasLyrics) {
    return <NoLyricsAvailable onGoBack={() => navigate(-1)} />
  }

  return (
    <div className="flex flex-col h-full bg-black p-6">
      <div className="flex-shrink-0 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Original:</span>
          <div className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700">
            <span>{originalLanguageFlag} {originalLanguageDisplay}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Translate to:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:outline-none focus:border-gray-600"
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
              <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-gray-300">
                {originalLyrics || 'No lyrics available'}
              </pre>
            </div>
          </div>

          <div className="flex flex-col min-h-0">
            <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2 flex-shrink-0">
              <span>{languages.find(l => l.code === selectedLanguage)?.flag}</span>
              <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
            </h2>
            <div className="flex-1 min-h-0 bg-purple-900/10 rounded-2xl p-6 border border-purple-500/20 overflow-y-scroll">
              {selectedLanguage === originalLanguage ? (
                <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-white">
                  {originalLyrics || 'No lyrics available'}
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
                <pre className="font-sans text-base leading-relaxed whitespace-pre-wrap text-white">
                  {translatedText || 'Translation not available'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LyricsTranslation

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '../../hooks/use-subscription'
import { Button } from '../../components/button/button'
import { MdTranslate, MdLyrics } from 'react-icons/md'
import { IoSparkles } from 'react-icons/io5'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'
import { NoLyricsAvailable } from '../../components/no-lyrics-available/no-lyrics-available'
import { useGetSongLyricsQuery } from '../../store/api/lyrics.api'
import { useGenerateLyricsMutation } from '../../store/api/ai.api'
import { Helmet } from 'react-helmet-async'

const Lyrics = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { hasLyrics, isPremium } = useSubscription()
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null)

  const songId = searchParams.get('id') || ''
  const { data: lyricsData, isLoading, error } = useGetSongLyricsQuery(songId, { skip: !songId })
  const [generateLyrics, { isLoading: isGenerating }] = useGenerateLyricsMutation()

  const authorLyrics = lyricsData?.lyrics || ''
  const displayLyrics = authorLyrics || generatedLyrics || ''
  const hasLyricsAvailable = !!displayLyrics

  const handleGenerate = async () => {
    const result = await generateLyrics({ songId }).unwrap()
    setGeneratedLyrics(result.data)
  }

  if (!hasLyrics) {
    return (
      <>
        <Helmet>
          <title>{t('pageTitles.lyrics')}</title>
        </Helmet>
        <PremiumFeatureLock
          icon={<MdLyrics className="w-24 h-24 mx-auto mb-6 text-gray-400" />}
          title={t('lyrics.premiumTitle')}
          description={t('lyrics.premiumDescription')}
          onUpgrade={() => navigate('/subscriptions')}
          onGoBack={() => navigate(-1)}
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{t('pageTitles.lyrics')}</title>
        </Helmet>
        <div className="flex items-center justify-center h-full bg-white dark:bg-black">
          <div className="text-gray-500 dark:text-gray-400 text-sm">{t('common.loading')}</div>
        </div>
      </>
    )
  }

  if (error || (!hasLyricsAvailable && !isPremium)) {
    return (
      <>
        <Helmet>
          <title>{t('pageTitles.lyrics')}</title>
        </Helmet>
        <NoLyricsAvailable onGoBack={() => navigate(-1)} />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.lyrics')}</title>
      </Helmet>
      <div className="flex flex-col h-full bg-white dark:bg-black p-6">
        <div className="flex-shrink-0 pb-2 flex items-center justify-end gap-2">
          {isPremium && !authorLyrics && !generatedLyrics && (
            <Button onClick={handleGenerate} variant="snow" disabled={isGenerating} loading={isGenerating}>
              <div className="flex items-center gap-2">
                <IoSparkles className="w-4 h-4" />
                <span className="text-sm">
                  {isGenerating ? t('common.generating') : t('songEditor.generateLyricsWithAI')}
                </span>
              </div>
            </Button>
          )}
          {isPremium && hasLyricsAvailable && (
            <Button
              onClick={() => navigate(`/lyrics/translation?id=${encodeURIComponent(songId)}`)}
              variant="snow"
            >
              <div className="flex items-center gap-2">
                <MdTranslate className="w-4 h-4" />
                <span className="text-sm">{t('lyrics.translate')}</span>
              </div>
            </Button>
          )}
        </div>

        {!hasLyricsAvailable ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
              {t('lyrics.noLyricsDescription')}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 rounded-2xl p-8 pt-0 overflow-y-scroll">
            <div className="w-full max-w-2xl mx-auto text-center">
              <pre
                className="font-sans leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white text-base"
                style={{ lineHeight: '1.8' }}
              >
                {displayLyrics}
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Lyrics

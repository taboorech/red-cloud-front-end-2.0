import { useNavigate, useSearchParams } from 'react-router'
import { useSubscription } from '../../hooks/use-subscription'
import { Button } from '../../components/button/button'
import { MdTranslate, MdLyrics } from 'react-icons/md'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'
import { NoLyricsAvailable } from '../../components/no-lyrics-available/no-lyrics-available'
import { useGetSongLyricsQuery } from '../../store/api/lyrics.api'

const Lyrics = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { hasLyrics, isPremium } = useSubscription()

  const songId = searchParams.get('id') || ''
  const { data: lyricsData, isLoading, error } = useGetSongLyricsQuery(songId)
  
  const lyrics = lyricsData?.lyrics || ''
  const hasLyricsAvailable = !!lyrics

  if (!hasLyrics) {
    return (
      <PremiumFeatureLock
        icon={<MdLyrics className="w-24 h-24 mx-auto mb-6 text-gray-400" />}
        title="Premium Feature"
        description="Lyrics are available only for Premium and Family subscribers. Upgrade your plan to unlock song lyrics."
        onUpgrade={() => navigate('/subscriptions')}
        onGoBack={() => navigate(-1)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-gray-400 text-sm">Loading lyrics...</div>
      </div>
    )
  }

  if (error || !hasLyricsAvailable) {
    return <NoLyricsAvailable onGoBack={() => navigate(-1)} />
  }

  return (
    <div className="flex flex-col h-full bg-black p-6">
      <div className="flex-shrink-0 pb-2 flex items-center justify-end">
        {isPremium && (
          <Button
            onClick={() => navigate(`/lyrics/translation?id=${encodeURIComponent(songId)}`)}
            variant="snow"
          >
            <div className="flex items-center gap-2">
              <MdTranslate className="w-4 h-4" />
              <span className="text-sm">Translate</span>
            </div>
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 rounded-2xl p-8 pt-0 overflow-y-scroll">
        <div className="w-full max-w-2xl mx-auto text-center">
          <pre
            className="font-sans leading-relaxed whitespace-pre-wrap text-white text-base"
            style={{ lineHeight: '1.8' }}
          >
            {lyrics}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Lyrics

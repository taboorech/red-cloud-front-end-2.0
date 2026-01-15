import { useNavigate, useSearchParams } from 'react-router'
import { useSubscription } from '../../hooks/use-subscription'
import { Button } from '../../components/button/button'
import { MdTranslate, MdLyrics } from 'react-icons/md'
import { PremiumFeatureLock } from '../../components/premium-feature-lock/premium-feature-lock'

const Lyrics = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { hasLyrics, isPremium } = useSubscription()

  const songId = searchParams.get('id') || ''

  const mockLyrics = `In the silence of the night
Stars are shining oh so bright
Whispers carried on the breeze
Dancing through the willow trees

We're chasing dreams across the sky
Learning how to laugh and cry
Every moment feels so right
Together in the pale moonlight

Footsteps echo on the ground
Magic waiting to be found
Hearts are beating synchronized
Wonder gleaming in our eyes

We're chasing dreams across the sky
Learning how to laugh and cry
Every moment feels so right
Together in the pale moonlight

Time may fade but memories stay
Colors never turn to gray
In this moment we're alive
This is where our souls will thrive

We're chasing dreams across the sky
Learning how to laugh and cry
Every moment feels so right
Together in the pale moonlight

As the dawn breaks through the night
We'll hold on with all our might
Forever etched in melody
This beautiful symphony`

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
            {mockLyrics}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Lyrics

import { MdLyrics } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Button } from '../button/button'

interface NoLyricsAvailableProps {
  onGoBack: () => void
}

export const NoLyricsAvailable = ({ onGoBack }: NoLyricsAvailableProps) => {
  const { t } = useTranslation()
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-6">
      <MdLyrics className="w-24 h-24 mx-auto mb-6 text-gray-400" />
      <h2 className="text-xl font-medium text-white mb-2">{t('lyrics.noLyricsTitle')}</h2>
      <p className="text-gray-400 text-center mb-6">{t('lyrics.noLyricsDescription')}</p>
      <Button
        onClick={onGoBack}
        variant='outline'
      >
        {t('common.goBack')}
      </Button>
    </div>
  )
}
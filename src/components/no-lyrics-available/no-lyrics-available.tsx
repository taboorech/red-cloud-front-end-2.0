import { MdLyrics } from 'react-icons/md'
import { Button } from '../button/button'

interface NoLyricsAvailableProps {
  onGoBack: () => void
}

export const NoLyricsAvailable = ({ onGoBack }: NoLyricsAvailableProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-6">
      <MdLyrics className="w-24 h-24 mx-auto mb-6 text-gray-400" />
      <h2 className="text-xl font-medium text-white mb-2">No Lyrics Available</h2>
      <p className="text-gray-400 text-center mb-6">Lyrics for this song are not available at the moment.</p>
      <Button
        onClick={onGoBack}
        variant='outline'
      >
        Go Back
      </Button>
    </div>
  )
}
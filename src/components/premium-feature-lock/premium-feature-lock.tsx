import type { ReactNode } from 'react'
import { Button } from '../button/button'

interface PremiumFeatureLockProps {
  icon: ReactNode
  title: string
  description: string
  onUpgrade: () => void
  onGoBack: () => void
}

export const PremiumFeatureLock = ({
  icon,
  title,
  description,
  onUpgrade,
  onGoBack,
}: PremiumFeatureLockProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="max-w-md">
        {icon}
        <h2 className="text-2xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-gray-400 mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <Button variant='snow' onClick={onUpgrade}>Upgrade to Premium</Button>
          <Button variant='outline' onClick={onGoBack}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

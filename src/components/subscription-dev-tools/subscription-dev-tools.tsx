import { useState } from 'react'
import { useGetCurrentSubscriptionQuery, useUpdateSubscriptionMutation } from '../../store/api/subscription.api'
import { Button } from '../button/button'
import { IoClose } from 'react-icons/io5'

const SubscriptionDevTools = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: subscriptionData } = useGetCurrentSubscriptionQuery()
  const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation()

  const handlePlanChange = async (plan: 'free' | 'premium' | 'family') => {
    try {
      await updateSubscription({ plan }).unwrap()
    } catch (error) {
      console.error('Failed to update subscription:', error)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold"
      >
        Dev Tools
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 bg-black border border-white/20 rounded-xl p-4 shadow-2xl w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm">Subscription Dev Tools</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Current Plan</p>
          <p className="text-white font-semibold capitalize">
            {subscriptionData?.subscription.plan || 'Loading...'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-semibold">Switch Plan:</p>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              fullWidth
              onClick={() => handlePlanChange('free')}
              disabled={isLoading}
            >
              Free
            </Button>
            <Button
              size="sm"
              variant="primary"
              fullWidth
              onClick={() => handlePlanChange('premium')}
              disabled={isLoading}
            >
              Premium
            </Button>
            <Button
              size="sm"
              variant="secondary"
              fullWidth
              onClick={() => handlePlanChange('family')}
              disabled={isLoading}
            >
              Family
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDevTools

import { useState } from "react"
import { IoCheckmarkCircle, IoMusicalNotes, IoDownload, IoPhonePortrait, IoInfinite } from "react-icons/io5"
import { Button } from "../../components/button/button"
import { useSubscription } from "../../hooks/use-subscription"
import { useGetPaymentUrlMutation, useGetPlansQuery, useCancelSubscriptionMutation } from "../../store/api/subscription.api"
import { getCurrentPlanId } from "../../utils/format"

interface SubscriptionFeature {
  text: string
  included: boolean
}

interface SubscriptionPlan {
  id: number
  subscriptionPlanId: number
  priceId: number
  name: string
  price: number
  period: string
  popular?: boolean
  unavailable?: boolean
  features: SubscriptionFeature[]
  color: string
}

const Subscriptions = () => {
  const { currentPlan, isLoading } = useSubscription()
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")
  const [getPaymentUrl, { isLoading: isPaymentLoading }] = useGetPaymentUrlMutation()
  const [cancelSubscription, { isLoading: isCancelLoading }] = useCancelSubscriptionMutation()
  const { data: apiPlans, isLoading: isPlansLoading } = useGetPlansQuery()

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (plan.unavailable) return // Unavailable plans
    
    // If selecting free plan and user is on paid plan, cancel subscription
    if (plan.id === 1 && currentPlanId !== 1) {
      const confirmed = confirm('Are you sure you want to cancel your subscription and switch to the free plan?')
      if (confirmed) {
        try {
          await cancelSubscription().unwrap()
        } catch (error) {
          console.error('Failed to cancel subscription:', error)
        }
      }
      return
    }
    
    // If already on this plan, do nothing
    if (currentPlanId === plan.id) return
    
    try {
      console.log('Requesting payment URL for:', { subscriptionPlanId: plan.subscriptionPlanId, priceId: plan.priceId })
      const response = await getPaymentUrl({ 
        subscriptionPlanId: plan.subscriptionPlanId, 
        priceId: plan.priceId 
      }).unwrap()
      console.log('Payment URL response:', response)
      console.log('Payment URL:', response?.url)
      
      if (response?.url) {
        window.open(response.url, '_blank')
      } else {
        console.error('No payment URL received', response)
      }
    } catch (error) {
      console.error('Failed to get payment URL:', error)
    }
  }

  if (isLoading || isPlansLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Transform API plans to component format
  const plans: SubscriptionPlan[] = (apiPlans || []).map(apiPlan => {
    // Define which features are included based on plan type
    const getFeatures = () => {
      if (apiPlan.id === 1 || apiPlan.name.toLowerCase().includes('free')) {
        return [
          { text: 'Ad-supported streaming', included: true },
          { text: 'Standard quality audio', included: true },
          { text: 'Limited skips', included: true },
          { text: 'Offline listening', included: false },
          { text: 'Unlimited downloads', included: false },
          { text: 'Ad-free experience', included: false },
          { text: 'Lyrics support', included: false }
        ]
      }
      
      // Premium and other paid plans
      return apiPlan.features.map((feature: string) => ({
        text: feature,
        included: true
      }))
    }

    return {
      id: apiPlan.id,
      subscriptionPlanId: apiPlan.subscriptionPlanId,
      priceId: selectedPeriod === 'yearly' && apiPlan.yearlyPriceId ? apiPlan.yearlyPriceId : apiPlan.priceId,
      name: apiPlan.name,
      price: selectedPeriod === 'yearly' && apiPlan.yearlyPrice ? apiPlan.yearlyPrice : apiPlan.price,
      period: apiPlan.period === 'forever' ? 'forever' : (selectedPeriod === 'monthly' ? 'month' : 'year'),
      popular: apiPlan.isPopular,
      unavailable: apiPlan.unavailable,
      color: apiPlan.unavailable ? 'purple' : (apiPlan.isPopular ? 'blue' : 'gray'),
      features: getFeatures()
    }
  })

  const currentPlanId = getCurrentPlanId(currentPlan || 'free')
  const currentSubscription = plans.find((p) => p.id === currentPlanId)

  const benefits = [
    {
      icon: IoMusicalNotes,
      title: "Unlimited Music",
      description: "Access to millions of songs",
    },
    {
      icon: IoDownload,
      title: "Offline Listening",
      description: "Download and listen anywhere",
    },
    {
      icon: IoPhonePortrait,
      title: "Multi-Device",
      description: "Listen on phone, tablet, desktop",
    },
    {
      icon: IoInfinite,
      title: "Unlimited Skips",
      description: "Skip as many songs as you want",
    },
  ]

  return (
    <div className="flex flex-col h-full text-white overflow-y-auto bg-black pb-10 rounded-md">
      <div className="sticky top-0 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-xl z-20 border-b border-white/5">
        <div className="px-6 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Unlock unlimited music and premium features
          </p>
        </div>
      </div>

      <div className="px-6 space-y-10">
        {currentSubscription && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{currentSubscription.name}</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-400">
                    {currentSubscription.price === 0 ? (
                      "Free forever"
                    ) : (
                      <>
                        ${currentSubscription.price}/{currentSubscription.period} • Renews automatically
                      </>
                    )}
                  </p>
                </div>
                {currentPlanId !== 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                    disabled={isCancelLoading}
                    onClick={async () => {
                      const confirmed = confirm('Are you sure you want to cancel your subscription? You will be switched to the free plan.')
                      if (confirmed) {
                        try {
                          await cancelSubscription().unwrap()
                        } catch (error) {
                          console.error('Failed to cancel subscription:', error)
                        }
                      }
                    }}
                  >
                    {isCancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedPeriod === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative cursor-pointer ${
                selectedPeriod === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                -25%
              </span>
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all ${
                  plan.unavailable ? "opacity-60" : "hover:scale-[1.02]"
                } ${
                  plan.popular
                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-white/10"
                } ${currentPlanId === plan.id ? "ring-2 ring-green-500/50" : ""}`}
              >
                {plan.unavailable && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gray-600 text-white text-xs font-bold rounded-full shadow-lg">
                      COMING SOON
                    </span>
                  </div>
                )}
                {plan.popular && !plan.unavailable && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-gray-400 text-sm">/{plan.period}</span>
                  </div>
                  {selectedPeriod === "yearly" && plan.price > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${(plan.price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <IoCheckmarkCircle
                        className={`flex-shrink-0 mt-0.5 ${
                          feature.included
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                        size={18}
                      />
                      <span
                        className={`text-sm ${
                          feature.included ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={currentPlanId === plan.id ? "ghost" : plan.popular ? "primary" : "outline"}
                  className={
                    currentPlanId === plan.id
                      ? "bg-green-500/20 text-green-400 border-green-500/30 cursor-default"
                      : ""
                  }
                  disabled={plan.unavailable || isPaymentLoading || isCancelLoading}
                  onClick={() => handlePlanSelection(plan)}
                >
                  {currentPlanId === plan.id ? "Current Plan" : 
                   plan.unavailable ? "Coming Soon" : 
                   plan.id === 1 && currentPlanId !== 1 ? "Switch to Free" :
                   isPaymentLoading || isCancelLoading ? "Loading..." : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-6">Why Go Premium?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 p-5 rounded-xl hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/20 rounded-lg">
                    <benefit.icon className="text-blue-400" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Subscriptions

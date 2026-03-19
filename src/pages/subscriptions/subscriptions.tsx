import { useState } from "react"
import { IoCheckmarkCircle, IoMusicalNotes, IoPhonePortrait, IoInfinite } from "react-icons/io5"
import { useTranslation } from "react-i18next"
import { Button } from "../../components/button/button"
import { useSubscription } from "../../hooks/use-subscription"
import { useGetPaymentUrlMutation, useGetPlansQuery, useCancelSubscriptionMutation } from "../../store/api/subscription.api"
import { getCurrentPlanId } from "../../utils/format"
import { SubscriptionType } from "../../types/subscription.types"
import { Helmet } from "react-helmet-async"

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
  const { t } = useTranslation()
  const { currentPlan, isLoading } = useSubscription()
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")
  const [getPaymentUrl, { isLoading: isPaymentLoading }] = useGetPaymentUrlMutation()
  const [cancelSubscription, { isLoading: isCancelLoading }] = useCancelSubscriptionMutation()
  const { data: apiPlans, isLoading: isPlansLoading } = useGetPlansQuery()

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (plan.unavailable) return // Unavailable plans
    
    // If selecting free plan and user is on paid plan, cancel subscription
    if (plan.id === 1 && currentPlanId !== 1) {
      const confirmed = confirm(t('subscriptions.cancelConfirm'))
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
        <div className="text-white">{t('common.loading')}</div>
      </div>
    )
  }

  // Transform API plans to component format
  const plans: SubscriptionPlan[] = (apiPlans || []).map(apiPlan => {
    // Define which features are included based on plan type
    const getFeatures = () => {
      if (apiPlan.planType === SubscriptionType.FREE) {
        return [
          { text: t('subscriptions.features.adSupported'), included: true },
          { text: t('subscriptions.features.standardQuality'), included: true },
          { text: t('subscriptions.features.limitedSkips'), included: true },
          { text: t('subscriptions.features.offlineListening'), included: false },
          { text: t('subscriptions.features.unlimitedDownloads'), included: false },
          { text: t('subscriptions.features.adFree'), included: false },
          { text: t('subscriptions.features.lyricsSupport'), included: false }
        ]
      }
      
      if (apiPlan.planType === SubscriptionType.PREMIUM) {
        return [
          { text: t('subscriptions.features.unlimitedSkips'), included: true },
          { text: t('subscriptions.features.highQuality'), included: true },
          { text: t('subscriptions.features.adFreeListening'), included: true },
          { text: t('subscriptions.features.offlineListening'), included: true },
          { text: t('subscriptions.features.lyricsSupport'), included: true }
        ]
      }

      if (apiPlan.planType === SubscriptionType.FAMILY) {
        return [
          { text: t('subscriptions.features.allPremiumFeatures'), included: true },
          { text: t('subscriptions.features.upToSixAccounts'), included: true },
          { text: t('subscriptions.features.individualProfiles'), included: true },
          { text: t('subscriptions.features.kidSafeMode'), included: true },
          { text: t('subscriptions.features.familySharing'), included: true }
        ]
      }

      // Fallback
      return []
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
      title: t('subscriptions.benefits.unlimitedMusic'),
      description: t('subscriptions.benefits.unlimitedMusicDesc'),
    },
    {
      icon: IoPhonePortrait,
      title: t('subscriptions.benefits.multiDevice'),
      description: t('subscriptions.benefits.multiDeviceDesc'),
    },
    {
      icon: IoInfinite,
      title: t('subscriptions.benefits.unlimitedSkips'),
      description: t('subscriptions.benefits.unlimitedSkipsDesc'),
    },
  ]

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.subscriptions')}</title>
      </Helmet>
      <div className="flex flex-col h-full text-gray-900 dark:text-white overflow-y-auto bg-white dark:bg-black pb-10 rounded-md">
        <div className="sticky top-0 bg-gradient-to-b from-white dark:from-black via-white/95 dark:via-black/95 to-transparent backdrop-blur-xl z-20 border-b border-gray-200 dark:border-white/5">
          <div className="px-6 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {t('subscriptions.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {t('subscriptions.subtitle')}
            </p>
          </div>
        </div>

        <div className="px-6 space-y-10">
          {currentSubscription && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold mb-4">{t('subscriptions.currentPlan')}</h2>
              <div className="bg-gradient-to-br from-gray-50 dark:from-white/[0.08] to-gray-100/50 dark:to-white/[0.03] border border-gray-200 dark:border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{currentSubscription.name}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                        {t('subscriptions.active')}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {currentSubscription.price === 0 ? (
                        t('subscriptions.freeForever')
                      ) : (
                        <>
                          {/* ${currentSubscription.price}/{currentSubscription.period} •  */}
                          {t('subscriptions.renewsAutomatically')}
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
                        const confirmed = confirm(t('subscriptions.cancelConfirmDetailed'))
                        if (confirmed) {
                          try {
                            await cancelSubscription().unwrap()
                          } catch (error) {
                            console.error('Failed to cancel subscription:', error)
                          }
                        }
                      }}
                    >
                      {isCancelLoading ? t('subscriptions.cancelling') : t('subscriptions.cancelSubscription')}
                    </Button>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 dark:bg-white/5 rounded-full p-1 border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setSelectedPeriod("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  selectedPeriod === "monthly"
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {t('subscriptions.monthly')}
              </button>
              <button
                onClick={() => setSelectedPeriod("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative cursor-pointer ${
                  selectedPeriod === "yearly"
                    ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {t('subscriptions.yearly')}
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  -25%
                </span>
              </button>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-6">{t('subscriptions.availablePlans')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-gray-50 dark:bg-white/[0.03] border rounded-2xl p-6 transition-all ${
                    plan.unavailable ? "opacity-60" : "hover:scale-[1.02]"
                  } ${
                    plan.popular
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-gray-200 dark:border-white/10"
                  } ${currentPlanId === plan.id ? "ring-2 ring-green-500/50" : ""}`}
                >
                  {plan.unavailable && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gray-400 dark:bg-gray-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {t('subscriptions.comingSoonBadge')}
                      </span>
                    </div>
                  )}
                  {plan.popular && !plan.unavailable && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {t('subscriptions.mostPopular')}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/{plan.period}</span>
                    </div>
                    {selectedPeriod === "yearly" && plan.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        ${(plan.price / 12).toFixed(2)}/month {t('subscriptions.billedAnnually')}
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
                            feature.included ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
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
                    {currentPlanId === plan.id ? t('subscriptions.currentPlanButton') : 
                    plan.unavailable ? t('subscriptions.comingSoon') : 
                    plan.id === 1 && currentPlanId !== 1 ? t('subscriptions.switchToFree') :
                    isPaymentLoading || isCancelLoading ? t('common.loading') : t('subscriptions.getStarted')}
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-6">{t('subscriptions.whyGoPremium')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-500/20 rounded-lg">
                      <benefit.icon className="text-blue-400" size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Subscriptions

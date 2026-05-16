import { useState } from "react"
import { IoCheckmark, IoMusicalNote } from "react-icons/io5"
import { useTranslation } from "react-i18next"
import classNames from "classnames"
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
}

const Subscriptions = () => {
  const { t } = useTranslation()
  const { currentPlan, isLoading } = useSubscription()
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")
  const [getPaymentUrl, { isLoading: isPaymentLoading }] = useGetPaymentUrlMutation()
  const [cancelSubscription, { isLoading: isCancelLoading }] = useCancelSubscriptionMutation()
  const { data: apiPlans, isLoading: isPlansLoading } = useGetPlansQuery()

  const handlePlanSelection = async (plan: SubscriptionPlan) => {
    if (plan.unavailable) return

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

    if (currentPlanId === plan.id) return

    try {
      const response = await getPaymentUrl({
        subscriptionPlanId: plan.subscriptionPlanId,
        priceId: plan.priceId
      }).unwrap()

      if (response?.url) {
        window.open(response.url, '_blank')
      }
    } catch (error) {
      console.error('Failed to get payment URL:', error)
    }
  }

  if (isLoading || isPlansLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-app-text">{t('common.loading')}</div>
      </div>
    )
  }

  const plans: SubscriptionPlan[] = (apiPlans || []).map(apiPlan => {
    const getFeatures = (): SubscriptionFeature[] => {
      if (apiPlan.planType === SubscriptionType.FREE) {
        return [
          { text: t('subscriptions.features.adSupported'), included: true },
          { text: t('subscriptions.features.standardQuality'), included: true },
          { text: t('subscriptions.features.limitedSkips'), included: true },
          { text: t('subscriptions.features.offlineListening'), included: false },
        ]
      }

      if (apiPlan.planType === SubscriptionType.PREMIUM) {
        return [
          { text: t('subscriptions.features.adFreeListening'), included: true },
          { text: t('subscriptions.features.highQuality'), included: true },
          { text: t('subscriptions.features.unlimitedSkips'), included: true },
          { text: t('subscriptions.features.offlineListening'), included: true },
          { text: t('subscriptions.features.lyricsSupport'), included: true },
        ]
      }

      if (apiPlan.planType === SubscriptionType.FAMILY) {
        return [
          { text: t('subscriptions.features.allPremiumFeatures'), included: true },
          { text: t('subscriptions.features.upToSixAccounts'), included: true },
          { text: t('subscriptions.features.individualProfiles'), included: true },
          { text: t('subscriptions.features.kidSafeMode'), included: true },
        ]
      }

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
      features: getFeatures()
    }
  })

  const currentPlanId = getCurrentPlanId(currentPlan || 'free')
  const currentSubscription = plans.find((p) => p.id === currentPlanId)

  const periodLabel = (period: string) => {
    if (period === 'forever') return `/${t('subscriptions.forever')}`
    if (period === 'month') return `/${t('subscriptions.month')}`
    return `/${t('subscriptions.year')}`
  }

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.subscriptions')}</title>
      </Helmet>
      <div className="px-6 md:px-10 pt-8 pb-10 flex flex-col gap-8">
        <div>
          <span className="text-[11px] tracking-[0.18em] font-semibold text-brand-500 uppercase">
            {t('navigation.subscriptions')}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-app-text mt-2">
            {t('subscriptions.title')}
          </h1>
          <p className="text-app-text-muted text-sm md:text-base mt-2 max-w-2xl">
            {t('subscriptions.subtitle')}
          </p>
        </div>

        {currentSubscription && (
          <div className="bg-app-soft border border-app-line rounded-2xl p-5 flex items-center gap-4 flex-wrap">
            <span className="w-12 h-12 rounded-xl grid place-items-center bg-app-soft shrink-0">
              <IoMusicalNote className="w-5 h-5 text-app-text" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="text-app-text font-semibold">{currentSubscription.name}</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold tracking-wider rounded-full uppercase">
                  {t('subscriptions.active')}
                </span>
              </div>
              <p className="text-app-text-muted text-sm mt-1">
                {currentSubscription.price === 0 ? t('subscriptions.freeForever') : t('subscriptions.renewsAutomatically')} · {t('subscriptions.standardQuality')}
              </p>
            </div>
            {currentPlanId !== 1 && (
              <button
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
                className="text-sm text-app-text-soft hover:text-app-text transition cursor-pointer"
              >
                {isCancelLoading ? t('subscriptions.cancelling') : t('subscriptions.cancelSubscription')} →
              </button>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <div className="inline-flex bg-app-soft rounded-full p-1 border border-app-line">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              className={classNames(
                "px-5 h-9 rounded-full text-sm font-semibold transition cursor-pointer",
                selectedPeriod === "monthly"
                  ? "bg-white text-black"
                  : "text-app-text-muted hover:text-app-text"
              )}
            >
              {t('subscriptions.monthly')}
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              className={classNames(
                "px-5 h-9 rounded-full text-sm font-semibold transition cursor-pointer flex items-center gap-2",
                selectedPeriod === "yearly"
                  ? "bg-white text-black"
                  : "text-app-text-muted hover:text-app-text"
              )}
            >
              {t('subscriptions.yearly')}
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                -25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full mx-auto">
          {plans.map((plan) => {
            const isPopular = !!plan.popular && !plan.unavailable
            const isCurrent = currentPlanId === plan.id
            return (
              <div
                key={plan.id}
                className={classNames(
                  "relative rounded-2xl p-6 border transition flex flex-col",
                  isPopular
                    ? "bg-gradient-to-b from-brand-700/30 to-surface-1 border-brand-500 shadow-[0_0_40px_-10px_rgba(239,54,54,0.5)]"
                    : "bg-app-soft border-app-line",
                  plan.unavailable && "opacity-70"
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-brand-500 text-app-text text-[10px] font-bold tracking-wider uppercase rounded-full">
                    {t('subscriptions.mostPopular')}
                  </span>
                )}
                {plan.unavailable && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-neutral-700 text-app-text-soft text-[10px] font-bold tracking-wider uppercase rounded-full">
                    {t('subscriptions.comingSoonBadge')}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-app-text text-lg font-bold">{plan.name}</h3>
                  {isPopular && (
                    <span className="inline-flex items-center gap-1 text-brand-300 text-xs">
                      ✦ {t('subscriptions.noAds')}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-app-text">${plan.price}</span>
                  <span className="text-app-text-muted">{periodLabel(plan.period)}</span>
                </div>
                {selectedPeriod === "yearly" && plan.price > 0 && (
                  <p className="text-xs text-app-text-muted mt-1">
                    ${(plan.price * 12).toFixed(0)} {t('subscriptions.billedAnnually')}
                  </p>
                )}

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <IoCheckmark
                        className={classNames(
                          "mt-0.5 shrink-0",
                          feature.included ? "text-emerald-400" : "text-neutral-700"
                        )}
                      />
                      <span className={feature.included ? "text-app-text-soft" : "text-app-text-muted"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.unavailable || isPaymentLoading || isCancelLoading || isCurrent}
                  onClick={() => handlePlanSelection(plan)}
                  className={classNames(
                    "mt-6 h-11 rounded-full font-semibold text-sm transition cursor-pointer disabled:cursor-not-allowed",
                    isCurrent && "bg-app-soft text-app-text-muted",
                    !isCurrent && isPopular && "bg-white text-black hover:bg-neutral-200",
                    !isCurrent && !isPopular && !plan.unavailable && "bg-app-soft-2 text-app-text hover:bg-app-soft-2",
                    plan.unavailable && "bg-app-soft text-app-text-muted"
                  )}
                >
                  {isCurrent
                    ? t('subscriptions.currentPlanButton')
                    : plan.unavailable
                      ? t('subscriptions.comingSoon')
                      : plan.id === 1 && currentPlanId !== 1
                        ? t('subscriptions.switchToFree')
                        : isPaymentLoading || isCancelLoading
                          ? t('common.loading')
                          : isPopular
                            ? t('subscriptions.upgradeToPremium')
                            : t('subscriptions.getStarted')}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Subscriptions

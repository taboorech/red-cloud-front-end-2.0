import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import classNames from "classnames"
import Modal from "../../../components/modal/modal"
import {
  useGiftSubscriptionMutation,
  useSetUserPlanMutation,
} from "../../../store/api/users.api"
import { useGetPlansQuery } from "../../../store/api/subscription.api"
import { BRAND_BUTTON_BASE } from "../../../utils/tailwind-classes"
import type { User } from "../../../types/user.types"
import { extractApiMessage } from "../../../utils/api-error"

type DurationKey = "forever" | "1month" | "3months" | "6months" | "1year" | "custom"

const DURATIONS: { key: DurationKey; days: number | null }[] = [
  { key: "forever", days: null },
  { key: "1month", days: 30 },
  { key: "3months", days: 90 },
  { key: "6months", days: 180 },
  { key: "1year", days: 365 },
  { key: "custom", days: null },
]

const isoFromDays = (days: number | null): string | null => {
  if (days === null) return null
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}


const detectDurationPreset = (expiresAt: string | null): DurationKey => {
  if (!expiresAt) return "forever"
  const daysRemaining = Math.round(
    (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  const presets: [DurationKey, number][] = [
    ["1month", 30],
    ["3months", 90],
    ["6months", 180],
    ["1year", 365],
  ]
  for (const [key, days] of presets) {
    if (Math.abs(daysRemaining - days) <= 2) return key
  }
  return "custom"
}

interface PlanEditorModalProps {
  user: User
  onClose: () => void
}

const PlanEditorModal = ({ user, onClose }: PlanEditorModalProps) => {
  const { t } = useTranslation()
  const [setUserPlan, { isLoading }] = useSetUserPlanMutation()
  const [giftSubscription, { isLoading: isGifting }] = useGiftSubscriptionMutation()
  const { data: availablePlans, isLoading: isLoadingPlans } = useGetPlansQuery()

  const initialExpiresAt = user.subscription?.expires_at ?? null
  const initialPlanId = user.subscription?.plan_id ?? null

  const [planId, setPlanId] = useState<number | null>(initialPlanId)
  const [duration, setDuration] = useState<DurationKey>(
    detectDurationPreset(initialExpiresAt),
  )
  const [customDate, setCustomDate] = useState<string>(
    initialExpiresAt ? initialExpiresAt.slice(0, 10) : "",
  )
  const [error, setError] = useState<string | null>(null)

  const plans = useMemo(
    () =>
      (availablePlans ?? [])
        .filter((p) => !p.unavailable)
        .slice()
        .sort((a, b) => a.subscriptionPlanId - b.subscriptionPlanId),
    [availablePlans],
  )

  // Auto-pick first plan once loaded if user had no subscription
  const effectivePlanId = planId ?? plans[0]?.subscriptionPlanId ?? null

  const hasActiveSub = !!user.subscription
  const giftWouldNoop = hasActiveSub && initialExpiresAt === null

  const isFreePlan = useMemo(() => {
    if (!effectivePlanId) return false
    const p = plans.find((pp) => pp.subscriptionPlanId === effectivePlanId)
    return p?.price === 0
  }, [plans, effectivePlanId])

  const resolveDays = (): number | null | "invalid" => {
    if (duration === "forever") return null
    if (duration === "custom") {
      if (!customDate) return "invalid"
      const diffMs = new Date(customDate).getTime() - Date.now()
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      return days > 0 ? days : "invalid"
    }
    const entry = DURATIONS.find((d) => d.key === duration)
    return entry?.days ?? null
  }

  const handleApply = async () => {
    setError(null)
    if (!effectivePlanId) {
      setError(t("management.plan.errorGeneric"))
      return
    }
    let expiresAt: string | null = null
    if (!isFreePlan) {
      if (duration === "custom") {
        if (!customDate) {
          setError(t("management.plan.errorCustomDateRequired"))
          return
        }
        expiresAt = new Date(customDate).toISOString()
      } else {
        const entry = DURATIONS.find((d) => d.key === duration)
        expiresAt = isoFromDays(entry?.days ?? null)
      }
    }
    try {
      await setUserPlan({ userId: user.id, planId: effectivePlanId, expiresAt }).unwrap()
      onClose()
    } catch (err) {
      setError(extractApiMessage(err) ?? t("management.plan.errorGeneric"))
    }
  }

  const handleGift = async () => {
    setError(null)
    const days = resolveDays()
    if (days === "invalid") {
      setError(t("management.plan.errorCustomDateRequired"))
      return
    }
    try {
      await giftSubscription({
        userId: user.id,
        planId: effectivePlanId ?? undefined,
        days,
      }).unwrap()
      onClose()
    } catch (err) {
      setError(extractApiMessage(err) ?? t("management.plan.errorGeneric"))
    }
  }

  return (
    <Modal
      title={t("management.plan.title")}
      subtitle={`${user.username} · ${user.email}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-full text-sm font-semibold border border-app-line text-app-text hover:bg-app-soft transition cursor-pointer"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={handleGift}
            disabled={
              isGifting || isLoading || isLoadingPlans || giftWouldNoop
            }
            title={
              giftWouldNoop
                ? t("management.plan.giftDisabledForever")
                : t("management.plan.giftHint")
            }
            className="h-10 px-5 rounded-full text-sm font-semibold border border-brand-500 text-brand-500 hover:bg-brand-500/10 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGifting ? t("common.loading") : t("management.plan.gift")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || isGifting || isLoadingPlans || !effectivePlanId}
            className={classNames(BRAND_BUTTON_BASE, "h-10 px-5 rounded-full text-sm")}
          >
            {isLoading ? t("common.loading") : t("management.plan.apply")}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.16em] font-semibold text-app-text-muted uppercase">
            {t("management.plan.planLabel")}
          </span>
          {isLoadingPlans ? (
            <p className="text-sm text-app-text-muted">{t("common.loading")}</p>
          ) : plans.length === 0 ? (
            <p className="text-sm text-app-text-muted">
              {t("management.plan.noPlans")}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {plans.map((p) => (
                <button
                  key={p.subscriptionPlanId}
                  type="button"
                  onClick={() => setPlanId(p.subscriptionPlanId)}
                  className={classNames(
                    "h-10 rounded-lg text-sm font-semibold transition cursor-pointer border",
                    effectivePlanId === p.subscriptionPlanId
                      ? "bg-brand-500/15 border-brand-500 text-brand-500"
                      : "bg-app-soft border-app-line text-app-text hover:bg-app-elev",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isFreePlan && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] tracking-[0.16em] font-semibold text-app-text-muted uppercase">
              {t("management.plan.durationLabel")}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map(({ key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDuration(key)}
                  className={classNames(
                    "h-10 rounded-lg text-xs font-semibold transition cursor-pointer border",
                    duration === key
                      ? "bg-brand-500/15 border-brand-500 text-brand-500"
                      : "bg-app-soft border-app-line text-app-text hover:bg-app-elev",
                  )}
                >
                  {t(`management.plan.duration.${key}`)}
                </button>
              ))}
            </div>
            {duration === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="mt-2 h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm focus:outline-none focus:border-brand-500"
              />
            )}
          </div>
        )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </Modal>
  )
}

export default PlanEditorModal

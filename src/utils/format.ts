import { SubscriptionType } from '../types/subscription.types'

/**
 * Format duration from seconds to M:SS / H:MM:SS format.
 * Returns "0:00" for NaN / Infinity / falsy input so it's safe to feed
 * directly from `HTMLAudioElement.currentTime` etc.
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Format a byte count to KB / MB with a single decimal place above 1 MB.
 */
export const formatBytes = (size: number): string => {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Get subscription plan ID based on plan type
 * @param currentPlan - subscription plan type
 * @returns numeric plan ID
 */
export const getCurrentPlanId = (currentPlan: SubscriptionType): number => {
  switch (currentPlan) {
    case SubscriptionType.FREE: return 1
    case SubscriptionType.PREMIUM: return 2
    case SubscriptionType.FAMILY: return 3
    default: return 1
  }
};
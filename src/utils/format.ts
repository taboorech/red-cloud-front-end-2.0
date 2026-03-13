/**
 * Format duration from seconds to MM:SS format
 * @param seconds - duration in seconds
 * @returns formatted duration string (e.g., "3:45", "12:03")
 */
import { SubscriptionType } from '../types/subscription.types'

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
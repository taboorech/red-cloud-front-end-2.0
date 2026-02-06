/**
 * Format duration from seconds to MM:SS format
 * @param seconds - duration in seconds
 * @returns formatted duration string (e.g., "3:45", "12:03")
 */
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
export const getCurrentPlanId = (currentPlan: 'free' | 'premium' | 'family'): number => {
  switch (currentPlan) {
    case 'free': return 1
    case 'premium': return 2
    case 'family': return 3
    default: return 1
  }
};
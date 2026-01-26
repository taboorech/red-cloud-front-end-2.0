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
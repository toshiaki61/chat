export function exponentialJitterBackoff(
  retryCount: number,
  baseMs = 1000,
  maxDelayMs = baseMs * 30
): number {
  const jitter = Math.round(Math.random() * baseMs);
  const backoff = Math.pow(2, retryCount) * baseMs;
  const delayMs = jitter + Math.min(backoff, maxDelayMs);
  return delayMs;
}

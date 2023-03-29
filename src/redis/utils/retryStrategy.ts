export function redisRetryStrategy(times: number): number {
  // reconnect after
  return Math.min(times * 100, 3000);
}

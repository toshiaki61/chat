import { Temporal } from '@js-temporal/polyfill';

export function formatDuration(
  dateString: string,
  now = Temporal.Now.instant()
) {
  const date = Temporal.Instant.from(dateString);
  const duration = now.since(date);

  const seconds = duration.seconds;
  if (seconds < 60) {
    return `${seconds}秒前`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分前`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}時間前`;
  }
  const days = Math.round(hours / 24);
  if (days < 7) {
    return `${days}日前`;
  }

  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

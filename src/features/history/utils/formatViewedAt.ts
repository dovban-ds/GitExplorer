import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const RECENTLY_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function formatViewedAt(viewedAt: number): string {
  if (Date.now() - viewedAt < RECENTLY_THRESHOLD_MS) {
    return 'Viewed recently';
  }

  return `Viewed ${dayjs(viewedAt).fromNow()}`;
}

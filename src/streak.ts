import { JournalEntry } from './types';

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

// Counts consecutive days with at least one entry, ending today or yesterday.
export function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const days = new Set(entries.map((e) => dayKey(e.createdAt)));
  const today = new Date();
  const cursor = new Date(today);

  const todayKey = dayKey(today.toISOString());
  if (!days.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    const yesterdayKey = dayKey(cursor.toISOString());
    if (!days.has(yesterdayKey)) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

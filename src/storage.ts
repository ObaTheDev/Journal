import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from './types';

const STORAGE_KEY = 'journal_entries';

export async function loadEntries(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed: JournalEntry[] = JSON.parse(raw);
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveEntries(entries: JournalEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

import { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { JournalEntry, MOODS } from '../types';
import { computeStreak } from '../streak';

interface Props {
  entries: JournalEntry[];
  onNewEntry: () => void;
  onOpenEntry: (entry: JournalEntry) => void;
}

function moodEmoji(mood: JournalEntry['mood']): string {
  return MOODS.find((m) => m.key === mood)?.emoji ?? '';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function EntryListScreen({ entries, onNewEntry, onOpenEntry }: Props) {
  const [query, setQuery] = useState('');
  const streak = useMemo(() => computeStreak(entries), [entries]);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.text.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak} day{streak === 1 ? '' : 's'}</Text>
        </View>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search entries..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {entries.length === 0
                ? 'No entries yet. Tap + to write your first one.'
                : 'No entries match your search.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onOpenEntry(item)}>
            <Text style={styles.cardEmoji}>{moodEmoji(item.mood)}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.cardText} numberOfLines={2}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={onNewEntry}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  streakBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontWeight: '600',
    color: '#B45309',
  },
  search: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  empty: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    color: '#1A1A2E',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B3DF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
});

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { JournalEntry, Mood } from './src/types';
import { loadEntries, saveEntries } from './src/storage';
import EntryListScreen from './src/screens/EntryListScreen';
import EntryEditorScreen from './src/screens/EntryEditorScreen';

type Route = { name: 'list' } | { name: 'editor'; entry: JournalEntry | null };

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState<Route>({ name: 'list' });

  useEffect(() => {
    loadEntries().then((e) => {
      setEntries(e);
      setLoaded(true);
    });
  }, []);

  const persist = (next: JournalEntry[]) => {
    setEntries(next);
    saveEntries(next);
  };

  const handleSave = (mood: Mood, text: string) => {
    if (route.name !== 'editor') return;
    if (route.entry) {
      persist(
        entries.map((e) => (e.id === route.entry!.id ? { ...e, mood, text } : e))
      );
    } else {
      const newEntry: JournalEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        mood,
        text,
      };
      persist([newEntry, ...entries]);
    }
    setRoute({ name: 'list' });
  };

  const handleDelete = () => {
    if (route.name !== 'editor' || !route.entry) return;
    persist(entries.filter((e) => e.id !== route.entry!.id));
    setRoute({ name: 'list' });
  };

  if (!loaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {route.name === 'list' ? (
        <EntryListScreen
          entries={entries}
          onNewEntry={() => setRoute({ name: 'editor', entry: null })}
          onOpenEntry={(entry) => setRoute({ name: 'editor', entry })}
        />
      ) : (
        <EntryEditorScreen
          existing={route.entry}
          onCancel={() => setRoute({ name: 'list' })}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
});

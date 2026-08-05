import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { JournalEntry, Mood } from '../types';
import MoodPicker from '../components/MoodPicker';

interface Props {
  existing: JournalEntry | null;
  onCancel: () => void;
  onSave: (mood: Mood, text: string) => void;
  onDelete: () => void;
}

export default function EntryEditorScreen({ existing, onCancel, onSave, onDelete }: Props) {
  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? null);
  const [text, setText] = useState(existing?.text ?? '');

  const canSave = mood !== null && text.trim().length > 0;

  const handleSave = () => {
    if (!mood || !text.trim()) return;
    onSave(mood, text.trim());
  };

  const handleDelete = () => {
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.headerAction}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{existing ? 'Edit Entry' : 'New Entry'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={!canSave}>
            <Text style={[styles.headerAction, styles.save, !canSave && styles.saveDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.sectionLabel}>How are you feeling?</Text>
          <MoodPicker value={mood} onChange={setMood} />
        </View>

        <TextInput
          style={styles.textArea}
          placeholder="Write about your day..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
          autoFocus
        />

        {existing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Entry</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  headerAction: {
    fontSize: 16,
    color: '#666',
  },
  save: {
    color: '#5B3DF6',
    fontWeight: '600',
  },
  saveDisabled: {
    color: '#C4B9FA',
  },
  moodSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  textArea: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1A1A2E',
    lineHeight: 22,
  },
  deleteButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Mood, MOODS } from '../types';

interface Props {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export default function MoodPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const selected = value === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            onPress={() => onChange(m.key)}
            style={[styles.item, selected && styles.itemSelected]}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  itemSelected: {
    backgroundColor: '#EFE7FF',
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  labelSelected: {
    color: '#5B3DF6',
    fontWeight: '600',
  },
});

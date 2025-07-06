import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// Optionally: Accept a "progress" prop in the future
type Props = {
  area: string;
  onPress?: () => void; // <-- Make optional!
  progress?: number; // Value from 0 to 1 (for future)
};

export default function AreaCard({ area, onPress, progress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      {/* Future: Progress ring goes here */}
      <View style={styles.circle}>
        <Text style={styles.text}>{area.charAt(0).toUpperCase() + area.slice(1)}</Text>
        {/* {progress !== undefined ? <Text>{Math.round(progress * 100)}%</Text> : null} */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
  },
  circle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#0a7ea4',
    borderRadius: 64,
    borderWidth: 3,
    elevation: 3,
    height: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: 120,
  },
  text: {
    color: '#0a7ea4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomCheckbox({
  checked,
  onToggle,
  size = 28,
}: {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.box,
        { borderColor: '#0a7ea4', borderRadius: size / 2, height: size, width: size },
        checked && { backgroundColor: '#0a7ea4' },
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      activeOpacity={0.8}
    >
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

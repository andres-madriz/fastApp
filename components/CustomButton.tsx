import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ onPress, style, title }: { onPress: () => void; title: string; style?: any }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 2,
    minWidth: 52,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

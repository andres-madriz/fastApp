import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CustomInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput style={[styles.input, props.style]} placeholderTextColor="#9BA1A6" {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    fontSize: 16,
    marginRight: 8,
    padding: 10,
  },
});

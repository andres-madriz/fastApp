import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

type GroceryItem = {
  id: string;
  name: string;
  checked: boolean;
};

type Props = {
  items: GroceryItem[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function GroceriesChecklist({ items, onAdd, onDelete, onToggle }: Props) {
  const [newItem, setNewItem] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groceries Checklist</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add grocery item"
          value={newItem}
          onChangeText={setNewItem}
          style={styles.input}
          onSubmitEditing={() => {
            if (newItem.trim()) {
              onAdd(newItem.trim());
              setNewItem('');
            }
          }}
        />
        <Button
          title="Add"
          onPress={() => {
            if (newItem.trim()) {
              onAdd(newItem.trim());
              setNewItem('');
            }
          }}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              onPress={() => onToggle(item.id)}
              style={[styles.checkbox, { backgroundColor: item.checked ? '#0a7ea4' : '#fff', borderColor: '#0a7ea4' }]}
            >
              {item.checked && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.itemText,
                {
                  color: item.checked ? '#9BA1A6' : '#11181C',
                  textDecorationLine: item.checked ? 'line-through' : 'none',
                },
              ]}
            >
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    marginRight: 10,
    width: 28,
  },
  container: { backgroundColor: '#f8f9fa', borderRadius: 12, margin: 12, padding: 18 },
  deleteBtn: { fontSize: 18, marginLeft: 8 },
  input: { borderColor: '#eee', borderRadius: 8, borderWidth: 1, flex: 1, marginRight: 8, padding: 10 },
  inputRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  itemRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  itemText: { flex: 1, fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
});

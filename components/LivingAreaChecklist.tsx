import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

import TaskItem from './TaskItem';

export type Task = {
  id: string;
  name: string;
  details: string;
  deadline: string;
  checked: boolean;
  createdAt: string; // <-- add this!
};

type Props = {
  area: string;
  items: Task[];
  onAdd: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function LivingAreaChecklist({ area, items, onAdd, onDelete, onToggle }: Props) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      const newTask: Task = {
        checked: false,
        createdAt: '',
        deadline: '', // Future: let user pick a deadline
        details: '', // Future: let user enter details
        id: Date.now().toString(),
        name: newItem.trim(),
      };
      onAdd(newTask);
      setNewItem('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{area} To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder={`Add to ${area}`}
          value={newItem}
          onChangeText={setNewItem}
          style={styles.input}
          onSubmitEditing={handleAdd}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} area={area} onToggle={() => onToggle(item.id)} onDelete={() => onDelete(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8f9fa', borderRadius: 12, margin: 12, padding: 12 },
  input: { borderColor: '#eee', borderRadius: 8, borderWidth: 1, flex: 1, marginRight: 8, padding: 10 },
  inputRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  title: { fontSize: 19, fontWeight: 'bold', marginBottom: 10, textTransform: 'capitalize' },
});

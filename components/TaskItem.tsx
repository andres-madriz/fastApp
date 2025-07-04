import React from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Task } from './LivingAreaChecklist';

type Props = {
  task: Task;
  area: string;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskItem({ area, onDelete, onToggle, task }: Props) {
  return (
    <View style={styles.itemRow}>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkbox,
          {
            backgroundColor: task.checked ? '#0a7ea4' : '#fff',
            borderColor: '#0a7ea4',
          },
        ]}
      >
        {task.checked && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.itemText,
            {
              color: task.checked ? '#9BA1A6' : '#11181C',
              textDecorationLine: task.checked ? 'line-through' : 'none',
            },
          ]}
        >
          {String(task.name || '')}
        </Text>
        {/* Details and Deadline */}
        {task.details || task.deadline ? (
          <Text style={{ color: '#6b7280', fontSize: 13 }}>
            {task.details ? String(task.details) : ''}
            {task.deadline ? ` | Due: ${String(task.deadline).slice(0, 10)}` : ''}
          </Text>
        ) : null}
      </View>
      {/* Edit Button - Always shown */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            params: { area, taskId: task.id },
            pathname: '/(app)/(modal)/editTask',
          })
        }
      >
        <Text style={{ marginHorizontal: 4 }}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    marginRight: 10,
    width: 26,
  },
  deleteBtn: { fontSize: 18, marginLeft: 8 },
  itemRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  itemText: { flex: 1, fontSize: 15 },
});

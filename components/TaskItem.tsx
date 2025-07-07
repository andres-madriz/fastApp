import React from 'react';
import { format } from 'date-fns';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Task } from './LivingAreaChecklist';

type Props = {
  task: Task;
  area: string;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

function getProgress(createdAt: string, deadline: string): number {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const end = new Date(deadline).getTime();
  if (!createdAt || !deadline || created >= end) return 1;
  if (now <= created) return 0;
  if (now >= end) return 1;
  return (end - now) / (end - created);
}

function formatDeadline(deadline: string) {
  if (!deadline) return '';
  try {
    const date = new Date(deadline);
    return format(date, 'yyyy-MM-dd HH:mm');
  } catch {
    return deadline;
  }
}

export default function TaskItem({ area, onDelete, onEdit, onToggle, task }: Props) {
  const now = Date.now();
  const deadline = new Date(task.deadline).getTime();
  const overdue = deadline && now > deadline;

  // Progreso siempre lleno si está overdue
  const progress = overdue ? 1 : getProgress(task.createdAt, task.deadline);

  // Si checked, gris. Si overdue y no checked, rojo. Si no, según progreso.
  const progressColor = task.checked
    ? '#bbb'
    : overdue
      ? '#ef4444'
      : progress > 0.7
        ? '#16a34a'
        : progress > 0.3
          ? '#eab308'
          : '#ef4444';

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
            {task.deadline ? ` | Due: ${formatDeadline(task.deadline)}` : ''}
          </Text>
        ) : null}
        <View
          style={{
            backgroundColor: '#eee',
            borderRadius: 6,
            height: 8,
            marginTop: 7,
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: progressColor,
              borderRadius: 6,
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
            }}
          />
        </View>
      </View>
      {/* Edit Button - Calls the provided onEdit callback */}
      <TouchableOpacity onPress={onEdit}>
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

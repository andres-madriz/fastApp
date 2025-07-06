import React, { useMemo, useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths, format } from 'date-fns';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const UNITS = [
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

type Props = {
  area: string;
  onCreate: (task: { name: string; details: string; deadline: string }) => void;
  onCancel: () => void;
};

export default function CreateTaskModal({ area, onCancel, onCreate }: Props) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('3');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [deadline, setDeadline] = useState('');

  // Calculate deadline date (Date object)
  const deadlineDate = useMemo(() => {
    const n = Number(amount) || 0;
    if (unit === 'days') return addDays(new Date(), n);
    if (unit === 'weeks') return addWeeks(new Date(), n);
    if (unit === 'months') return addMonths(new Date(), n);
    return new Date();
  }, [amount, unit]);

  // Display string like "Deadline: Tuesday 09-07-2025"
  const deadlineDisplay = useMemo(() => {
    const dayName = WEEKDAYS[deadlineDate.getDay()];
    return `Deadline: ${dayName} ${format(deadlineDate, 'dd-MM-yyyy')}`;
  }, [deadlineDate]);

  // Update ISO deadline string when the selector changes
  useEffect(() => {
    setDeadline(format(deadlineDate, 'yyyy-MM-dd'));
  }, [deadlineDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Task name" />
      <TextInput style={styles.input} value={details} onChangeText={setDetails} placeholder="Details" />

      {/* Deadline Selector */}
      <View style={styles.deadlinePicker}>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Deadline in</Text>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={[styles.input, { marginBottom: 0, marginRight: 7, width: 48 }]}
            placeholder="N"
          />
          {UNITS.map(u => (
            <TouchableOpacity
              key={u.value}
              style={[styles.unitBtn, unit === u.value && styles.selectedUnitBtn]}
              onPress={() => setUnit(u.value as any)}
            >
              <Text style={[styles.unitBtnText, unit === u.value && styles.selectedUnitBtnText]}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ color: '#0a7ea4', fontWeight: '600', marginTop: 10 }}>{deadlineDisplay}</Text>
      </View>

      <Button
        title="Create Task"
        onPress={() => {
          if (name.trim()) {
            onCreate({
              deadline,
              details: details.trim(),
              name: name.trim(),
            });
          }
        }}
      />
      <Button title="Cancel" color="#aaa" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%' },
  deadlinePicker: { marginBottom: 18 },
  input: { borderColor: '#ccc', borderRadius: 8, borderWidth: 1, marginBottom: 18, padding: 12 },
  selectedUnitBtn: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  selectedUnitBtnText: {
    color: '#fff',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  unitBtn: {
    backgroundColor: '#f7f7f7',
    borderColor: '#eee',
    borderRadius: 7,
    borderWidth: 1,
    marginHorizontal: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  unitBtnText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
});

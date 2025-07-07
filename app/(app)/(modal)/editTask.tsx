import React, { useMemo, useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths, format, isToday, isBefore } from 'date-fns';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const UNITS = [
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

export default function EditTaskModal({
  onCancel,
  onSave,
  task,
}: {
  task: any | null;
  onSave: (updatedTask: any) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('3');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [deadline, setDeadline] = useState('');

  // Initialize form with task values
  useEffect(() => {
    if (!task) return;
    setName(task.name || '');
    setDetails(task.details || '');
    if (task.deadline) {
      const d = new Date(task.deadline);
      setHour(String(d.getHours()).padStart(2, '0'));
      setMinute(String(d.getMinutes()).padStart(2, '0'));
      const now = new Date();
      const diffMs = d.getTime() - now.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      setAmount(diffDays > 0 ? String(diffDays) : '3');
      setUnit('days');
      setDeadline(task.deadline);
    } else {
      setAmount('3');
      setUnit('days');
      setHour('12');
      setMinute('00');
      setDeadline('');
    }
  }, [task]);

  // Calculate the deadlineDate object
  const deadlineDate = useMemo(() => {
    let d = new Date();
    if (unit === 'days') d = addDays(d, Number(amount) || 0);
    else if (unit === 'weeks') d = addWeeks(d, Number(amount) || 0);
    else if (unit === 'months') d = addMonths(d, Number(amount) || 0);
    d.setHours(Number(hour) || 0);
    d.setMinutes(Number(minute) || 0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }, [amount, unit, hour, minute]);

  // Update ISO deadline string when values change
  useEffect(() => {
    setDeadline(deadlineDate.toISOString());
    // eslint-disable-next-line
  }, [deadlineDate.getTime()]);

  // Display string with time
  const deadlineDisplay = useMemo(() => {
    const dayName = WEEKDAYS[deadlineDate.getDay()];
    return `Deadline: ${dayName} ${format(deadlineDate, 'dd-MM-yyyy HH:mm')}`;
  }, [deadlineDate]);

  // Validation
  const validateTime = () => {
    const h = Number(hour);
    const m = Number(minute);
    if (isNaN(h) || h < 0 || h > 23) {
      Alert.alert('Invalid Hour', 'Hour must be between 0 and 23');
      return false;
    }
    if (isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Invalid Minutes', 'Minutes must be between 0 and 59');
      return false;
    }
    // For deadlines today, check if time is not in the past
    if (isToday(deadlineDate) && isBefore(deadlineDate, new Date())) {
      Alert.alert('Invalid Time', 'Deadline time must be in the future');
      return false;
    }
    return true;
  };

  if (!task) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Task name" />
      <TextInput style={styles.input} value={details} onChangeText={setDetails} placeholder="Details" />

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

        {/* Hour/Minute selector */}
        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 8 }}>
          <Text style={{ marginRight: 6 }}>Time:</Text>
          <TextInput
            value={hour}
            onChangeText={val => setHour(val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={2}
            style={[styles.input, { marginBottom: 0, marginRight: 2, textAlign: 'center', width: 40 }]}
            placeholder="HH"
          />
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>:</Text>
          <TextInput
            value={minute}
            onChangeText={val => setMinute(val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={2}
            style={[styles.input, { marginBottom: 0, marginLeft: 2, textAlign: 'center', width: 40 }]}
            placeholder="MM"
          />
        </View>
        <Text style={{ color: '#0a7ea4', fontWeight: '600', marginTop: 10 }}>{deadlineDisplay}</Text>
      </View>

      <Button
        title="Save Changes"
        onPress={() => {
          if (validateTime()) {
            // Ajuste para que el ISO corresponda a la hora local seleccionada
            const offsetMs = deadlineDate.getTimezoneOffset() * 60 * 1000;
            const adjusted = new Date(deadlineDate.getTime() - offsetMs);
            const iso = adjusted.toISOString();
            onSave({
              ...task,
              deadline: iso,
              details,
              name,
            });
          }
        }}
      />
      <Button title="Cancel" color="#aaa" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '98%' },
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

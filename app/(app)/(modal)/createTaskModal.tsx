import React, { useMemo, useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths, format, isToday, isBefore } from 'date-fns';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

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
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [deadline, setDeadline] = useState('');

  // Calcula la fecha límite (objeto Date)
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

  // String preview tipo: Deadline: Wednesday 10-07-2025 14:00
  const deadlineDisplay = useMemo(() => {
    const dayName = WEEKDAYS[deadlineDate.getDay()];
    return `Deadline: ${dayName} ${format(deadlineDate, 'dd-MM-yyyy HH:mm')}`;
  }, [deadlineDate]);

  // Actualiza deadline ISO cada que cambia la fecha/hora
  useEffect(() => {
    setDeadline(deadlineDate.toISOString());
  }, [deadlineDate]);

  // Validación de tiempo coherente
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
    // Si la fecha es hoy, la hora debe ser en el futuro
    if (isToday(deadlineDate) && isBefore(deadlineDate, new Date())) {
      Alert.alert('Invalid Time', 'Deadline time must be in the future');
      return false;
    }
    return true;
  };

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
        title="Create Task"
        onPress={() => {
          if (!name.trim()) return;
          if (validateTime()) {
            // Ajustar a UTC "manual" para guardar la hora local
            const offsetMs = deadlineDate.getTimezoneOffset() * 60 * 1000;
            const adjusted = new Date(deadlineDate.getTime() - offsetMs);
            const iso = adjusted.toISOString();

            onCreate({
              deadline: iso,
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

import React, { useMemo, useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths, format, isToday, isBefore } from 'date-fns';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomButton from '@/components/CustomButton';

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

  // Calculate deadline (Date object)
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

  // String preview
  const deadlineDisplay = useMemo(() => {
    const dayName = WEEKDAYS[deadlineDate.getDay()];
    return `Deadline: ${dayName} ${format(deadlineDate, 'dd-MM-yyyy HH:mm')}`;
  }, [deadlineDate]);

  useEffect(() => {
    setDeadline(deadlineDate.toISOString());
  }, [deadlineDate]);

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
    if (isToday(deadlineDate) && isBefore(deadlineDate, new Date())) {
      Alert.alert('Invalid Time', 'Deadline time must be in the future');
      return false;
    }
    return true;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create New Task</Text>
        <TextInput
          style={[styles.input, styles.textInput]}
          value={name}
          onChangeText={setName}
          placeholder="Task name"
          placeholderTextColor="#b0b5bf"
        />
        <TextInput
          style={[styles.input, styles.textInput]}
          value={details}
          onChangeText={setDetails}
          placeholder="Details"
          placeholderTextColor="#b0b5bf"
        />

        {/* Deadline */}
        <View style={styles.deadlinePicker}>
          <Text style={styles.sectionLabel}>Deadline in</Text>
          <View style={styles.deadlineRow}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={[styles.input, styles.numberInput]}
              placeholder="N"
              placeholderTextColor="#b0b5bf"
              returnKeyType="done"
              blurOnSubmit
            />
            {UNITS.map(u => (
              <TouchableOpacity
                key={u.value}
                style={[
                  styles.unitBtn,
                  unit === u.value && styles.selectedUnitBtn,
                ]}
                onPress={() => setUnit(u.value as any)}
              >
                <Text
                  style={[
                    styles.unitBtnText,
                    unit === u.value && styles.selectedUnitBtnText,
                  ]}
                >
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Hour/Minute selector */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Time:</Text>
            <TextInput
              value={hour}
              onChangeText={val => setHour(val.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={2}
              style={[styles.input, styles.timeInput]}
              placeholder="HH"
              placeholderTextColor="#b0b5bf"
              returnKeyType="done"
              blurOnSubmit
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              value={minute}
              onChangeText={val => setMinute(val.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={2}
              style={[styles.input, styles.timeInput]}
              placeholder="MM"
              placeholderTextColor="#b0b5bf"
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
          <Text style={styles.deadlinePreview}>{deadlineDisplay}</Text>
        </View>

        <CustomButton
          title="Create Task"
          onPress={() => {
            if (!name.trim()) return;
            if (validateTime()) {
              // Adjust to UTC for local save
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
          style={styles.createBtn}
        />
        <CustomButton
          title="Cancel"
          onPress={onCancel}
          style={styles.cancelBtn}
          textStyle={{ color: '#324155', fontWeight: 'bold' }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
    color: '#0a7ea4',
    letterSpacing: 0.4,
  },
  sectionLabel: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f6fafd',
    color: '#222',
    fontSize: 15,
  },
  textInput: {
    fontSize: 16,
    marginBottom: 15,
  },
  numberInput: {
    marginBottom: 0,
    marginRight: 7,
    width: 60, // made a bit longer
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f8fafc',
  },
  deadlinePicker: {
    marginBottom: 18,
  },
  deadlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  timeLabel: {
    marginRight: 6,
    color: '#444',
    fontWeight: '600',
    fontSize: 15,
  },
  colon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 2,
    color: '#333',
  },
  timeInput: {
    width: 60, // longer time input
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f8fafc',
  },
  unitBtn: {
    backgroundColor: '#f7f7f7',
    borderColor: '#eee',
    borderRadius: 7,
    borderWidth: 1.5,
    marginHorizontal: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  selectedUnitBtn: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  unitBtnText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedUnitBtnText: {
    color: '#fff',
  },
  deadlinePreview: {
    color: '#0a7ea4',
    fontWeight: '600',
    marginTop: 13,
    fontSize: 16,
    textAlign: 'center',
  },
  createBtn: {
    backgroundColor: '#0a7ea4',
    marginTop: 6,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#d8e0e7', // darker background
    marginTop: 10,
    borderRadius: 8,
  },
});

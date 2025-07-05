import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { addDays, addWeeks, addMonths, format } from 'date-fns';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const UNITS = [
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

export default function EditTaskModal() {
  const { area, taskId } = useLocalSearchParams<{ taskId: string; area: string }>();
  const { userDoc } = useSession();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  // Nueva lógica para deadline
  const [amount, setAmount] = useState('3');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [deadline, setDeadline] = useState(''); // Se guarda en formato ISO

  // Al abrir el modal, carga la tarea
  useEffect(() => {
    if (!userDoc?.homeId || !area || !taskId) return;
    const fetchTask = async () => {
      const ref = doc(db, 'homes', userDoc.homeId);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const tasks = snap.data().todos?.[area] || [];
      const found = tasks.find((t: any) => t.id === taskId);
      if (found) {
        setTask(found);
        setName(found.name || '');
        setDetails(found.details || '');
        // Si tiene deadline, cargar días/semanas/meses desde hoy, si no, 3 días default
        if (found.deadline) {
          const foundDate = new Date(found.deadline);
          const now = new Date();
          const diffMs = foundDate.getTime() - now.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          setAmount(diffDays > 0 ? String(diffDays) : '3');
          setUnit('days'); // Simple: lo pones en días al editar, puedes mejorar si detectas semanas/meses
          setDeadline(found.deadline);
        } else {
          setAmount('3');
          setUnit('days');
          setDeadline('');
        }
      }
      setLoading(false);
    };
    fetchTask();
  }, [userDoc?.homeId, area, taskId]);

  // Calcula la fecha límite con base en amount y unit
  const deadlineDate = useMemo(() => {
    const n = Number(amount) || 0;
    if (unit === 'days') return addDays(new Date(), n);
    if (unit === 'weeks') return addWeeks(new Date(), n);
    if (unit === 'months') return addMonths(new Date(), n);
    return new Date();
  }, [amount, unit]);

  // String tipo: "Deadline: Wednesday 10-07-2025"
  const deadlineDisplay = useMemo(() => {
    const dayName = WEEKDAYS[deadlineDate.getDay()];
    return `Deadline: ${dayName} ${format(deadlineDate, 'dd-MM-yyyy')}`;
  }, [deadlineDate]);

  // Actualiza deadline ISO cada que el usuario cambia el selector
  useEffect(() => {
    setDeadline(format(deadlineDate, 'yyyy-MM-dd'));
  }, [deadlineDate]);

  // Guardar cambios
  const handleSave = async () => {
    if (!userDoc?.homeId || !area || !taskId) return;
    const ref = doc(db, 'homes', userDoc.homeId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const oldTasks = snap.data().todos?.[area] || [];
    const newTasks = oldTasks.map((t: any) => (t.id === taskId ? { ...t, deadline, details, name } : t));
    await updateDoc(ref, {
      [`todos.${area}`]: newTasks,
    });
    router.back();
  };

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  if (!task)
    return (
      <View style={styles.center}>
        <Text>Task not found.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Task name" />
      <TextInput style={styles.input} value={details} onChangeText={setDetails} placeholder="Details" />

      {/* Deadline Picker: En X días/semanas/meses */}
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
        {/* Fecha resultante */}
        <Text style={{ color: '#0a7ea4', fontWeight: '600', marginTop: 10 }}>{deadlineDisplay}</Text>
      </View>

      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Cancel" color="#aaa" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  container: { backgroundColor: '#fff', flex: 1, justifyContent: 'center', padding: 24 },
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

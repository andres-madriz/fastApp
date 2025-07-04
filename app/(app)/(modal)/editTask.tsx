// app/(app)/(modal)/edit-task.tsx
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';

export default function EditTaskModal() {
  const { area, taskId } = useLocalSearchParams<{ taskId: string; area: string }>();
  const { userDoc } = useSession();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');

  // Carga la tarea al abrir el modal
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
        setName(found.name);
        setDetails(found.details);
        setDeadline(found.deadline);
      }
      setLoading(false);
    };
    fetchTask();
  }, [userDoc?.homeId, area, taskId]);

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
      <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} placeholder="Deadline (YYYY-MM-DD)" />
      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Cancel" color="#aaa" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  container: { backgroundColor: '#fff', flex: 1, justifyContent: 'center', padding: 24 },
  input: { borderColor: '#ccc', borderRadius: 8, borderWidth: 1, marginBottom: 18, padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});

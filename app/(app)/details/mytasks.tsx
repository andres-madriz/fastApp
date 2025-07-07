import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import TaskItem from '../../../components/TaskItem';

export default function MyTasksScreen() {
  const { userDoc } = useSession();
  const router = useRouter();
  const userId = userDoc?.uid;
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) setTasks(snap.data().myTasks || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  // Update tasks in Firestore and state
  const updateTasks = async (newTasks: any[]) => {
    setTasks(newTasks);
    if (userId) {
      await updateDoc(doc(db, 'users', userId), {
        myTasks: newTasks,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 32 }}>
        <Text style={styles.title}>My Tasks</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {tasks.length === 0 && <Text style={{ color: '#888' }}>No tasks yet.</Text>}
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                area="mytasks"
                onToggle={async () =>
                  updateTasks(tasks.map(t => (t.id === task.id ? { ...t, checked: !t.checked } : t)))
                }
                onDelete={async () => updateTasks(tasks.filter(t => t.id !== task.id))}
                onEdit={() => {
                  /* You can add an edit modal if desired */
                }}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#e6f6fb',
    borderRadius: 8,
    elevation: 2,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
    zIndex: 9,
  },
  backButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  safe: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    color: '#0a7ea4',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 32,
    textAlign: 'center',
  },
});

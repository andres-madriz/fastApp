import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, Pressable, ScrollView } from 'react-native';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import LivingAreaChecklist, { Task } from '../../../../components/LivingAreaChecklist';

// ---------------------------------------
// NEW: Defensive type! Remove old TodoItem!
type TasksByArea = { [area: string]: Task[] };

export default function TabsIndexScreen() {
  const { signOut, user, userDoc } = useSession();

  const selectedAreas: string[] = userDoc?.selectedAreas || ['kitchen', 'bathroom', 'living room'];
  const homeId: string | undefined = userDoc?.homeId;

  const [todos, setTodos] = useState<TasksByArea>({});

  // Defensive Firestore load: ensure every Task has all fields!
  useEffect(() => {
    if (!homeId) return;
    const fetchTodos = async () => {
      const homeRef = doc(db, 'homes', homeId);
      const snap = await getDoc(homeRef);
      if (snap.exists()) {
        const rawTodos = snap.data().todos || {};
        const cleanedTodos: TasksByArea = {};
        Object.entries(rawTodos).forEach(([area, items]) => {
          cleanedTodos[area] = (items as any[]).map(item => ({
            checked: !!item.checked,
            deadline: item.deadline || '',
            details: item.details || '',
            id: item.id,
            name: item.name,
          }));
        });
        setTodos(cleanedTodos);
      }
    };
    fetchTodos();
  }, [homeId]);

  // Updates todos in state and Firestore
  const updateTodos = (area: string, newList: Task[]) => {
    const newTodos = { ...todos, [area]: newList };
    setTodos(newTodos);
    if (homeId) {
      updateDoc(doc(db, 'homes', homeId), { todos: newTodos });
    }
  };

  const displayName = user?.displayName || userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Welcome Section */}
      <View style={{ alignItems: 'center', marginBottom: 18, marginTop: 32 }}>
        <Text style={{ color: '#222', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Welcome back,</Text>
        <Text style={{ color: '#0a7ea4', fontSize: 24, fontWeight: 'bold' }}>{displayName}</Text>
        <Text style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{user?.email}</Text>
      </View>

      {/* Living area checklists */}
      {selectedAreas.map((area: string) => (
        <LivingAreaChecklist
          key={area}
          area={area}
          items={todos[area] || []}
          // Pass a full Task object on add!
          onAdd={taskOrName => {
            let task: Task;
            if (typeof taskOrName === 'string') {
              // When called with just a name, fill in blanks
              task = {
                checked: false,
                deadline: '',
                details: '',
                id: Date.now().toString(),
                name: taskOrName,
              };
            } else {
              // Already a Task
              task = { ...taskOrName, id: Date.now().toString() };
            }
            updateTodos(area, [...(todos[area] || []), task]);
          }}
          onToggle={id =>
            updateTodos(
              area,
              (todos[area] || []).map((item: Task) => (item.id === id ? { ...item, checked: !item.checked } : item)),
            )
          }
          onDelete={id =>
            updateTodos(
              area,
              (todos[area] || []).filter((item: Task) => item.id !== id),
            )
          }
        />
      ))}

      {/* Logout Button */}
      <Pressable
        onPress={async () => {
          await signOut();
          router.replace('/sign-in');
        }}
        style={{
          alignSelf: 'center',
          backgroundColor: '#ef4444',
          borderRadius: 10,
          marginBottom: 30,
          marginTop: 30,
          paddingHorizontal: 36,
          paddingVertical: 14,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

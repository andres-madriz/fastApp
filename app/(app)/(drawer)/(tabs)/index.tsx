import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, Pressable, ScrollView } from 'react-native';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import LivingAreaChecklist from '../../../../components/LivingAreaChecklist'; // Make sure this exists!

// Define the type for a single todo item
type TodoItem = {
  id: string;
  name: string;
  checked: boolean;
};

export default function TabsIndexScreen() {
  const { signOut, user, userDoc } = useSession();

  // Ensure selectedAreas is always a string array
  const selectedAreas: string[] = userDoc?.selectedAreas || ['kitchen', 'bathroom', 'living room'];
  const homeId: string | undefined = userDoc?.homeId;

  // Structure: { [area: string]: TodoItem[] }
  const [todos, setTodos] = useState<{ [area: string]: TodoItem[] }>({});

  useEffect(() => {
    if (!homeId) return;
    const fetchTodos = async () => {
      const homeRef = doc(db, 'homes', homeId);
      const snap = await getDoc(homeRef);
      if (snap.exists()) setTodos(snap.data().todos || {});
    };
    fetchTodos();
  }, [homeId]);

  // Update todos both in state and Firestore
  const updateTodos = (area: string, newList: TodoItem[]) => {
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
          onAdd={name =>
            updateTodos(area, [...(todos[area] || []), { checked: false, id: Date.now().toString(), name }])
          }
          onToggle={id =>
            updateTodos(
              area,
              (todos[area] || []).map((item: TodoItem) =>
                item.id === id ? { ...item, checked: !item.checked } : item,
              ),
            )
          }
          onDelete={id =>
            updateTodos(
              area,
              (todos[area] || []).filter((item: TodoItem) => item.id !== id),
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

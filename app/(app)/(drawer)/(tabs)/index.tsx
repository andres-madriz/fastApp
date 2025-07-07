import { Link, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';

import type { Task } from '../../../../components/LivingAreaChecklist';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import AreaCard from '../../../../components/AreaCard';

export default function TabsIndexScreen() {
  const { signOut, user, userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [todos, setTodos] = useState<{ [area: string]: Task[] }>({});
  const [refreshing, setRefreshing] = useState(false);

  const displayName = user?.displayName || userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');
  const router = useRouter();

  // Fetch home data (areas + todos)
  const fetchData = useCallback(async () => {
    if (!homeId) return;
    const ref = doc(db, 'homes', homeId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setTodos(snap.data().todos || {});
      setSelectedAreas(snap.data().selectedAreas || []);
    }
  }, [homeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // Only NOT checked tasks count for progress
  function calcAreaProgress(tasks: Task[]): number {
    if (!tasks?.length) return 1;
    const notChecked = tasks.filter(t => !t.checked);
    if (!notChecked.length) return 1;
    return (
      notChecked.reduce((acc, t) => {
        const now = Date.now();
        const created = t.createdAt ? new Date(t.createdAt).getTime() : 0;
        const end = t.deadline ? new Date(t.deadline).getTime() : 0;
        if (!t.createdAt || !t.deadline || created >= end) return acc + 1;
        if (now <= created) return acc + 1;
        if (now >= end) return acc + 0;
        const percent = (end - now) / (end - created);
        return acc + percent;
      }, 0) / notChecked.length
    );
  }

  function hasOverdue(tasks: Task[] = []): boolean {
    const now = Date.now();
    return tasks.some(t => !t.checked && t.deadline && new Date(t.deadline).getTime() < now);
  }

  return (
    <View style={styles.container}>
      {/* Welcome Section */}
      <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 32 }}>
        <Text style={{ color: '#222', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Welcome back,</Text>
        <Text style={{ color: '#0a7ea4', fontSize: 24, fontWeight: 'bold' }}>{displayName}</Text>
        <Text style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{user?.email}</Text>
      </View>
      {/* Area cards */}
      <FlatList
        data={selectedAreas}
        keyExtractor={area => area}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}
        renderItem={({ item: area }) => (
          <Link href={`/details/${encodeURIComponent(area)}`} asChild>
            <AreaCard
              area={area}
              progress={calcAreaProgress(todos[area] || [])}
              overdue={hasOverdue(todos[area] || [])}
            />
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0a7ea4" colors={['#0a7ea4']} />
        }
      />
      {/* Logout Button */}
      <Text
        style={styles.logout}
        onPress={async () => {
          await signOut();
          router.replace('/sign-in');
        }}
      >
        Logout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f7fafc', flex: 1, paddingTop: 32 },
  logout: {
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 36,
    paddingVertical: 14,
    textAlign: 'center',
  },
});

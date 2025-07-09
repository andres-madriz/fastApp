// screens/Home/index.tsx (o tu index.tsx actual)
import { Link, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import AreaCard from '../../../../components/AreaCard';
import AppLayout from '../../../../components/UI/AppLayout'; // Usa tu layout base
import AvatarButton from '../../../../components/UI/AvatarButton'; // Ajusta el path si es necesario

export default function HomePage() {
  const { user, userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [todos, setTodos] = useState<{ [area: string]: any[] }>({});
  const [refreshing, setRefreshing] = useState(false);

  const userPhoto = userDoc?.profileImage; // <-- USA EL CORRECTO
  const initials = userDoc?.name
    ? userDoc.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const displayName = userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');
  const router = useRouter();

  useEffect(() => {
    if (!homeId) return;
    const fetch = async () => {
      const ref = doc(db, 'homes', homeId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setTodos(snap.data().todos || {});
        setSelectedAreas(snap.data().selectedAreas || []);
      }
    };
    fetch();
  }, [homeId]);

  function calcAreaProgress(tasks: any[]): number {
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

  function hasOverdue(tasks: any[] = []): boolean {
    const now = Date.now();
    return tasks.some(t => !t.checked && t.deadline && new Date(t.deadline).getTime() < now);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (homeId) {
      const ref = doc(db, 'homes', homeId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setTodos(snap.data().todos || {});
        setSelectedAreas(snap.data().selectedAreas || []);
      }
    }
    setRefreshing(false);
  };

  return (
    <AppLayout>
      {/* Floating profile button */}
      <AvatarButton uri={userPhoto} initials={initials} onPress={() => router.push('/details/profile')} />

      {/* Welcome */}
      <View className="items-center mt-10 mb-8">
        <Text className="text-lg font-bold text-text mb-1">Welcome back,</Text>
        <Text className="text-2xl font-bold text-primary">{displayName}</Text>
      </View>

      {/* Area Cards */}
      <FlatList
        data={selectedAreas}
        keyExtractor={area => area}
        numColumns={2}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 36 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item: area }) => (
          <Link href={`/details/${encodeURIComponent(area)}`} asChild>
            <AreaCard
              area={area}
              progress={calcAreaProgress(todos[area] || [])}
              overdue={hasOverdue(todos[area] || [])}
            />
          </Link>
        )}
      />
    </AppLayout>
  );
}

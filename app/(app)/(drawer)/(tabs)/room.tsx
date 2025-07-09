import { Link } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AppLayout from '@/components/UI/AppLayout';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import MyTasksCard from '../../../../components/MyTasksCard';
import WishlistCard from '../../../../components/WishlistCard';

export default function RoomScreen() {
  const { user, userDoc } = useSession();
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const userId = userDoc?.uid;
  const displayName = user?.displayName || userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) setMyTasks(snap.data().myTasks || []);
    };
    fetch();
  }, [userId]);

  function calcProgress(tasks: any[]): number {
    if (!tasks?.length) return 1;
    const notChecked = tasks.filter(t => !t.checked);
    if (!notChecked.length) return 1;
    const now = Date.now();
    return (
      notChecked.reduce((acc, t) => {
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

  return (
    <AppLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Your Room</Text>
        <Text style={styles.sub}>Welcome, {displayName}</Text>
        <View style={styles.cards}>
          <Link href="/details/mytasks" asChild>
            <MyTasksCard progress={calcProgress(myTasks)} />
          </Link>
          <Link href="/details/wishlist" asChild>
            <WishlistCard />
          </Link>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  cards: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 34, // separacion entre tarjetas
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 28,
  },
  sub: {
    color: '#666',
    fontSize: 16,
    marginBottom: 36,
  },
  title: {
    color: '#0a7ea4',
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 24,
  },
});

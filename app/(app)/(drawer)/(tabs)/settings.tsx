import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';

type Member = { uid: string; name: string };

export default function HouseSettingsScreen() {
  const { user, userDoc } = useSession();
  const [home, setHome] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Fetch home data using user's homeId
  useEffect(() => {
    const fetchHome = async () => {
      if (!userDoc?.homeId) {
        setHome(null);
        setMembers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const homeRef = doc(db, 'homes', userDoc.homeId);
      const homeSnap = await getDoc(homeRef);
      if (homeSnap.exists()) {
        setHome(homeSnap.data());
        // Fetch member names
        const memberUIDs = homeSnap.data().members || [];
        const memberDocs = await Promise.all(
          memberUIDs.map(async (uid: string) => {
            const userSnap = await getDoc(doc(db, 'users', uid));
            return { name: userSnap.exists() ? userSnap.data().name || userSnap.data().displayName || uid : uid, uid };
          }),
        );
        setMembers(memberDocs);
      } else {
        setHome(null);
        setMembers([]);
      }
      setLoading(false);
    };
    fetchHome();
  }, [userDoc?.homeId]);

  if (!userDoc?.homeId || loading) {
    return (
      <View style={styles.center}>
        {loading ? <ActivityIndicator size="large" color="#0a7ea4" /> : <Text>No Home joined yet.</Text>}
      </View>
    );
  }

  // Handle Leave or Delete home
  const handleLeaveHome = async () => {
    setLeaving(true);
    const homeRef = doc(db, 'homes', userDoc.homeId);
    const homeSnap = await getDoc(homeRef);

    if (!homeSnap.exists()) {
      setLeaving(false);
      return;
    }
    const homeData = homeSnap.data();
    const memberUIDs: string[] = homeData.members || [];
    const isLastMember = memberUIDs.length <= 1;

    if (isLastMember) {
      Alert.alert(
        'Delete Home',
        'You are the last member of this home. If you leave, it will be deleted.\nAre you sure?',
        [
          { onPress: () => setLeaving(false), style: 'cancel', text: 'Cancel' },
          {
            onPress: async () => {
              await deleteDoc(homeRef);
              await updateDoc(doc(db, 'users', user.uid), { homeId: '' });
              setLeaving(false);
              router.replace('/HomeSelection');
            },
            style: 'destructive',
            text: 'Leave and Delete',
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'Leave Home',
        'Are you sure you want to leave this home?',
        [
          { onPress: () => setLeaving(false), style: 'cancel', text: 'Cancel' },
          {
            onPress: async () => {
              // Remove user from home's member array
              const newMembers = memberUIDs.filter((uid: string) => uid !== user.uid);
              await updateDoc(homeRef, { members: newMembers });
              await updateDoc(doc(db, 'users', user.uid), { homeId: '' });
              setLeaving(false);
              router.replace('/HomeSelection');
            },
            style: 'destructive',
            text: 'Yes, leave',
          },
        ],
        { cancelable: false },
      );
    }
  };

  const goToAreaSelector = () => {
    router.push('../../AreaSelector'); // Cambia la ruta si tu selector de áreas es otra
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff', flex: 1 }} contentContainerStyle={{ padding: 26 }}>
      {/* House Name */}
      <Text style={styles.houseName}>{home?.name || 'Home'}</Text>
      {/* Join Code */}
      <Text style={styles.joinCode}>#{home?.joinCode || ''}</Text>
      {/* Members */}
      <Text style={styles.sectionTitle}>Members</Text>
      <View style={styles.membersList}>
        {members.length === 0 ? (
          <Text style={styles.member}>No members yet.</Text>
        ) : (
          members.map(({ name, uid }, i) => (
            <Text key={uid} style={styles.member}>
              {name}
              {uid === user.uid ? ' (You)' : ''}
            </Text>
          ))
        )}
      </View>

      {/* Area Selector Button */}
      <TouchableOpacity style={styles.areaSelectorBtn} onPress={goToAreaSelector}>
        <Text style={{ color: '#0a7ea4', fontSize: 16, fontWeight: 'bold' }}>Home Area Selector</Text>
      </TouchableOpacity>

      {/* Leave Home Button */}
      <TouchableOpacity style={styles.leaveBtn} onPress={leaving ? undefined : handleLeaveHome} disabled={leaving}>
        <Text style={styles.leaveBtnText}>{leaving ? 'Leaving...' : 'Leave Home'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  areaSelectorBtn: {
    alignItems: 'center',
    backgroundColor: '#eaf9fd',
    borderRadius: 12,
    elevation: 0.5,
    marginBottom: 32,
    padding: 14,
  },
  center: { alignItems: 'center', backgroundColor: '#fff', flex: 1, justifyContent: 'center' },
  houseName: {
    color: '#0a7ea4',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  joinCode: {
    color: '#888',
    fontSize: 16,
    letterSpacing: 1.5,
    marginBottom: 26,
    textAlign: 'center',
  },
  leaveBtn: {
    alignItems: 'center',
    backgroundColor: '#ff4747',
    borderRadius: 12,
    marginTop: 24,
    padding: 14,
  },
  leaveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  member: {
    color: '#444',
    fontSize: 15,
    paddingVertical: 3,
  },
  membersList: {
    backgroundColor: '#fafcff',
    borderRadius: 10,
    marginBottom: 32,
    padding: 16,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

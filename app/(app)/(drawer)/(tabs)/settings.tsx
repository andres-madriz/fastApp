import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { useSession } from '../../../../contexts';
import { db } from '../../../../lib/firebase-config';
import AppLayout from '../../../../components/UI/AppLayout';

type Member = { uid: string; name: string };

export default function HouseSettingsScreen() {
  const { user, userDoc } = useSession();
  const [home, setHome] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

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
            return {
              name: userSnap.exists()
                ? userSnap.data().name || userSnap.data().displayName || uid
                : uid,
              uid,
            };
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
    router.push('../../AreaSelector');
  };

  return (
  <AppLayout>
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* House Name & Join Code */}
          <View style={styles.topSection}>
            <Text style={styles.houseName}>{home?.name || 'Home'}</Text>
            <Text style={styles.joinCode}>
              Join code: <Text style={styles.codeText}>#{home?.joinCode || ''}</Text>
            </Text>
          </View>

          {/* Members Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Members</Text>
            <View style={styles.membersList}>
              {members.length === 0 ? (
                <Text style={styles.member}>No members yet.</Text>
              ) : (
                members.map(({ name, uid }) => (
                  <Text key={uid} style={styles.member}>
                    {name}
                    {uid === user.uid ? ' (You)' : ''}
                  </Text>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions - OUTSIDE scroll, always visible */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.areaSelectorBtn} onPress={goToAreaSelector}>
            <Text style={styles.areaSelectorText}>Home Area Selector</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leaveBtn}
            onPress={leaving ? undefined : handleLeaveHome}
            disabled={leaving}
          >
            <Text style={styles.leaveBtnText}>{leaving ? 'Leaving...' : 'Leave Home'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </AppLayout>
);

}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '',
  },
  scrollContent: {
    padding: 0,
    paddingBottom: 30,
    minHeight: '100%',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 46,
    marginBottom: 26,
  },
  houseName: {
    color: '#0a7ea4',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 5,
    textAlign: 'center',
  },
  joinCode: {
    color: '#222',
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.8,
  },
  codeText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#f6fafe',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 32,
    elevation: 1,
    shadowColor: '#0a7ea4',
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  sectionTitle: {
    color: '#1a3344',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  membersList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  member: {
    color: '#3b4668',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 3,
  },
  bottomButtons: {
  paddingHorizontal: 0,
  paddingBottom: 70,      // Add a gap from the bottom (adjust as needed)
  width: '100%',
  alignItems: 'center',
  backgroundColor: '',
},
  areaSelectorBtn: {
    alignItems: 'center',
    backgroundColor: '#eaf9fd',
    borderRadius: 12,
    marginBottom: 22,
    padding: 15,
    width: '92%',
    elevation: 1,
  },
  areaSelectorText: {
    color: '#0a7ea4',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  leaveBtn: {
    alignItems: 'center',
    backgroundColor: '#ff4747',
    borderRadius: 12,
    marginTop: 6,
    padding: 16,
    width: '92%',
    elevation: 2,
  },
  leaveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  center: { alignItems: 'center', backgroundColor: '#fff', flex: 1, justifyContent: 'center' },
});


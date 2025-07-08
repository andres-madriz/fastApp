import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import AvatarPicker from '../../../components/AvatarPicker';
import SettingsList from '../../../components/SettingsList';

export default function ProfileScreen() {
  const { signOut, user, userDoc } = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userId = userDoc?.uid;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load avatar
  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) setAvatarUrl(snap.data().profileImage || null);
    };
    fetch();
  }, [userId]);

  const displayName = user?.displayName || userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');

  // Handle Delete Account
  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure? This cannot be undone.', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          /* TODO: your delete logic */
        },
        style: 'destructive',
        text: 'Delete',
      },
    ]);
  };

  const handleNotificationMode = () => {
    Alert.alert('Notifications', 'Choose your notification mode (feature coming soon).');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 14 }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginBottom: 8, marginTop: 14 }}>
        <AvatarPicker userId={userId} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <SettingsList
        onLogout={signOut}
        onDeleteAccount={handleDeleteAccount}
        onNotificationMode={handleNotificationMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#e6f6fb',
    borderRadius: 9,
    elevation: 1,
    left: 10,
    paddingHorizontal: 13,
    paddingVertical: 6,
    position: 'absolute',
    top: 18,
    zIndex: 99,
  },
  backButtonText: {
    color: '#0a7ea4',
    fontSize: 15,
    fontWeight: 'bold',
  },
  displayName: {
    color: '#0a7ea4',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    color: '#555',
    fontSize: 15,
    marginBottom: 3,
  },
  safeArea: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 18,
  },
});

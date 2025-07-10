import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import AppLayout from '../../../components/UI/AppLayout';
import AvatarPicker from '../../../components/AvatarPicker';

export default function ProfileScreen() {
  const { signOut, user, userDoc } = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userId = userDoc?.uid;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notifIntense, setNotifIntense] = useState(false);

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

  const displayName =
    user?.displayName ||
    userDoc?.name ||
    (user?.email ? user.email.split('@')[0] : 'Guest');

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

  const handleToggleNotifications = () => {
    setNotifIntense(v => !v);
    // TODO: Persist this preference if needed
  };

  return (
    <AppLayout>
      <View style={{ flex: 1, backgroundColor: '#e5e7eb' }}>
        {/* Back Button */}
        <TouchableOpacity
          style={[
            styles.backButton,
            { top: insets.top + 12 },
          ]}
          onPress={() => router.replace('../(drawer)/(tabs)/')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: 36,
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 28,
          }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar and Info */}
          <View style={styles.avatarCard}>
            <AvatarPicker userId={userId} avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          {/* Settings Buttons */}
          <View style={styles.settingsSection}>
            <SettingsButton
              label="Intense Notifications"
              rightElement={
                <Switch
                  value={notifIntense}
                  onValueChange={handleToggleNotifications}
                  thumbColor={notifIntense ? '#0a7ea4' : '#fff'}
                  trackColor={{ false: '#d1e8ef', true: '#7bd8ef' }}
                  ios_backgroundColor="#d1e8ef"
                  style={{ marginLeft: 8 }}
                />
              }
            />
            <SettingsButton
              label="Terms & Conditions"
              onPress={() => Alert.alert('Coming soon!')}
            />
            <SettingsButton
              label="Delete Account"
              onPress={handleDeleteAccount}
              style={{ backgroundColor: '#ffe5e5' }}
              textStyle={{ color: '#e11d48', fontWeight: '700' }}
            />
            <SettingsButton
              label="Logout"
              onPress={signOut}
              style={{ backgroundColor: '#eaf6fb', marginTop: 18 }}
              textStyle={{ color: '#0a7ea4', fontWeight: 'bold' }}
            />
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
}

// --- SettingsButton Component ---
function SettingsButton({
  label,
  onPress,
  style,
  textStyle,
  rightElement,
}: {
  label: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  rightElement?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[
        styles.settingsBtn,
        style,
        // narrower button
        { alignSelf: 'center', width: '92%', marginVertical: 7 },
      ]}
    >
      <Text style={[styles.settingsBtnText, textStyle]}>{label}</Text>
      {rightElement && <View style={{ marginLeft: 'auto' }}>{rightElement}</View>}
    </TouchableOpacity>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#e6f6fb',
    borderRadius: 9,
    elevation: 1,
    left: 10,
    paddingHorizontal: 13,
    paddingVertical: 6,
    position: 'absolute',
    zIndex: 99,
  },
  backButtonText: {
    color: '#0a7ea4',
    fontSize: 15,
    fontWeight: 'bold',
  },
  avatarCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 19,
    elevation: 2,
    marginBottom: 24,
    marginTop: 8,
    paddingBottom: 18,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 7,
    width: '92%',
    alignSelf: 'center',
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
  settingsSection: {
    width: '100%',
    marginTop: 14,
    alignItems: 'center',
  },
  settingsBtn: {
    backgroundColor: '#fff',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 22,
    justifyContent: 'flex-start',
    marginBottom: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
  settingsBtnText: {
    color: '#222f44',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
});

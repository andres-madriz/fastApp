import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';

import { useSession } from '../contexts'; // Adjust path if needed

// This could be replaced with a real avatar URL from the user profile
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=E6F6FB&color=0a7ea4&rounded=true&size=64';

export default function FloatingAvatarButton() {
  const router = useRouter();
  const { userDoc } = useSession();
  const avatar = userDoc?.photoURL || defaultAvatar;
  const name = userDoc?.name || 'User';

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/details/profile')}
      activeOpacity={0.86}
      accessibilityLabel="Open user profile"
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
      </View>
      {/* Optional: Show initials or icon if no photo */}
      {!userDoc?.photoURL && <Text style={styles.initials}>{name.charAt(0).toUpperCase()}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: '#e6f6fb',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 44,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: '#e6f6fb',
    borderRadius: 26,
    elevation: 7,
    height: 52,
    justifyContent: 'center',
    position: 'absolute',
    right: 26,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    top: 32,
    width: 52,
    zIndex: 25,
  },
  initials: {
    color: '#0a7ea4',
    fontSize: 23,
    fontWeight: 'bold',
    left: 0,
    letterSpacing: 1,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 12,
  },
});

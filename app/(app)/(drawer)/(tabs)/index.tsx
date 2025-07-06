import React from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { useSession } from '../../../../contexts';
import AreaCard from '../../../../components/AreaCard';

export default function TabsIndexScreen() {
  const { signOut, user, userDoc } = useSession();
  const selectedAreas: string[] = userDoc?.selectedAreas || ['kitchen', 'bathroom', 'living room'];
  const displayName = user?.displayName || userDoc?.name || (user?.email ? user.email.split('@')[0] : 'Guest');
  const router = useRouter();

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
            <AreaCard area={area} />
          </Link>
        )}
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

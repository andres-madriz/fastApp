import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert } from 'react-native';

import { setUserHome } from '../lib/user';
import { auth } from '../lib/firebase-config';
import { createHome, findHomeByCode, joinHome } from '../lib/firestore';

export default function HomeSelection() {
  const [joinCode, setJoinCode] = useState('');
  const [homeName, setHomeName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Create home
  async function handleCreate() {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !homeName.trim()) return;
      const homeId = await createHome(userId, homeName.trim());
      await setUserHome(userId, homeId);
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  // Join home
  async function handleJoin() {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !joinCode.trim()) return;
      const home = await findHomeByCode(joinCode.trim().toUpperCase());
      if (!home) throw new Error('Home not found!');
      await joinHome(userId, home.id);
      await setUserHome(userId, home.id);
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Welcome! Join or Create a Home</Text>
      <View style={{ marginBottom: 40 }}>
        <Text style={{ marginBottom: 6 }}>Join Home (enter code):</Text>
        <TextInput
          placeholder="Join code"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
          style={{ borderColor: '#ccc', borderRadius: 8, borderWidth: 1, marginBottom: 8, padding: 10 }}
        />
        <Button title="Join Home" onPress={handleJoin} disabled={loading} />
      </View>
      <View>
        <Text style={{ marginBottom: 6 }}>Or create a new home:</Text>
        <TextInput
          placeholder="Home name"
          value={homeName}
          onChangeText={setHomeName}
          style={{ borderColor: '#ccc', borderRadius: 8, borderWidth: 1, marginBottom: 8, padding: 10 }}
        />
        <Button title="Create Home" onPress={handleCreate} disabled={loading} />
      </View>
    </View>
  );
}

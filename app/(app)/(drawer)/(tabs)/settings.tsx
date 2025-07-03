import React from 'react';
import { signOut } from 'firebase/auth';
import { View, Text, Button } from 'react-native';

import { auth } from '@/lib/firebase-config';

export default function SettingsScreen() {
  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Settings</Text>
      <Button title="Sign Out" onPress={() => signOut(auth)} />
    </View>
  );
}

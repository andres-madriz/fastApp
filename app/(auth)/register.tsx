import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, Button, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../config/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      {error ? <Text>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => router.push('/(auth)/login')} />
    </View>
  );
}

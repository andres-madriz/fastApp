import { signOut } from 'firebase/auth';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, Text, View, Pressable } from 'react-native';

import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/useAuth';
import ToggleTheme from '../../components/ToggleTheme';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 pt-2 items-center justify-start bg-white dark:bg-black">
      <Text className="text-xl font-bold text-dark dark:text-white">Settings</Text>

      {/* SIGNED IN EMAIL */}
      {user && <Text className="text-sm mt-2 text-gray-500 dark:text-neutral-300">Signed in as {user.email}</Text>}

      {/* THEME SETTINGS */}
      <View className="flex w-full items-center justify-center my-10" style={{ gap: 2 }}>
        <Text className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4">Theme Settings</Text>
        <ToggleTheme colorScheme={colorScheme} setColorScheme={setColorScheme} theme="light" />
        <ToggleTheme colorScheme={colorScheme} setColorScheme={setColorScheme} theme="dark" />
      </View>

      {/* SIGN OUT BUTTON */}
      <Pressable
        onPress={() => signOut(auth)}
        className="mt-6 px-6 py-3 bg-red-500 rounded-lg"
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </Pressable>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}

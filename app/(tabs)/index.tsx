import { View, Text } from 'react-native';

import { useAuth } from '../../contexts/useAuth';
import { ExternalLink } from '../../components/ExternalLink';

export default function TabOneScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-dark dark:text-white">Home</Text>
      {user && <Text className="mt-2 text-sm text-gray-500 dark:text-neutral-300">Signed in as {user.email}</Text>}
      <Text className="text-xs font-mono text-dark dark:text-white mt-4">
        Text with custom font (SpaceMono x NativeWind)
      </Text>
      <View className="h-[1px] w-4/5 my-8 bg-[#eee] dark:bg-zinc-900" />
      <View className="mt-2 mx-5 items-center">
        <ExternalLink href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text className="text-center text-blue-500 dark:text-white">
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

import { Colors } from '../../../../constants/Colors'; // Use default import if your Colors file uses `export default`

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={24} color="black" />
          </Pressable>
        ),
        headerShown: true,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="room"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />,
          title: 'Room',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />,
          title: 'Groceries',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

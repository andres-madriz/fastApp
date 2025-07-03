import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // or your icon library
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

/**
 * TabLayout manages the bottom tab navigation while integrating with a drawer menu.
 * This layout serves as a nested navigation setup where:
 * - The drawer navigation is the parent (defined in the parent layout)
 * - The tab navigation is nested inside the drawer
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        /**
         * Add hamburger menu button to all tab headers by default
         * This is placed in screenOptions to avoid repetition across screens
         * Each screen can override this by setting headerLeft: () => null
         */
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={24} color="black" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          // Override to remove menu button for this specific screen
          headerLeft: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}

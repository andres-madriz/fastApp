import React from 'react';
import { Tabs } from 'expo-router';

import CustomTabBar from '../../../../components/CustomTabBar'; // adjust path as needed

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false, // <-- This hides the header!
        // ...other options
      }}
    >
      <Tabs.Screen name="room" options={{ title: 'Room' }} />
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="groceries" options={{ title: 'List' }} />
      <Tabs.Screen name="settings" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

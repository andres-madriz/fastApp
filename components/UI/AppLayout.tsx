// components/UI/AppLayout.tsx
import React from 'react';
import { SafeAreaView, View } from 'react-native';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e5e7eb' }} className="flex-1 bg-bg">
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}

import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';

type Props = {
  uri?: string | null;
  initials?: string;
  onPress?: () => void;
  size?: number;
};

export default function AvatarButton({ initials, onPress, size = 50, uri }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.avatarButton, { borderRadius: size / 2, height: size, width: size }]}
      activeOpacity={0.7}
    >
      {uri ? (
        <Image source={{ uri }} style={{ borderRadius: size / 2, height: size, width: size }} resizeMode="cover" />
      ) : (
        <View style={[styles.placeholder, { borderRadius: size / 2, height: size, width: size }]}>
          <Text style={{ color: '#0a7ea4', fontSize: size / 2, fontWeight: 'bold' }}>{initials || '?'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 2,
    elevation: 4,
    justifyContent: 'center',
    position: 'absolute',
    right: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    top: 38, // or adjust with SafeArea
    zIndex: 22,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },
});

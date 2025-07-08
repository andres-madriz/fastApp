import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { db } from '../lib/firebase-config';
import { uploadFileToCloudinary } from '../lib/cloudinary';

export default function AvatarPicker({
  avatarUrl,
  onAvatarChange,
  userId,
}: {
  userId: string;
  avatarUrl: string | null;
  onAvatarChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  // Optionally show immediately after picking
  useEffect(() => {
    setLocalImage(null);
  }, [avatarUrl]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length) {
      const asset = result.assets[0];
      setLocalImage(asset.uri);
      setUploading(true);
      const upload = await uploadFileToCloudinary({ uri: asset.uri }, 'avatars');
      setUploading(false);
      if (upload.success && upload.data) {
        await updateDoc(doc(db, 'users', userId), { profileImage: upload.data });
        onAvatarChange(upload.data);
      } else {
        Alert.alert('Upload failed', upload.msg || 'Try again.');
      }
    }
  };

  const imageSrc = localImage || avatarUrl || require('../assets/images/defaultAvatar.png');

  return (
    <View style={styles.avatarWrap}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarTouchable}>
        <Image source={typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc} style={styles.avatar} />
        {uploading && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { borderColor: '#0a7ea4', borderRadius: 60, borderWidth: 3, height: 108, width: 108 },
  avatarTouchable: { borderRadius: 60, overflow: 'hidden' },
  avatarWrap: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 60,
    justifyContent: 'center',
  },
});

import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';

import { useSession } from '../../contexts';
import { db } from '../../lib/firebase-config';
import AppLayout from '../../components/UI/AppLayout';

const ALL_AREAS = ['kitchen', 'bathroom', 'living room', 'bedroom', 'garden', 'garage', 'laundry'];

// Custom Switch
function CustomSwitch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  // For a smooth thumb animation
  const animated = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: value ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={[
        switchStyles.switch,
        { backgroundColor: value ? '#0a7ea4' : '#e5e7eb' },
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          switchStyles.thumb,
          {
            left: animated.interpolate({
              inputRange: [0, 1],
              outputRange: [2, 30],
            }),
            backgroundColor: value ? '#fff' : '#cbd5e1',
            shadowOpacity: value ? 0.17 : 0.08,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

export default function AreaSelectorScreen() {
  const { userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!homeId) return;
    (async () => {
      const ref = doc(db, 'homes', homeId);
      const snap = await getDoc(ref);
      if (snap.exists()) setSelected(snap.data().selectedAreas || []);
      setLoading(false);
    })();
  }, [homeId]);

  async function toggleArea(area: string) {
    if (!homeId) return;
    let newSelected;
    if (selected.includes(area)) {
      newSelected = selected.filter(a => a !== area);
    } else {
      newSelected = [...selected, area];
    }
    setSelected(newSelected);
    await updateDoc(doc(db, 'homes', homeId), { selectedAreas: newSelected });
  }

  if (loading)
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color="#0a7ea4" size="large" />
      </View>
    );

  return (
    <AppLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Select visible areas</Text>
        <FlatList
          data={ALL_AREAS}
          keyExtractor={item => item}
          renderItem={({ item: area }) => {
            const enabled = selected.includes(area);
            return (
              <View style={[styles.areaItem]}>
                <CustomSwitch value={enabled} onValueChange={() => toggleArea(area)} />
                <View
                  style={[
                    styles.areaPill,
                    enabled ? styles.pillActive : styles.pillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.areaText,
                      enabled ? styles.areaTextActive : styles.areaTextInactive,
                    ]}
                  >
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/settings')}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  areaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 18,
    width: '100%',
  },
  areaPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginLeft: 14,
    minWidth: 105,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  pillActive: {
    backgroundColor: '#e5f6fd',
    borderColor: '#0a7ea4',
    borderWidth: 1.5,
  },
  pillInactive: {
    backgroundColor: '#f6faff',
    borderColor: '#cbd5e1',
    borderWidth: 1.2,
  },
  areaText: {
    fontSize: 18,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  areaTextActive: {
    color: '#0a7ea4',
    fontWeight: '700',
  },
  areaTextInactive: {
    color: '#64748b',
    fontWeight: '500',
  },
  backBtn: {
    alignSelf: 'center',
    backgroundColor: '#eaf6fa',
    borderRadius: 6,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  backBtnText: { color: '#0a7ea4', fontSize: 16, fontWeight: '600' },
  container: { backgroundColor: '#', flex: 1, padding: 20, paddingTop: 44 },
  title: {
    color: '#0a7ea4',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
});

// Switch styles
const switchStyles = StyleSheet.create({
  switch: {
    width: 52,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 2,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    backgroundColor: '#fff',
    elevation: 3,
  },
});

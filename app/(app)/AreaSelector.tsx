import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import { useSession } from '../../contexts';
import { db } from '../../lib/firebase-config';

const ALL_AREAS = ['kitchen', 'bathroom', 'living room', 'bedroom', 'garden', 'garage', 'laundry'];

export default function AreaSelectorScreen() {
  const { userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get selectedAreas from the HOME doc (not user)
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
    // Update in Firestore immediately
    await updateDoc(doc(db, 'homes', homeId), { selectedAreas: newSelected });
  }

  if (loading)
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color="#0a7ea4" size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select visible areas</Text>
      <FlatList
        data={ALL_AREAS}
        keyExtractor={item => item}
        renderItem={({ item: area }) => (
          <TouchableOpacity
            style={[styles.areaItem, selected.includes(area) && styles.selectedArea]}
            onPress={() => toggleArea(area)}
          >
            <View style={[styles.checkbox, selected.includes(area) && styles.checkboxChecked]}>
              {selected.includes(area) && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={[styles.areaText, selected.includes(area) && styles.selectedAreaText]}>
              {area.charAt(0).toUpperCase() + area.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/settings')}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  areaItem: {
    alignItems: 'center',
    backgroundColor: '#f6faff',
    borderRadius: 9,
    flexDirection: 'row',
    marginBottom: 13,
    padding: 16,
  },
  areaText: { color: '#1e293b', fontSize: 18, marginLeft: 8 },
  backBtn: {
    alignSelf: 'center',
    backgroundColor: '#eaf6fa',
    borderRadius: 6,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  backBtnText: { color: '#0a7ea4', fontSize: 16, fontWeight: '600' },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#0a7ea4',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxChecked: { backgroundColor: '#0a7ea4' },
  checkboxMark: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  container: { backgroundColor: '#fff', flex: 1, padding: 20, paddingTop: 44 },
  selectedArea: { backgroundColor: '#e5f6fd' },
  selectedAreaText: { color: '#0a7ea4', fontWeight: 'bold' },
  title: { color: '#0a7ea4', fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' },
});

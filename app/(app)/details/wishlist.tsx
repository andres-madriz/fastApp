import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import AppLayout from '../../../components/UI/AppLayout'; // Usa tu layout base

// Wishlist item type
type WishlistItem = {
  id: string;
  name: string;
  checked: boolean;
};

export default function WishlistScreen() {
  const { userDoc } = useSession();
  const router = useRouter();
  const userId = userDoc?.uid;
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');

  // Fetch wishlist from Firestore
  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) setItems(snap.data().wishlist || []);
      setLoading(false);
    };
    fetch();
  }, [userId]);

  // Update Firestore and local state
  const updateItems = async (newItems: WishlistItem[]) => {
    setItems(newItems);
    if (userId) {
      await updateDoc(doc(db, 'users', userId), {
        wishlist: newItems,
      });
    }
  };

  const handleAdd = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const item: WishlistItem = {
      checked: false,
      id: Date.now().toString(),
      name: trimmed,
    };
    updateItems([...items, item]);
    setNewItem('');
  };

  const handleToggle = (id: string) => {
    updateItems(items.map(item => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const handleDelete = (id: string) => {
    updateItems(items.filter(item => item.id !== id));
  };

  return (
    <AppLayout>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add to wishlist"
            value={newItem}
            onChangeText={setNewItem}
            style={styles.input}
            onSubmitEditing={() => handleAdd(newItem)}
          />
          <Button title="Add" onPress={() => handleAdd(newItem)} />
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <TouchableOpacity
                  onPress={() => handleToggle(item.id)}
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: item.checked ? '#0a7ea4' : '#fff',
                      borderColor: '#0a7ea4',
                    },
                  ]}
                >
                  {item.checked && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: item.checked ? '#9BA1A6' : '#11181C',
                      textDecorationLine: item.checked ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtn}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#e6f6fb',
    borderRadius: 8,
    elevation: 2,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
    zIndex: 9,
  },
  backButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    marginRight: 10,
    width: 28,
  },
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    flex: 1,
    margin: 12,
    marginTop: 54, // leaves space for the back button
    padding: 18,
  },
  deleteBtn: { fontSize: 18, marginLeft: 8 },
  input: {
    borderColor: '#eee',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    padding: 10,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
});

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import AppLayout from '../../../components/UI/AppLayout';

import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import CustomCheckbox from '../../../components/CustomCheckbox';

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

  // Inline editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

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

  // Inline edit
  const startEdit = (item: WishlistItem) => {
    setEditingId(item.id);
    setEditingValue(item.name);
  };
  const saveEdit = (id: string) => {
    if (editingValue.trim()) {
      updateItems(items.map(item => (item.id === id ? { ...item, name: editingValue.trim() } : item)));
    }
    setEditingId(null);
    setEditingValue('');
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  // -- IMAGE require calls
  const editImg = require('../../../assets/images/edit.png');
  const deleteImg = require('../../../assets/images/delete.png');
  const checkImg = require('../../../assets/images/check.png');
  const closeImg = require('../../../assets/images/close.png');

  return (
    <AppLayout>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.inputRow}>
          <CustomInput
            placeholder="Add to wishlist"
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={() => handleAdd(newItem)}
          />
          <CustomButton title="Add" onPress={() => handleAdd(newItem)} />
        </View>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <CustomCheckbox checked={item.checked} onToggle={() => handleToggle(item.id)} />
                {editingId === item.id ? (
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <CustomInput
                      value={editingValue}
                      onChangeText={setEditingValue}
                      style={{
                        flex: 1,
                        marginRight: 5,
                        minWidth: 40,
                        borderWidth: 2,
                        borderColor: '#0a7ea4',
                        borderRadius: 8,
                        /* backgroundColor: '#e6f6fb', */
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                      }}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={() => saveEdit(item.id)}
                      style={[styles.iconBtn, styles.greenOutline]}
                    >
                      <Image source={checkImg} style={styles.icon} resizeMode="contain" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelEdit}
                      style={[styles.iconBtn, styles.redOutline]}
                    >
                      <Image source={closeImg} style={styles.icon} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
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
                    <TouchableOpacity
                      style={[styles.iconBtn/* , { borderColor: '#eab308' } */]}
                      onPress={() => startEdit(item)}
                    >
                      <Image source={editImg} style={styles.icon} resizeMode="contain" />
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={[styles.iconBtn, styles.redOutline]} onPress={() => handleDelete(item.id)}>
                  <Image source={deleteImg} style={styles.icon} resizeMode="contain" />
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
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    flex: 1,
    margin: 12,
    marginTop: 54,
    padding: 18,
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
  iconBtn: {
    padding: 4,
    borderWidth: 2,
    borderRadius: 7,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  greenOutline: {
    borderColor: '#16a34a',
  },
  redOutline: {
    borderColor: '#ef4444',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
});

